/*
  Trabzonlular Federasyonu — main.js
  Sticky header davranışı yok (CSS sticky yeterli); mega menü + mobil menü + scroll-reveal.
*/
(function () {
  "use strict";

  /* ---- Mega menü (hover CSS ile açılır; click klavye/dokunma içindir) ---- */
  var megaItems = document.querySelectorAll(".has-mega");
  megaItems.forEach(function (item) {
    var toggle = item.querySelector(".nav-toggle");
    if (!toggle) return;
    /* Başka öğeye hover'lanınca click ile açık kalan paneli kapat (çift panel önlenir) */
    item.addEventListener("mouseenter", function () {
      megaItems.forEach(function (other) {
        if (other === item) return;
        other.classList.remove("is-open");
        var t = other.querySelector(".nav-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    });
    toggle.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      megaItems.forEach(function (other) {
        other.classList.remove("is-open");
        var t = other.querySelector(".nav-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.addEventListener("click", function (e) {
    megaItems.forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove("is-open");
        var t = item.querySelector(".nav-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      megaItems.forEach(function (item) {
        item.classList.remove("is-open");
        var t = item.querySelector(".nav-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ---- Mobil off-canvas menü ---- */
  var hamburger = document.querySelector(".hamburger");
  var mobileNav = document.querySelector(".mobile-nav");
  var scrim = document.querySelector(".scrim");
  var mobileClose = document.querySelector(".mobile-nav__close");

  function openMobileNav() {
    mobileNav.classList.add("is-open");
    scrim.classList.add("is-visible");
    hamburger.classList.add("is-active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    hamburger.classList.remove("is-active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      if (mobileNav.classList.contains("is-open")) closeMobileNav();
      else openMobileNav();
    });
  }
  if (mobileClose) mobileClose.addEventListener("click", closeMobileNav);
  if (scrim) scrim.addEventListener("click", closeMobileNav);

  var mobileToggles = document.querySelectorAll(".mobile-toggle");
  mobileToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parent = btn.closest(".mobile-nav__item");
      var isOpen = parent.classList.contains("is-open");
      document.querySelectorAll(".mobile-nav__item").forEach(function (el) {
        el.classList.remove("is-open");
      });
      if (!isOpen) parent.classList.add("is-open");
    });
  });

  /* ---- Scroll-reveal: opacity + kısa translate, bir kez oynar ---- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }
})();
