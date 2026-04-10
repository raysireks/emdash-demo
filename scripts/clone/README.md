# GoCarver Site Clone Scripts

Playwright-based utilities for crawling and cloning `gocarverllc.com`.

## Setup

```bash
cd scripts/clone
npm install
```

## Scripts

| Script | Description |
|---|---|
| `crawl.js` | Crawls all known URLs, dumps HTML, screenshots, and assets |
| `extract-images.js` | Parses crawled HTML and downloads all images found |
| `extract-content.js` | Parses crawled HTML and extracts structured text content (titles, headings, paragraphs) into JSON |
| `generate-seed.js` | Converts extracted content JSON into an EmDash `seed.json` draft |

## Output

All output goes to `output/` (gitignored):

```
output/
├── html/          # Raw rendered HTML per URL
├── screenshots/   # Desktop + mobile PNG screenshots per URL
├── assets/        # Downloaded images and media
├── content/       # Structured content JSON per URL
└── seed-draft.json  # Auto-generated seed file draft
```

## Usage

```bash
# Step 1: Crawl and screenshot all pages
node crawl.js

# Step 2: Download all images referenced in the HTML
node extract-images.js

# Step 3: Extract structured content into JSON
node extract-content.js

# Step 4: Generate a draft seed file for EmDash
node generate-seed.js
```

## Notes

- The site uses a WAF and blocks plain HTTP clients. All scripts use Playwright (real browser rendering) to bypass this.
- Requests are throttled to ~1/sec to avoid triggering rate limiting.
- Screenshots are taken at 1440px (desktop) and 390px (mobile).
