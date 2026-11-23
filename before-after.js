/* =========================================================
   before-after.js  —  case selector + Before/After toggle
   - Case buttons choose which case study is visible.
   - The floating Before/After button sets data-mode on #stage,
     and before-after.css shows the matching block.
   ========================================================= */
(function () {
  "use strict";

  var stage = document.getElementById("stage");
  var caseTabs = document.getElementById("caseTabs");
  var toggle = document.getElementById("floatToggle");
  if (!stage) return;

  /* Choose a case (0, 1, 2 ...) */
  if (caseTabs) {
    caseTabs.addEventListener("click", function (e) {
      var tab = e.target.closest(".case-tab");
      if (!tab) return;
      var n = tab.getAttribute("data-case");
      caseTabs.querySelectorAll(".case-tab").forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
      });
      stage.querySelectorAll(".case").forEach(function (c) {
        c.classList.toggle("active", c.getAttribute("data-case") === n);
      });
    });
  }

  /* Switch between "before" and "after" */
  if (toggle) {
    toggle.addEventListener("click", function (e) {
      var btn = e.target.closest(".ft-btn");
      if (!btn) return;
      var mode = btn.getAttribute("data-mode");
      stage.setAttribute("data-mode", mode);
      toggle.querySelectorAll(".ft-btn").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
    });
  }
})();
