/**
 * layout-audit.js — Pull the layout structure of gocarverllc.com using Playwright
 *
 * Visits each key page, extracts full layout data:
 *   - Header/nav structure
 *   - CSS colors (bg, text, borders) from computed styles
 *   - Section-by-section breakdown (tag, heading, text, CTAs)
 *   - Footer content
 *   - Font families
 *   - Screenshots (desktop + mobile)
 *
 * Outputs: output/layout/{slug}.json + output/screenshots/
 *
 * Usage: node layout-audit.js
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "output");

const PAGES = [
  // Core pages
  { slug: "home", url: "https://gocarverllc.com/" },
  { slug: "thomas-carver", url: "https://gocarverllc.com/thomas-carver/" },
  { slug: "contact", url: "https://gocarverllc.com/contact/" },

  // Practice Areas — index + all sub-pages discovered in nav
  { slug: "practice-areas-index", url: "https://gocarverllc.com/criminal-lawyer-springfield-mo/" },
  { slug: "federal-criminal-lawyer", url: "https://gocarverllc.com/federal-criminal-lawyer/" },
  { slug: "sex-crime-lawyer", url: "https://gocarverllc.com/sex-crime-lawyer/" },
  { slug: "child-pornography-lawyer", url: "https://gocarverllc.com/child-pornography-lawyer/" },
  { slug: "white-collar-crime", url: "https://gocarverllc.com/white-collar-crime-lawyer/" },
  { slug: "fraud-lawyers", url: "https://gocarverllc.com/fraud-lawyers/" },
  { slug: "drug-conspiracy", url: "https://gocarverllc.com/drug-conspiracy/" },
  { slug: "dwi-lawyer", url: "https://gocarverllc.com/dwi-lawyer-springfield-mo/" },
  { slug: "traffic-tickets", url: "https://gocarverllc.com/springfield-traffic-tickets/" },
  { slug: "personal-injury", url: "https://gocarverllc.com/personal-injury-lawyer-springfield-mo/" },

  // Additional practice areas linked from homepage CTA buttons
  { slug: "tax-attorney", url: "https://gocarverllc.com/tax-attorney-springfield-mo/" },
  { slug: "felonies", url: "https://gocarverllc.com/felonies-in-missouri/" },
  { slug: "misdemeanors", url: "https://gocarverllc.com/missouri-misdemeanor/" },
  { slug: "expungement", url: "https://gocarverllc.com/missouri-expungement/" },

  // Blog
  { slug: "blog-index", url: "https://gocarverllc.com/blog/" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── In-page extraction function (runs inside browser context) ──────────────
async function extractLayout(page) {
  return await page.evaluate(() => {
    function getStyle(el, prop) {
      try {
        return window.getComputedStyle(el).getPropertyValue(prop).trim();
      } catch {
        return null;
      }
    }

    function elText(el) {
      return el ? el.innerText.trim().replace(/\s+/g, " ").slice(0, 500) : null;
    }

    // ── Colors ──────────────────────────────────────────────────────────────
    const body = document.body;
    const bodyBg = getStyle(body, "background-color");
    const bodyColor = getStyle(body, "color");

    // Sample all unique background colors across visible elements
    const colorSamples = new Set();
    document.querySelectorAll("header, nav, section, footer, .hero, [class*='banner'], [class*='cta'], h1, h2, a, button").forEach((el) => {
      const bg = getStyle(el, "background-color");
      const color = getStyle(el, "color");
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") colorSamples.add(`bg:${bg}`);
      if (color) colorSamples.add(`text:${color}`);
    });

    // ── Fonts ────────────────────────────────────────────────────────────────
    const fontSamples = new Set();
    document.querySelectorAll("body, h1, h2, h3, p, nav a, button").forEach((el) => {
      const f = getStyle(el, "font-family");
      if (f) fontSamples.add(f.split(",")[0].replace(/["']/g, "").trim());
    });

    // ── Header ───────────────────────────────────────────────────────────────
    const headerEl = document.querySelector("header, [class*='header'], [id*='header']");
    const navLinks = [...document.querySelectorAll("nav a, header a, [class*='nav'] a")].map((a) => ({
      text: a.innerText.trim(),
      href: a.href,
    })).filter((l) => l.text);

    // ── Hero/Banner ──────────────────────────────────────────────────────────
    const heroEl = document.querySelector(
      "[class*='hero'], [class*='banner'], [class*='jumbotron'], [id*='hero'], section:first-of-type"
    );
    const heroHeading = heroEl?.querySelector("h1, h2")?.innerText?.trim();
    const heroSubtext = heroEl?.querySelector("p, .subtitle, .tagline")?.innerText?.trim()?.slice(0, 300);
    const heroCTAs = [...(heroEl?.querySelectorAll("a, button") || [])].map((el) => ({
      text: el.innerText.trim(),
      href: el.href || null,
      bg: getStyle(el, "background-color"),
      color: getStyle(el, "color"),
    })).filter((c) => c.text);

    // ── Sections ─────────────────────────────────────────────────────────────
    const sections = [];
    document.querySelectorAll("section, article, main > div, [class*='section'], [class*='block'], [class*='row']").forEach((el, i) => {
      if (i > 40) return; // cap
      const rect = el.getBoundingClientRect();
      if (rect.height < 50) return;

      const headings = [...el.querySelectorAll("h1, h2, h3, h4")].map((h) => ({
        tag: h.tagName,
        text: h.innerText.trim().slice(0, 200),
      }));
      const paras = [...el.querySelectorAll("p")].map((p) => p.innerText.trim().slice(0, 300)).filter(Boolean).slice(0, 5);
      const ctas = [...el.querySelectorAll("a[class*='btn'], a[class*='button'], button, a[class*='cta']")].map((el) => ({
        text: el.innerText.trim(),
        href: el.href || null,
      })).filter((c) => c.text);
      const imgs = [...el.querySelectorAll("img")].map((img) => ({
        src: img.src,
        alt: img.alt,
      }));
      const classList = el.className.toString().slice(0, 200);
      const bg = getStyle(el, "background-color");

      if (headings.length || paras.length || ctas.length) {
        sections.push({
          tag: el.tagName,
          class: classList,
          bg: bg !== "rgba(0, 0, 0, 0)" ? bg : null,
          headings,
          paras,
          ctas,
          imgs: imgs.slice(0, 6),
        });
      }
    });

    // ── H1/H2/H3 all headings ────────────────────────────────────────────────
    const allHeadings = [...document.querySelectorAll("h1, h2, h3")].map((h) => ({
      tag: h.tagName,
      text: h.innerText.trim().slice(0, 300),
    }));

    // ── All CTAs ─────────────────────────────────────────────────────────────
    const allCTAs = [...document.querySelectorAll("a[class*='btn'], a[class*='button'], button:not([class*='menu']), [class*='cta']")].map((el) => ({
      text: el.innerText.trim().slice(0, 100),
      href: el.href || null,
      bg: getStyle(el, "background-color"),
    })).filter((c) => c.text).slice(0, 20);

    // ── Footer ───────────────────────────────────────────────────────────────
    const footerEl = document.querySelector("footer, [id*='footer'], [class*='footer']");
    const footerText = elText(footerEl)?.slice(0, 1000);
    const footerLinks = [...(footerEl?.querySelectorAll("a") || [])].map((a) => ({
      text: a.innerText.trim(),
      href: a.href,
    })).filter((l) => l.text).slice(0, 30);

    // ── Meta ─────────────────────────────────────────────────────────────────
    const title = document.title;
    const metaDesc = document.querySelector('meta[name="description"]')?.content;
    const ogImage = document.querySelector('meta[property="og:image"]')?.content;

    return {
      title,
      metaDesc,
      ogImage,
      colors: {
        bodyBg,
        bodyText: bodyColor,
        samples: [...colorSamples].slice(0, 40),
      },
      fonts: [...fontSamples],
      header: {
        html: headerEl?.outerHTML?.slice(0, 3000) || null,
        navLinks,
      },
      hero: {
        heading: heroHeading,
        subtext: heroSubtext,
        ctas: heroCTAs,
      },
      allHeadings,
      allCTAs,
      sections,
      footer: {
        text: footerText,
        links: footerLinks,
      },
    };
  });
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  await mkdir(join(OUTPUT_DIR, "layout"), { recursive: true });
  await mkdir(join(OUTPUT_DIR, "screenshots", "desktop"), { recursive: true });
  await mkdir(join(OUTPUT_DIR, "screenshots", "mobile"), { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

  const allResults = {};

  for (const { slug, url } of PAGES) {
    console.log(`\n📄 Auditing: ${url}`);

    // ── Desktop ──────────────────────────────────────────────────────────
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent });
    const page = await ctx.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
      await page.waitForTimeout(1500); // let any JS paint finish

      const layout = await extractLayout(page);

      await page.screenshot({
        path: join(OUTPUT_DIR, "screenshots", "desktop", `${slug}.png`),
        fullPage: true,
      });
      console.log(`  ✅ Desktop screenshot saved`);

      // ── Mobile ────────────────────────────────────────────────────────
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: join(OUTPUT_DIR, "screenshots", "mobile", `${slug}.png`),
        fullPage: true,
      });
      console.log(`  📱 Mobile screenshot saved`);

      allResults[slug] = { url, ...layout };

      const outPath = join(OUTPUT_DIR, "layout", `${slug}.json`);
      await writeFile(outPath, JSON.stringify({ url, ...layout }, null, 2), "utf-8");
      console.log(`  💾 Layout data → output/layout/${slug}.json`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      allResults[slug] = { url, error: err.message };
    }

    await ctx.close();
    await sleep(1500);
  }

  // Write combined summary
  await writeFile(
    join(OUTPUT_DIR, "layout", "_all.json"),
    JSON.stringify(allResults, null, 2),
    "utf-8"
  );

  await browser.close();
  console.log(`\n✅ Layout audit complete → output/layout/\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
