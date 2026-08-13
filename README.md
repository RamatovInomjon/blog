# Inomjon's blog

Machine Learning blog o'zbek tilida — [inomjonramatov.uz](https://inomjonramatov.uz)

Jekyll + Minimal Mistakes, GitHub Pages'da hosting qilinadi.

---

## Post yozish (admin panel)

Postlarni qo'lda markdown fayl yaratmasdan, brauzerdagi admin panel orqali
yozish mumkin. Panel faqat sizning kompyuteringizda ishlaydi (127.0.0.1),
hech qanday parol yoki tashqi xizmat kerak emas.

```bash
npm run admin
# yoki: node admin/server.js --port 5000
```

So'ng brauzerda **http://127.0.0.1:4000** ni oching.

### Imkoniyatlari

| Nima | Qanday |
|---|---|
| Yangi post | **+ Yangi post** tugmasi |
| Live preview | **Split** rejimi — chapda markdown, o'ngda natija |
| Rasm yuklash | Rasmni editorga **tashlang** (drag & drop), **paste** qiling yoki 🖼 tugmasi |
| Teg/kategoriya | Yozib **Enter** bosing |
| Saqlash | **⌘S / Ctrl+S** |
| Chop etish | **Publish** → commit + push → sayt avtomatik yangilanadi |

Formatlash uchun tezkor tugmalar: `⌘B` qalin, `⌘I` kursiv, `⌘K` havola.

### Qoralama va chop etilgan postlar

- **Qoralama** → `_drafts/` papkasiga tushadi. Jekyll uni **qurmaydi**, ya'ni
  saytda ko'rinmaydi. Xohlagancha yozib qo'yish mumkin.
- **Chop etilgan** → `_posts/` papkasiga `YYYY-MM-DD-slug.md` nomi bilan tushadi
  va saytda chiqadi.

Qoralamani chop etish uchun uni oching va **Publish** bosing.

> Mavjud postni tahrirlaganda fayl nomi **o'zgarmaydi** — chunki fayl nomi
> post URL'ini belgilaydi va uni o'zgartirish eski havolalarni buzadi.

---

## Saytni lokalda ko'rish

Bu ixtiyoriy — admin panel Jekyll'siz ham ishlaydi. Lekin saytning haqiqiy
ko'rinishini tekshirish uchun:

```bash
sudo apt install ruby-dev build-essential   # bir marta
bundle install
bundle exec jekyll serve
```

So'ng **http://127.0.0.1:4000** — Jekyll'ning o'z serveri.

> Admin panel ham 4000-portni ishlatadi. Ikkalasini birga ishlatish uchun
> birini boshqa portga o'tkazing: `node admin/server.js --port 4001`.

---

## Deploy

Push qilinganda GitHub Actions saytni avtomatik quradi va deploy qiladi
(`.github/workflows/deploy.yml`).

**Bir martalik sozlash:** GitHub repo → **Settings → Pages → Build and
deployment → Source** ni **GitHub Actions** ga o'zgartiring.

Shundan keyin `gh-pages` branchiga har push saytni yangilaydi. Jarayonni
**Actions** tabida kuzatish mumkin.

---

## Loyiha tuzilishi

```
_posts/            chop etilgan postlar (YYYY-MM-DD-slug.md)
_drafts/           qoralamalar (saytda ko'rinmaydi)
_pages/            statik sahifalar (about, resume, arxivlar)
_layouts/          sahifa shablonlari
_includes/         qayta ishlatiladigan bo'laklar
  head/custom.html   fontlar, theme bootstrap, MathJax
  footer/custom.html modern.js ni ulaydi
_sass/
  custom/_tokens.scss   yorug'/qorong'i rang palitrasi (CSS variables)
  custom/_modern.scss   zamonaviy dizayn qatlami
  minimal-mistakes/skins/_modern.scss   build-time palitra
assets/js/modern.js  theme toggle, reading progress, kod nusxalash, TOC
images/            rasmlar
admin/             lokal admin panel (Jekyll build'ga kirmaydi)
```

### Dizayn qatlami haqida

Rang almashtirish (yorug'/qorong'i) CSS custom property'lar orqali ishlaydi.
Ranglarni o'zgartirish uchun faqat `_sass/custom/_tokens.scss` ni tahrirlang —
u yerda uchta holat bor: `:root` (yorug'), `prefers-color-scheme: dark`
(tizim sozlamasi) va `[data-theme="dark"]` (foydalanuvchi tanlovi).

`_sass/minimal-mistakes/skins/_modern.scss` esa build vaqtidagi SCSS palitra —
uni CSS variable'ga aylantirib bo'lmaydi, chunki mavzu ular ustida `mix()` va
YIQ kontrast funksiyalarini ishlatadi.

---

## Matematik formulalar

Postning front matter'iga `mathjax: true` qo'shing (admin panelda checkbox bor),
so'ng `$...$` (inline) yoki `$$...$$` (block) yozing.
