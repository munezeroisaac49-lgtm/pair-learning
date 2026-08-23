// ---- Element references ----
const authScreen   = document.getElementById("authScreen");
const appShell      = document.querySelector(".app-shell");

const loginForm     = document.getElementById("loginForm");
const signupForm    = document.getElementById("signupForm");
const showSignup    = document.getElementById("showSignup");
const showLogin     = document.getElementById("showLogin");
const authError     = document.getElementById("authError");
const logoutBtn     = document.getElementById("logoutBtn");
const greeting      = document.getElementById("greeting");

// ---- Toggle between login/signup forms ----
showSignup.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
  authError.textContent = "";
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  authError.textContent = "";
});

// ---- Sign up ----
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstName = document.getElementById("signupFirstName").value.trim();
  const secondName = document.getElementById("signupSecondName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    // Save a student profile document keyed by their uid
    await db.collection("students").doc(cred.user.uid).set({
      firstName: firstName,
      secondName: secondName,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    authError.textContent = err.message;
  }
});

// ---- Log in ----
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    authError.textContent = err.message;
  }
});

// ---- Log out ----
logoutBtn.addEventListener("click", () => auth.signOut());

// ---- Show dashboard only when logged in, and greet the student ----
auth.onAuthStateChanged(async (user) => {
  if (user) {
    authScreen.classList.add("hidden");
    appShell.classList.remove("hidden");

    try {
      const doc = await db.collection("students").doc(user.uid).get();
      if (doc.exists) {
        const data = doc.data();
        greeting.textContent = "Welcome, " + (data.secondName || data.name || "");
      }
    } catch (err) {
      console.error("Could not load student profile:", err);
    }
  } else {
    authScreen.classList.remove("hidden");
    appShell.classList.add("hidden");
    greeting.textContent = "";
  }
});
