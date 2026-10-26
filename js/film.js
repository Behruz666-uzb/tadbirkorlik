/* =========================================================
   FILM — prop library + scene DSL for per-topic cartoons
   Scene: {t:"title", bg:"day|field|office|gold|night", d:10, s:["sub 1","sub 2"], a:[acts]}
   Act:   ["type", ...args, {opts}]   opts.d = delay (s)
   ========================================================= */
(function(){
"use strict";
var F={};
var DEFS='<defs><linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ec1f5"/><stop offset="1" stop-color="#dff3ff"/></linearGradient><linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe49a"/><stop offset=".6" stop-color="#f4b52f"/><stop offset="1" stop-color="#e09412"/></linearGradient><radialGradient id="gCoin" cx=".35" cy=".3"><stop offset="0" stop-color="#fff1c2"/><stop offset=".55" stop-color="#f7c341"/><stop offset="1" stop-color="#d48e10"/></radialGradient><radialGradient id="gGlow"><stop offset="0" stop-color="#fff6c8" stop-opacity=".95"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient><radialGradient id="gBurst" cx=".5" cy=".55" r=".75"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#f08a24"/></radialGradient><linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22336b"/><stop offset="1" stop-color="#0d1530"/></linearGradient><linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3fb"/><stop offset="1" stop-color="#d9e3f2"/></linearGradient><linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fd3f0"/><stop offset="1" stop-color="#4f8fc4"/></linearGradient><linearGradient id="gField" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd16f"/><stop offset="1" stop-color="#5aa84a"/></linearGradient></defs>';
function wrap(inner){return '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">'+DEFS+inner+'</svg>'}
function W(cls,d,inner,st){return '<g class="'+cls+'" style="animation-delay:'+d+'s;'+(st||"")+'">'+inner+'</g>'}
function G(x,y,s,inner,rot){return '<g transform="translate('+x+' '+y+')'+(rot?' rotate('+rot+')':'')+(s&&s!==1?' scale('+s+')':'')+'">'+inner+'</g>'}
function TX(x,y,fs,cls,fill,txt,anchor){return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||"middle")+'" font-size="'+fs+'" class="'+cls+'" fill="'+fill+'">'+txt+'</text>'}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function mix(a,b){var o={},k;for(k in a)o[k]=a[k];for(k in b)o[k]=b[k];return o}
function starPath(cx,cy,r){var p="";for(var i=0;i<10;i++){var rr=i%2?r*.45:r,a=Math.PI/5*i-Math.PI/2;p+=(i?"L":"M")+(cx+rr*Math.cos(a)).toFixed(1)+" "+(cy+rr*Math.sin(a)).toFixed(1)}return p+"Z"}
function pill(x,y,w,h,fill,inner,stroke){return '<g transform="translate('+x+' '+y+')"><rect x="'+(-w/2)+'" y="'+(-h/2)+'" width="'+w+'" height="'+h+'" rx="'+Math.min(h/2,26)+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="5"':'')+'/>'+inner+'</g>'}
function tw(txt,fs){return String(txt).length*fs*.6+60}

/* ---------- small props ---------- */
function coin(x,y,r){return '<g transform="translate('+x+' '+y+')"><circle r="'+r+'" fill="url(#gCoin)" stroke="#b9770e" stroke-width="3"/><circle r="'+(r*.72).toFixed(1)+'" fill="none" stroke="#b9770e" stroke-width="2" opacity=".6"/><text y="'+(r*.2).toFixed(1)+'" text-anchor="middle" font-size="'+(r*.55).toFixed(1)+'" font-weight="900" fill="#8a5a06" class="fb">so‘m</text></g>'}
function cert(x,y,s,rot,label){return G(x,y,s,'<rect x="-70" y="-46" width="140" height="92" rx="8" fill="url(#gGold)" stroke="#b07a12" stroke-width="3"/><rect x="-60" y="-36" width="120" height="72" rx="5" fill="none" stroke="#8a5a06" stroke-dasharray="6 5" stroke-width="2"/><text y="6" text-anchor="middle" font-size="'+(label&&label.length>7?16:22)+'" class="ft" fill="#3a2600">'+(label||"AKSIYA")+'</text><circle cx="44" cy="24" r="9" fill="#3a2600"/>',rot)}
function doc(label){return '<g><rect x="-50" y="-66" width="100" height="132" rx="6" fill="#fff" stroke="#c9ccd6" stroke-width="3"/><text y="-30" text-anchor="middle" font-size="'+(label.length>8?14:19)+'" class="ft" fill="#2b2f45">'+label+'</text><path d="M-34 -8 H34 M-34 10 H34 M-34 28 H20" stroke="#c9ccd6" stroke-width="5" stroke-linecap="round"/><circle cx="26" cy="46" r="12" fill="#e2574c" opacity=".8"/></g>'}
function somsa(x,y,s){return G(x,y,s,'<path d="M-32 16 L0 -28 L32 16 Q0 26 -32 16Z" fill="#eaa94c" stroke="#c07a26" stroke-width="3" stroke-linejoin="round"/><path d="M-14 2 L0 -18 L14 2" fill="none" stroke="#f6c879" stroke-width="3"/><circle cx="-8" cy="6" r="2.2" fill="#fff6dc"/><circle cx="7" cy="-2" r="2.2" fill="#fff6dc"/><circle cx="6" cy="10" r="2.2" fill="#fff6dc"/>')}
function holdSVG(t,x,y,d){var inner;if(t==="cert")inner=cert(x+18,y-34,.62,-10);else if(t==="doc")inner=G(x+14,y-44,.8,doc("HUJJAT"),-6);else if(t==="laptop")inner=G(x+20,y-30,.6,laptopSVG());else if(t==="phone")inner=G(x+8,y-26,1,'<rect x="-14" y="-26" width="28" height="50" rx="5" fill="#222"/><rect x="-11" y="-21" width="22" height="38" rx="2" fill="#7fd0ff"/>');else if(t==="bag")inner=G(x+10,y-10,.55,bagSVG("so‘m"));else inner=coin(x+10,y-20,22);return W("pop",d,inner)}

/* ---------- person ---------- */
var PRESETS={
 tad:{shirt:"#1f6feb",pants:"#2b3245",skin:"#e8b98d",hair:"#2a1c14",tie:"#f4b52f"},
 sardor:{shirt:"#2e7d5b",pants:"#3b3b4a",skin:"#e8b98d",hair:"#2a1c14",doppi:1,apron:1,must:1},
 malika:{shirt:"#7c4dd8",skirt:"#3a2f6b",skin:"#f2cba6",hair:"#3b2416",long:1,glasses:1},
 banker:{shirt:"#34405e",pants:"#252c40",skin:"#f0c49c",hair:"#9aa0a8",tie:"#d64545"},
 boss:{shirt:"#25324d",pants:"#1c2436",tie:"#f4b52f",hair:"#2a1c14",skin:"#f0c49c"},
 teacher:{shirt:"#7c4dd8",skirt:"#2f2a55",long:1,hair:"#3a2418",glasses:1,skin:"#f2cba6"},
 student:{shirt:"#ef6c3a",pants:"#2f3b52",hair:"#1d1410",skin:"#e8b98d"},
 granny:{shirt:"#2a9d8f",skirt:"#5b3a8a",scarf:"#f4f1ea",skin:"#e3b085",glasses:1},
 builder:{shirt:"#f59e0b",pants:"#33404f",helmet:"#ffd23f",skin:"#c98f63"},
 doctor:{shirt:"#e9eef5",pants:"#5d6b85",hair:"#2b1a12",skin:"#f0c49c",long:1},
 farmer:{shirt:"#4d7c0f",pants:"#3f3a2f",doppi:1,must:1,hair:"#3a2a20",skin:"#c98f63"},
 worker:{shirt:"#3b82c4",pants:"#2a3446",helmet:"#ff8a3d",skin:"#e0ac7e"},
 girl:{shirt:"#e2574c",skirt:"#334155",long:1,hair:"#2b1a12",skin:"#f2cba6"},
 boy:{shirt:"#14b8a6",pants:"#2f3b52",hair:"#3a2418",skin:"#e8b98d"},
 officer:{shirt:"#e9eef5",pants:"#1c2436",tie:"#1f6feb",hair:"#2a1c14",skin:"#e8b98d"},
 mom:{shirt:"#f0a43a",skirt:"#5b3a8a",scarf:"#c2410c",skin:"#e3b085"},
 dad:{shirt:"#5b7c99",pants:"#2b2f3d",hair:"#2a1c14",must:1,skin:"#d9a679"},
 kid:{shirt:"#ffd23f",pants:"#3b82c4",hair:"#3a2418",skin:"#f2cba6"}
};
function person(x,y,s,o){o=o||{};var sk=o.skin||"#f0c49c",sh=o.shirt||"#3b82c4",pa=o.pants||"#2f3b52",hr=o.hair||"#2d1f1a",g="";
 g+='<ellipse cx="0" cy="2" rx="58" ry="11" fill="#000" opacity=".16"/>';
 if(o.long)g+='<path d="M-60 -288 Q-64 -362 0 -358 Q64 -362 60 -288 L62 -200 Q34 -192 32 -222 L-32 -222 Q-34 -192 -62 -200Z" fill="'+hr+'"/>';
 if(o.scarf)g+='<path d="M-64 -282 Q-68 -368 0 -366 Q68 -368 64 -282 Q60 -226 30 -222 L-30 -222 Q-60 -226 -64 -282Z" fill="'+o.scarf+'"/>';
 if(o.skirt)g+='<rect x="-26" y="-80" width="18" height="78" rx="8" fill="'+sk+'"/><rect x="8" y="-80" width="18" height="78" rx="8" fill="'+sk+'"/><path d="M-50 -118 L-62 -58 Q0 -46 62 -58 L50 -118Z" fill="'+o.skirt+'"/>';
 else g+='<rect x="-31" y="-122" width="25" height="120" rx="11" fill="'+pa+'"/><rect x="6" y="-122" width="25" height="120" rx="11" fill="'+pa+'"/>';
 g+='<ellipse cx="-21" cy="-4" rx="23" ry="10" fill="#2a2a33"/><ellipse cx="21" cy="-4" rx="23" ry="10" fill="#2a2a33"/>';
 function arm(side){var cx=side*56,w=side>0&&o.wave;return '<g'+(w?' class="wave"':'')+' style="transform-origin:'+(side*50)+'px -226px"><rect x="'+(cx-11)+'" y="-234" width="22" height="108" rx="11" fill="'+sh+'"/><circle cx="'+cx+'" cy="-124" r="13" fill="'+sk+'"/></g>'}
 g+=arm(-1)+'<path d="M-52 -108 Q-60 -236 0 -242 Q60 -236 52 -108Z" fill="'+sh+'"/>';
 if(o.apron)g+='<path d="M-36 -205 H36 V-108 Q0 -98 -36 -108Z" fill="#fbf7ef"/><path d="M-36 -205 L-24 -238 M36 -205 L24 -238" stroke="#fbf7ef" stroke-width="5"/>';
 if(o.tie)g+='<path d="M-16 -240 L0 -222 L16 -240Z" fill="#fff"/><path d="M0 -226 L-9 -214 L0 -150 L9 -214Z" fill="'+o.tie+'"/>';
 if(o.star)g+='<path d="'+starPath(-22,-178,18)+'" fill="#ffd34d" stroke="#c48a00" stroke-width="3"/>';
 g+=arm(1);if(o.hold)g+=holdSVG(o.hold,56,-124,o.holdDelay||0);
 g+='<rect x="-13" y="-252" width="26" height="22" fill="'+sk+'"/><circle cx="-49" cy="-288" r="11" fill="'+sk+'"/><circle cx="49" cy="-288" r="11" fill="'+sk+'"/><circle cx="0" cy="-290" r="50" fill="'+sk+'"/>';
 if(o.doppi){g+='<path d="M-47 -318 Q-46 -362 0 -364 Q46 -362 47 -318Z" fill="#1c1c22"/><path d="M-47 -318 H47" stroke="#fff" stroke-width="3"/>';[[-30,-334],[-8,-346],[14,-346],[32,-334]].forEach(function(p){g+='<path d="M0 0 q7 -14 14 0 q-7 6 -14 0z" fill="#fff" transform="translate('+p[0]+' '+p[1]+')"/>'})}
 else if(o.scarf)g+='<path d="M-54 -300 Q0 -356 54 -300 Q0 -334 -54 -300Z" fill="'+o.scarf+'"/>';
 else if(o.helmet)g+='<path d="M-56 -302 Q-54 -368 0 -368 Q54 -368 56 -302Z" fill="'+o.helmet+'"/><rect x="-66" y="-308" width="132" height="12" rx="6" fill="'+o.helmet+'"/>';
 else if(o.long)g+='<path d="M-50 -300 Q-40 -352 0 -348 Q40 -352 50 -300 Q20 -332 -50 -300Z" fill="'+hr+'"/>';
 else g+='<path d="M-51 -292 Q-54 -352 0 -350 Q54 -352 51 -292 Q46 -322 18 -326 Q-10 -312 -40 -318 Q-48 -306 -51 -292Z" fill="'+hr+'"/>';
 var f=o.face||"smile",br=o.scarf?"#5a4030":hr;
 var brow={smile:"M-27 -309 Q-17 -315 -7 -309 M7 -309 Q17 -315 27 -309",big:"M-27 -311 Q-17 -318 -7 -311 M7 -311 Q17 -318 27 -311",sad:"M-27 -313 Q-17 -309 -7 -305 M7 -305 Q17 -309 27 -313",think:"M-27 -316 Q-17 -323 -7 -315 M7 -308 Q17 -310 27 -308",wow:"M-27 -316 Q-17 -324 -7 -316 M7 -316 Q17 -324 27 -316",angry:"M-27 -318 L-7 -308 M7 -308 L27 -318"};
 g+='<path d="'+(brow[f]||brow.smile)+'" stroke="'+br+'" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
 g+='<g class="blink" style="animation-delay:'+(Math.random()*3).toFixed(2)+'s"><ellipse cx="-17" cy="-292" rx="6" ry="8" fill="#20202a"/><ellipse cx="17" cy="-292" rx="6" ry="8" fill="#20202a"/></g><circle cx="-15" cy="-295" r="2" fill="#fff"/><circle cx="19" cy="-295" r="2" fill="#fff"/>';
 g+='<circle cx="-31" cy="-272" r="9" fill="#ff7a7a" opacity=".3"/><circle cx="31" cy="-272" r="9" fill="#ff7a7a" opacity=".3"/>';
 var M={smile:'<path d="M-18 -266 Q0 -248 18 -266" stroke="#6b2a1e" stroke-width="5" fill="none" stroke-linecap="round"/>',big:'<path d="M-20 -268 Q0 -238 20 -268Z" fill="#6b2a1e"/>',wow:'<ellipse cx="0" cy="-262" rx="9" ry="12" fill="#6b2a1e"/>',sad:'<path d="M-15 -256 Q0 -270 15 -256" stroke="#6b2a1e" stroke-width="5" fill="none" stroke-linecap="round"/>',think:'<path d="M-10 -262 Q4 -266 16 -261" stroke="#6b2a1e" stroke-width="5" fill="none" stroke-linecap="round"/>',angry:'<path d="M-15 -258 Q0 -266 15 -258" stroke="#6b2a1e" stroke-width="5" fill="none" stroke-linecap="round"/>'};
 g+=M[f]||M.smile;
 if(o.must)g+='<path d="M-24 -273 Q-12 -284 0 -276 Q12 -284 24 -273 Q12 -268 0 -271 Q-12 -268 -24 -273Z" fill="'+hr+'"/>';
 if(o.glasses)g+='<g fill="none" stroke="#2a2a33" stroke-width="4"><circle cx="-18" cy="-292" r="14"/><circle cx="18" cy="-292" r="14"/><path d="M-4 -293 H4"/></g>';
 var anim=o.walk?"walkin":"popin";
 var tag=o.tag?'<g class="fadein" style="animation-delay:'+(o.tagDelay!=null?o.tagDelay:(o.d||0)+.7)+'s"><rect x="-'+(o.tag.length*9+30)+'" y="-448" width="'+(o.tag.length*18+60)+'" height="50" rx="25" fill="#fff" stroke="#1f2a44" stroke-opacity=".12" stroke-width="3"/><text y="-413" text-anchor="middle" font-size="28" class="fb" fill="#1f2a44">'+esc(o.tag)+'</text></g>':"";
 return '<g transform="translate('+x+' '+y+') scale('+s+')"><g class="'+anim+'" style="animation-delay:'+(o.d||0)+'s;--dx:'+(o.walk||0)+'px"><g class="bob" style="animation-delay:-'+(Math.random()*2).toFixed(2)+'s">'+g+'</g>'+tag+'</g></g>'}

/* ---------- buildings ---------- */
function lbl(t,fs,y){fs=fs||(t.length>14?26:t.length>10?30:34);return '<text y="'+(y||-260)+'" text-anchor="middle" font-size="'+fs+'" class="ft" fill="#ffd36a">'+esc(t)+'</text>'}
function shop(label){var g='<ellipse cx="0" cy="2" rx="220" ry="14" fill="#000" opacity=".12"/><rect x="-200" y="-330" width="400" height="330" fill="#f4e3c3"/><rect x="-206" y="-344" width="412" height="22" rx="4" fill="#d9b98a"/><rect x="-176" y="-306" width="352" height="66" rx="12" fill="#7a3b1d"/>'+lbl(label);
 for(var i=0;i<8;i++)g+='<path d="M'+(-200+i*50)+' -232 h50 l-4 44 q-21 14 -42 0z" fill="'+(i%2?"#fff":"#e2574c")+'"/>';
 g+='<rect x="-176" y="-168" width="190" height="140" rx="10" fill="#bfe3f5" stroke="#d9b98a" stroke-width="6"/><rect x="-170" y="-58" width="178" height="10" fill="#d9b98a"/>'+somsa(-130,-76,.7)+somsa(-80,-76,.7)+somsa(-30,-76,.7)+somsa(-105,-118,.7)+somsa(-55,-118,.7);
 return g+'<rect x="40" y="-188" width="130" height="188" rx="8" fill="#8b4a2b"/><rect x="56" y="-172" width="98" height="80" rx="6" fill="#bfe3f5" opacity=".7"/><circle cx="150" cy="-90" r="7" fill="#ffd36a"/>'}
function miniShop(){return '<rect x="-60" y="-110" width="120" height="110" fill="#f4e3c3" stroke="#d9b98a" stroke-width="3"/><path d="M-72 -108 L-58 -150 H58 L72 -108Z" fill="#e2574c"/><rect x="-44" y="-142" width="88" height="24" rx="5" fill="#7a3b1d"/><text y="-124" text-anchor="middle" font-size="13" fill="#ffd36a" class="ft">FILIAL</text><rect x="-46" y="-86" width="42" height="36" rx="3" fill="#9fd3f0"/><rect x="12" y="-80" width="32" height="80" rx="3" fill="#8b4a2b"/>'}
function bank(label){var g='<rect x="-200" y="-300" width="400" height="240" fill="#dfe6f0"/><rect x="-40" y="-190" width="80" height="130" rx="6" fill="#4b5873"/>';
 [-150,-50,50,150].forEach(function(cx){g+='<rect x="'+(cx-17)+'" y="-300" width="34" height="240" fill="#f3f6fb" stroke="#cfd8e6" stroke-width="3"/>'});
 return g+'<rect x="-230" y="-30" width="460" height="30" fill="#b9c4d6"/><rect x="-212" y="-60" width="424" height="30" fill="#cdd6e4"/><rect x="-216" y="-334" width="432" height="36" fill="#cdd6e4"/><path d="M-236 -334 L0 -450 L236 -334Z" fill="#b9c4d6"/><text y="-362" text-anchor="middle" font-size="'+((label||"BANK").length>8?28:44)+'" class="ft" fill="#34405e">'+esc(label||"BANK")+'</text>'}
function gov(label){var g='<rect x="-230" y="-280" width="460" height="280" fill="#f3efe6"/><rect x="-250" y="-300" width="500" height="30" fill="#d9cfbd"/><path d="M-90 -300 Q0 -420 90 -300Z" fill="#3aa0d8"/><rect x="-4" y="-470" width="8" height="90" fill="#7b8698"/><rect x="4" y="-470" width="70" height="16" fill="#3aa0d8"/><rect x="4" y="-454" width="70" height="4" fill="#e2574c"/><rect x="4" y="-450" width="70" height="16" fill="#fff"/><rect x="4" y="-434" width="70" height="4" fill="#e2574c"/><rect x="4" y="-430" width="70" height="16" fill="#1fa35b"/>';
 for(var i=0;i<5;i++)g+='<rect x="'+(-200+i*85)+'" y="-240" width="50" height="80" rx="25" fill="#9fd3f0"/>';
 return g+'<rect x="-60" y="-140" width="120" height="140" rx="8" fill="#7a5a3a"/><rect x="-210" y="-140" width="140" height="44" rx="8" fill="#1f6feb"/>'+TX(-140,-110,20,"ft","#fff",esc(label||"DAVLAT"))}
function office(label){var g='<rect x="-130" y="-560" width="260" height="560" fill="url(#gGlass)"/>';for(var r=0;r<11;r++)for(var c=0;c<4;c++)g+='<rect x="'+(-110+c*58)+'" y="'+(-540+r*46)+'" width="44" height="30" fill="#dff3ff" opacity="'+((r+c)%3?.5:.9)+'"/>';
 return g+'<rect x="-150" y="-590" width="300" height="34" fill="#34405e"/>'+TX(0,-565,label&&label.length>12?20:26,"ft","#ffd36a",esc(label||"OFIS"))+'<rect x="-40" y="-90" width="80" height="90" fill="#34405e"/>'}
function factory(label){var g='<rect x="-60" y="-470" width="44" height="200" fill="#9aa3b5"/><rect x="40" y="-430" width="44" height="160" fill="#9aa3b5"/>';
 for(var k=0;k<3;k++)g+='<g class="smoke" style="animation-delay:'+(k*1.1)+'s"><circle cx="-38" cy="-490" r="24" fill="#e8edf3"/></g><g class="smoke" style="animation-delay:'+(k*1.1+.5)+'s"><circle cx="62" cy="-450" r="22" fill="#e8edf3"/></g>';
 g+='<path d="M-240 0 V-280 L-160 -340 V-280 L-80 -340 V-280 L0 -340 V-280 L80 -340 V-280 L160 -340 V-280 L240 -340 V0Z" fill="#c9714a"/>';
 for(var i=0;i<5;i++)g+='<rect x="'+(-210+i*90)+'" y="-230" width="60" height="70" rx="4" fill="#ffe08a" opacity=".85"/>';
 return g+'<rect x="-50" y="-120" width="100" height="120" fill="#5b3a2a"/><rect x="-220" y="-160" width="160" height="40" rx="8" fill="#34405e"/>'+TX(-140,-132,label&&label.length>9?16:22,"ft","#ffd36a",esc(label||"ZAVOD"))}
function house(label){return '<rect x="-150" y="-220" width="300" height="220" fill="#fbe3c0"/><path d="M-180 -210 L0 -340 L180 -210Z" fill="#e2574c"/><rect x="-110" y="-170" width="80" height="70" rx="6" fill="#9fd3f0"/><rect x="40" y="-150" width="70" height="150" rx="6" fill="#8b4a2b"/>'+(label?pill(0,-260,tw(label,24),44,"#fff",TX(0,9,24,"fb","#7a3b1d",esc(label))):"")}
function farm(){var g='<rect x="-300" y="-40" width="600" height="40" fill="#a5733f"/>';for(var i=0;i<6;i++)g+='<path d="M'+(-290+i*100)+' -40 q50 -40 100 0" fill="#6fbf4f"/>';
 g+='<g class="tractor"><rect x="-90" y="-150" width="140" height="70" rx="10" fill="#e2574c"/><rect x="-60" y="-210" width="70" height="66" rx="8" fill="#e2574c"/><rect x="-50" y="-200" width="50" height="40" fill="#bfe3f5"/><circle cx="-60" cy="-60" r="44" fill="#2a2a33"/><circle cx="-60" cy="-60" r="18" fill="#9aa3b5"/><circle cx="40" cy="-55" r="28" fill="#2a2a33"/><circle cx="40" cy="-55" r="11" fill="#9aa3b5"/></g>';return g}
function tandir(){var s='<ellipse cx="0" cy="0" rx="130" ry="16" fill="#000" opacity=".15"/><path d="M-115 0 Q-128 -200 0 -210 Q128 -200 115 0Z" fill="#c8794a"/><path d="M-96 -40 H96 M-108 -90 H108 M-100 -140 H100" stroke="#b0653b" stroke-width="5"/><ellipse cx="0" cy="-205" rx="48" ry="15" fill="#4a1f0c"/><g class="flick"><path d="M-30 -205 Q-20 -250 0 -232 Q10 -272 22 -236 Q34 -248 30 -205Z" fill="#ff9a2e"/></g>';
 for(var k=0;k<3;k++)s+='<g class="smoke" style="animation-delay:'+(k*1.05)+'s"><circle cx="'+(k*14-14)+'" cy="-255" r="20" fill="#fff" opacity=".8"/></g>';return s}
function truck(label){return '<g class="drive"><rect x="-200" y="-200" width="260" height="150" rx="10" fill="#f3f6fb" stroke="#cfd8e6" stroke-width="4"/>'+TX(-70,-115,label&&label.length>9?22:30,"ft","#1f6feb",esc(label||"YUK"))+'<path d="M60 -170 H140 L190 -110 V-50 H60Z" fill="#1f6feb"/><rect x="80" y="-158" width="56" height="44" rx="6" fill="#bfe3f5"/><circle cx="-130" cy="-44" r="34" fill="#2a2a33"/><circle cx="-130" cy="-44" r="13" fill="#9aa3b5"/><circle cx="130" cy="-44" r="34" fill="#2a2a33"/><circle cx="130" cy="-44" r="13" fill="#9aa3b5"/></g>'}
function plane(){return '<g class="fly"><path d="M-160 0 Q-150 -26 -100 -26 H130 Q170 -26 180 0 Q170 22 130 22 H-100 Q-150 22 -160 0Z" fill="#f3f6fb" stroke="#cfd8e6" stroke-width="3"/><path d="M-20 -20 L60 -110 H90 L50 -20Z" fill="#1f6feb"/><path d="M-20 18 L60 100 H90 L50 18Z" fill="#1f6feb"/><path d="M-150 -10 L-170 -70 H-140 L-110 -18Z" fill="#e2574c"/><g fill="#7fb4dd">'+[ -80,-50,-20,10,40,70,100].map(function(x){return '<circle cx="'+x+'" cy="-4" r="7"/>'}).join("")+'</g></g>'}
function globe(){return '<circle r="130" fill="#4fa3e0"/><path d="M-90 -60 q40 -40 80 -10 q20 30 -20 40 q-30 10 -40 40 q-30 -20 -20 -70Z M20 -100 q50 0 70 40 q-30 10 -50 -5 q-30 -10 -20 -35Z M30 20 q50 -10 70 30 q-10 50 -60 60 q-30 -30 -10 -90Z" fill="#6fcf73"/><ellipse rx="130" ry="42" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4"/><path d="M0 -130 V130" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>'}
function laptopSVG(){return '<rect x="-110" y="-150" width="220" height="140" rx="10" fill="#2b3245"/><rect x="-96" y="-136" width="192" height="112" rx="4" fill="#7fd0ff"/><path d="M-80 -60 L-40 -90 L0 -70 L60 -120" stroke="#1f9d61" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-140 -10 H140 L120 14 H-120Z" fill="#9aa3b5"/>'}
function rocket(){return '<g class="launch"><path d="M0 -200 Q50 -140 44 -20 H-44 Q-50 -140 0 -200Z" fill="#f3f6fb" stroke="#cfd8e6" stroke-width="4"/><circle cy="-110" r="22" fill="#4fa3e0" stroke="#34405e" stroke-width="5"/><path d="M-44 -60 L-84 0 H-44Z M44 -60 L84 0 H44Z" fill="#e2574c"/><g class="flick"><path d="M-26 -20 Q0 70 26 -20Z" fill="#ff9a2e"/></g></g>'}
function scales(){return '<rect x="-8" y="-220" width="16" height="200" fill="#b07a12"/><rect x="-70" y="-24" width="140" height="24" rx="8" fill="#b07a12"/><g class="tilt"><rect x="-170" y="-226" width="340" height="12" rx="6" fill="#d4a017"/><path d="M-150 -214 L-200 -120 H-100Z M150 -214 L100 -120 H200Z" fill="none" stroke="#d4a017" stroke-width="5"/><path d="M-210 -120 Q-150 -80 -90 -120Z M90 -120 Q150 -80 210 -120Z" fill="#d4a017"/></g><circle cy="-232" r="16" fill="#d4a017"/>'}
function shield(label){return '<path d="M0 -150 L120 -110 Q120 20 0 80 Q-120 20 -120 -110Z" fill="#1f9d61" stroke="#fff" stroke-width="8"/><path d="M-50 -30 L-12 10 L56 -66" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+(label?TX(0,130,32,"ft","#1f2a44",esc(label)):"")}
function chart(dir,label){var up=dir!=="down",col=up?"#1f9d61":"#e2574c",path=up?"M40 280 L120 262 L200 250 L280 214 L360 180 L430 130 L490 96":"M40 110 L120 130 L200 120 L280 180 L360 200 L430 250 L490 278";
 return '<rect width="520" height="330" rx="24" fill="#fff"/>'+TX(30,58,label&&label.length>12?26:34,"ft",col,esc(label||(up?"FOYDA ▲":"ZARAR ▼")),"start")+'<path d="M40 290 H490 M40 290 V90" stroke="#c9d3e3" stroke-width="4"/><path class="draw" d="'+path+'" fill="none" stroke="'+col+'" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'}
function calc(){var g='<rect x="-80" y="-120" width="160" height="230" rx="18" fill="#34405e"/><rect x="-62" y="-102" width="124" height="50" rx="6" fill="#bfe3a0"/>';for(var r=0;r<3;r++)for(var c=0;c<3;c++)g+='<rect x="'+(-58+c*42)+'" y="'+(-38+r*44)+'" width="32" height="32" rx="6" fill="'+(c===2&&r===2?"#f4b52f":"#9aa3b5")+'"/>';return g}
function bagSVG(label){return '<path d="M-70 -120 Q-30 -150 0 -120 Q30 -150 70 -120 L40 -90 H-40Z" fill="#b07a3a"/><path d="M-110 40 Q-130 -90 -40 -96 H40 Q130 -90 110 40 Q100 80 0 80 Q-100 80 -110 40Z" fill="#c98a45"/><rect x="-46" y="-100" width="92" height="14" rx="7" fill="#8a5a26"/><text y="10" text-anchor="middle" font-size="'+((label||"").length>4?30:44)+'" class="ft" fill="#5a3a12">'+esc(label||"so‘m")+'</text>'}
function mag(){return '<circle r="70" fill="#dff3ff" fill-opacity=".6" stroke="#34405e" stroke-width="16"/><rect x="44" y="40" width="30" height="110" rx="12" fill="#34405e" transform="rotate(-40 59 95)"/>'}
function mega(){return '<path d="M-90 -40 L60 -110 V110 L-90 40Z" fill="#e2574c"/><rect x="-130" y="-40" width="44" height="80" rx="10" fill="#34405e"/><rect x="-110" y="40" width="30" height="80" rx="8" fill="#34405e"/><g class="pulse"><path d="M90 -60 Q130 0 90 60 M120 -90 Q180 0 120 90" stroke="#f4b52f" stroke-width="10" fill="none" stroke-linecap="round"/></g>'}
function board(lines){lines=lines||[];var h=70+lines.length*56,g='<rect x="-260" y="'+(-h)+'" width="520" height="'+h+'" rx="20" fill="#fff" stroke="#34405e" stroke-width="6"/>';
 lines.forEach(function(l,i){var hi=l.charAt(0)==="!";g+=W("fadein",(i*.5).toFixed(1),TX(-230,-h+60+i*56,30,hi?"ft":"fb",hi?"#1f6feb":"#1f2a44",esc(hi?l.slice(1):l),"start"))});return g}
function gears(){function gear(r,t){var p="";for(var i=0;i<t*2;i++){var a=i/(t*2)*Math.PI*2,rr=i%2?r:r*1.22;p+=(i?"L":"M")+(rr*Math.cos(a)).toFixed(1)+" "+(rr*Math.sin(a)).toFixed(1)}return p+"Z"}
 return '<g class="spin" style="animation-duration:8s"><path d="'+gear(80,10)+'" fill="#9aa3b5"/><circle r="28" fill="#34405e"/></g><g transform="translate(150 -60)"><g class="spin" style="animation-duration:6s;animation-direction:reverse"><path d="'+gear(50,8)+'" fill="#f4b52f"/><circle r="18" fill="#34405e"/></g></g>'}
function warn(){return '<path d="M0 -130 L130 100 H-130Z" fill="#ffd23f" stroke="#2a2a33" stroke-width="10" stroke-linejoin="round"/><rect x="-10" y="-60" width="20" height="90" rx="10" fill="#2a2a33"/><circle cy="62" r="13" fill="#2a2a33"/>'}
function trophy(){return '<path d="M-70 -160 H70 V-90 Q70 -20 0 -10 Q-70 -20 -70 -90Z" fill="url(#gGold)"/><path d="M-70 -140 Q-120 -140 -110 -90 Q-100 -60 -66 -64 M70 -140 Q120 -140 110 -90 Q100 -60 66 -64" stroke="#d4a017" stroke-width="12" fill="none"/><rect x="-14" y="-12" width="28" height="50" fill="#d4a017"/><rect x="-60" y="36" width="120" height="30" rx="6" fill="#7a3b1d"/>'}
function tableSVG(){return '<rect x="-330" y="-150" width="660" height="34" rx="8" fill="#8b5a3a"/><rect x="-310" y="-116" width="620" height="116" fill="#a86c43"/>'}
function bulb(){return '<circle class="pulse" r="160" fill="url(#gGlow)"/><circle cy="-10" r="62" fill="#ffe680" stroke="#e0b400" stroke-width="6"/><path d="M-16 0 Q0 -30 16 0" stroke="#e0a000" stroke-width="5" fill="none"/><rect x="-28" y="46" width="56" height="18" rx="6" fill="#9aa3b5"/><rect x="-22" y="66" width="44" height="16" rx="6" fill="#7b8698"/>'}
function billboard(text){return '<rect x="-12" y="-120" width="24" height="120" fill="#7b8698"/><rect x="-260" y="-330" width="520" height="220" rx="14" fill="#fff" stroke="#e2574c" stroke-width="10"/>'+TX(0,-210,text.length>14?34:46,"ft","#e2574c",esc(text))+'<path d="M-200 -160 H200" stroke="#f4b52f" stroke-width="10" stroke-linecap="round"/>'}

/* ---------- backgrounds ---------- */
function cloud(x,y,s,dur,del){return '<g class="drift" style="animation-duration:'+dur+'s;animation-delay:-'+del+'s"><g transform="translate('+x+' '+y+') scale('+s+')" fill="#fff" opacity=".93"><ellipse cx="0" cy="0" rx="90" ry="38"/><ellipse cx="-50" cy="8" rx="60" ry="30"/><ellipse cx="55" cy="10" rx="64" ry="28"/><ellipse cx="10" cy="-26" rx="52" ry="36"/></g></g>'}
var SKYLINE='<g fill="#a9cdea"><rect x="30" y="540" width="110" height="180" rx="4"/><rect x="150" y="600" width="80" height="120"/><path d="M250 720 V610 H420 V720Z"/><path d="M270 612 Q335 500 400 612Z"/><rect x="430" y="480" width="24" height="240"/><path d="M424 482 h36 l-18 -34z"/><rect x="226" y="500" width="22" height="220"/><path d="M220 502 h34 l-17 -32z"/><rect x="520" y="560" width="120" height="160"/><rect x="660" y="500" width="70" height="220"/><rect x="750" y="590" width="140" height="130"/><rect x="920" y="470" width="90" height="250"/><rect x="1030" y="560" width="110" height="160"/><path d="M1160 720 L1192 560 L1224 720Z"/><rect x="1186" y="260" width="12" height="320"/><ellipse cx="1192" cy="420" rx="34" ry="18"/><ellipse cx="1192" cy="470" rx="22" ry="11"/><rect x="1260" y="590" width="130" height="130"/><path d="M1410 720 V620 H1560 V720Z"/><path d="M1425 622 Q1485 520 1545 622Z"/></g>';
function tree(x){return '<rect x="'+(x-7)+'" y="650" width="14" height="70" fill="#8a5a3a"/><circle cx="'+x+'" cy="640" r="40" fill="#5fbf73"/><circle cx="'+(x-24)+'" cy="662" r="27" fill="#4fae64"/><circle cx="'+(x+24)+'" cy="660" r="25" fill="#56b86b"/>'}
function sun(){var s='<g transform="translate(1420 150)"><circle r="160" fill="url(#gGlow)"/><g class="spin">';for(var i=0;i<12;i++)s+='<rect x="-5" y="-122" width="10" height="36" rx="5" fill="#ffe08a" transform="rotate('+i*30+')"/>';return s+'</g><circle r="62" fill="#ffd45c"/></g>'}
function ground(col1,col2){var s='<rect y="715" width="1600" height="185" fill="'+(col1||"#e9d2a6")+'"/><rect y="715" width="1600" height="12" fill="'+(col2||"#d5b886")+'"/>';for(var r=0;r<3;r++)for(var c=0;c<14;c++)s+='<rect x="'+(c*120+(r%2)*60-20)+'" y="'+(760+r*48)+'" width="90" height="6" rx="3" fill="'+(col2||"#dcc193")+'" opacity=".6"/>';return s}
var BG={
 day:function(){return '<rect width="1600" height="900" fill="url(#gSky)"/>'+sun()+cloud(180,130,1,34,3)+cloud(720,90,.8,42,12)+cloud(1050,210,.7,38,20)+SKYLINE+tree(110)+tree(610)+tree(1030)+tree(1520)+ground()},
 city:function(){return '<rect width="1600" height="900" fill="url(#gSky)"/>'+sun()+cloud(300,120,1,34,3)+cloud(900,90,.8,42,12)+SKYLINE+ground()},
 field:function(){return '<rect width="1600" height="900" fill="url(#gSky)"/>'+sun()+cloud(260,140,1,34,3)+cloud(900,110,.8,42,12)+'<path d="M0 640 Q300 520 620 610 Q900 690 1200 580 Q1420 520 1600 590 V900 H0Z" fill="#a6dc84"/><path d="M0 700 Q400 640 800 690 Q1200 740 1600 680 V900 H0Z" fill="url(#gField)"/>'+tree(150)+tree(1450)+'<rect y="715" width="1600" height="185" fill="#7cc35f"/><rect y="715" width="1600" height="10" fill="#67ad4d"/>'},
 office:function(){var s='<rect width="1600" height="720" fill="url(#gWall)"/><rect x="1150" y="120" width="320" height="260" rx="10" fill="#bfe3f5" stroke="#9aa3b5" stroke-width="10"/><path d="M1310 120 V380 M1150 250 H1470" stroke="#9aa3b5" stroke-width="8"/><rect y="540" width="1600" height="180" fill="#d3dceb"/><rect y="715" width="1600" height="185" fill="#8b9bb5"/>';for(var i=0;i<4;i++)s+='<path d="M0 '+(758+i*42)+' H1600" stroke="#7a89a3" stroke-width="4"/>';return s+'<rect x="1210" y="400" width="30" height="140" fill="#5fbf73" opacity=".0"/>'},
 gold:function(){var s='<rect width="1600" height="900" fill="url(#gBurst)"/><g class="spin" style="animation-duration:60s">';for(var i=0;i<16;i++){var a1=i/16*Math.PI*2,a2=a1+Math.PI/32;s+='<polygon points="800,450 '+(800+1500*Math.cos(a1)).toFixed(0)+','+(450+1500*Math.sin(a1)).toFixed(0)+' '+(800+1500*Math.cos(a2)).toFixed(0)+','+(450+1500*Math.sin(a2)).toFixed(0)+'" fill="#fff" opacity=".14"/>'}return s+'</g>'},
 night:function(){var s='<rect width="1600" height="900" fill="url(#gNight)"/>';for(var i=0;i<40;i++)s+='<g class="tw" style="animation-delay:'+(i*.17).toFixed(2)+'s"><circle cx="'+((i*373)%1580+10)+'" cy="'+((i*197)%860+20)+'" r="'+(2+i%3)+'" fill="#fff" opacity=".7"/></g>';return s}
};
function sparkles(n,col){var s="";for(var i=0;i<n;i++){var x=(i*397+80)%1500+50,y=(i*211+40)%780+40;s+='<g class="tw" style="animation-delay:'+(i*.23).toFixed(2)+'s"><path d="'+starPath(x,y,10+(i%3)*7)+'" fill="'+(col||"#fff")+'"/></g>'}return s}

/* ---------- act renderer ---------- */
var GY=715;
function act(a,d){var t=a[0],o=(a.length&&typeof a[a.length-1]==="object"&&!Array.isArray(a[a.length-1]))?a[a.length-1]:{};
 var s=o.s||1;
 switch(t){
 case "p": {var pr=typeof a[2]==="string"?(PRESETS[a[2]]||{}):(a[2]||{});var y=o.y||GY;return person(a[1],y,s,mix(mix(pr,o),{d:d}))}
 case "shop": return W("pop",d,G(a[1],o.y||GY,s,shop(a[2]||"DO‘KON")));
 case "bank": return W("pop",d,G(a[1],o.y||GY,s,bank(a[2])));
 case "gov": return W("pop",d,G(a[1],o.y||GY,s,gov(a[2])));
 case "office": return W("pop",d,G(a[1],o.y||GY,s,office(a[2])));
 case "factory": return W("pop",d,G(a[1],o.y||GY,s,factory(a[2])));
 case "house": return W("pop",d,G(a[1],o.y||GY,s,house(a[2])));
 case "farm": return W("pop",d,G(a[1],o.y||GY,s,farm()));
 case "tandir": return W("pop",d,G(a[1],o.y||GY,s,tandir()));
 case "truck": return W("pop",d,G(a[1],o.y||GY,s,truck(a[2])));
 case "plane": return W("pop",d,G(a[1],a[2],s,plane()));
 case "globe": return W("pop",d,G(a[1],a[2],s,'<g class="spinslow">'+globe()+'</g>'));
 case "laptop": return W("pop",d,G(a[1],a[2],s,laptopSVG()));
 case "rocket": return W("pop",d,G(a[1],a[2],s,rocket()));
 case "scales": return W("pop",d,G(a[1],a[2],s,scales()));
 case "shield": return W("pop",d,G(a[1],a[2],s,shield(a[3])));
 case "chart": return W("pop",d,G(a[1],a[2],s,chart(a[3],a[4])));
 case "calc": return W("pop",d,G(a[1],a[2],s,calc()));
 case "doc": return W("pop",d,G(a[1],a[2],s,doc(a[3]||"HUJJAT"),o.rot||0));
 case "cert": return W("pop",d,cert(a[1],a[2],s,o.rot||0,a[3]));
 case "bag": return W("pop",d,G(a[1],a[2],s,bagSVG(a[3])));
 case "coins": {var n=a[3]||3,g="";for(var i=0;i<n;i++)g+=W("pop",(d+i*.15).toFixed(2),coin(a[1]+(i%4)*56-((Math.min(n,4)-1)*28),a[2]-Math.floor(i/4)*50,26*s));return g}
 case "rain": {var g2="",fx=a[1],fy=a[2],tg=a[3];tg.forEach(function(p,i){g2+=W("fall",(d+i*.22).toFixed(2),coin(p[0],p[1],24),"--fx:"+(fx-p[0])+"px;--fy:"+(fy-p[1])+"px")});return g2}
 case "mag": return W("pop",d,G(a[1],a[2],s,'<g class="float">'+mag()+'</g>'));
 case "mega": return W("pop",d,G(a[1],a[2],s,mega()));
 case "board": return W("pop",d,G(a[1],a[2],s,board(a[3])));
 case "billboard": return W("pop",d,G(a[1],o.y||GY,s,billboard(a[2])));
 case "gears": return W("pop",d,G(a[1],a[2],s,gears()));
 case "warn": return W("pop",d,G(a[1],a[2],s,'<g class="wobble">'+warn()+'</g>'));
 case "trophy": return W("pop",d,G(a[1],a[2],s,trophy()));
 case "table": return G(a[1],o.y||GY,s,tableSVG());
 case "bulb": return W("pop",d,G(a[1],a[2],s,bulb()));
 case "somsa": return W("pop",d,'<g class="float">'+somsa(a[1],a[2],s)+'</g>');
 case "minis": {var labels=a[2]||[],cnt=a[1]||5,step=Math.min(160,1400/cnt),x0=800-step*(cnt-1)/2,g3="";for(var k=0;k<cnt;k++){var x=x0+k*step;g3+=W("growup",(d+k*.25).toFixed(2),G(x,o.y||GY,o.s||.9,miniShop()));if(labels[k])g3+=W("fadein",(d+.3+k*.25).toFixed(2),TX(x,(o.y||GY)-160,22,"fb","#1f2a44",esc(labels[k])))}return g3}
 case "sign": {var fs=o.fs||34,w=o.w||tw(a[3],fs),h=o.h||fs*2.2;return W(o.anim||"pop",d,pill(a[1],a[2],w,h,o.fill||"#fff",TX(0,fs*.36,fs,o.cls||"ft",o.color||"#1f2a44",esc(a[3])),o.stroke))}
 case "big": return W(o.anim||"rise",d,TX(800,a[1],o.fs||110,"ft",o.color||"#3a2100",esc(a[2])));
 case "text": return W(o.anim||"fadein",d,TX(a[1],a[2],o.fs||36,o.cls||"fb",o.color||"#1f2a44",esc(a[3])));
 case "bubble": {var fs2=o.fs||30,w2=tw(a[3],fs2);return W("pop",d,'<g transform="translate('+a[1]+' '+a[2]+')"><rect x="'+(-w2/2)+'" y="-40" width="'+w2+'" height="80" rx="30" fill="#fff" stroke="#1f2a44" stroke-opacity=".15" stroke-width="3"/><path d="M-20 38 L-36 76 L8 38Z" fill="#fff"/>'+TX(0,10,fs2,"fb","#1f2a44",esc(a[3]))+'</g>')}
 case "num": return W("rise",d,'<text x="'+a[1]+'" y="'+a[2]+'" text-anchor="middle" font-size="'+(o.fs||80)+'" class="ft" fill="'+(o.color||"#1f9d61")+'" data-cnt="'+a[3]+'" data-a="'+(o.a!=null?o.a:d)+'" data-b="'+(o.b!=null?o.b:d+2.5)+'" data-suf="'+esc(a[4]||"")+'" data-pre="'+esc(o.pre||"")+'">0</text>');
 case "arrow": {var x1=a[1],y1=a[2],x2=a[3],y2=a[4],an=Math.atan2(y2-y1,x2-x1),hx=x2-30*Math.cos(an-0.5),hy=y2-30*Math.sin(an-0.5),hx2=x2-30*Math.cos(an+0.5),hy2=y2-30*Math.sin(an+0.5);return W("fadein",d,'<path d="M'+x1+' '+y1+' L'+x2+' '+y2+' M'+hx.toFixed(0)+' '+hy.toFixed(0)+' L'+x2+' '+y2+' L'+hx2.toFixed(0)+' '+hy2.toFixed(0)+'" stroke="'+(o.color||"#1f2a44")+'" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')}
 case "cross": return W("stamp",d,G(a[1],a[2],s,'<path d="M-120 -80 L120 80 M120 -80 L-120 80" stroke="#e2574c" stroke-width="24" stroke-linecap="round" opacity=".9"/>'));
 case "check": return W("stamp",d,G(a[1],a[2],s,'<circle r="70" fill="#1f9d61"/><path d="M-32 0 L-8 26 L36 -28" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'));
 case "stamp": return W("stamp",d,'<g transform="translate('+a[1]+' '+a[2]+') rotate(-10)"><rect x="'+(-tw(a[3],34)/2)+'" y="-50" width="'+tw(a[3],34)+'" height="100" rx="14" fill="#fff" fill-opacity=".85" stroke="'+(o.color||"#1f9d61")+'" stroke-width="9"/>'+TX(0,12,34,"ft",o.color||"#1f9d61",esc(a[3]))+'</g>');
 case "stars": return sparkles(a[1]||10,o.color);
 case "crowd": {var g4="",ks=["teacher","student","granny","builder","doctor","farmer","girl","boy","worker","mom"];for(var j=0;j<(a[2]||4);j++)g4+=person(a[1]+j*120,o.y||GY,o.s||.7,mix(PRESETS[ks[(j+(o.k||0))%ks.length]],{d:d+j*.15,walk:o.walk||0}));return g4}
 }
 return "";}
F.renderScene=function(sc){var bg=(BG[sc.bg]||BG.day)();var acts=sc.a||[],out="",step=sc.step||0.55;
 acts.forEach(function(a,i){var o=(typeof a[a.length-1]==="object"&&!Array.isArray(a[a.length-1]))?a[a.length-1]:{};var d=o.d!=null?o.d:(0.2+i*step);out+=act(a,d)});
 return wrap(bg+out)};
F.titleScene=function(topic){return {t:"Boshlanish",bg:"gold",d:6,s:[topic.n+"-mavzu",topic.title],a:[["stars",14],["text",800,170,"MULTFILM · "+topic.n+"-MAVZU",{fs:30,color:"#5a3600",d:.1}],["bulb",800,330,{s:1.2,d:.3}],["big",580,topic.title.toUpperCase(),{fs:topic.title.length>30?48:topic.title.length>20?60:76,d:.9}]]}};
window.TBFilm=F;
})();
