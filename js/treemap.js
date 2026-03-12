// js/treemap.js
// Squarified treemap algorithm

function squarify(items, x, y, w, h) {
  if (items.length === 0) return [];
  if (items.length === 1) {
    items[0]._x = x;
    items[0]._y = y;
    items[0]._w = w;
    items[0]._h = h;
    return items;
  }

  const total = items.reduce((s, i) => s + i._area, 0);
  const sorted = [...items].sort((a, b) => b._area - a._area);

  let result = [];
  layoutRow(sorted, 0, x, y, w, h, total, result);
  return result;
}

function layoutRow(items, start, x, y, w, h, totalArea, result) {
  if (start >= items.length) return;
  if (start === items.length - 1) {
    items[start]._x = x;
    items[start]._y = y;
    items[start]._w = w;
    items[start]._h = h;
    result.push(items[start]);
    return;
  }

  const horizontal = w >= h;
  let rowItems = [items[start]];
  let rowArea = items[start]._area;
  let bestRatio = worstRatio(
    rowItems,
    rowArea,
    totalArea,
    horizontal ? w : h,
    horizontal ? h : w,
  );

  for (let i = start + 1; i < items.length; i++) {
    const testItems = [...rowItems, items[i]];
    const testArea = rowArea + items[i]._area;
    const ratio = worstRatio(
      testItems,
      testArea,
      totalArea,
      horizontal ? w : h,
      horizontal ? h : w,
    );
    if (ratio <= bestRatio) {
      rowItems.push(items[i]);
      rowArea = testArea;
      bestRatio = ratio;
    } else break;
  }

  const rowFrac = rowArea / totalArea;
  let cx = x,
    cy = y;

  if (horizontal) {
    const rowW = w * rowFrac;
    rowItems.forEach((item) => {
      const frac = item._area / rowArea;
      item._x = cx;
      item._y = cy;
      item._w = rowW;
      item._h = h * frac;
      cy += item._h;
      result.push(item);
    });
    layoutRow(
      items,
      start + rowItems.length,
      x + rowW,
      y,
      w - rowW,
      h,
      totalArea - rowArea,
      result,
    );
  } else {
    const rowH = h * rowFrac;
    rowItems.forEach((item) => {
      const frac = item._area / rowArea;
      item._x = cx;
      item._y = cy;
      item._w = w * frac;
      item._h = rowH;
      cx += item._w;
      result.push(item);
    });
    layoutRow(
      items,
      start + rowItems.length,
      x,
      y + rowH,
      w,
      h - rowH,
      totalArea - rowArea,
      result,
    );
  }
}

function worstRatio(items, rowArea, totalArea, side, otherSide) {
  const rowFrac = rowArea / totalArea;
  let worst = 0;
  items.forEach((item) => {
    const frac = item._area / rowArea;
    const w = side * rowFrac;
    const h = otherSide * frac;
    const ratio = Math.max(w / h, h / w);
    if (ratio > worst) worst = ratio;
  });
  return worst;
}

// UI Rendering
function renderTreemap() {
  const sortBy = document.getElementById("sort-dropdown").value;
  const groupBy = document.getElementById("group-dropdown").value;

  const sorted = sortTeachers(teachers, sortBy);
  const groups = groupTeachers(sorted, groupBy);

  const container = document.getElementById("treemap-container");
  container.innerHTML = "";

  const totalSalary = teachers.reduce((s, t) => s + t.salary, 0);

  // Render Legend
  const legendContainer = document.getElementById("legend-container");
  if (legendContainer.innerHTML.trim() === "") {
    const legendHTML = Object.keys(gradeColor)
      .map(
        (grade) => `
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded-sm" style="background-color: ${gradeColor[grade]}"></div>
        <span class="text-gray-600">${grade}</span>
      </div>
    `,
      )
      .join("");
    legendContainer.innerHTML = legendHTML;
  }

  groups.forEach((group) => {
    const groupSalary = group.teachers.reduce((s, t) => s + t.salary, 0);
    const groupFrac = groupSalary / totalSalary;

    const groupEl = document.createElement("div");
    groupEl.className =
      "treemap__group flex flex-col rounded overflow-hidden bg-gray-50";
    groupEl.style.flex = groupFrac;
    groupEl.style.minWidth = "0";

    const headerEl = document.createElement("div");
    headerEl.className =
      "treemap__group-header px-3 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200";
    headerEl.textContent = `${group.label} — ₱${groupSalary.toLocaleString("en", { maximumFractionDigits: 0 })}`;
    groupEl.appendChild(headerEl);

    const bodyEl = document.createElement("div");
    bodyEl.className =
      "treemap__group-body flex-1 p-1 gap-1 relative overflow-hidden";
    groupEl.appendChild(bodyEl);
    container.appendChild(groupEl);

    // CSS Styling inject
    if (!document.getElementById("treemap-styles")) {
      const style = document.createElement("style");
      style.id = "treemap-styles";
      style.textContent = `
            #treemap-container { display: flex; gap: 8px; }
            .treemap__cell {
                position: absolute;
                border-radius: 4px;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 4px;
                cursor: pointer;
                transition: all 0.2s;
                overflow: hidden;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
            }
            .treemap__cell:hover {
                filter: brightness(1.1);
                z-index: 10;
                transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .treemap__cell--outstanding { background-color: #10b981; }
            .treemap__cell--very-satisfactory { background-color: #3b82f6; }
            .treemap__cell--satisfactory { background-color: #6b7280; }
            .treemap__cell--needs-improvement { background-color: #ef4444; }
            
            .treemap__tooltip {
                display: none;
                position: fixed;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 12px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                min-width: 220px;
                color: #374151;
            }
            .treemap__tooltip.visible { display: block; }
        `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      const rect = bodyEl.getBoundingClientRect();
      const W = rect.width - 8;
      const H = rect.height - 8;

      const items = group.teachers.map((t) => ({ ...t, _area: t.salary }));
      squarify(items, 4, 4, W, H);

      items.forEach((item) => {
        const cell = document.createElement("div");
        cell.className = `treemap__cell ${gradeClass[item.grade]}`;
        cell.style.left = item._x + "px";
        cell.style.top = item._y + "px";
        cell.style.width = Math.max(item._w - 2, 0) + "px";
        cell.style.height = Math.max(item._h - 2, 0) + "px";

        const w = item._w;
        const h = item._h;
        const nameSize = Math.max(
          10,
          Math.min(18, Math.floor(Math.min(w, h) / 4.5)),
        );
        const descSize = Math.max(9, nameSize - 4);

        let html = `<div class="font-bold" style="font-size:${nameSize}px; text-shadow:0 1px 2px rgba(0,0,0,0.2)">${item.name}</div>`;
        if (w > 60 && h > 40) {
          html += `<div style="font-size:${descSize}px; opacity:0.9">₱${item.salary.toLocaleString("en", { maximumFractionDigits: 0 })}</div>`;
        }
        if (w > 80 && h > 60) {
          html += `<div style="font-size:${descSize - 1}px; opacity:0.8; margin-top:2px">${item.grade}</div>`;
        }

        cell.innerHTML = html;
        cell.addEventListener("mouseenter", (e) => showTooltip(e, item));
        cell.addEventListener("mousemove", moveTooltip);
        cell.addEventListener("mouseleave", hideTooltip);
        bodyEl.appendChild(cell);
      });
    }, 50);
  });

  // Update Summary
  document.getElementById("total-count").textContent = teachers.length;
  document.getElementById("total-salary").textContent =
    totalSalary.toLocaleString("en", { maximumFractionDigits: 0 });
  document.getElementById("avg-salary").textContent = (
    totalSalary / teachers.length
  ).toFixed(0);
}

// Tooltip logic
let tooltipEl = document.getElementById("treemap-tooltip");
if (!tooltipEl) {
  tooltipEl = document.createElement("div");
  tooltipEl.id = "treemap-tooltip";
  tooltipEl.className = "treemap__tooltip";
  document.body.appendChild(tooltipEl);
}

function showTooltip(e, t) {
  tooltipEl.innerHTML = `
    <div class="font-bold text-base mb-2 pb-2 border-b" style="color:${gradeColor[t.grade]}">${t.name}</div>
    <div class="flex justify-between my-1"><span class="text-gray-500">월급</span><span class="font-semibold">₱${t.salary.toLocaleString("en", { maximumFractionDigits: 1 })}</span></div>
    <div class="flex justify-between my-1"><span class="text-gray-500">10분 시급</span><span class="font-semibold">₱${t.rate}</span></div>
    <div class="flex justify-between my-1"><span class="text-gray-500">평가 등급</span><span class="font-semibold" style="color:${gradeColor[t.grade]}">${t.grade}</span></div>
    <div class="flex justify-between my-1"><span class="text-gray-500">가중 점수</span><span class="font-semibold">${t.weighted}</span></div>
    <div class="flex justify-between my-1"><span class="text-gray-500">근무형태</span><span class="font-semibold">${t.status.toUpperCase()}</span></div>
    <div class="mt-2 pt-2 border-t text-[10px] text-gray-400">
      수업(${t.scores.inst}) · 유지(${t.scores.ret}) · 출석(${t.scores.punct}) · 행정(${t.scores.admin}) · 기여(${t.scores.contrib})
    </div>
  `;
  tooltipEl.classList.add("visible");
  moveTooltip(e);
}

function moveTooltip(e) {
  let x = e.clientX + 16;
  let y = e.clientY + 16;
  const rect = tooltipEl.getBoundingClientRect();
  if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - 16;
  if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - 16;
  tooltipEl.style.left = x + "px";
  tooltipEl.style.top = y + "px";
}

function hideTooltip() {
  tooltipEl.classList.remove("visible");
}

// Init
document
  .getElementById("sort-dropdown")
  .addEventListener("change", renderTreemap);
document
  .getElementById("group-dropdown")
  .addEventListener("change", renderTreemap);

window.addEventListener("resize", renderTreemap);

document.addEventListener("DOMContentLoaded", () => {
  // Only render if container exists
  if (document.getElementById("treemap-container")) {
    renderTreemap();
  }
});
