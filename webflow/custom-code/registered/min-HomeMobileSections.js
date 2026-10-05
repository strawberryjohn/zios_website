(function () {
if (!window.matchMedia('(max-width: 767px)').matches) return;
window.addEventListener('load', function () {
var prod = document.querySelector('.swiper.products');
if (prod) {
if (prod.swiper) prod.swiper.destroy(true, true);
prod.classList.add('is-stacked');
}
var g = document.querySelector('.greetings_sec');
var label = g && g.querySelector('.greetings_map_label');
var head = g && g.querySelector('.greetings_head');
var lay = g && g.querySelector('.greetings_layout');
if (!label || !head || !lay) return;
function fit() {
head.style.marginBottom = '';
var need = label.getBoundingClientRect().bottom + 32 - lay.getBoundingClientRect().top;
if (need > 0) head.style.marginBottom = (parseFloat(getComputedStyle(head).marginBottom) + need) + 'px';
}
fit();
var t;
window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 150); });
});
})();