import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const slider = new Swiper('.slider', {
    spaceBetween: 15,
    slidesPerView: 3,
    loop: false,
    // speed: 1000,
    // autoplay: {
    //     delay: 4000,
    // },

    pagination: {
        el: '.slider__pagination',
        clickable: true,
        dynamicBullets: true,
        // renderBullet: function (index, className) {
        //     return '<span class="' + className + '">' + (index + 1) + "</span>";
        // },
    },

    navigation: {
        nextEl: '.slider__next',
        prevEl: '.slider__prev',
    },

    // breakpoints: {
    //     576: {
    //         slidesPerView: 2,
    //     },
    //     1024: {
    //         slidesPerView: 3,
    //     },
    // },
});

export default slider;