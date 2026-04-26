/* =========================================================
   Tina House — i18n.js
   Owns all translatable UI text and the language-toggle logic.

   TO EDIT COPY in either language, change the strings in the
   I18N object below. HTML files hold Mandarin defaults for
   no-JS users; the values here override them on load.
   ========================================================= */

(function () {
  var STORAGE_KEY = 'rp.lang';
  var DEFAULT_LANG = 'zh';

  window.I18N = {
    zh: {
      /* Navigation */
      'nav.home':       '首页',
      'nav.categories': '分类',
      'nav.makeup':     '彩妆',
      'nav.skincare':   '护肤',
      'nav.haircare':   '护发',
      'nav.brands':     '品牌',
      'nav.visit':      '地址',
      'nav.toggle_aria': '切换菜单',
      'nav.primary_aria': '主导航',

      /* Language toggle */
      'toggle.switch_to': 'EN',
      'toggle.aria':      '切换到英文',

      /* Page titles (set on <title> elements) */
      'title.home':     'Tina House — 邻家美妆小铺',
      'title.makeup':   '彩妆 — Tina House',
      'title.skincare': '护肤 — Tina House',
      'title.haircare': '护发 — Tina House',
      'title.visit':    '地址 — Tina House',
      'title.brand':    '品牌 — Tina House',
      'title.brands':   '品牌 — Tina House',

      /* Home page */
      'brand.tagline':        '邻家美妆小铺。',
      'hero.hours':           '每日营业 上午10点 – 晚上7点',
      'home.featured_title':  '精选',

      /* Brands index page */
      'brands_page.heading':    '按品牌搜索',

      /* Brand page (single brand) */
      'brand.heading_fallback': '品牌',
      'brand.no_products':      '暂无该品牌商品。',

      /* Category pages */
      'cat.makeup.heading':   '彩妆',
      'cat.makeup.tagline':   '精选色彩与质地，从日常必备到正式场合的点缀。',
      'cat.skincare.heading': '护肤',
      'cat.skincare.tagline': '日常护理与周度修护，配方干净，效果扎实。',
      'cat.haircare.heading': '护发',
      'cat.haircare.tagline': '洗、护、造型一站备齐，适合各种发质与日常习惯。',
      'cat.loading':          '正在加载商品…',
      'cat.empty':            '此分类暂无商品。',
      'cat.error':            '抱歉，无法加载商品列表。如直接打开文件，请改用本地服务器（详见 README）。',

      /* Visit page */
      'visit.heading':       '到店',
      'visit.tagline':       '欢迎到店里看看。',
      'visit.label_address': '地址',
      'visit.label_phone':   '电话',
      'visit.h_hours':       '营业时间',
      'visit.days.mon':      '周一',
      'visit.days.tue':      '周二',
      'visit.days.wed':      '周三',
      'visit.days.thu':      '周四',
      'visit.days.fri':      '周五',
      'visit.days.sat':      '周六',
      'visit.days.sun':      '周日',
      'visit.hours.weekday': '上午10点 – 晚上7点',
      'visit.h_map':         '地图导航',
      'visit.h_parking':     '停车',
      'visit.p_parking':     '店铺附近有路边停车位与公共停车场，步行几分钟即可到达。',

      /* Footer */
      'footer.address': '41-40 Kissena Boulevard, Flushing, NY 11355',
      'footer.phone':   '(646) 824-1388'
    },

    en: {
      /* Navigation */
      'nav.home':       'Home',
      'nav.categories': 'Categories',
      'nav.makeup':     'Makeup',
      'nav.skincare':   'Skincare',
      'nav.haircare':   'Hair',
      'nav.brands':     'Brands',
      'nav.visit':      'Visit',
      'nav.toggle_aria': 'Toggle menu',
      'nav.primary_aria': 'Primary',

      /* Language toggle */
      'toggle.switch_to': '中',
      'toggle.aria':      'Switch to Mandarin',

      /* Page titles */
      'title.home':     'Tina House — Neighborhood Beauty Boutique',
      'title.makeup':   'Makeup — Tina House',
      'title.skincare': 'Skincare — Tina House',
      'title.haircare': 'Hair — Tina House',
      'title.visit':    'Visit — Tina House',
      'title.brand':    'Brand — Tina House',
      'title.brands':   'Brands — Tina House',

      /* Home page */
      'brand.tagline':       'A neighborhood beauty boutique.',
      'hero.hours':          'Open daily 10am – 7pm',
      'home.featured_title': 'Featured',

      /* Brands index page */
      'brands_page.heading':    'Search By Brand',

      /* Brand page (single brand) */
      'brand.heading_fallback': 'Brand',
      'brand.no_products':      'No products found.',

      /* Category pages */
      'cat.makeup.heading':   'Makeup',
      'cat.makeup.tagline':   'Curated colors and finishes, from everyday essentials to special-occasion polish.',
      'cat.skincare.heading': 'Skincare',
      'cat.skincare.tagline': 'Daily rituals and weekly treatments, chosen for clean formulas and real results.',
      'cat.haircare.heading': 'Hair',
      'cat.haircare.tagline': 'Shampoo, styling, and treatments for every texture and routine.',
      'cat.loading':          'Loading products…',
      'cat.empty':            'No products in this category yet.',
      'cat.error':            'Sorry, we couldn’t load the catalog. If you opened this file directly, try running a local server (see the README).',

      /* Visit page */
      'visit.heading':       'Visit',
      'visit.tagline':       'We’d love to see you in the shop.',
      'visit.label_address': 'Address',
      'visit.label_phone':   'Phone',
      'visit.h_hours':       'Hours',
      'visit.days.mon':      'Monday',
      'visit.days.tue':      'Tuesday',
      'visit.days.wed':      'Wednesday',
      'visit.days.thu':      'Thursday',
      'visit.days.fri':      'Friday',
      'visit.days.sat':      'Saturday',
      'visit.days.sun':      'Sunday',
      'visit.hours.weekday': '10am – 7pm',
      'visit.h_map':         'Find us',
      'visit.h_parking':     'Parking',
      'visit.p_parking':     'Street parking and public lots are available nearby within a short walk.',

      /* Footer */
      'footer.address': '41-40 Kissena Boulevard, Flushing, NY 11355',
      'footer.phone':   '(646) 824-1388'
    }
  };

  function getStoredLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return (v === 'en' || v === 'zh') ? v : DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function translate(key, lang) {
    var bundle = window.I18N[lang] || window.I18N[DEFAULT_LANG];
    return (bundle && bundle[key] != null) ? bundle[key] : key;
  }

  function applyTranslations(lang) {
    document.documentElement.lang = (lang === 'en') ? 'en' : 'zh-Hans';
    document.documentElement.setAttribute('data-lang', lang);

    var textEls = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textEls.length; i++) {
      var el = textEls[i];
      var key = el.getAttribute('data-i18n');
      var val = translate(key, lang);
      if (el.tagName === 'TITLE') {
        document.title = val;
      } else {
        el.textContent = val;
      }
    }

    var ariaEls = document.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < ariaEls.length; j++) {
      var ael = ariaEls[j];
      ael.setAttribute('aria-label', translate(ael.getAttribute('data-i18n-aria'), lang));
    }
  }

  function setLang(lang) {
    saveLang(lang);
    applyTranslations(lang);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  function initToggle() {
    var btn = document.querySelector('[data-lang-toggle]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = (getStoredLang() === 'zh') ? 'en' : 'zh';
      setLang(next);
    });
  }

  /* Expose a small helper so catalog.js (and future scripts) can read lang. */
  window.getLang = getStoredLang;
  window.translate = function (key) { return translate(key, getStoredLang()); };

  /* Script is loaded at end of body; DOM is already parsed. */
  applyTranslations(getStoredLang());
  initToggle();
})();
