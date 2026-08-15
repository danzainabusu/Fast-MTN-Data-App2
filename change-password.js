let user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

const toggles = document.querySelectorAll(".toggle");

toggles.forEach((icon) => {
  icon.addEventListener("click", function () {
    const input = document.getElementById(this.dataset.target);

    if (input.type === "password") {
      input.type = "text";
      this.classList.remove("fa-eye");
      this.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      this.classList.remove("fa-eye-slash");
      this.classList.add("fa-eye");
    }
  });
});

document.getElementById("changeBtn").addEventListener("click", function () {
  const current = document.getElementById("currentPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (current !== user.password) {
    alert("Current password is incorrect.");
    return;
  }

  if (newPass.length < 6) {
    alert("New password must be at least 6 characters.");
    return;
  }

  if (newPass !== confirm) {
    alert("New passwords do not match.");
    return;
  }

  user.password = newPass;

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const index = users.findIndex((u) => u.phone === user.phone);

  if (index !== -1) {
    users[index] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }

  alert("Password changed successfully.");

  window.location.href = "profile.html";
});
