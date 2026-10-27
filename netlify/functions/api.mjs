import { getStore } from "@netlify/blobs";
import { handle } from "../core.mjs";

/* Admin sayti (nomi "-admin" bilan tugaydi) o‘z ma’lumotini saqlamaydi:
   so‘rovlarni darslik saytining serveriga uzatadi — ikkala sayt bitta bazadan foydalanadi. */
function upstream(context) {
  if (process.env.TB_API_URL) return process.env.TB_API_URL.replace(/\/+$/, "");
  const name = (context && context.site && context.site.name) || process.env.SITE_NAME || "";
  if (/-admin$/.test(name)) return "https://" + name.replace(/-admin$/, "") + ".netlify.app";
  return "";
}

export default async (req, context) => {
  const up = upstream(context);
  if (up) {
    const u = new URL(req.url);
    const headers = new Headers();
    for (const h of ["content-type", "authorization"]) { const v = req.headers.get(h); if (v) headers.set(h, v); }
    const r = await fetch(up + u.pathname + u.search, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text() });
    return new Response(await r.text(), { status: r.status, headers: { "content-type": r.headers.get("content-type") || "application/json", "cache-control": "no-store" } });
  }
  const store = getStore({ name: "tb", consistency: "strong" });
  return handle(req, store, { TB_SECRET: process.env.TB_SECRET, TB_ADMIN_EMAIL: process.env.TB_ADMIN_EMAIL });
};

export const config = { path: "/api/*" };
