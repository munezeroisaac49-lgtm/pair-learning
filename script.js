/*
  Pairly Student Workspace
  Data can later be replaced with a real database/API.
*/

const subjects = [
  "Writer's Workshop",
  "Guided Reading",
  "How To Learn",
  "Language Lab",
  "Communication art",
  "Discipleship",
  "Mental health"
];

/*
  PAIR DATA
  -------------------------------
  Replace these sample students with your real student list.

  For each pair, add exactly two students:
  {
    id: 1,
    student1: "Student One",
    student2: "Student Two",
    cycle: "Day 1–3"
  }

  Later this same structure can be loaded from Supabase,
  Firebase, or another database without changing the page design.
*/
const pairData = [
  {
    id: 1,
    student1: "John Smith",
    student2: "David Paul",
    cycle: "Day 1–3"
  },
  {
    id: 2,
    student1: "Sarah Grace",
    student2: "Michael John",
    cycle: "Day 1–3"
  },
  {
    id: 3,
    student1: "Emma Claire",
    student2: "Daniel James",
    cycle: "Day 1–3"
  },
  {
    id: 4,
    student1: "Peter Samuel",
    student2: "Anna Marie",
    cycle: "Day 1–3"
  }
];

/*
  TASK DATA
  -------------------------------
  Replace the sample assignment text with your real assignments.
  You can add as many assignments as you need under each subject.
*/
const tasks = {
  "Writer's Workshop": [
    "Complete the assigned writing exercise",
    "Review the writing work with your pair"
  ],

  "Guided Reading": [
    "Complete today's assigned reading",
    "Discuss the main ideas with your pair"
  ],

  "How To Learn": [
    "Complete the assigned learning activity",
    "Share one useful learning strategy with your pair"
  ],

  "Language Lab": [
    "Complete the assigned language practice",
    "Check answers together"
  ],

  "Communication art": [
    "Complete the communication activity",
    "Practice the assignment with your pair"
  ],

  "Discipleship": [
    "Complete today's discipleship assignment",
    "Discuss your reflections with your pair"
  ],

  "Mental health": [
    "Complete the assigned mental-health activity",
    "Share one helpful takeaway with your pair"
  ]
};

const tabs = document.getElementById("subjectTabs");
const grid = document.getElementById("taskGrid");
const searchInput = document.getElementById("studentSearch");
const searchButton = document.getElementById("searchStudent");
const result = document.getElementById("pairResult");
const tableBody = document.getElementById("pairTableBody");
const pairCount = document.getElementById("pairCount");

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

/* ---------- PAIRS ---------- */

function renderPairTable() {
  if (!tableBody) return;

  tableBody.innerHTML = pairData.map(pair => `
    <tr>
      <td class="student-cell">${escapeHtml(pair.student1)}</td>
      <td class="partner-cell">${escapeHtml(pair.student2)}</td>
      <td class="cycle-cell">${escapeHtml(pair.cycle)}</td>
    </tr>
    <tr>
      <td class="student-cell">${escapeHtml(pair.student2)}</td>
      <td class="partner-cell">${escapeHtml(pair.student1)}</td>
      <td class="cycle-cell">${escapeHtml(pair.cycle)}</td>
    </tr>
  `).join("");

  if (pairCount) {
    pairCount.textContent = `${pairData.length} pairs`;
  }
}

function findStudentPair(searchTerm) {
  const query = normalize(searchTerm);

  if (!query) return null;

  for (const pair of pairData) {
    const student1 = normalize(pair.student1);
    const student2 = normalize(pair.student2);

    if (student1.includes(query)) {
      return { pair, student: pair.student1, partner: pair.student2 };
    }

    if (student2.includes(query)) {
      return { pair, student: pair.student2, partner: pair.student1 };
    }
  }

  return null;
}

function showPairResult(searchTerm) {
  const found = findStudentPair(searchTerm);

  if (!searchTerm.trim()) {
    result.innerHTML = `
      <div class="result-placeholder">
        <div class="placeholder-icon">⌕</div>
        <h3>Search for your name</h3>
        <p>Enter your first name or last name above.</p>
      </div>
    `;
    return;
  }

  if (!found) {
    result.innerHTML = `
      <div class="result-placeholder">
        <div class="placeholder-icon">?</div>
        <h3>Student not found</h3>
        <p>Check the spelling or try another part of your name.</p>
      </div>
    `;
    showToast("No matching student found");
    return;
  }

  result.innerHTML = `
    <div class="pair-result-card">
      <div class="result-person">
        <div class="result-avatar">S1</div>
        <small>YOU</small>
        <strong>${escapeHtml(found.student)}</strong>
      </div>

      <div class="result-arrow">↔</div>

      <div class="result-person">
        <div class="result-avatar partner">S2</div>
        <small>YOUR LEARNING PARTNER</small>
        <strong>${escapeHtml(found.partner)}</strong>
      </div>

      <div class="result-cycle">
        🤝 Current pairing cycle: ${escapeHtml(found.pair.cycle)}
      </div>
    </div>
  `;

  showToast(`Your pair is ${found.partner} ✨`);
}

if (searchButton) {
  searchButton.addEventListener("click", () => {
    showPairResult(searchInput.value);
  });
}

if (searchInput) {
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      showPairResult(searchInput.value);
    }
  });
}

/* ---------- TASKS ---------- */

function renderTabs() {
  if (!tabs) return;

  tabs.innerHTML = subjects.map((subject, index) => `
    <button
      class="subject-tab ${index === 0 ? "active" : ""}"
      data-subject="${escapeHtml(subject)}"
    >
      ${escapeHtml(subject)}
    </button>
  `).join("");
}

function renderTasks(subject = subjects[0]) {
  if (!grid) return;

  const subjectTasks = tasks[subject] || [];

  grid.innerHTML = `
    <div class="task-subject-heading">
      <div>
        <span class="subject-dot"></span>
        <h2>${escapeHtml(subject)}</h2>
      </div>
      <span class="assignment-count">
        ${subjectTasks.length} assignment${subjectTasks.length === 1 ? "" : "s"}
      </span>
    </div>

    ${
      subjectTasks.length
        ? subjectTasks.map((task, index) => `
          <div class="assignment-card">
            <button
              class="task-check"
              data-index="${index}"
              aria-label="Mark task complete"
            >✓</button>

            <div class="assignment-info">
              <span>Assignment ${index + 1}</span>
              <h3>${escapeHtml(task)}</h3>
              <p>Work with your assigned pair during the current 3-day cycle.</p>
            </div>

            <span class="pair-tag">Pair work</span>
          </div>
        `).join("")
        : `<div class="no-results">No assignments have been added for this subject yet.</div>`
    }
  `;
}

if (tabs) {
  tabs.addEventListener("click", event => {
    const tab = event.target.closest(".subject-tab");
    if (!tab) return;

    document.querySelectorAll(".subject-tab").forEach(item => {
      item.classList.remove("active");
    });

    tab.classList.add("active");
    renderTasks(tab.dataset.subject);
  });
}

if (grid) {
  grid.addEventListener("click", event => {
    const check = event.target.closest(".task-check");
    if (!check) return;

    check.classList.toggle("done");
    showToast(
      check.classList.contains("done")
        ? "Assignment completed ✓"
        : "Assignment reopened"
    );
  });
}

/* ---------- NAVIGATION ---------- */

document.querySelectorAll(".nav-item[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active");
    });

    const destination = document.getElementById(button.dataset.page);

    if (destination) {
      destination.classList.add("active");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    document.querySelector(".sidebar")?.classList.remove("open");
  });
});

/* ---------- MOBILE MENU ---------- */

const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenu) {
  mobileMenu.addEventListener("click", () => {
    document.querySelector(".sidebar")?.classList.toggle("open");
  });
}

/* ---------- TOAST ---------- */

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.pairlyToastTimer);

  window.pairlyToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* ---------- INITIALIZE ---------- */

renderPairTable();
renderTabs();
renderTasks();
