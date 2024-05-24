document.addEventListener('DOMContentLoaded', async () => {
    updateAccountImage();
    const musicList = document.getElementById('music-list');
    const tracks = await getTracks();
    // const tracks = [
    //     { title: 'Track 1', src: '/upload_tracks/1' },
    //     { title: 'Track 2', src: '/upload_tracks/2' },
    // ];
    if (tracks.length > 0) {
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
});

async function getTracks() {
    const tracks = await getFetch('/get-tracks');
    console.log(tracks);
    return tracks.message;
}
