TB.add({
n:23,page:110,title:"Talab va taklif o‘zgarishining bozor narxiga ta’siri",
sum:"Narxdan tashqari omillar ta’sirida talab yoki taklif o‘zgarganda bozor narxi va muvozanat miqdorining o‘zgarishi: daromad oshishi (Spark), mavsum (palto), soliq oshishi, yangi texnologiya (Xiva gilamlari), mashqlar jadvali.",
learn:["Talab oshsa","Talab kamaysa","Taklif kamaysa","Taklif oshsa","Ikki omil birga","Amaliy vaziyatlar"],
hook:{q:"Aholi daromadi oshdi. «Spark» avtomobilining narxi va sotilish hajmi qanday o‘zgaradi?",a:"Daromad oshib, avtomobilga <b>talab oshadi</b> — talab chizig‘i o‘ngga suriladi. Yangi kesishish nuqtasida <b>narx ham, sotilgan miqdor ham oshadi</b>: P↑ Q↑."},
slides:[
 {k:"table",tag:"TO‘RT HOLAT",h:"Kim surildi — nima o‘zgaradi?",head:["O‘zgarish","Chiziq","Narx (P)","Miqdor (Q)"],rows:[["Talab oshdi","D → o‘ngga","↑","↑"],["Talab kamaydi","D → chapga","↓","↓"],["Taklif oshdi","S → o‘ngga","↓","↑"],["Taklif kamaydi","S → chapga","↑","↓"]]},
 {k:"def",tag:"1-VAZIYAT",h:"Daromad oshdi — «Spark»",items:[["Nima o‘zgaradi?","Talab (normal tovar) — chiziq D o‘ngga."],["Natija","Muvozanat narx <b>oshadi</b>, sotib olish hajmi <b>oshadi</b>."]]},
 {k:"def",tag:"2-VAZIYAT",h:"Yoz keldi — palto",items:[["Nima o‘zgaradi?","Mavsum tufayli talab kamayadi — D chapga."],["Natija","Palto narxi <b>tushadi</b>, sotib olish hajmi <b>kamayadi</b>."]]},
 {k:"def",tag:"3-VAZIYAT",h:"Ishlab chiqaruvchilarga soliq oshdi",items:[["Nima o‘zgaradi?","Taklif (xarajat oshdi) — S chapga."],["Natija","Narx <b>oshadi</b>, muvozanat miqdor <b>kamayadi</b>."]]},
 {k:"def",tag:"4-VAZIYAT",h:"Xiva gilamlari — yangi dastgoh",items:[["Nima o‘zgaradi?","Taklif (unumli texnologiya) — S o‘ngga."],["Natija","Gilam narxi <b>tushadi</b>, sotilgan miqdor <b>oshadi</b>."]]},
 {k:"html",tag:"GRAFIK",h:"Talab oshganda",html:'<svg viewBox="0 0 520 250" style="width:100%;max-height:15rem"><line x1="50" y1="220" x2="500" y2="220" stroke="currentColor" opacity=".4"/><line x1="50" y1="220" x2="50" y2="10" stroke="currentColor" opacity=".4"/><text x="490" y="242" fill="currentColor" font-size="13">q</text><text x="56" y="18" fill="currentColor" font-size="13">p</text><line x1="80" y1="200" x2="380" y2="30" stroke="var(--down)" stroke-width="4"/><text x="384" y="30" fill="var(--down)" font-weight="700">S</text><line x1="80" y1="40" x2="320" y2="200" stroke="var(--sky)" stroke-width="3"/><text x="324" y="206" fill="var(--sky)" font-weight="700">D0</text><line x1="170" y1="40" x2="410" y2="200" stroke="var(--up)" stroke-width="3"/><text x="414" y="206" fill="var(--up)" font-weight="700">D1</text><circle cx="217" cy="131" r="7" fill="var(--sky)"/><circle cx="267" cy="103" r="7" fill="var(--gold)"/><text x="276" y="96" fill="currentColor" font-size="13">yangi M: P↑ Q↑</text></svg><p>Talab chizig‘i o‘ngga surilib, S bilan <b>yuqoriroq va o‘ngroqda</b> kesishadi.</p>'},
 {k:"html",tag:"MASHQ",h:"Bozorlardagi vaziyatlar",html:'<table class="cmpT"><thead><tr><th>Tovar</th><th>Vaziyat</th><th>Chiziq</th><th>P / Q</th></tr></thead><tbody><tr><td>Muzqaymoq</td><td>Ko‘p firma ishlab chiqarishga kirishdi</td><td>S → o‘ngga</td><td>P↓ Q↑</td></tr><tr><td>Charm kurtka</td><td>Charm narxi oshdi</td><td>S → chapga</td><td>P↑ Q↓</td></tr><tr><td>Daftar</td><td>Yozgi ta’til boshlandi</td><td>D → chapga</td><td>P↓ Q↓</td></tr><tr><td>Tramvay xizmati</td><td>Benzin narxi oshdi</td><td>D → o‘ngga</td><td>P↑ Q↑</td></tr><tr><td>Chinni idishlar</td><td>Yangi unumli texnologiya</td><td>S → o‘ngga</td><td>P↓ Q↑</td></tr></tbody></table>'},
 {k:"law",tag:"ALGORITM",h:"Har qanday vaziyatni qanday tahlil qilamiz?",q:"1) Omil <b>talabga</b>mi yoki <b>taklifga</b>mi ta’sir qiladi? 2) U oshadimi yoki kamayadimi? 3) Chiziq qaysi tomonga suriladi? 4) Yangi kesishish nuqtasida narx va miqdor qanday o‘zgardi?",src:"To‘rt qadamli tahlil"},
 {k:"fact",kind:"bilasizmi",h:"Ikki omil birdaniga",text:"Resurslar qimmatlasa (taklif ↓) va bir vaqtda o‘rinbosar tovar arzonlasa (talab ↓), miqdor albatta <b>kamayadi</b>, narx esa qaysi ta’sir kuchliroq bo‘lishiga qarab oshishi ham, tushishi ham mumkin."},
 {k:"review",qa:[["Daromad oshsa, normal tovar narxi?","Oshadi, miqdori ham oshadi."],["Yozda palto narxi?","Tushadi, sotilishi kamayadi."],["Soliq oshsa?","Taklif kamayadi: narx oshadi, miqdor kamayadi."],["Yangi texnologiya?","Taklif oshadi: narx tushadi, miqdor oshadi."],["Benzin qimmatlasa, tramvayga talab?","Oshadi — tramvay avtomobilning o‘rinbosari."],["Aholi soni o‘ssa?","Talab oshadi: P↑ Q↑."]]}
],
terms:[["Talabning oshishi","D chizig‘ining o‘ngga surilishi."],["Talabning kamayishi","D chizig‘ining chapga surilishi."],["Taklifning oshishi","S chizig‘ining o‘ngga surilishi."],["Taklifning kamayishi","S chizig‘ining chapga surilishi."],["Yangi muvozanat","Surilgan chiziqlarning yangi kesishish nuqtasi."],["P↑ Q↑","Narx va miqdor oshdi (talab oshganda)."],["P↓ Q↑","Narx tushdi, miqdor oshdi (taklif oshganda)."],["P↑ Q↓","Narx oshdi, miqdor kamaydi (taklif kamayganda)."],["P↓ Q↓","Narx va miqdor kamaydi (talab kamayganda)."]],
sorts:[
 {t:"Omil nimaga ta’sir qiladi?",L:"Talabga",R:"Taklifga",items:[["Aholi daromadi oshdi","L","Xaridor."],["Soliq oshirildi","R","Ishlab chiqaruvchi xarajati."],["Yoz keldi (palto)","L","Mavsum."],["Yangi to‘quv dastgohi","R","Texnologiya."],["Benzin qimmatladi (tramvay)","L","O‘rinbosar."],["Charm qimmatladi","R","Resurs narxi."]]},
 {t:"Narx qanday o‘zgaradi?",L:"Oshadi (P↑)",R:"Tushadi (P↓)",items:[["Daromad oshdi (Spark)","L","Talab ↑."],["Ko‘p firma muzqaymoq ishlab chiqara boshladi","R","Taklif ↑."],["Soliq oshdi","L","Taklif ↓."],["Yozgi ta’til (daftar)","R","Talab ↓."],["Charm qimmatladi (kurtka)","L","Taklif ↓."],["Chinni zavodida yangi texnologiya","R","Taklif ↑."]]}
],
quiz:[
 ["Talab oshsa, narx va miqdor?",["P↑ Q↑","P↓ Q↓","P↑ Q↓","P↓ Q↑"]],
 ["Taklif oshsa?",["P↓ Q↑","P↑ Q↑","P↑ Q↓","P↓ Q↓"]],
 ["Taklif kamaysa?",["P↑ Q↓","P↓ Q↑","P↑ Q↑","P↓ Q↓"]],
 ["Talab kamaysa?",["P↓ Q↓","P↑ Q↑","P↓ Q↑","P↑ Q↓"]],
 ["Daromad oshganda «Spark» talab chizig‘i?",["O‘ngga","Chapga","Joyida","Pastga"]],
 ["Yozda palto talab chizig‘i?",["Chapga","O‘ngga","Joyida","Yuqoriga"]],
 ["Soliq oshishi nimaga ta’sir qiladi?",["Taklifga","Talabga","Ikkalasiga emas","Faqat davlatga"]],
 ["Yangi dastgoh gilam narxiga?",["Tushiradi","Oshiradi","Ta’sir qilmaydi","Ikki baravar oshiradi"]],
 ["Ko‘p firma muzqaymoq ishlab chiqara boshladi —",["P↓ Q↑","P↑ Q↓","P↑ Q↑","P↓ Q↓"]],
 ["Charm qimmatladi — charm kurtka bozori?",["P↑ Q↓","P↓ Q↑","P↓ Q↓","P↑ Q↑"]],
 ["Yozgi ta’til — daftar bozori?",["P↓ Q↓","P↑ Q↑","P↑ Q↓","P↓ Q↑"]],
 ["Benzin qimmatlasa, tramvay xizmatiga talab?",["Oshadi","Kamayadi","O‘zgarmaydi","Yo‘qoladi"]]
],
cards:[["Talab ↑?","D o‘ngga: P↑ Q↑."],["Talab ↓?","D chapga: P↓ Q↓."],["Taklif ↑?","S o‘ngga: P↓ Q↑."],["Taklif ↓?","S chapga: P↑ Q↓."],["Spark va daromad?","Talab oshadi: narx va sotuv oshadi."],["Palto va yoz?","Talab kamayadi: narx va sotuv kamayadi."],["Soliq oshishi?","Taklif kamayadi: narx oshadi, miqdor kamayadi."],["Xiva gilami va yangi dastgoh?","Taklif oshadi: narx tushadi, miqdor oshadi."],["Muzqaymoqqa ko‘p firma kirdi?","P↓ Q↑."],["Benzin va tramvay?","O‘rinbosar qimmatladi: tramvayga talab ↑, P↑ Q↑."],["Tahlil algoritmi?","Talab/taklif → oshdi/kamaydi → chiziq qayoqqa → yangi P va Q."],["Ikki omil birga?","Miqdor yo‘nalishi aniq, narx qaysi ta’sir kuchliligiga bog‘liq bo‘lishi mumkin."]],
tasks:[
 {t:"Sakkiz omil",q:"Har bir omil talabga yoki taklifga ta’sir qiladimi va narx qanday o‘zgaradi? a) aholi soni o‘sdi; b) resurslar qimmatladi; d) daromad kamaydi; e) o‘rinbosar arzonladi; f) soliq imtiyozi berildi; g) to‘ldiruvchi qimmatladi; h) narx oshishi kutilmoqda; i) sotuvchilar ko‘paydi.",steps:[["Talab ↑ (P↑)","a) aholi o‘sdi; h) narx oshishi kutilmoqda"],["Talab ↓ (P↓)","d) daromad kamaydi (normal tovar); e) o‘rinbosar arzonladi; g) to‘ldiruvchi qimmatladi"],["Taklif ↓ (P↑)","b) resurslar qimmatladi"],["Taklif ↑ (P↓)","f) soliq imtiyozi; i) sotuvchilar ko‘paydi"]],answer:"Avval omilning <b>kimga</b> ta’sir qilishini aniqlang — qolgani avtomatik kelib chiqadi."},
 {t:"Ikki omil birga",q:"b) resurslar qimmatladi va e) o‘rinbosar tovar arzonladi — ikkalasi bir vaqtda ta’sir qilsa, bozor narxi va miqdor qanday o‘zgaradi?",steps:[["b) ta’siri","Taklif kamayadi: S chapga — narx ↑, miqdor ↓"],["e) ta’siri","Talab kamayadi: D chapga — narx ↓, miqdor ↓"],["Miqdor","Ikkala ta’sir ham kamaytiradi — <b>albatta kamayadi</b>"],["Narx","Biri oshiradi, biri tushiradi — kuchliroq ta’sirga bog‘liq"]],answer:"Ikki omil bir yo‘nalishda ta’sir qilsa, natija aniq; qarama-qarshi bo‘lsa, <b>qaysi kuchliroq</b>ligini bilish kerak."}
],
film:[
 {t:"Daromad oshdi",bg:"city",s:["Aholi daromadi oshdi.","«Spark»ga talab o‘sdi — narx ham, sotuv ham oshdi."],a:[["coins",400,420,4],["truck",850,"SPARK",{d:.5}],["chart",1300,160,"up","P↑ Q↑",{s:.6,d:1}]]},
 {t:"Yozda palto",bg:"day",s:["Yoz keldi — paltoga talab kamaydi.","Narx tushdi, sotuv kamaydi."],a:[["shop",450,"PALTO",{s:.75}],["chart",1000,160,"down","P↓ Q↓",{s:.7,d:.6}]]},
 {t:"Soliq oshdi",bg:"office",s:["Ishlab chiqaruvchilarga soliq oshirildi.","Taklif kamaydi — narx oshdi."],a:[["gov",400,"SOLIQ ▲",{s:.7}],["factory",850,"ZAVOD",{s:.6,d:.5}],["chart",1300,160,"up","P↑ Q↓",{s:.55,d:1}]]},
 {t:"Xiva gilamlari",bg:"gold",s:["Yangi dastgoh unumdorlikni oshirdi.","Gilamlar ko‘paydi va arzonladi."],a:[["gears",450,400,{s:1}],["factory",900,"GILAM",{s:.65,d:.5}],["chart",1300,160,"down","P↓ Q↑",{s:.55,d:1}]]},
 {t:"Tramvay",bg:"city",s:["Benzin qimmatladi.","Ko‘pchilik tramvayga o‘tdi — unga talab oshdi."],a:[["truck",400,"BENZIN ▲"],["arrow",620,450,820,450,{d:.6}],["crowd",1050,4,{s:.55,d:.9}]]},
 {t:"To‘rt qadam",bg:"gold",s:["Talabmi, taklifmi? Oshdimi, kamaydimi?","Chiziq qayoqqa? Narx va miqdor qanday?"],a:[["minis",4,["Kimga?","Qanday?","Qayoqqa?","P va Q"]]]}
]
});
