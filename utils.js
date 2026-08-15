// ============================================
// FAST MTN DATA - GLOBAL UTILITIES
// ============================================

// ============================================
// BUTTON LOADER
// ============================================

function startButtonLoading(button, text = "Processing...") {
  if (!button) return;

  // Prevent double click
  if (button.classList.contains("loading")) {
    return;
  }

  // Save original content
  button.dataset.originalText = button.innerHTML;

  // Disable button
  button.disabled = true;

  // Add loading class
  button.classList.add("loading");

  // Show spinner + text
  button.innerHTML = `
    <span class="button-loading-content">
      <span class="button-loader"></span>
      <span>${text}</span>
    </span>
  `;
}

// ============================================
// HIDE BUTTON LOADER
// ============================================

function hideButtonLoading(button) {
  if (!button) return;

  button.classList.remove("loading");

  button.disabled = false;

  if (button.dataset.originalText) {
    button.innerHTML = button.dataset.originalText;

    delete button.dataset.originalText;
  }
}

// ============================================
// OLD FUNCTION NAMES
// ============================================

function showButtonLoader(button, text = "Processing...") {
  startButtonLoading(button, text);
}

function hideButtonLoader(button) {
  hideButtonLoading(button);
}

// =========================================
// FAST MTN CUSTOM ALERT
// =========================================

function showAlert(message, type = "success", duration = 2500) {
  const alertBox = document.getElementById("alertBox");

  if (!alertBox) {
    console.warn("alertBox not found.");
    return;
  }

  // =======================================
  // ICONS
  // =======================================

  const icons = {
    success: "✓",
    error: "!",
    warning: "⚠",
    info: "i",
  };

  // =======================================
  // GET ICON
  // =======================================

  const icon = icons[type] || icons.info;

  // =======================================
  // CREATE ALERT
  // =======================================

  alertBox.innerHTML = `

    <div class="custom-alert ${type}">

      <div class="alert-icon">
        ${icon}
      </div>

      <div class="alert-message">
        ${message}
      </div>

    </div>

  `;

  // =======================================
  // SHOW
  // =======================================

  alertBox.classList.add("show");

  // =======================================
  // AUTO HIDE
  // =======================================

  clearTimeout(alertBox.alertTimer);

  alertBox.alertTimer = setTimeout(() => {
    alertBox.classList.remove("show");
  }, duration);
}

// ============================================
// UPDATE USER
// ============================================

function updateUser(user) {
  if (!user) return;

  // Save logged-in user
  localStorage.setItem("loggedInUser", JSON.stringify(user));

  // Get users
  let users = [];

  try {
    users = JSON.parse(localStorage.getItem("users")) || [];
  } catch (error) {
    users = [];
  }

  // Find current user
  const index = users.findIndex(function (item) {
    return item.phone === user.phone;
  });

  // Update
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }

  // Save
  localStorage.setItem("users", JSON.stringify(users));
}
// ============================================
// ADD NOTIFICATION
// ============================================

function addNotification(
  user,
  type,
  title,
  message,
  icon = "fa-solid fa-bell",
) {
  // ==========================================
  // CHECK USER
  // ==========================================

  if (!user) return;

  // ==========================================
  // CREATE NOTIFICATION SETTINGS
  // ==========================================

  if (!user.notifications) {
    user.notifications = {
      data: true,
      wallet: true,
      airtime: true,
      convert: true,
      withdraw: true,
    };
  }

  // ==========================================
  // ADD WITHDRAW SETTING FOR OLD USERS
  // ==========================================

  if (typeof user.notifications.withdraw === "undefined") {
    user.notifications.withdraw = true;
  }

  // ==========================================
  // CHECK IF THIS NOTIFICATION TYPE
  // IS ENABLED
  // ==========================================

  if (Object.prototype.hasOwnProperty.call(user.notifications, type)) {
    // User turned this notification OFF

    if (user.notifications[type] === false) {
      // Save the user anyway
      updateUser(user);

      return;
    }
  }

  // ==========================================
  // CREATE NOTIFICATIONS LIST
  // ==========================================

  if (!Array.isArray(user.notificationsList)) {
    user.notificationsList = [];
  }

  // ==========================================
  // CREATE NOTIFICATION
  // ==========================================

  const notification = {
    id: Date.now(),

    type: type,

    title: title,

    message: message,

    icon: icon,

    read: false,

    date: new Date().toLocaleString(),
  };

  // ==========================================
  // ADD NOTIFICATION
  // ==========================================

  user.notificationsList.push(notification);

  // ==========================================
  // SAVE USER
  // ==========================================

  updateUser(user);
}
// ============================================
// HIDE LOADER WHEN PAGE LOADS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("pageLoader");

  if (loader) {
    loader.classList.add("hide");
  }
});

// ============================================
// PAGE TRANSITION
// LINKS ONLY
// ============================================

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  // Ignore buttons completely
  if (!link) return;

  const href = link.getAttribute("href");

  // Ignore links that aren't page navigation
  if (
    !href ||
    href === "#" ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:") ||
    link.target === "_blank"
  ) {
    return;
  }

  const loader = document.getElementById("pageLoader");

  if (!loader) return;

  // Stop normal navigation
  event.preventDefault();

  // Show loader
  loader.classList.remove("hide");

  // Leave current page
  setTimeout(() => {
    window.location.href = href;
  }, 300);
});
