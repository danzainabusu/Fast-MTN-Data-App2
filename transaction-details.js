const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "login.html";
}

/* =========================================
   GET SELECTED TRANSACTION
========================================= */

let selectedTransaction = JSON.parse(
  localStorage.getItem("selectedTransaction"),
);

/*
  We first try to find the latest version
  inside loggedInUser.transactions.

  This is important because the admin may later
  change Pending -> Successful.
*/

if (selectedTransaction && loggedInUser.transactions) {
  const latestTransaction = loggedInUser.transactions.find(
    (tx) => String(tx.id) === String(selectedTransaction.id),
  );

  if (latestTransaction) {
    selectedTransaction = latestTransaction;
  }
}

if (!selectedTransaction) {
  alert("Transaction not found.");
  window.location.href = "transactions.html";
}

/* =========================================
   ELEMENTS
========================================= */

const titleEl = document.getElementById("transactionTitle");

const amountEl = document.getElementById("transactionAmount");

const mainStatusEl = document.getElementById("transactionStatus");

const dateEl = document.getElementById("transactionDate");

const noticeEl = document.getElementById("noticeText");

const processingStep = document.getElementById("processingStep");

const receivedStep = document.getElementById("receivedStep");

const progressLines = document.querySelectorAll(".progress .line");

/* DETAILS */

const detailType = document.getElementById("detailType");

const detailId = document.getElementById("detailId");

const detailPhone = document.getElementById("detailPhone");

const detailNetwork = document.getElementById("detailNetwork");

const detailBundle = document.getElementById("detailBundle");

const detailBank = document.getElementById("detailBank");

const detailAccount = document.getElementById("detailAccount");

const detailAccountName = document.getElementById("detailAccountName");

const detailDate = document.getElementById("detailDate");

const detailStatus = document.getElementById("detailStatus");

/* ROWS */

const detailPhoneRow = document.getElementById("detailPhoneRow");

const detailNetworkRow = document.getElementById("detailNetworkRow");

const detailBundleRow = document.getElementById("detailBundleRow");

const detailBankRow = document.getElementById("detailBankRow");

const detailAccountRow = document.getElementById("detailAccountRow");

const detailAccountNameRow = document.getElementById("detailAccountNameRow");

/* =========================================
   HELPER
========================================= */

function hideRow(row) {
  if (row) {
    row.style.display = "none";
  }
}

function showRow(row) {
  if (row) {
    row.style.display = "flex";
  }
}

function formatAmount(amount) {
  return "₦" + Number(amount || 0).toLocaleString();
}

/* =========================================
   TRANSACTION TYPE
========================================= */

function getTransactionTitle(tx) {
  switch (tx.type) {
    case "data":
      return "Data Purchase";

    case "airtime":
      return "Airtime Purchase";

    case "wallet":
      return "Wallet Funding";

    case "convert":
    case "airtime-cash":
      return "Airtime to Cash";

    case "withdraw":
    case "Withdrawal":
      return "Withdrawal";

    default:
      return tx.title || "Transaction";
  }
}

/* =========================================
   PROGRESS
========================================= */

function updateProgress(tx) {
  const status = String(tx.status || "Pending").toLowerCase();

  /*
    RESET
  */

  processingStep.classList.remove("completed", "processing");

  receivedStep.classList.remove("completed", "processing");

  progressLines.forEach((line) => {
    line.classList.remove("completed");
  });

  /*
    PENDING
    Payment successful
    ↓
    Processing by Team
    ↓
    Received by Team locked
  */

  if (status === "pending" || status === "processing") {
    processingStep.classList.add("processing");

    noticeEl.textContent =
      "Your payment was successful. Our team is currently processing your transaction.";

    return;
  }

  /*
    SUCCESSFUL / APPROVED
    Payment successful
    ↓
    Processing by Team
    ↓
    Received by Team
  */

  if (
    status === "successful" ||
    status === "approved" ||
    status === "completed"
  ) {
    processingStep.classList.add("completed");

    receivedStep.classList.add("completed");

    progressLines.forEach((line) => {
      line.classList.add("completed");
    });

    noticeEl.textContent =
      "Your transaction has been successfully received and completed.";

    return;
  }

  /*
    FAILED / REJECTED
  */

  if (status === "failed" || status === "rejected") {
    noticeEl.textContent =
      "Unfortunately, this transaction was not successful.";

    processingStep.classList.add("processing");
  }
}

/* =========================================
   LOAD TRANSACTION
========================================= */

function loadTransaction(tx) {
  const title = getTransactionTitle(tx);

  const amount = tx.amount || tx.price || 0;

  const status = tx.status || "Pending";

  /* SUMMARY */

  titleEl.textContent = title;

  amountEl.textContent = formatAmount(amount);

  mainStatusEl.textContent = status;

  /*
    STATUS CLASS
  */

  mainStatusEl.classList.remove("pending", "success", "failed");

  if (
    status === "Successful" ||
    status === "Approved" ||
    status === "Completed"
  ) {
    mainStatusEl.classList.add("success");
  } else if (status === "Failed" || status === "Rejected") {
    mainStatusEl.classList.add("failed");
  } else {
    mainStatusEl.classList.add("pending");
  }

  /* DATE */

  dateEl.textContent = tx.date || "";

  /* =====================================
     GENERAL DETAILS
  ===================================== */

  detailType.textContent = title;

  detailId.textContent = tx.reference || tx.transactionId || tx.id || "-";

  detailDate.textContent = tx.date || "-";

  detailStatus.textContent = status;

  /* =====================================
     HIDE EVERYTHING FIRST
  ===================================== */

  hideRow(detailPhoneRow);
  hideRow(detailNetworkRow);
  hideRow(detailBundleRow);
  hideRow(detailBankRow);
  hideRow(detailAccountRow);
  hideRow(detailAccountNameRow);

  /* =====================================
     AIRTIME TO CASH
  ===================================== */

  if (tx.type === "convert" || tx.type === "airtime-cash") {
    showRow(detailPhoneRow);
    showRow(detailNetworkRow);

    detailPhone.parentElement.querySelector("span").textContent =
      "Sending From";

    detailPhone.textContent = tx.sender || tx.senderPhone || "-";

    detailNetwork.textContent = tx.network || "-";

    /*
      ADD RECIPIENT INFORMATION
      using existing account row
    */

    showRow(detailAccountRow);

    detailAccountRow.querySelector("span").textContent = "Sending To";

    detailAccount.textContent =
      tx.recipient ||
      tx.recipientPhone ||
      tx.transferTo ||
      tx.destinationPhone ||
      "FAST MTN DATA";

    /*
      If your transaction contains the
      cash amount received
    */

    if (tx.cashAmount) {
      showRow(detailBundleRow);

      detailBundleRow.querySelector("span").textContent = "Cash Value";

      detailBundle.textContent = formatAmount(tx.cashAmount);
    }
  } else if (tx.type === "data") {
    /* =====================================
     DATA
  ===================================== */
    showRow(detailPhoneRow);
    showRow(detailNetworkRow);
    showRow(detailBundleRow);

    detailPhoneRow.querySelector("span").textContent = "Phone Number";

    detailPhone.textContent = tx.phone || tx.phoneNumber || "-";

    detailNetwork.textContent = tx.network || "MTN";

    detailBundle.textContent = tx.bundle || "-";
  } else if (tx.type === "airtime") {
    /* =====================================
     AIRTIME
  ===================================== */
    showRow(detailPhoneRow);
    showRow(detailNetworkRow);

    detailPhoneRow.querySelector("span").textContent = "Phone Number";

    detailPhone.textContent = tx.phone || tx.phoneNumber || "-";

    detailNetwork.textContent = tx.network || "MTN";
  } else if (tx.type === "wallet") {
    /* =====================================
     WALLET FUNDING
  ===================================== */
    showRow(detailBankRow);

    detailBank.textContent = tx.method || "Bank Transfer";
  } else if (tx.type === "withdraw" || tx.type === "Withdrawal") {
    /* =====================================
     WITHDRAWAL
  ===================================== */
    showRow(detailBankRow);
    showRow(detailAccountRow);
    showRow(detailAccountNameRow);

    detailBank.textContent = tx.bank || "-";

    detailAccount.textContent = tx.account || "-";

    detailAccountName.textContent = tx.accountName || "-";
  }

  /* UPDATE PROGRESS */

  updateProgress(tx);
}

/* =========================================
   INITIAL LOAD
========================================= */

loadTransaction(selectedTransaction);

/* =========================================
   CHECK FOR STATUS CHANGES
========================================= */

/*
  This checks localStorage every 2 seconds.

  So if admin changes:

  Pending -> Successful

  the transaction details page can update.
*/

setInterval(() => {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!currentUser) return;

  const latest = currentUser.transactions?.find(
    (tx) => String(tx.id) === String(selectedTransaction.id),
  );

  if (!latest) return;

  if (latest.status !== selectedTransaction.status) {
    selectedTransaction = latest;

    localStorage.setItem("selectedTransaction", JSON.stringify(latest));

    loadTransaction(latest);
  }
}, 2000);

/* =========================================
   REPORT ISSUE
========================================= */

function reportIssue() {
  alert("Your issue report feature will be connected to Support.");
}

/* =========================================
   SHARE RECEIPT
========================================= */

async function shareReceipt() {
  const text = `
FAST MTN DATA

${getTransactionTitle(selectedTransaction)}

Amount: ${formatAmount(selectedTransaction.amount || selectedTransaction.price)}

Status: ${selectedTransaction.status || "Pending"}

Transaction ID: ${selectedTransaction.reference || selectedTransaction.id}

Date: ${selectedTransaction.date || "-"}
`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Transaction Receipt",
        text: text,
      });
    } catch (error) {
      console.log("Share cancelled.");
    }
  } else {
    try {
      await navigator.clipboard.writeText(text);

      alert("Receipt copied to clipboard.");
    } catch (error) {
      alert(text);
    }
  }
}
