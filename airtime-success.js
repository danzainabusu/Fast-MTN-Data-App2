const tx = JSON.parse(localStorage.getItem("lastAirtimePurchase"));

if (!tx) {
  location.href = "dashboard.html";
}

document.getElementById("networkAmount").textContent =
  `${tx.network} ₦${Number(tx.amount).toLocaleString()}`;

document.getElementById("amount").textContent =
  `₦${Number(tx.amount).toLocaleString()}`;

document.getElementById("network").textContent = tx.network;

document.getElementById("phone").textContent = tx.phone;

document.getElementById("date").textContent = tx.date;

document.getElementById("buyMore").onclick = function () {
  location.href = "airtime.html";
};

document.getElementById("viewDetails").onclick = function () {
  location.href = "transaction-details.html"
};
