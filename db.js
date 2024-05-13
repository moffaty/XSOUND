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

const genres = [
    { genre_name: 'Рок' },
    { genre_name: 'Поп' },
    { genre_name: 'Техно' },
    { genre_name: 'Реп' },
]

const eventStatus = [
    { status_name: 'Начат' },
    { status_name: 'В обработке' },
    { status_name: 'Завершен' },
    { status_name: 'Закрыт' },
]

const roles = [
    { role_name: 'Музыкант' },
    { role_name: 'Организатор' },
    { role_name: 'Администратор' },
]

const users = [
    { username: 'tst', password: 'tst', email: 'tst@gmail.com', role_id: 1 },
    { username: 'zxc', password: 'zxc', email: 'zxc@gmail.com', role_id: 2 },
    { username: 'qwe', password: 'qwe', email: 'qwe@gmail.com', role_id: 3 },
]

const musicians = [
    { user_id: 1, musician_name: 'TTT', genre_id: 1, repertoire: { songs: 'ToToTo' } },
]

const venues = [
    { name: 'Baaar', address: 'strret 1', capacity: 50 }, 
    { name: 'Cluub', address: 'strret 2', capacity: 110 }, 
    { name: 'Aroun', address: 'strret 3', capacity: 20 }, 
]

const organizers = [
    { user_id: 2, organizer_name: 'NOO', venue_id: 1, phone: '+79770027002' }
]

const events = [
    { name: 'Party', datetime: new Date(), venue_id: 1, status_id: 1 }
]

async function fillTables() {
    await Genre.bulkCreate(genres);
    await EventStatus.bulkCreate(eventStatus);
    await Role.bulkCreate(roles);
    await User.bulkCreate(users);
    await Musician.bulkCreate(musicians);
    await Venue.bulkCreate(venues);
    await Organizer.bulkCreate(organizers);
    await Event.bulkCreate(events);
}

fillTables();