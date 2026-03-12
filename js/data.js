// js/data.js

const teachers = [
  {
    name: "KES",
    status: "office",
    years: 5,
    scores: { inst: 5, ret: 5, punct: 4, admin: 4, contrib: 5 },
    weighted: 4.65,
    grade: "Very Satisfactory",
    salary: 10174.3,
    rate: 29.58,
  },
  {
    name: "BELLE",
    status: "home",
    years: 1,
    scores: { inst: 4, ret: 5, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.75,
    grade: "Outstanding",
    salary: 7288,
    rate: 24.96,
  },
  {
    name: "HT FARRAH",
    status: "office",
    years: 5,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 15800.5,
    rate: 50.32,
  },
  {
    name: "RICA",
    status: "office",
    years: 5,
    scores: { inst: 5, ret: 5, punct: 4, admin: 5, contrib: 5 },
    weighted: 4.8,
    grade: "Outstanding",
    salary: 8674.3,
    rate: 32.86,
  },
  {
    name: "CINDY",
    status: "office",
    years: 2,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 20931,
    rate: 34.09,
  },
  {
    name: "JANE",
    status: "office",
    years: 5,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 13426,
    rate: 28.57,
  },
  {
    name: "ANA",
    status: "office",
    years: 2,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 12924,
    rate: 29.37,
  },
  {
    name: "KAYE",
    status: "office",
    years: 1,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 18960,
    rate: 28.47,
  },
  {
    name: "ZEE",
    status: "office",
    years: 1,
    scores: { inst: 4, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.45,
    grade: "Satisfactory",
    salary: 10267,
    rate: 29.33,
  },
  {
    name: "HT NESS",
    status: "home",
    years: 5,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 14503,
    rate: 65.33,
  },
  {
    name: "MARIANE",
    status: "home",
    years: 5,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 6550,
    rate: 25.79,
  },
  {
    name: "JINETTE",
    status: "home",
    years: 2,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 8625,
    rate: 25.52,
  },
  {
    name: "JENNY",
    status: "home",
    years: 2,
    scores: { inst: 5, ret: 5, punct: 5, admin: 4, contrib: 5 },
    weighted: 4.85,
    grade: "Outstanding",
    salary: 1700,
    rate: 25.0,
  },
  {
    name: "SID",
    status: "office",
    years: 1,
    scores: { inst: 5, ret: 3, punct: 4, admin: 5, contrib: 5 },
    weighted: 4.2,
    grade: "Satisfactory",
    salary: 12193,
    rate: 29.59,
  },
  {
    name: "CHAINE",
    status: "home",
    years: 5,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 10999.3,
    rate: 25.82,
  },
  {
    name: "KRYSTEL",
    status: "home",
    years: 1,
    scores: { inst: 4, ret: 4, punct: 5, admin: 5, contrib: 4 },
    weighted: 4.35,
    grade: "Satisfactory",
    salary: 9675,
    rate: 25.06,
  },
  {
    name: "SHAS",
    status: "office",
    years: 1,
    scores: { inst: 5, ret: 4, punct: 5, admin: 5, contrib: 5 },
    weighted: 4.7,
    grade: "Very Satisfactory",
    salary: 12614,
    rate: 28.41,
  },
  {
    name: "LEN",
    status: "home",
    years: 1,
    scores: { inst: 4, ret: 4, punct: 3, admin: 2, contrib: 3 },
    weighted: 3.4,
    grade: "Needs Improvement",
    salary: 8270,
    rate: 25.06,
  },
  {
    name: "WIN",
    status: "office",
    years: 1,
    scores: { inst: 5, ret: 4, punct: 3, admin: 1, contrib: 5 },
    weighted: 3.7,
    grade: "Satisfactory",
    salary: 8425,
    rate: 28.46,
  },
  {
    name: "JED",
    status: "home",
    years: 1,
    scores: { inst: 5, ret: 5, punct: 1, admin: 4, contrib: 2 },
    weighted: 3.75,
    grade: "Satisfactory",
    salary: 2900,
    rate: 26.85,
  },
  {
    name: "FAYE",
    status: "home",
    years: 5,
    scores: { inst: 3, ret: 5, punct: 1, admin: 3, contrib: 1 },
    weighted: 3.0,
    grade: "Needs Improvement",
    salary: 7914.5,
    rate: 28.07,
  },
];

const gradeOrder = {
  Outstanding: 0,
  "Very Satisfactory": 1,
  Satisfactory: 2,
  "Needs Improvement": 3,
};

const gradeClass = {
  Outstanding: "treemap__cell--outstanding",
  "Very Satisfactory": "treemap__cell--very-satisfactory",
  Satisfactory: "treemap__cell--satisfactory",
  "Needs Improvement": "treemap__cell--needs-improvement",
};

const gradeColor = {
  Outstanding: "#10b981", // tailwind green-500
  "Very Satisfactory": "#3b82f6", // tailwind blue-500
  Satisfactory: "#6b7280", // tailwind gray-500
  "Needs Improvement": "#ef4444", // tailwind red-500
};

const statusLabel = { office: "OFFICE 근무", home: "HOME 근무" };
const gradeLabel = {
  Outstanding: "Outstanding",
  "Very Satisfactory": "Very Satisfactory",
  Satisfactory: "Satisfactory",
  "Needs Improvement": "Needs Improvement",
};

function sortTeachers(arr, by) {
  const copy = [...arr];
  switch (by) {
    case "salary-desc":
      return copy.sort((a, b) => b.salary - a.salary);
    case "salary-asc":
      return copy.sort((a, b) => a.salary - b.salary);
    case "grade":
      return copy.sort(
        (a, b) =>
          gradeOrder[a.grade] - gradeOrder[b.grade] || b.salary - a.salary,
      );
    case "rate":
      return copy.sort((a, b) => b.rate - a.rate);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  return copy;
}

function groupTeachers(arr, by) {
  if (by === "none") return [{ label: "전체 교사", teachers: arr }];
  if (by === "status" || by === "location") {
    const office = arr.filter((t) => t.status === "office");
    const home = arr.filter((t) => t.status === "home");
    return [
      { label: statusLabel["office"], teachers: office },
      { label: statusLabel["home"], teachers: home },
    ];
  }
  if (by === "grade") {
    const groups = {};
    arr.forEach((t) => {
      if (!groups[t.grade]) groups[t.grade] = [];
      groups[t.grade].push(t);
    });
    return Object.keys(groups)
      .sort((a, b) => gradeOrder[a] - gradeOrder[b])
      .map((g) => ({ label: gradeLabel[g], teachers: groups[g] }));
  }
}
