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
        document.getElementById("instruction").value =
          teacher.scores.inst.toFixed(1);
        document.getElementById("retention").value =
          teacher.scores.ret.toFixed(1);
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
  const vRet = parseFloat(document.getElementById("retention").value) || 0;
  const vPunct = parseFloat(document.getElementById("punctuality").value) || 0;
  const vAdmin = parseFloat(document.getElementById("admin").value) || 0;
  const vContrib =
    parseFloat(document.getElementById("contribution").value) || 0;

  // 가중치 평균 계산 (MANGOI 기준)
  // 수업(25%), 학생유지(30%), 출석(20%), 행정(15%), 기여도(10%)
  const avg =
    vInst * 0.25 + vRet * 0.3 + vPunct * 0.2 + vAdmin * 0.15 + vContrib * 0.1;

  let grade = "Needs Improvement";
  let rate = 22; // Base Rate / 10min
  let bgColor = "#ef4444"; // red-500

  if (avg >= 4.75) {
    grade = "Outstanding";
    rate = 32 + (avg - 4.75) * 5; // 점수에 비례해 추가 금액 배정 로직 (예시)
    bgColor = "#10b981"; // green-500
  } else if (avg >= 4.5) {
    grade = "Very Satisfactory";
    rate = 28 + (avg - 4.5) * 4;
    bgColor = "#3b82f6"; // blue-500
  } else if (avg >= 3.5) {
    grade = "Satisfactory";
    rate = 25 + (avg - 3.5) * 2;
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

  // 글로벌 상태(localStorage) 갱신
  const teacherSelect = document.getElementById("teacherSelect");
  if (teacherSelect && teacherSelect.value) {
    const selectedName = teacherSelect.value;
    const teacherIndex = teachers.findIndex((t) => t.name === selectedName);

    if (teacherIndex !== -1) {
      const confirmation = confirm(
        "Are you sure? This will update the teacher's score across all dashboard menus.",
      );
      if (!confirmation) {
        return; // 사용자가 취소하면 localStorage에 저장하지 않음 (UI상 결과는 미리보기로만 남게 됨)
      }

      teachers[teacherIndex].scores = {
        inst: vInst,
        ret: vRet,
        punct: vPunct,
        admin: vAdmin,
        contrib: vContrib,
      };
      teachers[teacherIndex].weighted = parseFloat(avg.toFixed(2));
      teachers[teacherIndex].grade = grade;
      teachers[teacherIndex].rate = rate;

      // 등급이 하락 및 임금 변동이 발생했을 수 있으므로 salary 재계산 (현재 rate 기준 한달 근로시 대략적, 예: salary = rate * constant )
      // 그러나 여기선 간단히 rate 변동치만 적용하거나 기존 비율대로 유지
      const oldRate = teachers[teacherIndex].rate;
      if (oldRate > 0) {
        teachers[teacherIndex].salary =
          (teachers[teacherIndex].salary / oldRate) * rate;
      }

      saveData();
    }
  }
}
