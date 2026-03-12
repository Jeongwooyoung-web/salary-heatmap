import re

# 먼저 바이너리로 읽어서 디코딩 방식 유추
with open("report.html", "rb") as f:
    raw = f.read()

try:
    html = raw.decode("utf-8")
except UnicodeDecodeError:
    html = raw.decode("cp949", errors="ignore")

# 1. SCORE SUMMARY
html = re.sub(
    r'<tbody id="scoreSummaryBody"></tbody>\s*<tbody id="scoreSummaryBody"></tbody>\s*<tbody id="gradeSummaryBody"></tbody>',
    r'<tbody id="scoreSummaryBody"></tbody>',
    html
)

# 2. RATE VERIFICATION (기존 표 내용 삭제 후 빈 tbody 삽입)
rate_pattern = r'(<td colspan="7" style="color:#FFFFFF;font-weight:bold;font-size:11.0pt;background:#2C5F8A;text-align:left;vertical-align:middle">RATE / 10 MIN VERIFICATION</td>.*?)<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td style="color:#000000;font-weight:bold;font-size:9.0pt;background:#F5F5F5;text-align:left;vertical-align:middle">KES</td>.*?(?=</table>)'
html = re.sub(rate_pattern, r'\1\n<tbody id="rateVerificationBody"></tbody>\n', html, flags=re.DOTALL)

# 3. TOP 5 (기존 표 내용 삭제 후 빈 tbody 삽입)
top5_pattern = r'(<td colspan="4" style="color:#FFFFFF;font-weight:bold;font-size:11.0pt;background:#2C5F8A;text-align:left;vertical-align:middle">TOP 5 OFFICE TEACHERS.*?)<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td style="color:#F9A825;font-weight:bold;font-size:11.0pt;background:#FFF8E1;text-align:center;vertical-align:middle">1</td>.*?(?=<tr><td style="color:#000000;font-size:10.0pt;text-align:general"></td><td colspan="8" style="color:#888888;font-size:8.0pt;text-align:left;vertical-align:middle">Note: Head Teachers)'
html = re.sub(top5_pattern, r'\1\n<tbody id="top5OfficeBody"></tbody>\n', html, flags=re.DOTALL)

# 4. GRADE SUMMARY 복구
html = re.sub(
    r'<tbody id="gradeSummaryBody"></tbody>',
    r'',
    html
)
grade_pattern = r'(TEACHER GRADE SUMMARY.*?)<tr><td style="color:#000000;font-size:11.0pt"></td><td style="color:#000000;font-size:11.0pt;background:#F7FAFF;text-align:center;vertical-align:middle">6</td>.*?(?=</table>)'
html = re.sub(grade_pattern, r'\1\n<tbody id="gradeSummaryBody"></tbody>\n', html, flags=re.DOTALL)

with open("report.html", "w", encoding="utf-8") as f:
    f.write(html)

print("done")
