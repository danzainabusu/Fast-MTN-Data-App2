// ============================================
// FAST MTN DATA - PROFILE
// ============================================

// ============================================
// GET LOGGED-IN USER
// ============================================

let user = JSON.parse(localStorage.getItem("loggedInUser"));

// ============================================
// LOGIN CHECK
// ============================================

if (!user) {
  window.location.href = "login.html";
}

// ============================================
// ELEMENTS
// ============================================

const nameElement = document.getElementById("name");

const phoneElement = document.getElementById("phone");

const profileImage = document.getElementById("profileImage");

const imageInput = document.getElementById("imageInput");

const logoutBtn = document.getElementById("logoutBtn");

// ============================================
// IMAGE VIEWER ELEMENTS
// ============================================

const imageViewer = document.getElementById("imageViewer");

const fullProfileImage = document.getElementById("fullProfileImage");

const closeImageViewer = document.getElementById("closeImageViewer");

// ============================================
// DISPLAY USER INFORMATION
// ============================================

if (nameElement) {
  nameElement.textContent = user.name || "User";
}

if (phoneElement) {
  phoneElement.textContent = user.phone || "";
}

// ============================================
// LOAD SAVED PROFILE IMAGE
// ============================================

if (profileImage && user.profileImage) {
  profileImage.src = user.profileImage;
}

// ============================================
// CHANGE PROFILE PICTURE
// ============================================

if (imageInput) {
  imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
      return;
    }

    // ======================================
    // CHECK IMAGE TYPE
    // ======================================

    if (!file.type.startsWith("image/")) {
      showAlert("Please select a valid image.", "info");

      this.value = "";

      return;
    }

    // ======================================
    // CHECK FILE SIZE
    // ======================================

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image must be less than 5MB.", "error");

      this.value = "";

      return;
    }

    // ======================================
    // READ IMAGE
    // ======================================

    const reader = new FileReader();

    reader.onload = function (event) {
      const image = new Image();

      image.onload = function () {
        // =================================
        // CANVAS
        // =================================

        const canvas = document.createElement("canvas");

        const ctx = canvas.getContext("2d");

        // =================================
        // MAX IMAGE SIZE
        // =================================

        const maxSize = 500;

        let width = image.width;

        let height = image.height;

        // =================================
        // RESIZE IMAGE
        // =================================

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = height * (maxSize / width);

            width = maxSize;
          } else {
            width = width * (maxSize / height);

            height = maxSize;
          }
        }

        canvas.width = width;

        canvas.height = height;

        // =================================
        // DRAW IMAGE
        // =================================

        ctx.drawImage(image, 0, 0, width, height);

        // =================================
        // COMPRESS IMAGE
        // =================================

        const compressedImage = canvas.toDataURL("image/jpeg", 0.8);

        // =================================
        // SAVE TO USER
        // =================================

        user.profileImage = compressedImage;

        // =================================
        // UPDATE USER
        // =================================

        if (typeof updateUser === "function") {
          updateUser(user);
        } else {
          // Fallback

          localStorage.setItem("loggedInUser", JSON.stringify(user));

          let users = JSON.parse(localStorage.getItem("users")) || [];

          const index = users.findIndex((u) => u.phone === user.phone);

          if (index !== -1) {
            users[index] = user;
          } else {
            users.push(user);
          }

          localStorage.setItem("users", JSON.stringify(users));
        }

        // =================================
        // SHOW NEW IMAGE
        // =================================

        if (profileImage) {
          profileImage.src = compressedImage;
        }

        // =================================
        // RESET INPUT
        // =================================

        imageInput.value = "";

        // =================================
        // SUCCESS
        // =================================

        if (typeof showAlert === "function") {
          showAlert("Profile picture updated successfully.", "success");
        } else {
          alert("Profile picture updated successfully.");
        }
      };

      image.onerror = function () {
        showAlert("Unable to load this image.", "info");
      };

      image.src = event.target.result;
    };

    reader.onerror = function () {
      showAlert("Unable to read the selected image.", "info");
    };

    reader.readAsDataURL(file);
  });
}

// ============================================
// OPEN FULL-SIZE IMAGE
// ============================================

if (profileImage) {
  profileImage.addEventListener("click", function () {
    // Don't open viewer if
    // there is no custom image

    const imageSource = user.profileImage || profileImage.src;

    if (!imageSource) {
      return;
    }

    if (fullProfileImage) {
      fullProfileImage.src = imageSource;
    }

    if (imageViewer) {
      imageViewer.classList.add("show");

      imageViewer.setAttribute("aria-hidden", "false");

      // Prevent background scrolling

      document.body.style.overflow = "hidden";
    }
  });
}

// ============================================
// CLOSE IMAGE VIEWER
// ============================================

function closeFullImage() {
  if (!imageViewer) {
    return;
  }

  imageViewer.classList.remove("show");

  imageViewer.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  if (fullProfileImage) {
    fullProfileImage.src = "";
  }
}

// ============================================
// CLOSE BUTTON
// ============================================

if (closeImageViewer) {
  closeImageViewer.addEventListener("click", closeFullImage);
}

// ============================================
// CLICK OUTSIDE IMAGE
// ============================================

if (imageViewer) {
  imageViewer.addEventListener("click", function (e) {
    if (e.target === imageViewer) {
      closeFullImage();
    }
  });
}

// ============================================
// ESCAPE KEY
// ============================================

document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    imageViewer &&
    imageViewer.classList.contains("show")
  ) {
    closeFullImage();
  }
});

// ============================================
// LOGOUT
// ============================================

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";
  });
}
