// ---- Element references ----
const authScreen   = document.getElementById("authScreen");
const appShell      = document.querySelector(".app-shell");

const loginForm     = document.getElementById("loginForm");
const signupForm    = document.getElementById("signupForm");
const showSignup    = document.getElementById("showSignup");
const showLogin     = document.getElementById("showLogin");
const authError     = document.getElementById("authError");
const logoutBtn     = document.getElementById("logoutBtn");

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
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    // Save a student profile document keyed by their uid
    await db.collection("students").doc(cred.user.uid).set({
      name: name,
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

// ---- Show dashboard only when logged in ----
auth.onAuthStateChanged((user) => {
  if (user) {
    authScreen.classList.add("hidden");
    appShell.classList.remove("hidden");
  } else {
    authScreen.classList.remove("hidden");
    appShell.classList.add("hidden");
  }
});

