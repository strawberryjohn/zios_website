(function () {
if (!window.matchMedia('(max-width: 991px)').matches) return;
var mob = window.matchMedia('(max-width: 767px)').matches;
window.addEventListener('load', function () {
var z = window.zMobSlider;
if (typeof Swiper == 'undefined' || !z) return;
var list = document.querySelector('.reviews_list');
var grid = list && list.querySelector('.reviews_grid');
if (grid && grid.children.length > 1) {
list.classList.add('swiper', 'is-slider');
grid.classList.add('swiper-wrapper');
[].forEach.call(grid.children, function (i) { i.classList.add('swiper-slide'); });
var nav = z.bar('m-nav');
nav.insertAdjacentHTML('afterbegin', z.arrow('prev', 'Zurück'));
nav.insertAdjacentHTML('beforeend', z.arrow('next', 'Weiter'));
list.parentNode.insertBefore(nav, list.nextSibling);
z.timer(new Swiper(list, {
slidesPerView: mob ? 1 : 2, spaceBetween: 16, speed: 600,
navigation: { prevEl: nav.querySelector('.is-prev'), nextEl: nav.querySelector('.is-next') }
}), nav.querySelector('.m-nav_fill'));
}
});
})();