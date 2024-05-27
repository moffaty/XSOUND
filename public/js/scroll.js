window.onscroll = function () {
    scrollFunction();
};

function setTransparent() {
    const nav = document.querySelector('nav');
    nav.classList.add('transparent');
}

setTransparent();


function scrollFunction() {
    const headder = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');
    if (
        document.body.scrollTop > window.innerHeight ||
        document.documentElement.scrollTop > window.innerHeight
    ) {
        headder.classList.remove('transparent');
        footer.classList.remove('transparent');
        headder.classList.add('untransparent');
        footer.classList.add('untransparent');
    } else {
        headder.classList.add('transparent');
        footer.classList.add('transparent');
        headder.classList.remove('untransparent');
        footer.classList.remove('untransparent');
    }
}
