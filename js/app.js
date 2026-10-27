/* =========================================================
   Tadbirkorlik asoslari — interactive textbook engine
   ========================================================= */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function fmt(n){var s=Math.round(n).toString();return s.replace(/\B(?=(\d{3})+(?!\d))/g," ")}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function pad(n){return String(n).padStart(2,"0")}

var TBL=window.TBL||{lang:"uz",tr:function(s){return s},F:{}},tr=TBL.tr,F=TBL.F,RU=TBL.lang==="ru";
var TB=window.TB={topics:[],videos:{},user:null,lang:TBL.lang,tr:tr,F:F,_t:{uz:{},ru:{}}};
TB.add=function(t){var l=t.lang==="ru"?"ru":"uz";TB._t[l][t.n]=t;var ns={},k;for(k in TB._t.uz)ns[k]=1;for(k in TB._t.ru)ns[k]=1;TB.topics=Object.keys(ns).map(Number).sort(function(a,b){return a-b}).map(function(n){return (RU&&TB._t.ru[n])||TB._t.uz[n]||TB._t.ru[n]})};
function topicByN(n){for(var i=0;i<TB.topics.length;i++)if(TB.topics[i].n===n)return TB.topics[i];return null}

/* ---------- icons ---------- */
var IC={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
 slides:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
 play:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>',
 video:'<rect x="2" y="5" width="15" height="14" rx="2"/><path d="M17 10l5-3v10l-5-3z"/>',
 cards:'<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 012 2v12"/>',
 sort:'<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
 trophy:'<path d="M7 4h10v5a5 5 0 01-10 0zM5 5H3v2a4 4 0 004 4M19 5h2v2a4 4 0 01-4 4M9 21h6M12 14v7"/>',
 calc:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h8"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
 people:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2c2.8.3 5 2.6 5 5.8"/>',
 doc:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
 coins:'<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 14v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.7-2.7-3-6-3"/>',
 percent:'<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
 bank:'<path d="M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 21h18"/>',
 up:'<path d="M12 20V5M5 12l7-7 7 7"/>', down:'<path d="M12 4v15M5 12l7 7 7-7"/>',
 bulb:'<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/>',
 shield:'<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
 store:'<path d="M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0zM5 13v8h14v-8"/>',
 factory:'<path d="M2 21V9l6 4V9l6 4V5h4l2 16z"/>',
 family:'<circle cx="7" cy="6" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="12" cy="12" r="2"/><path d="M3 21v-5a4 4 0 018 0M13 21v-5a4 4 0 018 0M10 21v-3a2 2 0 014 0v3"/>',
 brief:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>',
 law:'<path d="M12 3v18M5 21h14M6 7h12M6 7l-3 7a3 3 0 006 0zM18 7l-3 7a3 3 0 006 0z"/>',
 rocket:'<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3-1 6-1 6-1s0 3-1 6l-7 7-5-5zM9 15l-3-3"/>',
 money:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v.01M18 15v.01"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 mega:'<path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1zM16 8a5 5 0 010 8M19 5a9 9 0 010 14"/>',
 truck:'<path d="M1 4h13v12H1zM14 9h4l3 3v4h-7"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
 tag:'<path d="M3 12V4a1 1 0 011-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.6"/>',
 scales:'<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 006 0zM19 7l-3 6a3 3 0 006 0z"/>',
 house:'<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M10 21v-5h4v5"/>',
 heart:'<path d="M12 20s-7-4.5-9-9a4.5 4.5 0 018-3 4.5 4.5 0 018 3c-2 4.5-7 9-7 9z"/>',
 star:'<path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z"/>',
 check:'<path d="M5 12l5 5L20 7"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
 users:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-2a6 6 0 0112 0v2"/><path d="M16 3.1a4 4 0 010 7.8M21 21v-2a6 6 0 00-4-5.6"/>',
 leaf:'<path d="M5 21c0-9 5-15 15-16-1 10-7 15-15 16zM5 21l7-7"/>',
 tax:'<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
 hand:'<path d="M2 12l5-5 4 2 3-2h3l5 5-4 4M2 12l5 5M11 15l2 2M14 13l2 2M8 13l3 3"/>',
 book:'<path d="M4 19V5a2 2 0 012-2h3v18H6a2 2 0 01-2-2zM9 3h5v18H9zM14 5l4-1 3 15-4 1z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
};
function ic(n){return '<svg class="i" viewBox="0 0 24 24">'+(IC[n]||IC.star)+'</svg>'}
TB.ic=ic;

var CH=[
 {n:"I",t:""+tr("Tadbirkorlik, uning turlari va shakllari")+"",c:"#3b82f6",from:1,to:10},
 {n:"II",t:""+tr("Tadbirkorlikni tashkil etish")+"",c:"#10b981",from:11,to:15},
 {n:"III",t:""+tr("Korxona mablag‘lari, xarajatlari va moliyaviy natijalari")+"",c:"#f59e0b",from:16,to:21},
 {n:"IV",t:""+tr("Tadbirkorlik muvaffaqiyati asoslari")+"",c:"#a855f7",from:22,to:27},
 {n:"V",t:""+tr("Tadbirkorlikda risk va raqobatdoshlik")+"",c:"#ef4444",from:28,to:30}
];
function chOf(n){for(var i=0;i<CH.length;i++)if(n>=CH[i].from&&n<=CH[i].to)return CH[i];return CH[0]}
var SECS=[
 {id:"slides",t:""+tr("Slaydlar")+"",ic:"slides",c:"#f4b52f"},
 {id:"film",t:""+tr("Multfilm")+"",ic:"play",c:"#5ec9ff"},
 {id:"video",t:""+tr("Video dars")+"",ic:"video",c:"#ff5d70"},
 {id:"terms",t:""+tr("Lug‘at")+"",ic:"doc",c:"#a98bff"},
 {id:"sort",t:""+tr("Saralash")+"",ic:"sort",c:"#2bd47f"},
 {id:"quiz",t:""+tr("Jamoa jangi")+"",ic:"trophy",c:"#ff8a3d"},
 {id:"cards",t:""+tr("Savol-javob")+"",ic:"cards",c:"#38bdf8"},
 {id:"task",t:""+tr("Amaliy topshiriq")+"",ic:"calc",c:"#eab308"}
];

/* ---------- sound ---------- */
var muted=store("tb-mute")==="1",actx=null;
function tone(f,d,type,when,v){try{if(muted)return;actx=actx||new (window.AudioContext||window.webkitAudioContext)();var t=actx.currentTime+(when||0);var o=actx.createOscillator(),g=actx.createGain();o.type=type||"sine";o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v||.25,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+d+.05)}catch(e){}}
function sOk(){tone(660,.15,"triangle");tone(880,.2,"triangle",.12);tone(1175,.3,"triangle",.24)}
function sNo(){tone(220,.25,"sawtooth");tone(160,.35,"sawtooth",.15)}
function sTick(){tone(1000,.05,"square")}
function sEnd(){[0,.25,.5].forEach(function(w){tone(880,.2,"square",w)})}
TB.tone=tone;

/* ---------- confetti / toast ---------- */
var cf,cx,parts=[],cfOn=false;
function confetti(){if(!cf){cf=$("#confetti");cx=cf.getContext("2d")}cf.width=innerWidth;cf.height=innerHeight;var cols=["#f4b73f","#2bd47f","#5ec9ff","#a98bff","#ff5d70"];for(var i=0;i<160;i++)parts.push({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.35,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,s:6+Math.random()*8,r:Math.random()*6,c:cols[i%5],l:0});if(!cfOn){cfOn=true;requestAnimationFrame(cfLoop)}}
function cfLoop(){cx.clearRect(0,0,cf.width,cf.height);parts=parts.filter(function(p){return p.l<160&&p.y<cf.height+40});parts.forEach(function(p){p.l++;p.vy+=.45;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=.15;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});if(parts.length)requestAnimationFrame(cfLoop);else{cfOn=false;cx.clearRect(0,0,cf.width,cf.height)}}
var toastT=null;function toast(msg,err){var t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";document.body.appendChild(t)}t.className="toast"+(err?" err":"");t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},2800)}
TB.toast=toast;

/* ---------- ticker ---------- */
function ticker(){var TK=[["SOMSA",20000],["TANDIR",14500],["PAXTA",8200],["NONVOY",5400],["CHOYXONA",31000],["ASALARI",12750],["ATLAS",44300],["KOSIBLAR",9100],["MEVA-EKSPORT",17600],["STARTAP-UZ",26400]];var h="";for(var k=0;k<2;k++)TK.forEach(function(t,i){h+='<span class="tk"><b>'+t[0]+'</b><span data-p="'+i+'">'+fmt(t[1])+'</span><em data-c="'+i+'" class="u">▲ 0.0%</em></span>'});$("#ticker").innerHTML=h;
 setInterval(function(){TK.forEach(function(t,i){var ch=(Math.random()-.47)*2.4;t[1]=Math.max(1000,t[1]*(1+ch/100));$$('[data-p="'+i+'"]').forEach(function(e){e.textContent=fmt(t[1])});$$('[data-c="'+i+'"]').forEach(function(e){e.className=ch>=0?"u":"d";e.textContent=(ch>=0?"▲ ":"▼ ")+Math.abs(ch).toFixed(1)+"%"})})},3000)}

/* ---------- overlays (modals) ---------- */
function buildOverlays(){$("#overlays").innerHTML=
 '<div class="modal" id="mTimer" hidden><div class="mbox"><button class="xbtn" data-close="mTimer" aria-label="'+tr("Yopish")+'">'+ic("x")+'</button><h3>'+tr("Taymer")+'</h3><div class="tdisp" id="tDisp">03:00</div><div class="presets" id="tPresets"></div><div class="center-row"><button class="btn gold" id="tStart">'+tr("Boshlash")+'</button><button class="btn" id="tReset">'+tr("Qayta o‘rnatish")+'</button></div></div></div>'+
 '<div class="modal" id="mPick" hidden><div class="mbox"><button class="xbtn" data-close="mPick" aria-label="'+tr("Yopish")+'">'+ic("x")+'</button><h3>'+tr("Kim javob beradi?")+'</h3><div class="pick-out" id="pickOut">?</div><div class="center-row"><button class="btn gold" id="pickGo" style="min-width:12rem">'+tr("Tanlash")+'</button></div><div class="row2"><div class="field"><label for="pickN">'+tr("O‘quvchilar soni (jurnal raqami)")+'</label><input id="pickN" type="number" min="2" max="60" value="30"></div><div class="field"><label for="pickNames">'+tr("yoki ismlar (har biri yangi qatorda)")+'</label><textarea id="pickNames" rows="3" placeholder="Ali&#10;Madina&#10;Jasur"></textarea></div></div></div></div>'+
 '<div class="modal" id="mCard" hidden><div class="kwrap"><div class="khead"><span class="chip" id="kNum">1-'+tr("savol")+'</span><span class="ktopic" id="kTopic"></span><span class="kstate" id="kState"></span><button class="xbtn" data-close="mCard" aria-label="'+tr("Yopish")+'">'+ic("x")+'</button></div><button class="kflip" id="kFlip" aria-label="'+tr("Kartani aylantirish")+'"><div class="inner"><div class="f"><span class="kq" id="kQ"></span><small>'+tr("Bosing: javobni ko‘rish")+'</small></div><div class="b"><span class="kl">'+tr("Javob")+'</span><span class="ka" id="kA"></span></div></div></button><div class="kctrl"><button class="btn" id="kPrev">'+tr("‹ Oldingi")+'</button><button class="btn kno" id="kNoB">'+tr("✗ Bilmadi")+'</button><button class="btn kok" id="kOkB">'+tr("✓ Bildi")+'</button><button class="btn" id="kNext">'+tr("Keyingi ›")+'</button></div></div></div>'+
 '<div class="sheet-bg" id="sheet" hidden><div class="sheet" role="dialog" aria-label="'+tr("Menyu")+'"><div class="sheet-h"><div><small id="shK">'+tr("11-sinf")+'</small><b id="shT">'+tr("Tadbirkorlik asoslari")+'</b></div><button class="xbtn" id="sheetX" aria-label="'+tr("Yopish")+'">'+ic("x")+'</button></div><div class="sheet-grid" id="sheetGrid"></div></div></div>'+
 '<div id="bookHost"></div>';
 document.addEventListener("click",function(e){var c=e.target.closest("[data-close]");if(c){$("#"+c.dataset.close).hidden=true}});
 $$(".modal").forEach(function(m){m.addEventListener("click",function(e){if(e.target===m)m.hidden=true})});
}

/* ---------- tools: theme, sound, fullscreen, timer, picker, pen ---------- */
function setupTools(){
 function setMuteIc(){$("#tSound").classList.toggle("on",muted);$("#sndIc").innerHTML=muted?'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>':'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/>'}
 $("#tSound").onclick=function(){muted=!muted;store("tb-mute",muted?"1":"0");setMuteIc()};setMuteIc();
 var th=store("tb-theme");if(th)document.documentElement.setAttribute("data-theme",th);
 $("#tTheme").onclick=function(){var cur=document.documentElement.getAttribute("data-theme");var dark=cur?cur==="dark":!window.matchMedia("(prefers-color-scheme: light)").matches;var nx=dark?"light":"dark";document.documentElement.setAttribute("data-theme",nx);store("tb-theme",nx)};
 $("#tFull").onclick=function(){try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(function(){})}catch(e){}};
 $("#tLib").onclick=function(){nav("lib")};
 $("#tOut").onclick=function(){if(window.TBAuth&&TBAuth.signOut)TBAuth.signOut()};
 $("#tLangL").textContent=RU?"O‘zbekcha":"Русский";$("#tLangB").textContent=RU?"UZ":"RU";
 $("#tLang").onclick=function(){if(TBL.setLang)TBL.setLang(RU?"uz":"ru")};
 // timer
 var TM={total:180,left:180,run:false,iv:null},PRE=[30,60,120,180,300,600];
 $("#tPresets").innerHTML=PRE.map(function(s){return '<button data-t="'+s+'">'+F.dur(s)+'</button>'}).join("");
 function tmFmt(s){return pad(Math.floor(s/60))+":"+pad(s%60)}
 function tmUI(){$("#tDisp").textContent=tmFmt(TM.left);$("#tDisp").classList.toggle("low",TM.run&&TM.left<=10);$("#tStart").textContent=TM.run?""+tr("Pauza")+"":""+tr("Boshlash")+"";$$("#tPresets button").forEach(function(b){b.classList.toggle("on",+b.dataset.t===TM.total)});var mini=$("#tMini");mini.hidden=!TM.run;mini.textContent=tmFmt(TM.left);$("#tTimer").classList.toggle("on",TM.run)}
 $("#tPresets").onclick=function(e){var b=e.target.closest("[data-t]");if(!b)return;clearInterval(TM.iv);TM.run=false;TM.total=TM.left=+b.dataset.t;tmUI()};
 $("#tStart").onclick=function(){if(TM.run){clearInterval(TM.iv);TM.run=false}else{if(TM.left<=0)TM.left=TM.total;TM.run=true;TM.iv=setInterval(function(){TM.left--;if(TM.left<=5&&TM.left>0)sTick();if(TM.left<=0){TM.left=0;clearInterval(TM.iv);TM.run=false;sEnd();$("#mTimer").hidden=false}tmUI()},1000)}tmUI()};
 $("#tReset").onclick=function(){clearInterval(TM.iv);TM.run=false;TM.left=TM.total;tmUI()};
 $("#tTimer").onclick=function(){$("#mTimer").hidden=false};tmUI();
 // picker
 var saved=store("tb-names");if(saved)$("#pickNames").value=saved;
 $("#pickNames").oninput=function(){store("tb-names",$("#pickNames").value)};
 $("#tPick").onclick=function(){$("#mPick").hidden=false};
 $("#pickGo").onclick=function(){var names=$("#pickNames").value.split("\n").map(function(s){return s.trim()}).filter(Boolean);var pool=names.length>1?names:Array.from({length:Math.max(2,Math.min(60,+$("#pickN").value||30))},function(_,i){return String(i+1)});var out=$("#pickOut"),k=0,steps=22;out.classList.add("spin");
  (function spin(){out.textContent=pool[Math.floor(Math.random()*pool.length)];tone(300+k*30,.04,"square");k++;if(k<steps)setTimeout(spin,40+k*k*.6);else{out.classList.remove("spin");out.textContent=pool[Math.floor(Math.random()*pool.length)];sOk()}})()};
 // pen
 var pen=$("#pen"),pctx=pen.getContext("2d"),PC={col:"#f4b73f",w:6,er:false,down:false,lx:0,ly:0},PCOLS=["#f4b73f","#ff5d70","#2bd47f","#5ec9ff","#ffffff","#111a32"];
 $("#penbar").innerHTML=PCOLS.map(function(c){return '<button data-pc="'+c+'" aria-label="'+tr("Rang")+'"><span class="sw" style="background:'+c+'"></span></button>'}).join("")+'<button data-pw="1" aria-label="'+tr("Qalinlik")+'"><svg class="i" viewBox="0 0 24 24"><path d="M4 12h16" stroke-width="5"/></svg></button><button data-er="1" aria-label="'+tr("O‘chirg‘ich")+'"><svg class="i" viewBox="0 0 24 24"><path d="M16 3l5 5-11 11H5l-2-2z"/><path d="M12 7l5 5"/></svg></button><button data-cl="1" aria-label="'+tr("Tozalash")+'"><svg class="i" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button><button data-px="1" aria-label="'+tr("Yopish")+'" style="background:var(--gold);color:var(--gold-ink)">'+ic("x")+'</button>';
 function penSize(){var r=window.devicePixelRatio||1;var img=null;try{img=pen.width?pctx.getImageData(0,0,pen.width,pen.height):null}catch(e){}pen.width=innerWidth*r;pen.height=innerHeight*r;pen.style.width=innerWidth+"px";pen.style.height=innerHeight+"px";pctx.setTransform(r,0,0,r,0,0);if(img)try{pctx.putImageData(img,0,0)}catch(e){}}
 function penMark(){$$("#penbar [data-pc]").forEach(function(b){b.classList.toggle("on",!PC.er&&b.dataset.pc===PC.col)});$('#penbar [data-er]').classList.toggle("on",PC.er)}
 function penOff(){pctx.clearRect(0,0,pen.width,pen.height);pen.hidden=true;$("#penbar").hidden=true;$("#tPen").classList.remove("on");$("#dock").classList.remove("away")}
 $("#tPen").onclick=function(){if(!pen.hidden){penOff();return}pen.hidden=false;$("#penbar").hidden=false;$("#tPen").classList.add("on");$("#dock").classList.add("away");penSize();penMark()};
 $("#penbar").onclick=function(e){var b=e.target.closest("button");if(!b)return;if(b.dataset.pc){PC.col=b.dataset.pc;PC.er=false}else if(b.dataset.pw){PC.w=PC.w===6?14:PC.w===14?3:6}else if(b.dataset.er){PC.er=!PC.er}else if(b.dataset.cl){pctx.clearRect(0,0,pen.width,pen.height)}else if(b.dataset.px){penOff()}penMark()};
 pen.addEventListener("pointerdown",function(e){PC.down=true;PC.lx=e.clientX;PC.ly=e.clientY;try{pen.setPointerCapture(e.pointerId)}catch(x){}});
 pen.addEventListener("pointermove",function(e){if(!PC.down)return;pctx.globalCompositeOperation=PC.er?"destination-out":"source-over";pctx.strokeStyle=PC.col;pctx.lineWidth=PC.er?PC.w*5:PC.w;pctx.lineCap="round";pctx.lineJoin="round";pctx.beginPath();pctx.moveTo(PC.lx,PC.ly);pctx.lineTo(e.clientX,e.clientY);pctx.stroke();PC.lx=e.clientX;PC.ly=e.clientY});
 ["pointerup","pointercancel","pointerleave"].forEach(function(ev){pen.addEventListener(ev,function(){PC.down=false})});
 addEventListener("resize",function(){if(!pen.hidden)penSize()});
}

/* ---------- tool ball (radial) ---------- */
function setupFab(){var fab=$("#fab"),ball=$("#fabBall"),rem=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;
 function items(){return $$(".fab-it",fab).filter(function(i){return !i.hidden})}
 var pos=null;try{pos=JSON.parse(localStorage.getItem("tb-fab")||"null")}catch(e){}
 function clamp(){var m=2.6*rem,W=innerWidth,H=innerHeight;if(!pos)pos={x:W-3.4*rem,y:H*.5};pos.x=Math.max(m,Math.min(W-m,pos.x));pos.y=Math.max(m,Math.min(H-m,pos.y));fab.style.left=pos.x+"px";fab.style.top=pos.y+"px"}
 function layout(){rem=parseFloat(getComputedStyle(document.documentElement).fontSize)||16;var its=items(),W=innerWidth,H=innerHeight,n=its.length,edge=Math.min(pos.x,W-pos.x,pos.y,H-pos.y),full=edge>9*rem,a0=Math.atan2(H/2-pos.y,W/2-pos.x),span=full?Math.PI*2:Math.PI*.95,R=full?Math.max(6.2*rem,n*3.9*rem/(Math.PI*2)):Math.max(8*rem,(n-1)*3.9*rem/(Math.PI*.95));
  if(!full){var nearX=Math.min(pos.x,W-pos.x),nearY=Math.min(pos.y,H-pos.y);if(nearX<nearY)a0=pos.x<W/2?0:Math.PI;else a0=pos.y<H/2?Math.PI/2:-Math.PI/2;if(nearX<9*rem&&nearY<9*rem){a0=Math.atan2(pos.y<H/2?1:-1,pos.x<W/2?1:-1);span=Math.PI*.7;R=Math.max(10*rem,(n-1)*3.9*rem/(Math.PI*.7))}}
  its.forEach(function(it,k){var a=full?(-Math.PI/2+k*span/n):(a0-span/2+k*span/(n-1)),cxx=Math.cos(a),cyy=Math.sin(a);it.style.setProperty("--tx",(R*cxx).toFixed(1)+"px");it.style.setProperty("--ty",(R*cyy).toFixed(1)+"px");it.style.setProperty("--i",k);
   var l=$(".fab-l",it);l.style.setProperty("--lx",(cxx*(2.7*rem)+cxx*Math.abs(cxx)*1.6*rem).toFixed(1)+"px");l.style.setProperty("--ly",(cyy*2.6*rem).toFixed(1)+"px")});
  fab.style.setProperty("--rd",(2*R+4.6*rem)+"px")}
 function open(v){if(v)layout();fab.classList.toggle("open",v)}
 clamp();layout();TB.fabLayout=layout;
 var st=null;ball.addEventListener("pointerdown",function(e){st={x:e.clientX,y:e.clientY,px:pos.x,py:pos.y,drag:false};try{ball.setPointerCapture(e.pointerId)}catch(x){}});
 ball.addEventListener("pointermove",function(e){if(!st)return;var dx=e.clientX-st.x,dy=e.clientY-st.y;if(!st.drag&&Math.abs(dx)+Math.abs(dy)>8){st.drag=true;open(false)}if(st.drag){pos.x=st.px+dx;pos.y=st.py+dy;clamp()}});
 ball.addEventListener("pointerup",function(){if(!st)return;if(st.drag){try{localStorage.setItem("tb-fab",JSON.stringify(pos))}catch(e){}}else{open(!fab.classList.contains("open"));tone(fab.classList.contains("open")?660:440,.07,"triangle")}st=null});
 ball.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();open(!fab.classList.contains("open"))}});
 $$(".fab-it",fab).forEach(function(it){it.addEventListener("click",function(){setTimeout(function(){open(false)},120)})});
 document.addEventListener("pointerdown",function(e){if(fab.classList.contains("open")&&!fab.contains(e.target))open(false)});
 document.addEventListener("keydown",function(e){if(e.key==="Escape")open(false)});
 addEventListener("resize",function(){clamp();layout()});
}

/* ---------- dock + sheet ---------- */
var cur={view:"lib",n:0,sec:"slides"};
function sheet(open){$("#sheet").hidden=!open;$("#dock").classList.toggle("sheet-open",open)}
function setupDock(){
 $("#dkMenu").onclick=function(){if($("#sheet").hidden)fillSheet();sheet($("#sheet").hidden)};
 $("#dkCur").onclick=function(){fillSheet();sheet(true)};$("#sheetX").onclick=function(){sheet(false)};
 $("#sheet").addEventListener("click",function(e){if(e.target===$("#sheet")||e.target.closest("[data-nav]"))sheet(false)});
 $("#dkPrev").onclick=function(){stepNav(-1)};$("#dkNext").onclick=function(){stepNav(1)};
 (function(){var t=null,d=$("#dock");function wake(){d.classList.remove("idle");clearTimeout(t);t=setTimeout(function(){d.classList.add("idle")},4000)}["pointerdown","pointermove","keydown"].forEach(function(ev){document.addEventListener(ev,wake,{passive:true})});wake()})();
 document.addEventListener("click",function(e){var b=e.target.closest("[data-nav]");if(b){nav(b.dataset.nav)}});
}
function stepNav(d){if(cur.view==="lesson"){var ids=SECS.map(function(s){return s.id}),i=ids.indexOf(cur.sec)+d;if(i>=0&&i<ids.length)nav("t"+pad(cur.n)+"-"+ids[i]);else{var t=topicByN(cur.n+d);if(t)nav("t"+pad(t.n)+"-"+(d>0?"slides":"task"))}}else if(cur.view==="lib"){}}
function fillSheet(){var g=$("#sheetGrid");
 if(cur.view==="lesson"){var t=topicByN(cur.n),ch=chOf(cur.n);$("#shK").textContent=F.bob(ch.n)+" · "+F.mv(cur.n);$("#shT").textContent=t.title;
  g.innerHTML=SECS.map(function(s,i){return '<button class="sg'+(s.id===cur.sec?" on":"")+'" data-nav="t'+pad(cur.n)+'-'+s.id+'" style="animation-delay:'+(i*.03)+'s"><span class="ic" style="background:'+s.c+'">'+ic(s.ic)+'</span><span class="t"><small>'+F.qism(i+1)+'</small><b>'+s.t+'</b></span></button>'}).join("")+
  (topicByN(cur.n-1)?'<button class="sg" data-nav="t'+pad(cur.n-1)+'-slides"><span class="ic" style="background:var(--muted)">'+ic("up")+'</span><span class="t"><small>'+tr("Oldingi mavzu")+'</small><b>'+esc(topicByN(cur.n-1).title)+'</b></span></button>':"")+
  (topicByN(cur.n+1)?'<button class="sg" data-nav="t'+pad(cur.n+1)+'-slides"><span class="ic" style="background:var(--muted)">'+ic("down")+'</span><span class="t"><small>'+tr("Keyingi mavzu")+'</small><b>'+esc(topicByN(cur.n+1).title)+'</b></span></button>':"")+
  '<button class="sg" data-nav="lib"><span class="ic" style="background:var(--gold)">'+ic("book")+'</span><span class="t"><small>'+tr("Barcha mavzular")+'</small><b>'+tr("Kutubxona")+'</b></span></button>'}
 else{$("#shK").textContent=""+tr("11-sinf · 30 ta mavzu")+"";$("#shT").textContent=""+tr("Tadbirkorlik asoslari")+"";
  g.innerHTML=TB.topics.map(function(t,i){var ch=chOf(t.n);return '<button class="sg" data-nav="t'+pad(t.n)+'-slides" style="animation-delay:'+(i*.015)+'s"><span class="ic" style="background:'+ch.c+';font-family:var(--display);font-weight:900;color:#fff">'+t.n+'</span><span class="t"><small>'+F.bob(ch.n)+'</small><b>'+esc(t.title)+'</b></span></button>'}).join("")}}
function dockUI(){var ic1,num,tt;
 if(cur.view==="lesson"){var s=SECS.filter(function(x){return x.id===cur.sec})[0];ic1=s.ic;$("#dkIc").style.background=s.c;num=F.mv(cur.n)+" · "+(SECS.indexOf(s)+1)+"/"+SECS.length;tt=s.t}
 else{ic1="book";$("#dkIc").style.background="var(--gold)";num=""+tr("11-sinf")+"";tt=""+tr("Kutubxona")+""}
 $("#dkIc").innerHTML=ic(ic1);$("#dkNum").textContent=num;$("#dkT").textContent=tt;
 var lesson=cur.view==="lesson";$("#dkPrev").disabled=!lesson||(cur.sec===SECS[0].id&&!topicByN(cur.n-1));$("#dkNext").disabled=!lesson||(cur.sec===SECS[SECS.length-1].id&&!topicByN(cur.n+1))}

/* ---------- router ---------- */
function nav(token){try{history.replaceState(null,"","#"+token)}catch(e){location.hash=token}route()}
TB.nav=nav;
function route(){var h=(location.hash||"").replace("#",""),m=/^t(\d\d)(?:-(\w+))?$/.exec(h);stopLesson();sheet(false);closeBook();
 $("#v-lib").hidden=$("#v-lesson").hidden=true;
 if(m&&topicByN(+m[1])){cur.view="lesson";cur.n=+m[1];if(window.TBTheme)TBTheme.apply(cur.n);cur.sec=SECS.some(function(s){return s.id===m[2]})?m[2]:"slides";$("#v-lesson").hidden=false;renderLesson();markSeen(cur.n)}
 else{cur.view="lib";if(window.TBTheme)TBTheme.clear();$("#v-lib").hidden=false;renderLib()}
 dockUI();var v=$("#v-"+(cur.view==="lesson"?"lesson":cur.view));if(v&&cur.view!=="lesson")v.scrollTop=0}
function seen(){try{return JSON.parse(store("tb-seen")||"[]")}catch(e){return []}}
function markSeen(n){var s=seen();if(s.indexOf(n)<0){s.push(n);store("tb-seen",JSON.stringify(s))}store("tb-last",String(n))}

/* ---------- LIBRARY ---------- */
var libMode=store("tb-libmode")||"shelf",libQ="";
function renderLib(){var v=$("#v-lib"),last=+store("tb-last")||0,lt=topicByN(last),sn=seen(),avail=TB.topics.length;
 var h='<div class="wrap"><div class="lib-hero"><div><div class="eyebrow">'+tr("11-sinf · U. G‘afurov, Q. Sharipov")+'</div><h1>'+(RU?'Основы <em>предпринимательства</em>':'Tadbirkorlik <em>asoslari</em>')+'</h1><p>'+tr("30 ta mavzu, 5 ta bob. Kitobni javondan oling: har bir mavzuda slaydlar, multfilm, video, o‘yinlar va amaliy topshiriqlar bor.")+'</p></div>'+
 '<div class="lib-tools"><label class="lib-search">'+ic("search")+'<input id="libQ" type="search" placeholder="'+tr("Mavzu qidirish…")+'" value="'+esc(libQ)+'"></label><div class="view-toggle"><button data-lm="shelf" class="'+(libMode==="shelf"?"on":"")+'">'+tr("Javon")+'</button><button data-lm="grid" class="'+(libMode==="grid"?"on":"")+'">'+tr("Ro‘yxat")+'</button></div></div></div>';
 if(lt)h+='<div class="continue">'+ic("book")+'<b>'+F.mv(lt.n)+': '+esc(lt.title)+'</b><span>'+tr("Oxirgi ochilgan dars · ")+''+sn.length+' / '+avail+''+tr(" mavzu ko‘rilgan")+'</span><button class="btn gold" data-nav="t'+pad(lt.n)+'-slides">'+tr("Davom ettirish")+'</button></div>';
 if(libMode==="shelf"){CH.forEach(function(c){var ts=TB.topics.filter(function(t){return t.n>=c.from&&t.n<=c.to});if(!ts.length)return;
   h+='<section class="shelf"><div class="shelf-h"><span class="bob" style="background:'+c.c+'">'+F.BOB(c.n)+'</span><h2>'+c.t+'</h2><small>'+F.mvs(c.from,c.to)+'</small></div><div class="books">'+
   ts.map(function(t,i){var hh=13.4+((t.n*37)%5)*.6,ww=3.9+((t.n*53)%4)*.28,match=!libQ||(t.n+" "+t.title).toLowerCase().indexOf(libQ.toLowerCase())>=0;return '<button class="spine'+(match?"":" dim")+(i===ts.length-1&&ts.length>3?" lean":"")+'" data-book="'+t.n+'" style="--c:'+c.c+';--h:'+hh.toFixed(1)+'rem;--w:'+ww.toFixed(2)+'rem;--b:'+[1,.88,1.07,.94,1.12,.9][t.n%6]+'" aria-label="'+F.mv(t.n)+': '+esc(t.title)+'"><span class="band b1"></span><span class="sn">'+t.n+'</span><span class="st">'+esc(t.title)+'</span><span class="band b2"></span>'+(sn.indexOf(t.n)>=0?'<span class="seen">'+ic("check")+'</span>':"")+'</button>'}).join("")+
   '</div><div class="plank"></div></section>'})}
 else{h+='<div class="grid-lib">'+TB.topics.filter(function(t){return !libQ||(t.n+" "+t.title).toLowerCase().indexOf(libQ.toLowerCase())>=0}).map(function(t){var c=chOf(t.n);return '<button class="gl" data-book="'+t.n+'"><span class="gn" style="background:'+c.c+'">'+t.n+'</span><span><small>'+F.bob(c.n)+'</small><b>'+esc(t.title)+'</b></span></button>'}).join("")+'</div>'}
 v.innerHTML=h+'</div>';
 var q=$("#libQ");q.oninput=function(){libQ=q.value;var pos=q.selectionStart;renderLib();var q2=$("#libQ");q2.focus();try{q2.setSelectionRange(pos,pos)}catch(e){}};
 $$("[data-lm]",v).forEach(function(b){b.onclick=function(){libMode=b.dataset.lm;store("tb-libmode",libMode);renderLib()}});
 $$("[data-book]",v).forEach(function(b){b.onclick=function(){openBook(+b.dataset.book,b)}});}

var BK={src:null,anims:[],busy:false};
function reduceMotion(){try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}}
function openBook(n,srcEl,instant){var t=topicByN(n);if(!t)return;var c=chOf(n);
 BK.anims.forEach(function(a){try{a.cancel()}catch(e){}});BK.anims=[];
 if(BK.src&&BK.src!==srcEl){BK.src.classList.remove("pulled")}
 var had=!!$("#bookM");BK.src=srcEl||null;
 $("#bookHost").innerHTML='<div class="bookm'+(had?" on":"")+'" id="bookM"><div class="open-book" id="oBook" style="--c:'+c.c+'"><button class="bm-x" id="bmX" aria-label="'+tr("Yopish")+'">'+ic("x")+'</button>'+
 '<div class="page l"><div class="kicker">'+F.BOB(c.n)+' · '+F.MV(n)+'</div><div class="bignum">'+pad(n)+'</div><h2>'+esc(t.title)+'</h2><p>'+esc(t.sum||"")+'</p><div class="learn">'+(t.learn||[]).map(function(x){return '<span>'+esc(x)+'</span>'}).join("")+'</div><div class="foot"><span>'+F.bet(t.page||"")+'</span><span>'+c.t+'</span></div></div>'+
 '<div class="page r"><button class="go-lesson" data-nav="t'+pad(n)+'-slides">'+ic("play")+' '+tr("Darsni boshlash")+'</button><div class="secs">'+SECS.map(function(s){return '<button class="sec" data-nav="t'+pad(n)+'-'+s.id+'"><span class="si" style="background:'+s.c+'">'+ic(s.ic)+'</span>'+s.t+'</button>'}).join("")+'</div><div class="foot"><span>'+(t.terms||[]).length+''+tr(" atama · ")+''+(t.quiz||[]).length+''+tr(" savol · ")+''+cardsOf(t).length+''+tr(" kartochka")+'</span></div></div>'+
 '<div class="cover" id="oCover"><div class="front"><div class="cv-k">'+F.BOB(c.n)+'</div><span>'+n+'</span><b>'+esc(t.title)+'</b><div class="cv-a">'+tr("11-sinf · U. G‘afurov, Q. Sharipov")+'</div><i class="shade" id="oShade"></i></div><div class="back" id="oBack"></div><div class="cv-spine"><i>'+n+'</i><em>'+esc(t.title)+'</em><i></i></div></div>'+
 '<div class="bm-nav">'+(topicByN(n-1)?'<button data-bk="'+(n-1)+'">‹ '+F.mv(n-1)+'</button>':"")+(topicByN(n+1)?'<button data-bk="'+(n+1)+'">'+F.mv(n+1)+' ›</button>':"")+'</div></div></div>';
 var M=$("#bookM"),B=$("#oBook"),CV=$("#oCover"),SH=$("#oShade"),BA=$("#oBack"),PL=$(".page.l",B);
 M.addEventListener("click",function(e){if(e.target===M)closeBook()});$("#bmX").onclick=closeBook;
 $$("[data-bk]",M).forEach(function(b){b.onclick=function(){var sp=$('.spine[data-book="'+b.dataset.bk+'"]');openBook(+b.dataset.bk,sp,true)}});
 function finish(){CV.style.display="none";B.style.transform="";PL.style.opacity="";B.classList.add("ready");BK.busy=false}
 if(!B.animate||reduceMotion()){M.classList.add("on");finish();return}
 BK.busy=true;requestAnimationFrame(function(){M.classList.add("on")});
 var r=B.getBoundingClientRect(),W=r.width,H=r.height,cx=r.left+W/2,cy=r.top+H/2,closed="translate("+(-W/4)+"px,0px) scale(1) rotateY(0deg)";
 tone(520,.08,"triangle");
 function openCover(delay){
  var dur=1050,ease="cubic-bezier(.55,.05,.25,1)";
  BK.anims.push(B.animate([{transform:closed},{transform:"translate(0px,0px) scale(1) rotateY(0deg)"}],{duration:dur,delay:delay,easing:ease,fill:"forwards"}));
  var SP=$(".cv-spine",B);if(SP)BK.anims.push(SP.animate([{opacity:1},{opacity:0,offset:.12},{opacity:0}],{duration:dur,delay:delay,fill:"forwards"}));
  BK.anims.push(CV.animate([{transform:"translateZ(1px) rotateY(0deg)"},{transform:"translateZ(1px) rotateY(-30deg)",offset:.18},{transform:"translateZ(1px) rotateY(-180deg)"}],{duration:dur,delay:delay,easing:ease,fill:"both"}));
  BK.anims.push(SH.animate([{opacity:0},{opacity:.85,offset:.5},{opacity:.85}],{duration:dur,delay:delay,easing:ease,fill:"both"}));
  BK.anims.push(BA.animate([{filter:"brightness(.55)"},{filter:"brightness(.55)",offset:.5},{filter:"brightness(1)"}],{duration:dur,delay:delay,easing:ease,fill:"both"}));
  var pa=PL.animate([{opacity:0},{opacity:0,offset:.48},{opacity:1,offset:.62},{opacity:1}],{duration:dur,delay:delay,easing:"linear",fill:"both"});BK.anims.push(pa);
  setTimeout(function(){tone(380,.12,"sine")},delay+dur*.35);
  pa.onfinish=function(){finish()}}
 if(instant){openCover(60);return}
 // 1) javondan uchib kelish
 var from;
 if(srcEl&&srcEl.classList.contains("spine")){var sr=srcEl.getBoundingClientRect(),s=Math.max(.18,Math.min(1,sr.height/H)),th=sr.width/s;
  B.style.setProperty("--th",th.toFixed(1)+"px");
  from="translate("+(sr.left+sr.width/2-cx+th*s/2).toFixed(1)+"px,"+(sr.top+sr.height/2-cy).toFixed(1)+"px) scale("+s.toFixed(3)+") rotateY(90deg)";
  srcEl.classList.add("pulled")}
 else if(srcEl){var gr=srcEl.getBoundingClientRect(),s2=Math.max(.12,gr.height/H);from="translate("+(gr.left+gr.width/2-cx).toFixed(1)+"px,"+(gr.top+gr.height/2-cy).toFixed(1)+"px) scale("+s2.toFixed(3)+") rotateY(0deg)"}
 else from="translate("+(-W/4)+"px,60px) scale(.6) rotateY(0deg)";
 var lift=from.replace(/translate\(([-\d.]+)px,([-\d.]+)px\)/,function(m,a,b){return "translate("+a+"px,"+(+b-40)+"px)"});
 BK.anims.push(B.animate([{transform:from,opacity:srcEl?1:0},{transform:lift,opacity:1,offset:.15},{transform:"translate("+(-W/4)+"px,-12px) scale(1.04) rotateY(-14deg)",offset:.78},{transform:closed}],{duration:820,easing:"cubic-bezier(.3,.1,.2,1)",fill:"both"}));
 BK.anims.push(PL.animate([{opacity:0},{opacity:0}],{duration:820,fill:"both"}));
 openCover(820)}
function closeBook(){var h=$("#bookHost"),M=$("#bookM");if(!h)return;var src=BK.src;BK.src=null;
 function done(){h.innerHTML="";if(src&&document.body.contains(src)){src.classList.remove("pulled");src.classList.remove("back-in");void src.offsetWidth;src.classList.add("back-in")}}
 BK.anims.forEach(function(a){try{a.cancel()}catch(e){}});BK.anims=[];
 if(!M){done();return}
 var B=$("#oBook");if(!B||!B.animate||reduceMotion()){done();return}
 M.classList.add("out");M.classList.remove("on");
 var a=B.animate([{transform:"none",opacity:1},{transform:"translateY(30px) scale(.92)",opacity:0}],{duration:280,easing:"cubic-bezier(.4,0,1,1)",fill:"both"});
 a.onfinish=done;setTimeout(function(){if($("#bookM")===M)done()},500)}

/* ---------- LESSON ---------- */
var L={t:null};var lessonCleanup=[];
function stopLesson(){lessonCleanup.forEach(function(f){try{f()}catch(e){}});lessonCleanup=[]}
function renderLesson(){var t=topicByN(cur.n),c=chOf(cur.n);L.t=t;var v=$("#v-lesson");
 v.innerHTML='<div class="lhead"><button class="btn" data-nav="lib" aria-label="'+tr("Kutubxona")+'">'+ic("book")+'</button><span class="lnum" style="background:'+c.c+'">'+t.n+'</span><div class="lt"><small>'+F.bob(c.n)+' · '+F.mv(t.n)+'</small><b>'+esc(t.title)+'</b></div>'+(function(){var s=SECS.filter(function(x){return x.id===cur.sec})[0];return '<button class="lsec" id="lSec" aria-label="'+tr("Menyu")+'"><span class="ic" style="background:'+s.c+'">'+ic(s.ic)+'</span>'+s.t+'<small>'+(SECS.indexOf(s)+1)+'/'+SECS.length+'</small></button>'})()+'</div><div class="lbody" id="lbody"></div>';
 $("#lSec").onclick=function(){fillSheet();sheet(true)};
 var b=$("#lbody");v.classList.toggle("fit",cur.sec==="slides");
 ({slides:secSlides,film:secFilm,video:secVideo,terms:secTerms,sort:secSort,quiz:secQuiz,cards:secCards,task:secTask})[cur.sec](t,b);
 store("tb-lastsec",cur.sec)}

/* ===== slides ===== */
function cardsHTML(cards,n){var cols=["var(--sky)","var(--gold)","var(--violet)","var(--up)","var(--down)","#ff8a3d"];return '<div class="cardsN" style="--n:'+(n||Math.min(cards.length,cards.length===4?4:3))+'">'+cards.map(function(c,i){return '<div class="ic-card" style="animation-delay:'+(i*.08)+'s"><span class="ic" style="background:'+cols[i%cols.length]+'">'+ic(c[0])+'</span><b>'+c[1]+'</b><span>'+(c[2]||"")+'</span></div>'}).join("")+'</div>'}
function slideHTML(s,t){var h=(s.tag?'<div class="tag">'+s.tag+'</div>':'')+(s.h?'<h3>'+s.h+'</h3>':''),p=s.p?'<p style="margin-top:.8rem">'+s.p+'</p>':'';
 switch(s.k){
 case "def": return h+(s.items||[]).map(function(d){return '<div class="def"><b>'+d[0]+'</b> — '+d[1]+'</div>'}).join("")+(s.list?'<ul class="lst" style="margin-top:.6rem">'+s.list.map(function(x,i){return '<li style="animation-delay:'+(i*.06)+'s"><span>'+x+'</span></li>'}).join("")+'</ul>':"")+p;
 case "law": return h+'<div class="def" style="font-size:1.3rem">'+s.q+'</div><p class="law">'+(s.src||"")+'</p>'+p;
 case "list": return h+'<ul class="lst'+(s.num?" num":"")+'">'+s.items.map(function(x,i){return '<li style="animation-delay:'+(i*.06)+'s"><span>'+x+'</span></li>'}).join("")+'</ul>'+p;
 case "cards": return h+cardsHTML(s.cards,s.n)+p;
 case "vs": return h+'<div class="vs" style="grid-template-columns:repeat('+s.cols.length+',minmax(0,1fr))">'+s.cols.map(function(c){return '<div class="vs-col '+(c[1]||"sky")+'"><h4>'+c[0]+'</h4><ul>'+c[2].map(function(x){return '<li>'+x+'</li>'}).join("")+'</ul></div>'}).join("")+'</div>'+p;
 case "table": return h+'<div style="overflow-x:auto"><table class="cmpT"><thead><tr>'+s.head.map(function(x){return '<th>'+x+'</th>'}).join("")+'</tr></thead><tbody>'+s.rows.map(function(r){return '<tr>'+r.map(function(x){return '<td>'+x+'</td>'}).join("")+'</tr>'}).join("")+'</tbody></table></div>'+p;
 case "steps": return h+'<div class="steps-sl">'+s.steps.map(function(x,i){return '<div style="animation-delay:'+(i*.08)+'s"><p style="margin:0"><b>'+x[0]+'</b><span>'+(x[1]||"")+'</span></p></div>'}).join("")+'</div>'+p;
 case "fact": return (s.tag?'<div class="tag">'+s.tag+'</div>':'<div class="tag">'+(s.kind==="bilasizmi"?""+tr("BILASIZMI?")+"":""+tr("BU QIZIQ...")+"")+'</div>')+(s.h?'<h3>'+s.h+'</h3>':'')+'<div class="fact"><span class="fi">'+ic(s.kind==="bilasizmi"?"globe":"bulb")+'</span><div>'+s.text+'</div></div>'+p;
 case "big": if(s.big&&!s.num){s.num=s.big;if(!s.text){s.text=s.p;p=""}}return h+'<div style="display:flex;gap:2rem;align-items:center;flex-wrap:wrap"><div><div class="big-num">'+s.num+'</div><p style="font-size:1.3rem;font-weight:700;margin:.2rem 0">'+(s.unit||"")+'</p></div><div style="flex:1;min-width:14rem;font-size:1.15rem">'+(s.text||"")+'</div></div>'+p;
 case "review": return '<div class="tag">'+tr("BILIMINGIZNI SINAB KO‘RING")+'</div><h3>'+(s.h||""+tr("Takrorlash savollari")+"")+'</h3><div class="reveal-q">'+s.qa.map(function(q,i){return '<button class="rq">'+(i+1)+'. '+q[0]+' <span class="hint">'+tr("javob")+'</span><span class="a" hidden>'+q[1]+'</span></button>'}).join("")+'</div>';
 default: return h+(s.html||"")+p;}}
function coverSlide(t){var c=chOf(t.n),sc=(t.film||[])[0];
 return (sc?'<div class="cv-bg"><div class="scn">'+TBFilm.renderScene(sc)+'</div></div><div class="cv-shade"></div>':'')+'<div class="cv-fg"><div><div class="cv-k"><b>'+t.n+'</b>'+F.BOB(c.n)+' · '+F.MV(t.n)+'</div><h3>'+t.title+'</h3><p>'+tr("Bugun bilib olamiz:")+'</p><div class="chips">'+(t.learn||[]).map(function(x){return '<span class="chip">'+x+'</span>'}).join("")+'</div></div>'+
 (t.hook?'<div class="hook"><small>'+tr("Faollashtiruvchi savol")+'</small><div style="font-size:1.15rem;font-weight:600">'+t.hook.q+'</div><div class="reveal-q" style="margin-top:.8rem"><button class="rq">'+tr("Fikrlar va javob")+' <span class="hint">'+tr("bosing")+'</span><span class="a" hidden>'+t.hook.a+'</span></button></div></div>':'')+'</div>'}
/* mos slaydlarga mavzu multfilmidan sahna-rasm qo‘shish (uslubga qarab har xil) */
var ILL_OK={def:1,law:1,fact:1,big:1,list:1,steps:1,review:1};
function withIll(s,h,i,t){var film=t.film||[];if(!film.length||!ILL_OK[s.k]||!window.TBTheme)return h;
 var n=(s.items||s.steps||s.qa||[]).length;if((s.k==="list"&&n>5)||(s.k==="steps"&&n>4)||(s.k==="review"&&n>5)||(s.k==="def"&&(s.items||[]).length>2))return h;
 if(h.replace(/<[^>]+>/g,"").length>520)return h;
 var lay=TBTheme.of(t.n).lay;if((lay==="card"&&i%2)||(lay==="poster"&&!(i%2)))return h;
 var sc=film[(i+1)%film.length],rev=lay==="split"&&i%2===1;
 return '<div class="sl-split'+(rev?" rev":"")+'"><div class="sl-txt">'+h+'</div><figure class="sl-ill"><div class="scn">'+TBFilm.renderScene(sc)+'</div><figcaption>'+esc(sc.t)+'</figcaption></figure></div>'}
function fitSlide(sl){if(!sl)return;var sin=sl.querySelector(".sin")||sl.firstElementChild;sin.style.transform="";sin.style.width="";sin.style.flex="";var cs=getComputedStyle(sl),avail=sl.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);var need=sin.scrollHeight;if(need<=avail+1){sin.dataset.s="1";return}var sc=1;for(var k=0;k<3;k++){sc=Math.max(.45,Math.min(1,(avail-1)/sin.scrollHeight));sin.style.flex="none";sin.style.width=(100/sc)+"%";sin.style.transform="scale("+sc+")";if(sin.scrollHeight*sc<=avail+1)break}sin.dataset.s=sc}
function secSlides(t,b){var S=[coverSlide(t)].concat((t.slides||[]).map(function(s,i){return withIll(s,slideHTML(s,t),i,t)}));var idx=0;
 b.innerHTML='<div class="deck"><div class="slide-area" id="slideArea"><div class="wm" aria-hidden="true">'+pad(t.n)+'</div>'+S.map(function(h,i){return '<article class="slide'+(i===0?" cvr":"")+'" data-i="'+i+'"><div class="sin">'+h+'</div></article>'}).join("")+'</div><div class="deck-bar"><button class="arrow" id="sPrev" aria-label="'+tr("Oldingi slayd")+'"><svg class="i" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><div class="dots" id="sDots">'+S.map(function(_,i){return '<button aria-label="'+F.slayd(i+1)+'" data-s="'+i+'"></button>'}).join("")+'</div><span class="count" id="sCount"></span><button class="arrow gold" id="sNext" aria-label="'+tr("Keyingi slayd")+'"><svg class="i" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div></div>';
 $$(".slide.cvr",b).forEach(function(cv){var sin=$(".sin",cv);["cv-bg","cv-shade"].forEach(function(c){var e=$("."+c,sin);if(e)cv.insertBefore(e,sin)})});
 function show(i){idx=Math.max(0,Math.min(S.length-1,i));$$(".slide",b).forEach(function(s,k){s.classList.toggle("on",k===idx);s.classList.toggle("prev",k<idx);if(k===idx){$$(".ic-card,.lst li,.steps-sl div,.sl-ill,.cv-fg .chip",s).forEach(function(c){c.style.animation="none";c.offsetHeight;c.style.animation=""});$$(".scn",s).forEach(function(z){z.innerHTML=z.innerHTML})}});$$("#sDots button",b).forEach(function(d,k){d.className=k===idx?"on":(k<idx?"seen":"")});$("#sCount").textContent=(idx+1)+" / "+S.length;fitSlide($(".slide.on",b));clearTimeout(show._t);show._t=setTimeout(function(){fitSlide($(".slide.on",b))},900)}
 $("#sPrev").onclick=function(){if(idx===0)return stepNav(-1);show(idx-1)};$("#sNext").onclick=function(){if(idx===S.length-1)return nav("t"+pad(t.n)+"-film");show(idx+1)};
 $("#sDots").onclick=function(e){var x=e.target.closest("[data-s]");if(x)show(+x.dataset.s)};
 $("#slideArea").addEventListener("click",function(e){var q=e.target.closest(".rq");if(q){var a=$(".a",q);a.hidden=!a.hidden;if(!a.hidden)sTick();fitSlide(q.closest(".slide"))}});
 (function(){var x0=null,y0=0,el=$("#slideArea");el.addEventListener("pointerdown",function(e){x0=e.clientX;y0=e.clientY});el.addEventListener("pointerup",function(e){if(x0===null)return;var dx=e.clientX-x0,dy=e.clientY-y0;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)show(idx+(dx<0?1:-1));x0=null})})();
 var rs=function(){fitSlide($(".slide.on",b));clearTimeout(show._t);show._t=setTimeout(function(){fitSlide($(".slide.on",b))},900)};addEventListener("resize",rs);lessonCleanup.push(function(){removeEventListener("resize",rs)});
 L.key=function(e){if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" "){e.preventDefault();show(idx+1)}if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();show(idx-1)}};
 setTimeout(function(){show(0)},20)}

/* ===== film ===== */
function secFilm(t,b){var SC=[TBFilm.titleScene(t)].concat(t.film||[]);SC.forEach(function(s){s.d=s.d||10});
 var TOTAL=SC.reduce(function(a,s){return a+s.d},0);
 b.innerHTML='<div class="player"><div class="film" id="filmBox"><div class="stage" id="stage"><div class="scn-layer" id="sceneLayer"></div><div class="chap" id="chap"></div><div class="subs" id="subs" hidden></div><button class="big-play" id="bigPlay" aria-label="'+tr("Multfilmni boshlash")+'"><span class="bp-ic"><svg viewBox="0 0 24 24"><path d="M7 4l12 8-12 8z" fill="currentColor"/></svg></span><b>'+esc(t.title)+'</b><small>'+SC.length+''+tr(" sahna · taxminan ")+''+Math.max(1,Math.round(TOTAL/60))+''+tr(" daqiqa · musiqa bilan")+'</small></button></div><div class="pbar" id="pbar">'+SC.map(function(s,i){return '<div class="seg" data-v="'+i+'" style="flex:'+s.d+'" title="'+esc(s.t)+'"><i></i></div>'}).join("")+'</div><div class="ctrls"><button class="btn" id="vPrev" aria-label="'+tr("Oldingi sahna")+'"><svg class="i" viewBox="0 0 24 24"><path d="M6 5v14M18 5l-9 7 9 7z"/></svg></button><button class="btn gold" id="vPlay"><svg class="i" viewBox="0 0 24 24" id="vPlayIc"><path d="M7 4l12 8-12 8z"/></svg><span id="vPlayT">'+tr("Boshlash")+'</span></button><button class="btn" id="vNext" aria-label="'+tr("Keyingi sahna")+'"><svg class="i" viewBox="0 0 24 24"><path d="M18 5v14M6 5l9 7-9 7z"/></svg></button><button class="btn" id="vRestart">'+tr("Boshidan")+'</button><button class="btn" id="vMusic"></button><span class="sp"></span><span class="vtime" id="vTime">0:00</span></div></div></div>';
 var V={i:0,t:0,on:false,last:0,started:false,sub:-1,fired:{}},musicOn=store("tb-music")!=="0",alive=true;
 function mmss(s){s=Math.floor(s);return Math.floor(s/60)+":"+pad(s%60)}
 function render(){var sc=SC[V.i],Lr=$("#sceneLayer");if(!Lr)return;while(Lr.children.length>1)Lr.removeChild(Lr.firstChild);var old=Lr.firstElementChild,nd=document.createElement("div");nd.className="scn enter";nd.innerHTML=TBFilm.renderScene(sc);var sv=nd.firstElementChild;if(sv)sv.style.animationDuration=sc.d+"s";Lr.appendChild(nd);
  if(old){old.className="scn leave";setTimeout(function(){if(old.parentNode)old.parentNode.removeChild(old)},650)}V.sub=-1;V.fired={};$("#chap").textContent=(V.i+1)+"/"+SC.length+" · "+sc.t;$("#stage").classList.toggle("paused",!V.on);tick()}
 function tick(){var sc=SC[V.i],ts=V.t/1000,subs=sc.s||[],idx=-1,times=sc.st||subs.map(function(_,k){return k*(sc.d/Math.max(1,subs.length))});times.forEach(function(x,k){if(ts>=x)idx=k});
  if(idx!==V.sub){V.sub=idx;var el=$("#subs");if(idx<0)el.hidden=true;else{el.hidden=false;el.textContent=subs[idx];el.classList.remove("in");void el.offsetWidth;el.classList.add("in")}}
  var Lr=$("#sceneLayer").lastElementChild;if(Lr)$$("[data-cnt]",Lr).forEach(function(e){var a=+e.dataset.a,bb=+e.dataset.b,k=Math.max(0,Math.min(1,(ts-a)/(bb-a)));k=1-Math.pow(1-k,3);e.textContent=(e.dataset.pre||"")+fmt(+e.dataset.cnt*k)+(e.dataset.suf||"")});
  if(V.on&&!V.fired.a&&ts>.15){V.fired.a=1;tone(620,.09,"triangle",0,.14)}
  bar()}
 function bar(){var el=0;for(var k=0;k<V.i;k++)el+=SC[k].d;el+=V.t/1000;$$("#pbar .seg i").forEach(function(e,k){e.style.width=(k<V.i?100:k>V.i?0:Math.min(100,V.t/(SC[k].d*10)))+"%"});$("#vTime").textContent=mmss(el)+" / "+mmss(TOTAL)}
 function setBtn(){$("#vPlayT").textContent=V.on?""+tr("Pauza")+"":(V.started?""+tr("Davom etish")+"":""+tr("Boshlash")+"");$("#vPlayIc").innerHTML=V.on?'<path d="M8 5v14M16 5v14"/>':'<path d="M7 4l12 8-12 8z"/>'}
 function loop(ts){if(!V.on||!alive)return;var dt=ts-V.last;V.last=ts;V.t+=Math.min(dt,100);var D=SC[V.i].d*1000;if(V.t>=D){if(V.i<SC.length-1){V.i++;V.t=0;render()}else{V.t=D;V.on=false;tick();setBtn();$("#stage").classList.add("paused");confetti();return}}tick();requestAnimationFrame(loop)}
 function play(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume()}catch(e){}if(V.i===SC.length-1&&V.t>=SC[V.i].d*1000){V.i=0;V.t=0;V.on=true;render()}if(!V.started){V.started=true;$("#bigPlay").hidden=true;V.t=0;V.on=true;render()}V.on=true;$("#stage").classList.remove("paused");V.last=performance.now();setBtn();requestAnimationFrame(loop)}
 function pause(){if(!V.on)return;V.on=false;var st=$("#stage");if(st)st.classList.add("paused");setBtn()}
 function jump(i){V.i=Math.max(0,Math.min(SC.length-1,i));V.t=0;if(!V.started){V.started=true;$("#bigPlay").hidden=true}render();V.last=performance.now()}
 $("#vPlay").onclick=function(){V.on?pause():play()};$("#bigPlay").onclick=play;$("#vPrev").onclick=function(){jump(V.i-1)};$("#vNext").onclick=function(){jump(V.i+1)};$("#vRestart").onclick=function(){jump(0);if(!V.on)play()};
 $("#pbar").onclick=function(e){var s=e.target.closest("[data-v]");if(s)jump(+s.dataset.v)};
 function musBtn(){$("#vMusic").textContent=musicOn?""+tr("Musiqa: yoniq")+"":""+tr("Musiqa: o‘chiq")+"";$("#vMusic").classList.toggle("ghost",!musicOn)}
 $("#vMusic").onclick=function(){musicOn=!musicOn;store("tb-music",musicOn?"1":"0");musBtn()};musBtn();
 var MEL=[7,null,4,null,9,7,4,null,2,null,4,7,4,2,0,null],BASS=[0,-5,-3,-8],st=0,mi=setInterval(function(){if(!V.on||muted||!musicOn)return;var n=MEL[st%MEL.length];if(n!==null)tone(392*Math.pow(2,n/12),.25,"triangle",0,.045);if(st%4===0)tone(98*Math.pow(2,BASS[(st/4|0)%BASS.length]/12),.7,"sine",0,.08);st++},270);
 function fit(){var s=$("#stage");if(s&&s.clientWidth)s.style.fontSize=(s.clientWidth/44)+"px"}var ro=window.ResizeObserver?new ResizeObserver(fit):null;if(ro)ro.observe($("#stage"));fit();
 lessonCleanup.push(function(){alive=false;V.on=false;clearInterval(mi);if(ro)ro.disconnect()});
 L.key=function(e){if(e.key===" "){e.preventDefault();V.on?pause():play()}if(e.key==="ArrowRight")jump(V.i+1);if(e.key==="ArrowLeft")jump(V.i-1)};
 render();setBtn()}

/* ===== video ===== */
function ytId(u){if(!u)return null;u=String(u);var m=/(?:youtube\.com\/(?:embed\/|watch\?v=|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/.exec(u);if(m)return m[1];if(/^[\w-]{11}$/.test(u.trim()))return u.trim();return null}
TB.ytId=ytId;
function secVideo(t,b){var key="t"+pad(t.n),raw=TB.videos[key]||t.video||"",id=ytId(raw);
 b.innerHTML='<div class="player">'+(id?'<div class="yt-frame"><iframe src="https://www.youtube.com/embed/'+id+'?rel=0" title="'+esc(t.title)+''+tr(" — video dars")+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><p class="yt-note">'+tr("Video ochilmasa: ")+'<a href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener">'+tr("YouTube’da ochish ↗")+'</a></p>':
 '<div class="vph">'+ic("video")+'<b>'+tr("Bu mavzuga video hali qo‘shilmagan")+'</b><span>'+tr("Video qo‘shilishi uchun administratorga murojaat qiling.")+'</span></div>')+'</div>'}

/* ===== terms ===== */
function secTerms(t,b){var T=t.terms||[];b.innerHTML='<div class="wrap" style="width:100%"><div class="vh"><div><div class="eyebrow">'+tr("Lug‘at · ")+''+T.length+''+tr(" ta atama")+'</div><h2>'+tr("Tushunchalar kartalari")+'</h2><p>'+tr("O‘quvchi atamaning ma’nosini aytadi, keyin kartani bosib tekshiradi.")+'</p></div><button class="btn" id="flipAll">'+tr("Hammasini aylantirish")+'</button></div><div class="fgrid" id="fgrid">'+T.map(function(x,i){return '<button class="flip" aria-label="'+esc(x[0])+'"><div class="inner"><div class="f"><span class="n">'+pad(i+1)+'</span><b>'+x[0]+'</b><small>'+tr("Bosing va tekshiring")+'</small></div><div class="b"><b>'+x[0]+'</b>'+x[1]+'</div></div></button>'}).join("")+'</div></div>';
 $("#fgrid").onclick=function(e){var f=e.target.closest(".flip");if(f){f.classList.toggle("on");tone(500,.06,"triangle")}};
 var allOn=false;$("#flipAll").onclick=function(){allOn=!allOn;$$(".flip",b).forEach(function(f,i){setTimeout(function(){f.classList.toggle("on",allOn)},i*70)})}}

/* ===== sort ===== */
function secSort(t,b){var R=t.sorts||[];if(!R.length){b.innerHTML='<p>'+tr("Bu mavzu uchun saralash o‘yini yo‘q.")+'</p>';return}
 b.innerHTML='<div class="wrap" style="width:100%"><div class="vh"><div><div class="eyebrow">'+tr("O‘yin")+'</div><h2>'+tr("Qaysi tomonga?")+'</h2><p>'+tr("Gapni o‘qing va to‘g‘ri tomonni bosing. Butun sinf birga javob beradi.")+'</p></div><div class="seg-tabs" id="sortTabs">'+R.map(function(r,i){return '<button data-k="'+i+'">'+r.t+'</button>'}).join("")+'</div></div><div class="sorter"><button class="bucket L" id="bL"><svg class="i" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><span id="bLt"></span><span class="cnt" id="bLc">0</span></button><div class="sitem" id="sItem"><div class="prog" id="sProg"></div><div class="txt" id="sTxt"></div><div class="fb" id="sFb"></div></div><button class="bucket R" id="bR"><svg class="i" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg><span id="bRt"></span><span class="cnt" id="bRc">0</span></button></div><div class="scorebar"><span class="chip">'+tr("To‘g‘ri: ")+'<b id="sOk">0</b></span><span class="chip">'+tr("Xato: ")+'<b id="sNo">0</b></span><span class="chip">'+tr("Seriya: ")+'<b id="sStreak">0</b></span><button class="btn" id="sRestart">'+tr("Qaytadan")+'</button></div></div>';
 var S={k:0,list:[],i:0,ok:0,no:0,st:0,cL:0,cR:0,lock:false},tm=null;
 function start(k){S.k=k;S.list=shuffle(R[k].items);S.i=0;S.ok=S.no=S.st=S.cL=S.cR=0;S.lock=false;$$("#sortTabs button").forEach(function(x){x.classList.toggle("on",+x.dataset.k===k)});$("#bLt").textContent=R[k].L;$("#bRt").textContent=R[k].R;show()}
 function show(){var it=$("#sItem");if(!it)return;it.className="sitem";$("#sOk").textContent=S.ok;$("#sNo").textContent=S.no;$("#sStreak").textContent=S.st;$("#bLc").textContent=S.cL+""+tr(" ta")+"";$("#bRc").textContent=S.cR+""+tr(" ta")+"";
  if(S.i>=S.list.length){$("#sProg").textContent=""+tr("Tugadi!")+"";$("#sTxt").innerHTML=S.ok+" / "+S.list.length+'<br><span style="font-size:.7em;color:var(--muted)">'+(S.ok===S.list.length?""+tr("Ajoyib! Hammasi to‘g‘ri!")+"":""+tr("Yaxshi! Yana bir marta urinib ko‘ring")+"")+'</span>';$("#sFb").textContent="";if(S.ok===S.list.length)confetti();return}
  $("#sProg").textContent=(S.i+1)+" / "+S.list.length;$("#sTxt").textContent=S.list[S.i][0];$("#sFb").textContent="";void it.offsetWidth;it.classList.add("in")}
 function ans(side){if(S.lock||S.i>=S.list.length)return;var it=S.list[S.i],ok=it[1]===side,bb=$(side==="L"?"#bL":"#bR"),box=$("#sItem");S.lock=true;
  if(ok){S.ok++;S.st++;if(side==="L")S.cL++;else S.cR++;sOk();box.className="sitem ok";$("#sFb").innerHTML='<span class="u">'+tr("To‘g‘ri!")+'</span> '+(it[2]||"");bb.classList.add("flash-ok")}
  else{S.no++;S.st=0;sNo();box.className="sitem no";$("#sFb").innerHTML='<span class="d">'+tr("Xato.")+'</span> '+tr("To‘g‘ri javob: ")+'<b>'+R[S.k][it[1]]+'</b>. '+(it[2]||"");bb.classList.add("flash-no")}
  $("#sOk").textContent=S.ok;$("#sNo").textContent=S.no;$("#sStreak").textContent=S.st;
  tm=setTimeout(function(){bb.classList.remove("flash-ok","flash-no");S.i++;S.lock=false;show()},ok?1500:2800)}
 $("#sortTabs").onclick=function(e){var x=e.target.closest("[data-k]");if(x)start(+x.dataset.k)};
 $("#bL").onclick=function(){ans("L")};$("#bR").onclick=function(){ans("R")};$("#sRestart").onclick=function(){start(S.k)};
 lessonCleanup.push(function(){clearTimeout(tm)});L.key=function(e){if(e.key==="ArrowLeft")ans("L");if(e.key==="ArrowRight")ans("R")};start(0)}

/* ===== quiz ===== */
var QZ={a:""+tr("Startapchilar")+"",b:""+tr("Investorlar")+""};try{var qn=JSON.parse(store("tb-teams")||"null");if(qn){QZ.a=qn.a||QZ.a;QZ.b=qn.b||QZ.b}}catch(e){}
function secQuiz(t,b){var QS=t.quiz||[],Q={n:10,list:[],i:0,turn:0,pts:[0,0],ll:[true,true],timer:null,sec:20,done:false,secMax:20};
 b.innerHTML='<div class="wrap" style="width:100%" id="quizRoot"></div>';var root=$("#quizRoot");
 lessonCleanup.push(function(){clearInterval(Q.timer)});
 function setup(){clearInterval(Q.timer);var opts=[6,10,15].filter(function(x){return x<=QS.length});if(!opts.length)opts=[QS.length];
  root.innerHTML='<div class="vh"><div><div class="eyebrow">'+tr("Viktorina · ")+''+QS.length+''+tr(" ta savol")+'</div><h2>'+tr("Jamoa jangi")+'</h2><p>'+tr("Sinfni ikki jamoaga bo‘ling. Navbat bilan javob berasiz: har bir to‘g‘ri javob 10 ball, tez javob uchun bonus. Har jamoada bitta «50/50» yordami bor.")+'</p></div></div><div class="setup"><div class="row2"><div class="field"><label for="qa">'+tr("1-jamoa nomi")+'</label><input id="qa" value="'+esc(QZ.a)+'"></div><div class="field"><label for="qb">'+tr("2-jamoa nomi")+'</label><input id="qb" value="'+esc(QZ.b)+'"></div></div><div class="row2"><div class="field"><label for="qnn">'+tr("Savollar soni")+'</label><select id="qnn">'+opts.map(function(x,i){return '<option'+(i===Math.min(1,opts.length-1)?" selected":"")+'>'+x+'</option>'}).join("")+'</select></div><div class="field"><label for="qsec">'+tr("Har savolga vaqt")+'</label><select id="qsec"><option value="15">'+tr("15 soniya")+'</option><option value="20" selected>'+tr("20 soniya")+'</option><option value="30">'+tr("30 soniya")+'</option><option value="45">'+tr("45 soniya")+'</option></select></div></div><button class="btn gold" id="qGo" style="font-size:1.15rem;min-height:3.6rem">'+ic("trophy")+' '+tr("Jangni boshlash")+'</button></div>';
  $("#qGo").onclick=function(){QZ.a=$("#qa").value.trim()||""+tr("Startapchilar")+"";QZ.b=$("#qb").value.trim()||""+tr("Investorlar")+"";store("tb-teams",JSON.stringify(QZ));Q.n=+$("#qnn").value;Q.secMax=+$("#qsec").value;Q.list=shuffle(QS).slice(0,Q.n);Q.i=0;Q.turn=0;Q.pts=[0,0];Q.ll=[true,true];show()}}
 function team(k){var nm=k?QZ.b:QZ.a;return '<div class="team '+(k?"bear":"bull")+(Q.turn===k?" turn":"")+'"><span class="av">'+ic(k?"money":"rocket")+'</span><span class="nm"><small>'+(Q.turn===k?""+tr("Navbat")+"":"")+'</small>'+esc(nm)+'</span><button class="ll" data-ll="'+k+'" '+(Q.ll[k]&&Q.turn===k?"":"disabled")+'>50/50</button><span class="pts">'+Q.pts[k]+'</span></div>'}
 function show(){clearInterval(Q.timer);if(Q.i>=Q.list.length)return end();var q=Q.list[Q.i],opts=shuffle(q[1].map(function(x,i){return{t:x,ok:i===0}}));Q.cur=opts;Q.done=false;Q.sec=Q.secMax;
  root.innerHTML='<div class="teams">'+team(0)+'<span class="vsmark">VS</span>'+team(1)+'</div><div class="qbox"><div class="qhead"><span class="chip">'+F.savol(Q.i+1,Q.list.length)+'</span><div class="qtimer" id="qt"><i></i></div><span class="qsec" id="qs">'+Q.sec+'</span></div><div class="qtext">'+q[0]+'</div><div class="opts">'+opts.map(function(o,i){return '<button class="opt" data-o="'+i+'"><span class="L">'+"ABCD"[i]+'</span><span>'+o.t+'</span></button>'}).join("")+'</div><div class="qfoot"><span class="qmsg" id="qm"></span><button class="btn gold" id="qNext" hidden>'+tr("Keyingi savol")+'</button></div></div>';
  $$(".opt",root).forEach(function(x){x.onclick=function(){answer(+x.dataset.o)}});
  var llb=$('.ll[data-ll="'+Q.turn+'"]',root);if(llb)llb.onclick=function(){if(Q.done||!Q.ll[Q.turn])return;Q.ll[Q.turn]=false;llb.disabled=true;var wrong=[];Q.cur.forEach(function(o,i){if(!o.ok)wrong.push(i)});shuffle(wrong).slice(0,2).forEach(function(i){$('.opt[data-o="'+i+'"]',root).classList.add("gone")});tone(400,.15,"triangle")};
  $("#qNext").onclick=function(){Q.i++;Q.turn=1-Q.turn;show()};
  var max=Q.sec;Q.timer=setInterval(function(){Q.sec--;var qs=$("#qs");if(!qs){clearInterval(Q.timer);return}qs.textContent=Q.sec;$("#qt i").style.width=(Q.sec/max*100)+"%";$("#qt").classList.toggle("low",Q.sec<=5);if(Q.sec<=5&&Q.sec>0)sTick();if(Q.sec<=0)answer(-1)},1000)}
 function answer(k){if(Q.done)return;Q.done=true;clearInterval(Q.timer);var ok=k>=0&&Q.cur[k].ok;$$(".opt",root).forEach(function(x,i){x.disabled=true;if(Q.cur[i].ok)x.classList.add("right");else if(i===k)x.classList.add("wrong")});
  var m=$("#qm");if(ok){var bonus=Q.sec>=Q.secMax/2?5:0;Q.pts[Q.turn]+=10+bonus;sOk();m.className="qmsg ok";m.textContent=""+tr("To‘g‘ri! +")+""+(10+bonus)+""+tr(" ball")+""+(bonus?""+tr(" (tezlik bonusi)")+"":"")+" — "+(Q.turn?QZ.b:QZ.a)}else{sNo();m.className="qmsg no";m.textContent=k<0?""+tr("Vaqt tugadi!")+"":""+tr("Afsus, xato.")+""}
  $$(".team .pts",root).forEach(function(p,i){p.textContent=Q.pts[i]});$("#qNext").hidden=false;$("#qNext").textContent=Q.i+1>=Q.list.length?""+tr("Natijalarni ko‘rish")+"":""+tr("Keyingi savol")+""}
 function end(){var w=Q.pts[0]===Q.pts[1]?-1:(Q.pts[0]>Q.pts[1]?0:1);root.innerHTML='<div class="teams">'+team(0).replace(" turn","")+'<span class="vsmark">VS</span>'+team(1).replace(" turn","")+'</div><div class="qbox winner"><div class="eyebrow">'+tr("Jang yakunlandi")+'</div><div class="big-num" style="margin:.6rem 0">'+(w<0?""+tr("Durang!")+"":esc(w?QZ.b:QZ.a)+""+tr(" g‘olib!")+"")+'</div><p style="font-size:1.2rem">'+Q.pts[0]+' : '+Q.pts[1]+'</p><div class="center-row"><button class="btn gold" id="qAgain">'+tr("Yana o‘ynash")+'</button></div></div>';$("#qAgain").onclick=setup;confetti();sEnd()}
 setup()}

/* ===== Q&A cards ===== */
/* Har mavzuda 30 ta karta: asosiy kartalar + qo‘shimchalar + lug‘at + takrorlash + viktorina */
function cardsOf(t){if(t._c30)return t._c30;var out=[],keys=[];
 function strip(x){return String(x).replace(/<[^>]+>/g,"")}
 function norm(x){return strip(x).toLowerCase().replace(/[«»"“”‘’'`.,:;!?()\-—–]/g," ").replace(/\s+/g," ").trim()}
 function push(q,a){if(out.length>=30||!q||!a)return;var k=norm(q);if(!k||keys.indexOf(k)>=0)return;keys.push(k);out.push([q,a])}
 (t.cards||[]).forEach(function(c){push(c[0],c[1])});
 var EX=window.TB_EXTRA_CARDS||{};((EX[t.lang==="ru"?"ru":"uz"]||{})[t.n]||[]).forEach(function(c){push(c[0],c[1])});
 var qtext=out.map(function(c){return norm(c[0])}).join(" | ");
 (t.terms||[]).forEach(function(x){var nm=norm(x[0]);if(nm&&qtext.indexOf(nm)>=0)return;push(t.lang==="ru"?"Что такое «"+x[0]+"»?":"«"+x[0]+"» nima?",x[1])});
 var rv=[];(t.slides||[]).forEach(function(s){if(s.k==="review")rv=rv.concat(s.qa||[])});
 var qz=(t.quiz||[]).filter(function(q){return !/ emas\b|emas:|emas\?|не является|не относится|не входит|кроме|не метод|не функция/i.test(q[0])}).map(function(q){return [q[0],q[1][0]]});
 for(var i=0;out.length<30&&(i<qz.length||i<rv.length);i++){if(i<rv.length)push(rv[i][0],rv[i][1]);if(i<qz.length)push(qz[i][0],qz[i][1])}
 if(t.hook)push(t.hook.q,t.hook.a);
 t._c30=out;return out}
function secCards(t,b){var KQ=cardsOf(t),K={st:{},cur:0,swap:null};
 b.innerHTML='<div class="wrap" style="width:100%"><div class="vh"><div><div class="eyebrow">'+KQ.length+''+tr(" ta savol-javob")+'</div><h2>'+tr("Savol-javob kartochkalari")+'</h2><p>'+tr("Raqamni tanlang. O‘quvchi savolga javob beradi, keyin kartani bosib to‘g‘ri javobni tekshiramiz.")+'</p></div><div class="kstats"><span class="chip ok">'+tr("Bildi: ")+'<b id="kOk">0</b></span><span class="chip no">'+tr("Bilmadi: ")+'<b id="kNo">0</b></span><span class="chip">'+tr("Qoldi: ")+'<b id="kLeft">'+KQ.length+'</b></span><button class="btn gold" id="kRand">'+tr("Tasodifiy karta")+'</button><button class="btn ghost" id="kReset">'+tr("Qaytadan")+'</button></div></div><div class="qgrid" id="qgrid"></div></div>';
 function grid(){$("#qgrid").innerHTML=KQ.map(function(k,i){var s=K.st[i];return '<button class="qn'+(s?" "+s:"")+'" data-k="'+i+'" aria-label="'+(i+1)+'">'+(i+1)+'<small>'+(s==="ok"?""+tr("✓ bildi")+"":s==="no"?""+tr("✗ bilmadi")+"":""+tr("savol")+"")+'</small></button>'}).join("");var ok=0,no=0;for(var i in K.st){if(K.st[i]==="ok")ok++;else no++}$("#kOk").textContent=ok;$("#kNo").textContent=no;$("#kLeft").textContent=KQ.length-ok-no}
 function open(i){K.cur=(i+KQ.length)%KQ.length;var k=KQ[K.cur],fl=$("#kFlip"),was=fl.classList.contains("on");fl.classList.remove("on");$("#kNum").textContent=F.savol(K.cur+1,KQ.length);$("#kTopic").textContent=F.mv(t.n);$("#kQ").innerHTML=k[0];clearTimeout(K.swap);if(was)K.swap=setTimeout(function(){$("#kA").innerHTML=k[1]},380);else $("#kA").innerHTML=k[1];var s=K.st[K.cur];$("#kState").textContent=s==="ok"?""+tr("✓ Avval to‘g‘ri javob berilgan")+"":s==="no"?""+tr("✗ Avval javob topilmagan")+"":"";$("#mCard").hidden=false;tone(520,.07,"triangle")}
 function mark(v){K.st[K.cur]=v;if(v==="ok")sOk();else sNo();grid();var tt=$('#qgrid [data-k="'+K.cur+'"]');if(tt)tt.classList.add("just");var left=KQ.length-Object.keys(K.st).length;setTimeout(function(){$("#mCard").hidden=true;if(!left)confetti()},650)}
 $("#qgrid").onclick=function(e){var x=e.target.closest("[data-k]");if(x)open(+x.dataset.k)};
 $("#kFlip").onclick=function(){$("#kFlip").classList.toggle("on");tone(680,.08,"triangle")};
 $("#kOkB").onclick=function(){mark("ok")};$("#kNoB").onclick=function(){mark("no")};$("#kPrev").onclick=function(){open(K.cur-1)};$("#kNext").onclick=function(){open(K.cur+1)};
 $("#kRand").onclick=function(){var pool=[];KQ.forEach(function(_,i){if(!K.st[i])pool.push(i)});if(!pool.length)pool=KQ.map(function(_,i){return i});var tiles=$$("#qgrid .qn"),n=0,steps=14,pick=pool[Math.floor(Math.random()*pool.length)];
  (function spin(){tiles.forEach(function(x){x.classList.remove("hl")});var r=n<steps-1?pool[Math.floor(Math.random()*pool.length)]:pick;tiles[r].classList.add("hl");tone(300+n*35,.04,"square");n++;if(n<steps)setTimeout(spin,50+n*n*1.4);else setTimeout(function(){tiles[r].classList.remove("hl");open(r)},420)})()};
 $("#kReset").onclick=function(){K.st={};grid()};
 L.cardKey=function(e){if(e.key===" "||e.key==="Enter"){e.preventDefault();$("#kFlip").click()}if(e.key==="ArrowRight")open(K.cur+1);if(e.key==="ArrowLeft")open(K.cur-1);if(e.key==="Escape")$("#mCard").hidden=true};
 lessonCleanup.push(function(){$("#mCard").hidden=true;L.cardKey=null});grid()}

/* ===== practical tasks ===== */
function secTask(t,b){var TS=t.tasks||[];
 b.innerHTML='<div class="wrap" style="width:100%"><div class="vh"><div><div class="eyebrow">'+tr("Mavzu yuzasidan amaliy topshiriq")+'</div><h2>'+tr("Amaliy topshiriqlar")+'</h2><p>'+tr("Avval sinf bilan muhokama qiling, keyin yechimni qadamma-qadam oching.")+'</p></div></div><div class="tlist">'+TS.map(function(x,i){return '<div class="tcard" data-ti="'+i+'"><h3><span>'+F.topsh(i+1)+'</span>'+(x.t||"")+'</h3><div class="tq">'+x.q+'</div><div class="steps" data-steps></div><div class="center-row" style="margin-top:1rem;justify-content:flex-start"><button class="btn gold" data-step>'+((x.steps||[]).length?""+tr("Yechimni boshlash")+"":""+tr("Javobni ko‘rsatish")+"")+'</button><button class="btn ghost" data-reset>'+tr("Qaytadan")+'</button></div><div data-ans></div></div>'}).join("")+'</div></div>';
 $$(".tcard",b).forEach(function(card){var x=TS[+card.dataset.ti],k=0,steps=x.steps||[],sb=$("[data-step]",card);
  if(x.type==="yesno"){var box=$("[data-steps]",card),ans={};box.innerHTML='<div class="yn">'+x.items.map(function(q,i){return '<div class="yn-r"><span class="yn-n">'+(i+1)+'</span><span class="yn-q">'+q+'</span><span class="yn-b"><button data-yn="'+i+'" data-v="1">'+tr("Ha")+'</button><button data-yn="'+i+'" data-v="0">'+tr("Yo‘q")+'</button></span></div>'}).join("")+'</div>';
   box.onclick=function(e){var bt=e.target.closest("[data-yn]");if(!bt)return;ans[bt.dataset.yn]=+bt.dataset.v;$$('[data-yn="'+bt.dataset.yn+'"]',box).forEach(function(z){z.classList.toggle("on",z===bt)});tone(560,.05,"triangle");sb.textContent=""+tr("Natijani ko‘rish (")+""+Object.keys(ans).length+"/"+x.items.length+")"};
   sb.textContent=""+tr("Natijani ko‘rish (")+"0/"+x.items.length+")";
   sb.onclick=function(){var sc=0;for(var i in ans)sc+=ans[i];var r=x.results.filter(function(z){return sc>=z[0]})[0]||x.results[x.results.length-1];$("[data-ans]",card).innerHTML='<div class="answer"><b>'+sc+''+tr(" ball.")+'</b> '+r[1]+'</div>';sOk();if(sc>=x.results[0][0])confetti()};
   $("[data-reset]",card).onclick=function(){ans={};$$("[data-yn]",box).forEach(function(z){z.classList.remove("on")});$("[data-ans]",card).innerHTML="";sb.textContent=""+tr("Natijani ko‘rish (")+"0/"+x.items.length+")"};return}
  sb.onclick=function(){if(k<steps.length){$("[data-steps]",card).insertAdjacentHTML("beforeend",'<div class="step"><span class="k">'+(k+1)+'</span><div class="m"><em>'+steps[k][0]+'</em>'+steps[k][1]+'</div></div>');k++;sTick();if(k===steps.length)sb.textContent=x.answer?""+tr("Javobni ko‘rsatish")+"":""+tr("Tugadi")+"";return}
   if(x.answer&&!$("[data-ans]",card).innerHTML){$("[data-ans]",card).innerHTML='<div class="answer">'+x.answer+'</div>'+(x.note?'<p class="note">'+x.note+'</p>':'');sOk();sb.hidden=true}};
  $("[data-reset]",card).onclick=function(){k=0;$("[data-steps]",card).innerHTML="";$("[data-ans]",card).innerHTML="";sb.hidden=false;sb.textContent=steps.length?""+tr("Yechimni boshlash")+"":""+tr("Javobni ko‘rsatish")+""}})}

/* ---------- keyboard ---------- */
document.addEventListener("keydown",function(e){if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
 if(!$("#mCard")||!$("#mCard").hidden){if(L.cardKey)L.cardKey(e);return}
 if(e.key==="Escape"){$$(".modal").forEach(function(m){m.hidden=true});sheet(false);closeBook()}
 if(cur.view==="lesson"&&L.key)L.key(e)});

/* ---------- boot ---------- */
var booted=false;
TB.start=function(user){TB.user=user;if(booted)return;booted=true;
 ["gLoading","gLogin","gDenied","gSetup"].forEach(function(id){var g=$("#"+id);if(g)g.hidden=true});
 $("#app").hidden=false;$("#fab").hidden=false;$("#dock").hidden=false;
 if(user.demo){var d=document.createElement("div");d.className="demo-banner";d.textContent=""+tr("DEMO rejim · server ulanmagan")+"";document.body.appendChild(d)}
 buildOverlays();ticker();setupTools();setupFab();setupDock();
 var go=function(){addEventListener("hashchange",route);route()};
 if(window.TBAuth&&TBAuth.getVideos)TBAuth.getVideos().then(function(v){TB.videos=v||{}}).catch(function(){}).then(go);else go()};
if(TBL.applyStatic)TBL.applyStatic();
TB.gate=function(which,info){["gLoading","gLogin","gDenied","gSetup"].forEach(function(id){var g=$("#"+id);if(g)g.hidden=id!==which});if(which==="gDenied")$("#deniedEmail").textContent=info||"";if(which==="gLogin")$("#loginErr").textContent=info||""};
})();
