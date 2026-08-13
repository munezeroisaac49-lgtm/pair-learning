const subjects = [
  "Writer's Workshop",
  "Guided Reading",
  "How To Learn",
  "Language Lab",
  "Communication art",
  "Discipleship",
  "Mental health"
];

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

function renderTabs() {
  tabs.innerHTML = subjects.map((s, i) =>
    `<button class="subject-tab ${i === 0 ? "active" : ""}" data-subject="${escapeAttr(s)}">${s}</button>`
  ).join("");
}

function renderTasks(subject = subjects[0]) {
  grid.innerHTML = `
    <div class="task-subject-heading">
      <div>
        <span class="subject-dot"></span>
        <h2>${escapeHtml(subject)}</h2>
      </div>
      <span class="assignment-count">${tasks[subject].length} assignments</span>
    </div>
    ${tasks[subject].map((task, i) => `
      <div class="assignment-card">
        <button class="task-check" data-index="${i}" aria-label="Mark task complete">✓</button>
        <div class="assignment-info">
          <span>Assignment ${i + 1}</span>
          <h3>${escapeHtml(task)}</h3>
          <p>Work with your assigned pair during the current 3-day cycle.</p>
        </div>
        <span class="pair-tag">Pair work</span>
      </div>
    `).join("")}
  `;
}

tabs.addEventListener("click", e => {
  const tab = e.target.closest(".subject-tab");
  if (!tab) return;
  document.querySelectorAll(".subject-tab").forEach(x => x.classList.remove("active"));
  tab.classList.add("active");
  renderTasks(tab.dataset.subject);
});

grid.addEventListener("click", e => {
  const check = e.target.closest(".task-check");
  if (!check) return;
  check.classList.toggle("done");
  check.textContent = check.classList.contains("done") ? "✓" : "✓";
  showToast(check.classList.contains("done") ? "Assignment completed ✓" : "Assignment reopened");
});

document.querySelectorAll(".nav-item[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(btn.dataset.page).classList.add("active");
    window.scrollTo({top: 0, behavior: "smooth"});
  });
});

document.getElementById("mobileMenu").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

document.getElementById("loadPair").addEventListener("click", () => {
  const input = document.getElementById("pairCodeInput");
  const code = input.value.trim().toUpperCase();
  if (!code) {
    input.focus();
    showToast("Enter your pair code first");
    return;
  }
  document.getElementById("currentPair").textContent = "Pair " + code;
  showToast("Pair " + code + " loaded ✨");
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
function escapeAttr(s) { return escapeHtml(s); }

renderTabs();
renderTasks();
