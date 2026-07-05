# Trabzonlular Federasyonu — trabzonfed-view

## PROJE

**Trabzonlular Federasyonu** web sitesi statik prototipi (kurum adının doğru yazımı budur —
"Trabzonlar" değil). Stack: **vanilla HTML/CSS/JS** — build pipeline yok, framework yok.
Federasyon altındaki ilçe dernek sayfaları da kapsamda; mimariye girilmez, statik sayfa olarak
üretilir. Üyelik ve bağış/ödeme akışları da kapsam İÇİNDE — dernek yapısına uygun statik demo
sayfalar olarak (Beyar kararı, 2026-07-05).

- **Kaynak (içerik + kurumsal dil + görsel kimlik):** `/Users/gaviaworks/Desktop/Trazon Fed. Sources`
  — eski site HTML kaynakları (`dernek-icerik/`) + 2 brief docx (federasyon + dernek şablonu).
- **Kompozisyon/modernlik referansı:** gaviaworks.com — SADECE kompozisyon, whitespace ritmi,
  grid disiplini, section kurgusu. **Renk ve font gaviaworks'ten ALINMAZ**; kimlik federasyonun
  kendi kaynaklarından türetilir (bordo + mavi + lacivert; bkz. `tasks/plan.md` token bölümü).
- **Hedef repo:** `By4r/trabzonfed-view` (public, GitHub Pages). Repo/remote kurulumu ve commit
  **handoff aşamasında** yapılır (`/handoff` skill'i).

## AGENT TEAM TANIMI (Wave 2'de geçerli)

- **Lead:** koordinasyon-only. Kendisi sayfa üretmez; görev dağıtır, entegrasyonu ve component
  sözlüğünü yönetir, QA raporlarını değerlendirir.
- **Frontend teammate'lar:** model **Sonnet**. Her teammate'ın dosya sahipliği NET (hangi sayfa
  kimin, plan.md'de yazar). Ortak dosyalarda (`assets/css/tokens.css`, shell parçaları:
  header/footer/nav) **full-file overwrite YASAK** — sadece hedefli edit; ortak dosyada
  tek-yazar kuralı geçerlidir (plan.md'de kim yazar belli olur).
- **QA teammate:** model **Sonnet**. Playwright headless ile **1440px + 390px** screenshot alır,
  `docs/screenshots/` altına kaydeder (gitignored). Bağımsız değerlendirir, minör düzeltmeleri
  kendisi yapar, kısa yazılı rapor verir. **Screenshot'lar Beyar'a gösterilmez** — rapor yazılıdır.
- **Wave-sonu Beyar onay ritüeli ZORUNLU:** her wave sonunda durum raporu sunulur, Beyar onayı
  gelmeden sonraki wave başlamaz.

## FRONTEND-DESIGN SKILL

Her frontend teammate, **her sayfa üretiminden ÖNCE** frontend-design skill'ini okur ve uygular.
"Kaliteyi yükselt" evet; kanonik shell/token sisteminden sapma **hayır**. Skill'in önerisi token
sistemiyle çelişirse token sistemi kazanır.

## ÖZ-DENETİM LOOP'U

Her sayfa için: **üret → Playwright SS (1440 + 390) → öz-değerlendirme → yazılı feedback →
iyileştir → tekrar SS.** Öz-değerlendirme eksenleri:

1. Modernlik rubriği (`tasks/plan.md`'deki rubrik)
2. UI/UX best practice (hiyerarşi, okunabilirlik, touch target, responsive kırılım)
3. İçerik sadakati (metin yalnızca kaynaklardan; uydurma yok)
4. Kimlik sadakati (token paleti, tipografi, kurumsal ton)

**Max 2 revize turu**, sonra DUR — kalan sorunları rapora yaz, lead/QA'ya bırak.

## COMPONENT SÖZLÜĞÜ

`tasks/components.md` **TEK kaynak**. Her desen (banner, kart, tab, breadcrumb, buton, form...)
bir kez tanımlanır. Teammate yeni desen icat etmez; ihtiyaç görürse lead'e bildirir, lead
sözlüğe ekler, sonra kullanılır. **Desen sapması QA'da FAIL sebebidir.**

## KURALLAR

- **Token sistemi:** tüm renk ve tipografi değerleri `assets/css/tokens.css`'te custom property
  olarak tanımlanır. Sayfa CSS'inde hardcode renk/font YASAK.
- **Kare görsel:** `<img>` tag'i değil, `div` + `background-image` + `cover` + `center`.
  Retina 2x çarpma yok.
- **İçerik politikası (Beyar kararı, 2026-07-05): demo içerik SERBEST.** Öncelik sırası:
  (1) kaynak dokümanlar + eski sitedeki gerçek TR metinler, (2) bunlar yetmezse kurumsal tona
  uygun (TDK uyumlu, resmî-nazik, 2. çoğul şahıs) DEMO içerik üretilir. Demo içerik makul ve
  tutarlı olur; gerçek kişi/kurum verisiymiş gibi sunulmaz, gerçek içerik geldiğinde kolayca
  değiştirilebilir yapıda yazılır. Lorem ipsum ve İngilizce placeholder YASAK.
- **Logo:** federasyonun gerçek logosu Beyar'dan gelecek (mevcut site yenileme modunda).
  Gelene kadar tipografik wordmark kullanılır; logo dosyası gelince tek noktadan değiştirilir.
- `tasks/` ve `docs/screenshots/` gitignored — **asla commit'lenmez**.
- **Commit handoff'a bırakılır:** seçici stage (dosya dosya, asla `git add -A`), ayrı concern
  ayrı commit, İngilizce mesaj, kişisel isim yok. Akış: `/handoff` skill'i.
- **Background polling ve deploy bekleme döngüsü YASAK** — tek kontrol yapılır, sonuç raporlanır.
- **Pilot onaylanmadan Wave 2 başlamaz.** Pilot (index.html) onaylanınca token sistemi + shell
  (header/footer/nav) **KANONİK** ilan edilir; Wave 2'de bunlara dokunulmaz, sadece hedefli
  edit'le genişletilir.
