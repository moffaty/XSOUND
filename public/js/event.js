function generateCard(title, text, status, venue_id, imageUrl, timestamp) {
    // Создаем элемент карточки
    const card = document.createElement('div');
    card.classList.add('col-md-4'); // Добавляем класс Bootstrap для колонки
    card.classList.add('mt-4'); // Добавляем класс Bootstrap для колонки

    // Создаем разметку карточки
    card.innerHTML = `
        <div class="background-rectangle"></div>
        <div class="card st-${status}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">${title}</h5>
                    <button id="venue-${venue_id}" data-venue="${venue_id}" class="chat-venue m-1 btn btn-dark">Связаться с площадкой</button>
                </div>
                <p class="card-text">${text}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted">${timestamp}</small>
            </div>
        </div>
    `;

    const chatButton = card.querySelector('.chat-venue');
    chatButton.addEventListener('click', async (e) => {
        if (openChatIcon) {
            openChatIcon.click();
        }
        const me = await getFetch('/whoami');
        const user_id = me.user_id;
        const data = await postFetch('/create-chat-musician', {
            venue_id: chatButton.dataset.venue,
        });
        const user_id_from = data.message.user_id_from;
        const user_id_to = data.message.user_id_to;
        const chat_id = data.message.id;
        const messages = await postFetch('/get-messages', { chat_id });
        const venue = await getVenue(chatButton.dataset.venue);
        if (messages.status === 'success') {
            const all_messages = messages.message;
            all_messages.forEach((message) => {
                console.log(message);
                if (message.user_id_from == user_id) {
                    createUserMessage(
                        me.username,
                        getDate(message.createdAt),
                        message.message,
                    );
                } else {
                    createResponseMessage(
                        venue.name,
                        new Date(message.createdAt),
                        message.message,
                    );
                }
            });
        }
        if (data.status === 'success') {
            headerChat.textContent += ' с ' + venue.name;
            chatSend.addEventListener('click', async (e) => {
                const user_message = chatInput.value;
                const message = await postFetch('/send-message', {
                    user_message,
                    user_id_from,
                    user_id_to,
                    chat_id,
                });
                console.log(message);
            });
        }
    });

    // Возвращаем сгенерированную карточку
    return card;
}

async function addCardsToContainer(containerId) {
    const container = document.getElementById(containerId);
    const events = await getEvents();

    // Создаем массив промисов для всех асинхронных операций внутри forEach
    const cardsDataPromises = events.map(async (event) => {
        const status = await getStatus(event.status_id);
        const venue = await getVenue(event.venue_id);
        const venue_name = venue.name;
        const status_name = status.status_name;
        console.log(status_name);
        const cardText = `
            <p>Статус: ${status_name}</p>
            <p>Площадка: ${venue_name}</p>     
            <p></p>       
        `;
        const card = {
            title: `${event.name}`,
            venue_id: venue.id,
            text: cardText,
            status: status.status_id,
            imageUrl: '...',
            timestamp: formatLastUpdateMessage(event.updatedAt),
        };
        return card; // Возвращаем объект карточки как результат промиса
    });

    // Дожидаемся выполнения всех промисов и получаем массив объектов карточек
    const cardsData = await Promise.all(cardsDataPromises);

    // Создаем и добавляем карточки в контейнер
    cardsData.forEach((data) => {
        const card = generateCard(
            data.title,
            data.text,
            data.status,
            data.venue_id,
            data.imageUrl,
            data.timestamp,
        );
        container.appendChild(card);
    });
}

// Вызываем функцию для добавления карточек в контейнер с указанным id
addCardsToContainer('container');
