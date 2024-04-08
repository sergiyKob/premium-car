const searchBtn = document.querySelector('.header__search');
const searchForm = document.querySelector('.form-search');
const overlay = document.querySelector('.overlay');
const searchBtnIcon = document.querySelector('.header__search-icon use');

searchBtn.addEventListener('click', () => {
    searchForm.classList.toggle('form-search--open');
    overlay.classList.toggle('overlay--active');

    if (searchForm.classList.contains('form-search--open')) {
        searchBtnIcon.setAttribute('xlink:href', 'img/sprite.svg#icon-close');
    } else {
        searchBtnIcon.setAttribute('xlink:href', 'img/sprite.svg#icon-search');
    }
})

overlay.addEventListener('click', () => {
    searchForm.classList.remove('form-search--open');
    overlay.classList.remove('overlay--active');
    searchBtnIcon.setAttribute('xlink:href', 'img/sprite.svg#icon-search');
})