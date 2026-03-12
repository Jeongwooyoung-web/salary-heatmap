import os

files = [
    r"C:\Users\Admin\.gemini\antigravity\scratch\salary-calculator\index.html",
    r"C:\Users\Admin\.gemini\antigravity\scratch\salary-calculator\heatmap.html",
    r"C:\Users\Admin\.gemini\antigravity\scratch\salary-calculator\treemap.html",
    r"C:\Users\Admin\.gemini\antigravity\scratch\salary-calculator\calculator.html"
]

nav_item = """            </li>
            <li>
              <a
                href="report.html"
                class="header__nav-link hover:text-primary-500 transition-colors"
                >Evaluation Report</a
              >
            </li>
          </ul>"""

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace navigation closing
    content = content.replace('            </li>\n          </ul>', nav_item)

    if file_path.endswith('index.html'):
        # Change grid layout to accommodate 4 cards
        content = content.replace('md:grid-cols-3 gap-6', 'md:grid-cols-2 lg:grid-cols-4 gap-6')

        # Add the 4th card after Calculator Card
        new_card = """        </a>

        <!-- Evaluation Report Card -->
        <a
          href="report.html"
          class="card card--interactive group block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:-translate-y-1"
        >
          <div
            class="card__icon inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-50 text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 class="card__title text-lg font-bold text-gray-900 mb-2">
            Evaluation Report
          </h2>
          <p class="card__desc text-sm text-gray-500 line-clamp-2">
            개별 교사들의 상세 평가 리포트 및 지표를 확인합니다.
          </p>
        </a>"""
        content = content.replace("        </a>\n      </div>", new_card + "\n      </div>")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated navigation in all HTML files.")
