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
