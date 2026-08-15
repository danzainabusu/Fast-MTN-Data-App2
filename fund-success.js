const request = JSON.parse(localStorage.getItem("lastFundRequest"));

document.getElementById("amount").textContent =
  "₦" + Number(request.amount).toLocaleString();

document.getElementById("detailAmount").textContent =
  "₦" + Number(request.amount).toLocaleString();

document.getElementById("method").textContent = request.method;

document.getElementById("reference").textContent = request.reference;

document.getElementById("date").textContent = request.date;

document.getElementById("walletBtn").onclick = function () {
  location.href = "wallet.html";
};

document.getElementById("historyBtn").onclick = function () {
  location.href = "transaction-details.html";
};
