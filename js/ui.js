/* ============================================================
   ui.js — cursor, nav, hybrid routing, scroll reveal,
            water level, eco toggle, progress bar
   ============================================================ */

(function () {

  var hasSpaPages = !!document.querySelector('.page');

  /* ── CURSOR ── */
  var cd = document.getElementById('cd'), cr = document.getElementById('cr');
  var mx = 0, my = 0, rx = 0, ry = 0;
  var hasHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  if (hasHover && cd && cr) {
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cd.style.left = mx + 'px'; cd.style.top = my + 'px';
    }, { passive: true });

    (function cursorLoop() {
      if (!window.AR_PAUSED) {
        rx += (mx - rx) * .09;
        ry += (my - ry) * .09;
        cr.style.left = rx + 'px';
        cr.style.top  = ry + 'px';
      }
      requestAnimationFrame(cursorLoop);
    })();

    document.querySelectorAll('a,button,.ac,.qi,.sl2,.spp,.pc').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('hov'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('hov'); });
    });
  }

  /* ── MOBILE NAV ── */
  var bg = document.getElementById('burger'), nm = document.getElementById('nmob');

  function closeMenu() {
    if (!bg || !nm) return;
    bg.classList.remove('open');
    nm.classList.remove('open');
    bg.setAttribute('aria-expanded', 'false');
    nm.setAttribute('aria-hidden', 'true');
  }

  if (bg && nm) {
    bg.addEventListener('click', function () {
      var o = bg.classList.toggle('open');
      nm.classList.toggle('open', o);
      bg.setAttribute('aria-expanded', o);
      nm.setAttribute('aria-hidden', !o);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeMenu();
    }, { passive: true });
  }

  /* ── PAGE ROUTING (SPA root page + standalone fallback) ── */
  var pageMap = {
    '':            'home',
    '/':           'home',
    '/ara':        'ara',
    '/ara/':       'ara',
    '/rhyssa':     'companion',
    '/rhyssa/':    'companion',
    '/companion':  'companion',
    '/companion/': 'companion',
    '/about':      'about',
    '/about/':     'about',
    '/privacy':    'privacy',
    '/privacy/':   'privacy',
    '/terms':      'terms',
    '/terms/':     'terms',
    '/reading':    'reading',
    '/reading/':   'reading',
    '/tools':      'tools',
    '/tools/':     'tools',
    '/mytank':     'mytank',
    '/mytank/':    'mytank'
  };

  var titleMap = {
    'home':      'Aquatic Rhythm — Ecological Care for Small Aquariums',
    'ara':       'Aquatic Rhythm Alignment — Reading Aquarium Ecology',
    'companion': 'Rhyssa — AI Aquarium Companion',
    'about':     'About — Aquatic Rhythm',
    'privacy':   'Privacy Policy — Aquatic Rhythm',
    'terms':     'Terms of Use — Aquatic Rhythm',
    'reading':   'Reading — Aquarium Ecology Guides',
    'tools':     'Labs & Tools — Aquatic Rhythm',
    'mytank':    'My Tank — Aquatic Rhythm'
  };

  var descMap = {
    'home':      'Plain-language ecology for home aquariums: read water, plants, fish, and bacteria together. Guides, ARA, tools, and optional help from Rhyssa.',
    'ara':       'ARA is a framework for closed-loop aquariums — phase, ecological tolerance, keeper rhythm, and timing before big moves.',
    'companion': 'Rhyssa is an AI aquarium companion shaped by ARA. She helps you interpret what your ecosystem is doing — without rushing to a single fix.',
    'about':     'Why Aquatic Rhythm exists — from uneven advice to a calmer, ecology-first way of reading small tanks.',
    'privacy':   'Privacy Policy for Aquatic Rhythm. What we collect, how it is handled, and what it means for you.',
    'terms':     'Terms of Use for Aquatic Rhythm and Rhyssa. Written plainly, without unnecessary complexity.',
    'reading':   'Short aquarium ecology guides — modular, mobile-friendly, grounded in ARA.',
    'tools':     'Interactive aquarium simulators and planners. Try decisions on screen before you make them in the tank.',
    'mytank':    'Track your aquarium water parameters, log maintenance, and assess your ARA phase — stored privately on your device.'
  };

  function updateMeta(id) {
    var desc = document.getElementById('meta-desc');
    if (desc && descMap[id]) desc.setAttribute('content', descMap[id]);
  }

  function updateBottomNav(id) {
    document.querySelectorAll('.bnav-item').forEach(function (item) {
      var tab = item.getAttribute('data-bnav');
      item.classList.toggle('active', tab === id);
      item.setAttribute('aria-current', tab === id ? 'page' : 'false');
    });
  }

  function go(id, push) {
    var path = id === 'home' ? '/' : '/' + id;

    if (!hasSpaPages) {
      if (push !== false) window.location.href = path;
      return;
    }

    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    var t = document.getElementById('pg-' + id);
    if (!t) return;
    t.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'auto' });
    closeMenu();
    updateBottomNav(id);
    setTimeout(function () { observeScrollReveal(t); }, 80);

    if (titleMap[id]) document.title = titleMap[id];
    updateMeta(id);

    if (push !== false) history.pushState({ page: id }, '', path);

    var can = document.querySelector('link[rel="canonical"]');
    if (can) can.setAttribute('href', 'https://aquaticrhythm.com' + path);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', { page_path: path, page_title: id });
    }

    setTimeout(updateWaterLevel, 100);
  }

  window.go = go;

  if (hasSpaPages) {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-page]');
      if (!link) return;
      e.preventDefault();
      go(link.getAttribute('data-page'));
    });

    window.addEventListener('popstate', function (e) {
      var id = (e.state && e.state.page) ? e.state.page : pageMap[location.pathname] || 'home';
      go(id, false);
    });

    (function () {
      var params = new URLSearchParams(location.search);
      var pParam = params.get('p');
      var id = (pParam && pageMap['/' + pParam]) ? pageMap['/' + pParam] : pageMap[location.pathname] || 'home';
      if (pParam) {
        var cleanPath = '/' + pParam;
        try { history.replaceState({ page: id }, '', cleanPath); } catch (e) {}
      }
      var active = document.querySelector('.page.active');
      if (active) active.classList.remove('active');
      var t = document.getElementById('pg-' + id);
      if (t) {
        t.classList.add('active');
        updateBottomNav(id);
        if (titleMap[id]) document.title = titleMap[id];
        updateMeta(id);
        try { history.replaceState({ page: id }, '', location.pathname); } catch (e) {}
        var path = id === 'home' ? '/' : '/' + id;
        var can = document.querySelector('link[rel="canonical"]');
        if (can) can.setAttribute('href', 'https://aquaticrhythm.com' + path);
        if (typeof gtag !== 'undefined') {
          gtag('event', 'page_view', { page_path: path, page_title: titleMap[id] || id });
        }
      }
    })();
  }

  /* ── SCROLL REVEAL ── */
  var currentObserver = null;

  function observeScrollReveal(scope) {
    scope = scope || document;
    scope.querySelectorAll('.sr').forEach(function (el) { el.classList.remove('in'); });
    if (currentObserver) currentObserver.disconnect();
    currentObserver = new IntersectionObserver(function (entries, ob) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ob.unobserve(e.target); }
      });
    }, { threshold: .07, rootMargin: '0px 0px -24px 0px' });
    scope.querySelectorAll('.sr').forEach(function (el) { currentObserver.observe(el); });
  }

  (function () {
    var active = hasSpaPages ? document.querySelector('.page.active') : document;
    if (active) observeScrollReveal(active);
  })();


  /* ── WATER LEVEL ── */
  function updateWaterLevel() {
    var fill   = document.getElementById('water-fill');
    var bubble = document.getElementById('water-bubble');
    if (!fill) return;
    var page = hasSpaPages ? document.querySelector('.page.active') : document.documentElement;
    if (!page) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docH = (page.scrollHeight || document.documentElement.scrollHeight) - window.innerHeight;
    if (docH <= 0) { fill.style.height = '100%'; return; }
    var pct = Math.min(100, Math.max(0, (scrollTop / docH) * 100));
    fill.style.height = pct + '%';
    if (bubble) {
      if (pct > 2 && pct < 98) { bubble.style.bottom = pct + '%'; bubble.style.opacity = '1'; }
      else { bubble.style.opacity = '0'; }
    }
  }

  window.addEventListener('scroll', updateWaterLevel, { passive: true });
  updateWaterLevel();

  /* ── ECOSYSTEM TOGGLE ── */
  (function () {
    var faunaBtn  = document.getElementById('fauna-btn');
    var floraBtn  = document.getElementById('flora-btn');
    var fishLayer = document.getElementById('fish-layer');
    var plants    = document.getElementById('plants');
    var driftwood = document.getElementById('driftwood-layer');
    if (!faunaBtn || !floraBtn) return;

    var faunaOff = localStorage.getItem('ar_fauna') === '0';
    var floraOff = localStorage.getItem('ar_flora') === '0';

    function applyFauna(off) {
      faunaOff = off;
      faunaBtn.classList.toggle('off', off);
      faunaBtn.setAttribute('aria-pressed', off ? 'true' : 'false');
      faunaBtn.title = off ? 'Show fish' : 'Hide fish';
      if (fishLayer) { fishLayer.style.transition = 'opacity .6s'; fishLayer.style.opacity = off ? '0' : ''; }
      localStorage.setItem('ar_fauna', off ? '0' : '1');
    }

    function applyFlora(off) {
      floraOff = off;
      floraBtn.classList.toggle('off', off);
      floraBtn.setAttribute('aria-pressed', off ? 'true' : 'false');
      floraBtn.title = off ? 'Show plants' : 'Hide plants';
      if (plants)    { plants.style.transition    = 'opacity .6s'; plants.style.opacity    = off ? '0' : ''; }
      if (driftwood) { driftwood.style.transition = 'opacity .6s'; driftwood.style.opacity = off ? '0' : ''; }
      localStorage.setItem('ar_flora', off ? '0' : '1');
    }

    faunaBtn.addEventListener('click', function (e) { e.stopPropagation(); applyFauna(!faunaOff); });
    floraBtn.addEventListener('click', function (e) { e.stopPropagation(); applyFlora(!floraOff); });

    if (faunaOff) applyFauna(true);
    if (floraOff) applyFlora(true);
  })();


  /* ── READING PATHWAYS + CONTINUE STATE ── */
  (function () {
    var STORAGE_KEY = 'ar_last_location';

    function saveCurrentLocation() {
      try {
        var title = document.title || '';
        var path = window.location.pathname + window.location.hash;
        var type = window.location.pathname.indexOf('/articles/') === 0 ? 'article' : 'page';
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ href: path, title: title, type: type }));
      } catch (e) {}
    }

    function hydrateContinueCard() {
      var wrap = document.getElementById('continue-reading');
      var link = document.getElementById('continue-link');
      var copy = document.getElementById('continue-copy');
      if (!wrap || !link || !copy) return;
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        var last = JSON.parse(raw);
        if (!last || !last.href) return;
        if (last.href === window.location.pathname + window.location.hash) return;
        wrap.classList.add('show');
        link.href = last.href;
        copy.textContent = 'Resume from: ' + (last.title || last.href);
      } catch (e) {}
    }

    function trackIntentClick(e) {
      var el = e.target.closest('[data-analytics-event]');
      if (!el || typeof gtag === 'undefined') return;
      gtag('event', el.getAttribute('data-analytics-event'), {
        pathway: el.getAttribute('data-pathway') || '',
        cta: el.getAttribute('data-cta') || '',
        destination: el.getAttribute('href') || ''
      });
    }

    hydrateContinueCard();
    saveCurrentLocation();
    document.addEventListener('click', trackIntentClick);
  })();

  /* ── MY TANK ── */
  (function () {
    var MT_KEY = 'ar_mytank';

    function loadData() {
      try { return JSON.parse(localStorage.getItem(MT_KEY)) || {}; } catch (e) { return {}; }
    }
    function saveData(d) {
      try { localStorage.setItem(MT_KEY, JSON.stringify(d)); } catch (e) {}
    }

    function fmt(v, decimals) {
      if (v === null || v === undefined || v === '') return '—';
      return parseFloat(v).toFixed(decimals !== undefined ? decimals : 1);
    }

    function assessPhase(entry) {
      if (!entry) return null;
      var nh3 = parseFloat(entry.ammonia);
      var no2 = parseFloat(entry.nitrite);
      var no3 = parseFloat(entry.nitrate);
      if (isNaN(nh3) && isNaN(no2)) return null;
      nh3 = isNaN(nh3) ? 0 : nh3;
      no2 = isNaN(no2) ? 0 : no2;
      no3 = isNaN(no3) ? 999 : no3;
      if (nh3 > 0.5 || no2 > 0.25) return 'establish';
      if (nh3 > 0 || no2 > 0) return 'stabilise';
      if (no3 > 20) return 'stabilise';
      if (no3 > 10) return 'optimise';
      return 'sustain';
    }

    var phaseInfo = {
      establish:  { label: 'Phase 1 — Establishing', desc: 'Your tank is still cycling. Ammonia or nitrite are elevated — give the biology time to establish. Avoid adding fish.', color: 'rgba(220,140,60,.9)' },
      stabilise:  { label: 'Phase 2 — Stabilising',  desc: 'Cycle is completing. Parameters are dropping toward zero — maintain routine and avoid big changes.', color: 'rgba(200,190,60,.9)' },
      optimise:   { label: 'Phase 3 — Optimising',   desc: 'Tank is stable. Focus on rhythm: consistent maintenance, observing behaviour, refining conditions.', color: 'rgba(61,214,232,.9)' },
      sustain:    { label: 'Phase 4 — Sustaining',   desc: 'Ecosystem is mature. Your rhythm is aligned. Maintain, observe, and resist unnecessary interventions.', color: 'rgba(100,200,82,.9)' }
    };

    function tankAge(dateStr) {
      if (!dateStr) return '';
      var then = new Date(dateStr);
      var now = new Date();
      var days = Math.floor((now - then) / 86400000);
      if (days < 1) return 'set up today';
      if (days === 1) return '1 day old';
      if (days < 30) return days + ' days old';
      var months = Math.floor(days / 30);
      if (months === 1) return '1 month old';
      if (months < 24) return months + ' months old';
      return Math.floor(months / 12) + ' years old';
    }

    var maintLabels = { water_change: 'Water change', filter: 'Filter', feeding: 'Feeding', treatment: 'Treatment', observation: 'Observation', other: 'Other' };

    function renderDashboard() {
      var d = loadData();
      if (!d.profile) {
        document.getElementById('mt-empty') && (document.getElementById('mt-empty').style.display = '');
        document.getElementById('mt-dashboard') && (document.getElementById('mt-dashboard').style.display = 'none');
        return;
      }
      document.getElementById('mt-empty') && (document.getElementById('mt-empty').style.display = 'none');
      document.getElementById('mt-dashboard') && (document.getElementById('mt-dashboard').style.display = '');

      var p = d.profile;
      var nameEl = document.getElementById('mt-tank-name');
      var infoEl = document.getElementById('mt-tank-info');
      if (nameEl) nameEl.textContent = p.name || 'My Tank';
      if (infoEl) infoEl.textContent = [(p.volume ? p.volume + ' ' + (p.unit || 'L') : ''), p.type, tankAge(p.setupDate)].filter(Boolean).join(' · ');

      var log = d.waterLog || [];
      var latest = log.length ? log[log.length - 1] : null;
      var paramsCard = document.getElementById('mt-params-card');
      var noReadings = document.getElementById('mt-no-readings');
      if (paramsCard && noReadings) {
        paramsCard.style.display = latest ? '' : 'none';
        noReadings.style.display = latest ? 'none' : '';
      }
      if (latest) {
        var setVal = function (id, val, dec) { var el = document.getElementById(id); if (el) el.textContent = fmt(val, dec); };
        setVal('mt-val-ph', latest.ph, 1);
        setVal('mt-val-nh3', latest.ammonia, 2);
        setVal('mt-val-no2', latest.nitrite, 2);
        setVal('mt-val-no3', latest.nitrate, 0);
        setVal('mt-val-temp', latest.temp, 1);
        var dateEl = document.getElementById('mt-params-date');
        if (dateEl) dateEl.textContent = latest.date || '';
      }

      var phase = assessPhase(latest);
      var phaseCard = document.getElementById('mt-phase-card');
      var phaseBadge = document.getElementById('mt-phase-badge');
      var phaseDesc = document.getElementById('mt-phase-desc');
      if (phaseCard && phaseBadge && phaseDesc) {
        if (phase && phaseInfo[phase]) {
          var info = phaseInfo[phase];
          phaseBadge.textContent = info.label;
          phaseBadge.style.color = info.color;
          phaseDesc.textContent = info.desc;
        } else {
          phaseBadge.textContent = '—';
          phaseBadge.style.color = '';
          phaseDesc.textContent = 'Log a water reading to assess your tank\'s current phase.';
        }
      }

      var maint = d.maintenanceLog || [];
      var maintList = document.getElementById('mt-maint-list');
      if (maintList) {
        if (!maint.length) {
          maintList.innerHTML = '<li class="mt-maint-empty">No entries yet.</li>';
        } else {
          var sorted = maint.slice().sort(function (a, b) { return b.date > a.date ? 1 : -1; });
          maintList.innerHTML = sorted.slice(0, 8).map(function (m) {
            return '<li class="mt-maint-item"><span class="mt-maint-type">' + (maintLabels[m.type] || m.type) + '</span><span class="mt-maint-note">' + (m.note || '') + '</span><span class="mt-maint-date">' + (m.date || '') + '</span></li>';
          }).join('');
        }
      }

      var histList = document.getElementById('mt-history-list');
      var histWrap = document.getElementById('mt-history-wrap');
      if (histWrap) histWrap.style.display = log.length > 1 ? '' : 'none';
      if (histList && log.length) {
        var rev = log.slice().reverse().slice(1, 8);
        histList.innerHTML = rev.map(function (e) {
          return '<li class="mt-history-item"><span class="mt-maint-date">' + (e.date || '') + '</span><span class="mt-history-params">pH ' + fmt(e.ph, 1) + ' · NH₃ ' + fmt(e.ammonia, 2) + ' · NO₂ ' + fmt(e.nitrite, 2) + ' · NO₃ ' + fmt(e.nitrate, 0) + (e.temp ? ' · ' + fmt(e.temp, 1) + '°C' : '') + '</span>' + (e.note ? '<span class="mt-history-note">' + e.note + '</span>' : '') + '</li>';
        }).join('');
      }
    }

    function openModal(id) {
      var modal = document.getElementById(id);
      var backdrop = document.getElementById('mt-backdrop');
      if (!modal) return;
      modal.removeAttribute('aria-hidden');
      modal.classList.add('open');
      if (backdrop) { backdrop.classList.add('open'); backdrop.removeAttribute('aria-hidden'); }
      document.body.style.overflow = 'hidden';
      var first = modal.querySelector('input,select,textarea,button');
      if (first) first.focus();
    }

    function closeModal(id) {
      var modal = document.getElementById(id);
      var backdrop = document.getElementById('mt-backdrop');
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('open');
      if (backdrop) { backdrop.classList.remove('open'); backdrop.setAttribute('aria-hidden', 'true'); }
      document.body.style.overflow = '';
    }

    function closeAllModals() {
      ['mt-modal-setup', 'mt-modal-log', 'mt-modal-maint'].forEach(closeModal);
    }

    function todayStr() {
      return new Date().toISOString().slice(0, 10);
    }

    document.addEventListener('click', function (e) {
      var target = e.target;
      if (target.id === 'mt-setup-open') { openModal('mt-modal-setup'); return; }
      if (target.id === 'mt-log-open' || target.id === 'mt-log-open-2') {
        var logDate = document.getElementById('mt-log-date');
        if (logDate && !logDate.value) logDate.value = todayStr();
        openModal('mt-modal-log');
        return;
      }
      if (target.id === 'mt-maint-open') {
        var maintDate = document.getElementById('mt-maint-date');
        if (maintDate && !maintDate.value) maintDate.value = todayStr();
        openModal('mt-modal-maint');
        return;
      }
      if (target.id === 'mt-tank-edit') {
        var d = loadData();
        var p = d.profile || {};
        var inp = function (id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; };
        inp('mt-inp-name', p.name);
        inp('mt-inp-volume', p.volume);
        inp('mt-inp-date', p.setupDate);
        var typeEl = document.getElementById('mt-inp-type');
        if (typeEl && p.type) typeEl.value = p.type;
        var unitEl = document.getElementById('mt-inp-unit');
        if (unitEl && p.unit) unitEl.value = p.unit;
        openModal('mt-modal-setup');
        return;
      }
      if (target.id === 'mt-history-toggle') {
        var histList = document.getElementById('mt-history-list');
        var showing = target.textContent.trim() === 'Hide';
        target.textContent = showing ? 'Show' : 'Hide';
        if (histList) histList.style.display = showing ? 'none' : '';
        return;
      }
      if (target.id === 'mt-reset-tank') {
        if (confirm('Delete all tank data? This cannot be undone.')) {
          saveData({});
          renderDashboard();
        }
        return;
      }
      if (target.id === 'mt-backdrop' || target.dataset.modalClose) {
        closeAllModals();
        return;
      }
    });

    var formSetup = document.getElementById('mt-form-setup');
    if (formSetup) {
      formSetup.addEventListener('submit', function (e) {
        e.preventDefault();
        var d = loadData();
        d.profile = {
          name:      (document.getElementById('mt-inp-name') || {}).value || 'My Tank',
          volume:    (document.getElementById('mt-inp-volume') || {}).value || '',
          unit:      (document.getElementById('mt-inp-unit') || {}).value || 'L',
          type:      (document.getElementById('mt-inp-type') || {}).value || 'freshwater',
          setupDate: (document.getElementById('mt-inp-date') || {}).value || ''
        };
        saveData(d);
        closeAllModals();
        renderDashboard();
      });
    }

    var formLog = document.getElementById('mt-form-log');
    if (formLog) {
      formLog.addEventListener('submit', function (e) {
        e.preventDefault();
        var d = loadData();
        if (!d.waterLog) d.waterLog = [];
        var g = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
        d.waterLog.push({
          date:     g('mt-log-date') || todayStr(),
          ph:       g('mt-log-ph'),
          ammonia:  g('mt-log-nh3'),
          nitrite:  g('mt-log-no2'),
          nitrate:  g('mt-log-no3'),
          temp:     g('mt-log-temp'),
          note:     g('mt-log-note')
        });
        saveData(d);
        document.getElementById('mt-form-log').reset();
        closeAllModals();
        renderDashboard();
      });
    }

    var formMaint = document.getElementById('mt-form-maint');
    if (formMaint) {
      formMaint.addEventListener('submit', function (e) {
        e.preventDefault();
        var d = loadData();
        if (!d.maintenanceLog) d.maintenanceLog = [];
        var g = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
        d.maintenanceLog.push({
          date: g('mt-maint-date') || todayStr(),
          type: g('mt-maint-type') || 'other',
          note: g('mt-maint-note')
        });
        saveData(d);
        document.getElementById('mt-form-maint').reset();
        closeAllModals();
        renderDashboard();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllModals();
    });

    renderDashboard();
  })();

})();
