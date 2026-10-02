// Edit these and re-upload. Empty values stay hidden on the site.
const CONFIG = {
  venmo: ""
};

// Real reviews only. Add one like:
// { quote: "Exact words the parent sent you", name: "Parent of an 11th grader" }
const REVIEWS = [];

(function () {
  // Mobile menu
  const btn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (btn && links) {
    btn.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Close" : "Menu";
    });
  }

  // Venmo handle
  document.querySelectorAll("[data-venmo]").forEach(function (el) {
    if (CONFIG.venmo) {
      const v = el.querySelector(".val");
      if (v) v.textContent = "@" + CONFIG.venmo.replace(/^@/, "");
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });

  // Reviews
  const wrap = document.getElementById("reviews");
  const list = document.getElementById("reviews-list");
  if (wrap && list && REVIEWS.length) {
    REVIEWS.forEach(function (r) {
      const fig = document.createElement("figure");
      fig.className = "review";
      const q = document.createElement("blockquote");
      q.textContent = "“" + r.quote + "”";
      const c = document.createElement("cite");
      c.textContent = r.name;
      fig.appendChild(q);
      fig.appendChild(c);
      list.appendChild(fig);
    });
    wrap.hidden = false;
  }

  // Copy email
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      const text = b.getAttribute("data-copy");
      const done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1600); };
      const fallback = function () {
        const target = b.parentElement.querySelector(".val");
        if (!target) return;
        const r = document.createRange();
        r.selectNodeContents(target);
        const s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        b.textContent = "Selected";
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else { fallback(); }
      } catch (e) { fallback(); }
    });
  });
})();
