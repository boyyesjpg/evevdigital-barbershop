/**
 * EvEvDigital Dual Theme Toggle Engine - evevbarber
 * Mendukung penyimpanan aman, anti-FOUC, dan sinkronisasi ARIA.
 */

(function () {
  "use strict";

  var THEME_KEY = "evevdigital_evevbarber_theme";

  function safeGetStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // Abaikan jika browser memblokir storage (mode privat/file://)
    }
  }

  function getPreferredTheme() {
    var stored = safeGetStorage(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    if (window.PROFIL_USAHA && (window.PROFIL_USAHA.temaDefault === "light" || window.PROFIL_USAHA.temaDefault === "dark")) {
      return window.PROFIL_USAHA.temaDefault;
    }
    return "dark";
  }

  function updateButtons(theme) {
    var isLight = theme === "light";
    var buttons = document.querySelectorAll("#theme-toggle, .theme-toggle-btn");
    buttons.forEach(function (btn) {
      btn.innerHTML = isLight
        ? '<i class="fa fa-moon-o" aria-hidden="true"></i>'
        : '<i class="fa fa-sun-o" aria-hidden="true"></i>';
      btn.setAttribute("title", isLight ? "Ganti ke Mode Gelap (Dark Mode)" : "Ganti ke Mode Terang (Light Mode)");
      btn.setAttribute("aria-label", isLight ? "Ganti ke Mode Gelap" : "Ganti ke Mode Terang");
      btn.setAttribute("aria-pressed", isLight ? "true" : "false");
    });
  }

  function applyTheme(theme) {
    var normalized = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", normalized);

    if (document.body) {
      document.body.classList.toggle("light-scheme", normalized === "light");
      document.body.classList.toggle("dark-scheme", normalized === "dark");
    }

    safeSetStorage(THEME_KEY, normalized);
    updateButtons(normalized);
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "light" ? "dark" : "light");
  }

  // Terapkan atribut data-theme seawal mungkin untuk mencegah kedipan (FOUC)
  var initTheme = getPreferredTheme();
  document.documentElement.setAttribute("data-theme", initTheme);

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(initTheme);

    document.addEventListener("click", function (e) {
      var btn = e.target.closest("#theme-toggle, .theme-toggle-btn");
      if (btn) {
        e.preventDefault();
        toggleTheme();
      }
    });
  });
})();
