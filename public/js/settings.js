async function loadProfile() {
    await loadUserInformation();
    await loadProfileInformation();
}

async function loadUserInformation() {
    const me = await getFetch('/whoami');
    document.getElementById('username').textContent = me.username;
    document.getElementById('email').textContent = me.email;
}

async function loadProfileInformation() {
    const profile = await postFetch('/profile');
    if (profile.message !== true) {
        document.getElementById('name').value = profile.message.name;
        document.getElementById('surname').value = profile.message.surname;
        document.getElementById('about').value = profile.message.about;
    }
}

async function loading() {
    const loadingSpinnerContainer = document.getElementById(
        'loadingSpinnerContainer',
    );
    const profileContainer = document.getElementById('profile-container');
    await loadProfile();
    loadingSpinnerContainer.classList.remove('untransparent');
    loadingSpinnerContainer.classList.remove('vh-100');
    loadingSpinnerContainer.classList.add('transparent');
    profileContainer.classList.add('untransparent');
    profileContainer.classList.remove('transparent');
}

loading();

const saveChanges = document.getElementById('saveChanges');
saveChanges.addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const about = document.getElementById('about').value;
    const profile = await postFetch('/profile', {
        name,
        surname,
        about,
    });
    if (profile.status === 'success') {
        animateAlert('Профиль успешно обновлен!');
    } else {
        animateAlert('Ошибка во время обновления профиля');
    }
});
