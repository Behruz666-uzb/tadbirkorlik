/* =========================================================
   Kirish (Google) + ruxsat ro‘yxati (Firestore)
   Kolleksiyalar:  allowed/{email}  — ruxsat berilganlar
                   settings/videos  — mavzular videolari { t01: "https://youtu.be/..." }
   ========================================================= */
(function(){
"use strict";
var C=window.TB_CONFIG||{},FB=C.firebase||{},ADM=(C.admins||[]).map(function(e){return String(e).toLowerCase()});
var VER="10.12.2";
var configured=FB.apiKey&&FB.apiKey.indexOf("YOUR_")!==0&&FB.projectId&&FB.projectId.indexOf("YOUR_")!==0;
var local=location.protocol==="file:"||/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
function sessionStorageGet(){try{return sessionStorage.getItem("tb-demo")}catch(e){return null}}
function now(){var d=new Date();return d.toLocaleDateString("uz-UZ")+" "+d.toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"})}

var ADMIN_MODE=window.TB_MODE==="admin";
function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}
function sha256(str){if(!(window.crypto&&crypto.subtle&&window.TextEncoder))return Promise.reject(new Error("crypto"));return crypto.subtle.digest("SHA-256",new TextEncoder().encode(str)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ("0"+x.toString(16)).slice(-2)}).join("")})}
/* Admin login formasi (email + parol). onTry(email, pw, done(errText)) */
function adminForm(onTry){
 var f=document.getElementById("admF"),e=document.getElementById("admE"),p=document.getElementById("admP"),go=document.getElementById("admGo"),eye=document.getElementById("admEye");
 TB.gate("gAdmin");setTimeout(function(){try{e.focus()}catch(x){}},50);
 eye.onclick=function(){var show=p.type==="password";p.type=show?"text":"password";eye.classList.toggle("on",show)};
 f.onsubmit=function(ev){ev.preventDefault();var em=e.value.trim().toLowerCase(),pw=p.value;if(!em||!pw)return;
  go.disabled=true;document.getElementById("admErr").textContent="";
  onTry(em,pw,function(err){go.disabled=false;if(err){document.getElementById("admErr").textContent=err;p.value="";p.focus();f.classList.remove("shake");void f.offsetWidth;f.classList.add("shake")}})}}

/* ----- DEMO (faqat kompyuterda sinash uchun, Firebase sozlanmaguncha) ----- */
var K="tb-demo-allowed",KV="tb-demo-videos",MEM={};
function rd(k,d){try{var v=localStorage.getItem(k);return JSON.parse(v||MEM[k]||d)}catch(e){return JSON.parse(MEM[k]||d)}}
function wr(k,v){var s=JSON.stringify(v);MEM[k]=s;try{localStorage.setItem(k,s)}catch(e){}}
function startDemo(){
 window.TBAuth={
  listAllowed:function(){return Promise.resolve(rd(K,"[]"))},
  addAllowed:function(email,note){var l=rd(K,"[]"),rec={email:email,note:note,addedAt:now()};l.unshift(rec);wr(K,l);return Promise.resolve(rec)},
  removeAllowed:function(email){wr(K,rd(K,"[]").filter(function(x){return x.email!==email}));return Promise.resolve()},
  getVideos:function(){return Promise.resolve(rd(KV,"{}"))},
  setVideo:function(key,url){var v=rd(KV,"{}");v[key]=url;wr(KV,v);return Promise.resolve()},
  signOut:function(){if(ADMIN_MODE){ss("tb-admin",null);location.reload()}else TB.toast(TB.tr("Demo rejimda chiqish yo‘q"))}
 };
 TB.start({email:ADM[0]||"demo@local",name:"Demo",isAdmin:true,demo:true});
}
if(!configured&&ADMIN_MODE){
 if(ss("tb-admin")==="1"){startDemo();return}
 adminForm(function(em,pw,done){
  if(ADM.indexOf(em)<0){done(TB.tr("Email yoki parol noto‘g‘ri"));return}
  sha256(pw).then(function(h){if(h===C.demoAdminPassHash){ss("tb-admin","1");done();startDemo()}else done(TB.tr("Email yoki parol noto‘g‘ri"))}).catch(function(){done(TB.tr("Brauzer parolni tekshira olmadi"))})});
 return;
}
if(!configured){
 if(local||sessionStorageGet()==="1"||/[?&#]demo\b/.test(location.search+location.hash)){startDemo();return}
 TB.gate("gSetup");var bd=document.getElementById("btnDemo");
 if(bd)bd.onclick=function(){try{sessionStorage.setItem("tb-demo","1")}catch(e){}startDemo()};
 return;
}

/* ----- Firebase ----- */
function load(src){return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;s.onload=res;s.onerror=function(){rej(new Error("Yuklab bo‘lmadi: "+src))};document.head.appendChild(s)})}
var base="https://www.gstatic.com/firebasejs/"+VER+"/";
load(base+"firebase-app-compat.js").then(function(){return Promise.all([load(base+"firebase-auth-compat.js"),load(base+"firebase-firestore-compat.js")])}).then(init).catch(function(e){TB.gate("gLogin",TB.tr("Internetga ulanib bo‘lmadi. Sahifani yangilang.")+" ("+e.message+")")});

function init(){
 firebase.initializeApp(FB);
 var auth=firebase.auth(),db=firebase.firestore();
 try{auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)}catch(e){}
 var provider=new firebase.auth.GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});
 function fmtTs(ts){try{var d=ts&&ts.toDate?ts.toDate():null;return d?d.toLocaleDateString("uz-UZ"):""}catch(e){return ""}}
 window.TBAuth={
  listAllowed:function(){return db.collection("allowed").get().then(function(q){var l=[];q.forEach(function(d){var x=d.data();l.push({email:d.id,note:x.note||"",addedAt:fmtTs(x.addedAt),_t:x.addedAt&&x.addedAt.toMillis?x.addedAt.toMillis():0})});l.sort(function(a,b){return b._t-a._t});return l})},
  addAllowed:function(email,note){email=email.toLowerCase();return db.collection("allowed").doc(email).set({email:email,note:note||"",addedAt:firebase.firestore.FieldValue.serverTimestamp(),addedBy:auth.currentUser.email}).then(function(){return {email:email,note:note,addedAt:now()}})},
  removeAllowed:function(email){return db.collection("allowed").doc(email).delete()},
  getVideos:function(){return db.collection("settings").doc("videos").get().then(function(d){return d.exists?d.data():{}})},
  setVideo:function(key,url){var o={};o[key]=url;return db.collection("settings").doc("videos").set(o,{merge:true})},
  signOut:function(){auth.signOut().then(function(){location.reload()})}
 };
 if(ADMIN_MODE){
  var pending=null;
  adminForm(function(em,pw,done){pending=done;
   auth.signInWithEmailAndPassword(em,pw).catch(function(e){var c=e&&e.code||"";pending=null;
    if(/invalid-credential|wrong-password|user-not-found|invalid-email|invalid-login/.test(c))done(TB.tr("Email yoki parol noto‘g‘ri"));
    else if(/too-many-requests/.test(c))done(TB.tr("Juda ko‘p urinish. Birozdan keyin qayta urining."));
    else if(/operation-not-allowed/.test(c))done(TB.tr("Firebase’da Email/Password kirish usuli yoqilmagan."));
    else if(/network/.test(c))done(TB.tr("Internetga ulanib bo‘lmadi. Sahifani yangilang."));
    else done(TB.tr("Kirishda xato: ")+(e&&e.message||e))})});
  auth.onAuthStateChanged(function(u){
   if(!u){TB.gate("gAdmin");return}
   var email=(u.email||"").toLowerCase();
   if(ADM.indexOf(email)<0){auth.signOut();var d=pending;pending=null;TB.gate("gAdmin",TB.tr("Bu akkaunt administrator emas"));if(d)d(TB.tr("Bu akkaunt administrator emas"));return}
   if(pending){pending();pending=null}
   TB.start({email:email,name:u.displayName||"",photo:u.photoURL||"",isAdmin:true});
  });
  return;
 }
 document.getElementById("btnGoogle").onclick=function(){TB.gate("gLogin","");auth.signInWithPopup(provider).catch(function(e){
   if(e&&(e.code==="auth/popup-blocked"||e.code==="auth/operation-not-supported-in-this-environment"||e.code==="auth/cancelled-popup-request"))return auth.signInWithRedirect(provider);
   if(e&&e.code==="auth/popup-closed-by-user")return;
   if(e&&e.code==="auth/unauthorized-domain"){TB.gate("gLogin",TB.tr("Bu domen Firebase’da ruxsat etilmagan. Authentication → Settings → Authorized domains bo‘limiga sayt domenini qo‘shing."));return}
   TB.gate("gLogin",TB.tr("Kirishda xato: ")+(e&&e.message||e))})};
 document.getElementById("btnSwitch").onclick=function(){auth.signOut().then(function(){TB.gate("gLogin")})};
 auth.getRedirectResult().catch(function(e){TB.gate("gLogin",TB.tr("Kirishda xato: ")+(e&&e.message||e))});
 auth.onAuthStateChanged(function(u){
  if(!u){TB.gate("gLogin");return}
  var email=(u.email||"").toLowerCase(),isAdmin=ADM.indexOf(email)>=0;
  var user={email:email,name:u.displayName||"",photo:u.photoURL||"",isAdmin:isAdmin};
  if(isAdmin){TB.start(user);return}
  TB.gate("gLoading");
  db.collection("allowed").doc(email).get().then(function(d){if(d.exists)TB.start(user);else TB.gate("gDenied",email)}).catch(function(){TB.gate("gDenied",email)});
 });
}
})();
