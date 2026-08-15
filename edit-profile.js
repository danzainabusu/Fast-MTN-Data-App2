let user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

const image = document.getElementById("profileImage");

const picker = document.getElementById("imageInput");

const nameInput = document.getElementById("fullName");

const phoneInput = document.getElementById("phone");

nameInput.value = user.name;

phoneInput.value = user.phone;

if (user.profileImage) {
  image.src = user.profileImage;
}

picker.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    image.src = e.target.result;

    user.profileImage = e.target.result;
  };

  reader.readAsDataURL(file);
});

document.getElementById("saveBtn").addEventListener("click", function () {
  user.name = nameInput.value.trim();

  user.phone = phoneInput.value.trim();

  localStorage.setItem(
    "loggedInUser",

    JSON.stringify(user),
  );

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const index = users.findIndex(
    (u) => u.phone === user.phone || u.id === user.id,
  );

  if (index !== -1) {
    users[index] = user;
  }

  localStorage.setItem(
    "users",

    JSON.stringify(users),
  );

  alert("Profile Updated Successfully");

  window.location.href = "profile.html";
});
