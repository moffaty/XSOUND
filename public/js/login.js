const form = document.querySelector('.login');
form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.elements['email'].value;
    const password = form.elements['password'].value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    const data = await response.json();
    
})

const registerButton = document.querySelector('#register');
registerButton.addEventListener('click', e => {
    window.location = '/register';
})