/* =========================================================
   packages.js  —  for packages.html
   Each package button gets  contact.html?package=<name>
   so the contact form can pre-select the chosen package.
   (Without JavaScript the buttons still open contact.html.)
   ========================================================= */
(function () {
  "use strict";

  document.querySelectorAll(".pick").forEach(function (btn) {
    var name = btn.getAttribute("data-package");
    if (name) btn.href = "contact.html?package=" + encodeURIComponent(name);
  });
})();
