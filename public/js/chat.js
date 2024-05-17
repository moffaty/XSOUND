// Получаем элемент иконки закрытия чата
const closeChatIcon = document.getElementById('closeChat');
const openChatIcon = document.getElementById('openChat');
const chatCard = closeChatIcon.closest('.card');

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
})
