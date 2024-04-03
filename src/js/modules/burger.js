const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
const body = document.querySelector('.body');
const link = document.querySelectorAll('.menu__link');

burger.addEventListener('click', () => {
    burger.classList.toggle('is-active')
    menu.classList.toggle('is-open')
    body.classList.toggle('lock')
});

link.forEach(el => {
    el.addEventListener('click', (e) => {
        burger.classList.remove('is-active')
        menu.classList.remove('is-open')
        body.classList.remove('lock')
    })
})

export default burger;