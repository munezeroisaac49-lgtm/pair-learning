let db = null;

const STORAGE_KEY = "pairly_tasks";

document.addEventListener("DOMContentLoaded", async () => {
  await loadDatabase();

  setupNavigation();
  setupMobileMenu();
  setupTaskModal();
  setupChat();
  setupSearch();
  setupFilters();
});


// ======================================================
// LOAD JSON DATABASE
// ======================================================

async function loadDatabase() {
  try {
    const response = await fetch("db.json");

    if (!response.ok) {
      throw new Error("Could not load db.json");
    }

    db = await response.json();

    loadSavedTasks();
    renderEverything();

  } catch (error) {
    console.error(error);

    showToast(
      "Could not load the database. Run the project using a local server."
    );
  }
}


// ======================================================
// LOCAL STORAGE
// ======================================================

function loadSavedTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (savedTasks) {
    db.tasks = JSON.parse(savedTasks);
  }
}

function saveTasks() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(db.tasks)
  );
}


// ======================================================
// RENDER EVERYTHING
// ======================================================

function renderEverything() {
  renderAccount();
  renderPair();
  renderStats();
  renderDashboardTasks();
  renderAllTasks();
  renderGoals();
  renderMessages();
  renderChart();
  renderAchievements();
}


// ======================================================
// ACCOUNT
// ======================================================

function renderAccount() {
  const account = db.account;

  setText("ownerName", account.name.replace(/\s+[A-Z]\.?$/, ""));
  setText("sidebarOwnerName", account.name);
  setText("sidebarOwnerRole", account.role);

  setText("ownerAvatar", account.avatar);
  setText("ownerAvatarBig", account.avatar);
}


// ======================================================
// PAIR
// ======================================================

function renderPair() {
  const pair = db.pair;

  setText("pairName", pair.name);
  setText("pairStatus", pair.status);
  setText(
    "pairCourse",
    `${pair.course} · Year ${pair.year}`
  );

  setText(
    "pairCompatibility",
    `${pair.compatibility}%`
  );

  setText("pairAvatarBig", pair.avatar);
  setText("pairProfileAvatar", pair.avatar);

  const subjects = document.getElementById("pairSubjects");

  if (subjects) {
    subjects.innerHTML = "";

    pair.subjects.forEach(subject => {
      const span = document.createElement("span");
      span.textContent = subject;
      subjects.appendChild(span);
    });
  }

  document.querySelectorAll(".second").forEach(avatar => {
    avatar.textContent = pair.avatar;
  });
}


// ======================================================
// DASHBOARD STATS
// ======================================================

function renderStats() {
  const stats = db.dashboard;

  const statCards = document.querySelectorAll(".stat-card");

  if (statCards.length >= 4) {
    statCards[0].querySelector("strong").textContent =
      stats.tasksCompleted;

    statCards[0].querySelector("small").textContent =
      "+18% this week";

    statCards[1].querySelector("strong").textContent =
      stats.studyTime;

    statCards[1].querySelector("small").textContent =
      stats.studyTimeToday;

    statCards[2].querySelector("strong").textContent =
      `${stats.pairStreak} days`;

    statCards[2].querySelector("small").textContent =
      `Best: ${stats.bestStreak} days`;

    statCards[3].querySelector("strong").textContent =
      stats.points.toLocaleString();

    statCards[3].querySelector("small").textContent =
      stats.classRank;
  }

  const progress = document.querySelector(".progress-ring strong");

  if (progress) {
    progress.textContent = `${stats.weeklyGoal}%`;
  }

  const legend = document.querySelectorAll(".legend span");

  if (legend.length >= 2) {
    legend[0].querySelector("b").textContent =
      stats.completedThisWeek;

    legend[1].querySelector("b").textContent =
      stats.remainingThisWeek;
  }
}


// ======================================================
// TASKS
// ======================================================

function renderDashboardTasks() {
  const container = document.getElementById("taskList");

  if (!container) return;

  const tasks = db.tasks.slice(0, 4);

  container.innerHTML = "";

  tasks.forEach(task => {
    container.appendChild(createTaskElement(task));
  });
}


function renderAllTasks() {
  const container = document.getElementById("allTasks");

  if (!container) return;

  container.innerHTML = "";

  db.tasks.forEach(task => {
    container.appendChild(createTaskElement(task, true));
  });
}


function createTaskElement(task, detailed = false) {
  const item = document.createElement("div");

  item.className = "task-item";

  if (task.status === "completed") {
    item.classList.add("completed");
  }

  const checkbox = document.createElement("button");

  checkbox.className = "task-check";
  checkbox.textContent =
    task.status === "completed" ? "✓" : "";

  checkbox.addEventListener("click", () => {
    toggleTask(task.id);
  });

  const content = document.createElement("div");

  content.className = "task-content";

  const title = document.createElement("strong");
  title.textContent = task.title;

  const meta = document.createElement("span");

  meta.textContent =
    `${task.subject} · ${task.due}`;

  if (task.shared) {
    meta.textContent += " · Shared";
  }

  content.appendChild(title);
  content.appendChild(meta);

  item.appendChild(checkbox);
  item.appendChild(content);

  if (task.status === "completed") {
    const completed = document.createElement("span");

    completed.className = "task-completed-label";
    completed.textContent = "Completed";

    item.appendChild(completed);
  }

  return item;
}


function toggleTask(taskId) {
  const task = db.tasks.find(
    task => task.id === taskId
  );

  if (!task) return;

  if (task.status === "completed") {
    task.status = "todo";
    task.completedBy = null;
  } else {
    task.status = "completed";
    task.completedBy = db.account.name;
  }

  saveTasks();
  renderEverything();

  showToast(
    task.status === "completed"
      ? "Task completed ✨"
      : "Task moved back to your tasks"
  );
}


// ======================================================
// ADD TASK
// ======================================================

function setupTaskModal() {
  const modal = document.getElementById("modal");
  const newTask = document.getElementById("newTask");

  const openButtons = [
    document.getElementById("addTaskBtn"),
    document.getElementById("addTaskBtn2")
  ];

  openButtons.forEach(button => {
    if (!button) return;

    button.addEventListener("click", () => {
      modal.classList.add("show");
      newTask.focus();
    });
  });


  document
    .getElementById("closeModal")
    ?.addEventListener("click", closeModal);

  document
    .getElementById("cancelModal")
    ?.addEventListener("click", closeModal);


  document
    .getElementById("saveTask")
    ?.addEventListener("click", createTask);


  newTask?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      createTask();
    }
  });
}


function closeModal() {
  const modal = document.getElementById("modal");
  const input = document.getElementById("newTask");

  modal.classList.remove("show");
  input.value = "";
}


function createTask() {
  const input = document.getElementById("newTask");
  const title = input.value.trim();

  if (!title) {
    showToast("Please enter a task name");
    return;
  }

  const task = {
    id: Date.now(),
    title: title,
    subject: "General",
    due: "Today",
    status: "todo",
    shared: true,
    completedBy: null
  };

  db.tasks.unshift(task);

  saveTasks();
  renderEverything();

  closeModal();

  showToast("Task added successfully ✨");
}


// ======================================================
// GOALS
// ======================================================

function renderGoals() {
  const goals = db.goals;

  const goalElements = document.querySelectorAll(".goal");

  goalElements.forEach((element, index) => {
    const goal = goals[index];

    if (!goal) return;

    const icon = element.querySelector(".goal-icon");
    const title = element.querySelector("b");
    const info = element.querySelector("span");
    const bar = element.querySelector(".bar i");
    const percentage = element.querySelector("strong");

    if (icon) icon.textContent = goal.icon;
    if (title) title.textContent = goal.title;

    if (info) {
      info.textContent =
        `${goal.completed} of ${goal.total} sessions`;
    }

    if (bar) {
      bar.style.width = `${goal.percentage}%`;
    }

    if (percentage) {
      percentage.textContent =
        `${goal.percentage}%`;
    }
  });
}


// ======================================================
// MESSAGES
// ======================================================

function renderMessages() {
  const chatBody = document.getElementById("chatBody");

  if (!chatBody) return;

  chatBody.innerHTML = `
    <div class="date-divider">Today</div>
  `;

  db.messages.forEach(message => {
    const bubble = document.createElement("div");

    bubble.className =
      `bubble ${message.type}`;

    bubble.textContent = message.message;

    chatBody.appendChild(bubble);
  });

  chatBody.scrollTop = chatBody.scrollHeight;
}


function setupChat() {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");

  if (!form || !input) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const message = input.value.trim();

    if (!message) return;

    db.messages.push({
      id: Date.now(),
      sender: db.account.name,
      senderAvatar: db.account.avatar,
      type: "me",
      message: message,
      time: "Just now"
    });

    input.value = "";

    renderMessages();

    showToast("Message sent ✨");
  });
}


// ======================================================
// PROGRESS CHART
// ======================================================

function renderChart() {
  const chart = document.getElementById("chart");

  if (!chart) return;

  chart.innerHTML = "";

  const max = Math.max(
    ...db.weeklyActivity.map(day => day.minutes)
  );

  db.weeklyActivity.forEach(day => {
    const column = document.createElement("div");

    column.className = "chart-column";

    const bar = document.createElement("div");

    bar.className = "chart-bar";

    const height =
      Math.max(
        10,
        (day.minutes / max) * 100
      );

    bar.style.height = `${height}%`;

    const label = document.createElement("span");

    label.textContent = day.day;

    column.appendChild(bar);
    column.appendChild(label);

    chart.appendChild(column);
  });
}


// ======================================================
// ACHIEVEMENTS
// ======================================================

function renderAchievements() {
  const container =
    document.querySelector(".achievements");

  if (!container) return;

  const achievements =
    db.achievements;

  const existing =
    container.querySelectorAll(".achievement");

  existing.forEach(element => {
    element.remove();
  });

  achievements.forEach(achievement => {
    const item =
      document.createElement("div");

    item.className = "achievement";

    if (achievement.status === "locked") {
      item.classList.add("locked");
    }

    item.innerHTML = `
      <span>${achievement.icon}</span>

      <div>
        <b>${achievement.title}</b>
        <small>${achievement.description}</small>
      </div>

      <em>
        ${
          achievement.status === "locked"
            ? `${achievement.remaining} left`
            : achievement.status
        }
      </em>
    `;

    container.appendChild(item);
  });
}


// ======================================================
// NAVIGATION
// ======================================================

function setupNavigation() {
  document.querySelectorAll(".nav-item[data-page]")
    .forEach(button => {

      button.addEventListener("click", () => {
        const page = button.dataset.page;

        showPage(page);

        document.querySelectorAll(".nav-item")
          .forEach(item =>
            item.classList.remove("active")
          );

        button.classList.add("active");
      });
    });


  document.querySelectorAll("[data-page-target]")
    .forEach(button => {

      button.addEventListener("click", () => {
        const page =
          button.dataset.pageTarget;

        showPage(page);

        document.querySelectorAll(".nav-item")
          .forEach(item => {
            item.classList.toggle(
              "active",
              item.dataset.page === page
            );
          });
      });
    });
}


function showPage(pageId) {
  document.querySelectorAll(".page")
    .forEach(page => {
      page.classList.toggle(
        "active",
        page.id === pageId
      );
    });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ======================================================
// MOBILE MENU
// ======================================================

function setupMobileMenu() {
  const button =
    document.getElementById("mobileMenu");

  const sidebar =
    document.querySelector(".sidebar");

  if (!button || !sidebar) return;

  button.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}


// ======================================================
// SEARCH
// ======================================================

function setupSearch() {
  const input =
    document.getElementById("searchInput");

  if (!input) return;

  input.addEventListener("input", () => {
    const search =
      input.value.toLowerCase().trim();

    document.querySelectorAll(
      "#allTasks .task-item"
    ).forEach(item => {

      item.style.display =
        item.textContent
          .toLowerCase()
          .includes(search)
            ? ""
            : "none";
    });
  });
}


// ======================================================
// TASK FILTERS
// ======================================================

function setupFilters() {
  document.querySelectorAll(".filter")
    .forEach(button => {

      button.addEventListener("click", () => {

        document.querySelectorAll(".filter")
          .forEach(item =>
            item.classList.remove("active")
          );

        button.classList.add("active");

        const filter =
          button.textContent
            .toLowerCase()
            .split(" ")[0];

        const items =
          document.querySelectorAll(
            "#allTasks .task-item"
          );

        items.forEach(item => {
          item.style.display = "";

          if (filter === "todo") {
            if (
              item.classList.contains("completed")
            ) {
              item.style.display = "none";
            }
          }

          if (filter === "completed") {
            if (
              !item.classList.contains("completed")
            ) {
              item.style.display = "none";
            }
          }
        });
      });
    });
}


// ======================================================
// TOAST
// ======================================================

function showToast(message) {
  const toast =
    document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


// ======================================================
// HELPER
// ======================================================

function setText(id, value) {
  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}
