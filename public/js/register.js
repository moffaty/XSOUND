const form = document.querySelector('.login');
const alertField = document.querySelector('.alert');

let isAnimating = false;

function animateAlert(text) {
    if (isAnimating) return; // Если уже идет анимация, не создавать новую
    isAnimating = true;
    alertField.classList.remove('transparent');
    alertField.classList.add('untransparent');
    alertField.innerHTML = text;
    setTimeout(() => {
        alertField.classList.remove('untransparent');
        alertField.classList.add('transparent');
        isAnimating = false; // Устанавливаем флаг обратно в false после завершения анимации
    }, 5000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.elements['email'].value;
    const password = form.elements['password'].value;
    const confirmPassword = form.elements['confirm-password'].value;
    if (password != confirmPassword) {
        animateAlert('Пароли не совпадают');
        return;
    }
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);
    if (data.status === 'success') {
        window.location = '/login?success=true';
    } else {
        animateAlert(
            data.message +
                '. <a href="/login" class="alert-link">Попробуйте авторизоваться.</a>',
        );
    }
});

const loginButton = document.querySelector('#login');
if (loginButton) {
    loginButton.addEventListener('click', (e) => {
        window.location = '/login';
    });
}
