/* =========================================================
   Admin panel — darslik saytidan alohida, mustaqil sayt.
   Server: /api/admin/* (Netlify Functions + Netlify Blobs).
   Kirish: admin email + parol (serverda tekshiriladi).
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
 "Server topilmadi":"Сервер не найден","Admin panel Netlify’da ishga tushirilganda ishlaydi (README.md).":"Админ-панель работает после запуска на Netlify (README.md).",
 "Tadbirkorlik asoslari":"Основы предпринимательства","Admin panel":"Админ-панель","Chiqish":"Выйти",
 "DEMO rejim: server ulanmagan, o‘zgarishlar faqat shu brauzerda saqlanadi.":"ДЕМО-режим: сервер не подключён, изменения сохраняются только в этом браузере.",
 "Siz boshlang‘ich paroldan foydalanyapsiz. Xavfsizlik uchun uni pastdagi «Xavfsizlik» bo‘limida almashtiring.":"Вы используете начальный пароль. Для безопасности смените его в разделе «Безопасность» ниже.",
 "Ruxsat berilganlar":"Разрешено","Video biriktirilgan mavzular":"Темы с видео","Oxirgi qo‘shilgan":"Последний добавленный",
 "Ruxsat berilgan emaillar":"Разрешённые адреса",
 "Email qo‘shganingizda unga shaxsiy kirish kodi yaratiladi. Kodni o‘qituvchiga bering: u saytga email va shu kod bilan kiradi. Ro‘yxatda yo‘q emaillarga «Siz kira olmaysiz» sahifasi chiqadi.":"При добавлении email для него создаётся личный код доступа. Передайте код учителю: он входит на сайт по email и этому коду. Адреса не из списка видят страницу «Вход запрещён».",
 "Qo‘shish":"Добавить","Mavzular videolari":"Видео к темам","Har mavzuga YouTube havolasini qo‘ying. U saytdagi «Video dars» bo‘limida chiqadi.":"Вставьте ссылку YouTube к каждой теме. Видео появится в разделе «Видеоурок» на сайте.",
 "Izoh (masalan: 11-A sinf o‘qituvchisi)":"Примечание (например: учитель 11-А)","Ro‘yxatdan qidirish…":"Поиск по списку…","Administrator":"Администратор","O‘chirish":"Удалить","Bekor":"Отмена","Yangi kod":"Новый код",
 "Hali hech kim qo‘shilmagan. Yuqoridagi formadan email qo‘shing.":"Пока никого нет. Добавьте email через форму выше.","qo‘shilgan":"добавлен","oxirgi kirish":"последний вход","hali kirmagan":"ещё не входил","o‘chirildi":"удалён",
 "Email noto‘g‘ri":"Неверный email","Bu email ro‘yxatda bor":"Этот email уже в списке","Xato: ":"Ошибка: ","Ro‘yxatni yuklab bo‘lmadi: ":"Не удалось загрузить список: ",
 "Saqlash":"Сохранить","Saqlandi":"Сохранено","YouTube havolasi tanilmadi":"Ссылка YouTube не распознана","https://youtu.be/… havolasi":"ссылка https://youtu.be/…",
 "Email yoki parol noto‘g‘ri":"Неверный email или пароль","Juda ko‘p urinish. 15 daqiqadan keyin qayta urining.":"Слишком много попыток. Повторите через 15 минут.",
 "Server bilan bog‘lanib bo‘lmadi.":"Не удалось связаться с сервером.","Sessiya tugadi. Qayta kiring.":"Сеанс истёк. Войдите снова.",
 "Parolni ko‘rsatish":"Показать пароль","Kirish kodi":"Код доступа","Nusxa olish":"Копировать","Nusxa olindi":"Скопировано","Tayyor":"Готово",
 "Bu kodni o‘qituvchiga bering. Kod faqat hozir ko‘rsatiladi — keyin uni qayta ko‘rib bo‘lmaydi, faqat yangisini yaratish mumkin.":"Передайте этот код учителю. Код показывается только сейчас — потом его нельзя посмотреть, можно только создать новый.",
 "Xavfsizlik: admin parolini almashtirish":"Безопасность: смена пароля администратора","Parolni almashtirish":"Сменить пароль","Joriy parol":"Текущий пароль","Yangi parol (kamida 8 belgi)":"Новый пароль (не меньше 8 символов)","Yangi parolni takrorlang":"Повторите новый пароль",
 "Yangi parollar mos emas":"Новые пароли не совпадают","Parol almashtirildi":"Пароль изменён","Eski kod bekor qilindi. Yangi kod:":"Старый код отменён. Новый код:",
 "Sayt manzili":"Адрес сайта","Demo rejimda parol tekshirilmaydi.":"В демо-режиме пароль не проверяется."};
function t(s){return lang==="ru"&&RU[s]!==undefined?RU[s]:s}
function applyLang(){document.documentElement.lang=lang;$$("[data-t]").forEach(function(e){e.textContent=t(e.dataset.t)});
 $("#addN").placeholder=t("Izoh (masalan: 11-A sinf o‘qituvchisi)");$("#eQ").placeholder=t("Ro‘yxatdan qidirish…");$("#admEye").setAttribute("aria-label",t("Parolni ko‘rsatish"));
 $("#pwOld").placeholder=t("Joriy parol");$("#pwNew").placeholder=t("Yangi parol (kamida 8 belgi)");$("#pwNew2").placeholder=t("Yangi parolni takrorlang");
 $("#aLang").textContent=lang==="ru"?"UZ":"RU";document.title=t("Admin panel")+" · "+t("Tadbirkorlik asoslari")}
document.addEventListener("click",function(e){var b=e.target.closest("[data-lang]");if(b){lang=b.dataset.lang;ls("tb-lang",lang);applyLang()}});
var th=ls("tb-theme");if(th)document.documentElement.setAttribute("data-theme",th);

var C=window.TB_CONFIG||{},API=(C.apiBase||"")+"/api",ADM=(C.admins||[]).map(function(e){return String(e).toLowerCase()});
var GATES=["aLoading","aLogin","aSetup"];
function gate(id,err){GATES.forEach(function(g){$("#"+g).hidden=g!==id});$("#aApp").hidden=!!id;if(id==="aLogin")$("#admErr").textContent=err||""}
var toastT;function toast(m,err){var x=$("#toast");if(!x){x=document.createElement("div");x.id="toast";document.body.appendChild(x)}x.className="toast"+(err?" err":"");x.textContent=m;x.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){x.hidden=true},2800)}
function fmtDate(iso){if(!iso)return "";try{var d=new Date(iso);return d.toLocaleDateString(lang==="ru"?"ru-RU":"uz-UZ")+" "+d.toLocaleTimeString(lang==="ru"?"ru-RU":"uz-UZ",{hour:"2-digit",minute:"2-digit"})}catch(e){return iso}}
function ytId(u){if(!u)return null;u=String(u);var m=/(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/.exec(u);if(m)return m[1];if(/^[\w-]{11}$/.test(u.trim()))return u.trim();return null}

/* ---------- server API ---------- */
function req(path,opt){opt=opt||{};var h={"content-type":"application/json"},tok=ss("tb-admin-token");if(tok)h.authorization="Bearer "+tok;
 return fetch(API+path,{method:opt.method||"GET",headers:h,body:opt.body?JSON.stringify(opt.body):undefined,cache:"no-store"}).then(function(r){
  return r.json().catch(function(){return {}}).then(function(d){if(!r.ok){var e=new Error(d.message||("HTTP "+r.status));e.status=r.status;e.code=d.error;if(r.status===401&&path!=="/admin/login"&&path!=="/admin/password"){ss("tb-admin-token",null);gate("aLogin",t("Sessiya tugadi. Qayta kiring."))}throw e}return d})})}
var serverApi={
 list:function(){return req("/admin/users")},
 add:function(email,note){return req("/admin/users",{method:"POST",body:{email:email,note:note}})},
 reset:function(email){return req("/admin/users/reset",{method:"POST",body:{email:email}})},
 remove:function(email){return req("/admin/users?email="+encodeURIComponent(email),{method:"DELETE"})},
 videos:function(){return req("/admin/videos")},
 setVideo:function(key,url){return req("/admin/videos",{method:"PUT",body:{key:key,url:url}})},
 password:function(o,n){return req("/admin/password",{method:"POST",body:{old:o,new:n}}).then(function(d){ss("tb-admin-token",d.token);return d})},
 signOut:function(){ss("tb-admin-token",null);location.reload()}
};
/* ---------- DEMO (server topilmaganda) ---------- */
var MEM={};function rd(k,d){try{var v=localStorage.getItem(k);return JSON.parse(v||MEM[k]||d)}catch(e){return JSON.parse(MEM[k]||d)}}
function wr(k,v){var s=JSON.stringify(v);MEM[k]=s;try{localStorage.setItem(k,s)}catch(e){}}
function demoCode(){var A="ABCDEFGHJKMNPQRSTUVWXYZ23456789",s="";for(var i=0;i<8;i++)s+=A[Math.floor(Math.random()*A.length)];return s.slice(0,4)+"-"+s.slice(4)}
var demoApi={
 list:function(){return Promise.resolve(rd("tb-demo-allowed","[]"))},
 add:function(email,note){var l=rd("tb-demo-allowed","[]"),rec={email:email,note:note,addedAt:new Date().toISOString(),code:demoCode()};l.unshift({email:email,note:note,addedAt:rec.addedAt});wr("tb-demo-allowed",l);return Promise.resolve(rec)},
 reset:function(email){return Promise.resolve({email:email,code:demoCode()})},
 remove:function(email){wr("tb-demo-allowed",rd("tb-demo-allowed","[]").filter(function(x){return x.email!==email}));return Promise.resolve({ok:true})},
 videos:function(){return Promise.resolve(rd("tb-demo-videos","{}"))},
 setVideo:function(key,url){var v=rd("tb-demo-videos","{}");if(url)v[key]=url;else delete v[key];wr("tb-demo-videos",v);return Promise.resolve(v)},
 password:function(){return Promise.resolve({})},
 signOut:function(){ss("tb-admin",null);location.reload()}
};

/* ---------- login ---------- */
function loginForm(onTry){
 var f=$("#admF"),e=$("#admE"),p=$("#admP"),go=$("#admGo"),eye=$("#admEye");
 gate("aLogin");setTimeout(function(){try{e.focus()}catch(x){}},50);
 eye.onclick=function(){var show=p.type==="password";p.type=show?"text":"password";eye.classList.toggle("on",show)};
 f.onsubmit=function(ev){ev.preventDefault();var em=e.value.trim().toLowerCase(),pw=p.value;if(!em||!pw)return;go.disabled=true;$("#admErr").textContent="";
  onTry(em,pw,function(err){go.disabled=false;if(err){$("#admErr").textContent=err;p.value="";p.focus();f.classList.remove("shake");void f.offsetWidth;f.classList.add("shake")}})}}

/* ---------- panel ---------- */
var A=null,S={list:null,videos:{},confirm:null};
function showCode(email,code,msg){$("#codeEmail").textContent=email;$("#codeVal").textContent=code;$("#codeMsg").textContent=msg||"";$("#codeM").hidden=false}
function start(api,email,opts){A=api;opts=opts||{};gate(null);$("#aWho").textContent=email;$("#aDemo").hidden=!opts.demo;$("#aDefPw").hidden=!opts.defaultPassword;applyLang();
 $("#aOut").onclick=function(){A.signOut()};
 $("#aLang").onclick=function(){lang=lang==="ru"?"uz":"ru";ls("tb-lang",lang);applyLang();if(S.list)draw();drawVideos()};
 $("#aTheme").onclick=function(){var cur=document.documentElement.getAttribute("data-theme");var dark=cur?cur==="dark":!matchMedia("(prefers-color-scheme: light)").matches;var nx=dark?"light":"dark";document.documentElement.setAttribute("data-theme",nx);ls("tb-theme",nx)};
 $("#eQ").oninput=draw;
 $("#codeX").onclick=$("#codeOk").onclick=function(){$("#codeM").hidden=true};
 $("#codeCopy").onclick=function(){var v=$("#codeEmail").textContent+" — "+$("#codeVal").textContent;var done=function(){toast(t("Nusxa olindi"))};
  try{navigator.clipboard.writeText(v).then(done,function(){selectCode()})}catch(e){selectCode()}};
 function selectCode(){var r=document.createRange();r.selectNodeContents($("#codeVal"));var sel=getSelection();sel.removeAllRanges();sel.addRange(r)}
 $("#addF").onsubmit=function(e){e.preventDefault();var em=$("#addE").value.trim().toLowerCase(),note=$("#addN").value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){toast(t("Email noto‘g‘ri"),1);return}
  if((S.list||[]).some(function(x){return x.email===em})){toast(t("Bu email ro‘yxatda bor"),1);return}
  var btn=$("#addF button");btn.disabled=true;
  A.add(em,note).then(function(rec){btn.disabled=false;S.list.unshift({email:rec.email,note:rec.note,addedAt:rec.addedAt});$("#addE").value="";$("#addN").value="";draw();showCode(rec.email,rec.code)}).catch(function(err){btn.disabled=false;toast(t("Xato: ")+(err&&err.message||err),1)})};
 $("#pwF").onsubmit=function(e){e.preventDefault();var o=$("#pwOld").value,n=$("#pwNew").value,n2=$("#pwNew2").value;if(n!==n2){toast(t("Yangi parollar mos emas"),1);return}
  A.password(o,n).then(function(){$("#pwF").reset();$("#aDefPw").hidden=true;toast(t("Parol almashtirildi"))}).catch(function(err){toast(t("Xato: ")+(err&&err.message||err),1)})};
 A.list().then(function(l){S.list=l;draw()}).catch(function(e){$("#eList").innerHTML='<p class="note" style="color:var(--down)">'+esc(t("Ro‘yxatni yuklab bo‘lmadi: ")+(e&&e.message||e))+'</p>'});
 A.videos().then(function(v){S.videos=v||{};drawVideos()}).catch(function(){drawVideos()})}
function draw(){var q=($("#eQ").value||"").toLowerCase(),all=S.list||[];
 var rows=ADM.map(function(a){return {email:a,note:t("Administrator"),admin:true}}).concat(all.filter(function(x){return ADM.indexOf(x.email)<0}));
 rows=rows.filter(function(x){return !q||x.email.indexOf(q)>=0||(x.note||"").toLowerCase().indexOf(q)>=0});
 $("#sUsers").textContent=all.length;$("#sLast").textContent=all[0]?all[0].email:"—";
 var cols=["#3b82f6","#10b981","#f59e0b","#a855f7","#ef4444","#14b8a6"];
 $("#eList").innerHTML=rows.length?rows.map(function(x){var c=cols[x.email.charCodeAt(0)%cols.length];var meta=[x.note||""];if(!x.admin){if(x.addedAt)meta.push(t("qo‘shilgan")+": "+fmtDate(x.addedAt));meta.push(x.lastLogin?t("oxirgi kirish")+": "+fmtDate(x.lastLogin):t("hali kirmagan"))}
  return '<div class="erow'+(x.admin?" admin-row":"")+'"><span class="av" style="background:'+c+'">'+esc(x.email.charAt(0).toUpperCase())+'</span><div><div class="em">'+esc(x.email)+'</div><small>'+esc(meta.filter(Boolean).join(" · "))+'</small></div><div class="del">'+(x.admin?'<span class="chip">Admin</span>':(S.confirm===x.email?'<button class="yes" data-del="'+esc(x.email)+'">'+t("O‘chirish")+'</button><button data-cancel="1">'+t("Bekor")+'</button>':'<button data-reset="'+esc(x.email)+'">'+t("Yangi kod")+'</button><button data-ask="'+esc(x.email)+'">'+t("O‘chirish")+'</button>'))+'</div></div>'}).join(""):'<p class="note">'+t("Hali hech kim qo‘shilmagan. Yuqoridagi formadan email qo‘shing.")+'</p>';
 $$("[data-ask]").forEach(function(b){b.onclick=function(){S.confirm=b.dataset.ask;draw()}});
 $$("[data-cancel]").forEach(function(b){b.onclick=function(){S.confirm=null;draw()}});
 $$("[data-reset]").forEach(function(b){b.onclick=function(){b.disabled=true;A.reset(b.dataset.reset).then(function(r){b.disabled=false;showCode(r.email,r.code,t("Eski kod bekor qilindi. Yangi kod:"))}).catch(function(e){b.disabled=false;toast(t("Xato: ")+(e&&e.message||e),1)})}});
 $$("[data-del]").forEach(function(b){b.onclick=function(){var em=b.dataset.del;b.disabled=true;A.remove(em).then(function(){S.list=S.list.filter(function(x){return x.email!==em});S.confirm=null;draw();toast(em+" "+t("o‘chirildi"))}).catch(function(e){toast(t("Xato: ")+(e&&e.message||e),1);b.disabled=false})}})}
function drawVideos(){var T=(window.ADM_TITLES||{})[lang]||(window.ADM_TITLES||{}).uz||[],n=0;
 $("#vList").innerHTML=T.map(function(title,i){var key="t"+pad(i+1),v=S.videos[key]||"";if(v)n++;return '<div class="vrow"><span class="vn'+(v?" has":"")+'">'+(i+1)+'</span><div><label for="vi-'+key+'">'+esc(title)+'</label><div class="vin"><input id="vi-'+key+'" data-vk="'+key+'" value="'+esc(v)+'" placeholder="'+esc(t("https://youtu.be/… havolasi"))+'"><button data-vs="'+key+'">'+t("Saqlash")+'</button></div></div></div>'}).join("");
 $("#sVids").textContent=n+" / "+T.length;
 $$("[data-vs]").forEach(function(b){b.onclick=function(){var key=b.dataset.vs,inp=$('[data-vk="'+key+'"]'),val=inp.value.trim(),id=ytId(val);if(val&&!id){toast(t("YouTube havolasi tanilmadi"),1);return}var url=id?"https://youtu.be/"+id:"";b.disabled=true;
  A.setVideo(key,url).then(function(){if(url)S.videos[key]=url;else delete S.videos[key];inp.value=url;b.classList.add("ok");b.textContent=t("Saqlandi");var cnt=0;for(var k in S.videos)if(S.videos[k])cnt++;$("#sVids").textContent=cnt+" / "+T.length;$('.vn',b.closest(".vrow")).classList.toggle("has",!!url);setTimeout(function(){b.classList.remove("ok");b.textContent=t("Saqlash");b.disabled=false},1600)}).catch(function(e){toast(t("Xato: ")+(e&&e.message||e),1);b.disabled=false})}})}

applyLang();

/* ---------- ishga tushirish: server bormi? ---------- */
function startDemo(){
 if(ss("tb-admin")==="1"){start(demoApi,ADM[0]||"admin",{demo:true});return}
 loginForm(function(em,pw,done){if(ADM.indexOf(em)<0){done(t("Email yoki parol noto‘g‘ri"));return}ss("tb-admin","1");done();start(demoApi,em,{demo:true});toast(t("Demo rejimda parol tekshirilmaydi."))})}
function startServer(){
 loginForm(function(em,pw,done){
  req("/admin/login",{method:"POST",body:{email:em,password:pw}}).then(function(d){ss("tb-admin-token",d.token);done();start(serverApi,d.email,{defaultPassword:d.defaultPassword})}).catch(function(e){
   done(e.status===401?t("Email yoki parol noto‘g‘ri"):e.status===429?t("Juda ko‘p urinish. 15 daqiqadan keyin qayta urining."):t("Server bilan bog‘lanib bo‘lmadi."))})});
 if(ss("tb-admin-token"))req("/admin/me").then(function(d){start(serverApi,d.email,{defaultPassword:d.defaultPassword})}).catch(function(){});
}
if(location.protocol==="file:"){startDemo();}
else fetch(API+"/health",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(startServer).catch(startDemo);
})();
