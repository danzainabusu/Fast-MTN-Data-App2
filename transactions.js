const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

if (!user.transactions) {
  user.transactions = [];
}

const list = document.getElementById("transactionList");

// ======================================
// DISPLAY TRANSACTIONS
// ======================================

function displayTransactions(data) {
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <h3>No Transactions Found</h3>
      </div>
    `;

    return;
  }

  data
    .slice()
    .reverse()
    .forEach((tx, index) => {
      // ======================================
      // GIVE OLD TRANSACTIONS AN ID
      // ======================================

      if (!tx.id) {
        tx.id = Date.now() + index;
      }

      // ======================================
      // DEFAULT VALUES
      // ======================================

      let icon = "fa-receipt";

      let title = "Transaction";

      let subtitle = "";

      // ======================================
      // DATA PURCHASE
      // ======================================

      if (tx.type === "data") {
        icon = "fa-wifi";

        title = "Data Purchase";

        subtitle = tx.bundle || "Data Bundle";
      }

      // ======================================
      // AIRTIME PURCHASE
      // ======================================
      else if (tx.type === "airtime") {
        icon = "fa-phone";

        title = "Airtime Purchase";

        subtitle = tx.network || "MTN";
      }

      // ======================================
      // WALLET FUNDING
      // ======================================
      else if (tx.type === "wallet") {
        icon = "fa-wallet";

        title = "Wallet Funding";

        subtitle = tx.method || "Bank Transfer";
      }

      // ======================================
      // AIRTIME TO CASH
      // ======================================
      else if (tx.type === "convert") {
        icon = "fa-money-bill-transfer";
        title = "Airtime to Cash";
        subtitle = tx.network || "MTN";
      }

      // ======================================
      // WITHDRAWAL
      // ======================================
      else if (tx.type === "withdraw") {
        icon = "fa-building-columns";

        title = "Withdrawal";

        subtitle = tx.bank || "Bank Transfer";
      }

      // ======================================
      // AMOUNT
      // ======================================

      const amount = Number(tx.amount ?? tx.price ?? 0);

      // ======================================
      // CREDIT / DEBIT
      // ======================================

      const isCredit = tx.transactionType === "credit";

      // ======================================
      // STATUS
      // ======================================

      let statusClass = "pending";

      if (tx.status === "Successful" || tx.status === "Approved") {
        statusClass = "success";
      } else if (tx.status === "Rejected" || tx.status === "Failed") {
        statusClass = "failed";
      }

      // ======================================
      // CREATE TRANSACTION CARD
      // ======================================

      const card = document.createElement("div");

      card.className = "transaction";

      card.innerHTML = `

        <div class="left">

          <div class="icon">

            <i class="fa-solid ${icon}"></i>

          </div>


          <div class="info">

            <h3>${title}</h3>

            <p>${subtitle}</p>

            <p>${tx.date || ""}</p>

          </div>

        </div>



        <div class="right">

          <div class="${isCredit ? "credit" : "debit"}">

            ${isCredit ? "+" : "-"}

            ₦${amount.toLocaleString()}

          </div>


          <div class="${statusClass}">

            ${tx.status || "Pending"}

          </div>

        </div>

      `;

      // ======================================
      // CLICK TRANSACTION
      // ======================================

      card.addEventListener("click", function () {
        localStorage.setItem("selectedTransaction", JSON.stringify(tx));

        window.location.href = "transaction-details.html";
      });

      list.appendChild(card);
    });

  // Save IDs for old transactions

  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// ======================================
// LOAD TRANSACTIONS
// ======================================

displayTransactions(user.transactions);

// ======================================
// FILTER TABS
// ======================================

const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    // Remove active

    tabs.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active

    this.classList.add("active");

    const filter = this.dataset.filter;

    // ALL

    if (filter === "all") {
      displayTransactions(user.transactions);

      return;
    }

    // FILTER

    const filtered = user.transactions.filter((tx) => tx.type === filter);

    displayTransactions(filtered);
  });
});
