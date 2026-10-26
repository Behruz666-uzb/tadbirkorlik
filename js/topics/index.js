/* Mavzular ro‘yxati: har bir fayl TB.add({...}) chaqiradi.
   O‘zbekcha: js/topics/tNN.js · Ruscha: js/topics/ru/tNN.js (lang:"ru") */
(function(){var ru=window.TBL&&TBL.lang==="ru";for(var i=1;i<=30;i++){var n=(i<10?"0":"")+i;document.write('<script src="js/topics/t'+n+'.js"><\/script>');if(ru)document.write('<script src="js/topics/ru/t'+n+'.js" onerror="void 0"><\/script>')}})();
