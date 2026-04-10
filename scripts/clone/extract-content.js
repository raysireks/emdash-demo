/**
 * extract-content.js — Parse crawled HTML into structured content JSON
 *
 * For each HTML file in output/html/, extracts:
 *   - Page title, meta description, canonical URL
 *   - H1–H3 headings
 *   - Body paragraphs
 *   - Navigation links
 *   - Practice area links / internal links
 *   - Contact info (phone, address, email patterns)
 *
 * Outputs one JSON file per page to output/content/
 *
 * Usage: node extract-content.js  (run after crawl.js)
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML_DIR = join(__dirname, "output", "html");
const CONTENT_DIR = join(__dirname, "output", "content");

// ─── Simple HTML → text helpers (no external deps) ──────────────────────────

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function extractMeta(html, name) {
  const m =
    html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i")) ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i"));
  return m ? m[1].trim() : null;
}

function extractOGMeta(html, prop) {
  const m =
    html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i")) ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, "i"));
  return m ? m[1].trim() : null;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? stripTags(m[1]) : null;
}

function extractByTag(html, tag) {
  const results = [];
  const re = new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, "gi");
  for (const [, inner] of html.matchAll(re)) {
    const text = stripTags(inner).trim();
    if (text.length > 2) results.push(text);
  }
  return results;
}

function extractParagraphs(html) {
  // Strip nav/header/footer first to avoid noise
  const body = html
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "");
  return extractByTag(body, "p").filter((p) => p.length > 30);
}

function extractLinks(html) {
  const links = [];
  for (const [, href, label] of html.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = stripTags(label).trim();
    if (text && href && !href.startsWith("javascript")) {
      links.push({ href, text });
    }
  }
  return links;
}

function extractPhones(text) {
  return [...new Set(text.match(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g) || [])];
}

function extractEmails(text) {
  return [...new Set(text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) || [])];
}

function extractAddress(text) {
  // Look for typical US address pattern
  const m = text.match(/\d+\s+[A-Za-z\s]+(?:St|Ave|Blvd|Dr|Rd|Way|Ln|Court|Ct|Suite|Ste)\.?\s*,?\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/i);
  return m ? m[0].trim() : null;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  await mkdir(CONTENT_DIR, { recursive: true });

  const files = (await readdir(HTML_DIR)).filter((f) => f.endsWith(".html"));
  console.log(`\n🔍 Extracting content from ${files.length} HTML files...\n`);

  const summary = [];

  for (const file of files) {
    const html = await readFile(join(HTML_DIR, file), "utf-8");
    const slug = basename(file, ".html");
    const fullText = stripTags(html);

    const content = {
      slug,
      title: extractTitle(html),
      metaDescription: extractMeta(html, "description"),
      ogTitle: extractOGMeta(html, "title"),
      ogDescription: extractOGMeta(html, "description"),
      ogImage: extractOGMeta(html, "image"),
      h1: extractByTag(html, "h1"),
      h2: extractByTag(html, "h2"),
      h3: extractByTag(html, "h3"),
      paragraphs: extractParagraphs(html),
      internalLinks: extractLinks(html).filter((l) =>
        l.href.includes("gocarverllc.com") || l.href.startsWith("/")
      ),
      externalLinks: extractLinks(html).filter(
        (l) => l.href.startsWith("http") && !l.href.includes("gocarverllc.com")
      ),
      contact: {
        phones: extractPhones(fullText),
        emails: extractEmails(fullText),
        address: extractAddress(fullText),
      },
    };

    const outPath = join(CONTENT_DIR, `${slug}.json`);
    await writeFile(outPath, JSON.stringify(content, null, 2), "utf-8");
    console.log(`  ✅ ${slug}.json — "${content.title || "(no title)"}"`);

    summary.push({
      slug,
      title: content.title,
      h1: content.h1[0] || null,
      paragraphCount: content.paragraphs.length,
      phones: content.contact.phones,
    });
  }

  await writeFile(
    join(CONTENT_DIR, "_summary.json"),
    JSON.stringify(summary, null, 2),
    "utf-8"
  );

  console.log(`\n✅ Done. Content extracted to output/content/`);
  console.log(`   Summary → output/content/_summary.json\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
