/* Pairly — Student Workspace
   New student pairs
*/

const pairData = [
  { student: "Frank Gentil", partner: "Thierry Ndinimana", cycle: "Current 3-day cycle" },
  { student: "Van Joyce", partner: "Herve", cycle: "Current 3-day cycle" },
  { student: "Kevin Irumva", partner: "Daella Erica", cycle: "Current 3-day cycle" },
  { student: "Chloe Agasaro", partner: "Max Dalvin", cycle: "Current 3-day cycle" },
  { student: "Cedrick Sugira", partner: "Emery Baziga", cycle: "Current 3-day cycle" },
  { student: "Jeanne Uwayisaba", partner: "Sophie Tumukunde", cycle: "Current 3-day cycle" },
  { student: "Dernick Hirwa", partner: "Adjira Kabera", cycle: "Current 3-day cycle" },
  { student: "Hope Mary", partner: "Marianne Dukuzimana", cycle: "Current 3-day cycle" },
  { student: "Kelvin Ibyimanikora", partner: "Frank Habumugisha", cycle: "Current 3-day cycle" },
  { student: "Ratifa Iragena", partner: "Adeline Uwimana", cycle: "Current 3-day cycle" },
  { student: "Sandia Gisa", partner: "Hyacinthe Niyonizera", cycle: "Current 3-day cycle" },
  { student: "Benjamin Mukunzi", partner: "Moise Steven", cycle: "Current 3-day cycle" },
  { student: "Ella Keyla", partner: "Fiacre Usengimana", cycle: "Current 3-day cycle" },
  { student: "Josee Happiness", partner: "Leanne Irasubiza", cycle: "Current 3-day cycle" },
  { student: "Philbert Irakoze", partner: "Forever Hyacinthe", cycle: "Current 3-day cycle" },
  { student: "Chance Flora", partner: "Jane Batakariza", cycle: "Current 3-day cycle" },
  { student: "Glennah Keziah", partner: "Joy Nkurunziza", cycle: "Current 3-day cycle" },
  { student: "Isaac Sendagire", partner: "Justin Tuyikunde", cycle: "Current 3-day cycle" },
  { student: "Dieudonne Byishimo", partner: "Hillary Umuhire", cycle: "Current 3-day cycle" },
  { student: "Benis Divin Irakoze", partner: "Gilles Corentin", cycle: "Current 3-day cycle" },
  { student: "Sifa Ornella Ihoza", partner: "Heritier Ineza", cycle: "Current 3-day cycle" },
  { student: "Gaella Umugisha", partner: "Florent Nisingizwe", cycle: "Current 3-day cycle" },
  { student: "Desire Ntwari Ngeri", partner: "Bruce Irakoze", cycle: "Current 3-day cycle" },
  { student: "Ines Omega Kamikazi", partner: "Noella Niyomuhoza", cycle: "Current 3-day cycle" },
  { student: "Olivier Tuyizere", partner: "Wilson Kanyamfura", cycle: "Current 3-day cycle" },
  { student: "Ange Life Amizero", partner: "Divine Niyigena", cycle: "Current 3-day cycle" },
  { student: "Nancy Stella Mizero", partner: "Betty Uwase", cycle: "Current 3-day cycle" },
  { student: "Clement Iradukunda", partner: "Charlotte Uwizeyimana", cycle: "Current 3-day cycle" },
  { student: "Herve Nyirikinkindi", partner: "Hamed Hussein", cycle: "Current 3-day cycle" },
  { student: "Isaac Munezero", partner: "Prince Emmanuel", cycle: "Current 3-day cycle" },
  { student: "Faith Louange", partner: "Clarisse Kayitavu", cycle: "Current 3-day cycle" },
  { student: "Guilaine Ngoga", partner: "Gisele Uwase", cycle: "Current 3-day cycle" },
  { student: "Credo Assumptus", partner: "Presley Mukunzi", cycle: "Current 3-day cycle" },
  { student: "Nadine Umuhire", partner: "Jean D'amour N.", cycle: "Current 3-day cycle" },
  { student: "Yannick Ineza", partner: "Flora Uwamariya", cycle: "Current 3-day cycle" },
  { student: "Esther Agasaro Isugi", partner: "Marius Kigwira", cycle: "Current 3-day cycle" },
  { student: "Irine Gihozo", partner: "Totis Irakoze", cycle: "Current 3-day cycle" },
  { student: "Kedia Keza Isimbi", partner: "Bertin Ihirwe", cycle: "Current 3-day cycle" },
  { student: "Germaine Shema", partner: "Jean Yves T.", cycle: "Current 3-day cycle" },
  { student: "Dieudonne Amani", partner: "Kheila Verra", cycle: "Current 3-day cycle" },
   { student: "Uwurukundo Jean Yves", partner: "Munezero Bertille", cycle: "Current 3-day cycle" }
];

const unassignedStudents = ["Munezero Berithile"];

const subjects = [
  "Writer's Workshop",
  "Guided Reading",
  "How To Learn",
  "Language Lab",
  "Communication art",
  "Discipleship",
  "Mental health"
];

const assignments = {
  "Writer's Workshop": [
    {
      title: "Write an informative essay",
      description: "Complete your first draft as soon as possible because assignments are increasing over time."
    },
    {
      title: "Writing strong introduction ",
      description: "Write a strong hook, background and thesis statement."
    }
  ],
  "Guided Reading": [{
      title: "August 14, 2026 : Novel study",
      description: "Dear year one scholar, please read the novel from chapter 15 to chapter 26."
    }],
  "How To Learn": [{
    title: "August 15, 2026 : Recent assignment",
    description: "Assignment: After_Wed_Class Assignment: Ask Better Questions in One Subject: Due tomorrow 8:30 AM"
  }],
  "Language Lab": [],
  "Communication art": [],
  "Discipleship": [],
  "Mental health": []
};

document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  renderPairTable();
  setupPairSearch();
  renderTasks();
  setupMobileMenu();
});


function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");

  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const target = item.dataset.page;

      navItems.forEach(function (nav) {
        nav.classList.toggle("active", nav === item);
      });

      pages.forEach(function (page) {
        page.classList.toggle("active", page.id === target);
      });
    });
  });
}


function renderPairTable() {
  const tbody = document.getElementById("pairTableBody");
  const count = document.getElementById("pairCount");

  if (!tbody) return;

  tbody.innerHTML = "";

  pairData.forEach(function (pair, index) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(pair.student)}</td>
      <td>${escapeHtml(pair.partner)}</td>
    `;

    tbody.appendChild(row);
  });

  if (count) {
    count.textContent = `${pairData.length} pairs`;
  }
}


function setupPairSearch() {
  const input = document.getElementById("studentSearch");
  const button = document.getElementById("searchStudent");

  if (!input || !button) return;

  function search() {
    const query = input.value.trim().toLowerCase();

    if (!query) {
      showPairPlaceholder();
      return;
    }

    const match = pairData.find(function (pair) {
      return (
        pair.student.toLowerCase().includes(query) ||
        pair.partner.toLowerCase().includes(query)
      );
    });

    if (!match) {
      const unassigned = unassignedStudents.find(function (name) {
        return name.toLowerCase().includes(query);
      });

      if (unassigned) {
        showPairResult(
          unassigned,
          "No partner assigned",
          "This student is currently listed without a partner."
        );
      } else {
        showPairNotFound();
      }

      return;
    }

    const searchedStudent = match.student.toLowerCase().includes(query)
      ? match.student
      : match.partner;

    const partner =
      searchedStudent === match.student
        ? match.partner
        : match.student;

    showPairResult(
      searchedStudent,
      partner,
      "Current 3-day cycle"
    );
  }

  button.addEventListener("click", search);

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      search();
    }
  });
}


function showPairResult(student, partner, detail) {
  const result = document.getElementById("pairResult");

  if (!result) return;

  result.innerHTML = `
    <div class="pair-profile panel">
      <div>
        <p class="eyebrow">YOUR PAIR</p>
        <h2>${escapeHtml(student)} ↔ ${escapeHtml(partner)}</h2>
        <p class="muted">${escapeHtml(detail)}</p>
      </div>
    </div>
  `;
}


function showPairPlaceholder() {
  const result = document.getElementById("pairResult");

  if (!result) return;

  result.innerHTML = `
    <div class="result-placeholder">
      <div class="placeholder-icon">⌕</div>
      <h3>Your pair will appear here</h3>
      <p>Search your name above to see your assigned learning partner.</p>
    </div>
  `;
}


function showPairNotFound() {
  const result = document.getElementById("pairResult");

  if (!result) return;

  result.innerHTML = `
    <div class="result-placeholder">
      <div class="placeholder-icon">?</div>
      <h3>Student not found</h3>
      <p>Check the spelling and try searching again.</p>
    </div>
  `;
}


function renderTasks() {
  const tabs = document.getElementById("subjectTabs");
  const grid = document.getElementById("taskGrid");

  if (!tabs || !grid) return;

  tabs.innerHTML = "";

  subjects.forEach(function (subject, index) {
    const button = document.createElement("button");

    button.className =
      "subject-tab" + (index === 0 ? " active" : "");

    button.textContent = subject;

    button.addEventListener("click", function () {
      document.querySelectorAll(".subject-tab").forEach(function (tab) {
        tab.classList.remove("active");
      });

      button.classList.add("active");

      renderSubjectTasks(subject);
    });

    tabs.appendChild(button);
  });

  renderSubjectTasks(subjects[0]);
}


function renderSubjectTasks(subject) {
  const grid = document.getElementById("taskGrid");

  if (!grid) return;

  const items = assignments[subject] || [];

  if (!items.length) {
    grid.innerHTML = `
      <div class="result-placeholder">
        <h3>No assignments added yet</h3>
        <p>Assignments for ${escapeHtml(subject)} can be added in script.js.</p>
      </div>
    `;

    return;
  }

 grid.innerHTML = items
  .map(function (item) {
    return `
      <article class="task-card">
        <h3>${escapeHtml(item.title || item)}</h3>
        <p>${escapeHtml(item.description || "")}</p>
      </article>
    `;
  })
  .join("");
}


function setupMobileMenu() {
  const button = document.getElementById("mobileMenu");
  const sidebar = document.querySelector(".sidebar");

  if (!button || !sidebar) return;

  button.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
