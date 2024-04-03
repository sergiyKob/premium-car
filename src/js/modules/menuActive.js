currentLoc = location.href;
menuLink = document.querySelectorAll('.menu__link');

menuLink.forEach((item) => {
  if (item.href === currentLoc) {
    item.classList.add('menu__link--active');
  }
});

// const activePage = window.location.pathname;
// const menuLinks = document.querySelectorAll('.menu__link');
// menuLinks.forEach((link) => {
//   if (link.href.includes(`${activePage}`)) {
//     link.classList.add('menu__link--active');
//   }
// });
