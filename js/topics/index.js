/* Mavzular ro‘yxati: har bir fayl TB.add({...}) chaqiradi.
   Joriy sinf papkasidan yuklanadi (js/grades.js → TB_G.dir):
   o‘zbekcha: <dir>/tNN.js · ruscha: <dir>/ru/tNN.js (lang:"ru") */
(function(){var G=window.TB_G||{dir:"js/topics",extra:true},ru=window.TBL&&TBL.lang==="ru";
 for(var i=1;i<=30;i++){var n=(i<10?"0":"")+i;document.write('<script src="'+G.dir+'/t'+n+'.js"><\/script>');if(ru)document.write('<script src="'+G.dir+'/ru/t'+n+'.js" onerror="void 0"><\/script>')}
 if(G.extra)document.write('<script src="js/topics/extra-cards.js"><\/script>')})();
