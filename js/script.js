document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal animations
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
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el);
      }
    });
  };

  window.addEventListener("scroll", () => {
    handleScrollAnimation();
  });

  // Initial check
  handleScrollAnimation();

  // Mobile menu toggle
  const openBtn = document.getElementById("mobile-menu-open-button");
  const closeBtn = document.getElementById("mobile-menu-close-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "";
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

  // Waitlist form submission
  const waitlistForm = document.getElementById("waitlist-form");
  const successMessage = document.getElementById("waitlist-success-message");

  if (waitlistForm) {
    waitlistForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const form = e.target;
      const data = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            form.style.display = "none";
            successMessage.classList.remove("hidden");
          } else {
            response.json().then((data) => {
              if (Object.hasOwn(data, "errors")) {
                alert(
                  data["errors"].map((error) => error["message"]).join(", ")
                );
              } else {
                alert("Oops! There was a problem submitting your form");
              }
            });
          }
        })
        .catch((error) => {
          alert("Oops! There was a problem submitting your form");
        });
    });
  }
});
