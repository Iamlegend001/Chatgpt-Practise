(function () {
  function applyTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function getSystemPref() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getInitialTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return null; // null -> follow system
  }

  function toggleTheme() {
    const currentAttr = document.documentElement.getAttribute("data-theme");
    const current = currentAttr || getSystemPref();
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getInitialTheme());
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", toggleTheme);
    }

    // react to system changes when following system
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", () => {
        const saved = localStorage.getItem("theme");
        if (saved !== "light" && saved !== "dark") {
          applyTheme(null);
        }
      });
    }
  });
})();
