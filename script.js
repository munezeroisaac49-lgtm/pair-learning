// Pairly — Main App
// Handles navigation, pair search, tasks, chat, and UI.
// Authentication is handled by auth.js.

(() => {
  "use strict";

  // ------------------------------------------------------------
  // PAIR DATA
  // EDIT YOUR PAIRS HERE ONLY
  // The table and search both use this list.
  // ------------------------------------------------------------

  const pairData = [
    { student: "Frank Gentil", partner: "Sophie Tumukunde" },
    { student: "Thierry Ndinimana", partner: "Herve" },
    { student: "Kevin Irumva", partner: "Chloe Agasaro" },
    { student: "Daella Erica", partner: "Max Dalvin" },
    { student: "Cedrick Sugira", partner: "Jeanne Uwayisaba" },
    { student: "Emery Baziga", partner: "Van Joyce" },
    { student: "Dernick Hirwa", partner: "Hope Mary" },
    { student: "Adjira Kabera", partner: "Marianne Dukuzimana" },
    { student: "Kelvin Ibyimanikora", partner: "Ratifa Iragena" },
    { student: "Frank Habumugisha", partner: "Adeline Uwimana" },
    { student: "Sandia Gisa", partner: "Benjamin Mukunzi" },
    { student: "Hyacinthe Niyonizera", partner: "Moise Steven" },
    { student: "Ella Keyla", partner: "Josee Happiness" },
    { student: "Fiacre Usengimana", partner: "Leanne Irasubiza" },
    { student: "Philbert Irakoze", partner: "Chance Flora" },
    { student: "Forever Hyacinthe", partner: "Jane Batakariza" },
    { student: "Glennah Keziah", partner: "Joy Nkurunziza" },
    { student: "Isaac Sendagire", partner: "Justin Tuyikunde" },
    { student: "Dieudonne Byishimo", partner: "Hillary Umuhire" },
    { student: "Benis Divin Irakoze", partner: "Gilles Corentin" },
    { student: "Sifa Ornella Ihoza", partner: "Heritier Ineza" },
    { student: "Gaella Umugisha", partner: "Florent Nisingizwe" },
    { student: "Desire Ntwari Ngeri", partner: "Ines Omega Kamikazi" },
    { student: "Bruce Irakoze", partner: "Noella Niyomuhoza" },
    { student: "Olivier Tuyizere", partner: "Ange Life Amizero" },
    { student: "Wilson Kanyamfura", partner: "Divine Niyigena" },
    { student: "Nancy Stella Mizero", partner: "Clement Iradukunda" },
    { student: "Betty Uwase", partner: "Charlotte Uwizeyimana" },
    { student: "Herve Nyirikinkindi", partner: "Isaac Munezero" },
    { student: "Hamed Hussein", partner: "Prince Emmanuel" },
    { student: "Faith Louange", partner: "Guilaine Ngoga" },
    { student: "Clarisse Kayitavu", partner: "Gisele Uwase" },
    { student: "Credo Assumptus", partner: "Nadine Umuhire" },
    { student: "Presley Mukunzi", partner: "Jean D'amour N." },
    { student: "Yannick Ineza", partner: "Esther Agasaro Isugi" },
    { student: "Flora Uwamariya", partner: "Marius Kigwira" },
    { student: "Irine Gihozo", partner: "Kedia Keza Isimbi" },
    { student: "Totis Irakoze", partner: "Bertin Ihirwe" },
    { student: "Germaine Rugwiro Shema", partner: "Dieudonne Amani" },
    { student: "Munezero Bertille", partner: "Uwurukundo Jean Yves" }
  ];

  // ------------------------------------------------------------
  // FIREBASE
  // ------------------------------------------------------------

  const db = window.pairlyDb;

  let currentUser = null;
  let currentUserData = null;
  let chatUnsubscribe = null;
  let unseenCount = 0;
  let isOnChatPage = false;

  // ------------------------------------------------------------
  // BUILD PAIR TABLE FROM pairData
  // ------------------------------------------------------------

  function buildPairTable() {
    const table = document.getElementById("pairTable");

    if (!table) return;

    const tbody = table.querySelector("tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    pairData.forEach((pair, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${escapeHtml(pair.student)}</td>
        <td>${escapeHtml(pair.partner)}</td>
      `;

      tbody.appendChild(row);
    });

    // Update pair count
    const countElement = document.querySelector(".assignment-count");

    if (countElement) {
      countElement.textContent = `${pairData.length} pairs`;
    }
  }

  // Build the table immediately.
  buildPairTable();

  // ------------------------------------------------------------
  // AUTH CONNECTION
  // ------------------------------------------------------------

  window.addEventListener("pairly-auth-ready", (event) => {
    currentUser = event.detail?.user || null;
    currentUserData = event.detail?.profile || null;

    if (currentUser) {
      initChat();
    } else {
      if (chatUnsubscribe) {
        chatUnsubscribe();
        chatUnsubscribe = null;
      }
    }
  });

  // ------------------------------------------------------------
  // NAVIGATION
  // ------------------------------------------------------------

  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo(button.dataset.page);

      document.getElementById("sidebar")?.classList.remove("open");
    });
  });

  function navigateTo(pageId) {
    const target = document.getElementById(pageId);

    if (!target) return;

    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
    });

    target.classList.add("active");

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });

    document
      .querySelectorAll(`[data-page="${CSS.escape(pageId)}"]`)
      .forEach((item) => item.classList.add("active"));

    isOnChatPage = pageId === "chat";

    if (isOnChatPage) {
      unseenCount = 0;
      updateChatBadge();

      setTimeout(scrollChatToBottom, 50);
    }
  }

  // Sidebar user card opens Profile
  document
    .getElementById("sidebarUserCard")
    ?.addEventListener("click", () => {
      navigateTo("profile");
    });

  // Mobile menu
  document
    .getElementById("mobileMenu")
    ?.addEventListener("click", () => {
      document.getElementById("sidebar")?.classList.toggle("open");
    });

  // ------------------------------------------------------------
  // TASK TABS
  // ------------------------------------------------------------

  const classButtons = document.querySelectorAll(".class-button");
  const classContents = document.querySelectorAll(".class-content");

  classButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const classId = button.dataset.class;

      classButtons.forEach((b) => {
        b.classList.remove("active");
      });

      classContents.forEach((c) => {
        c.classList.remove("active");
      });

      button.classList.add("active");

      const content = document.getElementById(classId);

      if (content) {
        content.classList.add("active");
      }
    });
  });

  // Always show first task subject
  if (classButtons.length > 0) {
    classButtons[0].click();
  }

  // ------------------------------------------------------------
  // PAIR SEARCH
  // ------------------------------------------------------------

  const searchInput = document.getElementById("studentSearch");
  const searchButton = document.getElementById("searchStudent");

  searchButton?.addEventListener("click", searchPair);

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchPair();
    }
  });

  function normalizeName(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function searchPair() {
    const input = document.getElementById("studentSearch");
    const result = document.getElementById("pairResult");
    const table = document.getElementById("pairTable");

    if (!input || !result || !table) return;

    const query = normalizeName(input.value);

    table.classList.remove("highlighted");

    table.querySelectorAll("tbody tr").forEach((row) => {
      row.classList.remove("match");
    });

    if (!query) {
      result.innerHTML = `
        <div class="result-placeholder">
          <div class="placeholder-icon">🔎</div>
          <h3>Enter a student name</h3>
          <p>Type a first name, last name, or full name.</p>
        </div>
      `;

      input.focus();

      return;
    }

    const words = query.split(" ").filter(Boolean);

    // SEARCH pairData, not the old HTML table.
    const matches = pairData.filter((pair) => {
      const student = normalizeName(pair.student);
      const partner = normalizeName(pair.partner);

      const studentMatch = words.every((word) =>
        student.includes(word)
      );

      const partnerMatch = words.every((word) =>
        partner.includes(word)
      );

      return studentMatch || partnerMatch;
    });

    // Highlight matching rows in the table
    const rows = Array.from(
      table.querySelectorAll("tbody tr")
    );

    matches.forEach((match) => {
      rows.forEach((row) => {
        const student = normalizeName(
          row.cells[1]?.textContent
        );

        const partner = normalizeName(
          row.cells[2]?.textContent
        );

        if (
          student === normalizeName(match.student) &&
          partner === normalizeName(match.partner)
        ) {
          row.classList.add("match");
        }
      });
    });

    if (matches.length === 0) {
      result.innerHTML = `
        <div class="result-placeholder">
          <div class="placeholder-icon">🔎</div>
          <h3>No student found</h3>
          <p>Try a first name, last name, or different spelling.</p>
        </div>
      `;

      return;
    }

    table.classList.add("highlighted");

    result.innerHTML = `
      <div style="width:100%">
        ${matches
          .map((pair) => {
            const student = pair.student;
            const partner = pair.partner;

            return `
              <div class="pair-found" style="margin-bottom:12px">

                <div class="pair-person">
                  <div class="avatar">
                    ${escapeHtml(student.charAt(0) || "?")}
                  </div>

                  <strong>${escapeHtml(student)}</strong>
                  <span>Student</span>
                </div>

                <div class="pair-connector">
                  <span>paired with</span>
                  →
                </div>

                <div class="pair-person">
                  <div class="avatar">
                    ${escapeHtml(partner.charAt(0) || "?")}
                  </div>

                  <strong>${escapeHtml(partner)}</strong>
                  <span>Learning Partner</span>
                </div>

              </div>
            `;
          })
          .join("")}
      </div>
    `;

    // Scroll to first matching row
    const firstMatch = rows.find((row) =>
      row.classList.contains("match")
    );

    if (firstMatch) {
      firstMatch.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }

  // ------------------------------------------------------------
  // CHAT
  // ------------------------------------------------------------

  function initChat() {
    if (!db || !currentUser) return;

    if (chatUnsubscribe) return;

    chatUnsubscribe = db
      .collection("messages")
      .orderBy("createdAt", "asc")
      .limit(200)
      .onSnapshot(
        (snapshot) => {
          const container =
            document.getElementById("chatMessages");

          const empty =
            document.getElementById("chatEmpty");

          if (!container) return;

          // Remove existing messages
          container
            .querySelectorAll(".chat-msg")
            .forEach((el) => el.remove());

          snapshot.forEach((doc) => {
            appendMessage(doc.data());
          });

          if (empty) {
            empty.style.display =
              snapshot.empty ? "flex" : "none";
          }

          if (!isOnChatPage) {
            unseenCount = snapshot.size;
            updateChatBadge();
          }

          if (isOnChatPage) {
            scrollChatToBottom();
          }
        },
        (error) => {
          console.error(
            "Chat Firestore error:",
            error
          );

          const empty =
            document.getElementById("chatEmpty");

          if (empty) {
            empty.style.display = "flex";

            empty.querySelector("p").textContent =
              "Chat could not load. Check your Firestore rules.";
          }
        }
      );
  }

  function appendMessage(data) {
    const container =
      document.getElementById("chatMessages");

    if (!container) return;

    const isMine =
      currentUser &&
      data.uid === currentUser.uid;

    const name =
      data.displayName || "Unknown";

    let time = "";

    if (data.createdAt?.seconds) {
      time = new Date(
        data.createdAt.seconds * 1000
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

    const message =
      document.createElement("div");

    message.className =
      "chat-msg" +
      (isMine ? " mine" : "");

    message.innerHTML = `
      <div class="chat-msg-avatar">
        ${escapeHtml(initials)}
      </div>

      <div class="chat-msg-body">

        <div class="chat-msg-meta">
          ${
            isMine
              ? ""
              : `<span class="chat-msg-name">
                   ${escapeHtml(name)}
                 </span>`
          }

          <span>${escapeHtml(time)}</span>
        </div>

        <div class="chat-bubble">
          ${escapeHtml(data.text || "")}
        </div>

      </div>
    `;

    container.appendChild(message);
  }

  function scrollChatToBottom() {
    const container =
      document.getElementById("chatMessages");

    if (container) {
      container.scrollTop =
        container.scrollHeight;
    }
  }

  function updateChatBadge() {
    const badge =
      document.getElementById("chatBadge");

    if (!badge) return;

    if (
      unseenCount > 0 &&
      !isOnChatPage
    ) {
      badge.textContent =
        unseenCount > 99
          ? "99+"
          : String(unseenCount);

      badge.classList.add("show");
    } else {
      badge.classList.remove("show");
    }
  }

  async function sendMessage() {
    const input =
      document.getElementById("chatInput");

    if (!input) return;

    const text =
      input.value.trim();

    if (!text) return;

    if (!currentUser) {
      alert(
        "Please sign in before sending a message."
      );

      return;
    }

    if (!db) {
      alert(
        "Firebase is not connected."
      );

      return;
    }

    const profile =
      currentUserData || {};

    const displayName =
      [
        profile.firstName,
        profile.secondName
      ]
        .filter(Boolean)
        .join(" ") ||
      currentUser.email ||
      "Student";

    try {
      await db
        .collection("messages")
        .add({
          text,
          uid: currentUser.uid,
          displayName,
          createdAt:
            firebase.firestore.FieldValue
              .serverTimestamp()
        });

      input.value = "";

      input.style.height = "auto";

    } catch (error) {
      console.error(
        "Send message failed:",
        error
      );

      alert(
        "Message could not be sent. Check your Firestore security rules."
      );
    }
  }

  document
    .getElementById("chatSend")
    ?.addEventListener(
      "click",
      sendMessage
    );

  document
    .getElementById("chatInput")
    ?.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {
          event.preventDefault();

          sendMessage();
        }
      }
    );

  document
    .getElementById("chatInput")
    ?.addEventListener(
      "input",
      function () {
        this.style.height = "auto";

        this.style.height =
          Math.min(
            this.scrollHeight,
            120
          ) + "px";
      }
    );

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ------------------------------------------------------------
  // START ON PAIRS
  // ------------------------------------------------------------

  navigateTo("pairs");

})();
