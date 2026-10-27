# Tadbirkorlik asoslari — elektron doska uchun interaktiv darslik

11-sinf «Tadbirkorlik asoslari» (U. G‘afurov, Q. Sharipov, 2018) darsligining **30 mavzusi** bitta saytda.
Har bir mavzuda: slaydlar · multfilm · video dars · lug‘at · saralash o‘yini · jamoaviy viktorina · savol-javob kartalari · amaliy topshiriq.

Sayt faqat **ruxsat berilgan emaillar** uchun ochiladi. Admin panel orqali emaillarni qo‘shish va o‘chirish, har bir mavzuga YouTube video biriktirish mumkin.

---

## 1. Firebase loyihasini yaratish (bir marta, ~10 daqiqa)

1. <https://console.firebase.google.com> → **Add project** (masalan, `tadbirkorlik-asoslari`). Google Analytics shart emas.
2. **Build → Authentication → Get started → Sign-in method**:
   - **Google → Enable** (o‘quvchi va o‘qituvchilar shu orqali kiradi). Support email sifatida o‘z emailingizni tanlang → Save.
   - **Email/Password → Enable** (faqat admin panel uchun).
   - **Authentication → Users → Add user**: email `dilfuzamavlanova446@gmail.com` va o‘zingiz tanlagan admin parolini kiriting. Parol faqat Firebase’da saqlanadi, kodda yo‘q.
   - **Authentication → Settings → User actions**: «Enable create (sign-up)» belgisini olib tashlang — shunda saytda hech kim o‘zi akkaunt ocha olmaydi.
3. **Authentication → Settings → Authorized domains → Add domain**: Netlify manzilingizni qo‘shing (masalan, `tadbirkorlik.netlify.app`). Keyinroq o‘z domeningiz bo‘lsa, uni ham qo‘shing.
4. **Build → Firestore Database → Create database** → Location: `eur3` (yoki yaqinroq) → **Start in production mode**.
5. **Firestore → Rules** bo‘limiga `firestore.rules` faylidagi matnni to‘liq qo‘yib, **Publish** bosing.
6. **Project settings (⚙️) → General → Your apps → Web (`</>`)** → ilova nomini yozing → **Register app**. Chiqqan `firebaseConfig` dan 4 ta qiymatni oling.
7. `js/config.js` faylini oching va qiymatlarni qo‘ying:

```js
window.TB_CONFIG = {
  firebase: {
    apiKey: "AIza...",
    authDomain: "tadbirkorlik-asoslari.firebaseapp.com",
    projectId: "tadbirkorlik-asoslari",
    appId: "1:123...:web:abc..."
  },
  admins: ["dilfuzamavlanova446@gmail.com"]
};
```

> Bu kalitlar maxfiy emas — Firebase web-kalitlari ochiq bo‘lishi uchun mo‘ljallangan. Himoyani `firestore.rules` ta’minlaydi.

## 2. Netlify’ga joylash

1. <https://app.netlify.com> → **Add new site → Import an existing project → GitHub** → shu repozitoriyani tanlang.
2. Build command: *bo‘sh*, Publish directory: `.` → **Deploy**.
3. Sayt manzilini (masalan, `xxx.netlify.app`) Firebase **Authorized domains** ro‘yxatiga qo‘shishni unutmang (1-bo‘lim, 3-qadam).

## 3. Foydalanish

- **Sayt**: `https://SAYT/` → **Google orqali kirish**. Faqat ruxsat berilgan emaillar kiradi, qolganlarga «Siz kira olmaysiz» sahifasi chiqadi.
- **Admin panel** — darslik saytidan butunlay alohida sayt: `https://SAYT/admin/` → admin email va parolini kiriting. Darslik saytida admin tugmasi ham, admin sahifasi ham yo‘q. Xohlasangiz, admin panelni Netlify’da alohida sayt qilib ham joylashingiz mumkin (o‘sha repo, Publish directory `.`; manzili `…/admin/`).
- **Admin panelda**: email qo‘shish (izoh bilan), qidirish, o‘chirish; har bir mavzuga YouTube havolasini biriktirish.
- Ro‘yxatda yo‘q email bilan kirilsa — **«Siz kira olmaysiz»** sahifasi chiqadi.

### Admin parolini o‘zgartirish
Firebase Console → Authentication → Users → admin qatori → ⋮ → **Reset password**.

### Yangi admin qo‘shish
Ikki joyda yozish kerak: `js/config.js` → `admins` ro‘yxati va `firestore.rules` → `isAdmin()` ichidagi ro‘yxat (rules’ni Firebase Console’da qayta Publish qiling). Keyin Authentication → Users’da unga akkaunt yarating.

### Admin panel fayllari
`admin/index.html`, `admin/admin.js`, `admin/admin.css` — alohida ilova. U faqat `js/config.js` (Firebase sozlamalari) va umumiy dizayn fayllaridan (`css/`) foydalanadi.

## 4. Lokal sinash

`index.html` ni brauzerda ochsangiz (Firebase sozlanmagan bo‘lsa) **DEMO rejim** ishlaydi: kirish taqlid qilinadi, ma’lumotlar brauzer xotirasida saqlanadi. `admin/` demo rejimda ham email va parol so‘raydi (bu holatda tekshiruv brauzerda bo‘ladi — u faqat sinov uchun; haqiqiy himoya Firebase ulangach ishlaydi).

## Muhim eslatma

Kirish cheklovi saytning interfeysini himoya qiladi. Dars matnlari (`js/topics/*.js`) statik fayl bo‘lgani uchun, manzilini biladigan odam ularni to‘g‘ridan to‘g‘ri ochishi texnik jihatdan mumkin. Admin ro‘yxati va video havolalari esa Firestore’da qoidalar bilan himoyalangan.

## Tuzilma

```
index.html            — asosiy sahifa
css/base.css, app.css — dizayn
js/config.js          — Firebase sozlamalari va adminlar
js/auth.js            — kirish, ruxsat tekshiruvi, admin funksiyalari
js/app.js             — kutubxona (kitob javoni), dars bo‘limlari, admin panel, asboblar
js/film.js            — multfilm dvigateli
js/topics/t01–t30.js  — 30 mavzu kontenti (o‘zbekcha)
js/topics/ru/t01–t30.js — ruscha tarjima
js/i18n.js            — interfeys tarjimasi (UZ/RU)
admin/                — admin panel (alohida sayt)
js/themes.js, css/themes.css — har bir darsning o‘z uslubi (rang, shrift, naqsh, joylashuv)
js/topics/extra-cards.js — qo‘shimcha savol-javob kartalari (har mavzuda 30 ta)
firestore.rules       — Firestore xavfsizlik qoidalari
```
