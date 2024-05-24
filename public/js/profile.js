document.addEventListener('DOMContentLoaded', async () => {
    updateAccountImage();
    loadUserInformation();
    const musicList = document.getElementById('music-list');
    const venueList = document.getElementById('venue-list');
    const tracks = await getTracks();
    const venue = await getFetch('/venue');
    const venues = venue.message;
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
    if(venueList && venues.length > 0) {
        venues.forEach(async (venue) => {
            if (venue.id === 0) {
                return;
            }
            const trackElement = document.createElement('div');
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
            address.textContent = 'Адрес:' + await getAddress(venue.address.x, venue.address.y);
            const capacity = document.createElement('p');
            capacity.textContent = 'Вместимость:' + venue.capacity;
            const info = document.createElement('p');
            info.textContent = 'Доп информация:' + venue.info ? venue.info : '';
            const change = document.createElement('button');
            change.textContent = 'Изменить информацию';
            change.classList.add('me-2', 'btn-warning', 'btn', 'modalButton');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить площадку';
            deleteButton.classList.add('btn', 'btn-secondary', 'modalButton');
            deleteButton.addEventListener('click', () => deleteVenue(venue.id));
            inforElement.appendChild(address);
            inforElement.appendChild(capacity);
            inforElement.appendChild(info);
            inforElement.appendChild(change);
            inforElement.appendChild(deleteButton);

            trackElement.appendChild(titleElement);
            trackElement.appendChild(inforElement);
            venueList.appendChild(trackElement);
        });
        const plus = document.createElement('h1');
        plus.role = 'button';
        plus.classList.add('text-muted');
        plus.classList.add(
            'list-group-item',
            'list-group-item-action',
            'd-flex',
            'flex-column',
            'justify-content-between',
            'align-items-center',
        );
        plus.textContent = '+';
        plus.addEventListener('click', async e => {
            await createVenue();
        });
        venueList.appendChild(plus);
    }
});

async function deleteVenue(venue_id) {
    const result = confirm('Вы уверенны, что хотите удалить площадку?');
    if (result) {
        const data = await postFetch('/delete-venue', { venue_id });
        console.log(data);
    }
    // submitButton.addEventListener('click', async () => {
    //     const date = document.getElementById('schedule').value;
    //     const data = await createEvent(modalButton.id, date);
    //     window.location = '/event';
    // });
}

async function getTracks() {
    const tracks = await getFetch('/get-tracks');
    return tracks.message;
}