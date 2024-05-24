async function loadProfile() {
    await loadUserInformation();
    await loadProfileInformation();
    await loadMusicianInformation();
    loadBackgroundImage();
    uploadAccountImage();
    changeMainColor();
    uploadBackgroundImage();
    await updateAccountImage();
    await updateBackgroundImage();
    await updateColors();
}

function loadBackgroundImage() {}

function uploadAccountImage() {
    console.log(document.getElementById('accountImage'));
    document.getElementById('accountImage').addEventListener('change', (e) => {
        const file = e.target.files[0]; // Получаем выбранный файл

        // Создаем объект FormData и добавляем в него выбранный файл
        const formData = new FormData();
        formData.append('file', file);

        // Выполняем запрос на сервер для загрузки файла
        fetch('/upload/account', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    console.log('File uploaded successfully');
                    updateAccountImage();
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
        fetch('/upload/background', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    updateBackgroundImage();
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
        if (musician.message.musician_name) {
            document.getElementById('musician-name').value =
            musician.message.musician_name;
        }
        if (links) {
            document.getElementById('links_vk').value = checkUndefined(links.vk);
            document.getElementById('links_ya').value = checkUndefined(links.ya);
            document.getElementById('links_tg').value = checkUndefined(links.tg);
            document.getElementById('links_yt').value = checkUndefined(links.yt);
        }
    }
}

async function changeMainColor() {
    const colorInput = document.getElementById('colorInput');
    if (colorInput) {
        colorInput.addEventListener('change', async e => {
            const color = (hex2rgb(colorInput.value));
            const root = document.documentElement;
            const mainColor = `rgb(${color.r},${color.g},${color.b})`;
            const hoverColor = `rgb(${color.r + 12},${color.g - 5},${color.b - 23})`;
            const lightColor = `rgb(${color.r + 90},${color.g + 60},${color.b + 80})`;
            root.style.setProperty('--main-color', mainColor);
            root.style.setProperty('--hover-color', hoverColor);
            root.style.setProperty('--light-color', lightColor);
            const data = await postFetch('/colors', { colors: { mainColor, hoverColor, lightColor }});
            console.log(data);
        })
    }
}

async function updateColors() {
    const colors = await getFetch('/colors');
    const root = document.documentElement;
    root.style.setProperty('--main-color', colors.message.mainColor);
    root.style.setProperty('--hover-color', colors.message.hoverColor);
    root.style.setProperty('--light-color', colors.message.lightColor);
    const colorInput = document.getElementById('colorInput');
    if (colorInput) {
        const color = colors.message.mainColor;
        if (color) {
            const rgb = color.substring(color.indexOf('(') + 1, color.length - 1).split(',');
            colorInput.value = rgb2hex(rgb[0], rgb[1], rgb[2]);
        }
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
