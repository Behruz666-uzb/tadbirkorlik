/* =========================================================
   Sinflar (darsliklar) ro‘yxati.
   Har bir sinf: o‘z mavzular papkasi, boblari va matnlari.
   Joriy sinf: ?g=9 yoki localStorage "tb-grade" (sukut bo‘yicha birinchi sinf).
   ========================================================= */
(function(){
var GRADES={
 "11":{id:"11",dir:"js/topics",extra:true,themeShift:0,
  label:{uz:"11-sinf",ru:"11 класс"},
  book:{uz:"Tadbirkorlik asoslari",ru:"Основы предпринимательства"},
  authors:{uz:"U. G‘afurov, Q. Sharipov",ru:"У. Гафуров, К. Шарипов"},
  sub:{uz:"Kelajak uchun bilim, bugundan boshlangan imkoniyatlar!",ru:"Знания для будущего — возможности, которые начинаются сегодня!"},
  tag:{uz:"Kichik g‘oya —<br>katta imkoniyat!",ru:"Маленькая идея —<br>большие возможности!"},
  ch:[
   {n:"I",c:"#3b82f6",from:1,to:10,uz:"Tadbirkorlik, uning turlari va shakllari",ru:"Предпринимательство, его виды и формы",ic:"chart",m:"bulb",mu:"G‘oya — har qanday biznesning boshlanishi.",mr:"Идея — начало любого бизнеса."},
   {n:"II",c:"#10b981",from:11,to:15,uz:"Tadbirkorlikni tashkil etish",ru:"Организация предпринимательства",ic:"hand",m:"target",mu:"Reja, intizom va to‘g‘ri boshqaruv — muvaffaqiyat kaliti.",mr:"План, дисциплина и правильное управление — ключ к успеху."},
   {n:"III",c:"#f59e0b",from:16,to:21,uz:"Korxona mablag‘lari, xarajatlari va moliyaviy natijalari",ru:"Средства, расходы и финансовые результаты предприятия",ic:"gear",m:"coins",mu:"Samarali boshqaruv — yuqori natija.",mr:"Эффективное управление — высокий результат."},
   {n:"IV",c:"#a855f7",from:22,to:27,uz:"Tadbirkorlik muvaffaqiyati asoslari",ru:"Основы успеха в предпринимательстве",ic:"people",m:"flag",mu:"Maqsad sari qat’iyat bilan!",mr:"К цели — с упорством!"},
   {n:"V",c:"#ef4444",from:28,to:30,uz:"Tadbirkorlikda risk va raqobatdoshlik",ru:"Риск и конкурентоспособность в предпринимательстве",ic:"shield",m:"shield",mu:"Xavflarni angla, imkoniyatlarni qo‘lga kirit!",mr:"Осознай риски — используй возможности!"}
  ]},
 "9":{id:"9",dir:"js/g9",extra:false,themeShift:13,
  label:{uz:"9-sinf",ru:"9 класс"},
  book:{uz:"Iqtisodiy bilim asoslari",ru:"Основы экономических знаний"},
  authors:{uz:"E. Sariqov, B. Xaydarov",ru:"Э. Сарыков, Б. Хайдаров"},
  sub:{uz:"Iqtisodiyotni bilgan — hayotda adashmaydi!",ru:"Кто понимает экономику — не ошибается в жизни!"},
  tag:{uz:"Bilim — eng katta<br>sarmoya!",ru:"Знания — самая большая<br>инвестиция!"},
  ch:[
   {n:"I",c:"#3b82f6",from:1,to:10,uz:"Tadbirkorlik va ishlab chiqarish",ru:"Предпринимательство и производство",ic:"factory",m:"bulb",mu:"G‘oya va mehnat — ishlab chiqarishning boshlanishi.",mr:"Идея и труд — начало производства."},
   {n:"II",c:"#10b981",from:11,to:14,uz:"Davlat va iqtisodiyot",ru:"Государство и экономика",ic:"bank",m:"shield",mu:"Kuchli davlat — barqaror iqtisodiyot.",mr:"Сильное государство — стабильная экономика."},
   {n:"III",c:"#f59e0b",from:15,to:18,uz:"Soliq turlari",ru:"Виды налогов",ic:"tax",m:"coins",mu:"Halol to‘langan soliq — obod yurt poydevori.",mr:"Честно уплаченный налог — основа процветания страны."},
   {n:"IV",c:"#a855f7",from:19,to:21,uz:"Iqtisodiy o‘sish",ru:"Экономический рост",ic:"up",m:"grow",mu:"O‘sish — har kuni oldinga bir qadam.",mr:"Рост — каждый день шаг вперёд."},
   {n:"V",c:"#ef4444",from:22,to:25,uz:"Inflatsiya va ishsizlik",ru:"Инфляция и безработица",ic:"percent",m:"target",mu:"Pul qadrini bilgan — farovonlikka erishadi.",mr:"Кто знает цену деньгам — достигает благополучия."},
   {n:"VI",c:"#14b8a6",from:26,to:30,uz:"Jahon iqtisodiyoti",ru:"Мировая экономика",ic:"globe",m:"flag",mu:"Jahon bozori — yangi imkoniyatlar maydoni.",mr:"Мировой рынок — пространство новых возможностей."}
  ]}
};
var ORDER=["9","11"];
function q(){var m=/[?&]g=(\d+)/.exec(location.search);return m&&GRADES[m[1]]?m[1]:null}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
var cur=q()||ls("tb-grade");if(!GRADES[cur])cur="11";
if(q())ls("tb-grade",cur);
window.TB_GRADES=GRADES;window.TB_GRADE_ORDER=ORDER;window.TB_G=GRADES[cur];
/* sinfni almashtirish: saqlab, sahifani qayta yuklaydi */
window.TBGrade={
 cur:cur,
 set:function(id){if(!GRADES[id]||id===cur)return false;ls("tb-grade",id);var s=location.search.replace(/[?&]g=\d+/,"").replace(/^&/,"?");location.href=location.pathname+(s==="?"?"":s);return true},
 key:function(k){return cur==="11"?k:k+"-g"+cur},          /* localStorage kalitlari sinfga ajratiladi */
 video:function(n){return (cur==="11"?"":"g"+cur+"-")+"t"+(n<10?"0":"")+n}
};
})();
