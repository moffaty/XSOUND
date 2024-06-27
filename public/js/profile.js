document.addEventListener('DOMContentLoaded', async () => {
    updateAccountImage();
    loadUserInformation();
    const musicList = document.getElementById('music-list');
    const venueList = document.getElementById('venue-list');
    const tracks = await getTracks();
    const venues = await getVenues();
    if (musicList && tracks.length > 0) {
        tracks.forEach((track) => {
            const trackElement = document.createElement('a');
            trackElement.classList.add(
                'list-group-item',
                'list-group-item-action',
                'd-flex',
                'justify-content-between',
                'align-items-center',
            );
            trackElement.target = '_blank';

            const titleElement = document.createElement('span');
            titleElement.textContent = track.title;

            const audioElement = document.createElement('audio');
            audioElement.controls = true;
            audioElement.src = track.src;
            audioElement.classList.add('ms-3');
            audioElement.classList.add('w-100');

            trackElement.appendChild(titleElement);
            trackElement.appendChild(audioElement);
            musicList.appendChild(trackElement);
        });
    }
    if (venueList && venues.length > 0) {
        venues.forEach(async (venue) => {
            const trackElement = document.createElement('a');
            trackElement.classList.add(
                'list-group-item',
                'list-group-item-action',
                'd-flex',
                'justify-content-between',
                'align-items-center',
            );
            trackElement.target = '_blank';
            const titleElement = document.createElement('h3');
            titleElement.textContent = venue.name;
            titleElement.classList.add('m-4');

            const inforElement = document.createElement('div');
            const address = document.createElement('p');
            address.textContent =
                'Адрес:' + (await getAddress(venue.address.x, venue.address.y));
            const capacity = document.createElement('p');
            capacity.textContent = 'Вместимость:' + venue.capacity;
            const info = document.createElement('p');
            info.textContent = 'Доп информация:' + venue.info ? venue.info : '';
            const change = document.createElement('button');
            change.className = 'btn btn-info';
            change.textContent = 'Изменить информацию';

            inforElement.appendChild(address);
            inforElement.appendChild(capacity);
            inforElement.appendChild(info);
            inforElement.appendChild(change);

            trackElement.appendChild(titleElement);
            trackElement.appendChild(inforElement);
            venueList.appendChild(trackElement);
        });
    }
});

async function getTracks() {
    const tracks = await getFetch('/get-tracks');
    return tracks.message;
}