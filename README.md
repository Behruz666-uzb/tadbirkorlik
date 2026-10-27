# Tadbirkorlik asoslari — elektron doska uchun interaktiv darslik

11-sinf «Tadbirkorlik asoslari» (U. G‘afurov, Q. Sharipov, 2018) darsligining **30 mavzusi**, o‘zbek va rus tilida.
Har bir mavzuda: slaydlar · multfilm · video dars · lug‘at · saralash o‘yini · jamoaviy viktorina · 30 ta savol-javob kartasi · amaliy topshiriq. Har bir darsning o‘z uslubi (rang, shrift, naqsh, joylashuv) bor.

Ikki sayt, bitta repo:

| Sayt | Kim uchun | Kirish |
|---|---|---|
| **Darslik sayti** | o‘qituvchi va o‘quvchilar | email + shaxsiy kirish kodi (kodni admin beradi) |
| **Admin sayti** | faqat administrator | admin email + parol |

Server: **Netlify Functions** (`netlify/core.mjs`), ma’lumotlar: **Netlify Blobs**. Firebase yoki boshqa tashqi xizmat kerak emas — Netlify’ga ulash kifoya.

---

## Netlify’ga joylash (5 daqiqa)

### 1. Darslik sayti
1. <https://app.netlify.com> → **Add new site → Import an existing project → GitHub** → `tadbirkorlik-asoslari` reposini tanlang.
2. Sozlamalar `netlify.toml` dan avtomatik olinadi (Build command: `node build.mjs`, Publish: `dist`). **Deploy** ni bosing.
3. **Site configuration → Change site name**: masalan `tadbirkorlik-asoslari` → manzil `https://tadbirkorlik-asoslari.netlify.app`.

### 2. Admin sayti (o‘sha repo’dan ikkinchi sayt)
1. Yana **Add new site → Import an existing project → GitHub** → **o‘sha repo**.
2. Deploy’dan keyin sayt nomini **darslik sayti nomi + `-admin`** qiling: masalan `tadbirkorlik-asoslari-admin`.
3. **Deploys → Trigger deploy → Deploy site** (nom o‘zgargach bir marta qayta yig‘ish kerak).

Nom `-admin` bilan tugagani uchun sayt o‘zi admin panel sifatida yig‘iladi va barcha so‘rovlarni darslik saytining serveriga uzatadi — ikkala sayt **bitta bazadan** foydalanadi. Boshqacha nom tanlasangiz, admin saytiga ikki muhit o‘zgaruvchisini qo‘shing: `TB_SITE=admin` va `TB_API_URL=https://<darslik-sayti>.netlify.app`.

---

## Foydalanish

1. Admin saytiga kiring: email `dilfuzamavlanova446@gmail.com` va boshlang‘ich parol (sizga alohida aytilgan).
   **Birinchi kirishdayoq parolni «Xavfsizlik» bo‘limida almashtiring.**
2. **Email qo‘shing** → sayt avtomatik **kirish kodi** yaratadi (masalan `K7P2-9QXM`). Kodni o‘qituvchiga bering. Kod faqat bir marta ko‘rsatiladi.
3. O‘qituvchi darslik saytiga **email + kod** bilan kiradi. Ro‘yxatda yo‘q email bilan kirilsa — «Siz kira olmaysiz» sahifasi.
4. Kod yo‘qolsa — **«Yangi kod»**: eski kod va u bilan ochilgan sessiyalar darhol bekor bo‘ladi.
5. **O‘chirish** — foydalanuvchi darhol saytdan chiqariladi.
6. **Mavzular videolari** — har mavzuga YouTube havolasi; u darslik saytidagi «Video dars» bo‘limida chiqadi.

### Xavfsizlik
- Parol va kodlar serverda **scrypt** xeshi bilan saqlanadi; brauzerga hech qachon yuborilmaydi.
- Sessiyalar imzolangan token bilan; foydalanuvchi o‘chirilsa yoki kod yangilansa, token darhol yaroqsiz.
- 8 marta noto‘g‘ri urinishdan keyin 15 daqiqa bloklanadi.
- Repo’ni **Private** qilish tavsiya etiladi.
- Ixtiyoriy muhit o‘zgaruvchilari (darslik saytida): `TB_SECRET` — token imzosi uchun o‘z kalitingiz (bo‘lmasa avtomatik yaratiladi), `TB_ADMIN_EMAIL` — admin emailini almashtirish.

---

## Lokal sinash
- `index.html` yoki `admin/index.html` ni to‘g‘ridan to‘g‘ri brauzerda ochsangiz — **DEMO rejim** (server yo‘q, ma’lumot faqat brauzerda).
- Server testlari: `npm install && npm test`.

## Tuzilma
```
index.html                 — darslik sayti
admin/                     — admin sayti (index.html, admin.js, admin.css)
css/  js/                  — dizayn va dvigatel (app.js, film.js, themes.js, i18n.js, auth.js)
js/topics/t01–t30.js       — 30 mavzu (o‘zbekcha);  js/topics/ru/ — ruscha
js/topics/extra-cards.js   — qo‘shimcha savol-javob kartalari
netlify/core.mjs           — server mantig‘i (kirish, ruxsatlar, kodlar, videolar)
netlify/functions/api.mjs  — Netlify Function (/api/*)
build.mjs                  — dist/ ni yig‘adi (darslik yoki admin sayti)
tests/api.test.mjs         — server testlari
```
