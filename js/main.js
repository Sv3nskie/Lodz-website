// Header: transparent over the hero, solid white once scrolled past 80px.
(function () {
  var header = document.getElementById('site-header');
  if (!header) return;

  var THRESHOLD = 80;
  var ticking = false;

  function update() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    header.classList.toggle('is-scrolled', y > THRESHOLD);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
})();

// Hero video: reveal the <video> only once it is actually playing, so a
// phone that blocks autoplay (e.g. Low Power Mode) keeps showing the still.
(function () {
  var wrap = document.getElementById('hero-video');
  var vid = document.getElementById('hero-vid');
  if (!wrap || !vid) return;

  function reveal() { wrap.classList.add('is-playing'); }

  vid.addEventListener('playing', reveal);
  if (!vid.paused && vid.readyState >= 2) reveal();

  // Some browsers need an explicit play() call even with the autoplay attribute.
  var p = vid.play();
  if (p && typeof p.catch === 'function') p.catch(function () { /* still image stays */ });
})();

// Tiles on touch devices: no hover, so the tile nearest the viewport centre
// gets the slow zoom instead while the user scrolls.
(function () {
  if (!window.matchMedia || !window.matchMedia('(hover: none)').matches) return;
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));
  if (!tiles.length) return;

  var current = null;
  var ticking = false;

  function update() {
    ticking = false;
    var mid = window.innerHeight / 2;
    var best = null;
    var bestDist = Infinity;
    for (var i = 0; i < tiles.length; i++) {
      var r = tiles[i].getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue; // off-screen
      var d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < bestDist) { bestDist = d; best = tiles[i]; }
    }
    if (best === current) return;
    if (current) current.classList.remove('is-active');
    if (best) best.classList.add('is-active');
    current = best;
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// Custom scroll indicator: the native scrollbar is hidden in CSS; this draws a
// hairline that appears while scrolling, fades out at rest, and can be dragged.
(function () {
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  var bar = document.createElement('div');
  bar.className = 'scroll-indicator';
  var thumb = document.createElement('div');
  thumb.className = 'scroll-indicator__thumb';
  bar.appendChild(thumb);
  document.body.appendChild(bar);

  var hideTimer = null;
  var dragging = false;
  var dragStartY = 0;
  var dragStartScroll = 0;
  var darkSections = Array.prototype.slice.call(document.querySelectorAll('.hero, .banner'));

  function metrics() {
    var doc = document.documentElement;
    var total = doc.scrollHeight;
    var view = window.innerHeight;
    var max = Math.max(total - view, 1);
    var thumbH = Math.max(Math.round(view * view / total), 40);
    var y = window.scrollY || doc.scrollTop || 0;
    return { total: total, view: view, max: max, thumbH: thumbH, y: y };
  }

  function paint() {
    var m = metrics();
    if (m.total <= m.view + 2) { bar.classList.remove('is-visible'); return; }
    var top = Math.round((m.view - m.thumbH) * (m.y / m.max));
    thumb.style.height = m.thumbH + 'px';
    thumb.style.top = top + 'px';

    // Turn the line white while the thumb sits over a dark photo section
    var centre = top + m.thumbH / 2;
    var light = false;
    for (var i = 0; i < darkSections.length; i++) {
      var r = darkSections[i].getBoundingClientRect();
      if (centre >= r.top && centre <= r.bottom) { light = true; break; }
    }
    bar.classList.toggle('is-light', light);
  }

  function show() {
    bar.classList.add('is-visible');
    if (hideTimer) clearTimeout(hideTimer);
    if (!dragging) hideTimer = setTimeout(function () { bar.classList.remove('is-visible'); }, 1200);
  }

  function onScroll() { paint(); show(); }

  thumb.addEventListener('mousedown', function (e) {
    dragging = true;
    dragStartY = e.clientY;
    dragStartScroll = metrics().y;
    bar.classList.add('is-dragging');
    document.documentElement.classList.add('is-drag-scrolling');
    show();
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    var m = metrics();
    var ratio = m.max / (m.view - m.thumbH);
    window.scrollTo(0, dragStartScroll + (e.clientY - dragStartY) * ratio);
  });
  window.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    bar.classList.remove('is-dragging');
    document.documentElement.classList.remove('is-drag-scrolling');
    show();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', paint);
  window.addEventListener('load', paint);
  paint();
})();
