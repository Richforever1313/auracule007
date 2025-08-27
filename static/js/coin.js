function toggleAccordion(id, button) {
  const content = document.getElementById(id);
  const isExpanded = content.classList.contains("expanded");

  document.querySelectorAll(".accordion-content").forEach((item) => {
    item.classList.remove("expanded");
    item.classList.add("collapsed");
  });

  document.querySelectorAll(".accordion-button").forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove(
      "bg-[#408cca]",
      "text-white",
      "border-b",
      "border-gray-300"
    );
    btn.classList.add("bg-white", "border-b", "border-gray-300");
    btn.querySelector("svg").classList.remove("rotate-180");
  });

  if (!isExpanded) {
    content.classList.remove("collapsed");
    content.classList.add("expanded");
    button.setAttribute("aria-expanded", "true");
    button.classList.add("bg-[#408cca]", "text-white");
    button.classList.remove("bg-white", "border-b", "border-gray-300");
    button.querySelector("svg").classList.add("rotate-180");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const firstButton = document.querySelector(".accordion-button");
  if (firstButton) {
    firstButton.classList.add("bg-[#408cca]", "text-white");
    firstButton.classList.remove("bg-white", "border-b", "border-gray-300");
    firstButton.querySelector("svg").classList.add("rotate-180");
  }
});

function toggleAccordion2(id, button) {
  const content = document.getElementById(id);
  const isExpanded = content.classList.contains("expanded2");
  content.classList.toggle("collapsed2");
  content.classList.toggle("expanded2");
  button.setAttribute("aria-expanded", !isExpanded);
  button.querySelector("svg").classList.toggle("rotate-180");
}

document.addEventListener("DOMContentLoaded", function () {
  // Form submission handler
  document
    .getElementById("paymentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const name = this.querySelector('input[placeholder="Your name"]').value;
      const email = this.querySelector('input[placeholder="Your Email"]').value;

      if (!name && !email) {
        alert("Please enter either your name or email");
        return;
      }

      document.querySelector(".kola").classList.add("hidden");
      document.getElementById("loader").classList.remove("hidden");

      fetch("/wallet/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: `fullName=${encodeURIComponent(name)}&email=${encodeURIComponent(
          email
        )}`,
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("loader").classList.add("hidden");

          if (data.error) {
            alert(data.error);
            document.querySelector(".kola").classList.remove("hidden");
            return;
          }

          // Show payment details section
          document.getElementById("tolu").classList.remove("hidden");

          if (data.wallet) {
            // Update image if available
            if (data.wallet.image) {
              document.getElementById("walletImage").src = data.wallet.image;
              console.log("Wallet image set to:", data.wallet.image);
            } else {
              console.log(
                "No image returned from backend, keeping default static image."
              );
            }

            // Update wallet address if available
            if (data.wallet.wallet_address) {
              document.getElementById("walletAddress").value =
                data.wallet.wallet_address;
              console.log("Wallet address set to:", data.wallet.wallet_address);
            } else {
              console.log("No wallet address returned from backend.");
            }
          }

          // Fill wallet details (keep your existing order)
          const copyContents = document.querySelectorAll(".copy-content");
          if (copyContents.length >= 6) {
            copyContents[0].textContent = data.wallet.balance || "";
            copyContents[1].textContent = data.wallet.total_price || "";
            copyContents[2].textContent = data.wallet.total_flat || "";
            copyContents[3].textContent = data.wallet.exchange_rate || "";
            copyContents[4].textContent = data.wallet.amount_due || "";
            copyContents[5].textContent = data.wallet.recommended_fee || "";
          }

          // Start countdown timer
          startCountdown();
        })
        .catch((error) => {
          console.error("Error:", error);
          document.querySelector(".kola").classList.remove("hidden");
          document.getElementById("loader").classList.add("hidden");
        });
    });

  function startCountdown() {
    let minutes = 1373;
    let seconds = 59;
    const countdownElement = document.getElementById("countdown");

    const countdownInterval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(countdownInterval);
          countdownElement.textContent = "This invoice has expired";
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }

      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.textContent = `This invoice will expire in ${minutes}:${formattedSeconds}`;
    }, 1000);
  }

  // Click-to-copy for other fields
  document.querySelectorAll(".copyable").forEach((element) => {
    element.addEventListener("click", function () {
      const content =
        this.querySelector(".copy-content")?.textContent || this.textContent;
      copyToClipboard(content.trim(), this);
    });
  });

  function copyToClipboard(text, element) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const message = element.querySelector(".copy-message");
        if (message) {
          message.classList.remove("hidden");
          setTimeout(() => {
            message.classList.add("hidden");
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        const message = element.querySelector(".copy-message");
        if (message) {
          message.classList.remove("hidden");
          setTimeout(() => {
            message.classList.add("hidden");
          }, 2000);
        }
      });
  }
});

// >>> ADDED: global function used by your HTML button
function copyAddress() {
  const addrInput = document.getElementById("walletAddress");
  if (!addrInput) return;
  const text = addrInput.value || "";
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const wrapper = addrInput.closest(".relative");
      const msg = wrapper ? wrapper.querySelector(".copy-message") : null;
      if (msg) {
        msg.classList.remove("hidden");
        setTimeout(() => msg.classList.add("hidden"), 2000);
      }
    })
    .catch(() => {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    });
}

// Helper function to get CSRF token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
