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
const Status = require(modelDir + '/eventStatus');
const Musician = require(modelDir + '/musician');
const Genre = require(modelDir + '/genre');
const Venue = require(modelDir + '/venue');
const Organizer = require(modelDir + '/organizer');

// Используем сессии
app.use(
    session({
        user_id: '',
        username: '',
        role: '',
        email: '',
        secret: secret,
        resave: false,
        isAuth: false,
        cookie: { maxAge: 600000 },
        saveUninitialized: true,
    }),
);

// Middleware функция для проверки аутентификации пользователя
function isAuthenticated(req, res, next) {
    // Проверяем, существует ли username в сессии
    if (req.session.username) {
        // Если пользователь аутентифицирован, передаем управление следующему обработчику
        next();
    } else {
        // Если пользователь не аутентифицирован, перенаправляем на страницу логина
        res.redirect('/login');
    }
}

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

// Отправка данных с модели
function sendResponse(res, model) {
    if (model) {
        sendMessage(res, true, model.dataValues);
    } else {
        sendMessage(res, false);
    }
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.route('/login')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
    })
    .post(async (req, res) => {
        const user = await User.findOne({
            where: { email: req.body.email, password: req.body.password },
        });
        if (user === null) {
            sendMessage(res, false);
        } else {
            req.session.username = user.dataValues.username;
            req.session.role = user.dataValues.role_id;
            req.session.email = user.dataValues.email;
            req.session.user_id = user.dataValues.id;
            sendMessage(res, true);
        }
    });

app.route('/map')
    .get(isAuthenticated, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'views', 'map.html'));
    })
    .post(async (req, res) => {
        if (req.session.username) {
            const venue = await Venue.findAll({
                attributes: ['id', 'name', 'address', 'capacity'],
            });
            let result = [];
            venue.forEach((element) => {
                result.push(element);
            });
            sendMessage(res, true, result);
        } else {
            res.redirect('/login');
        }
    });

app.route('/register')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
    })
    .post(async (req, res) => {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user === null) {
            res.json({ message: 'Аккаунт зарегистрирован' });
        } else {
            res.json({ message: 'Аккаунт с этой почтой уже существует' });
        }
    });

app.route('/venue').post(async (req, res) => {
    const venue_id = req.body.id;
    console.log(venue_id);
    if (venue_id) {
        const venue = await Venue.findByPk(venue_id);
        sendResponse(res, venue);
    }
});

app.route('/event')
    .get(isAuthenticated, async (req, res) => {
        if (req.query.get) {
            const event = await Event.findAll({ where: { user_id: req.session.user_id } });
            let result = [];
            event.forEach((element) => {
                result.push(element);
            });
            sendMessage(res, true, result);
        }
        else {
            res.sendFile(path.join(__dirname, 'public', 'views', 'event.html'));
        }
    })
    .post(async (req, res) => {
        const venue_id = req.body.venue_id;
        const status_id = 1;
        const event = await Event.create({ venue_id, status_id });
        sendResponse(res, event);
    });

app.route('/status')
.get(async (req, res) => {
    if (req.query.status) {
        const status = await Status.findByPk(req.query.status);
        sendResponse(res, status);
    }
})

app.all('/logout', (req, res) => {
    req.session.username = '';
    res.redirect('/');
});

// Для всех urlov что не обработаны
app.get('*', (req, res) => {
    if (req.accepts('html')) {
        res.redirect('/');
        return;
    }
    if (req.accepts('json')) {
        sendMessage(res, false, 'Page Not Found');
        return;
    }
    if (req.accepts('text/plain')) {
        res.send('Not Found');
        return;
    }
});

// Создание всех таблиц
sequelize
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Started http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Ошибка при создании таблиц:', err);
    });
