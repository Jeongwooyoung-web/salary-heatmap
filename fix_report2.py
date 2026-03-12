import re

# 1. 원본 파일에서 깨끗한 데이터를 가져와 복구합니다.
source_file = r"C:\Users\Admin\Downloads\teacher_evaluation_report.html"
target_file = r"report.html"

with open(source_file, "rb") as f:
    raw = f.read()

try:
    html = raw.decode("utf-8")
except UnicodeDecodeError:
    html = raw.decode("cp949", errors="ignore")

# 2. SCORE SUMMARY (<tbody> 대체)
score_pattern = r'(<td colspan="8" style="color:#FFFFFF;font-weight:bold;font-size:11.0pt;background:#2C5F8A;text-align:left;vertical-align:middle">SCORE SUMMARY</td>(?:.*?<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td style="color:#FFFFFF;font-weight:bold;font-size:9.0pt;background:#3D6B99;text-align:center;vertical-align:middle">Teacher</td>.*?</tr>\s*))<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td style="color:#000000;font-weight:bold;font-size:9.0pt;background:#F5F5F5;text-align:left;vertical-align:middle">KES</td>.*?(?=</table>)'
html = re.sub(score_pattern, r'\1<tbody id="scoreSummaryBody"></tbody>\n', html, flags=re.DOTALL)

# 3. RATE / 10 MIN VERIFICATION
rate_pattern = r'(<td colspan="7" style="color:#FFFFFF;font-weight:bold;font-size:11.0pt;background:#2C5F8A;text-align:left;vertical-align:middle">RATE / 10 MIN VERIFICATION</td>(?:.*?<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td style="color:#FFFFFF;font-weight:bold;font-size:9.0pt;background:#3D6B99;text-align:center;vertical-align:middle">Teacher</td>.*?</tr>\s*))<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td style="color:#000000;font-weight:bold;font-size:9.0pt;background:#F5F5F5;text-align:left;vertical-align:middle">KES</td>.*?(?=</table>)'
html = re.sub(rate_pattern, r'\1<tbody id="rateVerificationBody"></tbody>\n', html, flags=re.DOTALL)

# 4. TOP 5 OFFICE TEACHERS
top5_pattern = r'(<td colspan="4" style="color:#FFFFFF;font-weight:bold;font-size:11.0pt;background:#2C5F8A;text-align:left;vertical-align:middle">TOP 5 OFFICE TEACHERS \(Excl\. Head Teachers\).*?<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td style="color:#FFFFFF;font-weight:bold;font-size:9.0pt;background:#3D6B99;text-align:center;vertical-align:middle">Rank</td>.*?(?=</tr>)</tr>\s*)<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td style="color:#F9A825;font-weight:bold;font-size:11.0pt;background:#FFF8E1;text-align:center;vertical-align:middle">1</td>.*?(?=<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td colspan="8" style="color:#888888;font-size:8.0pt;text-align:left;vertical-align:middle">Note: Head Teachers)'
html = re.sub(top5_pattern, r'\1<tbody id="top5OfficeBody"></tbody>\n', html, flags=re.DOTALL)

# 5. GRADE SUMMARY
grade_pattern = r'(<td colspan="14" style="color:#FFFFFF;font-weight:bold;font-size:18.0pt;background:#1B3A6B;text-align:center;vertical-align:middle">MANGOI TEACHERS.*?(?:Teacher Grade Summary | Evaluation Period).*?<tr><td style="color:#000000;font-size:11.0pt"></td><td style="color:#FFFFFF;font-weight:bold;font-size:9.0pt;background:#1B3A6B;text-align:center;vertical-align:middle">No\.</td>.*?</tr>\s*)<tr><td style="color:#000000;font-size:11.0pt"></td><td style="color:#000000;font-size:11.0pt;background:#F7FAFF;text-align:center;vertical-align:middle">6</td>.*?(?=</table>)'
html = re.sub(grade_pattern, r'\1<tbody id="gradeSummaryBody"></tbody>\n', html, flags=re.DOTALL)

# 5.5. Remove trailing empty columns from all rows
# <tr> 마지막에 연속해서 붙어있는 내용 없는 <td> 들을 </tr> 앞까지만 지워서 테이블의 쓸데없는 우측 여백을 잘라냅니다.
html = re.sub(r'(?:<td[^>]*>\s*</td>\s*)+</tr>', '</tr>', html)

# 6. 헤더 및 네비게이션 적용, 불필요한 태그 정리
html = html.replace('</body>', '<script src="js/data.js"></script><script src="js/report.js"></script></body>')

# CSS (대시보드 헤더 반영)
with open("index.html", "r", encoding="utf-8") as f:
    idx_content = f.read()
    
# 간단히 <nav> 헤더를 추출
header_match = re.search(r'<header class="header">.*?</header>', idx_content, re.DOTALL)
if header_match:
    header_html = header_match.group(0)
    # 기존 페이지 본문 시작점 찾기 (<div class="content"> 등)
    body_start_idx = html.find('<body')
    if body_start_idx != -1:
        close_body_idx = html.find('>', body_start_idx)
        # <body> 태그 바로 뒤에 헤더 삽입
        html = html[:close_body_idx+1] + '\n' + header_html + '\n' + html[close_body_idx+1:]
        
    # 헤더 스타일을 위해 css 파일 삽입
    head_close_idx = html.find('</head>')
    if head_close_idx != -1:
        html = html[:head_close_idx] + '<link rel="stylesheet" href="css/style.css">\n' + html[head_close_idx:]

with open(target_file, "w", encoding="utf-8") as f:
    f.write(html)

print("done")
