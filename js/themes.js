/* =========================================================
   Har bir dars uchun o‘z uslubi: rang, shrift, fon naqshi,
   slayd joylashuvi (layout) va o‘tish animatsiyasi.
   a — asosiy rang, b — ikkinchi rang, ink — asosiy rang ustidagi matn
   ========================================================= */
(function(){
"use strict";
var D="#14110a",W="#ffffff";
var P=[
 ["#2563eb","#38bdf8",W],["#7c3aed","#f472b6",W],["#0d9488","#a3e635",W],["#e11d48","#fb923c",W],["#ea580c","#facc15",W],
 ["#0891b2","#22d3ee",W],["#4f46e5","#a78bfa",W],["#b45309","#fbbf24",W],["#15803d","#86efac",W],["#db2777","#c084fc",W],
 ["#1d4ed8","#f59e0b",W],["#9333ea","#22d3ee",W],["#be123c","#fda4af",W],["#0f766e","#5eead4",W],["#c2410c","#fdba74",W],
 ["#f59e0b","#fb7185",D],["#0284c7","#7dd3fc",W],["#65a30d","#fde047",D],["#dc2626","#fca5a5",W],["#059669","#fcd34d",W],
 ["#6d28d9","#fbbf24",W],["#ec4899","#fde047",W],["#0369a1","#f97316",W],["#a21caf","#f0abfc",W],["#16a34a","#facc15",W],
 ["#f97316","#38bdf8",D],["#8b5cf6","#34d399",W],["#b91c1c","#fbbf24",W],["#0e7490","#fde68a",W],["#e11d48","#6366f1",W]
];
var FONTS=["'Unbounded'","'Rubik'","'Comfortaa'","'Exo 2'","'Lora'","'Onest'"];
var PATS=["dots","grid","diag","rings","confetti","waves"];
var LAYS=["card","split","poster"];
var TRS=["slide","zoom","rise","flip"];
function rgb(h){h=h.replace("#","");return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)].join(",")}
function themeOf(n){var i=(n-1)%30,p=P[i];
 return {n:n,a:p[0],b:p[1],ink:p[2],font:FONTS[(n*5+1)%6],pat:PATS[(n*7+2)%6],lay:LAYS[n%3],tr:TRS[(n*3+1)%4]}}
var CLS=[];
function apply(n){var el=document.body,th=themeOf(n);clear();
 var st=el.style;st.setProperty("--gold",th.a);st.setProperty("--gold-ink",th.ink);st.setProperty("--gold-soft","rgba("+rgb(th.a)+",.13)");
 st.setProperty("--a2",th.b);st.setProperty("--a-rgb",rgb(th.a));st.setProperty("--b-rgb",rgb(th.b));st.setProperty("--tfont",th.font+",var(--display)");
 CLS=["themed","pat-"+th.pat,"lay-"+th.lay,"tr-"+th.tr];CLS.forEach(function(c){el.classList.add(c)});return th}
function clear(){var el=document.body,st=el.style;["--gold","--gold-ink","--gold-soft","--a2","--a-rgb","--b-rgb","--tfont"].forEach(function(k){st.removeProperty(k)});CLS.forEach(function(c){el.classList.remove(c)});CLS=[]}
window.TBTheme={of:themeOf,apply:apply,clear:clear};
})();
