let isAnimating = false;
const alertField = document.querySelector('.alert');

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

async function postFetch(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
}

async function getFetch(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getVenues() {
    const data = await postFetch('/map', {});
    if (data.message) {
        return data.message;
    }
}

async function getStatus(status_id) {
    const data = await getFetch(`/status?status=${status_id}`);
    return data.message;
}

async function getVenue(id) {
    const data = await postFetch('/venue', { id });
    return data.message;
}

async function createEvent(venue_id) {
    const data = await postFetch('/event', { venue_id });
    return data.message;
}

async function getEvents() {
    const data = await getFetch('/event?get=1');
    return data.message;
}

function formatDate(date) {
    return String(date).padStart(2, '0');
}

function getDate(time) {
    const date = new Date(time);
    const result = `
    ${formatDate(date.getDate())}.${formatDate(date.getMonth() + 1)}.${date.getFullYear()} 
    ${formatDate(date.getHours())}:${formatDate(date.getMinutes())}:${formatDate(date.getSeconds())}`;
    return result;
}

function getTimeDifferenceInSeconds(startTime) {
    const currentTime = new Date();
    const differenceInMilliseconds = currentTime - new Date(startTime);
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    return differenceInSeconds;
}

function getTimeDifferenceInMinutes(startTime) {
    const differenceInSeconds = getTimeDifferenceInSeconds(startTime);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    return differenceInMinutes;
}

function formatLastUpdateMessage(startTime) {
    const differenceInSeconds = getTimeDifferenceInSeconds(startTime);

    if (differenceInSeconds < 60) {
        return `Последнее обновление: ${differenceInSeconds} ${pluralizeSeconds(differenceInSeconds)} назад`;
    }

    const differenceInMinutes = getTimeDifferenceInMinutes(startTime);

    if (differenceInMinutes < 60) {
        return `Последнее обновление: ${differenceInMinutes} ${pluralizeMinutes(differenceInMinutes)} назад`;
    } else {
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const remainingMinutes = differenceInMinutes % 60;
        return `Последнее обновление: ${differenceInHours} ${pluralizeHours(differenceInHours)} ${remainingMinutes} ${pluralizeMinutes(remainingMinutes)} назад`;
    }
}

function pluralizeHours(hours) {
    if (hours % 10 === 1 && hours % 100 !== 11) return 'час';
    if (
        hours % 10 >= 2 &&
        hours % 10 <= 4 &&
        (hours % 100 < 10 || hours % 100 >= 20)
    )
        return 'часа';
    return 'часов';
}

function pluralizeMinutes(minutes) {
    if (minutes % 10 === 1 && minutes % 100 !== 11) return 'минута';
    if (
        minutes % 10 >= 2 &&
        minutes % 10 <= 4 &&
        (minutes % 100 < 10 || minutes % 100 >= 20)
    )
        return 'минуты';
    return 'минут';
}

function pluralizeSeconds(seconds) {
    if (seconds % 10 === 1 && seconds % 100 !== 11) return 'секунда';
    if (
        seconds % 10 >= 2 &&
        seconds % 10 <= 4 &&
        (seconds % 100 < 10 || seconds % 100 >= 20)
    )
        return 'секунды';
    return 'секунд';
}

async function getAddress(latitude, longitude) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    );
    const data = await response.json();
    return data.display_name;
}
