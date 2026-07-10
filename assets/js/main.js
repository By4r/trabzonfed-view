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

/* ==================================================================== */
/* WAVE 2 — [B]/[C] etkileşim eklentileri (Lead entegre etti).          */
/* ==================================================================== */

/* ---- Generic modal (şirket pop / [data-modal-target]) — #10 ---- */
(function () {
  var modalTriggers = document.querySelectorAll("[data-modal-target]");
  if (!modalTriggers.length) return;

  var activeModal = null;
  var modalLastFocused = null;

  function getFocusable(panel) {
    return Array.prototype.slice.call(
      panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );
  }

  function openModal(modal, trigger) {
    if (!modal) return;
    modalLastFocused = trigger || document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    activeModal = modal;
    var panel = modal.querySelector(".modal__panel");
    var focusable = getFocusable(panel);
    window.setTimeout(function () {
      (focusable[0] || panel).focus();
    }, 50);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeModal = null;
    if (modalLastFocused) modalLastFocused.focus();
  }

  modalTriggers.forEach(function (trigger) {
    var target = document.querySelector(trigger.getAttribute("data-modal-target"));
    trigger.addEventListener("click", function () {
      openModal(target, trigger);
    });
  });

  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.querySelectorAll("[data-modal-close]").forEach(function (closer) {
      closer.addEventListener("click", function () {
        closeModal(modal);
      });
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!activeModal) return;
    if (e.key === "Escape") {
      closeModal(activeModal);
      return;
    }
    if (e.key === "Tab") {
      var panel = activeModal.querySelector(".modal__panel");
      var focusable = getFocusable(panel);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

/* ---- Etkinlik Takvimi (etkinlikler.html [data-calendar]) — #14 ----
   Etkinlik verisi STATİK DEMO placeholder'dır — gerçek program DEĞİLDİR;
   gerçek veri geldiğinde yalnız EVENTS dizisi güncellenir. */
(function () {
  var calRoot = document.querySelector("[data-calendar]");
  if (!calRoot) return;

  var MONTH_NAMES = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

  /* Prototipte "bugün" sabit demo tarihidir (2026-07-10), sistem saatine bağlı değildir. */
  var DEMO_TODAY = "2026-07-10";

  var EVENTS = [
    { start: "2026-07-03", end: "2026-07-03", title: "Yönetim Kurulu Aylık Toplantısı", location: "Federasyon Genel Merkezi, İstanbul", cat: "toplanti" },
    { start: "2026-07-07", end: "2026-07-09", title: "Trabzon Kültür Günleri", location: "İstanbul Kongre Merkezi", cat: "kultur" },
    { start: "2026-07-10", end: "2026-07-10", title: "Karadeniz Mutfağı ve Halk Oyunları Kursu", location: "Federasyon Eğitim Salonu, İstanbul", cat: "egitim" },
    { start: "2026-07-14", end: "2026-07-14", title: "Gençlik Kolları Proje Toplantısı", location: "Federasyon Genel Merkezi, İstanbul", cat: "toplanti" },
    { start: "2026-07-18", end: "2026-07-18", title: "Hemşehri Dayanışma Kahvaltısı", location: "Kadıköy Kültür Evi, İstanbul", cat: "dayanisma" },
    { start: "2026-07-21", end: "2026-07-21", title: "İletişim ve Halkla İlişkiler Semineri", location: "Federasyon Eğitim Salonu, İstanbul", cat: "egitim" },
    { start: "2026-07-25", end: "2026-07-25", title: "Federasyon Olağan Genel Kurulu", location: "Harbiye Kongre Merkezi, İstanbul", cat: "genelkurul" },
    { start: "2026-07-29", end: "2026-07-30", title: "Yaylalar Doğa Yürüyüşü ve Pikniği", location: "Çaykara, Trabzon", cat: "kultur" },
    { start: "2026-07-31", end: "2026-07-31", title: "Yaz Sonu Dayanışma Gecesi", location: "Ankara Sheraton Oteli", cat: "dayanisma" }
  ];

  var current = new Date(2026, 6, 1);
  var selectedDate = null;

  var titleEl = calRoot.querySelector("[data-cal-title]");
  var gridEl = calRoot.querySelector("[data-cal-grid]");
  var timelineTitleEl = calRoot.querySelector("[data-cal-timeline-title]");
  var timelineEl = calRoot.querySelector("[data-cal-timeline]");
  var resetEl = calRoot.querySelector("[data-cal-reset]");
  var clearBtn = calRoot.querySelector("[data-cal-clear]");
  var prevBtn = calRoot.querySelector("[data-cal-prev]");
  var nextBtn = calRoot.querySelector("[data-cal-next]");
  var todayBtn = calRoot.querySelector("[data-cal-today]");

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function isoOf(date) { return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()); }
  function formatLong(iso) {
    var parts = iso.split("-");
    var d = parseInt(parts[2], 10), m = parseInt(parts[1], 10) - 1, y = parts[0];
    return d + " " + MONTH_NAMES[m] + " " + y;
  }
  function formatRange(ev) {
    return ev.start === ev.end ? formatLong(ev.start) : formatLong(ev.start) + " – " + formatLong(ev.end);
  }
  function eventsForDay(iso) {
    return EVENTS.filter(function (ev) { return iso >= ev.start && iso <= ev.end; });
  }

  function buildMonthCells(year, month) {
    var firstDay = new Date(year, month, 1);
    var startOffset = (firstDay.getDay() + 6) % 7; /* Pazartesi = 0 */
    var gridStart = new Date(year, month, 1 - startOffset);
    var cells = [];
    var count = 35;
    for (var i = 0; i < count; i++) {
      cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
    }
    if (cells[count - 1].getMonth() === month) {
      for (var j = count; j < 42; j++) {
        cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + j));
      }
    }
    return cells.map(function (date) {
      return { date: date, iso: isoOf(date), muted: date.getMonth() !== month };
    });
  }

  function renderCalendar() {
    var year = current.getFullYear(), month = current.getMonth();
    if (titleEl) titleEl.textContent = MONTH_NAMES[month] + " " + year;
    var cells = buildMonthCells(year, month);
    gridEl.innerHTML = "";
    cells.forEach(function (cell) {
      var dayEvents = eventsForDay(cell.iso);
      var cellEl = document.createElement("button");
      cellEl.type = "button";
      cellEl.className = "cal-cell" +
        (cell.muted ? " is-muted" : "") +
        (cell.iso === DEMO_TODAY ? " is-today" : "") +
        (cell.iso === selectedDate ? " is-selected" : "");
      cellEl.setAttribute("data-date", cell.iso);
      cellEl.setAttribute("aria-label", formatLong(cell.iso) + (dayEvents.length ? " — " + dayEvents.length + " etkinlik" : " — etkinlik yok"));
      var num = document.createElement("span");
      num.className = "cal-cell__num";
      num.textContent = cell.date.getDate();
      cellEl.appendChild(num);
      var dots = document.createElement("span");
      dots.className = "cal-cell__dots";
      dayEvents.forEach(function (ev) {
        var dot = document.createElement("i");
        dot.className = "cal-dot cal-dot--" + ev.cat;
        dots.appendChild(dot);
      });
      cellEl.appendChild(dots);
      cellEl.addEventListener("click", function () {
        selectedDate = selectedDate === cell.iso ? null : cell.iso;
        renderCalendar();
        renderTimeline();
      });
      gridEl.appendChild(cellEl);
    });
  }

  function renderTimeline() {
    var items;
    if (selectedDate) {
      if (timelineTitleEl) timelineTitleEl.textContent = formatLong(selectedDate);
      items = eventsForDay(selectedDate);
      if (resetEl) resetEl.hidden = false;
    } else {
      if (timelineTitleEl) timelineTitleEl.textContent = "Yaklaşan Etkinlikler";
      items = EVENTS.filter(function (ev) { return ev.end >= DEMO_TODAY; })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; })
        .slice(0, 6);
      if (resetEl) resetEl.hidden = true;
    }
    timelineEl.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("li");
      empty.className = "cal-timeline__empty";
      empty.textContent = "Bu tarihte planlanmış bir etkinlik bulunmuyor.";
      timelineEl.appendChild(empty);
      return;
    }
    items.forEach(function (ev) {
      var li = document.createElement("li");
      li.className = "cal-timeline__item";
      li.innerHTML =
        '<span class="cal-timeline__marker cal-timeline__marker--' + ev.cat + '" aria-hidden="true"></span>' +
        '<span class="cal-timeline__date">' + formatRange(ev) + '</span>' +
        '<a class="cal-timeline__title" href="etkinlik-detay.html">' + ev.title + '</a>' +
        '<span class="cal-timeline__location">' + ev.location.toUpperCase() + '</span>';
      timelineEl.appendChild(li);
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () {
    current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    selectedDate = null;
    renderCalendar(); renderTimeline();
  });
  if (nextBtn) nextBtn.addEventListener("click", function () {
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    selectedDate = null;
    renderCalendar(); renderTimeline();
  });
  if (todayBtn) todayBtn.addEventListener("click", function () {
    current = new Date(2026, 6, 1);
    selectedDate = null;
    renderCalendar(); renderTimeline();
  });
  if (clearBtn) clearBtn.addEventListener("click", function () {
    selectedDate = null;
    renderCalendar(); renderTimeline();
  });

  renderCalendar();
  renderTimeline();
})();

