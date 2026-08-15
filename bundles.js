const plans = {
  daily: [
    {
      size: "500MB",
      price: 180,
      validity: "1 Day",
    },
    {
      size: "1GB",
      price: 330,
      validity: "1 Day",
    },
    {
      size: "2GB",
      price: 660,
      validity: "2 Days",
    },
  ],

  weekly: [
    {
      size: "5GB",
      price: 1650,
      validity: "7 Days",
    },
    {
      size: "7GB",
      price: 2200,
      validity: "7 Days",
    },
  ],

  monthly: [
    {
      size: "15GB",
      price: 4500,
      validity: "30 Days",
    },
    {
      size: "30GB",
      price: 8500,
      validity: "30 Days",
    },
    {
      size: "75GB",
      price: 16000,
      validity: "30 Days",
    },
  ],
};

const container = document.getElementById("plansContainer");

function showPlans(type) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  event.target.classList.add("active");

  container.innerHTML = "";

  plans[type].forEach((plan) => {
    container.innerHTML += `

<div class="bundle-card">

<div>

<h3>${plan.size}</h3>

<p>₦${plan.price} • ${plan.validity}</p>

</div>

<button
class="buy-btn" 
data-loader="true"
onclick="buyPlan('${plan.size}',${plan.price},'${plan.validity}')">

Buy

</button>

</div>

`;
  });
}

function buyPlan(size, price, validity) {
  localStorage.setItem(
    "selectedPlan",

    JSON.stringify({
      size,

      price,

      validity,
    }),
  );

  window.location.href = "buy-data.html";
}

showPlans("daily");
