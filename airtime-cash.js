// ============================================
// FAST MTN DATA
// AIRTIME TO CASH
// ============================================

// ============================================
// LOGIN CHECK
// ============================================

const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  window.location.href = "login.html";
}

// ============================================
// RECEIVING NUMBERS
// ============================================

const receivingNumbers = [
  "09167967974",
  "08040902312",
  "09031234567",
  "08161234567",
  "07031234567",
];

// ============================================
// GET ELEMENTS
// ============================================

const networkInput = document.getElementById("network");

const senderInput = document.getElementById("sender");

const amountInput = document.getElementById("amount");

const cashAmount = document.getElementById("cashAmount");

const continueBtn = document.getElementById("continueBtn");

const receivingNumberElement = document.getElementById("receivingNumber");

// ============================================
// SETTINGS
// ============================================

const feePercentage = 15;

// ============================================
// GET / CREATE CURRENT RECEIVING NUMBER
// ============================================
//
// IMPORTANT:
//
// The number is generated when the user enters
// the Airtime-to-Cash page.
//
// It stays the same while they are on this
// conversion.
//
// The next conversion gets another number.
//
// ============================================

function getReceivingNumber() {
  let currentNumber = localStorage.getItem("currentAirtimeCashNumber");

  // If there is already a current number,
  // keep using it.

  if (currentNumber) {
    return currentNumber;
  }

  // Get queue

  let queue = JSON.parse(localStorage.getItem("airtimeCashNumberQueue"));

  // Create queue if empty

  if (!Array.isArray(queue) || queue.length === 0) {
    queue = [...receivingNumbers];
  }

  // Take first number

  const number = queue.shift();

  // Save remaining queue

  localStorage.setItem("airtimeCashNumberQueue", JSON.stringify(queue));

  // Save current number

  localStorage.setItem("currentAirtimeCashNumber", number);

  return number;
}

// ============================================
// CURRENT RECEIVING NUMBER
// ============================================

const receivingNumber = getReceivingNumber();

// ============================================
// DISPLAY RECEIVING NUMBER
// ============================================

if (receivingNumberElement) {
  receivingNumberElement.textContent = receivingNumber;
}

// ============================================
// COPY RECEIVING NUMBER
// ============================================

const copyReceivingNumber = document.getElementById("copyReceivingNumber");

const copyMessage = document.getElementById("copyMessage");

if (copyReceivingNumber) {
  copyReceivingNumber.addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(receivingNumber);

      // Change icon

      copyReceivingNumber.innerHTML = `<i class="fa-solid fa-check"></i>`;

      if (copyMessage) {
        copyMessage.textContent = "Number copied ✓";
      }

      // Restore icon

      setTimeout(function () {
        copyReceivingNumber.innerHTML = `<i class="fa-regular fa-copy"></i>`;

        if (copyMessage) {
          copyMessage.textContent = "";
        }
      }, 1500);
    } catch (error) {
      // Fallback

      const textArea = document.createElement("textarea");

      textArea.value = receivingNumber;

      document.body.appendChild(textArea);

      textArea.select();

      document.execCommand("copy");

      textArea.remove();

      if (copyMessage) {
        copyMessage.textContent = "Number copied ✓";
      }
    }
  });
}

// ============================================
// CALCULATE CASH AMOUNT
// ============================================

if (amountInput) {
  amountInput.addEventListener("input", function () {
    const amount = Number(this.value);

    if (!amount || amount <= 0) {
      cashAmount.textContent = "₦0";

      return;
    }

    const fee = amount * (feePercentage / 100);

    const receiveAmount = amount - fee;

    cashAmount.textContent = "₦" + receiveAmount.toLocaleString();
  });
}

// ============================================
// CONTINUE BUTTON
// ============================================

if (continueBtn) {
  continueBtn.addEventListener("click", function () {
    // ========================================
    // GET VALUES
    // ========================================

    const network = networkInput.value.trim();

    const sender = senderInput.value.trim();

    const amount = Number(amountInput.value);

    // ========================================
    // VALIDATE NETWORK
    // ========================================

    if (!network) {
      showAlert("Please select your network.", "error");

      networkInput.focus();

      return;
    }

    // --------------------------------------
    // MTN PREFIX
    // --------------------------------------

    const mtnPrefixes = [
      "0803",
      "0806",
      "0703",
      "0706",
      "0810",
      "0813",
      "0814",
      "0816",
      "0903",
      "0906",
      "0913",
      "0916",
    ];

    const isMTN = mtnPrefixes.some(function (prefix) {
      return sender.startsWith(prefix);
    });

    if (!isMTN) {
      showAlert("Please enter a valid MTN phone number ", "error");

      return;
    }

    // ========================================
    // VALIDATE PHONE
    // ========================================

    if (!sender) {
      showAlert("Please enter your phone number.", "error");

      senderInput.focus();

      return;
    }

    if (!/^0\d{10}$/.test(sender)) {
      showAlert("Enter a valid 11-digit phone number.", "warning");

      senderInput.focus();

      return;
    }

    // ========================================
    // VALIDATE AMOUNT
    // ========================================

    if (!amount || amount <= 0) {
      showAlert("Enter a valid airtime amount.", "warning");

      amountInput.focus();

      return;
    }

    // ========================================
    // OPTIONAL MINIMUM
    // ========================================

    if (amount < 100) {
      show("Minimum airtime amount is ₦100.", "warning");

      amountInput.focus();

      return;
    }

    // ========================================
    // CALCULATE FEE
    // ========================================

    const fee = amount * (feePercentage / 100);

    const receiveAmount = amount - fee;

    // ========================================
    // CREATE REFERENCE
    // ========================================

    const reference = Date.now().toString();

    // ========================================
    // EXPIRY
    // ========================================

    const expiresAt = Date.now() + 20 * 60 * 1000;

    // ========================================
    // SAVE AIRTIME CASH DETAILS
    // ========================================

    const airtimeCashDetails = {
      id: reference,

      type: "convert",

      network: network,

      sender: sender,

      recipient: receivingNumber,

      receivingNumber: receivingNumber,

      amount: amount,

      fee: fee,

      receiveAmount: receiveAmount,

      reference: reference,

      expiresAt: expiresAt,
    };

    localStorage.setItem(
      "airtimeCashDetails",
      JSON.stringify(airtimeCashDetails),
    );

    // ========================================
    // SHOW LOADER
    // ========================================

    if (typeof startButtonLoading === "function") {
      startButtonLoading(continueBtn, "Processing...");
    } else {
      continueBtn.disabled = true;

      continueBtn.innerHTML = `
          <span class="button-loader"></span>
          Processing...
        `;
    }

    // ========================================
    // GO TO SEND AIRTIME
    // ========================================

    setTimeout(function () {
      window.location.href = "send-airtime.html";
    }, 400);
  });
}

// ============================================
// POLICY MODAL
// ============================================

const viewPolicyBtn = document.getElementById("viewPolicyBtn");

const policyModal = document.getElementById("policyModal");

const closePolicy = document.getElementById("closePolicy");

const understandPolicy = document.getElementById("understandPolicy");

// ============================================
// OPEN POLICY
// ============================================

if (viewPolicyBtn && policyModal) {
  viewPolicyBtn.addEventListener("click", function (event) {
    event.preventDefault();

    event.stopPropagation();

    policyModal.classList.add("show");

    document.body.style.overflow = "hidden";
  });
}

// ============================================
// CLOSE POLICY
// ============================================

function closePolicyModal() {
  if (!policyModal) {
    return;
  }

  policyModal.classList.remove("show");

  document.body.style.overflow = "";
}

// ============================================
// CLOSE BUTTON
// ============================================

if (closePolicy) {
  closePolicy.addEventListener("click", function (event) {
    event.preventDefault();

    event.stopPropagation();

    closePolicyModal();
  });
}

// ============================================
// I UNDERSTAND
// ============================================

if (understandPolicy) {
  understandPolicy.addEventListener("click", function (event) {
    event.preventDefault();

    event.stopPropagation();

    closePolicyModal();
  });
}

// ============================================
// CLICK OUTSIDE MODAL
// ============================================

if (policyModal) {
  policyModal.addEventListener("click", function (event) {
    if (event.target === policyModal) {
      closePolicyModal();
    }
  });
}

// ============================================
// ESC KEY
// ============================================

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePolicyModal();
  }
});
