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
    email: '',
    secret: secret,
    resave: false,
    isAuth: false,
    cookie: { maxAge: 600000 },
    saveUninitialized: true
}))

// Для отправки сообщений
function sendMessage(res, status, message = '') {
    if (message == '') {
        message = status;
    }
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
    if (user === null) {
        sendMessage(res, false);
    }
    else {
        req.session.username = user.dataValues.username;
        req.session.role = user.dataValues.role_id;
        req.session.email = user.dataValues.email;
        sendMessage(res, true);
    }
});

app.route('/map')
.get((req, res) => {
    if (req.session.username) {
        res.sendFile(path.join(__dirname, 'public', 'views', 'map.html'));
    }
    else {
        res.redirect('/login');
    }
});

app.route('/register')
.get((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
})
.post(async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email }});
    if (user === null) {
        res.json({ message: 'Аккаунт зарегистрирован' });
    }
    else {
        res.json({ message: 'Аккаунт с этой почтой уже существует' });
    }
});

app.all('/logout', (req, res) => {
    req.session.username = '';
    res.redirect('/');
})

// Для всех urlov что не обработаны
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
}) 

// Создание всех таблиц
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Started http://localhost:${PORT}`);
    })
}).catch(err => {
    console.error('Ошибка при создании таблиц:', err);
});
