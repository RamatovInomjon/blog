/*
 * Modern layer behaviour: theme toggle, reading progress, code copy buttons,
 * scroll-spy for the table of contents, and responsive table wrapping.
 *
 * Vanilla JS on purpose — it loads before the theme's jQuery bundle and must
 * not depend on it.
 */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------------------------------------------------------------- theme */

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "dark" || explicit === "light") return explicit;
    return systemPrefersDark() ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* storage unavailable — the choice just won't survive a reload */
    }
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"
      );
    }
  }

  function initThemeToggle() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;

    applyTheme(currentTheme());

    btn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });

    // Follow the OS while the reader hasn't made an explicit choice.
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () {
        var stored = null;
        try {
          stored = localStorage.getItem("theme");
        } catch (e) {}
        if (!stored) applyTheme(mq.matches ? "dark" : "light");
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ----------------------------------------------------- reading progress */

  function initReadingProgress() {
    // Only meaningful on an actual article.
    if (!document.querySelector(".page__content")) return;

    var wrap = document.createElement("div");
    wrap.className = "reading-progress";
    wrap.setAttribute("aria-hidden", "true");
    var bar = document.createElement("div");
    bar.className = "reading-progress__bar";
    wrap.appendChild(bar);
    document.body.appendChild(wrap);

    var ticking = false;

    function update() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var pct = scrollable > 0 ? (window.pageYOffset / scrollable) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ------------------------------------------------------------ code copy */

  function initCodeCopy() {
    if (!navigator.clipboard) return; // needs a secure context

    var blocks = document.querySelectorAll(
      ".page__content div.highlighter-rouge, .page__content figure.highlight"
    );

    Array.prototype.forEach.call(blocks, function (block) {
      var code = block.querySelector("pre");
      if (!code) return;

      var btn = document.createElement("button");
      btn.className = "code-copy";
      btn.type = "button";
      btn.textContent = "Nusxa";
      btn.setAttribute("aria-label", "Kodni nusxalash");

      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(code.innerText.replace(/\n$/, "")).then(
          function () {
            btn.textContent = "Nusxalandi";
            btn.classList.add("is-copied");
            setTimeout(function () {
              btn.textContent = "Nusxa";
              btn.classList.remove("is-copied");
            }, 1800);
          },
          function () {
            btn.textContent = "Xato";
            setTimeout(function () {
              btn.textContent = "Nusxa";
            }, 1800);
          }
        );
      });

      block.appendChild(btn);
    });
  }

  /* ------------------------------------------------------- TOC scroll-spy */

  function initTocScrollSpy() {
    var links = document.querySelectorAll(".toc__menu a[href^='#']");
    if (!links.length) return;

    var targets = [];
    Array.prototype.forEach.call(links, function (link) {
      var id = decodeURIComponent(link.getAttribute("href").slice(1));
      var el = document.getElementById(id);
      if (el) targets.push({ el: el, li: link.parentNode });
    });
    if (!targets.length) return;

    var ticking = false;

    function update() {
      // The heading whose top has most recently passed the offset line wins.
      var offset = 100;
      var active = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.getBoundingClientRect().top <= offset) active = targets[i];
        else break;
      }
      targets.forEach(function (t) {
        t.li.classList.toggle("is-active", t === active);
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------ table wrapping */

  function initTableWrap() {
    var tables = document.querySelectorAll(".page__content table");
    Array.prototype.forEach.call(tables, function (table) {
      if (table.parentNode.classList.contains("table-wrapper")) return;
      var wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Jadval");
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  /* -------------------------------------------------- external link hints */

  function initExternalLinks() {
    var links = document.querySelectorAll(".page__content a[href^='http']");
    Array.prototype.forEach.call(links, function (link) {
      if (link.hostname === window.location.hostname) return;
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ------------------------------------------------------------------ go */

  function init() {
    initThemeToggle();
    initReadingProgress();
    initCodeCopy();
    initTocScrollSpy();
    initTableWrap();
    initExternalLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
