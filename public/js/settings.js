async function loadProfile() {
    await loadUserInformation();
    await loadProfileInformation();
    await loadMusicianInformation();
    loadBackgroundImage();
    uploadAccountImage();
    uploadBackgroundImage();
}

function loadBackgroundImage() {}

function uploadAccountImage() {
    document.getElementById('accfileInput').addEventListener('change', (e) => {
        const file = e.target.files[0]; // Получаем выбранный файл

        // Создаем объект FormData и добавляем в него выбранный файл
        const formData = new FormData();
        formData.append('file', file);

        // Выполняем запрос на сервер для загрузки файла
        fetch('/uploadAccount', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    console.log('File uploaded successfully');
                } else {
                    console.error('Failed to upload file');
                }
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    });
}

function uploadBackgroundImage() {
    document.getElementById('bgfileInput').addEventListener('change', (e) => {
        const file = e.target.files[0]; // Получаем выбранный файл

        // Создаем объект FormData и добавляем в него выбранный файл
        const formData = new FormData();
        formData.append('file', file);

        // Выполняем запрос на сервер для загрузки файла
        fetch('/uploadBackground', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    console.log('File uploaded successfully');
                } else {
                    console.error('Failed to upload file');
                }
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    });
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

async function loadMusicianInformation() {
    const musician = await postFetch('/musician');
    if (musician.message !== true) {
        const links = musician.message.links;
        document.getElementById('musician-name').value =
            musician.message.musician_name;
        document.getElementById('links_vk').value = checkUndefined(links.vk);
        document.getElementById('links_ya').value = checkUndefined(links.ya);
        document.getElementById('links_tg').value = checkUndefined(links.tg);
        document.getElementById('links_yt').value = checkUndefined(links.yt);
    }
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
