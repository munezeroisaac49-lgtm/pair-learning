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

      // Store the name in Firebase Authentication too. This gives us a
      // reliable fallback if the Firestore profile is temporarily unavailable.
      const fullName = [firstName, secondName].filter(Boolean).join(" ");
      await cred.user.updateProfile({
        displayName: fullName
      });

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

    // Load the student's profile from students/{UID}.
    // The same UID is used by Firebase Authentication and Firestore.
    let profile = null;

    try {
      const docRef = db.collection("students").doc(user.uid);
      const doc = await docRef.get();

      if (doc.exists) {
        profile = doc.data();

        // Keep the Authentication display name synchronized with Firestore.
        const fullName = [profile.firstName, profile.secondName]
          .filter(Boolean)
          .join(" ");

        if (fullName && user.displayName !== fullName) {
          await user.updateProfile({ displayName: fullName });
        }
      } else if (user.displayName) {
        // If the Firestore document is missing but Authentication has the
        // name, rebuild the profile automatically.
        const parts = user.displayName.trim().split(/\\s+/);

        profile = {
          firstName: parts[0] || "",
          secondName: parts.slice(1).join(" "),
          email: user.email || "",
          uid: user.uid
        };

        // Repair the missing Firestore document.
        await docRef.set({
          ...profile,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } else {
        // No saved name exists anywhere. Do not pretend that the user's
        // first name is "Student"; show a clear placeholder instead.
        profile = {
          firstName: "",
          secondName: "",
          email: user.email || "",
          uid: user.uid
        };
      }
    } catch (err) {
      console.error("Could not load student profile:", err);

      // If Firestore is unavailable because of rules/network, still use
      // Firebase Authentication's saved displayName when available.
      const fallbackName = user.displayName || "";
      const parts = fallbackName.trim()
        ? fallbackName.trim().split(/\\s+/)
        : [];

      profile = {
        firstName: parts[0] || "",
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
    const firstName = profile.firstName || "";
    const secondName = profile.secondName || "";
    const email = profile.email || user.email || "";
    const fullName = [firstName, secondName].filter(Boolean).join(" ");
    const initials = (
      (firstName[0] || "") + (secondName[0] || "")
    ).toUpperCase() || "?";

    const greetingName = secondName || firstName || "there";

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
