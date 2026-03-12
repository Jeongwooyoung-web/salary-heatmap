import os
import re

dropdown_html = """
        <div class="relative ml-4 header__lang" id="langDropdownContainer">
          <button id="langSelectBtn" class="flex items-center text-gray-500 hover:text-primary-600 transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21.121 12A9.135 9.135 0 0121 12c-0.612 0-1.196-0.126-1.724-0.348C18.423 11.233 18 10.669 18 10c0-.853-0.536-1.579-1.298-1.854C16.321 8.01 16 7.533 16 7v-1c0-.552-.448-1-1-1H9.5a1 1 0 01-1-1V3.935A9.09 9.09 0 003.055 11" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22a10 10 0 110-20 10 10 0 010 20z" />
            </svg>
            <span id="currentLangLabel">KOR</span>
          </button>
          <div id="langDropdownMenu" class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg hidden z-50 border border-gray-100">
            <ul class="py-1 text-sm text-gray-700">
              <li><button class="block w-full text-left px-4 py-2 hover:bg-gray-100 lang-option" data-lang="ko">한국어 (KOR)</button></li>
              <li><button class="block w-full text-left px-4 py-2 hover:bg-gray-100 lang-option" data-lang="en">English (ENG)</button></li>
              <li><button class="block w-full text-left px-4 py-2 hover:bg-gray-100 lang-option" data-lang="tl">Filipino (TAG)</button></li>
            </ul>
          </div>
        </div>
"""

i18n_script = '<script src="js/i18n.js"></script>'

html_files = ['index.html', 'heatmap.html', 'treemap.html', 'calculator.html', 'report.html']

for file in html_files:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 들어있으면 스킵
    if 'id="langDropdownContainer"' not in content:
        # </nav> 바로 뒤에 주입
        content = content.replace('</nav>', '</nav>\n' + dropdown_html)
        print(f"Added dropdown to {file}")

    if i18n_script not in content:
        content = content.replace('</body>', f'    {i18n_script}\n  </body>')
        print(f"Added i18n script to {file}")

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done.")
