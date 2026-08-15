// ============================================
// FUND WALLET
// ============================================

const user = JSON.parse(localStorage.getItem("loggedInUser"));

// ============================================
// CHECK LOGIN
// ============================================

if (!user) {
  window.location.href = "login.html";
}

// ============================================
// ELEMENTS
// ============================================

const submitFund = document.getElementById("submitFund");

const amountInput = document.getElementById("amount");

const methodSelect = document.getElementById("method");

const referenceInput = document.getElementById("reference");

// ============================================
// SUBMIT FUND REQUEST
// ============================================

if (submitFund) {
  submitFund.addEventListener("click", function () {
    // ========================================
    // GET VALUES
    // ========================================

    const amount = Number(amountInput.value);

    const method = methodSelect.value;

    const reference = referenceInput.value.trim();

    // ========================================
    // VALIDATE AMOUNT
    // ========================================

    if (!amount || amount <= 0) {
      showAlert("Please enter a valid amount.", "warning");

      amountInput.focus();

      return;
    }

    // ========================================
    // MINIMUM FUNDING
    // ========================================

    if (amount < 100) {
      showAlert("Minimum funding amount is ₦100.", "info");

      amountInput.focus();

      return;
    }

    // ========================================
    // VALIDATE PAYMENT METHOD
    // ========================================

    if (!method) {
      showAlert("Please select a payment method.", "error");

      methodSelect.focus();

      return;
    }

    // ========================================
    // VALIDATE REFERENCE
    // ========================================

    if (!reference) {
      showAlert("Please enter your payment reference.", "warning");

      referenceInput.focus();

      return;
    }

    // ========================================
    // EVERYTHING IS VALID
    // SHOW LOADER NOW
    // ========================================

    if (typeof startButtonLoading === "function") {
      startButtonLoading(submitFund, "Submitting...");
    } else if (typeof showLoader === "function") {
      showLoader("Submitting...");
    }

    // ========================================
    // CREATE TRANSACTION
    // ========================================

    const transaction = {
      id: Date.now(),

      type: "wallet",

      title: "Wallet Funding",

      transactionType: "credit",

      userPhone: user.phone,

      userName: user.name,

      amount: amount,

      method: method,

      reference: reference,

      status: "Pending",

      date: new Date().toLocaleString(),
    };

    // ========================================
    // SAVE FOR ADMIN
    // ========================================

    let fundRequests = JSON.parse(localStorage.getItem("fundRequests")) || [];

    fundRequests.push(transaction);

    localStorage.setItem("fundRequests", JSON.stringify(fundRequests));

    // ========================================
    // SAVE TO USER TRANSACTIONS
    // ========================================

    if (!user.transactions) {
      user.transactions = [];
    }

    user.transactions.push(transaction);

    if (typeof updateUser === "function") {
      updateUser(user);
    } else {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    // ========================================
    // SAVE LAST FUND REQUEST
    // ========================================

    localStorage.setItem("lastFundRequest", JSON.stringify(transaction));

    // ========================================
    // SAVE SELECTED TRANSACTION
    // ========================================

    localStorage.setItem("selectedTransaction", JSON.stringify(transaction));

    // ========================================
    // GO TO SUCCESS PAGE
    // ========================================

    setTimeout(function () {
      window.location.href = "fund-success.html";
    }, 300);
  });
}

// ============================================
// PAYMENT ACCOUNTS
// ============================================

const paymentAccounts = {
  bank: {
    provider: "Moniepoint MFB",

    accountName: "FAST MTN DATA",

    accountNumber: "1234567890",
  },

  opay: {
    provider: "OPay",

    accountName: "FAST MTN DATA",

    accountNumber: "08012345678",
  },

  palmpay: {
    provider: "PalmPay",

    accountName: "FAST MTN DATA",

    accountNumber: "09098765432",
  },
};

// ============================================
// UPDATE PAYMENT DETAILS
// ============================================

function updatePaymentDetails() {
  if (!methodSelect) {
    return;
  }

  const account = paymentAccounts[methodSelect.value];

  if (!account) {
    return;
  }

  const providerName = document.getElementById("providerName");

  const accountName = document.getElementById("accountName");

  const accountNumber = document.getElementById("accountNumber");

  if (providerName) {
    providerName.textContent = account.provider;
  }

  if (accountName) {
    accountName.textContent = account.accountName;
  }

  if (accountNumber) {
    accountNumber.textContent = account.accountNumber;
  }
}

// ============================================
// LOAD DEFAULT PAYMENT DETAILS
// ============================================

updatePaymentDetails();

// ============================================
// PAYMENT METHOD CHANGE
// ============================================

if (methodSelect) {
  methodSelect.addEventListener("change", updatePaymentDetails);
}

// ============================================
// COPY ACCOUNT NUMBER
// ============================================

const copyBtn = document.getElementById("copyBtn");

if (copyBtn) {
  copyBtn.addEventListener("click", async function () {
    const accountNumber = document.getElementById("accountNumber");

    if (!accountNumber) {
      return;
    }

    const number = accountNumber.textContent.trim();

    if (!number) {
      return;
    }

    try {
      await navigator.clipboard.writeText(number);

      showAlert("Account number copied successfully.", "success");
    } catch (error) {
      showAlert("Unable to copy account number.", "error");
    }
  });
}
