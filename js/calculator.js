// js/calculator.js

document.addEventListener("DOMContentLoaded", () => {
  const teacherSelect = document.getElementById("teacherSelect");

  // 선생님 목록 초기화 (data.js의 teachers 참조)
  if (teacherSelect && typeof teachers !== "undefined") {
    // 이름 오름차순
    const sortedTeachers = [...teachers].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    sortedTeachers.forEach((t) => {
      const option = document.createElement("option");
      option.value = t.name;
      option.textContent = `${t.name} (${t.status.toUpperCase()})`;
      teacherSelect.appendChild(option);
    });

    // 선생님 선택 시 점수 자동 입력
    teacherSelect.addEventListener("change", (e) => {
      const teacherName = e.target.value;
      if (!teacherName) {
        document.getElementById("salaryForm").reset();
        document.getElementById("resultPlaceholder").classList.remove("hidden");
        document.getElementById("resultContent").classList.add("hidden");
        return;
      }

      const teacher = teachers.find((t) => t.name === teacherName);
      if (teacher) {
        // 데이터 매핑 (기존 데이터와 계산기 입력폼 매칭)
        // instruction: (inst + ret) / 2
        document.getElementById("instruction").value = (
          (teacher.scores.inst + teacher.scores.ret) /
          2
        ).toFixed(1);
        document.getElementById("punctuality").value =
          teacher.scores.punct.toFixed(1);
        document.getElementById("admin").value =
          teacher.scores.admin.toFixed(1);
        document.getElementById("contribution").value =
          teacher.scores.contrib.toFixed(1);

        // 자동 계산
        calculateSalary();
      }
    });
  }
});

// 계산기 로직
function calculateSalary() {
  const vInst = parseFloat(document.getElementById("instruction").value) || 0;
  const vPunct = parseFloat(document.getElementById("punctuality").value) || 0;
  const vAdmin = parseFloat(document.getElementById("admin").value) || 0;
  const vContrib =
    parseFloat(document.getElementById("contribution").value) || 0;

  // 가중치 평균 (기본적인 단순 평균 예시, 실제 MANGOI 기준에 맞춰 보정 가능)
  // 기존 data.js의 weighted 점수 산출 방식과 유사하게 (4+항목 / 4)
  const avg = (vInst + vPunct + vAdmin + vContrib) / 4;

  let grade = "Needs Improvement";
  let rate = 22; // Base Rate / 10min
  let bgColor = "#ef4444"; // red-500

  if (avg >= 4.5) {
    grade = "Outstanding";
    rate = 32 + (avg - 4.5) * 5; // 점수에 비례해 추가 금액 배정 로직 (예시)
    bgColor = "#10b981"; // green-500
  } else if (avg >= 4.0) {
    grade = "Very Satisfactory";
    rate = 28 + (avg - 4.0) * 4;
    bgColor = "#3b82f6"; // blue-500
  } else if (avg >= 3.0) {
    grade = "Satisfactory";
    rate = 25 + (avg - 3.0) * 2;
    bgColor = "#6b7280"; // gray-500
  } else {
    rate = 22;
  }

  // Rate Math Floor
  rate = Math.floor(rate * 10) / 10;

  // UI 업데이트
  document.getElementById("resultPlaceholder").classList.add("hidden");
  document.getElementById("resultContent").classList.remove("hidden");

  document.getElementById("avgScore").textContent = avg.toFixed(2);

  const gradeEl = document.getElementById("gradeText");
  gradeEl.textContent = grade;
  gradeEl.style.backgroundColor = bgColor;

  document.getElementById("salaryRate").textContent = `₱${rate.toFixed(2)}`;
}
