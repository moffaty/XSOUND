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
    console.log(data);
    return data.message;
}

// в минутах
function diffTime(specifiedTimeStr) {
    const specifiedTime = new Date(specifiedTimeStr);
    // Текущее время
    const currentTime = new Date();
    // Разница в миллисекундах
    const differenceInMilliseconds = currentTime - specifiedTime;
    // Преобразование разницы в минуты
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 60000);
    return differenceInMinutes;
}

async function getAddress(latitude, longitude) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    );
    const data = await response.json();
    return data.display_name;
}