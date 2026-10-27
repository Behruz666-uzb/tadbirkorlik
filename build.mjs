/* =========================================================
   Netlify yig‘ish skripti (dist/ papkasini tayyorlaydi).
   Bitta repo → ikki sayt:
     • Darslik sayti (oddiy holat): index.html, css, js
     • Admin sayti: sayt nomi "-admin" bilan tugasa (masalan, tadbirkorlik-asoslari-admin)
       yoki TB_SITE=admin bo‘lsa — faqat admin panel.
   ========================================================= */
import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";

const site = process.env.SITE_NAME || "";
const isAdmin = process.env.TB_SITE === "admin" || /-admin$/.test(site);
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

if (isAdmin) {
  const html = readFileSync("admin/index.html", "utf8").replaceAll("../css/", "css/").replaceAll("../js/config.js", "js/config.js");
  writeFileSync("dist/index.html", html);
  cpSync("admin/admin.js", "dist/admin.js");
  cpSync("admin/admin.css", "dist/admin.css");
  mkdirSync("dist/css", { recursive: true }); mkdirSync("dist/js", { recursive: true });
  cpSync("css/base.css", "dist/css/base.css"); cpSync("css/app.css", "dist/css/app.css");
  cpSync("js/config.js", "dist/js/config.js");
  writeFileSync("dist/robots.txt", "User-agent: *\nDisallow: /\n");
  console.log("Admin sayti yig‘ildi (" + (site || "TB_SITE=admin") + ")");
} else {
  cpSync("index.html", "dist/index.html");
  cpSync("css", "dist/css", { recursive: true });
  cpSync("js", "dist/js", { recursive: true });
  if (process.env.TB_INCLUDE_ADMIN === "1" && existsSync("admin")) cpSync("admin", "dist/admin", { recursive: true });
  console.log("Darslik sayti yig‘ildi" + (site ? " (" + site + ")" : ""));
}
