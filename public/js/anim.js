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