const typed = document.querySelector('.typed-text');
const roles = ['Developer', 'Coder', 'Problem Solver', 'Web Designer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typed.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typed.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before starting new word
    }

    setTimeout(type, typingSpeed);
}

// Start the typing animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});
window.scrollTo(0, 0);

// Show popup message (success or error) - Moved outside to make global
function showPopup(id, message) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.textContent = message;
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 4000);
}

// DOM loaded
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");
  const anime = document.querySelectorAll(".anime");
  let a = 0;

  // Hamburger toggle
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("show");
    hamburger.innerHTML = a === 0 ? "X" : "&#9776;";
    a = a === 0 ? 1 : 0;
  });

  // Visitor tracking (store in memory)
  let visitorData = {};
  async function trackVisitor() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      visitorData = {
        ip: data.ip,
        country: data.country_name,
        city: data.city,
        region: data.region,
        browser: navigator.userAgent,
        os: navigator.platform,
        screen: `${window.innerWidth}x${window.innerHeight}`
      };

      // Send visitor data on page load
      sendToSheet(visitorData);
    } catch (err) {
      console.log('Too many requests - failed to load visitor data');
    }
  }
  trackVisitor();

  // Send data to Google Sheet
  async function sendToSheet(data) {
    try {
      await fetch("https://script.google.com/macros/s/AKfycbwYXE_7T09lMdGQq4u-A0huixsjY4992ldX2IBdusLndHXu9s20xaJPThKha880p95oZQ/exec", {
        method: "POST",
        body: JSON.stringify(data),
        mode: "no-cors"
      });
    } catch (err) {
      showPopup("popupError", "❌ Submission failed.");
    }
  }

  // Form submission
  document.querySelector(".iform").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;

    const name = form.querySelector('input[name="Name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    if (!name || !email || !message) {
      showPopup("popupError", "❌ Please fill in all fields.");
      return;
    }

    const messageData = { name, email, message };
    const finalData = { ...visitorData, ...messageData };

    sendToSheet(finalData);
    showPopup("popupSuccess", "� Message sent successfully!");
    form.reset();
  });

  // Catch clicks on fake/no link
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'noLink') {
      showPopup("popupError", "❌ Sorry!!! No link found here.");
    }
  });

  // Menu link click behavior
  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
      if (a === 1) {
        hamburger.innerHTML = "&#9776;";
        a = 0;
      }
    });
  });

  // Intersection animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  });

  anime.forEach(el => observer.observe(el));

  // Hide menu on outside click
  document.addEventListener('click', event => {
    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger && menu.classList.contains('show')) {
      menu.classList.remove('show');
      hamburger.innerHTML = "&#9776;";
      a = 0;
    }
  });
});

// Scroll spy
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("div[id]");
  const navLinks = document.querySelectorAll(".menu a");
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 185;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Prevent scroll restore
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Scroll to top on reload
window.addEventListener("load", () => {
  history.replaceState(null, null, window.location.pathname);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
});
