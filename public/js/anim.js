document.querySelector('#gif').height = window.innerHeight
window.onresize = (e) => {
    document.querySelector('#gif').height = window.innerHeight
}

window.addEventListener('load', function () {
    const gif = document.getElementById('gif')
    gif.style.opacity = 1
    gif.style.visibility = 'visible'
    const down = document.getElementById('scroll-indicator')
    down.style.opacity = 1
    down.addEventListener('click', (e) => {
        e.preventDefault()
        window.scrollTo({
            top: window.innerHeight, // Пролистываем на высоту окна
            behavior: 'smooth', // Добавляем плавную анимацию прокрутки
        })
    })
})

window.onscroll = function () {
    scrollFunction()
}

function scrollFunction() {
    const headder = document.querySelector('.navbar')
    const footer = document.querySelector('.footer')
    if (
        document.body.scrollTop > window.innerHeight ||
        document.documentElement.scrollTop > window.innerHeight
    ) {
        headder.classList.remove('transparent')
        footer.classList.remove('transparent')
        headder.classList.add('untransparent')
        footer.classList.add('untransparent')
    } else {
        headder.classList.add('transparent')
        footer.classList.add('transparent')
        headder.classList.remove('untransparent')
        footer.classList.remove('untransparent')
    }
}
