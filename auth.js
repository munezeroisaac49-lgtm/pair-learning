// Pairly — Authentication
// This file handles ONLY login, signup, logout, and the student profile.

(() => {
  const auth = window.pairlyAuth;
  const db = window.pairlyDb;

  const authScreen = document.getElementById("authScreen");
  const appShell = document.querySelector(".app-shell");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");
  const authError = document.getElementById("authError");
  const logoutBtn = document.getElementById("logoutBtn");

  function showError(message) {
    if (authError) authError.textContent = message || "";
  }

  function showApp() {
    authScreen?.classList.add("hidden");
    appShell?.classList.remove("hidden");
  }

  function hideApp() {
    authScreen?.classList.remove("hidden");
    appShell?.classList.add("hidden");
  }

  // Switch login/signup
  showSignup?.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm?.classList.add("hidden");
    signupForm?.classList.remove("hidden");
    showError("");
  });

  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    signupForm?.classList.add("hidden");
    loginForm?.classList.remove("hidden");
    showError("");
  });

  // Login
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError("");

    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    try {
      if (!auth) throw new Error("Firebase is not connected. Check firebase-config.js.");
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      showError(formatFirebaseError(err));
    }
  });

  // Signup
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError("");

    const firstName = document.getElementById("signupFirstName")?.value.trim();
    const secondName = document.getElementById("signupSecondName")?.value.trim();
    const email = document.getElementById("signupEmail")?.value.trim();
    const password = document.getElementById("signupPassword")?.value;

    if (!firstName || !secondName || !email || !password) {
      showError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    try {
      if (!auth || !db) {
        throw new Error("Firebase is not connected. Check firebase-config.js.");
      }

      const cred = await auth.createUserWithEmailAndPassword(email, password);

      // IMPORTANT: use ONE collection everywhere: students
      await db.collection("students").doc(cred.user.uid).set({
        firstName,
        secondName,
        email,
        uid: cred.user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      showError(formatFirebaseError(err));
    }
  });

  // Logout
  logoutBtn?.addEventListener("click", async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });

  // Authentication state
  auth?.onAuthStateChanged(async (user) => {
    if (!user) {
      hideApp();
      window.dispatchEvent(new CustomEvent("pairly-auth-ready", { detail: { user: null } }));
      return;
    }

    showApp();

    // Load student profile from the SAME "students" collection used at signup.
    let profile = null;

    try {
      const doc = await db.collection("students").doc(user.uid).get();

      if (doc.exists) {
        profile = doc.data();
      } else {
        // Create a fallback profile so the rest of the app can still work.
        const fallbackName = user.displayName || "Student";
        const parts = fallbackName.trim().split(/\s+/);

        profile = {
          firstName: parts[0] || "Student",
          secondName: parts.slice(1).join(" "),
          email: user.email || "",
          uid: user.uid
        };
      }
    } catch (err) {
      console.warn("Could not load student profile:", err);

      const fallbackName = user.displayName || "Student";
      const parts = fallbackName.trim().split(/\s+/);

      profile = {
        firstName: parts[0] || "Student",
        secondName: parts.slice(1).join(" "),
        email: user.email || "",
        uid: user.uid
      };
    }

    window.pairlyCurrentUser = user;
    window.pairlyCurrentUserData = profile;

    renderProfile(profile, user);

    window.dispatchEvent(new CustomEvent("pairly-auth-ready", {
      detail: { user, profile }
    }));
  });

  function renderProfile(profile, user) {
    const firstName = profile.firstName || "Student";
    const secondName = profile.secondName || "";
    const email = profile.email || user.email || "";
    const fullName = [firstName, secondName].filter(Boolean).join(" ");
    const initials = (
      (firstName[0] || "") + (secondName[0] || "")
    ).toUpperCase() || "?";

    const greetingName = secondName || firstName;

    setText("greeting", `Hello, ${greetingName}`);
    setText("sidebarAvatar", initials);
    setText("sidebarName", fullName);
    setText("sidebarEmail", email);

    setText("profileAvatar", initials);
    setText("profileFullName", fullName);
    setText("profileEmail", email);
    setText("profileFirstName", firstName);
    setText("profileSecondName", secondName || "—");
    setText("profileEmailCard", email || "—");
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatFirebaseError(err) {
    const code = err?.code || "";

    const messages = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-not-found": "No account was found with that email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Email or password is incorrect.",
      "auth/email-already-in-use": "An account already exists with that email.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/network-request-failed": "Network error. Check your internet connection.",
      "auth/too-many-requests": "Too many attempts. Please try again later."
    };

    return messages[code] || err?.message || "Something went wrong.";
  }
})();
