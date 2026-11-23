/* =========================================================
   home.js  —  hero slider for index.html

   The slider ALWAYS moves from right to left, slowly.
   To change the settings, edit the two numbers just below.
   (Also change the transition time in home.css if you change SLIDE_MS.)
   ========================================================= */
(function () {
  "use strict";

  var SLIDE_MS = 1600;   // how long one slide movement takes (matches 1.6s in home.css)
  var WAIT_MS  = 6500;   // how long each slide stays before moving on

  var slider = document.getElementById("slider");
  var track = document.getElementById("track");
  var dotsBox = document.getElementById("dots");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var pauseBtn = document.getElementById("pauseBtn");
  if (!slider || !track) return;

  var slides = Array.prototype.slice.call(track.children);
  var total = slides.length;           // number of real slides
  var pos = 0;                         // current track position (0 .. total)
  var busy = false;                    // true while a slide is moving
  var timer = null;
  var playing = true;                  // user's pause/play choice
  var hovering = false;                // mouse over or focus inside

  /* Add a copy of slide 1 at the end, so after the last slide the
     track keeps moving right-to-left into slide 1 (no rewind). */
  var clone = slides[0].cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  Array.prototype.forEach.call(clone.querySelectorAll("a, button"), function (el) { el.tabIndex = -1; });
  track.appendChild(clone);

  /* Create one dot per slide */
  var dots = [];
  for (var i = 0; i < total; i++) {
    (function (n) {
      var b = document.createElement("button");
      b.className = "dot-btn";
      b.setAttribute("aria-label", "Go to slide " + (n + 1));
      b.addEventListener("click", function () { goTo(n); });
      dotsBox.appendChild(b);
      dots.push(b);
    })(i);
  }

  function updateDots() {
    var current = pos % total;
    dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
  }

  /* Move the track to a position. animate=false jumps instantly. */
  function move(to, animate) {
    track.classList.toggle("no-anim", !animate);
    track.style.transform = "translateX(-" + (to * 100) + "%)";
    if (!animate) void track.offsetWidth;   // force the browser to apply it now
  }

  function lock() {
    busy = true;
    setTimeout(function () { busy = false; }, SLIDE_MS + 80);
  }

  function next() {
    if (busy) return;
    lock();
    pos++;
    move(pos, true);
    updateDots();
    if (pos === total) {                    // reached the copy of slide 1
      setTimeout(function () { pos = 0; move(0, false); updateDots(); }, SLIDE_MS + 20);
    }
  }

  function prev() {
    if (busy) return;
    lock();
    if (pos === 0) { pos = total; move(pos, false); }   // jump to the copy first
    pos--;
    move(pos, true);
    updateDots();
  }

  function goTo(n) {
    if (busy || n === pos % total) return;
    lock();
    pos = n;
    move(pos, true);
    updateDots();
  }

  /* Auto-play */
  function start() {
    stop();
    if (playing && !hovering && !document.hidden) timer = setInterval(next, WAIT_MS);
  }
  function stop() { clearInterval(timer); timer = null; }

  nextBtn.addEventListener("click", function () { next(); start(); });
  prevBtn.addEventListener("click", function () { prev(); start(); });

  /* Pause / Play button */
  pauseBtn.addEventListener("click", function () {
    playing = !playing;
    pauseBtn.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
    pauseBtn.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
    start();
  });

  /* Pause while the mouse is over the slider or a control has focus */
  slider.addEventListener("mouseenter", function () { hovering = true; stop(); });
  slider.addEventListener("mouseleave", function () { hovering = false; start(); });
  slider.addEventListener("focusin", function () { hovering = true; stop(); });
  slider.addEventListener("focusout", function () { hovering = false; start(); });

  /* Keyboard arrows (click the slider first) */
  slider.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  /* Touch swipe on phones */
  var startX = null;
  slider.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); start(); }
    startX = null;
  }, { passive: true });

  document.addEventListener("visibilitychange", start);

  /* Respect "reduce motion": start paused */
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    playing = false;
    pauseBtn.innerHTML = "&#9654;";
    pauseBtn.setAttribute("aria-label", "Play slideshow");
  }

  updateDots();
  start();
})();
