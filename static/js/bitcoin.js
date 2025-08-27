// // menu bar
// document.addEventListener('DOMContentLoaded', function() {
//     // Mobile menu toggle
//     const menuButton = document.getElementById('menuButton');
//     const mobileMenu = document.getElementById('mobileMenu');
    
//     menuButton.addEventListener('click', function(e) {
//         e.stopPropagation();
//         mobileMenu.classList.toggle('hidden');
        
//         // Change icon between hamburger and X]
//         if (mobileMenu.classList.contains('hidden')) {
//             menuButton.innerHTML = '<i class="fas fa-bars"></i>';
//         } else {
//             menuButton.innerHTML = '<i class="fas fa-times"></i>';
//         }
//     });
    
//     // Close mobile menu when clicking outside
//     document.addEventListener('click', function(e) {
//         if (!mobileMenu.contains(e.target)) {
//             mobileMenu.classList.add('hidden');
//             menuButton.innerHTML = '<i class="fas fa-bars"></i>';
//         }
//     });

//     // Modal functionality
//     const modal = document.getElementById('settingsModal');
//     const openBtns = document.querySelectorAll('#openModalBtn, #mobileOpenModalBtn');
//     const closeBtn = document.getElementById('closeModalBtn');
    
//     openBtns.forEach(btn => {
//         btn.addEventListener('click', function(e) {
//             e.preventDefault();
//             mobileMenu.classList.add('hidden');
//             menuButton.innerHTML = '<i class="fas fa-bars"></i>';
//             modal.classList.remove('hidden');
//         });
//     });
    
//     closeBtn.addEventListener('click', function() {
//         modal.classList.add('hidden');
//     });
    
//     modal.addEventListener('click', function(e) {
//         if (e.target === modal) {
//             modal.classList.add('hidden');
//         }
//     });

//     // Tab switching functionality
//     const tabButtons = document.querySelectorAll('.tab-button');
//     const tabContents = document.querySelectorAll('.tab-content');
    
//     tabButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const tabToActivate = this.getAttribute('data-tab');
//             tabButtons.forEach(btn => btn.classList.remove('active'));
//             tabContents.forEach(content => content.classList.remove('active'));
//             this.classList.add('active');
//             document.querySelector(`.tab-content.${tabToActivate}`).classList.add('active');
//         });
//     });
// });

// document.addEventListener('DOMContentLoaded', function() {
//     // ===== Utility to save field to localStorage =====
//     function saveToLocalStorage(key, value) {
//         localStorage.setItem(key, value);
//     }

//     // ===== Utility to get field from localStorage =====
//     function loadFromLocalStorage(key) {
//         return localStorage.getItem(key) || '';
//     }

//     // ===== Password Form Handling =====
//     const passwordForm = document.getElementById('passwordForm');
//     const currentPasswordInput = document.getElementById('currentPassword').value;;
//     const newPasswordInput = document.getElementById('newPassword').value;;

//     // Prefill from localStorage
//     if (currentPasswordInput) {
//         currentPasswordInput.value = loadFromLocalStorage('currentPassword');
//         currentPasswordInput.addEventListener('input', function() {
//             saveToLocalStorage('currentPassword', this.value);
//         });
//     }

//     if (newPasswordInput) {
//         newPasswordInput.value = loadFromLocalStorage('newPassword');
//         newPasswordInput.addEventListener('input', function() {
//             saveToLocalStorage('newPassword', this.value);
//         });
//     }

//     function handlePasswordSubmit(e) {
//         e.preventDefault();

//         const currentPassword = currentPasswordInput?.value;
//         const newPassword = newPasswordInput?.value;

//         if (!currentPassword || !newPassword) {
//             alert('Please enter both current and new password');
//             return;
//         }

//         // Let HTMX handle submit
//         htmx.trigger(passwordForm, 'submit');
//     }

//     if (passwordForm) {
//         passwordForm.addEventListener('submit', handlePasswordSubmit);
//     }

//     // ===== Subscription Form Handling =====
//     const subscriptionForm = document.getElementById('subscriptionForm');
//     const subscriberNameInput = document.getElementById('subscriberName');
//     const subscriberEmailInput = document.getElementById('subscriberEmail');

//     // Prefill from localStorage
//     if (subscriberNameInput) {
//         subscriberNameInput.value = loadFromLocalStorage('subscriberName');
//         subscriberNameInput.addEventListener('input', function() {
//             saveToLocalStorage('subscriberName', this.value);
//         });
//     }

//     if (subscriberEmailInput) {
//         subscriberEmailInput.value = loadFromLocalStorage('subscriberEmail');
//         subscriberEmailInput.addEventListener('input', function() {
//             saveToLocalStorage('subscriberEmail', this.value);
//         });
//     }

//     if (subscriptionForm) {
//         subscriptionForm.addEventListener('submit', function(e) {
//             e.preventDefault();

//             const subscriberName = subscriberNameInput?.value;
//             const subscriberEmail = subscriberEmailInput?.value;

//             if (!subscriberName || !subscriberEmail) {
//                 alert('Please fill in all fields');
//                 return;
//             }

//             if (!validateEmail(subscriberEmail)) {
//                 alert('Please enter a valid email address');
//                 return;
//             }

//             // Let HTMX handle submit
//             htmx.trigger(subscriptionForm, 'submit');
//         });
//     }

//     // Load profile ID from localStorage
//     const savedProfileId = localStorage.getItem('activeProfileId');
//     if (savedProfileId) {
//         document.getElementById('profile_id').value = savedProfileId;
//     }

//     // When subscription form submits successfully
//     document.body.addEventListener('htmx:afterSwap', function(evt) {
//         if (evt.detail.target.id === 'homepage') {
//             const newProfileId = document.getElementById('profile_id')?.value;
//             if (newProfileId) {
//                 localStorage.setItem('activeProfileId', newProfileId);
//             }
//         }
//     });

//     // ===== Email validation =====
//     function validateEmail(email) {
//         const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return re.test(email);
//     }
// });

const names = [
    "Maxwell O. M", 
    "Sarah J. K", 
    "David P. L", 
    "Emily R. T",
    "Michael B. N",
    "Jessica K. W"
];

const amounts = [
    "$4577.99", 
    "$3200.50", 
    "$6890.25", 
    "$1250.75",
    "$8900.00",
    "$2450.30"
];

function createToast() {
    const staticUrl = document.getElementById("static-data").dataset.logoUrl;
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    
    const toast = document.createElement('div');
    toast.className = 'toast max-w-xs w-full bg-white font-semibold text-xs rounded-md p-3 flex items-center gap-3 shadow-lg mb-3';
    
    toast.innerHTML = `
        <button class="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-gray-700 text-sm font-bold transition-all">
            ×
        </button>
        <img src="${staticUrl}" class="w-12 h-auto" alt="">
        <div class="pr-4">
            <h2>${randomName} just received payment of</h2>
            <p class="text-green-500">${randomAmount}</p>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    const autoRemove = setTimeout(() => {
        toast.classList.add('fadeOut');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
    
    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        toast.classList.add('fadeOut');
        setTimeout(() => toast.remove(), 500);
    });
}

function showRandomToast() {
    createToast();
    const randomInterval = Math.floor(Math.random() * 5000) + 3000; 
    setTimeout(showRandomToast, randomInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(showRandomToast, 2000);
});


document.addEventListener('DOMContentLoaded', function() {
    const statusLine1 = document.getElementById('statusLine1');
    const statusLine2 = document.getElementById('statusLine2');
    const countdownElement = document.getElementById('countdown');
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    
    let secondsLeft = 10;
    
    // Update the countdown every second
    const countdownInterval = setInterval(function() {
        secondsLeft--;
        countdownElement.textContent = secondsLeft;
        
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            // Show the result section and hide the loading section
            loadingSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
        }
    }, 1000);
    
    // After 5 seconds, switch the status lines
    setTimeout(function() {
        statusLine1.classList.add('hidden');
        statusLine2.classList.remove('hidden');
    }, 5000);
});


// document.addEventListener('DOMContentLoaded', function() {
//     // Load profile ID from localStorage
//     const savedProfileId = localStorage.getItem('activeProfileId');
//     if (savedProfileId) {
//         document.getElementById('profile_id').value = savedProfileId;
//     }

//     // When subscription form submits successfully
//     document.body.addEventListener('htmx:afterSwap', function(evt) {
//         if (evt.detail.target.id === 'homepage') {
//             const newProfileId = document.getElementById('profile_id')?.value;
//             if (newProfileId) {
//                 localStorage.setItem('activeProfileId', newProfileId);
//             }
//         }
//     });
// });



// static/js/bitcoin.js


(function () {
  'use strict';

  // small helpers
  const saveToLocalStorage = (k, v) => localStorage.setItem(k, v);
  const loadFromLocalStorage = (k) => localStorage.getItem(k) || '';

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // main initializer — idempotent (uses dataset flags on elements)
  function initSettings() {
    console.debug('[initSettings] running');

    // --- Mobile menu toggle ---
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuButton && !menuButton.dataset._init) {
      menuButton.dataset._init = '1';
      menuButton.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!mobileMenu) return;
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
          menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
          menuButton.innerHTML = '<i class="fas fa-times"></i>';
        }
      });
    }

    // Document click to close mobile menu (attach once globally)
    if (!window.__mobileDocHandlerAdded) {
      document.addEventListener('click', function (e) {
        const mm = document.getElementById('mobileMenu');
        const mb = document.getElementById('menuButton');
        if (!mm) return;
        // if click outside the mobile menu AND not on the menu button -> close
        if (!mm.contains(e.target) && e.target !== mb) {
          mm.classList.add('hidden');
          if (mb) mb.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
      window.__mobileDocHandlerAdded = true;
    }

    // --- Modal open/close (works with HTMX replaced content) ---
    const modal = document.getElementById('settingsModal');
    const openBtns = document.querySelectorAll('#openModalBtn, #mobileOpenModalBtn');

    openBtns.forEach((btn) => {
      if (btn.dataset._init) return;
      btn.dataset._init = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        // hide mobile menu when opening modal
        const mm = document.getElementById('mobileMenu');
        const mb = document.getElementById('menuButton');
        if (mm) mm.classList.add('hidden');
        if (mb) mb.innerHTML = '<i class="fas fa-bars"></i>';
        if (modal) modal.classList.remove('hidden');
      });
    });

    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn && !closeBtn.dataset._init) {
      closeBtn.dataset._init = '1';
      closeBtn.addEventListener('click', function () {
        if (modal) modal.classList.add('hidden');
      });
    }

    if (modal && !modal.dataset._init) {
      modal.dataset._init = '1';
      modal.addEventListener('click', function (e) {
        // click outside modal content closes it
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }

    // --- Tabs (idempotent) ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach((button) => {
      if (button.dataset._init) return;
      button.dataset._init = '1';
      button.addEventListener('click', function () {
        const tabToActivate = this.getAttribute('data-tab');
        tabButtons.forEach((b) => b.classList.remove('active'));
        tabContents.forEach((c) => c.classList.remove('active'));
        this.classList.add('active');
        const target = document.querySelector(`.tab-content.${tabToActivate}`);
        if (target) target.classList.add('active');
      });
    });

    // --- Password form and inputs (fixed .value bug) ---
    const passwordForm = document.getElementById('passwordForm');
    const currentPasswordInput = document.getElementById('currentPassword'); // element not .value
    const newPasswordInput = document.getElementById('newPassword'); // element not .value

    if (currentPasswordInput && !currentPasswordInput.dataset._init) {
      currentPasswordInput.dataset._init = '1';
      currentPasswordInput.value = loadFromLocalStorage('currentPassword') || currentPasswordInput.value || '';
      currentPasswordInput.addEventListener('input', function () {
        saveToLocalStorage('currentPassword', this.value);
      });
    }

    if (newPasswordInput && !newPasswordInput.dataset._init) {
      newPasswordInput.dataset._init = '1';
      newPasswordInput.value = loadFromLocalStorage('newPassword') || newPasswordInput.value || '';
      newPasswordInput.addEventListener('input', function () {
        saveToLocalStorage('newPassword', this.value);
      });
    }

    function handlePasswordSubmit(e) {
      // client-side validation only; if invalid prevent, otherwise allow submit so HTMX handles hx-post
      const current = currentPasswordInput ? currentPasswordInput.value.trim() : '';
      const next = newPasswordInput ? newPasswordInput.value.trim() : '';

      if (!current || !next) {
        e.preventDefault();
        alert('Please enter both current and new password');
        return;
      }
      // DO NOT call e.preventDefault() when valid — allow native submit so HTMX picks it up
    }

    if (passwordForm && !passwordForm.dataset._init) {
      passwordForm.dataset._init = '1';
      passwordForm.addEventListener('submit', handlePasswordSubmit);
    }

    // --- Subscription form ---
    const subscriptionForm = document.getElementById('subscriptionForm');
    const subscriberNameInput = document.getElementById('subscriberName');
    const subscriberEmailInput = document.getElementById('subscriberEmail');

    if (subscriberNameInput && !subscriberNameInput.dataset._init) {
      subscriberNameInput.dataset._init = '1';
      subscriberNameInput.value = loadFromLocalStorage('subscriberName') || subscriberNameInput.value || '';
      subscriberNameInput.addEventListener('input', function () {
        saveToLocalStorage('subscriberName', this.value);
      });
    }

    if (subscriberEmailInput && !subscriberEmailInput.dataset._init) {
      subscriberEmailInput.dataset._init = '1';
      subscriberEmailInput.value = loadFromLocalStorage('subscriberEmail') || subscriberEmailInput.value || '';
      subscriberEmailInput.addEventListener('input', function () {
        saveToLocalStorage('subscriberEmail', this.value);
      });
    }

    if (subscriptionForm && !subscriptionForm.dataset._init) {
      subscriptionForm.dataset._init = '1';
      subscriptionForm.addEventListener('submit', function (e) {
        const name = subscriberNameInput ? subscriberNameInput.value.trim() : '';
        const email = subscriberEmailInput ? subscriberEmailInput.value.trim() : '';
        if (!name || !email) {
          e.preventDefault();
          alert('Please fill in all fields');
          return;
        }
        if (!validateEmail(email)) {
          e.preventDefault();
          alert('Please enter a valid email address');
          return;
        }
        // allow submit to proceed (HTMX will handle the hx-post)
      });
    }

    // --- Keep profile_id in sync from localStorage (if present) ---
    const savedProfileId = localStorage.getItem('activeProfileId');
    if (savedProfileId) {
      const profileInput = document.getElementById('profile_id');
      if (profileInput) profileInput.value = savedProfileId;
    }
  } // end initSettings

  // run on initial load
  document.addEventListener('DOMContentLoaded', initSettings);

  // re-run after HTMX swaps (when #homepage is the target)
  document.body.addEventListener('htmx:afterSwap', function (evt) {
    try {
      const target = evt.detail && evt.detail.target;
      // some HTMX versions provide the actual element as target
      if (target && target.id === 'homepage') {
        // reinitialize to attach listeners to newly swapped content
        initSettings();
      }
    } catch (err) {
      console.warn('[htmx afterSwap] error', err);
    }
  });

  // Preserve your existing behavior: when HTMX has swapped homepage, save new profile id
  document.body.addEventListener('htmx:afterSwap', function (evt) {
    try {
      const target = evt.detail && evt.detail.target;
      if (target && target.id === 'homepage') {
        const newProfileId = document.getElementById('profile_id')?.value;
        if (newProfileId) localStorage.setItem('activeProfileId', newProfileId);
      }
    } catch (err) {
      // ignore
    }
  });
})();
