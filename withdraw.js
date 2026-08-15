// ============================================
// FAST MTN DATA - WITHDRAWAL
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

const withdrawBtn = document.getElementById("withdrawBtn");

const amountInput = document.getElementById("amount");

const bankInput = document.getElementById("bank");

const accountInput = document.getElementById("account");

const accountNameInput = document.getElementById("accountName");

// ============================================
// WITHDRAW BUTTON
// ============================================

if (withdrawBtn) {
  withdrawBtn.onclick = function () {
    // ========================================
    // GET VALUES
    // ========================================

    const amount = Number(amountInput.value);

    const bank = bankInput.value.trim();

    const account = accountInput.value.trim();

    const accountName = accountNameInput.value.trim();

    // ========================================
    // VALIDATE AMOUNT
    // ========================================

    if (!amount || amount <= 0) {
      showAlert("Enter a valid withdrawal amount.", "warning");

      amountInput.focus();

      return;
    }

    // ========================================
    // VALIDATE BANK
    // ========================================

    if (!bank) {
      showAlert("Please enter your bank name.", "error");

      bankInput.focus();

      return;
    }

    // ========================================
    // VALIDATE ACCOUNT NUMBER
    // ========================================

    if (!/^\d{10}$/.test(account)) {
      showAlert("Enter a valid 10-digit account number.", "error");

      accountInput.focus();

      return;
    }

    // ========================================
    // VALIDATE ACCOUNT NAME
    // ========================================

    if (!accountName) {
      showAlert("Please enter the account name.", "error");

      accountNameInput.focus();

      return;
    }

    // ========================================
    // CHECK BALANCE
    // ========================================

    if (amount > Number(user.balance || 0)) {
      showAlert("Insufficient wallet balance.", "warning");

      return;
    }

    // ========================================
    // START BUTTON LOADER
    // ========================================
    // IMPORTANT:
    // This comes AFTER validation.
    // Therefore the loader will not appear
    // when the form is invalid.

    if (typeof startButtonLoading === "function") {
      startButtonLoading(withdrawBtn, "Submitting...");
    } else {
      // Fallback if startButtonLoading
      // is not available.

      withdrawBtn.disabled = true;

      withdrawBtn.innerHTML = `
        <span class="button-loader"></span>
        Submitting...
      `;
    }

    // ========================================
    // CREATE TRANSACTION
    // ========================================

    const transaction = {
      id: Date.now(),

      title: "Withdrawal",

      type: "withdraw",

      userPhone: user.phone,

      userName: user.name,

      amount: amount,

      transactionType: "debit",

      bank: bank,

      account: account,

      accountName: accountName,

      status: "Pending",

      date: new Date().toLocaleString(),
    };

    // ========================================
    // USER TRANSACTIONS
    // ========================================

    if (!user.transactions) {
      user.transactions = [];
    }

    user.transactions.push(transaction);

    // ========================================
    // WITHDRAW REQUESTS
    // ========================================

    let withdrawRequests =
      JSON.parse(localStorage.getItem("withdrawRequests")) || [];

    withdrawRequests.push(transaction);

    localStorage.setItem("withdrawRequests", JSON.stringify(withdrawRequests));

    // ========================================
    // SAVE INSIDE USER
    // ========================================

    if (!user.withdrawRequests) {
      user.withdrawRequests = [];
    }

    user.withdrawRequests.push(transaction);

    //========================================
    // UPDATE USER
    // ========================================

    if (typeof updateUser === "function") {
      updateUser(user);
    } else {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    // ========================================
    // SAVE LAST WITHDRAWAL
    // ========================================

    localStorage.setItem("lastWithdraw", JSON.stringify(transaction));

    // ========================================
    // SAVE SELECTED TRANSACTION
    // ========================================

    localStorage.setItem("selectedTransaction", JSON.stringify(transaction));

    // ========================================
    // GO TO TRANSACTION DETAILS
    // ========================================

    setTimeout(function () {
      window.location.href = "transaction-details.html";
    }, 300);
  };
}
