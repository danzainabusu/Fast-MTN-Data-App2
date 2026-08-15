// ============================================
// FAST MTN DATA
// NOTIFICATION SETTINGS
// ============================================

// ============================================
// GET LOGGED-IN USER
// ============================================

let user = JSON.parse(localStorage.getItem("loggedInUser"));

// ============================================
// CHECK LOGIN
// ============================================

if (!user) {
  window.location.href = "login.html";
}

// ============================================
// CREATE NOTIFICATION SETTINGS
// ============================================
//
// We use:
// user.notifications
//
// This matches your existing system.
// ============================================

if (!user.notifications) {
  user.notifications = {
    data: true,
    wallet: true,
    airtime: true,
    convert: true,
    withdraw: true,
  };
}

// ============================================
// MAKE SURE OLD USERS GET WITHDRAW
// ============================================

if (typeof user.notifications.withdraw === "undefined") {
  user.notifications.withdraw = true;
}

// ============================================
// ELEMENT IDS
// ============================================

const ids = {
  data: "dataNotify",

  wallet: "walletNotify",

  airtime: "airtimeNotify",

  convert: "convertNotify",

  withdraw: "withdrawNotify",
};

// ============================================
// INITIALIZE SETTINGS
// ============================================

Object.keys(ids).forEach(function (key) {
  const checkbox = document.getElementById(ids[key]);

  // Make sure element exists

  if (!checkbox) {
    return;
  }

  // Show saved setting

  checkbox.checked = user.notifications[key] === true;

  // ==========================================
  // WHEN USER CHANGES SWITCH
  // ==========================================

  checkbox.addEventListener("change", function () {
    user.notifications[key] = this.checked;

    // ========================================
    // SAVE USER
    // ========================================

    saveNotificationSettings();
  });
});

// ============================================
// SAVE NOTIFICATION SETTINGS
// ============================================

function saveNotificationSettings() {
  // Save logged-in user

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  // Get all users

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Find current user

  const index = users.findIndex(function (u) {
    return u.phone === user.phone;
  });

  // Update user

  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }

  // Save users

  localStorage.setItem("users", JSON.stringify(users));
}
