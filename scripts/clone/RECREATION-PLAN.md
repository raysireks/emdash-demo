# GoCarver LLC — Site Recreation Plan

> **Source:** https://gocarverllc.com/ (WordPress / Divi theme)
> **Target:** EmDash CMS on Astro
> **Data captured:** Playwright layout audit on 2026-04-09 — see `output/layout/*.json` and `output/screenshots/`

---

## Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `rgb(2, 55, 80)` = `#023750` | Dark navy — header bg overlay, CTA section bg, section dark backgrounds |
| `--color-accent` | `rgb(190, 202, 92)` = `#BECA5C` | Lime green — ALL button/CTA backgrounds, active link highlights |
| `--color-body-text` | `rgb(102, 102, 102)` = `#666666` | Default body copy |
| `--color-heading` | `rgb(51, 51, 51)` = `#333333` | Headings |
| `--color-white` | `rgb(255, 255, 255)` | Page background, text on dark sections |
| `--color-footer-bg` | `rgb(28, 28, 28)` = `#1C1C1C` | Footer background |
| `--color-header-overlay` | `rgba(2, 55, 80, 0.5)` | Sticky header semi-transparent background |

### Typography
| Token | Value | Usage |
|---|---|---|
| `--font-heading` | `Josefin Sans` (Google Font) | All headings H1–H4 |
| `--font-body` | `Ubuntu` (Google Font) | Body copy, nav links, paragraphs |
| `--font-serif` | `Benne Regular` (Google Font) | Secondary body text (homepage only) |

### Buttons
- Background: `--color-accent` (`#BECA5C`)
- Text: dark/black or `#333`
- Text transform: uppercase
- Font: `Josefin Sans`, bold
- Letter spacing: wide
- No border radius (square/subtle radius)
- Hover: darken accent slightly

---

## Global Components

### Component 1: Header / Navigation
**File:** `src/components/Header.astro`

**Two-row sticky header:**

**Row 1 (Desktop top bar):**
- Left: Logo (`Carver-associates-logo.png`, 300×81px)
- Center: Main nav links
- Right: Phone number `(417) 350-1172` as plain text + `FREE CONSULTATION` button (accent green)
- Background: `rgba(2, 55, 80, 0.5)` — semi-transparent navy overlay
- Becomes fully opaque on scroll

**Navigation links:**
- Home → `/`
- About → `/thomas-carver/` (note: maps to `/about/` in EmDash)
- Practice Areas → `/practice-areas/` (dropdown)
  - Federal Criminal
  - Sex Crimes
  - Child Pornography
  - White Collar Crime
  - Fraud
  - Drug Conspiracy
  - DWI
  - Traffic Tickets
- Blog → `/blog/`
- Contact → `/contact/`

**Row 2 (Mobile collapsed):**
- Hamburger menu
- Same links in vertical stack

**EmDash wiring:** `getMenu("primary")` from seed

---

### Component 2: Footer
**File:** `src/components/Footer.astro`

**Two-row dark footer:**

**Row 1:**
- Left: Carver Associates logo (white version)
- Center/Right: "CONTACT US" heading with address/phone/email
- Background: `rgb(28, 28, 28)`

**Row 2 (bottom bar):**
- Copyright text
- Disclaimer: "Use of the website does not constitute legal advice or form an attorney/client relationship."
- Attribution logo (Constellation Marketing)
- Background: `rgb(28, 28, 28)`

**Footer nav (same dark bg):**
- Home, About, Practice Areas (with all submenu items), Blog, Contact

**EmDash wiring:** `getMenu("footer")` from seed

---

## Pages

---

### Page 1: Homepage (`/`)
**File:** `src/pages/index.astro`
**Title:** "Award-Winning Criminal Defense Attorney Springfield MO - Carver & Associates Law Firm"
**Meta:** "Elite Criminal Defense Attorney Springfield MO. 3X Lawyer of the Year in Springfield, Missouri. 40+ Years Experience > Free Consultation."

#### Section 1: Hero Banner
- **Background:** Full-width image `Carver-law-hero-background.jpg`
- **Overlay:** Dark navy overlay on image
- **Content (centered, white text):**
  - Text: `"When your freedom is on the line, you need the BEST Criminal Defense."`
  - Large H1: `"Criminal Defense Attorney Springfield MO"`
  - Subtext: `"GET AN AWARD-WINNING CRIMINAL DEFENSE"`
  - CTA Button: `FREE CONSULTATION` → `/contact/`
- **Award badges row** (below text, white logos):
  - SuperLawyers logo
  - Best of 417 logo
  - The Power 30 Missouri Lawyers Weekly
  - AV Preeminent (Martindale-Hubbell)

#### Section 2: Why Choose Us — 3-Column Feature Cards
- **Background:** White
- **Header:** H2 `"Criminal Lawyer Springfield MO"` + subtext `"WHEN YOU WANT THE BEST"`
- **3 columns:**
  1. **COURTROOM FOCUSED** — "That means our work is centered on trial practice. As trial lawyers, our attorneys' work is heavily weighted toward complex criminal matters..."
  2. **UNRIVALED EXPERIENCE** — Thomas Carver bio snippet about thousands of cases
  3. **RECOGNIZED EXCELLENCE** — "Thomas D. Carver highly regarded by legal peers..."

#### Section 3: Stats Bar
- **Background:** White (with attorney photo on right)
- **Left column:** 3 stat blocks stacked:
  - H3: `50+ YEARS OF EXCELLENCE`
  - H3: `1,000+ SATISFIED CLIENTS`
  - H3: `300+ FEDERAL CASES`
  - Eyebrow text: `VAST EXPERIENCE, UNMATCHED RESULTS`
  - CTA: `FREE CONSULTATION` button
- **Right column:** Attorney photo (half-height image)

#### Section 4: Practice Areas Grid
- **Background:** White
- **H2:** `CRIMINAL DEFENSE PRACTICE AREAS`
- **2 rows × 4 cols = 8 cards**, each with:
  - Icon image (SVG icon, 77×77px)
  - H4 label
  - `LEARN MORE` button → practice area page
  - Cards: Tax, Federal, White Collar, DWI / Misdemeanors, Felonies, Expungement, Drugs

#### Section 5: Services Accordion / List
- **Background:** White
- **H2:** `VIGOROUS, EFFECTIVE CRIMINAL DEFENSE`
- **Subtext:** "We are here to fight for you from your first court appearance to the final resolution."
- **7 accordion/card items** with H3 + paragraph:
  - Federal Crimes, White Collar Crimes, Felonies, Tax Crimes, DWI, Misdemeanors, Expungement
  - Each has a descriptive paragraph

#### Section 6: Why Carver — 3-Column Value Props
- **Background:** Full-bleed image with navy overlay (`rgb(2, 55, 80)` bg)
- **H2:** `Criminal Law Firm in Springfield MO`
- **Eyebrow:** `LET US FIGHT FOR YOU`
- **3 columns (white text):**
  1. **VIGOROUSLY FIGHT THE PROSECUTION'S CASE**
  2. **DEFEND YOUR CONSTITUTIONAL RIGHTS**
  3. **SECURE THE MOST OPTIMAL OUTCOME FOR YOU**

#### Section 7: Contact Form Strip
- **Background:** `rgb(2, 55, 80)` — solid navy
- **Text:** `CONTACT US`
- **Inline contact form** (name, phone, email, message)

---

### Page 2: About / Thomas Carver (`/about/`)
**File:** `src/pages/about.astro` (or `src/pages/thomas-carver.astro` for URL parity)
**Title:** "About Us - Carver & Associates"
**Meta:** "Thomas Carver, Attorney in Springfield MO is a former President of the Missouri Association of Criminal Defense Lawyers with 43+ years of trial experience."

#### Section 1: Hero (Page Title)
- **Background:** White with narrow banner
- **H1:** `Thomas Carver`
- **CTA:** `CONTACT TOM` button → `/contact/`

#### Section 2: Bio + Credentials (2-col)
- **Left column:**
  - **H2:** `Experience – Thomas Carver`
  - 3–4 paragraphs of bio text (48 years practicing, 300+ federal cases, etc.)
  - **CTA:** `CONTACT TOM` button
- **Right column:**
  - Attorney headshot photo (`Thomas-Carver-attorney-headshot.jpg`)
  - AV Preeminent logo (`logo av`)

#### Section 3: Credentials Grid (Tab/accordion style)
- **H3 sections** displayed in a multi-column grid:
  - `BAR ADMISSIONS` — list of courts
  - `EDUCATION` — law school info
  - `HONORS & AWARDS` — Best Lawyers, Super Lawyer, Robert Duncan Award, etc.
  - `PUBLISHED WORKS` — "Criminal Law – Sentencing, Missouri Bar, 1994"
  - `REPRESENTATIVE CASES` — notable case highlights
- Bio quote block: *"A lot of people who come to see me, symbolically come carrying a big bag of rocks..."*

#### Section 4: Why Carver & Associates — Dark CTA Band
- **Background:** `rgb(2, 55, 80)` navy with full-width background photo (`Thomas Carver CTA pic`)
- **H2:** `Why Carver & Associates`
- **3 feature items (H4 + paragraph):**
  1. Over 45 Years of Proven Experience
  2. Five-Time Lawyer of the Year
  3. A Track-Record of Successful Outcomes
- **CTA:** `CALL NOW` → `tel:4176954633`
- **H2 below:** `The Power of Experience`
- Paragraph: "When your life is on the line, you don't want to chance your future to a legal rookie..."

---

### Page 3: Practice Areas — Index (`/practice-areas/`)
**File:** `src/pages/practice-areas/index.astro`

- Lists all practice areas as cards
- Same 8-card grid as homepage section 4, but expanded with descriptions
- Query: `getEmDashCollection("practice_areas")`

---

### Page 4: Practice Area — Detail (`/practice-areas/[slug]/`)
**File:** `src/pages/practice-areas/[slug].astro`

**Consistent template across all practice area pages (fraud, federal, white collar, etc.):**

#### Section 1: Page Banner
- Full-width colored banner with H1 (practice area name)
- Breadcrumb: Home > Practice Areas > [Name]

#### Section 2: Main Content (2-col)
- **Left (2/3):** Long-form content (PortableText)
  - H2 subheadings
  - Numbered/bulleted lists of charges we handle
  - FAQ-style Q&A blocks
- **Right (1/3):** Sidebar
  - `FREE CONSULTATION` CTA box (dark bg)
  - Phone number prominent
  - Practice areas list (nav)

#### Section 3: Why Hire Us band  
- Dark navy with 3 trust points (reused component from homepage)

#### Section 4: Contact strip
- Same contact form as homepage bottom

---

### Page 5: Contact (`/contact/`)
**File:** `src/pages/contact.astro`
**Title:** "Contact - Free Consultation - Carver & Associates"

#### Section 1: Page Title Banner
- H1: `Contact` or `Free Consultation`
- Subtext: Call `(417) 350-1172`

#### Section 2: Contact Form + Info (2-col)
- **Left:** Contact form
  - Name, Phone, Email, Message textarea
  - Submit button (accent green)
- **Right:** Office info
  - Address
  - Phone: `(417) 350-1172`
  - Hours
  - Google Maps embed or static map image

---

## Shared/Reusable Components

| Component | File | Description |
|---|---|---|
| `<CTABand>` | `src/components/CTABand.astro` | Dark navy strip with headline + CTA button. Used on all pages. |
| `<PracticeAreaCard>` | `src/components/PracticeAreaCard.astro` | Icon + H4 + LEARN MORE button card |
| `<StatBlock>` | `src/components/StatBlock.astro` | Large stat number + label for the stats bar |
| `<AwardBadges>` | `src/components/AwardBadges.astro` | Row of award/badge logo images |
| `<ContactFormStrip>` | `src/components/ContactFormStrip.astro` | Full-width navy contact form section |
| `<PracticeAreaSidebar>` | `src/components/PracticeAreaSidebar.astro` | Right sidebar with CTA box + nav list |
| `<FeatureCard>` | `src/components/FeatureCard.astro` | H3 + paragraph trust/feature block (3-up) |

---

## Complete Page URL Mapping (WordPress → EmDash)

| Original WP URL | New EmDash URL | Template |
|---|---|---|
| `/` | `/` | `pages/index.astro` |
| `/thomas-carver/` | `/about/` | `pages/about.astro` |
| `/contact/` | `/contact/` | `pages/contact.astro` |
| `/criminal-lawyer-springfield-mo/` | `/practice-areas/` | `pages/practice-areas/index.astro` |
| `/federal-criminal-lawyer/` | `/practice-areas/federal-criminal/` | `pages/practice-areas/[slug].astro` |
| `/white-collar-crime-lawyer/` | `/practice-areas/white-collar-crime/` | same template |
| `/fraud-lawyers/` | `/practice-areas/fraud/` | same template |
| `/drug-conspiracy/` | `/practice-areas/drug-conspiracy/` | same template |
| `/dwi-lawyer-springfield-mo/` | `/practice-areas/dwi/` | same template |
| `/sex-crime-lawyer/` | `/practice-areas/sex-crimes/` | same template |
| `/traffic-ticket-lawyer-springfield-mo/` | `/practice-areas/traffic-tickets/` | same template |
| `/personal-injury-lawyer-springfield-mo/` | `/practice-areas/personal-injury/` | same template |
| `/tax-attorney-springfield-mo/` | `/practice-areas/tax-crimes/` | same template |
| `/felonies-in-missouri/` | `/practice-areas/felonies/` | same template |
| `/missouri-misdemeanor/` | `/practice-areas/misdemeanors/` | same template |
| `/missouri-expungement/` | `/practice-areas/expungement/` | same template |
| `/blog/` | `/blog/` | `pages/blog/index.astro` |
| `/blog/[post]/` | `/blog/[slug]/` | `pages/blog/[slug].astro` |

---

## Assets to Download

All from `gocarverllc.com/wp-content/uploads/2021/02/` and `/2021/03/`:

| File | Usage |
|---|---|
| `Carver-associates-logo.png` | Header + footer logo |
| `Carver-law-hero-background.jpg` | Homepage hero bg image |
| `Thomas-Carver-attorney-headshot.jpg` | About page + sidebar |
| `SuperLawyers-1-min.png` | Award badge |
| `Best-of-417-min.png` | Award badge |
| `The-Power-30-Missouri-Lawyers-Weekly-1-min.png` | Award badge |
| `AV-Preminent_Whit.png` | Award badge (Martindale-Hubbell) |
| Practice area icons (77×77 SVGs) | Practice area grid cards |

> Run `node extract-images.js` after `node crawl.js` to download all assets automatically.

---

## EmDash Schema Summary

See `seed/seed-draft.json` (generated by `node generate-seed.js`).

**Collections:**
- `pages` — Homepage, Contact, About (static pages)
- `practice_areas` — All 12+ practice area pages (dynamic template)
- `attorneys` — Thomas Carver + any associates

**Menus:**
- `primary` — Sticky header nav
- `footer` — Footer nav

**Taxonomies:**
- `practice_type` — Criminal Defense, Federal, White Collar, Personal Injury, etc.
