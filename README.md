# Tadbirkorlik asoslari — elektron doska uchun interaktiv darslik

11-sinf «Tadbirkorlik asoslari» (U. G‘afurov, Q. Sharipov, 2018) darsligining **30 mavzusi** bitta saytda.
Har bir mavzuda: slaydlar · multfilm · video dars · lug‘at · saralash o‘yini · jamoaviy viktorina · savol-javob kartalari · amaliy topshiriq.

Sayt faqat **ruxsat berilgan emaillar** uchun ochiladi. Admin panel orqali emaillarni qo‘shish va o‘chirish, har bir mavzuga YouTube video biriktirish mumkin.

---

## 1. Firebase loyihasini yaratish (bir marta, ~10 daqiqa)

1. <https://console.firebase.google.com> → **Add project** (masalan, `tadbirkorlik-asoslari`). Google Analytics shart emas.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**. Support email sifatida o‘z emailingizni tanlang → Save.
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

- Saytga kiring → **Google bilan kirish**.
- Admin (`dilfuzamavlanova446@gmail.com`) doim kiradi; o‘ng pastdagi dumaloq tugma → **Admin panel**.
- **Admin panel**: email qo‘shish (izoh bilan), qidirish, o‘chirish; har bir mavzuga YouTube havolasini biriktirish.
- Ro‘yxatda yo‘q email bilan kirilsa — **«Siz kira olmaysiz»** sahifasi chiqadi.

### Yangi admin qo‘shish
Ikki joyda yozish kerak: `js/config.js` → `admins` ro‘yxati va `firestore.rules` → `isAdmin()` ichidagi ro‘yxat (rules’ni Firebase Console’da qayta Publish qiling).

## 4. Lokal sinash

`index.html` ni brauzerda ochsangiz (Firebase sozlanmagan bo‘lsa) **DEMO rejim** ishlaydi: kirish taqlid qilinadi, ma’lumotlar brauzer xotirasida saqlanadi.

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
js/topics/t01–t30.js  — 30 mavzu kontenti
firestore.rules       — Firestore xavfsizlik qoidalari
```
