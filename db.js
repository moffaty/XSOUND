// Заполнение таблицы
// Определяем директорию моделей
const modelDir = './models';

// Подключаем настройки Sequelize
const sequelize = require(modelDir + '/sequelize');

// Подключаем модели
const User = require(modelDir + '/user');
const Role = require(modelDir + '/roles');
const Event = require(modelDir + '/event');
const EventStatus = require(modelDir + '/eventStatus');
const Musician = require(modelDir + '/musician');
const Organizer = require(modelDir + '/organizer');
const Genre = require(modelDir + '/genre');
const Venue = require(modelDir + '/venue');
const Chat = require(modelDir + '/chat');
const Message = require(modelDir + '/message');
const Profile = require(modelDir + '/profile');
const Schedule = require(modelDir + '/schedule');

const chats = [{ user_id_to: 1, user_id_from: 2 }];

const messages = [
    {
        user_id_to: 1,
        user_id_from: 2,
        chat_id: 1,
        message: 'Hello! How are you?',
    },
    {
        user_id_to: 2,
        user_id_from: 1,
        chat_id: 1,
        message: "I'm fine! Thanks =)",
    },
];

const genres = [
    { genre_name: 'Рок' },
    { genre_name: 'Поп' },
    { genre_name: 'Техно' },
    { genre_name: 'Реп' },
];

const eventStatus = [
    { status_name: 'Предложен' },
    { status_name: 'Начат' },
    { status_name: 'В обработке' },
    { status_name: 'Завершен' },
    { status_name: 'Закрыт' },
];

const roles = [
    { role_name: 'Музыкант' },
    { role_name: 'Организатор' },
    { role_name: 'Администратор' },
];

const users = [
    { username: 'tst', password: 'tst', email: 'tst@gmail.com', role_id: 1 },
    { username: 'zxc', password: 'zxc', email: 'zxc@gmail.com', role_id: 2 },
    { username: 'yee', password: 'yee', email: 'yee@gmail.com', role_id: 2 },
    { username: 'qwe', password: 'qwe', email: 'qwe@gmail.com', role_id: 3 },
];

const musicians = [
    {
        user_id: 1,
        musician_name: 'TTT',
        genre_id: 1,
        links: { vk: 'ToToTo', tg: '123' },
    },
];

const venues = [
    {
        name: 'Baaar',
        address: { x: 59.955, y: 30.205 },
        capacity: 50,
        info: 'Классное место!',
    },
    {
        name: 'Cluub',
        address: { x: 59.934, y: 30.334 },
        capacity: 110,
        info: 'Улёт!)',
    },
    {
        name: 'Арка',
        address: { x: 59.914, y: 30.324 },
        capacity: 310,
        info: 'Уютненько',
    },
    {
        name: 'Nigth',
        address: { x: 59.912, y: 30.314 },
        capacity: 165,
        info: 'Club',
    },
    {
        name: 'Окна',
        address: { x: 60.004, y: 30.134 },
        capacity: 500,
        info: 'Просторно',
    },
];

const organizers = [
    { user_id: 2, organizer_name: 'NOO', venue_id: 1, phone: '+79770027002' },
    { user_id: 3, organizer_name: 'YEE', venue_id: 2, phone: '+79770027002' },
];

const events = [
    { name: 'Party1', venue_id: 1, user_id: 1, status_id: 1 },
    { name: 'Party2', venue_id: 1, user_id: 1, status_id: 2 },
    { name: 'Party3', venue_id: 1, user_id: 1, status_id: 3 },
    { name: 'Party4', venue_id: 2, user_id: 1, status_id: 4 },
];

const profiles = [
    { name: 'Egor', surname: 'Shestakov', about: 'Coolest guy)', user_id: 1 },
];

const schedules = [
    { date: new Date('11.09.2009 16:14'), venue_id: 1 },
    { date: new Date('12.09.2009 16:00'), venue_id: 1 },
    { date: new Date('11.09.2009 17:14'), venue_id: 2 },
    { date: new Date('14.09.2009 17:14'), venue_id: 2 },
];

async function fillTables() {
    await Chat.bulkCreate(chats);
    await Message.bulkCreate(messages);
    await Genre.bulkCreate(genres);
    await EventStatus.bulkCreate(eventStatus);
    await Role.bulkCreate(roles);
    await User.bulkCreate(users);
    await Musician.bulkCreate(musicians);
    await Venue.bulkCreate(venues);
    await Organizer.bulkCreate(organizers);
    await Event.bulkCreate(events);
    await Profile.bulkCreate(profiles);
    await Schedule.bulkCreate(schedules);
}

fillTables();
