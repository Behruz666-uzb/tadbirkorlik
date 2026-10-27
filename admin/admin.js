/* =========================================================
   Admin panel — darslik saytidan alohida, mustaqil sahifa.
   Kirish: email + parol (Firebase Email/Password).
   Firestore:  allowed/{email}  — ruxsat ro‘yxati
               settings/videos  — { t01: "https://youtu.be/..." }
   ========================================================= */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function pad(n){return String(n).padStart(2,"0")}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}

/* ---------- til ---------- */
var lang=ls("tb-lang")==="ru"?"ru":"uz";
var RU={"Boshqaruv":"Управление","Admin panelga kirish":"Вход в админ-панель","Administrator email va parolini kiriting.":"Введите email и пароль администратора.","Parol":"Пароль","Kirish":"Войти",
 "Firebase sozlanmagan":"Firebase не настроен","js/config.js fayliga Firebase ma’lumotlarini kiriting (README.md).":"Укажите данные Firebase в файле js/config.js (README.md).",
 "Tadbirkorlik asoslari":"Основы предпринимательства","Admin panel":"Админ-панель","Chiqish":"Выйти",
 "DEMO rejim: Firebase ulanmagan, o‘zgarishlar faqat shu brauzerda saqlanadi.":"ДЕМО-режим: Firebase не подключён, изменения сохраняются только в этом браузере.",
 "Ruxsat berilganlar":"Разрешено","Video biriktirilgan mavzular":"Темы с видео","Oxirgi qo‘shilgan":"Последний добавленный",
 "Ruxsat berilgan emaillar":"Разрешённые адреса","Ro‘yxatdagi emaillar Google akkaunti bilan saytga kira oladi, qolganlarga «Siz kira olmaysiz» sahifasi chiqadi.":"Адреса из списка входят на сайт через Google, остальные видят страницу «Вход запрещён».",
 "Qo‘shish":"Добавить","Mavzular videolari":"Видео к темам","Har mavzuga YouTube havolasini qo‘ying. U saytdagi «Video dars» bo‘limida chiqadi.":"Вставьте ссылку YouTube к каждой теме. Видео появится в разделе «Видеоурок» на сайте.",
 "Izoh (masalan: 11-A sinf o‘qituvchisi)":"Примечание (например: учитель 11-А)","Ro‘yxatdan qidirish…":"Поиск по списку…","Administrator":"Администратор","O‘chirish":"Удалить","Bekor":"Отмена",
 "Hali hech kim qo‘shilmagan. Yuqoridagi formadan email qo‘shing.":"Пока никого нет. Добавьте email через форму выше.","qo‘shilgan":"добавлен","o‘chirildi":"удалён","qo‘shildi":"добавлен",
 "Email noto‘g‘ri":"Неверный email","Bu email ro‘yxatda bor":"Этот email уже в списке","Xato: ":"Ошибка: ","Ro‘yxatni yuklab bo‘lmadi: ":"Не удалось загрузить список: ",
 "Saqlash":"Сохранить","Saqlandi":"Сохранено","YouTube havolasi tanilmadi":"Ссылка YouTube не распознана","https://youtu.be/… havolasi":"ссылка https://youtu.be/…",
 "Email yoki parol noto‘g‘ri":"Неверный email или пароль","Juda ko‘p urinish. Birozdan keyin qayta urining.":"Слишком много попыток. Повторите позже.",
 "Firebase’da Email/Password kirish usuli yoqilmagan.":"В Firebase не включён вход по Email/Password.","Bu akkaunt administrator emas":"Этот аккаунт не является администратором",
 "Internetga ulanib bo‘lmadi. Sahifani yangilang.":"Нет подключения к интернету. Обновите страницу.","Kirishda xato: ":"Ошибка входа: ","Brauzer parolni tekshira olmadi":"Браузер не смог проверить пароль",
 "Parolni ko‘rsatish":"Показать пароль","ta":"шт.","Saytni ochish":"Открыть сайт"};
function t(s){return lang==="ru"&&RU[s]!==undefined?RU[s]:s}
function applyLang(){document.documentElement.lang=lang;$$("[data-t]").forEach(function(e){e.textContent=t(e.dataset.t)});
 $("#addN").placeholder=t("Izoh (masalan: 11-A sinf o‘qituvchisi)");$("#eQ").placeholder=t("Ro‘yxatdan qidirish…");$("#admEye").setAttribute("aria-label",t("Parolni ko‘rsatish"));
 $("#aLang").textContent=lang==="ru"?"UZ":"RU";document.title=t("Admin panel")+" · "+t("Tadbirkorlik asoslari")}
document.addEventListener("click",function(e){var b=e.target.closest("[data-lang]");if(b){lang=b.dataset.lang;ls("tb-lang",lang);applyLang();if(S.list)draw()}});
var th=ls("tb-theme");if(th)document.documentElement.setAttribute("data-theme",th);

/* ---------- umumiy ---------- */
var C=window.TB_CONFIG||{},FB=C.firebase||{},ADM=(C.admins||[]).map(function(e){return String(e).toLowerCase()});
var configured=FB.apiKey&&FB.apiKey.indexOf("YOUR_")!==0&&FB.projectId&&FB.projectId.indexOf("YOUR_")!==0;
var GATES=["aLoading","aLogin","aSetup"];
function gate(id,err){GATES.forEach(function(g){$("#"+g).hidden=g!==id});$("#aApp").hidden=!!id;if(id==="aLogin")$("#admErr").textContent=err||""}
var toastT;function toast(m,err){var x=$("#toast");if(!x){x=document.createElement("div");x.id="toast";document.body.appendChild(x)}x.className="toast"+(err?" err":"");x.textContent=m;x.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){x.hidden=true},2800)}
function today(){var d=new Date();return d.toLocaleDateString("uz-UZ")+" "+d.toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"})}
function ytId(u){if(!u)return null;u=String(u);var m=/(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/.exec(u);if(m)return m[1];if(/^[\w-]{11}$/.test(u.trim()))return u.trim();return null}
function sha256(str){if(!(window.crypto&&crypto.subtle&&window.TextEncoder))return Promise.reject(new Error("crypto"));return crypto.subtle.digest("SHA-256",new TextEncoder().encode(str)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ("0"+x.toString(16)).slice(-2)}).join("")})}

/* ---------- login formasi ---------- */
function loginForm(onTry){
 var f=$("#admF"),e=$("#admE"),p=$("#admP"),go=$("#admGo"),eye=$("#admEye");
 gate("aLogin");setTimeout(function(){try{e.focus()}catch(x){}},50);
 eye.onclick=function(){var show=p.type==="password";p.type=show?"text":"password";eye.classList.toggle("on",show)};
 f.onsubmit=function(ev){ev.preventDefault();var em=e.value.trim().toLowerCase(),pw=p.value;if(!em||!pw)return;go.disabled=true;$("#admErr").textContent="";
  onTry(em,pw,function(err){go.disabled=false;if(err){$("#admErr").textContent=err;p.value="";p.focus();f.classList.remove("shake");void f.offsetWidth;f.classList.add("shake")}})}}

/* ---------- panel ---------- */
var API=null,S={list:null,videos:{},confirm:null,user:""};
function start(api,email,demo){API=api;S.user=email;gate(null);$("#aWho").textContent=email;$("#aDemo").hidden=!demo;applyLang();
 $("#aOut").onclick=function(){API.signOut()};
 $("#aLang").onclick=function(){lang=lang==="ru"?"uz":"ru";ls("tb-lang",lang);applyLang();if(S.list)draw();drawVideos()};
 $("#aTheme").onclick=function(){var cur=document.documentElement.getAttribute("data-theme");var dark=cur?cur==="dark":!matchMedia("(prefers-color-scheme: light)").matches;var nx=dark?"light":"dark";document.documentElement.setAttribute("data-theme",nx);ls("tb-theme",nx)};
 $("#eQ").oninput=draw;
 $("#addF").onsubmit=function(e){e.preventDefault();var em=$("#addE").value.trim().toLowerCase(),note=$("#addN").value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){toast(t("Email noto‘g‘ri"),1);return}
  if((S.list||[]).some(function(x){return x.email===em})){toast(t("Bu email ro‘yxatda bor"),1);return}
  API.addAllowed(em,note).then(function(rec){S.list.unshift(rec);$("#addE").value="";$("#addN").value="";draw();toast(em+" "+t("qo‘shildi"))}).catch(function(err){toast(t("Xato: ")+(err&&err.message||err),1)})};
 API.listAllowed().then(function(l){S.list=l;draw()}).catch(function(e){$("#eList").innerHTML='<p class="note" style="color:var(--down)">'+esc(t("Ro‘yxatni yuklab bo‘lmadi: ")+(e&&e.message||e))+'</p>'});
 API.getVideos().then(function(v){S.videos=v||{};drawVideos()}).catch(function(){drawVideos()})}
function draw(){var q=($("#eQ").value||"").toLowerCase(),all=S.list||[];
 var rows=ADM.map(function(a){return {email:a,note:t("Administrator"),admin:true}}).concat(all.filter(function(x){return ADM.indexOf(x.email)<0}));
 rows=rows.filter(function(x){return !q||x.email.indexOf(q)>=0||(x.note||"").toLowerCase().indexOf(q)>=0});
 $("#sUsers").textContent=all.length;$("#sLast").textContent=all[0]?all[0].email:"—";
 var cols=["#3b82f6","#10b981","#f59e0b","#a855f7","#ef4444","#14b8a6"];
 $("#eList").innerHTML=rows.length?rows.map(function(x){var c=cols[x.email.charCodeAt(0)%cols.length];return '<div class="erow'+(x.admin?" admin-row":"")+'"><span class="av" style="background:'+c+'">'+esc(x.email.charAt(0).toUpperCase())+'</span><div><div class="em">'+esc(x.email)+'</div><small>'+esc(x.note||"")+(x.addedAt?' · '+t("qo‘shilgan")+': '+esc(x.addedAt):'')+'</small></div><div class="del">'+(x.admin?'<span class="chip">Admin</span>':(S.confirm===x.email?'<button class="yes" data-del="'+esc(x.email)+'">'+t("O‘chirish")+'</button><button data-cancel="1">'+t("Bekor")+'</button>':'<button data-ask="'+esc(x.email)+'">'+t("O‘chirish")+'</button>'))+'</div></div>'}).join(""):'<p class="note">'+t("Hali hech kim qo‘shilmagan. Yuqoridagi formadan email qo‘shing.")+'</p>';
 $$("[data-ask]").forEach(function(b){b.onclick=function(){S.confirm=b.dataset.ask;draw()}});
 $$("[data-cancel]").forEach(function(b){b.onclick=function(){S.confirm=null;draw()}});
 $$("[data-del]").forEach(function(b){b.onclick=function(){var em=b.dataset.del;b.disabled=true;API.removeAllowed(em).then(function(){S.list=S.list.filter(function(x){return x.email!==em});S.confirm=null;draw();toast(em+" "+t("o‘chirildi"))}).catch(function(e){toast(t("Xato: ")+(e&&e.message||e),1);b.disabled=false})}})}
function drawVideos(){var T=(window.ADM_TITLES||{})[lang]||(window.ADM_TITLES||{}).uz||[],n=0;
 $("#vList").innerHTML=T.map(function(title,i){var key="t"+pad(i+1),v=S.videos[key]||"";if(v)n++;return '<div class="vrow"><span class="vn'+(v?" has":"")+'">'+(i+1)+'</span><div><label for="vi-'+key+'">'+esc(title)+'</label><div class="vin"><input id="vi-'+key+'" data-vk="'+key+'" value="'+esc(v)+'" placeholder="'+esc(t("https://youtu.be/… havolasi"))+'"><button data-vs="'+key+'">'+t("Saqlash")+'</button></div></div></div>'}).join("");
 $("#sVids").textContent=n+" / "+T.length;
 $$("[data-vs]").forEach(function(b){b.onclick=function(){var key=b.dataset.vs,inp=$('[data-vk="'+key+'"]'),val=inp.value.trim(),id=ytId(val);if(val&&!id){toast(t("YouTube havolasi tanilmadi"),1);return}var url=id?"https://youtu.be/"+id:"";b.disabled=true;
  API.setVideo(key,url).then(function(){S.videos[key]=url;inp.value=url;b.classList.add("ok");b.textContent=t("Saqlandi");var cnt=0;for(var k in S.videos)if(S.videos[k])cnt++;$("#sVids").textContent=cnt+" / "+T.length;$('.vn',b.closest(".vrow")).classList.toggle("has",!!url);setTimeout(function(){b.classList.remove("ok");b.textContent=t("Saqlash");b.disabled=false},1600)}).catch(function(e){toast(t("Xato: ")+(e&&e.message||e),1);b.disabled=false})}})}

applyLang();

/* ---------- DEMO (Firebase sozlanmaguncha) ---------- */
if(!configured){
 var K="tb-demo-allowed",KV="tb-demo-videos",MEM={};
 var rd=function(k,d){try{var v=localStorage.getItem(k);return JSON.parse(v||MEM[k]||d)}catch(e){return JSON.parse(MEM[k]||d)}};
 var wr=function(k,v){var s=JSON.stringify(v);MEM[k]=s;try{localStorage.setItem(k,s)}catch(e){}};
 var demoApi={
  listAllowed:function(){return Promise.resolve(rd(K,"[]"))},
  addAllowed:function(email,note){var l=rd(K,"[]"),rec={email:email,note:note,addedAt:today()};l.unshift(rec);wr(K,l);return Promise.resolve(rec)},
  removeAllowed:function(email){wr(K,rd(K,"[]").filter(function(x){return x.email!==email}));return Promise.resolve()},
  getVideos:function(){return Promise.resolve(rd(KV,"{}"))},
  setVideo:function(key,url){var v=rd(KV,"{}");v[key]=url;wr(KV,v);return Promise.resolve()},
  signOut:function(){ss("tb-admin",null);location.reload()}
 };
 if(!C.demoAdminPassHash){gate("aSetup");return}
 if(ss("tb-admin")==="1"){start(demoApi,ADM[0]||"admin",true);return}
 loginForm(function(em,pw,done){
  if(ADM.indexOf(em)<0){done(t("Email yoki parol noto‘g‘ri"));return}
  sha256(pw).then(function(h){if(h===C.demoAdminPassHash){ss("tb-admin","1");done();start(demoApi,em,true)}else done(t("Email yoki parol noto‘g‘ri"))}).catch(function(){done(t("Brauzer parolni tekshira olmadi"))})});
 return;
}

/* ---------- Firebase ---------- */
var VER="10.12.2",base="https://www.gstatic.com/firebasejs/"+VER+"/";
function load(src){return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;s.onload=res;s.onerror=function(){rej(new Error(src))};document.head.appendChild(s)})}
load(base+"firebase-app-compat.js").then(function(){return Promise.all([load(base+"firebase-auth-compat.js"),load(base+"firebase-firestore-compat.js")])}).then(init).catch(function(){gate("aLogin",t("Internetga ulanib bo‘lmadi. Sahifani yangilang."))});
function init(){
 var app;try{app=firebase.app("admin")}catch(e){app=firebase.initializeApp(FB,"admin")}
 var auth=app.auth(),db=app.firestore();try{auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)}catch(e){}
 function fmtTs(ts){try{var d=ts&&ts.toDate?ts.toDate():null;return d?d.toLocaleDateString("uz-UZ"):""}catch(e){return ""}}
 var api={
  listAllowed:function(){return db.collection("allowed").get().then(function(q){var l=[];q.forEach(function(d){var x=d.data();l.push({email:d.id,note:x.note||"",addedAt:fmtTs(x.addedAt),_t:x.addedAt&&x.addedAt.toMillis?x.addedAt.toMillis():0})});l.sort(function(a,b){return b._t-a._t});return l})},
  addAllowed:function(email,note){return db.collection("allowed").doc(email).set({email:email,note:note||"",addedAt:firebase.firestore.FieldValue.serverTimestamp(),addedBy:auth.currentUser.email}).then(function(){return {email:email,note:note,addedAt:today()}})},
  removeAllowed:function(email){return db.collection("allowed").doc(email).delete()},
  getVideos:function(){return db.collection("settings").doc("videos").get().then(function(d){return d.exists?d.data():{}})},
  setVideo:function(key,url){var o={};o[key]=url;return db.collection("settings").doc("videos").set(o,{merge:true})},
  signOut:function(){auth.signOut().then(function(){location.reload()})}
 };
 var pending=null,started=false;
 loginForm(function(em,pw,done){pending=done;
  auth.signInWithEmailAndPassword(em,pw).catch(function(e){var c=e&&e.code||"";pending=null;
   if(/invalid-credential|wrong-password|user-not-found|invalid-email|invalid-login/.test(c))done(t("Email yoki parol noto‘g‘ri"));
   else if(/too-many-requests/.test(c))done(t("Juda ko‘p urinish. Birozdan keyin qayta urining."));
   else if(/operation-not-allowed/.test(c))done(t("Firebase’da Email/Password kirish usuli yoqilmagan."));
   else if(/network/.test(c))done(t("Internetga ulanib bo‘lmadi. Sahifani yangilang."));
   else done(t("Kirishda xato: ")+(e&&e.message||e))})});
 auth.onAuthStateChanged(function(u){
  if(!u){gate("aLogin");return}
  var email=(u.email||"").toLowerCase(),provider=(u.providerData&&u.providerData[0]&&u.providerData[0].providerId)||"";
  if(ADM.indexOf(email)<0||provider!=="password"){auth.signOut();var d=pending;pending=null;gate("aLogin",t("Bu akkaunt administrator emas"));if(d)d(t("Bu akkaunt administrator emas"));return}
  if(pending){pending();pending=null}
  if(!started){started=true;start(api,email,false)}
 });
}
})();
