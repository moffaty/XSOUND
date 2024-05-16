const session = require('express-session');
const express = require('express');
const path = require('path');
const fs = require('fs');
const secret = 'zxc';
const PORT = 3000;
const app = express();

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
const Genre = require(modelDir + '/genre');
const Venue = require(modelDir + '/venue');
const Organizer = require(modelDir + '/organizer');

// Используем сессии
app.use(session({
    username: '',
    role: '',
    secret: secret,
    resave: false,
    isAuth: false,
    cookie: { maxAge: 600000 },
    saveUninitialized: true
}))

// Для отправки сообщений
function sendMessage(res, status, message) {
    if (status) {
        return res.json({ status: 'success', message });
    }
    return res.json({ status: 'error', message });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
})

app.route('/login')
.get((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
})
.post(async (req, res) => {
    console.log(req.body);
    const user = await User.findOne({ where: { email: req.body.email, password: req.body.password }});
    console.log(user);
    if (user === null) {
        sendMessage(res, false, 'Неверно введенные учетные данные');
    }
    else {
        req.session.username = user.dataValues.username;
        req.session.role = user.dataValues.role_id;
        sendMessage(res, true, 'Авторизация прошла успешно!');
    }
});

app.route('/register')
.get((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
})
.post(async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email }});
    if (user === null) {
        console.log('not found');
    }
    else {
        res.json({ message: 'Аккаунт с этой почтой уже существует' });
    }
});

// Создание всех таблиц
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Started http://localhost:${PORT}`);
    })
}).catch(err => {
    console.error('Ошибка при создании таблиц:', err);
});
