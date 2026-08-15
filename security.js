const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  location.href = "login.html";
}

document.getElementById("device").textContent = navigator.userAgent;

const now = new Date().toLocaleString();

if (!user.lastLogin) {
  user.lastLogin = now;
}

document.getElementById("lastLogin").textContent = user.lastLogin;

localStorage.setItem("loggedInUser", JSON.stringify(user));

let users = JSON.parse(localStorage.getItem("users")) || [];

const index = users.findIndex((u) => u.phone === user.phone);

if (index !== -1) {
  users[index] = user;

  localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("logoutAll").onclick = function () {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("loggedInUser");

    location.href = "login.html";
  }
};
