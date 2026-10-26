/* =========================================================
   SOZLAMALAR — Firebase loyihangiz ma’lumotlarini shu yerga yozing.
   Firebase Console → Project settings → General → Your apps → Web app → SDK setup and configuration (Config)
   ========================================================= */
window.TB_CONFIG = {
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    appId: "YOUR_APP_ID"
  },
  // Administratorlar: ular doim kira oladi va admin panelni ko‘radi.
  // Eslatma: shu emaillar firestore.rules faylida ham yozilgan bo‘lishi kerak.
  admins: ["dilfuzamavlanova446@gmail.com"],
  // Faqat DEMO rejim (Firebase sozlanmagan) uchun: admin parolining SHA-256 xeshi.
  // Firebase ulangach parol Firebase'da saqlanadi va bu qator ishlatilmaydi.
  demoAdminPassHash: "d44d3ebe93543c2da153f3384b8cc08fadd9a85436c0d7c7582e1e5248cab533"
};
