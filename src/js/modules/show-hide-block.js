const btn = document.querySelector('[data-btn="btn"]');
const content = document.querySelector('[data-content="content"]');

btn.addEventListener('click', () => {
    if (content.classList.toggle('visible')) {
        btn.textContent = "Сховати"
    } else {
        btn.textContent = "Показати"
    }
})