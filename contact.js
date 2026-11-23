/* =========================================================
   contact.js  —  bug inquiry form for contact.html
   - Validates the fields (no page reload)
   - Builds a summary you can Copy, Email or send on WhatsApp
   - Pre-selects the package if you arrived from packages.html
   NOTE: nothing is sent to a server. The summary is sent only when
   the visitor presses Send by Email / WhatsApp, or copies it.
   Change the two values below if your contact details change.
   ========================================================= */
(function () {
  "use strict";

  var EMAIL = "sultanmahmudasa77@gmail.com";
  var WHATSAPP = "8801722777344";     // number with country code, no + or spaces

  var form = document.getElementById("bugForm");
  var result = document.getElementById("result");
  var summaryBox = document.getElementById("summary");
  var pill = document.getElementById("pill");
  var copyBtn = document.getElementById("copyBtn");
  var mailBtn = document.getElementById("mailBtn");
  var waBtn = document.getElementById("waBtn");
  var copied = document.getElementById("copied");
  if (!form) return;

  var lastSummary = "";

  /* Pre-select the package from  contact.html?package=Quick%20Fix  */
  var wanted = new URLSearchParams(location.search).get("package");
  if (wanted) {
    var sel = document.getElementById("package");
    Array.prototype.forEach.call(sel.options, function (o) {
      if (o.text.toLowerCase() === wanted.toLowerCase()) sel.value = o.value;
    });
  }

  function v(id) { return document.getElementById(id).value.trim(); }

  function setError(id, msg) {
    var field = document.getElementById(id).closest(".field");
    document.getElementById("err-" + id).textContent = msg;
    field.classList.toggle("invalid", !!msg);
    return !msg;
  }

  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s); }
  function validUrl(s) {
    try {
      var u = new URL(/^https?:\/\//i.test(s) ? s : "https://" + s);
      return u.hostname.indexOf(".") > 0;
    } catch (e) { return false; }
  }

  function validate() {
    var ok = true;
    ok = setError("name", v("name") ? "" : "Please enter your name.") && ok;
    ok = setError("email", validEmail(v("email")) ? "" : "Please enter a valid email address.") && ok;
    ok = setError("url", validUrl(v("url")) ? "" : "Please enter your website address (e.g. yoursite.com).") && ok;
    ok = setError("message", v("message").length >= 10 ? "" : "Please describe the problem in a few words.") && ok;
    return ok;
  }

  function buildSummary() {
    var site = v("url");
    if (!/^https?:\/\//i.test(site)) site = "https://" + site;
    return [
      "BUG INQUIRY",
      "===========",
      "Date:         " + new Date().toLocaleString(),
      "Name:         " + v("name"),
      "Email:        " + v("email"),
      "Website:      " + site,
      "Problem type: " + v("type"),
      "Package:      " + v("package"),
      "",
      "Problem description:",
      v("message"),
      "",
      "To: Sultan Mahmud (" + EMAIL + ")"
    ].join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();                         // stop the page from reloading
    if (!validate()) {
      var firstBad = form.querySelector(".invalid input, .invalid textarea");
      if (firstBad) firstBad.focus();
      return;
    }
    lastSummary = buildSummary();
    summaryBox.textContent = lastSummary;
    result.classList.add("done");
    pill.textContent = "Ready to send";
    pill.classList.add("ready");

    var subject = "Bug inquiry: " + v("type") + " (" + v("url") + ")";
    mailBtn.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lastSummary);
    waBtn.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lastSummary);
    [mailBtn, waBtn].forEach(function (a) { a.classList.remove("disabled"); a.removeAttribute("aria-disabled"); });
    copyBtn.disabled = false;
    copied.textContent = "";

    // On small screens, bring the summary into view
    if (window.innerWidth <= 960) result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* Clear an error as soon as the visitor edits the field */
  ["name", "email", "url", "message"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () { setError(id, ""); });
  });

  /* Copy button */
  copyBtn.addEventListener("click", function () {
    if (!lastSummary) return;
    function done() {
      copied.textContent = "Copied! Paste it into an email or WhatsApp message.";
      setTimeout(function () { copied.textContent = ""; }, 3500);
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = lastSummary; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (err) { copied.textContent = "Press Ctrl+C to copy the text above."; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(lastSummary).then(done, fallback);
    else fallback();
  });

  /* Disabled link-buttons must not open anything */
  [mailBtn, waBtn].forEach(function (a) {
    a.addEventListener("click", function (e) { if (a.classList.contains("disabled")) e.preventDefault(); });
  });
})();
