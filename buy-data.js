// ============================================
// FAST MTN DATA - BUY DATA
// USER SIDE
// ============================================

// ============================================
// GET SELECTED PLAN
// ============================================

const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));

// ============================================
// CHECK SELECTED PLAN
// ============================================

if (!selectedPlan) {
  window.location.href = "bundles.html";
}

// ============================================
// ELEMENTS
// ============================================

const bundleInput = document.getElementById("bundle");

const priceInput = document.getElementById("price");

const validityInput = document.getElementById("validity");

const phoneInput = document.getElementById("phone");

const form = document.getElementById("buyForm");

// ============================================
// DISPLAY SELECTED PLAN
// ============================================

if (selectedPlan) {
  if (bundleInput) {
    bundleInput.value = selectedPlan.size || "";
  }

  if (priceInput) {
    priceInput.value =
      "₦" + Number(selectedPlan.price || 0).toLocaleString("en-NG");
  }

  if (validityInput) {
    validityInput.value = selectedPlan.validity || "";
  }
}

// ============================================
// FORM CHECK
// ============================================

if (!form) {
  console.error("Buy Data form not found.");
} else {
  // ==========================================
  // BUY DATA
  // ==========================================

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // ========================================
    // GET LOGGED-IN USER
    // ========================================

    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    // ========================================
    // CHECK LOGIN
    // ========================================

    if (!user) {
      showAlert("Please login first.", "warning");

      window.location.href = "login.html";

      return;
    }

    // ========================================
    // GET PHONE
    // ========================================

    const phone = phoneInput ? phoneInput.value.trim() : "";

    // ========================================
    // VALIDATE PHONE
    // ========================================

    if (!phone) {
      showAlert("Please enter your MTN phone number.", "warning");

      if (phoneInput) {
        phoneInput.focus();
      }

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
    // VALIDATE PHONE FORMAT
    // ========================================

    if (!/^0\d{10}$/.test(phone)) {
      showAlert("Enter a valid 11-digit phone number.", "error");

      if (phoneInput) {
        phoneInput.focus();
      }

      return;
    }

    // ========================================
    // GET PRICE
    // ========================================

    const price = Number(selectedPlan.price || 0);

    // ========================================
    // VALIDATE PRICE
    // ========================================

    if (price <= 0) {
      showAlert("Invalid data bundle price.", "error");

      return;
    }

    // ========================================
    // CHECK TRANSACTIONS
    // ========================================

    if (!Array.isArray(user.transactions)) {
      user.transactions = [];
    }

    // ========================================
    // CHECK BALANCE
    // ========================================

    const balance = Number(user.balance || 0);

    if (balance < price) {
      showAlert("Insufficient Wallet Balance.", "warning");

      return;
    }

    // ========================================
    // GET BUY BUTTON
    // ========================================

    const buyButton = form.querySelector('button[type="submit"]');

    // ========================================
    // PREVENT DOUBLE CLICK
    // ========================================

    if (buyButton && buyButton.disabled) {
      return;
    }

    // ========================================
    // CREATE UNIQUE ID
    // ========================================

    const transactionId =
      "DATA_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

    // ========================================
    // CREATE REFERENCE
    // ========================================

    const reference = "DATA-" + Date.now();

    // ========================================
    // CREATE TRANSACTION
    // ========================================

    const transaction = {
      // --------------------------------------
      // ID
      // --------------------------------------

      id: transactionId,

      // --------------------------------------
      // TITLE
      // --------------------------------------

      title: "Data Purchase",

      // --------------------------------------
      // TYPE
      // --------------------------------------

      type: "data",

      // --------------------------------------
      // TRANSACTION TYPE
      // --------------------------------------

      transactionType: "debit",

      // --------------------------------------
      // USER
      // --------------------------------------

      userPhone: user.phone || "",

      userName: user.name || user.fullName || "",

      // --------------------------------------
      // NETWORK
      // --------------------------------------

      network: "MTN",

      // --------------------------------------
      // RECEIVING PHONE
      // --------------------------------------

      phone: phone,

      // --------------------------------------
      // BUNDLE
      // --------------------------------------

      bundle: selectedPlan.size || "",

      // --------------------------------------
      // VALIDITY
      // --------------------------------------

      validity: selectedPlan.validity || "",

      // --------------------------------------
      // AMOUNT
      // --------------------------------------

      amount: price,

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

      // --------------------------------------
      // TIMESTAMP
      // --------------------------------------

      createdAt: Date.now(),

      // --------------------------------------
      // MESSAGE
      // --------------------------------------

      message: "Data purchase is awaiting approval.",
    };

    // ========================================
    // DEDUCT WALLET BALANCE
    // ========================================

    user.balance = balance - price;

    // ========================================
    // ADD TRANSACTION TO USER
    // ========================================

    user.transactions.push(transaction);

    // ========================================
    // UPDATE USER
    // ========================================

    updateUser(user);

    // ========================================
    // SAVE LAST DATA PURCHASE
    // ========================================

    localStorage.setItem("lastDataPurchase", JSON.stringify(transaction));

    // ========================================
    // GET ADMIN DATA REQUESTS
    // ========================================

    let dataPurchaseRequests =
      JSON.parse(localStorage.getItem("dataPurchaseRequests")) || [];

    // ========================================
    // IMPORTANT
    // ADD REQUEST FOR ADMIN
    // ========================================

    dataPurchaseRequests.push(transaction);

    // ========================================
    // SAVE ADMIN REQUESTS
    // ========================================

    localStorage.setItem(
      "dataPurchaseRequests",
      JSON.stringify(dataPurchaseRequests),
    );

    // ========================================
    // SAVE SELECTED TRANSACTION
    // ========================================

    localStorage.setItem("selectedTransaction", JSON.stringify(transaction));

    // ========================================
    // SAVE SELECTED PLAN
    // ========================================

    localStorage.setItem("lastSelectedPlan", JSON.stringify(selectedPlan));

    // ========================================
    // SHOW LOADING
    // ========================================

    startBuyDataLoading(buyButton, "Processing...");

    // ========================================
    // GO TO TRANSACTION DETAILS
    // ========================================

    setTimeout(function () {
      window.location.href = "success.html";
    }, 500);
  });
}

// ============================================
// UPDATE USER
// ============================================

function updateUser(user) {
  if (!user) {
    return;
  }

  // ==========================================
  // SAVE LOGGED-IN USER
  // ==========================================

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  // ==========================================
  // GET ALL USERS
  // ==========================================

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // ==========================================
  // FIND USER
  // ==========================================

  const index = users.findIndex(function (item) {
    return String(item.phone || "") === String(user.phone || "");
  });

  // ==========================================
  // UPDATE EXISTING USER
  // ==========================================

  if (index !== -1) {
    users[index] = user;
  }

  // ==========================================
  // SAVE USERS
  // ==========================================

  localStorage.setItem("users", JSON.stringify(users));
}

// ============================================
// BUY DATA BUTTON LOADER
// ============================================

function startBuyDataLoading(button, text = "Processing...") {
  if (!button) {
    return;
  }

  // ==========================================
  // PREVENT DOUBLE CLICK
  // ==========================================

  if (button.disabled) {
    return;
  }

  // ==========================================
  // SAVE ORIGINAL BUTTON
  // ==========================================

  button.dataset.originalContent = button.innerHTML;

  // ==========================================
  // DISABLE BUTTON
  // ==========================================

  button.disabled = true;

  // ==========================================
  // ADD LOADING CLASS
  // ==========================================

  button.classList.add("loading");

  // ==========================================
  // SHOW SPINNER
  // ==========================================

  button.innerHTML = `

    <span class="button-spinner"></span>

    <span>
      ${text}
    </span>

  `;
}
