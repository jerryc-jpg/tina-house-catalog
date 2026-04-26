# Tina House — static catalog

A simple, no-build static website for a small cosmetics shop. It's a catalog
only — there is no shopping cart, no checkout, and no online sales. The goal is
to show what the store carries and drive foot traffic.

Everything is plain HTML, CSS, and a small amount of vanilla JavaScript. No
frameworks, no build step, no dependencies.

The site is **bilingual**: Simplified Mandarin by default, with a toggle
button (`EN` / `中`) in the header that switches to English and remembers the
choice via `localStorage`.

## File tree

```
/
├── index.html           Home page (hero, hours, category tiles)
├── makeup.html          Makeup catalog
├── skincare.html        Skincare catalog
├── haircare.html        Hair Care catalog
├── about.html           Store story
├── visit.html           Address, hours, map, parking
├── brand.html           Dynamic brand page — reads ?brand=<slug> from URL
├── products.json        Product data — bilingual { zh, en } fields
├── brands.json          List of brands shown in the home-page strip
├── css/
│   └── styles.css       All styles
├── js/
│   ├── i18n.js          All UI translations + language-toggle logic
│   └── catalog.js       Mobile nav + product/brand grid rendering
├── images/
│   ├── products/
│   │   ├── makeup-placeholder.svg
│   │   ├── skincare-placeholder.svg
│   │   └── haircare-placeholder.svg
│   └── brands/
│       └── *.svg        One file per brand (referenced from brands.json)
└── README.md
```

## Run locally

From the project folder, run one of:

```bash
# Node (no install — uses npx)
npx serve .

# Python 3 (if installed)
python -m http.server 8000
```

Then visit <http://localhost:8000> (Python) or the URL `serve` prints.

A local server is needed because the category pages load `products.json` via
`fetch()`, which browsers block when you open files directly from disk.

## How the translations work

- All UI text lives in [js/i18n.js](js/i18n.js) under `window.I18N.zh` and
  `window.I18N.en`, keyed by strings like `nav.home`, `hero.hours`,
  `footer.address`.
- HTML elements with `data-i18n="some.key"` get their text swapped in on load
  and on every language-toggle click. The text already in the HTML is the
  Mandarin default, shown to no-JS users and during the moment before the
  script runs.
- The `<title>` of each page also has `data-i18n="title.home"` (etc.) so it
  retitles on switch too.
- Product copy is bilingual inside [products.json](products.json) — each
  product's `name`, `brand`, and `description` are `{ "zh": "...", "en": "..." }`
  objects. `js/catalog.js` picks the right side based on the current language.

### Changing UI text

Open [js/i18n.js](js/i18n.js) and edit the string on the right side of the
appropriate key, in the right language block (`zh` or `en`). For Mandarin
edits, also update the corresponding text in the HTML files if you want no-JS
users to see the change.

### Changing tagline / hero hours

- `hero.hours` in [js/i18n.js](js/i18n.js) controls the "Open daily 10am – 7pm"
  line in the hero.
- `brand.tagline` controls the hero subtitle.

## How the home page works

The home page has two data-driven sections:

- **Featured this month** — renders any products from `products.json` that
  have `"featured": true`. Cards show image, brand, name, and short
  description (no price).
- **Brands we carry** — a grayscale logo strip rendered from `brands.json`.
  Each logo links to `brand.html?brand=<slug>`, a dynamic page listing every
  product from that brand.

## How to feature / unfeature a product

Open [products.json](products.json) and add or remove the `featured` flag on
the entry:

```json
{
  "id": "mk-01",
  "featured": true,          // ← add this line to put it on the home page
  "category": "makeup",
  ...
}
```

Any product without a `featured` flag (or with `featured: false`) is hidden
from the home page but still appears on its category page. There is no hard
limit, but 4–8 featured items keeps the grid tidy.

## How to add a new brand

1. Drop the logo into `images/brands/`. SVG is ideal; PNG works too.
   Logos display at 40px tall with the width scaling proportionally.
   They are rendered in grayscale on the home page strip, so color in the
   source is fine — the CSS filter handles it. On the brand's own page the
   logo is shown full-color below the heading.

2. Add an entry to [brands.json](brands.json):

   ```json
   { "name": "CeraVe", "slug": "cerave", "logo": "brands/cerave.svg" }
   ```

   - `name` is used as the image `alt` text in the home strip and as the
     `<h1>` on the brand page.
   - `slug` is the URL fragment — lowercase, hyphenated, no spaces. The
     home-strip logo will link to `brand.html?brand=<slug>`.
   - `logo` is the path relative to `images/` — so
     `"brands/cerave.svg"` points at `images/brands/cerave.svg`.

3. The brand's page populates automatically from `products.json`: any
   product whose `brand` field matches the `name` from `brands.json` will
   appear. No extra wiring is needed.

   - Match is case-sensitive on either language side — `product.brand.en ===
     brand.name` or `product.brand.zh === brand.name`.
   - If no product matches, the brand page shows "No products found."

To remove a brand, delete its entry from `brands.json` (and optionally its
logo file). The home-page strip will drop it; existing products that still
carry that brand name will stop having a linked brand page, but they'll
still appear on their category page.

### Brand pages for products whose brand isn't in brands.json

If a product has a brand that isn't listed in `brands.json`, the slugify
fallback still works: visit `brand.html?brand=<slugified-brand-name>` and
the page will list every product matching that name. The heading will be a
title-cased version of the slug and no logo will show. Adding the brand to
`brands.json` is the preferred way to make it official.

## How to add a new product

1. Drop the product image into `images/products/`. A square JPG or PNG around
   800×800 works well.
2. Open [products.json](products.json) and add a new entry to the array. Copy
   an existing entry and change the fields:

   ```json
   {
     "id": "mk-07",
     "category": "makeup",
     "name":        { "zh": "中文商品名", "en": "English Product Name" },
     "brand":       { "zh": "品牌名",     "en": "Brand Name" },
     "description": { "zh": "中文简介",   "en": "English description." },
     "price": 32,
     "image": "new-product.jpg"
   }
   ```

   - `id` just needs to be unique; any short string is fine.
   - `category` must be exactly `"makeup"`, `"skincare"`, or `"haircare"`.
   - `price` can be a number like `32` or `19.99`, or `null` if you'd rather
     not list a price.
   - `image` is the filename inside `images/products/`.
   - If you only have copy in one language, you can still use the shorter
     form `"name": "Some Name"` (a plain string) — the catalog will show
     that same string in both languages.

3. Save the file and refresh the category page.

## How to update hours

- **Home page short line** (e.g. "Open daily 10am – 7pm"):
  edit `hero.hours` in [js/i18n.js](js/i18n.js) (both `zh` and `en`).

- **Full weekly hours table** on [visit.html](visit.html):
  the day labels and time strings are keyed to i18n — edit `visit.days.*` and
  `visit.hours.*` in [js/i18n.js](js/i18n.js). If different days should have
  different times, you can either add new keys (e.g. `visit.hours.wednesday`)
  and reference them in [visit.html](visit.html), or swap the inline text in
  the HTML directly.

## Where store details live

| Value                                  | Where                                                               |
| -------------------------------------- | ------------------------------------------------------------------- |
| Store name (`Tina House`)              | `.logo` text in every HTML file; hero `<h1>` in `index.html`; `title.*` keys in [js/i18n.js](js/i18n.js); brand-page `document.title` suffix in [js/catalog.js](js/catalog.js) |
| Tagline                                | `brand.tagline` in [js/i18n.js](js/i18n.js)                         |
| Address                                | `footer.address` in [js/i18n.js](js/i18n.js); also the Google Maps `href` (all footers + visit.html info-list) and the iframe `src` on `visit.html` |
| Phone                                  | `footer.phone` in [js/i18n.js](js/i18n.js); also the `tel:` `href` (all footers + visit.html info-list) |
| Hero hours line                        | `hero.hours` in [js/i18n.js](js/i18n.js)                            |
| Full weekly hours table                | `visit.days.*` + `visit.hours.*` in [js/i18n.js](js/i18n.js)        |
| Parking note                           | `visit.p_parking` in [js/i18n.js](js/i18n.js)                       |
| About copy                             | `about.*` keys in [js/i18n.js](js/i18n.js)                          |
| Product copy                           | [products.json](products.json)                                      |
| Featured-section heading               | `home.featured_title` in [js/i18n.js](js/i18n.js)                   |
| Brands-section heading                 | `home.brands_title` in [js/i18n.js](js/i18n.js)                     |
| Brand list                             | [brands.json](brands.json) + files in `images/brands/`              |

When the address changes, you need to update:

1. `footer.address` in [js/i18n.js](js/i18n.js) (both `zh` and `en`)
2. The Google Maps `href="https://www.google.com/maps/search/..."` on each
   footer (every HTML file) and in the visit-page info-list
3. The iframe `src` on [visit.html](visit.html)

When the phone changes, update `footer.phone` in i18n.js and every
`href="tel:+..."` — they appear in each footer and in the visit-page
info-list.

### Updating the map

On [visit.html](visit.html), find the `<iframe>` inside `.map-container`. To
replace it with your real location:

1. Go to <https://www.google.com/maps> and search for the store address.
2. Click **Share → Embed a map → Copy HTML**.
3. Paste the copied `src="..."` value over the existing `src` on the iframe.

### Re-skinning colors

All colors are defined as CSS variables at the top of
[css/styles.css](css/styles.css), under `:root { ... }`. Changing `--accent`
and `--accent-soft` re-tints hovers and the product image backgrounds.

### Changing the default language

[js/i18n.js](js/i18n.js) has a `DEFAULT_LANG = 'zh'` constant near the top.
Change it to `'en'` if you'd rather English be the default. Note that the
HTML files still contain Mandarin defaults — if you want no-JS users to see
English first, you'd also need to swap the inline text in the HTML.

## Deploy to Netlify (drag & drop)

1. Go to <https://app.netlify.com/drop>.
2. Drag the entire project folder onto the page.
3. Netlify publishes it and gives you a URL within a few seconds.

To use a custom domain, open the site in the Netlify dashboard → **Domain
settings → Add custom domain**, then follow the DNS instructions.

## Deploy elsewhere

- **Vercel:** `vercel deploy` from this folder, or drag-and-drop via the
  dashboard. No framework settings needed — pick "Other" if asked.
- **GitHub Pages:** push this folder to a repo, then enable Pages in the repo
  settings and choose the branch & root folder.

Because everything is static, any static host will work.
