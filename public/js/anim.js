const gif = document.querySelector('#gif');
if (gif) {
    document.querySelector('#gif').height = window.innerHeight;
    window.onresize = (e) => {
        gif.height = window.innerHeight;
    };
}


window.addEventListener('load', function () {
    if (gif) {
        gif.style.opacity = 1;
        gif.style.visibility = 'visible';
    }
    const down = document.getElementById('scroll-indicator');
    if (down) {
        down.style.opacity = 1;
        down.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: window.innerHeight, // Пролистываем на высоту окна
                behavior: 'smooth', // Добавляем плавную анимацию прокрутки
            });
        });
    }
});
