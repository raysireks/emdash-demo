import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "output");

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

function urlToSlug(url) {
  return url
    .replace(/https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  await mkdir(join(OUTPUT_DIR, "html"), { recursive: true });
  await mkdir(join(OUTPUT_DIR, "screenshots", "desktop"), { recursive: true });
  await mkdir(join(OUTPUT_DIR, "screenshots", "mobile"), { recursive: true });

  const urlListData = await readFile(join(OUTPUT_DIR, "urls.txt"), "utf-8");
  const queue = urlListData.split("\n").map(u => u.trim()).filter(Boolean);

  const browser = await chromium.launch({ headless: true });

  console.log(`\n🔍 Starting sitemap-based crawl of ${queue.length} URLs...\n`);

  const visited = new Set();
  
  while (queue.length > 0) {
    const url = queue.shift();
    const normalizedUrl = url.replace(/\/$/, "");
    if (visited.has(normalizedUrl)) continue;
    visited.add(normalizedUrl);

    const slug = urlToSlug(normalizedUrl);
    console.log(`📄 Crawling [${visited.size}/${visited.size + queue.length}]: ${normalizedUrl}`);

    const context = await browser.newContext({
      viewport: VIEWPORTS.desktop,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();
    try {
      await page.goto(normalizedUrl, { waitUntil: "networkidle", timeout: 30_000 });
      
      // Save HTML
      const html = await page.content();
      await writeFile(join(OUTPUT_DIR, "html", `${slug}.html`), html, "utf-8");

      // Screenshots
      await page.screenshot({
        path: join(OUTPUT_DIR, "screenshots", "desktop", `${slug}.png`),
        fullPage: true,
      });
      console.log(`  ✅ Data & Desktop Screenshot saved`);

      // Mobile Screenshot
      const mobileCtx = await browser.newContext({
        viewport: VIEWPORTS.mobile,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      });
      const mobilePage = await mobileCtx.newPage();
      await mobilePage.goto(normalizedUrl, { waitUntil: "networkidle", timeout: 30_000 });
      await mobilePage.screenshot({
        path: join(OUTPUT_DIR, "screenshots", "mobile", `${slug}.png`),
        fullPage: true,
      });
      console.log(`  📱 Mobile Screenshot saved`);
      await mobileCtx.close();

    } catch (err) {
      console.error(`  ❌ Error crawling ${normalizedUrl}: ${err.message}`);
    }
    
    await context.close();
    
    // Polite delay
    await new Promise(r => setTimeout(r, 1000));
  }

  await browser.close();
  console.log(`\n✅ Full discovery crawl complete. Total pages visited: ${visited.size}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
