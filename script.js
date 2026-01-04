// Smooth scrolling and navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu functionality
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle mobile menu
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (
      !isClickInsideNav &&
      !isClickOnHamburger &&
      navMenu.classList.contains("active")
    ) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Header background change on scroll
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.style.background = "rgba(250, 248, 245, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(44, 62, 45, 0.15)";
    } else {
      header.style.background = "rgba(250, 248, 245, 0.95)";
      header.style.boxShadow = "0 2px 20px rgba(44, 62, 45, 0.1)";
    }
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".accommodation-card, .activity, .gallery-img, .contact-item, .feature"
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Form handling
  const bookingForm = document.querySelector(".form");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Simple validation
      const requiredFields = [
        "name",
        "phone",
        "checkin",
        "checkout",
        "guests",
        "cottage",
      ];
      let isValid = true;

      requiredFields.forEach((field) => {
        const input = this.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === "") {
          input.style.borderColor = "#e74c3c";
          isValid = false;
        } else {
          input.style.borderColor = "#e0e0e0";
        }
      });

      // Check dates
      const checkin = new Date(data.checkin);
      const checkout = new Date(data.checkout);

      if (checkout <= checkin) {
        document.getElementById("checkout").style.borderColor = "#e74c3c";
        isValid = false;
        alert("Дата виїзду повинна бути пізніше за дату заїзду");
        return;
      }

      if (!isValid) {
        alert("Будь ласка, заповніть всі обов'язкові поля");
        return;
      }

      // Show success message
      alert(
        "Дякуємо за вашу заявку! Ми зв'яжемося з вами найближчим часом для підтвердження бронювання."
      );

      // Reset form
      this.reset();

      // In a real application, you would send this data to a server
      console.log("Booking data:", data);
    });
  }

  // Image gallery lightbox effect
  const galleryImages = document.querySelectorAll(".gallery-img");

  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      createLightbox(this.src, this.alt);
    });
  });

  function createLightbox(src, alt) {
    // Create lightbox elements
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            background: none;
            border: none;
            color: white;
            font-size: 40px;
            cursor: pointer;
            z-index: 10001;
        `;

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    // Fade in
    setTimeout(() => {
      lightbox.style.opacity = "1";
    }, 10);

    // Close functionality
    function closeLightbox() {
      lightbox.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(lightbox);
      }, 300);
    }

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeLightbox();
      }
    });
  }

  // Parallax effect for hero section (disabled on mobile for performance)
  function initParallax() {
    if (window.innerWidth > 768) {
      const hero = document.querySelector(".hero");

      window.addEventListener("scroll", function () {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;

        if (hero) {
          hero.style.transform = `translateY(${parallax}px)`;
        }
      });
    }
  }

  // Initialize parallax
  initParallax();

  // Reinitialize parallax on window resize
  window.addEventListener("resize", function () {
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.style.transform = "translateY(0)";
    }
    initParallax();
  });

  // Add loading animation
  window.addEventListener("load", function () {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  });

  // Dynamic year in footer
  const currentYear = new Date().getFullYear();
  const yearElement = document.querySelector(".footer-bottom p");
  if (yearElement) {
    yearElement.innerHTML = `© ${currentYear} Садиба Саблінська. Всі права захищені.`;
  }

  // Add hover effects for accommodation cards
  const accommodationCards = document.querySelectorAll(".accommodation-card");

  accommodationCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Lazy loading for images (if supported)
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => imageObserver.observe(img));
  }
});

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add some Easter eggs for fun
console.log(`
🌿 Садиба Саблінська 🌿
Оазис тиші та чистого повітря далеко від міського шуму

Створено з любов'ю до природи ❤️
`);
