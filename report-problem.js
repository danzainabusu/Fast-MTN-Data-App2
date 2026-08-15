const user = JSON.parse(localStorage.getItem("loggedInUser"));

document.getElementById("submitReport").onclick = function () {
  const title = document.getElementById("title").value.trim();

  const message = document.getElementById("message").value.trim();

  if (title === "" || message === "") {
    alert("Please complete the form.");
    return;
  }

  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  reports.push({
    id: Date.now(),

    user: user.phone,

    name: user.name,

    title,

    message,

    status: "Pending",

    date: new Date().toLocaleString(),
  });

  localStorage.setItem("reports", JSON.stringify(reports));

  addNotification(
    user,
    "Problem Submitted",
    "Your complaint has been sent successfully.",
    "fa-solid fa-bug",
  );

  updateUser(user);

  alert("Report submitted successfully.");

  location.href = "help-support.html";
};
