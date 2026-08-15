const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  location.href = "login.html";
}

const list = document.getElementById("notificationList");

if (!user.notificationsList) {
  user.notificationsList = [];
}

if (user.notificationsList.length === 0) {
  list.innerHTML += `
<div class="empty">

<i class="fa-regular fa-bell fa-3x"></i>

<h2>No Notifications</h2>

<p>Your notifications will appear here.</p>

</div>
`;
} else {
  user.notificationsList
    .slice()
    .reverse()
    .forEach((item) => {
      list.innerHTML += `

<div class="notification">

<div class="icon">

<i class="${item.icon}"></i>

</div>

<div class="content">

<h3>${item.title}</h3>

<p>${item.message}</p>

<div class="date">${item.date}</div>

</div>

</div>
`;
    });
}

user.notificationsList.forEach((n) => (n.read = true));

localStorage.setItem("loggedInUser", JSON.stringify(user));

let users = JSON.parse(localStorage.getItem("users")) || [];

const index = users.findIndex((u) => u.phone === user.phone);

if (index != -1) {
  users[index] = user;

  localStorage.setItem("users", JSON.stringify(users));
}
