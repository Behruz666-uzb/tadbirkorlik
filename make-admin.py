# admin.html ni index.html dan yasaydi (index.html o'zgarsa qayta ishga tushiring: python3 make-admin.py)
import re
s=open('index.html',encoding='utf-8').read()
s=re.sub(r'<title>.*?</title>','<title>Admin panel · Tadbirkorlik asoslari</title>',s,count=1)
s=s.replace('<script src="js/config.js"></script>','<script>window.TB_MODE="admin"</script>\n<script src="js/config.js"></script>',1)
s=s.replace('<head>','<head>\n<meta name="robots" content="noindex">',1)
open('admin.html','w',encoding='utf-8').write(s)
print('admin.html tayyor')
