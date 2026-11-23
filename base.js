/* =========================================================
   base.js  —  SHARED by every page
   1. Mobile menu toggle
   2. Highlights the current page link in the navbar
   3. Hides broken images so the image-slot placeholder shows
   4. Footer year + scroll-reveal animation
   ========================================================= */
(function () {
  "use strict";

  /* 1. Mobile menu ------------------------------------------------ */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // close the menu after tapping a link, or pressing Escape
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* 2. Mark the current page in the navbar ------------------------ */
  var page = location.pathname.split("/").pop() || "index.html";
  var navAnchors = document.querySelectorAll("#navLinks a");
  for (var i = 0; i < navAnchors.length; i++) {
    if (navAnchors[i].getAttribute("href") === page) navAnchors[i].classList.add("active");
  }

  /* 3. Missing image? Hide it so the dashed placeholder shows ------ */
  // (error events do not bubble, so we listen in the capture phase)
  document.addEventListener("error", function (e) {
    if (e.target && e.target.tagName === "IMG") e.target.style.display = "none";
  }, true);
  // images that already failed before this script ran
  var imgs = document.querySelectorAll("img");
  for (var j = 0; j < imgs.length; j++) {
    if (imgs[j].complete && imgs[j].naturalWidth === 0) imgs[j].style.display = "none";
  }

  /* 4. Footer year + scroll reveal -------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
})();
