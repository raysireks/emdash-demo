/**
 * generate-seed.js — Convert extracted content JSON into an EmDash seed draft
 *
 * Reads all JSON files from output/content/ and produces a
 * seed/seed-draft.json that you can refine and rename to seed/seed.json.
 *
 * Usage: node generate-seed.js  (run after extract-content.js)
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, "output", "content");
// Write draft seed two levels up into the project's seed/ folder
const SEED_DIR = join(__dirname, "..", "..", "seed");

// ─── Page slug → collection heuristics ─────────────────────────────────────
function classifyPage(slug, content) {
  const practiceAreaKeywords = [
    "fraud", "drug", "federal", "white-collar", "traffic", "criminal",
    "personal-injury", "dui", "assault", "gun", "sex-crime",
  ];
  const lowerSlug = slug.toLowerCase();

  if (slug.includes("thomas-carver") || slug.includes("about")) return "attorneys";
  if (slug.includes("contact")) return "contact";
  if (practiceAreaKeywords.some((k) => lowerSlug.includes(k))) return "practice_areas";
  return "pages";
}

function slugToLabel(slug) {
  return slug
    .replace(/gocarverllc-com-?/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || slug;
}

function textToPortableText(paragraphs) {
  return paragraphs.map((text) => ({
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text }],
  }));
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  await mkdir(SEED_DIR, { recursive: true });

  const files = (await readdir(CONTENT_DIR))
    .filter((f) => f.endsWith(".json") && f !== "_summary.json");

  console.log(`\n🔍 Generating seed from ${files.length} content files...\n`);

  const pagesContent = [];
  const practiceAreasContent = [];
  const attorneysContent = [];

  // Gather all discovered phone numbers across pages
  const allPhones = new Set();

  for (const file of files) {
    const raw = await readFile(join(CONTENT_DIR, file), "utf-8");
    const c = JSON.parse(raw);
    const pageType = classifyPage(c.slug, c);
    const label = c.title || slugToLabel(c.slug);
    const urlSlug = c.slug
      .replace(/gocarverllc-com-?/, "")
      .replace(/-$/, "") || "home";

    ;(c.contact?.phones || []).forEach((p) => allPhones.add(p));

    const entry = {
      id: urlSlug || "home",
      slug: urlSlug || "home",
      status: "published",
      data: {
        title: c.h1?.[0] || label,
        meta_description: c.metaDescription || c.ogDescription || undefined,
        content: textToPortableText(c.paragraphs.slice(0, 20)),
      },
    };

    if (pageType === "practice_areas") {
      entry.data.summary = c.paragraphs[0] || undefined;
      practiceAreasContent.push(entry);
      console.log(`  ⚖️  practice_area: ${entry.data.title}`);
    } else if (pageType === "attorneys") {
      entry.data.display_name = c.h1?.[0] || "Thomas Carver";
      entry.data.bio = textToPortableText(c.paragraphs.slice(0, 10));
      delete entry.data.content;
      attorneysContent.push(entry);
      console.log(`  👤 attorney: ${entry.data.display_name}`);
    } else {
      pagesContent.push(entry);
      console.log(`  📄 page: ${entry.data.title}`);
    }
  }

  const seed = {
    $schema: "https://emdashcms.com/seed.schema.json",
    version: "1",
    meta: {
      name: "Carver & Associates",
      description: "Award-winning criminal defense attorneys in Springfield, MO",
      author: "Carver & Associates",
    },
    settings: {
      title: "Carver & Associates",
      tagline: "Award-Winning Criminal Defense Attorneys – Springfield, MO",
    },
    collections: [
      {
        slug: "pages",
        label: "Pages",
        labelSingular: "Page",
        supports: ["drafts", "revisions", "seo"],
        fields: [
          { slug: "title", label: "Title", type: "string", required: true, searchable: true },
          { slug: "meta_description", label: "Meta Description", type: "text" },
          { slug: "content", label: "Content", type: "portableText", searchable: true },
        ],
      },
      {
        slug: "practice_areas",
        label: "Practice Areas",
        labelSingular: "Practice Area",
        supports: ["drafts", "revisions", "search", "seo"],
        fields: [
          { slug: "title", label: "Title", type: "string", required: true, searchable: true },
          { slug: "summary", label: "Summary", type: "text", searchable: true },
          { slug: "meta_description", label: "Meta Description", type: "text" },
          { slug: "featured_image", label: "Featured Image", type: "image" },
          { slug: "content", label: "Content", type: "portableText", searchable: true },
        ],
      },
      {
        slug: "attorneys",
        label: "Attorneys",
        labelSingular: "Attorney",
        supports: ["drafts", "revisions"],
        fields: [
          { slug: "display_name", label: "Name", type: "string", required: true, searchable: true },
          { slug: "title", label: "Title / Role", type: "string" },
          { slug: "photo", label: "Photo", type: "image" },
          { slug: "bio", label: "Biography", type: "portableText", searchable: true },
          { slug: "bar_admissions", label: "Bar Admissions", type: "text" },
          { slug: "awards", label: "Awards & Recognition", type: "text" },
          { slug: "phone", label: "Direct Phone", type: "string" },
          { slug: "email", label: "Email", type: "string" },
        ],
      },
    ],
    taxonomies: [
      {
        name: "practice_type",
        label: "Practice Types",
        labelSingular: "Practice Type",
        hierarchical: false,
        collections: ["practice_areas"],
        terms: [
          { slug: "criminal-defense", label: "Criminal Defense" },
          { slug: "federal-crimes", label: "Federal Crimes" },
          { slug: "white-collar", label: "White Collar" },
          { slug: "drug-crimes", label: "Drug Crimes" },
          { slug: "traffic", label: "Traffic" },
          { slug: "personal-injury", label: "Personal Injury" },
          { slug: "fraud", label: "Fraud" },
        ],
      },
    ],
    menus: [
      {
        name: "primary",
        label: "Primary Navigation",
        items: [
          { type: "custom", label: "Home", url: "/" },
          { type: "custom", label: "Practice Areas", url: "/practice-areas" },
          { type: "custom", label: "About", url: "/thomas-carver" },
          { type: "custom", label: "Contact", url: "/contact" },
        ],
      },
      {
        name: "footer",
        label: "Footer Navigation",
        items: [
          { type: "custom", label: "Home", url: "/" },
          { type: "custom", label: "Fraud Lawyers", url: "/practice-areas/fraud-lawyers" },
          { type: "custom", label: "Drug Conspiracy", url: "/practice-areas/drug-conspiracy" },
          { type: "custom", label: "Federal Criminal", url: "/practice-areas/federal-criminal-lawyer" },
          { type: "custom", label: "White Collar Crime", url: "/practice-areas/white-collar-crime-lawyer" },
          { type: "custom", label: "Traffic Tickets", url: "/practice-areas/traffic-ticket-lawyer-springfield-mo" },
          { type: "custom", label: "Personal Injury", url: "/practice-areas/personal-injury-lawyer-springfield-mo" },
          { type: "custom", label: "Contact", url: "/contact" },
        ],
      },
    ],
    content: {
      pages: pagesContent,
      practice_areas: practiceAreasContent,
      attorneys: attorneysContent,
    },
  };

  const outPath = join(SEED_DIR, "seed-draft.json");
  await writeFile(outPath, JSON.stringify(seed, null, 2), "utf-8");

  console.log(`\n✅ Draft seed written to seed/seed-draft.json`);
  console.log(`   Review and rename to seed/seed.json when ready.`);
  if (allPhones.size > 0) {
    console.log(`\n📞 Phone numbers found on site: ${[...allPhones].join(", ")}`);
  }
  console.log();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
