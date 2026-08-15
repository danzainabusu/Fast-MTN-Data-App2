const tx = JSON.parse(localStorage.getItem("lastAirtimeCash"));

if (!tx) {
  location.href = "dashboard.html";
}

document.getElementById("network").textContent = tx.network;

document.getElementById("amount").textContent =
  "₦" + Number(tx.amount).toLocaleString();

document.getElementById("date").textContent = tx.date;

document.getElementById("sellMore").onclick = function () {
  location.href = "airtime-cash.html";
};

document.getElementById("viewDetail").onclick = function () {
  location.href = "transaction-details.html";
};
