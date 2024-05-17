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

async function getAddress(latitude, longitude) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    return data.display_name;
}

async function fillMap() {
    const venues = await getVenues();
    console.log(venues);
    venues.forEach(element => {
        L.marker([element.address.x, element.address.y]).addTo(map)
            .bindPopup(`<div class="d-flex m-0 p-0 flex-column align-items-center justify-content-center">
            <h4 class="m-0">${element.name} - ${element.capacity}</h4>
            <button type="button" id="${element.id}" class="modalButton btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Подробная информация
            </button>
            </div>`);
    });

    // Обрабатываем события после того, как все маркеры добавлены на карту
    map.on('popupopen', async function(e) {
        const modalButton = e.popup._contentNode.querySelector('.modalButton');
        if (modalButton) {
            modalButton.addEventListener('click', async function() {
                const data = await getVenue(modalButton.id);
                console.log(data);
                const header = document.getElementById('exampleModalLabel');
                const body = document.getElementById('modal-body');
                header.textContent = data.name;
                body.innerHTML = `
                    <p>Вместимость точки: ${data.capacity} </p>
                    <p>Адрес: ${await getAddress(data.address.x, data.address.y)} </p>
                    <p> ${data.info ? 'Дополнительная информация: ' + data.info : ''} </p>
                `;
            });
        }
    });
}

let map = L.map('map', {
    maxBounds: [
        [59.646, 29.298], // Юго-западные координаты Санкт-Петербурга
        [60.115, 30.804]  // Северо-восточные координаты Санкт-Петербурга
    ],
    zoomControl: false,
}).setView([59.9343, 30.534], 11); // Координаты и масштаб по умолчанию

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 11,
}).addTo(map);

// Удаление логотипа Leaflet
map.attributionControl.setPrefix('');

// Перемещение кнопок управления в правый нижний угол
map.addControl(new L.Control.Zoom({ position: 'bottomright' }));

// Добавление маркеров
// L.marker([59.9343, 30.334]).addTo(map)
//     .bindPopup('Место 1')
//     .openPopup();

// L.marker([59.955, 30.205]).addTo(map)
//     .bindPopup('Место 2')
//     .openPopup();
fillMap();
// Добавление маркеров
// let markers = [];
// function addMarker(e) {
//     let marker = L.marker(e.latlng).addTo(map);
//     markers.push(marker);
//     marker.bindPopup('Новый маркер').openPopup();
// }
// map.on('click', addMarker);