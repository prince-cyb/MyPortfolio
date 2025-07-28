window.scrollTo(0,0);
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");
  const anime = document.querySelectorAll(".anime");

  var a = 0;
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("show");
    if (a==0){
      hamburger.innerHTML="X";
      a=1;
    }else{
      hamburger.innerHTML="&#9776;";
      a=0;
    };
  });


  async function trackVisitor() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const visitor = {
        ip: data.ip,
        country: data.country_name,
        city: data.city,
        region: data.region,
        browser: navigator.userAgent,
        os: navigator.platform,
        screen: `${window.innerWidth}x${window.innerHeight}`
      };

      await fetch("https://script.google.com/macros/s/AKfycbzg71l48WTVvLI_XsL7D8VkpeNJTya92qgk2XwVzjtOkt52pdFTyJG_jrH-GVEm8o1n/exec", {
        method: "POST",
        body: JSON.stringify(visitor)
      });
    } catch (err) {
      // silently fail
    }
  }

  trackVisitor();


document.querySelector(".iform").addEventListener("submit", function (e) {
  const form = e.target;

  const data = {
    ip: data.ip,
    country: data.country_name,
    city: data.city,
    region: data.region,
    browser: navigator.userAgent,
    os: navigator.platform,
    screen: `${window.innerWidth}x${window.innerHeight}`,
    name: form.querySelector('input[name="Name"]').value,
    email: form.querySelector('input[name="email"]').value,
    message: form.querySelector('textarea[name="message"]').value
  };

  // Send to Google Sheet in background
  fetch("https://script.google.com/macros/s/AKfycbzg71l48WTVvLI_XsL7D8VkpeNJTya92qgk2XwVzjtOkt52pdFTyJG_jrH-GVEm8o1n/exec", {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert('Form Submitted');
});

  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
      if(a==1){
        hamburger.innerHTML="&#9776;";
        a=0;
      };
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry =>{
      if (entry.isIntersecting){
        entry.target.classList.add('animate');
      };
    });
  });

  document.querySelectorAll('.anime').forEach(anime => {
    observer.observe(anime);
  });

  document.addEventListener('click', (event) => {
  const isClickInsideMenu = menu.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (!isClickInsideMenu && !isClickOnHamburger && menu.classList.contains('show')) {
    menu.classList.remove('show');
    hamburger.innerHTML = "&#9776;";
    a = 0;
  }
});


});

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

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener("load", () => {
  history.replaceState(null, null, window.location.pathname);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
});

