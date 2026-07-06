/* ============================================================
   district-map.js — W1 interaktif ilçe haritası (FE-3, Wave 3)
   SADECE index.html'e eklenir. main.js'e KASITLI OLARAK dokunmaz
   (ortak dosya çakışmasını önlemek için ayrı script — lead kararı).
   Bağımlılık yok; SVG markup index.html içine gömülüdür.

   Beyar revizesi (2026-07-06): mobilde harita artık gizlenmiyor (bkz.
   main.css). Dokunmatik girdide "hover" kavramı yok — bu yüzden iki ayrı
   etkileşim modeli var: fare/klavye = hover/focus önizler, tıklama/Enter
   doğrudan gider; dokunmatik = ilk dokunuş ilçeyi SEÇER (tooltip sabitlenir,
   içinde gerçek link belirir), navigasyon YAPMAZ — aynı ilçeye ikinci
   dokunuş linke gider. Girdi tipi `(hover:none) and (pointer:coarse)` ile
   ayrılır (main.css'teki ipucu metni seçimiyle AYNI medya sorgusu ailesi).
   ============================================================ */
(function () {
  var map = document.querySelector('[data-district-map]');
  if (!map) return;

  var panel = map.querySelector('.district-map__panel');
  var tooltip = map.querySelector('[data-district-tooltip]');
  var tooltipName = tooltip.querySelector('[data-tooltip-name]');
  var tooltipCount = tooltip.querySelector('[data-tooltip-count]');
  var tooltipLink = tooltip.querySelector('[data-tooltip-link]');
  var areas = map.querySelectorAll('.district-map__area');
  var isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  var selected = null;

  function positionTooltip(area) {
    var panelRect = panel.getBoundingClientRect();
    var areaRect = area.getBoundingClientRect();
    var x = areaRect.left + areaRect.width / 2 - panelRect.left;
    var y = areaRect.top - panelRect.top;

    // Panel sınırları içinde tut (taşma 0 kuralı — tooltip de dahil)
    var tooltipWidth = tooltip.offsetWidth || 160;
    var minX = tooltipWidth / 2 + 8;
    var maxX = panelRect.width - tooltipWidth / 2 - 8;
    x = Math.max(minX, Math.min(x, maxX));

    tooltip.style.left = x + 'px';
    tooltip.style.top = Math.max(y, 8) + 'px';
  }

  function showTooltip(area, pinned) {
    var name = area.getAttribute('data-ilce');
    var count = area.getAttribute('data-dernek');
    tooltipName.textContent = name;
    tooltipCount.textContent = count + ' Dernek';
    if (tooltipLink) tooltipLink.setAttribute('href', area.getAttribute('href'));
    tooltip.hidden = false;
    tooltip.classList.toggle('is-pinned', !!pinned);
    positionTooltip(area);
  }

  function hideTooltip() {
    tooltip.hidden = true;
    tooltip.classList.remove('is-pinned');
  }

  function clearSelection() {
    if (selected) selected.classList.remove('is-selected');
    selected = null;
    hideTooltip();
  }

  if (isTouch) {
    areas.forEach(function (area) {
      area.addEventListener('click', function (e) {
        if (selected === area) return; // ikinci dokunuş: linke normal navigasyon
        e.preventDefault();
        if (selected) selected.classList.remove('is-selected');
        selected = area;
        area.classList.add('is-selected');
        showTooltip(area, true);
      });
    });
    // Harita dışına dokununca seçim/tooltip kapanır
    document.addEventListener('click', function (e) {
      if (!map.contains(e.target)) clearSelection();
    });
  } else {
    areas.forEach(function (area) {
      area.addEventListener('mouseenter', function () { showTooltip(area, false); });
      area.addEventListener('mousemove', function () { positionTooltip(area); });
      area.addEventListener('mouseleave', hideTooltip);
      area.addEventListener('focus', function () { showTooltip(area, false); });
      area.addEventListener('blur', hideTooltip);
    });
    // Panel dışına çıkınca (klavye ile Tab'la uzaklaşma) tooltip kapansın
    map.addEventListener('focusout', function (e) {
      if (!map.contains(e.relatedTarget)) hideTooltip();
    });
  }
})();
