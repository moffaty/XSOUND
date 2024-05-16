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
L.marker([59.9343, 30.334]).addTo(map)
    .bindPopup('Место 1')
    .openPopup();

L.marker([59.955, 30.205]).addTo(map)
    .bindPopup('Место 2')
    .openPopup();

// Добавление маркеров
// let markers = [];
// function addMarker(e) {
//     let marker = L.marker(e.latlng).addTo(map);
//     markers.push(marker);
//     marker.bindPopup('Новый маркер').openPopup();
// }
// map.on('click', addMarker);