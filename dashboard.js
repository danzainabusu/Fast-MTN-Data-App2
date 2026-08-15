// ============================================
// FAST MTN DATA - DASHBOARD.JS
// ============================================

(function () {
  "use strict";

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("loggedInUser"));
  } catch (error) {
    console.error("Unable to read logged-in user:", error);
  }

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // ==========================================
  // MAKE SURE USER DATA EXISTS
  // ==========================================

  if (!Array.isArray(user.transactions)) {
    user.transactions = [];
  }

  if (!Array.isArray(user.notificationsList)) {
    user.notificationsList = [];
  }

  // ==========================================
  // ELEMENTS
  // ==========================================

  const welcomeName = document.getElementById("welcomeName");
  const welcomePhone = document.getElementById("welcomePhone");
  const walletBalance = document.getElementById("walletBalance");

  const badge = document.getElementById("notificationCount");

  const popularPlans = document.getElementById("popularPlans");

  const transactionList = document.getElementById("transactionList");

  // ==========================================
  // USER INFORMATION
  // ==========================================

  if (welcomeName) {
    welcomeName.textContent = "Hello, " + (user.name || "User");
  }

  if (welcomePhone) {
    welcomePhone.textContent = user.phone || "";
  }

  if (walletBalance) {
    walletBalance.textContent =
      "₦" + Number(user.balance || 0).toLocaleString();
  }

  // ==========================================
  // NOTIFICATION BADGE
  // ==========================================

  function updateNotificationBadge() {
    if (!badge) return;

    const unread = user.notificationsList.filter(
      (notification) => notification.read !== true,
    ).length;

    if (unread > 0) {
      badge.textContent = unread;
      badge.classList.remove("hide");
    } else {
      badge.textContent = "0";
      badge.classList.add("hide");
    }
  }

  updateNotificationBadge();

  // ==========================================
  // POPULAR DATA BUNDLES
  // ==========================================

  function showPopularPlans() {
    if (!popularPlans) return;

    const popular = [
      {
        size: "1GB",
        price: 330,
        validity: "Valid 1 Day",
      },

      {
        size: "2GB",
        price: 660,
        validity: "Valid 3 Days",
      },

      {
        size: "5GB",
        price: 1650,
        validity: "Valid 7 Days",
      },
    ];

    popularPlans.innerHTML = "";

    popular.forEach(function (plan) {
      const card = document.createElement("div");

      card.className = "plan";

      card.innerHTML = `
        <h3>${plan.size}</h3>

        <p>
          ₦${Number(plan.price).toLocaleString()}
        </p>

        <small>
          ${plan.validity}
        </small>
      `;

      card.addEventListener("click", function () {
        localStorage.setItem(
          "selectedPlan",
          JSON.stringify({
            size: plan.size,
            price: plan.price,
            validity: plan.validity,
          }),
        );

        window.location.href = "buy-data.html";
      });

      popularPlans.appendChild(card);
    });
  }

  showPopularPlans();

  // ==========================================
  // TRANSACTIONS
  // ==========================================

  function displayTransactions() {
    if (!transactionList) return;

    transactionList.innerHTML = "";

    const transactions = Array.isArray(user.transactions)
      ? user.transactions
      : [];

    // ----------------------------------------
    // NO TRANSACTIONS
    // ----------------------------------------

    if (transactions.length === 0) {
      transactionList.innerHTML = `
        <div class="empty">
          <h3>No Transactions Found</h3>
        </div>
      `;

      return;
    }

    // ----------------------------------------
    // SHOW LAST 3
    // ----------------------------------------

    const recent = transactions.slice().reverse().slice(0, 3);

    recent.forEach(function (tx) {
      let icon = "fa-receipt";

      let title = "Transaction";

      let subtitle = "";

      // --------------------------------------
      // DATA
      // --------------------------------------

      if (tx.type === "data") {
        icon = "fa-wifi";
        title = "Data Purchase";
        subtitle = tx.bundle || "Data Bundle";
      }

      // --------------------------------------
      // AIRTIME
      // --------------------------------------
      else if (tx.type === "airtime") {
        icon = "fa-phone";
        title = "Airtime Purchase";
        subtitle = tx.network || "MTN";
      }

      // --------------------------------------
      // WALLET
      // --------------------------------------
      else if (tx.type === "wallet") {
        icon = "fa-wallet";
        title = "Wallet Funding";
        subtitle = tx.method || "Bank Transfer";
      }

      // --------------------------------------
      // AIRTIME TO CASH
      // --------------------------------------
      else if (tx.type === "airtime-cash" || tx.type === "convert") {
        icon = "fa-money-bill-transfer";
        title = "Airtime to Cash";
        subtitle = tx.network || "MTN";
      }

      // --------------------------------------
      // WITHDRAW
      // --------------------------------------
      else if (tx.type === "withdraw") {
        icon = "fa-building-columns";
        title = "Withdrawal";
        subtitle = tx.bank || "Bank Transfer";
      }

      // --------------------------------------
      // AMOUNT
      // --------------------------------------

      const amount = Number(tx.amount || tx.price || tx.receiveAmount || 0);

      const isCredit = tx.transactionType === "credit";

      const sign = isCredit ? "+" : "-";

      const amountClass = isCredit ? "credit" : "debit";

      // --------------------------------------
      // STATUS
      // --------------------------------------

      let statusClass = "pending";

      if (tx.status === "Successful" || tx.status === "Approved") {
        statusClass = "success";
      }

      if (tx.status === "Rejected" || tx.status === "Failed") {
        statusClass = "failed";
      }

      // --------------------------------------
      // CARD
      // --------------------------------------

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

            <p>
              ${tx.date || ""}
            </p>

          </div>

        </div>

        <div class="right">

          <div class="${amountClass}">
            ${sign} ₦${amount.toLocaleString()}
          </div>

          <div class="${statusClass}">
            ${tx.status || "Pending"}
          </div>

        </div>
      `;

      // --------------------------------------
      // OPEN TRANSACTION
      // --------------------------------------

      card.addEventListener("click", function () {
        localStorage.setItem("selectedTransaction", JSON.stringify(tx));

        window.location.href = "transaction-details.html";
      });

      transactionList.appendChild(card);
    });
  }

  displayTransactions();

  // ==========================================
  // SAVE USER BACK
  // ==========================================

  try {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  } catch (error) {
    console.error("Unable to save user:", error);
  }
})();
