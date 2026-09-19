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
