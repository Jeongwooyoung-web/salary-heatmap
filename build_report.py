import re
import os

source_file = r"C:\Users\Admin\Downloads\teacher_evaluation_report.html"
dest_file = r"C:\Users\Admin\.gemini\antigravity\scratch\salary-calculator\report.html"
index_file = r"C:\Users\Admin\.gemini\antigravity\scratch\salary-calculator\index.html"

# Read original index to extract dashboard header
with open(index_file, 'r', encoding='utf-8') as f:
    index_html = f.read()

# Extract from <head> to </header>
dashboard_head = re.search(r'(<!doctype html>.*?</header>)', index_html, re.DOTALL).group(1)

# Read report file
with open(source_file, 'r', encoding='utf-8') as f:
    report_html = f.read()

# Extract Chart.js script
chart_script = re.search(r'<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart\.js/4\.4\.1/chart\.umd\.min\.js"></script>', report_html)
chart_script_tag = chart_script.group(0) if chart_script else ''

# Extract styles
style_match = re.search(r'<style>(.*?)</style>', report_html, re.DOTALL)
report_style = style_match.group(1) if style_match else ''
# Cleanup body and *
report_style = re.sub(r'body\s*\{[^}]*\}', '', report_style)
report_style = re.sub(r'\*\s*\{[^}]*\}', '', report_style)

# Rename classes in style
report_style = report_style.replace('.header', '.report-header')
report_style = report_style.replace('.nav', '.report-nav')
report_style = report_style.replace('.content', '.report-content')
report_style = report_style.replace('table', '#report-wrapper table')
report_style = report_style.replace('td', '#report-wrapper td')

# Extract body inner HTML and script
body_match = re.search(r'<body>(.*?)</body>', report_html, re.DOTALL)
report_body_full = body_match.group(1) if body_match else ''

# Separate HTML content and inline script
script_start = report_body_full.rfind('<script>')
if script_start != -1:
    report_body_html = report_body_full[:script_start]
    report_inline_script = report_body_full[script_start:]
else:
    report_body_html = report_body_full
    report_inline_script = ''

# Rename classes in HTML
report_body_html = report_body_html.replace('class="header"', 'class="report-header"')
report_body_html = report_body_html.replace('class="nav"', 'class="report-nav"')
report_body_html = report_body_html.replace('class="nav ', 'class="report-nav ')
report_body_html = report_body_html.replace('id="nav"', 'id="report-nav"')
report_body_html = report_body_html.replace('class="content"', 'class="report-content"')

# Rename selectors in Inline script
report_inline_script = report_inline_script.replace('getElementById("nav")', 'getElementById("report-nav")')
report_inline_script = report_inline_script.replace("getElementById('nav')", "getElementById('report-nav')")
report_inline_script = report_inline_script.replace('(".nav', '(".report-nav')
report_inline_script = report_inline_script.replace("('.nav", "('.report-nav")

# Build the final document
final_html = dashboard_head + f'''

    <!-- Report Styles -->
    <style>
      /* Namespaced report styles */
      #report-wrapper {{
        font-family: Arial, sans-serif;
        color: #333;
      }}
      {report_style}
      /* Tailwind override fix */
      #report-wrapper table {{ border-collapse: collapse; margin: 10px 0; font-size: 9pt; width: max-content; }}
      #report-wrapper td {{ border: 1px solid #ddd; padding: 4px 8px; vertical-align: middle; white-space: pre-wrap; }}
    </style>
    {chart_script_tag}

    <main class="dashboard-main max-w-none mx-auto py-8 px-4 bg-gray-50">
      <div id="report-wrapper" class="max-w-[1400px] mx-auto bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden mt-2">
        {report_body_html}
      </div>
    </main>

    {report_inline_script}
  </body>
</html>
'''

# Add "Evaluation Report" to the Active state
# Replace 'title>MANGOI | 대시보드</title>' with 'title>MANGOI | Evaluation Report</title>'
final_html = final_html.replace('<title>MANGOI | 대시보드</title>', '<title>MANGOI | Evaluation Report</title>')

# For the nav active state, we need to remove primary-600 from 'Home' and add it to 'Evaluation Report' (which doesn't exist yet, we will add it across all pages next)
# Actually, the header nav needs to be updated with the new menu item.
navbar_addition = """
            <li>
              <a href="report.html" class="header__nav-link header__nav-link--active text-primary-600 font-bold">Evaluation Report</a>
            </li>
"""
# First, let's just make the Home link inactive in the extracted header.
final_html = final_html.replace('header__nav-link--active text-primary-600', 'hover:text-primary-500 transition-colors')

# Inject the new list item into the `<ul>`
final_html = final_html.replace('</ul>', navbar_addition + '          </ul>')

with open(dest_file, 'w', encoding='utf-8') as f:
    f.write(final_html)

print(f"Successfully created {dest_file} with {(len(final_html))} bytes.")
