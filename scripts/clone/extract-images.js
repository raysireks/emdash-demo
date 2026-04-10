/**
 * extract-images.js — Download all images found in crawled HTML
 *
 * Reads all HTML files from output/html/, finds every <img src> and
 * CSS background-image URL, and downloads them to output/assets/.
 *
 * Usage: node extract-images.js  (run after crawl.js)
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";
import https from "https";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML_DIR = join(__dirname, "output", "html");
const ASSETS_DIR = join(__dirname, "output", "assets");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file = createWriteStream(dest);
    proto
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", reject);
  });
}

function extractUrls(html) {
  const urls = new Set();

  // <img src="..."> and <img srcset="...">
  for (const [, src] of html.matchAll(/\bsrc=["']([^"']+)["']/gi)) {
    if (/\.(jpe?g|png|gif|webp|svg|avif)(\?|$)/i.test(src)) {
      urls.add(src);
    }
  }

  // CSS background-image: url(...)
  for (const [, src] of html.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
    if (/\.(jpe?g|png|gif|webp|svg|avif)(\?|$)/i.test(src)) {
      urls.add(src);
    }
  }

  // Open Graph / Twitter card images
  for (const [, src] of html.matchAll(/content=["']([^"']+\.(jpe?g|png|gif|webp))["']/gi)) {
    urls.add(src);
  }

  return [...urls];
}

function toAbsolute(src, baseUrl = "https://gocarverllc.com") {
  if (src.startsWith("http")) return src;
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("/")) return `${baseUrl}${src}`;
  return `${baseUrl}/${src}`;
}

function safeFilename(url) {
  const raw = url.split("?")[0];
  const name = basename(raw).replace(/[^a-z0-9._-]/gi, "_");
  return name || `asset_${Date.now()}`;
}

async function main() {
  await mkdir(ASSETS_DIR, { recursive: true });

  const files = (await readdir(HTML_DIR)).filter((f) => f.endsWith(".html"));
  console.log(`\n🔍 Scanning ${files.length} HTML files for images...\n`);

  const allUrls = new Set();
  for (const file of files) {
    const html = await readFile(join(HTML_DIR, file), "utf-8");
    for (const url of extractUrls(html)) {
      allUrls.add(toAbsolute(url));
    }
  }

  console.log(`📦 Found ${allUrls.size} unique image URLs\n`);

  let success = 0;
  let fail = 0;

  for (const url of allUrls) {
    const filename = safeFilename(url);
    const dest = join(ASSETS_DIR, filename);
    process.stdout.write(`  ⬇️  ${filename} ... `);
    try {
      await download(url, dest);
      console.log("✅");
      success++;
    } catch (err) {
      console.log(`❌ (${err.message})`);
      fail++;
    }
    await sleep(300);
  }

  console.log(`\n✅ Done. ${success} downloaded, ${fail} failed.`);
  console.log(`   Assets → output/assets/\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
