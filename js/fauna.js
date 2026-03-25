/* ============================================================
   fauna.js — fish animation, single RAF loop
   Depends on: ecosystem.js (AR_TIER, AR_PAUSED)
   ============================================================ */

(function () {

  var fl = document.getElementById('fish-layer');
  var NS = 'http://www.w3.org/2000/svg';
  var TIER = window.AR_TIER || 'high';

  function W() { return window.innerWidth; }
  function H() { return window.innerHeight; }

  function mk(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  /* ── FISH BUILDERS ── */
  function buildAltum(s) {
    s.appendChild(mk('path', { d: 'M2,38 C8,28 16,12 24,2 C32,12 42,28 48,38 C42,48 32,64 24,74 C16,64 8,48 2,38Z', fill: 'rgba(182,200,188,.8)' }));
    s.appendChild(mk('path', { d: 'M16,7 C14,18 14,40 15,58 C16,64 18,70 20,72 C18,70 16,64 16,58 C15,40 16,18 18,7Z', fill: 'rgba(35,45,38,.58)' }));
    s.appendChild(mk('path', { d: 'M24,3 C22,12 22,36 23,56 C24,66 24,72 24,74 C24,72 24,66 25,56 C26,36 26,12 24,3Z', fill: 'rgba(35,45,38,.44)' }));
    s.appendChild(mk('path', { d: 'M32,7 C30,18 30,40 31,58 C32,64 30,70 28,72 C30,70 32,64 32,58 C31,40 32,18 34,7Z', fill: 'rgba(35,45,38,.38)' }));
    s.appendChild(mk('path', { d: 'M2,38 C-5,30 -9,22 -4,16 C0,22 4,30 8,34Z', fill: 'rgba(162,184,170,.62)' }));
    s.appendChild(mk('path', { d: 'M2,38 C-5,46 -9,54 -4,60 C0,54 4,46 8,42Z', fill: 'rgba(162,184,170,.58)' }));
    s.appendChild(mk('circle', { cx: '40', cy: '34', r: '3.2', fill: 'rgba(255,255,255,.9)' }));
    s.appendChild(mk('circle', { cx: '40.4', cy: '34', r: '1.6', fill: 'rgba(6,10,6,.92)' }));
  }

  function buildCongo(s) {
    s.appendChild(mk('path', { d: 'M0,5 Q5,8 0,11 L8,8Z', fill: 'rgba(70,55,110,.8)' }));
    s.appendChild(mk('path', { d: 'M8,8 C8,3 17,0 27,1 C35,2 40,4 41,8 C40,12 35,14 27,15 C17,16 8,13 8,8Z', fill: 'rgba(75,58,118,.82)' }));
    s.appendChild(mk('path', { d: 'M9,6 C17,4 27,4 37,7 C39,8 40,9 40,9 C38,8 27,6 17,7 C13,7 10,7 9,8Z', fill: 'rgba(110,90,200,.72)' }));
    s.appendChild(mk('circle', { cx: '36', cy: '7', r: '2', fill: 'rgba(255,255,255,.9)' }));
    s.appendChild(mk('circle', { cx: '36.2', cy: '7', r: '1', fill: 'rgba(5,4,8,.92)' }));
  }

  function buildCardinal(s) {
    s.appendChild(mk('path', { d: 'M0,3 Q4,6 0,9 L6,6Z', fill: 'rgba(125,55,42,.85)' }));
    s.appendChild(mk('path', { d: 'M6,6 C6,2 13,0 22,1 C29,2 34,4 35,6 C34,8 29,10 22,11 C13,12 6,10 6,6Z', fill: 'rgba(132,58,44,.85)' }));
    s.appendChild(mk('path', { d: 'M7,2 C13,0 22,0 30,3 C32,4 34,5 34,5 C32,4 22,2 13,2Z', fill: 'rgba(25,120,215,.85)' }));
    s.appendChild(mk('path', { d: 'M7,8 C13,9 22,10 30,9 L30,11 C22,12 13,11 7,10Z', fill: 'rgba(210,42,30,.7)' }));
    s.appendChild(mk('circle', { cx: '30', cy: '5', r: '1.7', fill: 'rgba(255,255,255,.9)' }));
    s.appendChild(mk('circle', { cx: '30.2', cy: '5', r: '.85', fill: 'rgba(4,4,4,.92)' }));
  }

  function buildGeo(s) {
    s.appendChild(mk('path', { d: 'M2,12 Q9,18 2,24 L13,18Z', fill: 'rgba(38,140,130,.82)' }));
    s.appendChild(mk('path', { d: 'M13,18 C13,5 24,1 36,1 C50,1 58,8 58,18 C58,28 50,35 36,35 C24,35 13,31 13,18Z', fill: 'rgba(42,155,140,.82)' }));
    [[22, 8, 3], [30, 6, 2.5], [38, 9, 3], [26, 14, 2], [34, 13, 3.5]].forEach(function (sp) {
      s.appendChild(mk('circle', { cx: sp[0], cy: sp[1], r: sp[2], fill: 'rgba(80,220,200,.45)' }));
    });
    s.appendChild(mk('circle', { cx: '48', cy: '10', r: '3.8', fill: 'rgba(255,255,255,.88)' }));
    s.appendChild(mk('circle', { cx: '48.5', cy: '10', r: '1.9', fill: 'rgba(5,15,10,.92)' }));
  }

  function buildOscar(s) {
    s.appendChild(mk('path', { d: 'M2,14 Q9,22 2,30 L13,22Z', fill: 'rgba(175,78,18,.85)' }));
    s.appendChild(mk('path', { d: 'M13,22 C13,7 24,2 34,2 C48,2 60,10 60,22 C60,34 48,42 34,42 C24,42 13,37 13,22Z', fill: 'rgba(185,85,20,.85)' }));
    s.appendChild(mk('path', { d: 'M20,4 C18,12 20,22 18,34', stroke: 'rgba(18,6,1,.42)', 'stroke-width': '5', fill: 'none' }));
    s.appendChild(mk('path', { d: 'M32,3 C30,13 32,23 30,37', stroke: 'rgba(18,6,1,.38)', 'stroke-width': '4', fill: 'none' }));
    s.appendChild(mk('circle', { cx: '50', cy: '13', r: '4', fill: 'rgba(255,255,255,.88)' }));
    s.appendChild(mk('circle', { cx: '50.5', cy: '13', r: '2', fill: 'rgba(8,4,0,.92)' }));
  }

  /* ── ENTITY FACTORIES ── */
  var entities = [];

  function makeSchool(cfg) {
    var vW = W(), vH = H(), goRight = Math.random() > .5;
    var baseY = vH * (cfg.yMin + Math.random() * (cfg.yMax - cfg.yMin));
    var speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);
    var schoolX = goRight ? -(cfg.spreadX + 120) : vW + (cfg.spreadX + 120);
    var members = [];

    for (var i = 0; i < cfg.count; i++) {
      var ox = (Math.random() - .5) * cfg.spreadX * 2, oy = (Math.random() - .5) * cfg.spreadY * 2;
      var sc = cfg.scaleMin + Math.random() * (cfg.scaleMax - cfg.scaleMin);
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', cfg.w); svg.setAttribute('height', cfg.h); svg.setAttribute('viewBox', '0 0 ' + cfg.w + ' ' + cfg.h);
      cfg.build(svg);
      var wrap = document.createElement('div'); wrap.className = 'fish';
      wrap.style.cssText = 'left:' + Math.round(schoolX + ox) + 'px;top:' + Math.round(baseY + oy) + 'px;transform:scaleX(' + (goRight ? 1 : -1) + ') scale(' + sc + ');transform-origin:center center;opacity:0;transition:opacity 1s';
      wrap.appendChild(svg); fl.appendChild(wrap);
      (function (w, d) { setTimeout(function () { w.style.opacity = (cfg.opMin + Math.random() * (cfg.opMax - cfg.opMin)).toFixed(2); }, 250 + d * 55); })(wrap, i);
      members.push({ el: wrap, ox: ox, oy: oy, wob: cfg.wob * (0.7 + Math.random() * .6), wobF: cfg.wobF * (0.8 + Math.random() * .4), t: Math.random() * Math.PI * 2 });
    }
    return { type: 'school', members: members, x: schoolX, baseY: baseY, goRight: goRight, speed: speed, spreadX: cfg.spreadX, cfg: cfg };
  }

  function makeSolo(cfg) {
    var vW = W(), vH = H(), goRight = Math.random() > .5;
    var baseY = vH * (cfg.yMin + Math.random() * (cfg.yMax - cfg.yMin));
    var speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);
    var sc = cfg.scaleMin + Math.random() * (cfg.scaleMax - cfg.scaleMin);
    var startX = goRight ? -(cfg.w * sc + 80) : vW + (cfg.w * sc + 80);
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', cfg.w); svg.setAttribute('height', cfg.h); svg.setAttribute('viewBox', '0 0 ' + cfg.w + ' ' + cfg.h);
    cfg.build(svg);
    var wrap = document.createElement('div'); wrap.className = 'fish';
    wrap.style.cssText = 'left:' + Math.round(startX) + 'px;top:' + Math.round(baseY) + 'px;transform:scaleX(' + (goRight ? 1 : -1) + ') scale(' + sc + ');transform-origin:center center;opacity:0;transition:opacity 1.2s';
    wrap.appendChild(svg); fl.appendChild(wrap);
    setTimeout(function () { wrap.style.opacity = (cfg.opMin + Math.random() * (cfg.opMax - cfg.opMin)).toFixed(2); }, 150);
    return { type: 'solo', el: wrap, x: startX, baseY: baseY, goRight: goRight, speed: speed, bodyW: cfg.w * sc, wob: cfg.wob * (0.8 + Math.random() * .4), wobF: cfg.wobF * (0.8 + Math.random() * .4), t: Math.random() * Math.PI * 2, cfg: cfg };
  }

  /* ── CONFIGS ── */
  var altumCfg    = { w: 54, h: 82,  build: buildAltum,    count: TIER === 'low' ? 3 : 5,                          spreadX: 200, spreadY: 140, speedMin: 5,  speedMax: 9,  yMin: .06, yMax: .44, scaleMin: .55, scaleMax: .78, opMin: .44, opMax: .7,  wob: 1.0, wobF: 0.22 };
  var congoCfg    = { w: 42, h: 16,  build: buildCongo,    count: TIER === 'low' ? 8 : TIER === 'mid' ? 12 : 16,   spreadX: 105, spreadY: 55,  speedMin: 24, speedMax: 36, yMin: .12, yMax: .6,  scaleMin: .58, scaleMax: .8,  opMin: .52, opMax: .78, wob: 1.6, wobF: 0.48 };
  var cardinalCfg = { w: 36, h: 12,  build: buildCardinal, count: TIER === 'low' ? 10 : TIER === 'mid' ? 16 : 22,  spreadX: 115, spreadY: 58,  speedMin: 30, speedMax: 45, yMin: .15, yMax: .65, scaleMin: .55, scaleMax: .75, opMin: .55, opMax: .82, wob: 1.4, wobF: 0.55 };
  var geoCfg      = { w: 60, h: 36,  build: buildGeo,      yMin: .1,  yMax: .55, speedMin: 12, speedMax: 20, scaleMin: .7,  scaleMax: .95, opMin: .58, opMax: .8,  wob: 1.2, wobF: 0.32 };
  var oscarCfg    = { w: 62, h: 44,  build: buildOscar,    yMin: .08, yMax: .5,  speedMin: 10, speedMax: 18, scaleMin: .68, scaleMax: .9,  opMin: .55, opMax: .78, wob: 1.0, wobF: 0.28 };

  /* ── SINGLE RAF LOOP ── */
  var lastTs = null;
  function tick(ts) {
    requestAnimationFrame(tick);
    if (window.AR_PAUSED) return;
    if (!lastTs) { lastTs = ts; return; }
    var dt = Math.min((ts - lastTs) / 1000, .05);
    lastTs = ts;
    var vW = W(), vH = H();

    entities = entities.filter(function (e) {
      if (e.type === 'school') {
        e.x += (e.goRight ? 1 : -1) * e.speed * dt;
        e.members.forEach(function (m) {
          m.t += dt;
          var y = Math.max(vH * .02, Math.min(vH * .80, e.baseY + m.oy + Math.sin(m.t * m.wobF) * m.wob));
          m.el.style.left = Math.round(e.x + m.ox) + 'px';
          m.el.style.top  = Math.round(y) + 'px';
        });
        var edge = e.spreadX + 140;
        if (e.goRight ? e.x > (vW + edge) : e.x < (-edge)) {
          e.members.forEach(function (m) { m.el.style.opacity = '0'; setTimeout(function () { m.el.remove(); }, 1000); });
          setTimeout(function () { entities.push(makeSchool(e.cfg)); }, 10000 + Math.random() * 12000);
          return false;
        }
        return true;
      }
      if (e.type === 'solo') {
        e.t += dt;
        e.x += (e.goRight ? 1 : -1) * e.speed * dt;
        var y = Math.max(vH * .02, Math.min(vH * .80, e.baseY + Math.sin(e.t * e.wobF) * e.wob));
        e.el.style.left = Math.round(e.x) + 'px';
        e.el.style.top  = Math.round(y) + 'px';
        if (e.goRight ? e.x > (vW + e.bodyW + 80) : e.x < (-e.bodyW - 80)) {
          var el2 = e.el, cfg2 = e.cfg;
          el2.style.opacity = '0';
          setTimeout(function () { el2.remove(); setTimeout(function () { entities.push(makeSolo(cfg2)); }, 8000 + Math.random() * 10000); }, 1000);
          return false;
        }
        return true;
      }
      return true;
    });
  }

  /* ── SPAWN SCHEDULE ── */
  setTimeout(function () { entities.push(makeSchool(altumCfg)); }, 1000);
  setTimeout(function () { entities.push(makeSolo(geoCfg)); }, 6000);
  if (TIER !== 'low') {
    setTimeout(function () { entities.push(makeSchool(cardinalCfg)); }, 12000);
    setTimeout(function () { entities.push(makeSchool(congoCfg)); }, 20000);
  }
  setTimeout(function () { entities.push(makeSolo(oscarCfg)); }, 28000);

  requestAnimationFrame(tick);

})();
