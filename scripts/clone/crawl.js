import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "output");

const SEED_URLS = [
  "https://gocarverllc.com/",
];

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

  const browser = await chromium.launch({ headless: true });

  const visited = new Set();
  const queue = [...SEED_URLS];

  console.log(`\n🔍 Starting crawl of ${SEED_URLS.length} seed URLs...\n`);

  while (queue.length > 0) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    const slug = urlToSlug(url);
    console.log(`📄 Crawling: ${url}`);

    const context = await browser.newContext({
      viewport: VIEWPORTS.desktop,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
      const html = await page.content();
      await writeFile(join(OUTPUT_DIR, "html", `${slug}.html`), html, "utf-8");
      console.log(`  ✅ HTML saved → output/html/${slug}.html`);

      await page.screenshot({
        path: join(OUTPUT_DIR, "screenshots", "desktop", `${slug}.png`),
        fullPage: true,
      });
      console.log(`  📸 Desktop screenshot saved`);
    } catch (err) {
      console.error(`  ❌ Error crawling ${url}: ${err.message}`);
    }
    await context.close();

    const mobileCtx = await browser.newContext({
      viewport: VIEWPORTS.mobile,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    const mobilePage = await mobileCtx.newPage();
    try {
      await mobilePage.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
      await mobilePage.screenshot({
        path: join(OUTPUT_DIR, "screenshots", "mobile", `${slug}.png`),
        fullPage: true,
      });
      console.log(`  📱 Mobile screenshot saved`);
    } catch (err) {
      console.error(`  ❌ Mobile screenshot failed: ${err.message}`);
    }
    await mobileCtx.close();
  }

  await browser.close();
  console.log(`\n✅ Crawl complete.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
