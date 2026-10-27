/* =========================================================
   Tadbirkorlik asoslari — server (Netlify Functions + Netlify Blobs)
   Ma’lumotlar (Blobs, "tb" ombori):
     users   → { "email": { note, salt, hash, v, addedAt, lastLogin } }
     videos  → { t01: "https://youtu.be/…", … }
     admin   → { salt, hash, v }            (parol o‘zgartirilgach)
     secret  → tasodifiy kalit (sessiya tokenlarini imzolash uchun)
     fail:*  → noto‘g‘ri urinishlar hisobi
   ========================================================= */
import crypto from "node:crypto";

const ADMIN_EMAIL_DEFAULT = "dilfuzamavlanova446@gmail.com";
// Boshlang‘ich admin parolining scrypt xeshi (parolning o‘zi kodda yo‘q).
// Admin paneldan parol o‘zgartirilgach, yangi xesh omborga yoziladi va bu ishlatilmaydi.
const ADMIN_DEFAULT = { salt: "188ab5ea07f68cf16dba8c1bc0a43137", hash: "697fb1517915db273fdbbf9b2b4d86811d7fabb37a3c5d062abfae250456a39c", v: 0 };
const CODE_ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const USER_TTL = 30 * 24 * 3600, ADMIN_TTL = 12 * 3600;
const MAX_FAIL = 8, LOCK_MS = 15 * 60 * 1000;
const VIDEO_KEY = /^t(0[1-9]|[12]\d|30)$/;

const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const err = (status, code, message) => json(status, { error: code, message });
const b64u = (buf) => Buffer.from(buf).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
const unb64u = (s) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
const normEmail = (e) => String(e || "").trim().toLowerCase();
const okEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 120;
const normCode = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export function scrypt(pw, salt) { return crypto.scryptSync(String(pw), salt, 32, { N: 16384, r: 8, p: 1 }).toString("hex"); }
function check(pw, rec) { if (!rec || !rec.salt || !rec.hash) return false; const a = Buffer.from(scrypt(pw, rec.salt), "hex"), b = Buffer.from(rec.hash, "hex"); return a.length === b.length && crypto.timingSafeEqual(a, b); }
function newSecret(pw) { const salt = crypto.randomBytes(16).toString("hex"); return { salt, hash: scrypt(pw, salt) }; }
export function genCode() { const bytes = crypto.randomBytes(8); let s = ""; for (let i = 0; i < 8; i++) s += CODE_ABC[bytes[i] % CODE_ABC.length]; return s.slice(0, 4) + "-" + s.slice(4); }

async function getSecret(store, env) {
  if (env.TB_SECRET && env.TB_SECRET.length >= 16) return env.TB_SECRET;
  let s = await store.get("secret");
  if (!s) { s = crypto.randomBytes(32).toString("hex"); await store.set("secret", s); }
  return s;
}
function sign(payload, secret) { const body = b64u(JSON.stringify(payload)); return body + "." + b64u(crypto.createHmac("sha256", secret).update(body).digest()); }
function verify(token, secret) {
  if (!token || token.indexOf(".") < 0) return null;
  const [body, sig] = token.split(".");
  const exp = b64u(crypto.createHmac("sha256", secret).update(body).digest());
  if (sig.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return null;
  try { const p = JSON.parse(unb64u(body).toString()); if (!p.x || p.x < Date.now() / 1000) return null; return p; } catch { return null; }
}

async function readJSON(store, key, def) { const v = await store.get(key, { type: "json" }); return v == null ? def : v; }
async function failed(store, key) { const k = "fail:" + key, r = await readJSON(store, k, { n: 0, t: 0 }); const now = Date.now(); const n = now - r.t > LOCK_MS ? 1 : r.n + 1; await store.setJSON(k, { n, t: now }); }
async function locked(store, key) { const r = await readJSON(store, "fail:" + key, { n: 0, t: 0 }); return r.n >= MAX_FAIL && Date.now() - r.t < LOCK_MS; }
async function clearFail(store, key) { try { await store.delete("fail:" + key); } catch {} }

async function body(req) { try { return await req.json(); } catch { return {}; } }
function bearer(req) { const h = req.headers.get("authorization") || ""; return h.startsWith("Bearer ") ? h.slice(7) : ""; }

/* token → foydalanuvchi (bekor qilinganini ham tekshiradi) */
async function auth(req, store, env, need) {
  const p = verify(bearer(req), await getSecret(store, env));
  if (!p) return null;
  const adminEmail = normEmail(env.TB_ADMIN_EMAIL || ADMIN_EMAIL_DEFAULT);
  if (p.r === "admin") {
    if (p.e !== adminEmail) return null;
    const a = await readJSON(store, "admin", ADMIN_DEFAULT);
    if ((a.v || 0) !== p.v) return null;
    return { email: p.e, role: "admin" };
  }
  if (need === "admin") return null;
  const users = await readJSON(store, "users", {});
  const u = users[p.e];
  if (!u || (u.v || 0) !== p.v) return null;
  return { email: p.e, role: "user" };
}

export async function handle(req, store, env = {}) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/(\.netlify\/functions\/api|api)/, "") || "/";
  const m = req.method;
  const adminEmail = normEmail(env.TB_ADMIN_EMAIL || ADMIN_EMAIL_DEFAULT);
  try {
    if (path === "/health") return json(200, { ok: true });

    /* ---- o‘qituvchi / o‘quvchi kirishi: email + kirish kodi ---- */
    if (path === "/login" && m === "POST") {
      const b = await body(req), email = normEmail(b.email), code = normCode(b.code);
      if (!okEmail(email) || !code) return err(400, "bad_input", "Email va kodni kiriting");
      if (await locked(store, email)) return err(429, "locked", "Juda ko‘p urinish");
      const secret = await getSecret(store, env);
      if (email === adminEmail) { // admin saytga o‘z paroli bilan ham kira oladi
        const a = await readJSON(store, "admin", ADMIN_DEFAULT);
        if (check(b.code, a)) { await clearFail(store, email); return json(200, { token: sign({ e: email, r: "admin", v: a.v || 0, x: Math.floor(Date.now() / 1000) + ADMIN_TTL }, secret), email, role: "admin" }); }
      }
      const users = await readJSON(store, "users", {});
      const u = users[email];
      if (!u) { await failed(store, email); return err(403, "not_allowed", "Bu email ro‘yxatda yo‘q"); }
      if (!check(code, u)) { await failed(store, email); return err(401, "bad_code", "Kod noto‘g‘ri"); }
      await clearFail(store, email);
      u.lastLogin = new Date().toISOString(); users[email] = u; await store.setJSON("users", users);
      return json(200, { token: sign({ e: email, r: "user", v: u.v || 0, x: Math.floor(Date.now() / 1000) + USER_TTL }, secret), email, role: "user" });
    }
    if (path === "/me" && m === "GET") { const who = await auth(req, store, env); return who ? json(200, who) : err(401, "unauthorized", "Qayta kiring"); }
    if (path === "/videos" && m === "GET") { const who = await auth(req, store, env); if (!who) return err(401, "unauthorized", "Qayta kiring"); return json(200, await readJSON(store, "videos", {})); }

    /* ---- admin ---- */
    if (path === "/admin/login" && m === "POST") {
      const b = await body(req), email = normEmail(b.email);
      if (await locked(store, "admin")) return err(429, "locked", "Juda ko‘p urinish");
      const a = await readJSON(store, "admin", ADMIN_DEFAULT);
      if (email !== adminEmail || !check(b.password, a)) { await failed(store, "admin"); return err(401, "bad_login", "Email yoki parol noto‘g‘ri"); }
      await clearFail(store, "admin");
      return json(200, { token: sign({ e: email, r: "admin", v: a.v || 0, x: Math.floor(Date.now() / 1000) + ADMIN_TTL }, await getSecret(store, env)), email, defaultPassword: !a.changed });
    }
    if (path.startsWith("/admin/")) {
      const who = await auth(req, store, env, "admin");
      if (!who) return err(401, "unauthorized", "Qayta kiring");
      if (path === "/admin/me" && m === "GET") { const a = await readJSON(store, "admin", ADMIN_DEFAULT); return json(200, { email: who.email, defaultPassword: !a.changed }); }
      if (path === "/admin/users" && m === "GET") {
        const users = await readJSON(store, "users", {});
        const list = Object.keys(users).map((e) => ({ email: e, note: users[e].note || "", addedAt: users[e].addedAt || "", lastLogin: users[e].lastLogin || "" }));
        list.sort((x, y) => (y.addedAt || "").localeCompare(x.addedAt || ""));
        return json(200, list);
      }
      if (path === "/admin/users" && m === "POST") {
        const b = await body(req), email = normEmail(b.email), note = String(b.note || "").slice(0, 120);
        if (!okEmail(email)) return err(400, "bad_email", "Email noto‘g‘ri");
        if (email === adminEmail) return err(400, "is_admin", "Bu administrator emaili");
        const users = await readJSON(store, "users", {});
        if (users[email]) return err(409, "exists", "Bu email ro‘yxatda bor");
        const code = genCode(), sec = newSecret(normCode(code));
        users[email] = { note, salt: sec.salt, hash: sec.hash, v: 0, addedAt: new Date().toISOString() };
        await store.setJSON("users", users);
        return json(201, { email, note, code, addedAt: users[email].addedAt });
      }
      if (path === "/admin/users/reset" && m === "POST") {
        const b = await body(req), email = normEmail(b.email), users = await readJSON(store, "users", {});
        if (!users[email]) return err(404, "not_found", "Topilmadi");
        const code = genCode(), sec = newSecret(normCode(code));
        users[email] = Object.assign(users[email], { salt: sec.salt, hash: sec.hash, v: (users[email].v || 0) + 1 });
        await store.setJSON("users", users); await clearFail(store, email);
        return json(200, { email, code });
      }
      if (path === "/admin/users" && m === "DELETE") {
        const email = normEmail(url.searchParams.get("email")), users = await readJSON(store, "users", {});
        if (!users[email]) return err(404, "not_found", "Topilmadi");
        delete users[email]; await store.setJSON("users", users);
        return json(200, { ok: true });
      }
      if (path === "/admin/videos" && m === "GET") return json(200, await readJSON(store, "videos", {}));
      if (path === "/admin/videos" && m === "PUT") {
        const b = await body(req), key = String(b.key || ""), u = String(b.url || "").trim();
        if (!VIDEO_KEY.test(key)) return err(400, "bad_key", "Mavzu noto‘g‘ri");
        if (u && !/^https:\/\/youtu\.be\/[\w-]{11}$/.test(u)) return err(400, "bad_url", "YouTube havolasi noto‘g‘ri");
        const v = await readJSON(store, "videos", {}); if (u) v[key] = u; else delete v[key];
        await store.setJSON("videos", v); return json(200, v);
      }
      if (path === "/admin/password" && m === "POST") {
        const b = await body(req), a = await readJSON(store, "admin", ADMIN_DEFAULT);
        if (!check(b.old, a)) return err(401, "bad_password", "Joriy parol noto‘g‘ri");
        if (String(b.new || "").length < 8) return err(400, "weak", "Yangi parol kamida 8 belgi bo‘lsin");
        const sec = newSecret(b.new), v = (a.v || 0) + 1;
        await store.setJSON("admin", { salt: sec.salt, hash: sec.hash, v, changed: true });
        return json(200, { token: sign({ e: who.email, r: "admin", v, x: Math.floor(Date.now() / 1000) + ADMIN_TTL }, await getSecret(store, env)) });
      }
    }
    return err(404, "not_found", "Topilmadi");
  } catch (e) {
    console.error(e);
    return err(500, "server", "Server xatosi");
  }
}
