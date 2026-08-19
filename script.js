document.addEventListener("DOMContentLoaded", function () {

  const pairs = [
    ["Frank Gentil", "Van Joyce"],
    ["Thierry Ndinimana", "Herve"],
    ["Kevin Irumva", "Chloe Agasaro"],
    ["Daella Erica", "Max Dalvin"],
    ["Cedrick Sugira", "Jeanne Uwayisaba"],
    ["Emery Baziga", "Sophie Tumukunde"],
    ["Dernick Hirwa", "Hope Mary"],
    ["Adjira Kabera", "Marianne Dukuzimana"],
    ["Kelvin Ibyimanikora", "Ratifa Iragena"],
    ["Frank Habumugisha", "Adeline Uwimana"],
    ["Sandia Gisa", "Benjamin Mukunzi"],
    ["Hyacinthe Niyonizera", "Moise Steven"],
    ["Ella Keyla", "Josee Happiness"],
    ["Fiacre Usengimana", "Leanne Irasubiza"],
    ["Philbert Irakoze", "Chance Flora"],
    ["Forever Hyacinthe", "Jane Batakariza"],
    ["Glennah Keziah", "Joy Nkurunziza"],
    ["Isaac Sendagire", "Justin Tuyikunde"],
    ["Dieudonne Byishimo", "Hillary Umuhire"],
    ["Benis Divin Irakoze", "Gilles Corentin"],
    ["Sifa Ornella Ihoza", "Heritier Ineza"],
    ["Gaella Umugisha", "Florent Nisingizwe"],
    ["Desire Ntwari Ngeri", "Ines Omega Kamikazi"],
    ["Bruce Irakoze", "Noella Niyomuhoza"],
    ["Olivier Tuyizere", "Ange Life Amizero"],
    ["Wilson Kanyamfura", "Divine Niyigena"],
    ["Nancy Stella Mizero", "Clement Iradukunda"],
    ["Betty Uwase", "Charlotte Uwizeyimana"],
    ["Herve Nyirikinkindi", "Isaac Munezero"],
    ["Hamed Hussein", "Prince Emmanuel"],
    ["Faith Louange", "Guilaine Ngoga"],
    ["Clarisse Kayitavu", "Gisele Uwase"],
    ["Credo Assumptus", "Nadine Umuhire"],
    ["Presley Mukunzi", "Jean D'amour N."],
    ["Yannick Ineza", "Esther Agasaro Isugi"],
    ["Flora Uwamariya", "Marius Kigwira"],
    ["Irine Gihozo", "Kedia Keza Isimbi"],
    ["Totis Irakoze", "Bertin Ihirwe"],
    ["Germaine Shema", "Dieudonne Amani"],
    ["Flora Uwamariya", "Kheila Verra"],
    ["Munezero Bertille", "Uwurukundo Jean Yves"]
];

  /* PAGE NAVIGATION */

  const navButtons = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");

  navButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const pageId = button.dataset.page;

      navButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");

      pages.forEach(function (page) {

        page.classList.toggle(
          "active",
          page.id === pageId
        );

      });

      window.scrollTo(0, 0);

    });

  });


  /* PAIR SEARCH */

  const input = document.getElementById("studentSearch");
  const searchButton = document.getElementById("searchStudent");
  const result = document.getElementById("pairResult");


  function searchPair() {

    const query = input.value.trim().toLowerCase();

    if (!query) {

      result.innerHTML = `
        <div class="result-placeholder">
          <div class="placeholder-icon">⌕</div>
          <h3>Your pair will appear here</h3>
          <p>Search your name above.</p>
        </div>
      `;

      return;
    }


    let found = null;

    for (const pair of pairs) {

      if (
        pair[0].toLowerCase().includes(query) ||
        pair[1].toLowerCase().includes(query)
      ) {
        found = pair;
        break;
      }

    }


    if (!found) {

      result.innerHTML = `
        <div class="result-placeholder">
          <div class="placeholder-icon">?</div>
          <h3>Student not found</h3>
          <p>Check the spelling and try again.</p>
        </div>
      `;

      return;
    }


    let student = found[0];
    let partner = found[1];


    if (!found[0].toLowerCase().includes(query)) {
      student = found[1];
      partner = found[0];
    }


    result.innerHTML = `
      <div class="pair-profile panel">
        <p class="eyebrow">YOUR PAIR</p>

        <h2>
          ${student} ↔ ${partner}
        </h2>

        <p class="muted">
          Current 3-day cycle
        </p>
      </div>
    `;

  }


  searchButton.addEventListener("click", searchPair);


  input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
      searchPair();
    }

  });


  /* MOBILE MENU */

  const mobileMenu = document.getElementById("mobileMenu");
  const sidebar = document.querySelector(".sidebar");

  if (mobileMenu && sidebar) {

    mobileMenu.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });

  }

});
// ========================================
// TASK CLASS BUTTONS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const classButtons = document.querySelectorAll(".class-button");
    const classContents = document.querySelectorAll(".class-content");

    classButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedClass = button.getAttribute("data-class");

            // Hide all class contents
            classContents.forEach(function (content) {
                content.classList.remove("active");
            });

            // Remove active from all buttons
            classButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            // Show the selected class
            const selectedContent = document.getElementById(selectedClass);

            if (selectedContent) {
                selectedContent.classList.add("active");
            }

            // Highlight selected button
            button.classList.add("active");

        });

    });

});
