// ============================================
// FAST MTN DATA
// BUY AIRTIME - USER SIDE
// ============================================

// ============================================
// WAIT FOR HTML TO LOAD
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  let user = JSON.parse(localStorage.getItem("loggedInUser"));

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  if (!user) {
    window.location.href = "login.html";

    return;
  }

  // ==========================================
  // ELEMENTS
  // ==========================================

  const form = document.getElementById("airtimeForm");

  const networkInput = document.getElementById("network");

  const phoneInput = document.getElementById("phone");

  const amountInput = document.getElementById("amount");

  const walletBalance = document.getElementById("walletBalance");

  const buyButton = document.getElementById("buyAirtime");

  // ==========================================
  // CHECK FORM
  // ==========================================

  if (!form) {
    console.error("ERROR: #airtimeForm was not found.");

    return;
  }

  // ==========================================
  // DISPLAY WALLET BALANCE
  // ==========================================

  function displayWalletBalance() {
    user = JSON.parse(localStorage.getItem("loggedInUser"));

    const balance = Number(user?.balance || 0);

    if (walletBalance) {
      walletBalance.textContent = "₦" + balance.toLocaleString("en-NG");
    }
  }

  // ==========================================
  // SHOW INITIAL BALANCE
  // ==========================================

  displayWalletBalance();

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // ========================================
    // GET USER AGAIN
    // ========================================

    user = JSON.parse(localStorage.getItem("loggedInUser"));

    // ========================================
    // CHECK LOGIN
    // ========================================

    if (!user) {
      showAlert("Please login first.", "warning");

      window.location.href = "login.html";

      return;
    }

    // ========================================
    // GET VALUES
    // ========================================

    const network = networkInput ? networkInput.value.trim() : "";

    const phone = phoneInput ? phoneInput.value.trim() : "";

    const amount = amountInput ? Number(amountInput.value) : 0;

    // ========================================
    // VALIDATE NETWORK
    // ========================================

    if (!network) {
      showAlert("Please select a network.", "info");

      networkInput?.focus();

      return;
    }

    // ========================================
    // MTN ONLY
    // ========================================

    if (network.toUpperCase() !== "MTN") {
      showAlert("Only MTN airtime is currently supported.", "info");

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

    // ========================================
    // VALIDATE PHONE
    // ========================================

    if (!phone) {
      showAlert("Please enter the phone number.", "error");

      phoneInput?.focus();

      return;
    }

    // ========================================
    // VALIDATE PHONE FORMAT
    // ========================================

    if (!/^0\d{10}$/.test(phone)) {
      showAlert("Enter a valid 11-digit Nigerian phone number.", "error");

      phoneInput?.focus();

      return;
    }

    // ========================================
    // VALIDATE AMOUNT
    // ========================================

    if (!amount || amount <= 0) {
      showAlert("Please enter a valid airtime amount.", "error");

      amountInput?.focus();

      return;
    }

    // ========================================
    // MINIMUM AIRTIME
    // ========================================

    if (amount < 50) {
      showAlert("Minimum airtime purchase is ₦50.", "info");

      amountInput?.focus();

      return;
    }

    // ========================================
    // USER TRANSACTIONS
    // ========================================

    if (!Array.isArray(user.transactions)) {
      user.transactions = [];
    }

    // ========================================
    // GET BALANCE
    // ========================================

    const balance = Number(user.balance || 0);

    // ========================================
    // CHECK BALANCE
    // ========================================

    if (balance < amount) {
      showAlert("Insufficient Wallet Balance.", "warning");

      return;
    }

    // ========================================
    // PREVENT DOUBLE CLICK
    // ========================================

    if (buyButton && buyButton.disabled) {
      return;
    }

    // ========================================
    // CREATE TRANSACTION ID
    // ========================================

    const transactionId =
      "AIR_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

    // ========================================
    // CREATE REFERENCE
    // ========================================

    const reference = "AIR-" + Date.now();

    // ========================================
    // CREATE TRANSACTION
    // ========================================

    const transaction = {
      // --------------------------------------
      // BASIC
      // --------------------------------------

      id: transactionId,

      title: "Airtime Purchase",

      type: "airtime",

      transactionType: "debit",

      // --------------------------------------
      // USER
      // --------------------------------------

      userPhone: user.phone || "",

      userName: user.name || "",

      // --------------------------------------
      // AIRTIME
      // --------------------------------------

      network: network.toUpperCase(),

      phone: phone,

      // --------------------------------------
      // MONEY
      // --------------------------------------

      amount: amount,

      // --------------------------------------
      // STATUS
      // --------------------------------------

      status: "Pending",

      // --------------------------------------
      // REFERENCE
      // --------------------------------------

      reference: reference,

      // --------------------------------------
      // DATE
      // --------------------------------------

      date: new Date().toLocaleString("en-NG"),

      createdAt: Date.now(),

      // --------------------------------------
      // MESSAGE
      // --------------------------------------

      message: "Airtime purchase is awaiting approval.",
    };

    // ========================================
    // DEDUCT BALANCE
    // ========================================

    user.balance = balance - amount;

    // ========================================
    // ADD TRANSACTION
    // ========================================

    user.transactions.push(transaction);

    // ========================================
    // UPDATE USER
    // ========================================

    updateUser(user);

    // ========================================
    // SAVE LAST AIRTIME PURCHASE
    // ========================================

    localStorage.setItem("lastAirtimePurchase", JSON.stringify(transaction));

    // ========================================
    // GET ADMIN REQUESTS
    // ========================================

    let airtimePurchaseRequests =
      JSON.parse(localStorage.getItem("airtimePurchaseRequests")) || [];

    // ========================================
    // ADD REQUEST
    // ========================================

    airtimePurchaseRequests.push(transaction);

    // ========================================
    // SAVE ADMIN REQUESTS
    // ========================================

    localStorage.setItem(
      "airtimePurchaseRequests",
      JSON.stringify(airtimePurchaseRequests),
    );

    // ========================================
    // SAVE SELECTED TRANSACTION
    // ========================================

    localStorage.setItem("selectedTransaction", JSON.stringify(transaction));

    // ========================================
    // UPDATE BALANCE ON SCREEN
    // ========================================

    displayWalletBalance();

    // ========================================
    // SHOW LOADING
    // ========================================

    startAirtimeLoading(buyButton, "Processing...");

    // ========================================
    // REDIRECT
    // ========================================

    setTimeout(function () {
      window.location.href = "airtime-success.html";
    }, 500);
  });

  // ==========================================
  // UPDATE USER
  // ==========================================

  function updateUser(updatedUser) {
    if (!updatedUser) {
      return;
    }

    // ----------------------------------------
    // LOGGED-IN USER
    // ----------------------------------------

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    // ----------------------------------------
    // USERS ARRAY
    // ----------------------------------------

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // ----------------------------------------
    // FIND USER
    // ----------------------------------------

    const index = users.findIndex(function (item) {
      return String(item.phone || "") === String(updatedUser.phone || "");
    });

    // ----------------------------------------
    // UPDATE USER
    // ----------------------------------------

    if (index !== -1) {
      users[index] = updatedUser;
    } else {
      // --------------------------------------
      // USER DOESN'T EXIST
      // ADD HIM
      // --------------------------------------

      users.push(updatedUser);
    }

    // ----------------------------------------
    // SAVE USERS
    // ----------------------------------------

    localStorage.setItem("users", JSON.stringify(users));
  }

  // ==========================================
  // AIRTIME LOADING
  // ==========================================

  function startAirtimeLoading(button, text = "Processing...") {
    if (!button) {
      return;
    }

    // ----------------------------------------
    // PREVENT DOUBLE CLICK
    // ----------------------------------------

    if (button.disabled) {
      return;
    }

    // ----------------------------------------
    // SAVE ORIGINAL BUTTON
    // ----------------------------------------

    button.dataset.originalContent = button.innerHTML;

    // ----------------------------------------
    // DISABLE
    // ----------------------------------------

    button.disabled = true;

    // ----------------------------------------
    // LOADING CLASS
    // ----------------------------------------

    button.classList.add("loading");

    // ----------------------------------------
    // SPINNER
    // ----------------------------------------

    button.innerHTML = `

      <span class="button-spinner"></span>

      <span>
        ${text}
      </span>

    `;
  }
});
