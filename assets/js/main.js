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

  /* ---- Hero slider: kompakt kurumsal slider (revize brief §2) ----
     Crossfade + ok/nokta navigasyonu; otomatik akış hover/odakta durur,
     reduced-motion tercihinde hiç başlamaz. */
  var heroEl = document.querySelector("[data-hero-slider]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroEl) {
    var slides = heroEl.querySelectorAll(".hero__slide");
    var dots = heroEl.querySelectorAll("[data-hero-dot]");
    var current = 0;
    var timer = null;
    var AUTOPLAY_MS = 7000;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }
    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function startAutoplay() {
      if (reducedMotion || slides.length < 2 || timer) return;
      timer = setInterval(function () { goTo(current + 1); }, AUTOPLAY_MS);
    }

    var prevBtn = heroEl.querySelector("[data-hero-prev]");
    var nextBtn = heroEl.querySelector("[data-hero-next]");
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        goTo(parseInt(dot.getAttribute("data-hero-dot"), 10));
      });
    });
    heroEl.addEventListener("mouseenter", stopAutoplay);
    heroEl.addEventListener("mouseleave", startAutoplay);
    heroEl.addEventListener("focusin", stopAutoplay);
    heroEl.addEventListener("focusout", startAutoplay);
    startAutoplay();
  }

  /* ---- Carousel: scroll-snap track + ok butonları (revize brief §5-6) ----
     Butonlar data-carousel-prev/next="#track-id" ile track'e bağlanır;
     uçlara gelince ilgili buton pasifleşir. */
  function initCarouselButtons(attr, direction) {
    document.querySelectorAll("[" + attr + "]").forEach(function (btn) {
      var track = document.querySelector(btn.getAttribute(attr));
      if (!track) return;
      btn.addEventListener("click", function () {
        track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
      });
      function updateState() {
        var maxScroll = track.scrollWidth - track.clientWidth - 1;
        if (direction < 0) btn.disabled = track.scrollLeft <= 1;
        else btn.disabled = track.scrollLeft >= maxScroll;
      }
      track.addEventListener("scroll", function () {
        window.requestAnimationFrame(updateState);
      }, { passive: true });
      window.addEventListener("resize", updateState);
      updateState();
    });
  }
  initCarouselButtons("data-carousel-prev", -1);
  initCarouselButtons("data-carousel-next", 1);

  /* ---- Etkinlik tab'ları (revize brief §7) — klavye ok desteğiyle ---- */
  document.querySelectorAll("[role=tablist]").forEach(function (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll("[role=tab]"));
    function activate(tab) {
      tabs.forEach(function (other) {
        var selected = other === tab;
        other.setAttribute("aria-selected", selected ? "true" : "false");
        other.setAttribute("tabindex", selected ? "0" : "-1");
        var panel = document.getElementById(other.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
      tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activate(tab); });
      tab.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") activate(tabs[(i + 1) % tabs.length]);
        else if (e.key === "ArrowLeft") activate(tabs[(i - 1 + tabs.length) % tabs.length]);
      });
    });
  });

  /* ---- Scroll-reveal: opacity + kısa translate, bir kez oynar ---- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReducedMotion = reducedMotion;

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
