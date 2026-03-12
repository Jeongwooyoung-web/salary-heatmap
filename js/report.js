// js/report.js

document.addEventListener("DOMContentLoaded", () => {
  renderReportTables();
});

function renderReportTables() {
  // Global teachers 객체 (data.js에서 로드됨)
  if (typeof teachers === "undefined" || !teachers.length) return;

  // 1. SCORE SUMMARY
  const scoreSummaryBody = document.getElementById("scoreSummaryBody");
  if (scoreSummaryBody) {
    scoreSummaryBody.innerHTML = "";
    teachers.forEach((t, index) => {
      const bgColor = index % 2 === 0 ? "#F5F5F5" : "#FFFFFF";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color:#000000;font-size:10.0pt;text-align:general"></td>
        <td style="color:#000000;font-weight:bold;font-size:9.0pt;background:${bgColor};text-align:left;vertical-align:middle">${t.name}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.scores.inst.toFixed(1)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.scores.ret.toFixed(1)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.scores.punct.toFixed(1)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.scores.admin.toFixed(1)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.scores.contrib.toFixed(1)}</td>
        <td style="color:#000000;font-weight:bold;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.weighted.toFixed(2)}</td>
      `;
      scoreSummaryBody.appendChild(tr);
    });
  }

  // 2. RATE / 10 MIN VERIFICATION
  const rateVerificationBody = document.getElementById("rateVerificationBody");
  let totalSalary = 0;
  let totalClasses = 0;
  let totalRateShown = 0;
  let totalCalculated = 0;
  let diffSum = 0;
  let monthlyChangeSum = 0;

  if (rateVerificationBody) {
    rateVerificationBody.innerHTML = "";
    teachers.forEach((t, index) => {
      const bgColor = index % 2 === 0 ? "#F5F5F5" : "#FFFFFF";

      const salary = t.salary || 0;
      const rate = t.rate || 0;
      const classes = rate > 0 ? Math.floor(salary / rate) : 0;

      totalSalary += salary;
      totalClasses += classes;
      totalRateShown += rate;
      totalCalculated += rate;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color:#000000;font-size:10.0pt;text-align:general"></td>
        <td style="color:#000000;font-weight:bold;font-size:9.0pt;background:${bgColor};text-align:left;vertical-align:middle">${t.name}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${(salary ? salary : 0).toFixed(2)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${classes}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${(rate ? rate : 0).toFixed(2)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${(rate ? rate : 0).toFixed(2)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">0</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">OK</td>
        <td style="font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">0</td>
      `;
      rateVerificationBody.appendChild(tr);
    });

    // TOTAL ROW
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color:#000000;font-size:10.0pt;text-align:general"></td>
      <td style="font-weight:bold;font-size:9.0pt;background:#E8EEF4;text-align:right;vertical-align:middle">TOTAL</td>
      <td style="color:#000000;font-size:10.0pt;background:#E8EEF4;text-align:center;vertical-align:middle">${totalSalary.toFixed(2)}</td>
      <td style="color:#000000;font-size:10.0pt;background:#E8EEF4;text-align:center;vertical-align:middle">${totalClasses}</td>
      <td style="color:#000000;font-size:10.0pt;background:#E8EEF4;text-align:center;vertical-align:middle">${totalRateShown.toFixed(2)}</td>
      <td style="color:#000000;font-size:10.0pt;background:#E8EEF4;text-align:center;vertical-align:middle">${totalCalculated.toFixed(2)}</td>
      <td style="color:#000000;font-size:10.0pt;background:#E8EEF4;text-align:center;vertical-align:middle">0</td>
      <td style="font-weight:bold;font-size:9.0pt;background:#E8EEF4;text-align:center;vertical-align:middle"></td>
      <td style="font-weight:bold;font-size:9.0pt;background:#E8EEF4;text-align:center;vertical-align:middle">0</td>
    `;
    rateVerificationBody.appendChild(tr);
  }

  // 3. TOP 5 OFFICE TEACHERS
  const top5OfficeBody = document.getElementById("top5OfficeBody");
  if (top5OfficeBody) {
    top5OfficeBody.innerHTML = "";

    // Weighted DESC -> Years DESC 순서로 정렬된 Office Teacher 필터
    const officeTeachers = teachers
      .filter((t) => t.status === "office" && !t.name.includes("HT"))
      .sort((a, b) => b.weighted - a.weighted || b.years - a.years)
      .slice(0, 5); // TOP 5

    officeTeachers.forEach((t, index) => {
      const isOdd = index % 2 === 0;
      const bgColor = isOdd ? "#FFF8E1" : index === 1 ? "#FFFFFF" : "#F5F5F5";
      const rankColor = index === 0 ? "#F9A825" : "#000000";

      const estChange = 0; // 예시 차액

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color:#000000;font-size:10.0pt;text-align:general"></td>
        <td style="color:${rankColor};font-weight:bold;font-size:11.0pt;background:${bgColor};text-align:center;vertical-align:middle">${index + 1}</td>
        <td style="color:#000000;font-weight:bold;font-size:9.0pt;background:${bgColor};text-align:left;vertical-align:middle">${t.name}</td>
        <td style="color:#000000;font-weight:bold;font-size:10.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.weighted.toFixed(2)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.years} Years</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.grade}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">Office</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${(t.rate ? t.rate : 0).toFixed(2)}</td>
        <td style="color:#000000;font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${(t.rate ? t.rate : 0).toFixed(2)}</td>
        <td style="font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">0</td>
        <td style="font-size:9.0pt;background:${bgColor};text-align:center;vertical-align:middle">${estChange}</td>
      `;
      top5OfficeBody.appendChild(tr);
    });
  }

  // 4. TEACHER GRADE SUMMARY
  const gradeSummaryBody = document.getElementById("gradeSummaryBody");
  if (gradeSummaryBody) {
    gradeSummaryBody.innerHTML = "";
    teachers.forEach((t, index) => {
      const bgColor = index % 2 === 0 ? "#F7FAFF" : "#FFFFFF";
      const instC = "#1B3A6B";
      const retC = "#FF0000";
      const rowNum = index + 1;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="color:#000000;font-size:11.0pt"></td>
        <td style="color:#000000;font-size:11.0pt;background:${bgColor};text-align:center;vertical-align:middle">${rowNum}</td>
        <td style="color:#000000;font-weight:bold;font-size:11.0pt;background:${bgColor};text-align:left;vertical-align:middle">${t.name}</td>
        <td style="color:#000000;font-size:11.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.status}</td>
        <td style="color:#000000;font-size:11.0pt;background:${bgColor};text-align:center;vertical-align:middle">${t.years}</td>
        <td style="color:${instC};font-weight:bold;font-size:11.0pt;background:#EEF4FF;text-align:center;vertical-align:middle">${t.scores.inst.toFixed(1)}</td>
        <td style="color:${retC};font-weight:bold;font-size:11.0pt;background:#EEF4FF;text-align:center;vertical-align:middle">${t.scores.ret.toFixed(1)}</td>
        <td style="color:${instC};font-weight:bold;font-size:11.0pt;background:#EEF4FF;text-align:center;vertical-align:middle">${t.scores.punct.toFixed(1)}</td>
        <td style="color:${instC};font-weight:bold;font-size:11.0pt;background:#EEF4FF;text-align:center;vertical-align:middle">${t.scores.admin.toFixed(1)}</td>
        <td style="color:${instC};font-weight:bold;font-size:11.0pt;background:#EEF4FF;text-align:center;vertical-align:middle">${t.scores.contrib.toFixed(1)}</td>
        <td style="color:#1B3A6B;font-weight:bold;font-size:11.0pt;background:#D6E4F7;text-align:center;vertical-align:middle">${t.weighted.toFixed(2)}</td>
        <td style="color:#000000;font-weight:bold;font-size:10.0pt;background:#E2F0D9;text-align:center;vertical-align:middle">${t.grade}</td>
        <td style="color:#000000;font-size:11.0pt;background:${bgColor};text-align:right;vertical-align:middle">${(t.salary ? t.salary : 0).toFixed(2)}</td>
        <td style="color:#000000;font-size:11.0pt;background:${bgColor};text-align:right;vertical-align:middle">${(t.rate ? t.rate : 0).toFixed(2)}</td>
      `;
      gradeSummaryBody.appendChild(tr);
    });
  }
}

// 명시적으로 전역 데이터(`teachers`)를 로컬 스토리지에서 다시 읽어와서 리포트 렌더링을 갱신
window.updateReportFromStorage = function () {
  const stored = localStorage.getItem("mangoi_teachers");
  if (stored) {
    window.teachers = JSON.parse(stored);
  }
  renderReportTables();
};
