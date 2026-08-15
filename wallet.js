let user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  location.href = "login.html";
}

if (!user.transactions) {
  user.transactions = [];
}

document.getElementById("walletBalance").textContent =
  "₦" + Number(user.balance || 0).toLocaleString();

const history = document.getElementById("walletHistory");

// =====================================
// LOAD WALLET HISTORY
// =====================================

function loadHistory() {
  history.innerHTML = "";

  if (user.transactions.length === 0) {
    history.innerHTML = `
      <p style="text-align:center;color:#777;">
        No transactions yet.
      </p>
    `;
    return;
  }

  user.transactions
    .slice()
    .reverse()
    .forEach((item) => {
      // =================================
      // DEFAULT VALUES
      // =================================

      let title = "Transaction";
      let subtitle = "";
      let icon = "fa-receipt";
      let amount = Number(item.amount || item.price || 0);

      // =================================
      // TRANSACTION TYPE
      // =================================

      if (item.type === "data") {
        icon = "fa-wifi";
        title = "Data Purchase";
        subtitle = item.bundle || "Data Bundle";
      } else if (item.type === "airtime") {
        icon = "fa-phone";
        title = "Airtime Purchase";
        subtitle = item.network || "MTN";
      } else if (item.type === "wallet" || item.type === "fund") {
        icon = "fa-wallet";
        title = "Wallet Funding";
        subtitle = item.method || "Wallet";
      } else if (item.type === "airtime-cash" || item.type === "convert") {
        icon = "fa-money-bill-transfer";
        title = "Airtime to Cash";
        subtitle = item.network || "MTN";
      } else if (item.type === "withdraw") {
        icon = "fa-building-columns";
        title = "Withdrawal";
        subtitle = item.bank || "Bank Transfer";
      }

      // =================================
      // CREDIT / DEBIT
      // =================================

      let transactionClass = "debit";
      let sign = "-";

      if (
        item.transactionType === "credit" ||
        item.type === "wallet" ||
        item.type === "fund"
      ) {
        transactionClass = "credit";
        sign = "+";
      } else if (item.type === "airtime-cash" || item.type === "convert") {
        transactionClass = "credit";
        sign = "+";
      } else {
        transactionClass = "debit";
        sign = "-";
      }

      // =================================
      // STATUS
      // =================================

      let statusClass = "pending";

      if (item.status === "Successful" || item.status === "Approved") {
        statusClass = "success";
      } else if (item.status === "Rejected" || item.status === "Failed") {
        statusClass = "failed";
      } else {
        statusClass = "pending";
      }

      // =================================
      // CREATE CARD
      // =================================

      const card = document.createElement("div");

      card.className = "history-card";

      card.innerHTML = `

        <div class="left">

          <div class="icon">
            <i class="fa-solid ${icon}"></i>
          </div>

          <div class="info">

            <strong>${title}</strong>

            <p>${subtitle}</p>

            <p>${item.date || ""}</p>

            <small class="${statusClass}">
              ${item.status || "Pending"}
            </small>

          </div>

        </div>

        <div class="right">

          <div class="${transactionClass}">
            ${sign} ₦${amount.toLocaleString()}
          </div>

        </div>

      `;

      // =================================
      // MAKE CARD CLICKABLE
      // =================================

      card.addEventListener("click", function () {
        localStorage.setItem("selectedTransaction", JSON.stringify(item));

        window.location.href = "transaction-details.html";
      });

      history.appendChild(card);
    });
}

// LOAD HISTORY
loadHistory();

// =====================================
// FUND WALLET
// =====================================

const fundBtn = document.getElementById("fundBtn");

if (fundBtn) {
  fundBtn.onclick = function () {
    const amount = Number(prompt("Enter amount to fund"));

    if (!amount || amount <= 0) {
      return;
    }

    // Add money
    user.balance = Number(user.balance || 0) + amount;

    // Create transaction
    const transaction = {
      id: Date.now(),

      type: "wallet",

      title: "Wallet Funding",

      transactionType: "credit",

      amount: amount,

      status: "Successful",

      date: new Date().toLocaleString(),
    };

    // Save transaction
    user.transactions.push(transaction);

    // Save user
    if (typeof updateUser === "function") {
      updateUser(user);
    } else {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    // Update balance
    document.getElementById("walletBalance").textContent =
      "₦" + Number(user.balance).toLocaleString();

    // Reload history
    loadHistory();

    alert("Wallet funded successfully!");
  };
}
