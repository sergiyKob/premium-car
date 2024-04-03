
const tabButtons = document.querySelectorAll('[data-tab]');
const tabContents = document.querySelectorAll('[data-content]');

tabButtons.forEach(function (item) {
    item.addEventListener('click', function () {
        tabButtons.forEach(function (item) {
            item.classList.remove('tabs__btn--active');
        })
        this.classList.add('tabs__btn--active');

        const tabCurrent = this.dataset.tab
        tabContents.forEach(function (item) {
            item.classList.remove('tabs__content--active');
        })
        const tabContent = document.querySelector(`[data-content="${tabCurrent}"]`);
        tabContent.classList.add('tabs__content--active');
    })
})