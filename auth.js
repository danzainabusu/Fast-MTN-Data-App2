// ============================================
// FAST MTN DATA - AUTH.JS
// REGISTER + LOGIN
// ============================================

// ============================================
// WAIT FOR PAGE
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // PASSWORD EYE TOGGLE
  // ==========================================

  const eyes = document.querySelectorAll(".toggle-password");

  eyes.forEach(function (icon) {
    icon.addEventListener("click", function () {
      const input = icon.previousElementSibling;

      if (!input) {
        return;
      }

      if (input.type === "password") {
        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");
      }
    });
  });

  // ==========================================
  // REGISTER FORM
  // ==========================================

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // --------------------------------------
      // BUTTON
      // --------------------------------------

      const registerButton = registerForm.querySelector(
        'button[type="submit"]',
      );

      // --------------------------------------
      // INPUTS
      // --------------------------------------

      const name = document.getElementById("name").value.trim();

      const phone = document.getElementById("phone").value.trim();

      const password = document.getElementById("password").value;

      const confirmPassword = document.getElementById("confirmPassword").value;

      // --------------------------------------
      // EMPTY FIELDS
      // --------------------------------------

      if (!name || !phone || !password || !confirmPassword) {
        showAlert("Please fill in all fields ", "error");

        return;
      }

      // --------------------------------------
      // PHONE FORMAT
      // --------------------------------------

      if (!/^0\d{10}$/.test(phone)) {
        showAlert("Phone number must be 11 digits ", "error");

        return;
      }

      // --------------------------------------
      // MTN PREFIX
      // --------------------------------------

      const mtnPrefixes = [
        "0803",
        "0806",
        "0703",
        "0706",
        "0810",
        "0813",
        "0814",
        "0816",
        "0903",
        "0906",
        "0913",
        "0916",
      ];

      const isMTN = mtnPrefixes.some(function (prefix) {
        return phone.startsWith(prefix);
      });

      if (!isMTN) {
        showAlert("Please enter a valid MTN phone number ", "error");

        return;
      }

      // --------------------------------------
      // PASSWORD MATCH
      // --------------------------------------

      if (password !== confirmPassword) {
        showAlert("Passwords do not match ", "error");

        return;
      }

      // --------------------------------------
      // GET USERS
      // --------------------------------------

      let users = [];

      try {
        users = JSON.parse(localStorage.getItem("users")) || [];
      } catch (error) {
        users = [];
      }

      // --------------------------------------
      // CHECK EXISTING USER
      // --------------------------------------

      const existingUser = users.find(function (user) {
        return user.phone === phone;
      });

      if (existingUser) {
        showAlert("This phone number already exists ", "error");

        return;
      }

      // --------------------------------------
      // START LOADER
      // --------------------------------------

      startButtonLoading(registerButton, "Creating Account...");

      // --------------------------------------
      // CREATE USER
      // --------------------------------------

      const newUser = {
        name: name,

        phone: phone,

        password: password,

        balance: 5000,

        transactions: [],

        notificationsList: [],
      };

      // --------------------------------------
      // ADD USER
      // --------------------------------------

      users.push(newUser);

      // --------------------------------------
      // SAVE USERS
      // --------------------------------------

      localStorage.setItem("users", JSON.stringify(users));

      // --------------------------------------
      // SAVE LOGGED-IN USER
      // --------------------------------------

      localStorage.setItem("loggedInUser", JSON.stringify(newUser));

      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      showAlert("Registration successful ", "success");

      // --------------------------------------
      // GO TO LOGIN
      // --------------------------------------

      setTimeout(function () {
        window.location.href = "login.html";
      }, 1000);
    });
  }

  // ==========================================
  // LOGIN FORM
  // ==========================================

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // --------------------------------------
      // BUTTON
      // --------------------------------------

      const loginButton = loginForm.querySelector('button[type="submit"]');

      // --------------------------------------
      // INPUTS
      // --------------------------------------

      const phone = document.getElementById("loginPhone").value.trim();

      const password = document.getElementById("loginPassword").value;

      // --------------------------------------
      // EMPTY FIELDS
      // --------------------------------------

      if (!phone || !password) {
        showAlert("Please fill in all fields ", "error");

        return;
      }

      // --------------------------------------
      // GET USERS
      // --------------------------------------

      let users = [];

      try {
        users = JSON.parse(localStorage.getItem("users")) || [];
      } catch (error) {
        users = [];
      }

      // --------------------------------------
      // FIND USER
      // --------------------------------------

      const user = users.find(function (item) {
        return item.phone === phone && item.password === password;
      });

      // --------------------------------------
      // INVALID LOGIN
      // --------------------------------------

      if (!user) {
        showAlert("Invalid phone number or password ", "error");

        return;
      }

      // --------------------------------------
      // START LOADER
      // --------------------------------------

      startButtonLoading(loginButton, "Logging In...");

      // --------------------------------------
      // SAVE USER
      // --------------------------------------

      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      showAlert("Login Successful.", "success");

      // --------------------------------------
      // GO TO DASHBOARD
      // --------------------------------------

      setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 1000);
    });
  }
});
