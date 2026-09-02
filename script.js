/* =========================================================
   PORTFOLIO — ABDOULAYE Adou Aki Sourouya
   script.js — Menu mobile · Scroll-spy · Reveal · Formulaire
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------
     0. MODE SOMBRE / CLAIR
  --------------------------------------------------- */
  const root         = document.documentElement;
  const themeToggle  = document.getElementById("theme-toggle");
  const themeColorEl = document.querySelector('meta[name="theme-color"]');

  function applyThemeUI(theme) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Activer le mode clair" : "Activer le mode sombre");
    if (themeColorEl) themeColorEl.setAttribute("content", isDark ? "#0B1220" : "#F5F9FF");
  }

  // Le thème initial est déjà posé par le script inline dans <head> (anti-flash)
  applyThemeUI(root.getAttribute("data-theme") || "light");

  themeToggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    applyThemeUI(next);
  });

  // Si l'utilisateur n'a jamais choisi manuellement, suit la préférence système
  if (!localStorage.getItem("theme") && window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      const theme = e.matches ? "dark" : "light";
      root.setAttribute("data-theme", theme);
      applyThemeUI(theme);
    });
  }


  /* ---------------------------------------------------
     1. MENU MOBILE (burger)
  --------------------------------------------------- */
  const burger = document.getElementById("burger");
  const nav    = document.getElementById("nav");

  function toggleMenu() {
    burger.classList.toggle("is-active");
    nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", nav.classList.contains("is-open"));
  }

  burger.addEventListener("click", toggleMenu);

  // Ferme le menu quand on clique sur un lien
  document.querySelectorAll(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) toggleMenu();
    });
  });

  // Ferme aussi en cliquant en dehors du menu
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && e.target !== burger) {
      toggleMenu();
    }
  });


  /* ---------------------------------------------------
     2. ANIMATION AU DÉFILEMENT (reveal)
  --------------------------------------------------- */
  const revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObs.observe(el);
  });


  /* ---------------------------------------------------
     3. SCROLL SPY — lien de nav actif
  --------------------------------------------------- */
  const sections    = document.querySelectorAll("main section[id]");
  const navLinks    = document.querySelectorAll("[data-nav-link]");

  const spyObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(function (s) { spyObs.observe(s); });


  /* ---------------------------------------------------
     4. ANNÉE COURANTE DANS LE FOOTER
  --------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------------------------------------------------
     5. FORMULAIRE DE CONTACT
        Validation côté client + ouverture mailto:
  --------------------------------------------------- */
  const CONTACT_EMAIL = "akisouroyaabdoulaye@gmail.com";
  const form          = document.getElementById("contact-form");
  const formSuccess   = document.getElementById("form-success");

  if (!form) return;

  const fields = {
    name:    form.querySelector("#name"),
    email:   form.querySelector("#email"),
    subject: form.querySelector("#subject"),
    message: form.querySelector("#message"),
  };

  function setError(fieldName, message) {
    const group = fields[fieldName].closest(".form-group");
    group.classList.add("has-error");
    group.querySelector(".form-error").textContent = message;
  }

  function clearError(fieldName) {
    fields[fieldName].closest(".form-group").classList.remove("has-error");
  }

  function isEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function validate() {
    let ok = true;

    if (fields.name.value.trim().length < 2) {
      setError("name", "Merci d'indiquer votre nom (min. 2 caractères).");
      ok = false;
    } else { clearError("name"); }

    if (!isEmail(fields.email.value.trim())) {
      setError("email", "Adresse email invalide.");
      ok = false;
    } else { clearError("email"); }

    if (fields.subject.value.trim().length < 3) {
      setError("subject", "Merci d'indiquer un sujet.");
      ok = false;
    } else { clearError("subject"); }

    if (fields.message.value.trim().length < 10) {
      setError("message", "Message trop court (min. 10 caractères).");
      ok = false;
    } else { clearError("message"); }

    return ok;
  }

  // Revalidation en temps réel
  Object.keys(fields).forEach(function (name) {
    fields[name].addEventListener("input", function () {
      if (fields[name].closest(".form-group").classList.contains("has-error")) {
        validate();
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    formSuccess.classList.remove("is-visible");

    if (!validate()) return;

    const name    = fields.name.value.trim();
    const email   = fields.email.value.trim();
    const subject = fields.subject.value.trim();
    const message = fields.message.value.trim();

    const body =
      "Nom : "    + name    + "\n" +
      "Email : "  + email   + "\n\n" +
      message;

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body="    + encodeURIComponent(body);

    formSuccess.classList.add("is-visible");
    form.reset();
  });

});
