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

