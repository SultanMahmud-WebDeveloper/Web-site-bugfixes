/* =========================================================
   common-causes.js  —  category filter for common-causes.html
   Clicking a button shows only cards whose data-cat matches
   the button's data-filter ("all" shows everything).
   ========================================================= */
(function () {
  "use strict";

  var filters = document.getElementById("filters");
  var cards = document.querySelectorAll(".cause");
  var count = document.getElementById("count");
  var empty = document.getElementById("empty");
  if (!filters) return;

  function apply(filter) {
    var shown = 0;
    cards.forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-cat") === filter;
      card.classList.toggle("hide", !match);
      if (match) {
        shown++;
        card.classList.remove("show");
        void card.offsetWidth;          // restart the fade-in animation
        card.classList.add("show");
      }
    });
    count.textContent = "Showing " + shown + (shown === 1 ? " cause" : " causes");
    empty.hidden = shown !== 0;
  }

  filters.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter");
    if (!btn) return;
    filters.querySelectorAll(".filter").forEach(function (b) { b.classList.toggle("active", b === btn); });
    apply(btn.getAttribute("data-filter"));
  });

  apply("all");
})();
