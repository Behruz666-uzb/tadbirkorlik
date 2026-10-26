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
function now(){var d=new Date();return d.toLocaleDateString("uz-UZ")+" "+d.toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"})}

/* ----- DEMO (faqat kompyuterda sinash uchun, Firebase sozlanmaguncha) ----- */
if(!configured){
 if(!local){TB.gate("gSetup");return}
 var K="tb-demo-allowed",KV="tb-demo-videos";
 function rd(k,d){try{return JSON.parse(localStorage.getItem(k)||d)}catch(e){return JSON.parse(d)}}
 function wr(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
 window.TBAuth={
  listAllowed:function(){return Promise.resolve(rd(K,"[]"))},
  addAllowed:function(email,note){var l=rd(K,"[]"),rec={email:email,note:note,addedAt:now()};l.unshift(rec);wr(K,l);return Promise.resolve(rec)},
  removeAllowed:function(email){wr(K,rd(K,"[]").filter(function(x){return x.email!==email}));return Promise.resolve()},
  getVideos:function(){return Promise.resolve(rd(KV,"{}"))},
  setVideo:function(key,url){var v=rd(KV,"{}");v[key]=url;wr(KV,v);return Promise.resolve()},
  signOut:function(){TB.toast("Demo rejimda chiqish yo‘q")}
 };
 TB.start({email:ADM[0]||"demo@local",name:"Demo",isAdmin:true,demo:true});
 return;
}

/* ----- Firebase ----- */
function load(src){return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;s.onload=res;s.onerror=function(){rej(new Error("Yuklab bo‘lmadi: "+src))};document.head.appendChild(s)})}
var base="https://www.gstatic.com/firebasejs/"+VER+"/";
load(base+"firebase-app-compat.js").then(function(){return Promise.all([load(base+"firebase-auth-compat.js"),load(base+"firebase-firestore-compat.js")])}).then(init).catch(function(e){TB.gate("gLogin","Internetga ulanib bo‘lmadi. Sahifani yangilang. ("+e.message+")")});

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
 document.getElementById("btnGoogle").onclick=function(){TB.gate("gLogin","");auth.signInWithPopup(provider).catch(function(e){
   if(e&&(e.code==="auth/popup-blocked"||e.code==="auth/operation-not-supported-in-this-environment"||e.code==="auth/cancelled-popup-request"))return auth.signInWithRedirect(provider);
   if(e&&e.code==="auth/popup-closed-by-user")return;
   if(e&&e.code==="auth/unauthorized-domain"){TB.gate("gLogin","Bu domen Firebase’da ruxsat etilmagan. Authentication → Settings → Authorized domains bo‘limiga sayt domenini qo‘shing.");return}
   TB.gate("gLogin","Kirishda xato: "+(e&&e.message||e))})};
 document.getElementById("btnSwitch").onclick=function(){auth.signOut().then(function(){TB.gate("gLogin")})};
 auth.getRedirectResult().catch(function(e){TB.gate("gLogin","Kirishda xato: "+(e&&e.message||e))});
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
