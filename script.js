document.addEventListener("DOMContentLoaded", function () {

  const pairs = [
    ["Frank Gentil", "Thierry Ndinimana"],
    ["Van Joyce", "Herve"],
    ["Kevin Irumva", "Daella Erica"],
    ["Chloe Agasaro", "Max Dalvin"],
    ["Cedrick Sugira", "Emery Baziga"],
    ["Jeanne Uwayisaba", "Sophie Tumukunde"],
    ["Dernick Hirwa", "Adjira Kabera"],
    ["Hope Mary", "Marianne Dukuzimana"],
    ["Kelvin Ibyimanikora", "Frank Habumugisha"],
    ["Ratifa Iragena", "Adeline Uwimana"],
    ["Sandia Gisa", "Hyacinthe Niyonizera"],
    ["Benjamin Mukunzi", "Moise Steven"],
    ["Ella Keyla", "Fiacre Usengimana"],
    ["Josee Happiness", "Leanne Irasubiza"],
    ["Philbert Irakoze", "Forever Hyacinthe"],
    ["Chance Flora", "Jane Batakariza"],
    ["Glennah Keziah", "Joy Nkurunziza"],
    ["Isaac Sendagire", "Justin Tuyikunde"],
    ["Dieudonne Byishimo", "Hillary Umuhire"],
    ["Benis Divin Irakoze", "Gilles Corentin"],
    ["Sifa Ornella Ihoza", "Heritier Ineza"],
    ["Gaella Umugisha", "Florent Nisingizwe"],
    ["Desire Ntwari Ngeri", "Bruce Irakoze"],
    ["Ines Omega Kamikazi", "Noella Niyomuhoza"],
    ["Olivier Tuyizere", "Wilson Kanyamfura"],
    ["Ange Life Amizero", "Divine Niyigena"],
    ["Nancy Stella Mizero", "Betty Uwase"],
    ["Clement Iradukunda", "Charlotte Uwizeyimana"],
    ["Herve Nyirikinkindi", "Hamed Hussein"],
    ["Isaac Munezero", "Prince Emmanuel"],
    ["Faith Louange", "Clarisse Kayitavu"],
    ["Guilaine Ngoga", "Gisele Uwase"],
    ["Credo Assumptus", "Presley Mukunzi"],
    ["Nadine Umuhire", "Jean D'amour N."],
    ["Yannick Ineza", "Flora Uwamariya"],
    ["Esther Agasaro Isugi", "Marius Kigwira"],
    ["Irine Gihozo", "Totis Irakoze"],
    ["Kedia Keza Isimbi", "Bertin Ihirwe"],
    ["Germaine Shema", "Jean Yves T."],
    ["Dieudonne Amani", "Kheila Verra"],
    ["Uwurukundo Jean Yves", "Munezero Bertille"]
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
