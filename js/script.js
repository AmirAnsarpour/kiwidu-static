document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal animations with improved timing
  const scrollElements = document.querySelectorAll(".scroll-reveal");

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add("visible");
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el, index) => {
      if (elementInView(el, 1.15)) {
        // Add a slight delay based on element index for cascade effect
        setTimeout(() => {
          displayScrollElement(el);
        }, index * 100);
      }
    });
  };

  // Throttle function to limit how often scroll events fire
  const throttle = (fn, delay) => {
    let last = 0;
    return () => {
      const now = new Date().getTime();
      if (now - last < delay) return;
      last = now;
      fn();
    };
  };

  window.addEventListener("scroll", throttle(handleScrollAnimation, 100));

  // Initial check with slight delay for page load
  setTimeout(handleScrollAnimation, 300);

  // Mobile menu toggle with smooth transitions
  const openBtn = document.getElementById("mobile-menu-open-button");
  const closeBtn = document.getElementById("mobile-menu-close-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.style.opacity = "0";
      mobileMenu.classList.remove("hidden");
      setTimeout(() => {
        mobileMenu.style.opacity = "1";
        mobileMenu.style.transition = "opacity 0.3s ease";
      }, 10);
      document.body.style.overflow = "hidden";
    }
  }

  function closeMenu() {
    if (mobileMenu) {
      mobileMenu.style.opacity = "0";
      setTimeout(() => {
        mobileMenu.classList.add("hidden");
        document.body.style.overflow = "";
      }, 300);
    }
  }

  if (openBtn) {
    openBtn.addEventListener("click", openMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        });
      }
    });
  });

  // Waitlist form submission with improved feedback
  const waitlistForm = document.getElementById("waitlist-form");
  const successMessage = document.getElementById("waitlist-success-message");

  if (waitlistForm) {
    // Add focus effect to input
    const emailInput = waitlistForm.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      emailInput.addEventListener("blur", function () {
        if (this.value === "") {
          this.parentElement.classList.remove("focused");
        }
      });
    }

    // Handle form submission with enhanced animation
    waitlistForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const form = e.target;
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      // Show loading state with animation
      submitButton.innerHTML = '<span class="loading-text">Joining</span>';
      submitButton.disabled = true;

      // Add loading animation
      const loadingText = submitButton.querySelector(".loading-text");
      let dots = 0;
      const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingText.textContent = "Joining" + ".".repeat(dots);
      }, 300);

      const data = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          clearInterval(loadingInterval);

          if (response.ok) {
            // Smooth transition for success state
            form.style.opacity = "0";
            form.style.transform = "translateY(20px)";
            form.style.transition = "opacity 0.5s ease, transform 0.5s ease";

            setTimeout(() => {
              form.style.display = "none";
              successMessage.classList.remove("hidden");
              successMessage.style.opacity = "0";
              successMessage.style.transform = "translateY(20px)";

              setTimeout(() => {
                successMessage.style.opacity = "1";
                successMessage.style.transform = "translateY(0)";
                successMessage.style.transition =
                  "opacity 0.5s ease, transform 0.5s ease";
              }, 10);
            }, 500);
          } else {
            response.json().then((data) => {
              if (Object.hasOwn(data, "errors")) {
                alert(
                  data["errors"].map((error) => error["message"]).join(", ")
                );
              } else {
                alert("Oops! There was a problem submitting your form");
              }
              submitButton.textContent = originalText;
              submitButton.disabled = false;
            });
          }
        })
        .catch((error) => {
          clearInterval(loadingInterval);
          alert("Oops! There was a problem submitting your form");
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        });
    });
  }

  // Add subtle hover effect to waitlist buttons
  const waitlistButtons = document.querySelectorAll(".waitlist-button");
  waitlistButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transition =
        "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    });
  });
});
