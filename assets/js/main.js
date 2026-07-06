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

  /* ---- Lightbox (medya galerisi — components.md "lightbox") ----
     Tetik: a[data-lightbox][href=büyük görsel URL] (medya.html'de .media-tile üzerinde).
     Overlay JS'çe tek sefer üretilir; Esc + scrim click + kapat butonu kapatır;
     body scroll kilidi off-canvas menüyle AYNI mekanizma (document.body.style.overflow).
     prefers-reduced-motion geçişsizliği main.css'teki genel kural zaten sağlıyor. */
  var lightboxTriggers = document.querySelectorAll("a[data-lightbox]");
  if (lightboxTriggers.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Görsel büyütme");
    lightbox.innerHTML =
      '<img class="lightbox__img" alt="">' +
      '<button type="button" class="lightbox__close" aria-label="Kapat">' +
      '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
      '</button>';
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector(".lightbox__img");
    var lightboxClose = lightbox.querySelector(".lightbox__close");
    var lightboxLastFocused = null;

    function openLightbox(href, label) {
      lightboxLastFocused = document.activeElement;
      lightboxImg.src = href;
      lightboxImg.alt = label || "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      /* Tetik <a href> click'i sonrası tarayıcının kendi odak atamasıyla yarışıyoruz —
         rAF/setTimeout(0) yetmiyor, tıklamanın gecikmeli odak davranışı onları da eziyor.
         50ms (algılanamaz) güvenli marj: blur+focus bu gecikmeden SONRA çalışır. */
      window.setTimeout(function () {
        if (document.activeElement) document.activeElement.blur();
        lightboxClose.focus();
      }, 50);
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      lightboxImg.src = "";
      if (lightboxLastFocused) lightboxLastFocused.focus();
    }
    lightboxTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        var label = trigger.querySelector("h3, strong");
        openLightbox(trigger.getAttribute("href"), label ? label.textContent : "");
      });
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  /* ---- Footer perde (curtain reveal — DESİL deseni) ----
     Footer altta fixed bekler; main (opak, üst katman) scroll sonunda üstünden
     kalkınca açığa çıkar. Yalnız footer viewport'a sığıyorsa etkinleşir —
     kısa ekranlarda footer statik akışta kalır. Yükseklik font/logo yüklenince
     oturur; resize/load/fonts.ready'de yeniden ölçülür. */
  var pageMain = document.getElementById("main");
  var siteFooter = document.querySelector(".site-footer");
  function fitFooterReveal() {
    if (!pageMain || !siteFooter) return;
    document.body.classList.remove("has-reveal");
    pageMain.style.marginBottom = "";
    var h = siteFooter.offsetHeight; /* statik durumda ölçülür */
    if (h > 0 && h <= window.innerHeight * 0.9) {
      document.body.classList.add("has-reveal");
      pageMain.style.marginBottom = h + "px";
    }
  }
  fitFooterReveal();
  window.addEventListener("resize", fitFooterReveal);
  window.addEventListener("load", fitFooterReveal);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitFooterReveal);

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

  /* ==== W3 stat-counter (FE-2) ====
     [data-count-to] öğelerini IntersectionObserver ile 0'dan hedefe sayar, ekrana ilk
     girişte bir kez oynar (unobserve ile tekrar tetiklenmez). Reduced-motion'da veya
     IntersectionObserver desteklenmiyorsa hiçbir şey yapılmaz — HTML'deki nihai değer
     (fallback metin) olduğu gibi kalır; bu fonksiyon değeri üretmez, yalnız animasyonu
     ekler (components.md → stat-tile "stat-counter" varyantı). */
  var countEls = document.querySelectorAll("[data-count-to]");
  if (countEls.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countObserver.unobserve(entry.target);
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count-to"), 10);
          var prefix = el.getAttribute("data-count-prefix") || "";
          var suffix = el.getAttribute("data-count-suffix") || "";
          var duration = 1200;
          var start = null;
          function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = prefix + Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    countEls.forEach(function (el) { countObserver.observe(el); });
  }
})();
