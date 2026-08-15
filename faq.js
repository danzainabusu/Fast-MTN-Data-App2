const questions = document.querySelectorAll(".faq-question");

questions.forEach((question) => {
  question.onclick = function () {
    this.parentElement.classList.toggle("active");
  };
});
