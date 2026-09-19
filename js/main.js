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

// Hero video: only reveal the Vimeo iframe once it is actually playing.
(function () {
  var wrap = document.getElementById('hero-video');
  var iframe = document.getElementById('hero-iframe');
  if (!wrap || !iframe) return;

  function post(method, value) {
    if (!iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({ method: method, value: value }), '*');
  }

  function subscribe() {
    post('addEventListener', 'play');
    post('addEventListener', 'playing');
    post('addEventListener', 'timeupdate');
  }

  window.addEventListener('message', function (e) {
    if (typeof e.origin !== 'string' || e.origin.indexOf('vimeo.com') === -1) return;
    var data = e.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (err) { return; }
    }
    if (!data) return;
    if (data.event === 'ready') subscribe();
    if (data.event === 'play' || data.event === 'playing' || data.event === 'timeupdate') {
      wrap.classList.add('is-playing');
    }
  });

  iframe.addEventListener('load', subscribe);
  subscribe();
})();
