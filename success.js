const user = JSON.parse(localStorage.getItem("loggedInUser"));

const tx = user.transactions[user.transactions.length - 1];

document.getElementById("bundleTitle").textContent = tx.bundle;

document.getElementById("amount").textContent = "₦" + tx.amount;

document.getElementById("bundle").textContent = tx.bundle;

document.getElementById("validity").textContent = tx.validity;

document.getElementById("phone").textContent = tx.phone;

document.getElementById("date").textContent = tx.date;
