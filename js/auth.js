/* =========================================================
   Kirish: email + shaxsiy kirish kodi (kodni admin beradi).
   Server: Netlify Functions (/api/*), ma’lumotlar: Netlify Blobs.
   Kompyuterda (file://) yoki server topilmasa — DEMO rejim.
   ========================================================= */
(function(){
"use strict";
var C=window.TB_CONFIG||{},API=(C.apiBase||"")+"/api";
var T=function(s){return TB.tr(s)};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}
function $(id){return document.getElementById(id)}

/* ----- DEMO (Netlify’siz sinash uchun) ----- */
var KV="tb-demo-videos";
function startDemo(){
 window.TBAuth={
  getVideos:function(){try{return Promise.resolve(JSON.parse(localStorage.getItem(KV)||"{}"))}catch(e){return Promise.resolve({})}},
  signOut:function(){TB.toast(T("Demo rejimda chiqish yo‘q"))}
 };
 TB.start({email:"demo@local",name:"Demo",isAdmin:false,demo:true});
}
function setupGate(){TB.gate("gSetup");var bd=$("btnDemo");if(bd)bd.onclick=function(){ss("tb-demo","1");startDemo()}}
if(location.protocol==="file:"||ss("tb-demo")==="1"){startDemo();return}

/* ----- server ----- */
function api(path,opt){opt=opt||{};var h={"content-type":"application/json"},tok=ls("tb-token");if(tok)h.authorization="Bearer "+tok;
 return fetch(API+path,{method:opt.method||"GET",headers:h,body:opt.body?JSON.stringify(opt.body):undefined,cache:"no-store"}).then(function(r){
  return r.json().catch(function(){return {}}).then(function(d){if(!r.ok){var e=new Error(d.message||("HTTP "+r.status));e.status=r.status;e.code=d.error;throw e}return d})})}
window.TBAuth={
 getVideos:function(){return api("/videos")},
 signOut:function(){ls("tb-token",null);location.reload()}
};
function enter(me){TB.gate("gLoading");TB.start({email:me.email,name:"",isAdmin:me.role==="admin"})}
function showLogin(err){TB.gate("gLogin",err||"");setTimeout(function(){var e=$("lgE");if(e&&!e.value)try{e.focus()}catch(x){}},50)}

var form=$("lgF");
if(form)form.onsubmit=function(ev){ev.preventDefault();var email=$("lgE").value.trim().toLowerCase(),code=$("lgC").value.trim(),go=$("lgGo");
 if(!email||!code)return;go.disabled=true;$("loginErr").textContent="";
 api("/login",{method:"POST",body:{email:email,code:code}}).then(function(d){ls("tb-token",d.token);ls("tb-email",d.email);enter(d)}).catch(function(e){go.disabled=false;
  if(e.status===403){TB.gate("gDenied",email);return}
  var msg=e.status===401?T("Kirish kodi noto‘g‘ri"):e.status===429?T("Juda ko‘p urinish. 15 daqiqadan keyin qayta urining."):e.status===400?T("Email va kirish kodini kiriting"):T("Server bilan bog‘lanib bo‘lmadi. Internetni tekshiring.");
  $("loginErr").textContent=msg;$("lgC").value="";$("lgC").focus();form.classList.remove("shake");void form.offsetWidth;form.classList.add("shake")})};
var sw=$("btnSwitch");if(sw)sw.onclick=function(){ls("tb-token",null);showLogin()};
var eye=$("lgEye");if(eye)eye.onclick=function(){var c=$("lgC"),show=c.type==="password";c.type=show?"text":"password";eye.classList.toggle("on",show)};
var savedEmail=ls("tb-email");if(savedEmail&&$("lgE"))$("lgE").value=savedEmail;

/* server bormi? (masalan, oddiy hostingda yoki oldindan ko‘rishda — demo) */
fetch(API+"/health",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(){
 if(!ls("tb-token")){showLogin();return}
 api("/me").then(enter).catch(function(e){if(e.status===401){ls("tb-token",null);showLogin(T("Sessiya tugadi. Qayta kiring."))}else showLogin(T("Server bilan bog‘lanib bo‘lmadi. Internetni tekshiring."))});
}).catch(setupGate);
})();
