import os
import glob

html_files = glob.glob('*.html')
for file in html_files:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('<header class="header">', '<header class="header relative z-50">')
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Header z-index updated.")
