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

// Используем сессии
app.use(session({
    username: '',
    position: '',
    file: '',
    secret: secret,
    resave: false,
    isAuth: false,
    cookie: { maxAge: 600000 },
    saveUninitialized: true
}))

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.route('/login')
.get((req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
})
.post((req, res) => {
    console.log(req.body);
});

app.route('/register')
.get((req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Создание всех таблиц
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Started http://localhost:${PORT}`);
    })
}).catch(err => {
    console.error('Ошибка при создании таблиц:', err);
});
