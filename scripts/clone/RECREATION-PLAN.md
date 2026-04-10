# GoCarver LLC — Complete Site Recreation Plan

> **Source:** https://gocarverllc.com/ (WordPress / Divi theme)
> **Target:** EmDash CMS on Astro
> **Data captured:** Playwright layout audit — `output/layout/*.json` + `output/screenshots/`
> **Pages audited:** 20 (all routes discovered in nav + homepage CTA buttons)

---

## Design System

### Color Tokens
| CSS Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#023750` | Header bg overlay, dark section bgs, footer contact strip |
| `--color-accent` | `#BECA5C` | **Every** CTA button / button bg site-wide |
| `--color-body-text` | `#666666` | Default body copy |
| `--color-heading` | `#333333` | H1–H4 headings |
| `--color-white` | `#FFFFFF` | Page bg, text-on-dark |
| `--color-footer-bg` | `#1C1C1C` | Footer background (both rows) |
| `--color-header-overlay` | `rgba(2,55,80,0.5)` | Sticky header semi-transparent bg |

### Typography
| Token | Font | Usage |
|---|---|---|
| `--font-heading` | `Josefin Sans` (Google) | All H1–H4, nav links, button labels |
| `--font-body` | `Ubuntu` (Google) | All body copy, paragraphs |
| `--font-serif` | `Benne Regular` (Google) | Secondary body text (homepage only) |

### Buttons
- Background: `--color-accent`
- Text: `#333333`, uppercase, `Josefin Sans`, wide letter-spacing
- Shape: square (0–2px border-radius)
- Hover: darken accent by ~10%

---

## Global Components (used on every page)

### Header (`src/components/Header.astro`)
Sticky two-state header:

**Desktop layout (1440px):**
- Left: Logo (`Carver-associates-logo.png`, 300×81px)
- Center: Nav links (see below)
- Right: `(417) 350-1172` phone + `FREE CONSULTATION` button (accent)
- Background: `rgba(2,55,80,0.5)` — goes to `#023750` on scroll

**Primary Nav links:**
- Home → `/`
- About → `/about/`
- Practice Areas → `/practice-areas/` (dropdown)
  - Federal Criminal → `/practice-areas/federal-criminal/`
  - Sex Crimes → `/practice-areas/sex-crimes/`
  - Child Pornography → `/practice-areas/child-pornography/`
  - White Collar Crime → `/practice-areas/white-collar-crime/`
  - Fraud → `/practice-areas/fraud/`
  - Drug Conspiracy → `/practice-areas/drug-conspiracy/`
  - DWI → `/practice-areas/dwi/`
  - Traffic Tickets → `/practice-areas/traffic-tickets/`
- Blog → `/blog/`
- Contact → `/contact/`

**Mobile:** Hamburger → vertical drawer with same links

**EmDash wiring:** `getMenu("primary")`

---

### Footer (`src/components/Footer.astro`)
**Row 1 — Main footer (dark `#1C1C1C`):**
- Logo (white version)
- H4: `CONTACT US` + address, phone `(417) 350-1172`, email

**Row 2 — Bottom bar (same dark bg):**
- Copyright line
- Disclaimer: "Use of the website does not constitute legal advice or form an attorney/client relationship."
- Attribution: Constellation Marketing logo

**Footer nav (all practice areas + main links)**

**EmDash wiring:** `getMenu("footer")`

---

### Shared Section Components

| Component | File | Description |
|---|---|---|
| `<CTABand>` | `src/components/CTABand.astro` | Navy `#023750` strip — headline + button. Appears at bottom of every page. |
| `<ContactFormStrip>` | `src/components/ContactFormStrip.astro` | Navy section with inline contact form. Used on home + contact. |
| `<AwardBadges>` | `src/components/AwardBadges.astro` | Row of 4 award logos (SuperLawyers, Best of 417, Power 30, AV Preeminent). |
| `<PracticeAreaCard>` | `src/components/PracticeAreaCard.astro` | Icon + H4 label + LEARN MORE button. Used in grid on home + practice areas index. |
| `<StatBlock>` | `src/components/StatBlock.astro` | Large bold stat + label (e.g. "50+ YEARS OF EXCELLENCE") |
| `<FeatureCard>` | `src/components/FeatureCard.astro` | H3 + paragraph, used in 3-column "WHY US" sections |
| `<PracticeAreaSidebar>` | `src/components/PracticeAreaSidebar.astro` | Right sidebar: FREE CONSULTATION CTA box + practice area nav list |
| `<AttorneyBio>` | `src/components/AttorneyBio.astro` | Photo + bio text block used on thomas-carver + sidebar of practice pages |

---

## Pages

---

### 1. Homepage (`/`)
**`src/pages/index.astro`**
**WP URL:** `/`
**Title:** "Award-Winning Criminal Defense Attorney Springfield MO - Carver & Associates Law Firm"
**Meta:** "Elite Criminal Defense Attorney Springfield MO. 3X Lawyer of the Year in Springfield, Missouri. 40+ Years Experience > Free Consultation."

| # | Section | Layout | Key Content |
|---|---|---|---|
| 1 | **Hero Banner** | Full-width bg image + dark overlay | H1: "Criminal Defense Attorney Springfield MO" · Text: "When your freedom is on the line…" · "GET AN AWARD-WINNING CRIMINAL DEFENSE" · CTA: `FREE CONSULTATION` · Award badges row below |
| 2 | **3-Column Feature Cards** | White bg, 3 equal cols | H2: "Criminal Lawyer Springfield MO" · Eyebrow: "WHEN YOU WANT THE BEST" · Cards: COURTROOM FOCUSED · UNRIVALED EXPERIENCE · RECOGNIZED EXCELLENCE (each with a paragraph) |
| 3 | **Stats Bar** | White bg, left stats + right photo | Eyebrow: "VAST EXPERIENCE, UNMATCHED RESULTS" · H3: "50+ YEARS OF EXCELLENCE" · "1,000+ SATISFIED CLIENTS" · "300+ FEDERAL CASES" · CTA: `FREE CONSULTATION` · Attorney photo right |
| 4 | **Practice Areas Grid** | White bg, 2 rows × 4 cols | H2: "CRIMINAL DEFENSE PRACTICE AREAS" · 8 icon-cards: Tax, Federal, White Collar, DWI / Misdemeanors, Felonies, Expungement, Drugs · Each has SVG icon + LEARN MORE button |
| 5 | **Services Accordion** | White bg | H2: "VIGOROUS, EFFECTIVE CRIMINAL DEFENSE" · H3 + paragraph per area: Federal Crimes, White Collar Crimes, Felonies, Tax Crimes, DWI, Misdemeanors, Expungement |
| 6 | **Why Carver Band** | Navy `#023750` bg | H2: "Criminal Law Firm in Springfield MO" · Eyebrow: "LET US FIGHT FOR YOU" · 3 cols: VIGOROUSLY FIGHT THE PROSECUTION'S CASE · DEFEND YOUR CONSTITUTIONAL RIGHTS · SECURE THE MOST OPTIMAL OUTCOME FOR YOU |
| 7 | **Contact Form Strip** | Navy bg | Text "CONTACT US" · Inline contact form |

**EmDash query:** `getEmDashCollection("pages")` for homepage slug

---

### 2. About / Thomas Carver (`/about/`)
**`src/pages/about.astro`**
**WP URL:** `/thomas-carver/`
**Title:** "About Us - Carver & Associates"
**Meta:** "Thomas Carver, Attorney in Springfield MO is a former President of the Missouri Association of Criminal Defense Lawyers with 43+ years of trial experience."

| # | Section | Layout | Key Content |
|---|---|---|---|
| 1 | **Page Title Banner** | Narrow band, white bg | H1: "Thomas Carver" · CTA: `CONTACT TOM` |
| 2 | **Bio + Photo** | 2-col (text left, photo right) | H2: "Experience – Thomas Carver" · 3 paragraphs (48 yrs, 300+ federal, bar admissions) · CTA: `CONTACT TOM` · Right: headshot + AV Preeminent logo |
| 3 | **Credentials Grid** | 5 cols | H3 sections: BAR ADMISSIONS · EDUCATION · HONORS & AWARDS · PUBLISHED WORKS · REPRESENTATIVE CASES · Quote block |
| 4 | **Why Carver & Associates Band** | Navy bg + full-bleed attorney background photo | H2: "Why Carver & Associates" · 3 items (H4 + para): "Over 45 Years" · "Five-Time Lawyer of the Year" · "Track-Record of Successful Outcomes" |
| 5 | **Power of Experience** | Within navy band | H2: "The Power of Experience" · Paragraph · CTA: `CALL NOW` → `tel:4176954633` |

---

### 3. Practice Areas Index (`/practice-areas/`)
**`src/pages/practice-areas/index.astro`**
**WP URL:** `/criminal-lawyer-springfield-mo/`
**Title:** "Criminal Defense Attorney Springfield MO - Carver & Associates Law Firm"

Same layout as homepage sections 3–6 but with the page acting as a full practice areas landing page. 8-card grid + services list + footer CTA band.

**EmDash query:** `getEmDashCollection("practice_areas")`

---

### 4–16. Practice Area Detail Pages (`/practice-areas/[slug]/`)
**`src/pages/practice-areas/[slug].astro`**
**Single shared template — all 13 routes below use it:**

**Shared template structure:**

| # | Section | Layout | Key Content |
|---|---|---|---|
| 1 | **Page Title Banner** | Full-width colored band | H1: practice area name · breadcrumb |
| 2 | **Main Content + Sidebar** | 2-col (content 2/3 + sidebar 1/3) | Left: long-form PortableText (intro, subheadings, FAQ, statute refs). Right: `<PracticeAreaSidebar>` with FREE CONSULTATION CTA box + full practice areas nav |
| 3 | **Why Hire Us Band** | Navy bg, 3 value props | Reuse `<FeatureCard>` ×3 |
| 4 | **Contact Form Strip** | Navy | Reuse `<ContactFormStrip>` |

**Routes:**

| Slug | WP URL | H1 | H2s (first 2) |
|---|---|---|---|
| `federal-criminal` | `/federal-criminal-lawyer/` | FEDERAL CRIMINAL LAWYER SPRINGFIELD, MO | Experienced & Effective Federal Criminal Attorney · What is a Federal Criminal Offense? |
| `sex-crimes` | `/sex-crime-lawyer/` | Sex Crime Lawyer Springfield, MO | Defending the Accused with Dignity: Sex Crime Attorney · What Is a Sex Crime Under Missouri Laws |
| `child-pornography` | `/child-pornography-lawyer/` | Child Pornography Lawyer in Springfield, MO | How a Child Pornography Attorney Can Defend Your Rights · Defense Strategies for Child Pornography Charges |
| `white-collar-crime` | `/white-collar-crime-lawyer/` | WHITE COLLAR CRIME LAWYER SPRINGFIELD, MO | White Collar Crime Lawyer · White Collar Crime Attorney: Experienced Legal Support |
| `fraud` | `/fraud-lawyers/` | FRAUD LAWYERS SPRINGFIELD, MO | Fraud Attorneys Springfield, MO: Legal Assistance · An Overview of Federal and Missouri Fraud Laws |
| `drug-conspiracy` | `/drug-conspiracy/` | DRUG CONSPIRACY LAWYER SPRINGFIELD, MO | What Is Drug Conspiracy Under Missouri and Federal Law? · Drug Conspiracy Sentencing |
| `dwi` | `/dwi-lawyer-springfield-mo/` | DWI LAWYER SPRINGFIELD, MO | Why You Need a DWI Attorney Springfield, MO · What Constitutes a DWI in Springfield, MO? |
| `traffic-tickets` | `/springfield-traffic-tickets/` | Traffic Ticket Lawyer Springfield, MO | OVER 45 YEARS OF PROVEN EXPERIENCE · FIVE-TIME LAWYER OF THE YEAR |
| `personal-injury` | `/personal-injury-lawyer-springfield-mo/` | *(404 — no results found on live site)* | — |
| `tax-crimes` | `/tax-attorney-springfield-mo/` | Need a Top Tax Attorney In Springfield MO? | Tax Attorney Springfield MO · We Handle a Wide Variety of Criminal Tax Law Allegations |
| `felonies` | `/felonies-in-missouri/` | Complete Guide to Felonies in Missouri | Felonies In Missouri · What are Missouri's felony classes? |
| `misdemeanors` | `/missouri-misdemeanor/` | Missouri Misdemeanor Guide – Class A, B, C, D, Unclassified | Missouri Misdemeanor · 2017 Updated Missouri Criminal Code |
| `expungement` | `/missouri-expungement/` | Missouri Expungement: Everything You Need to Know | What is Expungement in Missouri? · The Expungement Missouri Cheat Sheet |

> ⚠️ `/personal-injury/` returned "No Results Found" on the live site — may have been removed. Include as a stub or redirect only.

---

### 17. Blog Index (`/blog/`)
**`src/pages/blog/index.astro`**
**WP URL:** `/blog/`
**Title:** "Show me Justice: A Criminal Law Blog"

| # | Section | Layout | Key Content |
|---|---|---|---|
| 1 | **Page Title Banner** | Band | H1: "Show me Justice: A Criminal Law Blog" |
| 2 | **Post Grid** | 3-col card grid (WordPress style) | Featured image + title + excerpt + date + LEARN MORE |
| 3 | **Pagination** | Bottom | Prev/Next |

**Blog post examples visible:**
- "Thomas Carver Recognized as One of the Top Lawyers in 417 Land 2022"
- "Carver Included in 2023 Edition of 'The Best Lawyers in America'"
- "Carver Selected as a Super Lawyer for 15th Year Straight"

**EmDash query:** `getEmDashCollection("posts")` with `orderBy: { published_at: "desc" }` + pagination

---

### 18. Blog Post Detail (`/blog/[slug]/`)
**`src/pages/blog/[slug].astro`**

| # | Section | Layout | Key Content |
|---|---|---|---|
| 1 | **Post Title Banner** | Band | H1: post title · date · byline |
| 2 | **Post Content + Sidebar** | 2-col | Left: PortableText body. Right: `<PracticeAreaSidebar>` |
| 3 | **Contact Form Strip** | Navy | Reuse `<ContactFormStrip>` |

**EmDash query:** `getEmDashEntry("posts", slug)`

---

### 19. Contact (`/contact/`)
**`src/pages/contact.astro`**
**WP URL:** `/contact/`
**Title:** "Contact - Free Consultation - Carver & Associates"

| # | Section | Layout | Key Content |
|---|---|---|---|
| 1 | **Page Title Banner** | Band | H1: "Contact" · Subtext: call `(417) 350-1172` |
| 2 | **Form + Office Info** | 2-col | Left: form (name, phone, email, message, submit). Right: address, phone, hours, map |

---

### 20. 404 (`/404`)
**`src/pages/404.astro`**
- Simple not-found message
- Header + footer active
- Quick links to Home, Contact, Practice Areas

---

## Complete URL Mapping (WordPress → EmDash)

| WP URL | EmDash URL | Redirect needed? |
|---|---|---|
| `/` | `/` | No |
| `/thomas-carver/` | `/about/` | Yes — 301 |
| `/contact/` | `/contact/` | No |
| `/criminal-lawyer-springfield-mo/` | `/practice-areas/` | Yes — 301 |
| `/federal-criminal-lawyer/` | `/practice-areas/federal-criminal/` | Yes — 301 |
| `/sex-crime-lawyer/` | `/practice-areas/sex-crimes/` | Yes — 301 |
| `/child-pornography-lawyer/` | `/practice-areas/child-pornography/` | Yes — 301 |
| `/white-collar-crime-lawyer/` | `/practice-areas/white-collar-crime/` | Yes — 301 |
| `/fraud-lawyers/` | `/practice-areas/fraud/` | Yes — 301 |
| `/drug-conspiracy/` | `/practice-areas/drug-conspiracy/` | Yes — 301 |
| `/dwi-lawyer-springfield-mo/` | `/practice-areas/dwi/` | Yes — 301 |
| `/springfield-traffic-tickets/` | `/practice-areas/traffic-tickets/` | Yes — 301 |
| `/personal-injury-lawyer-springfield-mo/` | `/practice-areas/personal-injury/` | Yes — 301 |
| `/tax-attorney-springfield-mo/` | `/practice-areas/tax-crimes/` | Yes — 301 |
| `/felonies-in-missouri/` | `/practice-areas/felonies/` | Yes — 301 |
| `/missouri-misdemeanor/` | `/practice-areas/misdemeanors/` | Yes — 301 |
| `/missouri-expungement/` | `/practice-areas/expungement/` | Yes — 301 |
| `/blog/` | `/blog/` | No |
| `/blog/[post-slug]/` | `/blog/[slug]/` | No (slugs same) |

**Redirects implementation:** `src/pages/[...legacy].astro` — map WP slugs to new paths using a static lookup table.

---

## Page Template Count

| Template | Pages using it |
|---|---|
| Homepage (unique) | 1 |
| About (unique) | 1 |
| Practice Areas Index (unique) | 1 |
| Practice Area Detail `[slug]` | 13 |
| Blog Index (unique) | 1 |
| Blog Post Detail `[slug]` | dynamic (all posts) |
| Contact (unique) | 1 |
| 404 (unique) | 1 |
| **Total** | **6 unique templates** |

---

## Assets to Download

| File | From URL | Usage |
|---|---|---|
| `Carver-associates-logo.png` | `/wp-content/uploads/2021/02/` | Header + footer logo |
| `Carver-law-hero-background.jpg` | `/wp-content/uploads/2021/02/` | Homepage hero bg |
| `Thomas-Carver-attorney-headshot.jpg` | `/wp-content/uploads/2021/02/` | About page + sidebar |
| `SuperLawyers-1-min.png` | `/wp-content/uploads/2021/03/` | Award badge |
| `Best-of-417-min.png` | `/wp-content/uploads/2021/02/` | Award badge |
| `The-Power-30-Missouri-Lawyers-Weekly-1-min.png` | `/wp-content/uploads/2021/02/` | Award badge |
| `AV-Preminent_Whit.png` | `/wp-content/uploads/2021/03/` | Award badge |
| Practice area SVG icons (×8, 77×77) | `/wp-content/uploads/` | Practice area grid cards |
| `Thomas Carver CTA pic` | `/wp-content/uploads/` | About page dark band bg |
| `logo av` (Martindale-Hubbell) | `/wp-content/uploads/` | About page sidebar |

> Run `node crawl.js && node extract-images.js` to download all automatically.

---

## EmDash Schema Summary

**Collections:**
- `pages` — Homepage, Contact (static singleton pages)
- `practice_areas` — 13 practice area detail pages
- `attorneys` — Thomas Carver profile
- `posts` — Blog posts

**Menus:**
- `primary` — Sticky header nav with dropdown
- `footer` — Footer nav with all practice area links

**Taxonomies:**
- `practice_type` — Criminal Defense, Federal, White Collar, Personal Injury, Traffic, Tax

> See `seed/seed-draft.json` (generate with `node generate-seed.js` after crawl)
