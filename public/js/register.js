const form = document.querySelector('.login');
form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.elements['email'].value;
    const password = form.elements['password'].value;
    const confirmPassword = form.elements['confirm-password'].value;
    if (password != confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    const data = await response.json();
    console.log(data);
})

const loginButton = document.querySelector('#login');
loginButton.addEventListener('click', e => {
    window.location = '/login';
})