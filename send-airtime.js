// ============================================
// FAST MTN DATA - SEND AIRTIME
// AIRTIME TO CASH
// ============================================

// ============================================
// GET SAVED INFORMATION
// ============================================

const info = JSON.parse(localStorage.getItem("airtimeCashDetails"));

// ============================================
// GET USER
// ============================================

const user = JSON.parse(localStorage.getItem("loggedInUser"));

// ============================================
// CHECK LOGIN
// ============================================

if (!user) {
  window.location.href = "login.html";
}

// ============================================
// CHECK AIRTIME-TO-CASH INFORMATION
// ============================================

if (!info || !info.network || !info.amount) {
  alert("Airtime transaction information not found.");

  window.location.href = "airtime-cash.html";
}

// ============================================
// VALUES
// ============================================

const sender = info.sender || "-";

const recipient = info.recipient || info.receivingNumber || "09167967974";

const network = info.network || "MTN";

const amount = Number(info.amount || 0);

const fee = Number(info.fee || 0);

const receiveAmount = Number(info.receiveAmount || 0);

const reference = info.reference || info.id || String(Date.now());

const expiresAt = Number(info.expiresAt || 0);

// ============================================
// ELEMENTS
// ============================================

const senderElement = document.getElementById("sender");

const receivingNumberElement = document.getElementById("recipient");

const networkElement = document.getElementById("network");

const amountElement = document.getElementById("amount");

const receiveAmountElement = document.getElementById("receiveAmount");

const referenceElement = document.getElementById("reference");

const expiryElement = document.getElementById("expiry");

const submitButton = document.getElementById("submitRequest");

// ============================================
// DISPLAY INFORMATION
// ============================================

if (senderElement) {
  senderElement.textContent = sender;
}

if (receivingNumberElement) {
  receivingNumberElement.textContent = recipient;
}

if (networkElement) {
  networkElement.textContent = network;
}

if (amountElement) {
  amountElement.textContent = "₦" + amount.toLocaleString();
}

if (receiveAmountElement) {
  receiveAmountElement.textContent = "₦" + receiveAmount.toLocaleString();
}

if (referenceElement) {
  referenceElement.textContent = reference;
}

// ============================================
// EXPIRY TIMER
// ============================================

let expired = false;

function updateExpiry() {
  if (!expiryElement) {
    return;
  }

  // If no expiry was saved
  if (!expiresAt) {
    expiryElement.textContent = "No expiry";

    return;
  }

  const remaining = expiresAt - Date.now();

  // ========================================
  // EXPIRED
  // ========================================

  if (remaining <= 0) {
    expired = true;

    expiryElement.textContent = "Expired";

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.textContent = "EXPIRED";
    }

    return;
  }

  // ========================================
  // REMAINING TIME
  // ========================================

  const minutes = Math.floor(remaining / (1000 * 60));

  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  expiryElement.textContent = `${minutes}m ${seconds}s`;
}

// Start timer
updateExpiry();

const expiryTimer = setInterval(updateExpiry, 1000);

// ============================================
// SUBMIT REQUEST
// ============================================

if (submitButton) {
  submitButton.onclick = function () {
    // ======================================
    // CHECK EXPIRY
    // ======================================

    if (expired) {
      alert("This airtime transfer has expired.");

      return;
    }

    // ======================================
    // PREVENT DOUBLE CLICK
    // ======================================

    if (submitButton.disabled) {
      return;
    }

    // ======================================
    // STOP TIMER
    // ======================================

    clearInterval(expiryTimer);

    // ======================================
    // SHOW BUTTON LOADER
    // ======================================
    // This happens ONLY when the request
    // is valid and ready to submit.

    if (typeof startButtonLoading === "function") {
      startButtonLoading(submitButton, "Submitting...");
    } else {
      submitButton.disabled = true;

      submitButton.innerHTML = `
          <span class="button-loader"></span>
          Submitting...
        `;
    }

    // ======================================
    // GET EXISTING REQUESTS
    // ======================================

    let requests =
      JSON.parse(localStorage.getItem("airtimeCashRequests")) || [];

    // ======================================
    // CREATE TRANSACTION
    // ======================================

    const transaction = {
      id: info.id || Date.now().toString(),

      type: "convert",

      title: "Airtime to Cash",

      transactionType: "credit",

      userPhone: user.phone || "",

      userName: user.name || "",

      network: network,

      amount: amount,

      fee: fee,

      receiveAmount: receiveAmount,

      sender: sender,

      recipient: recipient,

      receivingNumber: recipient,

      reference: reference,

      status: "Pending",

      date: new Date().toLocaleString(),

      createdAt: Date.now(),

      expiresAt: expiresAt || null,
    };

    // ======================================
    // SAVE ADMIN REQUEST
    // ======================================

    requests.push(transaction);

    localStorage.setItem("airtimeCashRequests", JSON.stringify(requests));

    // ======================================
    // SAVE LAST AIRTIME-TO-CASH
    // ======================================

    localStorage.setItem("lastAirtimeCash", JSON.stringify(transaction));

    // ======================================
    // USER TRANSACTIONS
    // ======================================

    if (!user.transactions) {
      user.transactions = [];
    }

    user.transactions.push(transaction);

    // ======================================
    // SELECTED TRANSACTION
    // ======================================

    localStorage.setItem("selectedTransaction", JSON.stringify(transaction));

    // ======================================
    // UPDATE USER
    // ======================================

    if (typeof updateUser === "function") {
      updateUser(user);
    } else {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    // ======================================
    // GO TO TRANSACTION DETAILS
    // ======================================

    setTimeout(function () {
      window.location.href = "airtime-cash-success.html";
    }, 300);
  };
}
