/* =========================================================
   Tina House — catalog.js
   Handles:
     1. Mobile hamburger nav toggle
     2. Loading products.json and brands.json (only what each page needs)
     3. Rendering:
          - category grids (one category per page)
          - the featured grid on the homepage (featured: true)
          - the brand strip on the homepage (links to brand.html)
          - the dynamic brand page (brand.html?brand=<slug>)
     4. Re-rendering on 'langchange'.
   ========================================================= */

(function () {
  var productsCache = null;
  var brandsCache = null;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[c];
    });
  }

  function formatPrice(price) {
    if (price == null) return '';
    return '$' + Number(price).toFixed(2);
  }

  function currentLang() {
    if (typeof window.getLang === 'function') return window.getLang();
    return (document.documentElement.lang === 'en') ? 'en' : 'zh';
  }

  function pickLang(field, lang) {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object') {
      return field[lang] || field.zh || field.en || '';
    }
    return '';
  }

  function translateKey(key) {
    if (typeof window.translate === 'function') return window.translate(key);
    return key;
  }

  function slugify(s) {
    return String(s).toLowerCase().trim()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function renderCard(product, lang, options) {
    options = options || {};
    var showPrice = options.showPrice !== false;

    var name = pickLang(product.name, lang);
    var brand = pickLang(product.brand, lang);
    var description = pickLang(product.description, lang);

    var priceHtml = (showPrice && product.price != null)
      ? '<p class="product-price">' + escapeHtml(formatPrice(product.price)) + '</p>'
      : '';

    return (
      '<article class="product-card">' +
        '<div class="product-image">' +
          '<img src="images/products/' + escapeHtml(product.image) +
          '" alt="' + escapeHtml(name) + '" loading="lazy">' +
        '</div>' +
        '<div class="product-info">' +
          '<p class="product-brand">' + escapeHtml(brand) + '</p>' +
          '<h3 class="product-name">' + escapeHtml(name) + '</h3>' +
          '<p class="product-description">' + escapeHtml(description) + '</p>' +
          priceHtml +
        '</div>' +
      '</article>'
    );
  }

  function renderProductGrid() {
    var grid = document.querySelector('[data-product-grid]');
    if (!grid || !productsCache) return;

    var category = grid.getAttribute('data-product-grid');
    var lang = currentLang();
    var filtered = productsCache.filter(function (p) {
      return p.category === category;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="loading">' + escapeHtml(translateKey('cat.empty')) + '</p>';
      return;
    }

    grid.innerHTML = filtered.map(function (p) {
      return renderCard(p, lang);
    }).join('');
  }

  function renderFeaturedGrid() {
    var grid = document.querySelector('[data-featured-grid]');
    if (!grid || !productsCache) return;

    var lang = currentLang();
    var filtered = productsCache.filter(function (p) {
      return p.featured === true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="loading">' + escapeHtml(translateKey('cat.empty')) + '</p>';
      return;
    }

    grid.innerHTML = filtered.map(function (p) {
      return renderCard(p, lang, { showPrice: false });
    }).join('');
  }

  function renderBrandStrip() {
    var strip = document.querySelector('[data-brand-strip]');
    if (!strip || !brandsCache) return;

    strip.innerHTML = brandsCache.map(function (b) {
      var slug = b.slug || slugify(b.name);
      return (
        '<a class="brand-link" href="brand.html?brand=' + encodeURIComponent(slug) + '">' +
          '<img src="images/' + escapeHtml(b.logo) +
          '" alt="' + escapeHtml(b.name) + '" loading="lazy">' +
        '</a>'
      );
    }).join('');
  }

  function findBrandBySlug(slug) {
    if (!brandsCache) return null;
    for (var i = 0; i < brandsCache.length; i++) {
      var b = brandsCache[i];
      var bSlug = b.slug || slugify(b.name);
      if (bSlug === slug) return b;
    }
    return null;
  }

  function matchesBrand(product, brandEntry, slug) {
    var brandEn = pickLang(product.brand, 'en');
    var brandZh = pickLang(product.brand, 'zh');
    if (brandEntry) {
      return brandEn === brandEntry.name || brandZh === brandEntry.name;
    }
    return slugify(brandEn) === slug;
  }

  function humanizeSlug(slug) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  function renderBrandPage() {
    var page = document.querySelector('[data-brand-page]');
    if (!page || !productsCache) return;

    var params = new URLSearchParams(window.location.search);
    var slug = (params.get('brand') || '').toLowerCase();
    var lang = currentLang();

    var brandEntry = findBrandBySlug(slug);
    var filtered = productsCache.filter(function (p) {
      return matchesBrand(p, brandEntry, slug);
    });

    var displayName;
    if (brandEntry) {
      displayName = brandEntry.name;
    } else if (filtered.length > 0) {
      displayName = pickLang(filtered[0].brand, lang);
    } else if (slug) {
      displayName = humanizeSlug(slug);
    } else {
      displayName = translateKey('brand.heading_fallback');
    }

    var nameEl = document.querySelector('[data-brand-name]');
    if (nameEl) nameEl.textContent = displayName;

    var logoEl = document.querySelector('[data-brand-logo]');
    if (logoEl) {
      if (brandEntry && brandEntry.logo) {
        logoEl.src = 'images/' + brandEntry.logo;
        logoEl.alt = displayName;
        logoEl.hidden = false;
      } else {
        logoEl.hidden = true;
      }
    }

    document.title = displayName + ' — Tina House';

    var grid = document.querySelector('[data-brand-page-products]');
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="loading">' + escapeHtml(translateKey('brand.no_products')) + '</p>';
      return;
    }

    grid.innerHTML = filtered.map(function (p) {
      return renderCard(p, lang);
    }).join('');
  }

  function renderAll() {
    renderProductGrid();
    renderFeaturedGrid();
    renderBrandStrip();
    renderBrandPage();
  }

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function initBottomNav() {
    var catToggle = document.querySelector('[data-cat-toggle]');
    var catPanel = document.getElementById('cat-panel');
    var catBackdrop = document.querySelector('[data-cat-backdrop]');
    if (!catToggle || !catPanel || !catBackdrop) return;

    function openPanel() {
      catPanel.classList.add('is-open');
      catBackdrop.classList.add('is-open');
      catPanel.setAttribute('aria-hidden', 'false');
      catToggle.setAttribute('aria-expanded', 'true');
    }

    function closePanel() {
      catPanel.classList.remove('is-open');
      catBackdrop.classList.remove('is-open');
      catPanel.setAttribute('aria-hidden', 'true');
      catToggle.setAttribute('aria-expanded', 'false');
    }

    catToggle.addEventListener('click', function () {
      if (catPanel.classList.contains('is-open')) {
        closePanel();
      } else {
        openPanel();
      }
    });

    catBackdrop.addEventListener('click', closePanel);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && catPanel.classList.contains('is-open')) {
        closePanel();
      }
    });
  }

  function fetchJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function loadData() {
    var needsProducts = !!document.querySelector('[data-product-grid]')
                     || !!document.querySelector('[data-featured-grid]')
                     || !!document.querySelector('[data-brand-page]');
    var needsBrands = !!document.querySelector('[data-brand-strip]')
                    || !!document.querySelector('[data-brand-page]');

    var productsReady = needsProducts
      ? fetchJson('products.json')
          .then(function (d) { productsCache = d; })
          .catch(function (err) {
            console.error('Failed to load products:', err);
            var msg = '<p class="loading">' + escapeHtml(translateKey('cat.error')) + '</p>';
            ['[data-product-grid]', '[data-featured-grid]', '[data-brand-page-products]'].forEach(function (sel) {
              var el = document.querySelector(sel);
              if (el) el.innerHTML = msg;
            });
          })
      : Promise.resolve();

    var brandsReady = needsBrands
      ? fetchJson('brands.json')
          .then(function (d) { brandsCache = d; })
          .catch(function (err) {
            console.error('Failed to load brands:', err);
            /* Brand strip is decorative; brand page falls back to slug match. */
          })
      : Promise.resolve();

    Promise.all([productsReady, brandsReady]).then(renderAll);
  }

  document.addEventListener('langchange', renderAll);

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initBottomNav();
    loadData();
  });
})();
