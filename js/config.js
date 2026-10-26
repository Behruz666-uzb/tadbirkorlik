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
  admins: ["dilfuzamavlanova446@gmail.com"]
};
