function generateCard(title, text, imageUrl, timestamp) {
    // Создаем элемент карточки
    const card = document.createElement('div');
    card.classList.add('col-md-4'); // Добавляем класс Bootstrap для колонки

    // Создаем разметку карточки
    card.innerHTML = `
        <div class="background-rectangle"></div>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${text}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">${timestamp}</small>
            </div>
        </div>
    `;

    // Возвращаем сгенерированную карточку
    return card;
}

function addCardsToContainer(containerId) {
    const container = document.getElementById(containerId);
    const cardsData = [
        {
            title: 'Card title 1',
            text: 'This card has supporting text below as a natural lead-in to additional content.',
            imageUrl: '...',
            timestamp: 'Last updated 3 mins ago'
        },
        {
            title: 'Card title 1',
            text: 'This card has supporting text below as a natural lead-in to additional content.',
            imageUrl: '...',
            timestamp: 'Last updated 3 mins ago'
        },
        // Добавьте другие объекты данных для других карточек
    ];

    // Создаем и добавляем карточки в контейнер
    cardsData.forEach(data => {
        const card = generateCard(data.title, data.text, data.imageUrl, data.timestamp);
        container.appendChild(card);
    });
}

// Вызываем функцию для добавления карточек в контейнер с указанным id
addCardsToContainer('container');

async function test() {
    const events = await getEvents();
    console.log(events);
}
test();