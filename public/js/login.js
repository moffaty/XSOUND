const form = document.querySelector('.login');
const alertField = document.querySelector('.alert');

let isAnimating = false;

async function getFetch(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getRedirect() {
    const data = await getFetch('/get-redirect');
    return data.message;
}

function animateAlert(text) {
    if (isAnimating) return; // Если уже идет анимация, не создавать новую
    isAnimating = true;
    alertField.classList.remove('transparent');
    alertField.classList.add('untransparent');
    alertField.innerHTML = text;
    setTimeout(() => {
        alertField.classList.remove('untransparent');
        alertField.classList.add('transparent');
        isAnimating = true; // Устанавливаем флаг обратно в false после завершения анимации
    }, 5000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.elements['email'].value;
    const password = form.elements['password'].value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);
    if (!data.message) {
        animateAlert('Учетные данные введены неверно. Попробуйте снова');
    } else {
        const redirectUrl = await getRedirect();
        window.location = redirectUrl;
    }
});

const registerButton = document.querySelector('#register');
registerButton.addEventListener('click', (e) => {
    window.location = '/register';
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const referrer = document.referrer;
if (
    urlParams.get('success') &&
    referrer.substring(
        referrer.lastIndexOf('/'),
        referrer.length === '/register',
    )
) {
    animateAlert('Авторизация прошла успешно! Авторизируйтесь для продолжения');
}
