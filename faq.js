/* =========================================================
   faq.js  —  accordion for faq.html
   One click opens a question and closes the others.
   The smooth animation is done in faq.css.
   Want several open at once? Delete the "close the others" loop.
   ========================================================= */
(function () {
  "use strict";

  var box = document.getElementById("accordion");
  if (!box) return;

  function setOpen(item, open) {
    item.classList.toggle("open", open);
    item.querySelector(".acc-q").setAttribute("aria-expanded", String(open));
  }

  box.addEventListener("click", function (e) {
    var q = e.target.closest(".acc-q");
    if (!q) return;
    var item = q.parentElement;
    var willOpen = !item.classList.contains("open");

    // close the others
    box.querySelectorAll(".acc-item").forEach(function (other) {
      if (other !== item) setOpen(other, false);
    });
    setOpen(item, willOpen);
  });

  // open the first question by default
  var first = box.querySelector(".acc-item");
  if (first) setOpen(first, true);
})();
