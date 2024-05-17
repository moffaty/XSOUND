const fs = require('fs');
const readline = require('readline');
// Определяем директорию моделей
const modelDir = './models';
// Подключаем модели
const User = require(modelDir + '/user');
const Role = require(modelDir + '/roles');
const Event = require(modelDir + '/event');
const EventStatus = require(modelDir + '/eventStatus');
const Musician = require(modelDir + '/musician');
const Genre = require(modelDir + '/genre');
const Venue = require(modelDir + '/venue');
const Organizer = require(modelDir + '/organizer');
const Chat = require(modelDir + '/chat');
const Message = require(modelDir + '/message');
const Profile = require(modelDir + '/profile');

// Подключаем настройки Sequelize
const sequelize = require(modelDir + '/sequelize');

const args = process.argv.slice(2);
console.log(args);
// Интерфейс для чтения ввода пользователя
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function replaceBackup() {
    try {
        // Создаем копию базы данных
        const sourcePath = 'database.sqlite'; // Путь к исходному файлу базы данных
        const backupPath = 'database_backup.sqlite'; // Путь для создания резервной копии
        fs.copyFileSync(sourcePath, backupPath);
        console.log('Резервная копия базы данных успешно создана');
    } catch (error) {
        console.error(
            'Ошибка при пересоздании таблиц или создании копии базы данных:',
            error,
        );
    }
}

async function recreateTables() {
    // Удаляем все существующие таблицы
    await sequelize.drop();

    // Создаем все таблицы заново
    await sequelize.sync({ force: true });

    console.log('Все таблицы успешно пересозданы');
}

async function userInterface() {
    // Запрашиваем подтверждение от пользователя
    if (args[0]) {
        if (args[0] === '-y' || args[0] === '--yes') {
            replaceBackup();
        }
        await recreateTables();
    } else {
        rl.question('Заменить бекап? (yes/no): ', async (answer) => {
            if (
                answer.toLowerCase() === 'yes' ||
                answer.toLowerCase() === 'y'
            ) {
                replaceBackup();
            } else {
                console.log('Бекап не заменяется');
            }

            await recreateTables();
        });
    }
    // Закрываем интерфейс чтения
    rl.close();
}

// Вызываем функцию для пересоздания таблиц
userInterface();
