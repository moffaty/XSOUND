// Получаем элемент иконки закрытия чата
const closeChatIcon = document.getElementById('closeChat');
const openChatIcon = document.getElementById('openChat');
const chatCard = closeChatIcon.closest('.card');
const headerChat = document.getElementById('headerChat');
const chatInput = document.getElementById('chatInput');
let chatSend = document.getElementById('button-addon2');
const cardBody = document.getElementById('chat-body');

// Добавляем обработчик события клика на иконку закрытия чата
closeChatIcon.addEventListener('click', () => {
    chatCard.classList.add('transparent');
    chatCard.classList.remove('untransparent');
    openChatIcon.classList.remove('transparent');
    openChatIcon.classList.add('untransparent');
});

openChatIcon.addEventListener('click', () => {
    openChatIcon.classList.remove('untransparent');
    openChatIcon.classList.add('transparent');
    chatCard.classList.remove('transparent');
    chatCard.classList.add('untransparent');
});

function clearChatBody() {
    cardBody.innerHTML = ``;
}

async function updateChat(chat_id, venue_name) {
    const me = await getFetch('/whoami');
    const user_id = me.user_id;
    const messages = await postFetch('/get-messages', { chat_id });
    if (messages.status === 'success') {
        const all_messages = messages.message;
        clearChatBody();
        if (all_messages.length > 0) {
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
                        venue_name,
                        new Date(message.createdAt),
                        message.message,
                    );
                }
            });
            cardBody.scrollTop =
                cardBody.scrollHeight - cardBody.style.height.slice(0, -2);
        }
    }
}

function createUserMessage(username, time, message) {
    const filledMessage = `
    <div class="d-flex justify-content-between">
        <p class="small mb-1 text-muted">${time}</p>
        <p class="small mb-1">${username}</p>
    </div>
    <div class="d-flex flex-row justify-content-end mb-4 pt-1">
        <div>
            <p class="small p-2 me-3 mb-3 text-black rounded-3 bg-warning">${message}</p>
        </div>
        <img src="/img/profile_default.png" alt="avatar 1" style="width: 45px; height: 100%;">
    </div>
    `;
    // Создаем элемент div и добавляем в него содержимое filledMessage
    const messageElement = document.createElement('div');
    messageElement.innerHTML = filledMessage;
    cardBody.appendChild(messageElement);
}

function createResponseMessage(username, time, message) {
    const filledMessage = `
    <div class="d-flex justify-content-between">
        <p class="small mb-1">${username}</p>
        <p class="small mb-1 text-muted">${time}</p>
    </div>
    <div class="d-flex flex-row justify-content-start">
        <img src="/img/icon.png" alt="avatar 1" style="width: 45px; height: 100%;">
        <div>
            <p class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;">${message}</p>
        </div>
    </div>
    `;
    // Создаем элемент div и добавляем в него содержимое filledMessage
    const messageElement = document.createElement('div');
    messageElement.innerHTML = filledMessage;
    cardBody.appendChild(messageElement);
}
