// Basic Chat UI interactions for Home page
(function () {
  function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  function createMessageElement(kind, text) {
    const article = document.createElement("article");
    article.className = `message ${kind}`;
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = kind === "ai" ? "AI" : "U";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    article.appendChild(avatar);
    article.appendChild(bubble);
    return article;
  }

  function scrollMessagesToBottom(messagesEl) {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function handleNewChat(messagesEl) {
    messagesEl.innerHTML = "";
    messagesEl.appendChild(
      createMessageElement("ai", "New chat started. Ask me anything.")
    );
    scrollMessagesToBottom(messagesEl);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("composerForm");
    const textarea = document.getElementById("prompt");
    const messagesEl = document.getElementById("messages");
    const newChatBtn = document.getElementById("newChat");
    const suggestionButtons = document.querySelectorAll("[data-prompt]");
    const navToggle = document.getElementById("navToggle");
    const openSidebarBtn = document.querySelector(
      '.topbar label[for="navToggle"]'
    );
    const closeSidebarBtn = document.querySelector(
      '.sidebar .brand label[for="navToggle"]'
    );
    const overlayToggle = document.querySelector(
      'label.overlay[for="navToggle"]'
    );
    const historyLinks = document.querySelectorAll(".history a");

    if (!form || !textarea || !messagesEl) return;

    // Auto-resize on input
    textarea.addEventListener("input", () => autoResizeTextarea(textarea));
    autoResizeTextarea(textarea);

    // Suggestions -> fill textbox and focus
    suggestionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const prompt = btn.getAttribute("data-prompt") || "";
        textarea.value = prompt;
        autoResizeTextarea(textarea);
        textarea.focus();
      });
    });

    // Sidebar open/close helpers (ensure consistent behavior across browsers)
    if (openSidebarBtn) {
      openSidebarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.matchMedia("(min-width: 981px)").matches) {
          const app = document.getElementById("app");
          if (app) app.classList.toggle("is-collapsed");
          return;
        }
        if (navToggle) {
          navToggle.checked = !navToggle.checked;
        }
        const app = document.getElementById("app");
        if (app) app.classList.remove("is-collapsed");
        if (navToggle && navToggle.checked) {
          document.body.classList.add("sidebar-open");
        } else {
          document.body.classList.remove("sidebar-open");
        }
      });
    }
    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.matchMedia("(min-width: 981px)").matches) {
          const app = document.getElementById("app");
          if (app) app.classList.add("is-collapsed");
          return;
        }
        if (navToggle) navToggle.checked = false;
        document.body.classList.remove("sidebar-open");
      });
    }
    if (overlayToggle && navToggle) {
      overlayToggle.addEventListener("click", (e) => {
        e.preventDefault();
        navToggle.checked = false;
        document.body.classList.remove("sidebar-open");
      });
    }
    // Close sidebar on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (window.matchMedia("(min-width: 981px)").matches) {
        const app = document.getElementById("app");
        if (app && !app.classList.contains("is-collapsed")) {
          app.classList.add("is-collapsed");
        }
        return;
      }
      if (navToggle && navToggle.checked) {
        navToggle.checked = false;
        document.body.classList.remove("sidebar-open");
      }
    });

    // Close sidebar when clicking a history item (on mobile)
    if (navToggle && historyLinks.length) {
      historyLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (window.matchMedia("(max-width: 980px)").matches) {
            navToggle.checked = false;
            document.body.classList.remove("sidebar-open");
          }
        });
      });
    }

    // On resize to desktop, ensure sidebar is visible via layout but checkbox is off
    const handleResize = () => {
      const app = document.getElementById("app");
      if (window.matchMedia("(min-width: 981px)").matches) {
        if (navToggle) navToggle.checked = false;
        document.body.classList.remove("sidebar-open");
        return;
      }
      // On mobile widths, ensure desktop collapse state doesn't hide the sidebar UI
      if (app) app.classList.remove("is-collapsed");
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Keep body scroll lock in sync with checkbox toggles (covers label clicks)
    if (navToggle) {
      navToggle.addEventListener("change", () => {
        if (window.matchMedia("(max-width: 980px)").matches) {
          if (navToggle.checked) {
            document.body.classList.add("sidebar-open");
          } else {
            document.body.classList.remove("sidebar-open");
          }
        }
      });
    }

    // Submit message
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = textarea.value.trim();
      if (!text) return;

      // Render user message
      messagesEl.appendChild(createMessageElement("user", text));
      scrollMessagesToBottom(messagesEl);

      textarea.value = "";
      autoResizeTextarea(textarea);

      // Placeholder AI echo response; replace with real API call if needed
      const aiResponse = `You said: ${text}`;
      await new Promise((r) => setTimeout(r, 300));
      messagesEl.appendChild(createMessageElement("ai", aiResponse));
      scrollMessagesToBottom(messagesEl);
    });

    // New chat
    if (newChatBtn) {
      newChatBtn.addEventListener("click", () => handleNewChat(messagesEl));
    }
  });
})();
