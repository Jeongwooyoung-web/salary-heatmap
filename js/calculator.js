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

        // Rate 테이블 렌더링
        renderRateTable(teacher);

        // 자동 계산
        calculateSalary();
      }
    });

    // 화면 로드 시 Rate 테이블 초기화 (디폴트값)
    renderRateTable(null);

    // Rate 기준 수동 증감 버튼 이벤트 리스너 (이벤트 위임)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-rate-adjust");
      if (!btn) return;

      const teacherName = teacherSelect.value;
      if (!teacherName) {
        alert("교사를 먼저 선택해주세요. (Select a teacher first)");
        return;
      }

      const teacherIndex = teachers.findIndex((t) => t.name === teacherName);
      if (teacherIndex === -1) return;

      const teacher = teachers[teacherIndex];
      // 교사별 수동 Rate 데이터가 없다면 디폴트로 초기화
      if (!teacher.customRates) {
        teacher.customRates = {
          outstanding: 32,
          very_satisfactory: 28,
          satisfactory: 25,
          needs_improvement: 22,
        };
      }

      const gradeKey = btn.dataset.grade;
      const action = btn.dataset.action;

      if (action === "increase") {
        teacher.customRates[gradeKey] += 1;
      } else if (action === "decrease") {
        teacher.customRates[gradeKey] -= 1;
        if (teacher.customRates[gradeKey] < 0)
          teacher.customRates[gradeKey] = 0; // 최소 0 보장
      }

      // UI 즉각 갱신
      document.getElementById(`rate-val-${gradeKey}`).textContent =
        `₱${teacher.customRates[gradeKey]}`;

      // 재계산 및 로컬스토리지 저장 트리거 (자동 저장)
      calculateSalary();
    });
  }
});

// 화면 내 Rate 테이블 값들을 교사별 데이터로 그려주는 함수
function renderRateTable(teacher) {
  const defaultRates = {
    outstanding: 32,
    very_satisfactory: 28,
    satisfactory: 25,
    needs_improvement: 22,
  };
  const rates =
    teacher && teacher.customRates ? teacher.customRates : defaultRates;

  const elOut = document.getElementById("rate-val-outstanding");
  const elVery = document.getElementById("rate-val-very_satisfactory");
  const elSat = document.getElementById("rate-val-satisfactory");
  const elNeeds = document.getElementById("rate-val-needs_improvement");

  if (elOut) elOut.textContent = `₱${rates.outstanding}`;
  if (elVery) elVery.textContent = `₱${rates.very_satisfactory}`;
  if (elSat) elSat.textContent = `₱${rates.satisfactory}`;
  if (elNeeds) elNeeds.textContent = `₱${rates.needs_improvement}`;
}

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

  const teacherSelect = document.getElementById("teacherSelect");
  const teacherName = teacherSelect ? teacherSelect.value : null;
  const teacher = teacherName
    ? teachers.find((t) => t.name === teacherName)
    : null;

  const defaultRates = {
    outstanding: 32,
    very_satisfactory: 28,
    satisfactory: 25,
    needs_improvement: 22,
  };
  const currentRates =
    teacher && teacher.customRates ? teacher.customRates : defaultRates;

  let grade = "Needs Improvement";
  let gradeKey = "needs_improvement";
  let bgColor = "#ef4444"; // red-500

  if (avg >= 4.75) {
    grade = "Outstanding";
    gradeKey = "outstanding";
    bgColor = "#10b981"; // green-500
  } else if (avg >= 4.5) {
    grade = "Very Satisfactory";
    gradeKey = "very_satisfactory";
    bgColor = "#3b82f6"; // blue-500
  } else if (avg >= 3.5) {
    grade = "Satisfactory";
    gradeKey = "satisfactory";
    bgColor = "#6b7280"; // gray-500
  }

  // 지정된 테이블 Rate 값 그대로 적용 (단순화 / 비례 증가 없음)
  let rate = currentRates[gradeKey];

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
