/* =========================================================
   Til: o‘zbekcha (asosiy) / русский
   Kalit — o‘zbekcha matn, qiymat — ruscha tarjima.
   ========================================================= */
(function(){
"use strict";
var lang="uz";try{lang=localStorage.getItem("tb-lang")||"uz"}catch(e){}
var qm=/[?&]lang=(uz|ru)/.exec(location.search);if(qm)lang=qm[1];
if(lang!=="ru")lang="uz";
var RU={
/* --- admin kirish --- */
"Admin panelga kirish":"Вход в админ-панель","Administrator email va parolini kiriting.":"Введите email и пароль администратора.","Email":"Email","Parol":"Пароль","Kirish":"Войти","← Saytga qaytish":"← Вернуться на сайт","Parolni ko‘rsatish":"Показать пароль",
"Email yoki parol noto‘g‘ri":"Неверный email или пароль","Juda ko‘p urinish. Birozdan keyin qayta urining.":"Слишком много попыток. Повторите позже.","Firebase’da Email/Password kirish usuli yoqilmagan.":"В Firebase не включён вход по Email/Password.","Bu akkaunt administrator emas":"Этот аккаунт не является администратором","Brauzer parolni tekshira olmadi":"Браузер не смог проверить пароль","Admin panel · Tadbirkorlik asoslari":"Админ-панель · Основы предпринимательства",

/* --- umumiy --- */
"Yopish":"Закрыть","Taymer":"Таймер","Boshlash":"Старт","Qayta o‘rnatish":"Сброс","Pauza":"Пауза",
"Kim javob beradi?":"Кто отвечает?","Tanlash":"Выбрать","O‘quvchilar soni (jurnal raqami)":"Число учеников (номер в журнале)",
"yoki ismlar (har biri yangi qatorda)":"или имена (каждое с новой строки)","Kartani aylantirish":"Перевернуть карточку",
"Bosing: javobni ko‘rish":"Нажмите, чтобы увидеть ответ","Javob":"Ответ","‹ Oldingi":"‹ Назад","✗ Bilmadi":"✗ Не знал","✓ Bildi":"✓ Знал","Keyingi ›":"Далее ›",
"Menyu":"Меню","11-sinf":"11 класс","Tadbirkorlik asoslari":"Основы предпринимательства",
"Rang":"Цвет","Qalinlik":"Толщина","O‘chirg‘ich":"Ластик","Tozalash":"Очистить",
/* --- boblar va bo‘limlar --- */
"Tadbirkorlik, uning turlari va shakllari":"Предпринимательство, его виды и формы",
"Tadbirkorlikni tashkil etish":"Организация предпринимательства",
"Korxona mablag‘lari, xarajatlari va moliyaviy natijalari":"Средства, затраты и финансовые результаты предприятия",
"Tadbirkorlik muvaffaqiyati asoslari":"Основы успеха в предпринимательстве",
"Tadbirkorlikda risk va raqobatdoshlik":"Риск и конкурентоспособность в предпринимательстве",
"Slaydlar":"Слайды","Multfilm":"Мультфильм","Video dars":"Видеоурок","Lug‘at":"Словарь","Saralash":"Сортировка","Jamoa jangi":"Битва команд","Savol-javob":"Вопрос-ответ","Amaliy topshiriq":"Практика",
"Oldingi mavzu":"Предыдущая тема","Keyingi mavzu":"Следующая тема","Barcha mavzular":"Все темы","Kutubxona":"Библиотека",
"11-sinf · 30 ta mavzu":"11 класс · 30 тем","Boshqaruv":"Управление","Admin panel":"Админ-панель",
/* --- kutubxona --- */
"11-sinf · U. G‘afurov, Q. Sharipov":"11 класс · У. Гафуров, К. Шарипов",
"30 ta mavzu, 5 ta bob. Kitobni javondan oling: har bir mavzuda slaydlar, multfilm, video, o‘yinlar va amaliy topshiriqlar bor.":"30 тем, 5 глав. Возьмите книгу с полки: в каждой теме — слайды, мультфильм, видео, игры и практические задания.",
"Mavzu qidirish…":"Поиск темы…","Javon":"Полка","Ro‘yxat":"Список","Oxirgi ochilgan dars · ":"Последний открытый урок · "," mavzu ko‘rilgan":" тем просмотрено",
"Davom ettirish":"Продолжить","Siz administratorsiz. ":"Вы — администратор. ","Admin panelni ochish":"Открыть админ-панель","Darsni boshlash":"Начать урок",
" atama · ":" терминов · "," savol · ":" вопросов · "," kartochka":" карточек",
/* --- slaydlar --- */
"Oldingi slayd":"Предыдущий слайд","Keyingi slayd":"Следующий слайд","Bugun bilib olamiz:":"Сегодня узнаем:","Faollashtiruvchi savol":"Вопрос для разминки",
"Fikrlar va javob":"Мнения и ответ","bosing":"нажмите","BILIMINGIZNI SINAB KO‘RING":"ПРОВЕРЬТЕ СВОИ ЗНАНИЯ","Takrorlash savollari":"Вопросы для повторения",
"BILASIZMI?":"ЗНАЕТЕ ЛИ ВЫ?","BU QIZIQ...":"ЭТО ИНТЕРЕСНО...","javob":"ответ",
/* --- multfilm --- */
"Multfilmni boshlash":"Запустить мультфильм"," sahna · taxminan ":" сцен · примерно "," daqiqa · musiqa bilan":" мин · с музыкой",
"Oldingi sahna":"Предыдущая сцена","Keyingi sahna":"Следующая сцена","Boshidan":"Сначала","Davom etish":"Продолжить","Musiqa: yoniq":"Музыка: вкл","Musiqa: o‘chiq":"Музыка: выкл",
"Boshlanish":"Начало","AKSIYA":"АКЦИИ","BANK":"БАНК","DAVLAT":"ГОСУДАРСТВО","DO‘KON":"МАГАЗИН","HUJJAT":"ДОКУМЕНТ","OFIS":"ОФИС","YUK":"ГРУЗ","ZAVOD":"ЗАВОД","so‘m":"сум",
/* --- video --- */
" — video dars":" — видеоурок","Video ochilmasa: ":"Если видео не открывается: ","YouTube’da ochish ↗":"Открыть на YouTube ↗",
"Bu mavzuga video hali qo‘shilmagan":"Видео к этой теме ещё не добавлено",
"Admin panelda «Mavzular videolari» bo‘limiga YouTube havolasini qo‘ying.":"Вставьте ссылку YouTube в разделе «Видео к темам» админ-панели.",
"Video qo‘shilishi uchun administratorga murojaat qiling.":"Чтобы добавить видео, обратитесь к администратору.",
/* --- lug‘at --- */
"Lug‘at · ":"Словарь · "," ta atama":" терминов","Tushunchalar kartalari":"Карточки понятий",
"O‘quvchi atamaning ma’nosini aytadi, keyin kartani bosib tekshiradi.":"Ученик называет значение термина, затем переворачивает карточку и проверяет.",
"Hammasini aylantirish":"Перевернуть все","Bosing va tekshiring":"Нажмите и проверьте",
/* --- saralash --- */
"Bu mavzu uchun saralash o‘yini yo‘q.":"Для этой темы нет игры-сортировки.","O‘yin":"Игра","Qaysi tomonga?":"Куда отнести?",
"Gapni o‘qing va to‘g‘ri tomonni bosing. Butun sinf birga javob beradi.":"Прочитайте утверждение и нажмите нужную сторону. Отвечает весь класс.",
"To‘g‘ri: ":"Верно: ","Xato: ":"Ошибка: ","Seriya: ":"Серия: ","Qaytadan":"Заново","Tugadi!":"Готово!","Ajoyib! Hammasi to‘g‘ri!":"Отлично! Всё верно!",
"Yaxshi! Yana bir marta urinib ko‘ring":"Хорошо! Попробуйте ещё раз"," ta":" шт.","To‘g‘ri!":"Верно!","Xato.":"Ошибка.","To‘g‘ri javob: ":"Правильный ответ: ",
/* --- viktorina --- */
"Startapchilar":"Стартаперы","Investorlar":"Инвесторы","Viktorina · ":"Викторина · "," ta savol":" вопросов",
"Sinfni ikki jamoaga bo‘ling. Navbat bilan javob berasiz: har bir to‘g‘ri javob 10 ball, tez javob uchun bonus. Har jamoada bitta «50/50» yordami bor.":"Разделите класс на две команды. Отвечайте по очереди: за верный ответ 10 баллов, за быстрый — бонус. У каждой команды одна подсказка «50/50».",
"1-jamoa nomi":"Команда 1","2-jamoa nomi":"Команда 2","Savollar soni":"Количество вопросов","Har savolga vaqt":"Время на вопрос",
"15 soniya":"15 секунд","20 soniya":"20 секунд","30 soniya":"30 секунд","45 soniya":"45 секунд","Jangni boshlash":"Начать битву","Navbat":"Ходит",
"Keyingi savol":"Следующий вопрос","To‘g‘ri! +":"Верно! +"," ball":" баллов"," (tezlik bonusi)":" (бонус за скорость)","Vaqt tugadi!":"Время вышло!","Afsus, xato.":"Увы, неверно.",
"Natijalarni ko‘rish":"Посмотреть результаты","Jang yakunlandi":"Битва окончена","Durang!":"Ничья!"," g‘olib!":" — победитель!","Yana o‘ynash":"Сыграть ещё",
/* --- kartochkalar --- */
" ta savol-javob":" вопросов-ответов","Savol-javob kartochkalari":"Карточки «вопрос-ответ»",
"Raqamni tanlang. O‘quvchi savolga javob beradi, keyin kartani bosib to‘g‘ri javobni tekshiramiz.":"Выберите номер. Ученик отвечает на вопрос, затем переворачиваем карточку и проверяем ответ.",
"Bildi: ":"Знали: ","Bilmadi: ":"Не знали: ","Qoldi: ":"Осталось: ","Tasodifiy karta":"Случайная карточка","✓ bildi":"✓ знал","✗ bilmadi":"✗ не знал","savol":"вопрос",
"✓ Avval to‘g‘ri javob berilgan":"✓ Ранее ответили верно","✗ Avval javob topilmagan":"✗ Ранее ответ не нашли",
/* --- amaliy --- */
"Mavzu yuzasidan amaliy topshiriq":"Практическое задание по теме","Amaliy topshiriqlar":"Практические задания",
"Avval sinf bilan muhokama qiling, keyin yechimni qadamma-qadam oching.":"Сначала обсудите с классом, затем открывайте решение шаг за шагом.",
"Yechimni boshlash":"Начать решение","Javobni ko‘rsatish":"Показать ответ","Ha":"Да","Yo‘q":"Нет","Natijani ko‘rish (":"Показать результат (","Tugadi":"Готово"," ball.":" баллов.",
/* --- admin --- */
"Saytga kim kira olishini shu yerda boshqarasiz. Ro‘yxatdagi emaillar Google akkaunti bilan kirganda darslarni ko‘ra oladi, qolganlarga «Siz kira olmaysiz» sahifasi chiqadi.":"Здесь вы управляете доступом к сайту. Адреса из списка смогут открывать уроки после входа через Google, остальные увидят страницу «Вход запрещён».",
"Ruxsat berilgan emaillar":"Разрешённые адреса","Izoh (masalan: 11-A sinf o‘qituvchisi)":"Примечание (например: учитель 11-А)","Qo‘shish":"Добавить",
"Ro‘yxatdan qidirish…":"Поиск по списку…","Mavzular videolari":"Видео к темам",
"Har mavzuga YouTube havolasini yoki iframe kodini qo‘ying. U «Video dars» bo‘limida chiqadi.":"Вставьте ссылку YouTube или iframe-код к каждой теме. Видео появится в разделе «Видеоурок».",
"Ma’lumot":"Информация","Administrator: ":"Администратор: ",
". Administrator ro‘yxatda bo‘lmasa ham doim kira oladi. Siz kirgan akkaunt: ":". Администратор всегда имеет доступ, даже если его нет в списке. Ваш аккаунт: ",
"(DEMO rejim: o‘zgarishlar faqat shu brauzerda saqlanadi)":"(ДЕМО-режим: изменения сохраняются только в этом браузере)",
"Administrator":"Администратор"," · qo‘shilgan: ":" · добавлен: ","O‘chirish":"Удалить","Bekor":"Отмена",
"Hali hech kim qo‘shilmagan. Yuqoridagi formadan email qo‘shing.":"Пока никого нет. Добавьте адрес через форму выше.",
" o‘chirildi":" удалён","Ro‘yxatni yuklab bo‘lmadi: ":"Не удалось загрузить список: ","Email noto‘g‘ri":"Неверный email","Bu email ro‘yxatda bor":"Этот email уже в списке",
" qo‘shildi":" добавлен","https://youtu.be/… yoki iframe kodi":"https://youtu.be/… или iframe-код","Saqlash":"Сохранить","YouTube havolasi tanilmadi":"Ссылка YouTube не распознана","Saqlandi":"Сохранено",
"DEMO rejim · Firebase sozlanmagan":"ДЕМО-режим · Firebase не настроен",
/* --- auth --- */
"Demo rejimda chiqish yo‘q":"В демо-режиме выход недоступен","Internetga ulanib bo‘lmadi. Sahifani yangilang.":"Нет подключения к интернету. Обновите страницу.",
"Bu domen Firebase’da ruxsat etilmagan. Authentication → Settings → Authorized domains bo‘limiga sayt domenini qo‘shing.":"Этот домен не разрешён в Firebase. Добавьте домен сайта в Authentication → Settings → Authorized domains.",
"Kirishda xato: ":"Ошибка входа: ",
/* --- index.html (statik) --- */
"Yuklanmoqda":"Загрузка","11-sinf · Interaktiv darslik":"11 класс · Интерактивный учебник",
"Saytga faqat administrator ruxsat bergan foydalanuvchilar kira oladi. Google akkauntingiz bilan kiring.":"Доступ к сайту есть только у пользователей, одобренных администратором. Войдите через аккаунт Google.",
"Google orqali kirish":"Войти через Google","Siz kira olmaysiz":"Вход запрещён",
"Bu akkauntga saytdan foydalanish uchun ruxsat berilmagan. Ruxsat olish uchun administratorga murojaat qiling.":"У этого аккаунта нет доступа к сайту. Чтобы получить доступ, обратитесь к администратору.",
"Boshqa akkaunt bilan kirish":"Войти с другим аккаунтом","Sayt hali sozlanmagan":"Сайт ещё не настроен",
"fayliga Firebase loyihasi ma’lumotlarini kiriting. Yo‘riqnoma README.md faylida.":"— впишите в этот файл данные проекта Firebase. Инструкция — в README.md.",
"Demo rejimda ko‘rish":"Открыть в демо-режиме","Yoki saytni Firebase’siz, demo rejimda ko‘rib chiqing:":"Или посмотрите сайт без Firebase, в демо-режиме:",
"o‘quv birjasi · kompaniyalar o‘ylab topilgan":"учебная биржа · компании вымышленные",
"Tasodifiy o‘quvchi":"Случайный ученик","Doskaga chizish":"Рисовать на доске","Chizish":"Рисовать","Ovoz":"Звук","Yorug‘ yoki qorong‘i":"Светлая или тёмная тема",
"To‘liq ekran":"Полный экран","Chiqish":"Выход","Asboblar":"Инструменты","Bo‘limlar":"Разделы","Oldingi":"Назад","Keyingi":"Далее","Til":"Язык"
};
function tr(s){if(lang!=="ru"||s==null)return s;var r=RU[s];return r===undefined?s:r}
/* Raqamli yozuvlar: "5-mavzu" ↔ "Тема 5" */
var F={
 mv:function(n){return lang==="ru"?"Тема "+n:n+"-mavzu"},
 MV:function(n){return lang==="ru"?"ТЕМА "+n:n+"-MAVZU"},
 mvs:function(a,b){return lang==="ru"?"Темы "+a+"–"+b:a+"–"+b+"-mavzular"},
 bob:function(c){return lang==="ru"?"Глава "+c:c+" bob"},
 BOB:function(c){return lang==="ru"?"ГЛАВА "+c:c+" BOB"},
 savol:function(i,n){return lang==="ru"?"Вопрос "+i+" / "+n:i+" / "+n+"-savol"},
 qism:function(i){return lang==="ru"?"Раздел "+i:i+"-bo‘lim"},
 topsh:function(i){return lang==="ru"?"Задание "+i:i+"-topshiriq"},
 bet:function(p){return lang==="ru"?"Учебник, с. "+p:"Darslik, "+p+"-bet"},
 slayd:function(i){return lang==="ru"?"Слайд "+i:i+"-slayd"},
 dur:function(s){return s<60?s+(lang==="ru"?" с":" s"):(s/60)+(lang==="ru"?" мин":" daq")}
};
function setLang(l){var ok=false;try{localStorage.setItem("tb-lang",l);ok=localStorage.getItem("tb-lang")===l}catch(e){}if(ok&&!/[?&]lang=/.test(location.search)){location.reload();return}var q=location.search.replace(/[?&]lang=(uz|ru)/,"").replace(/^&/,"?");var demo=window.TB&&TB.user&&TB.user.demo&&!/demo/.test(q);q=(q&&q!=="?"?q+"&":"?")+"lang="+l+(demo?"&demo":"");location.href=location.pathname+q+location.hash}
/* index.html dagi statik matnlarni tarjima qilish */
function applyStatic(root){if(lang!=="ru")return;root=root||document.body;
 var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),nodes=[],n;while((n=w.nextNode()))nodes.push(n);
 nodes.forEach(function(t){var s=t.nodeValue.trim();if(s&&RU[s]!==undefined)t.nodeValue=t.nodeValue.replace(s,RU[s])});
 Array.prototype.forEach.call(root.querySelectorAll("[aria-label],[placeholder],[title]"),function(e){["aria-label","placeholder","title"].forEach(function(a){var v=e.getAttribute(a);if(v&&RU[v]!==undefined)e.setAttribute(a,RU[v])})});
 document.documentElement.lang="ru";document.title="Основы предпринимательства · 11 класс"}
window.TBL={lang:lang,tr:tr,F:F,setLang:setLang,applyStatic:applyStatic,RU:RU};
})();
