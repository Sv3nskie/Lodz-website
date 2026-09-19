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
