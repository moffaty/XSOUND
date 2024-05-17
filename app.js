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
const Chat = require(modelDir + '/chat');
const Message = require(modelDir + '/message');
const Organizer = require(modelDir + '/organizer');
const Profile = require(modelDir + '/profile');

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
        console.log(req.body);
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
        const email = req.body.email;
        const username = email.substr(0, email.indexOf('@'));
        const password = req.body.password;
        const role_id = 1;
        // Проверка аутентификации
        const user = await User.findOne({ where: { email } });
        if (user) {
            // Если пользователь найден, проверяем пароль
            if (user.password === password) {
                sendResponse(res, user);
            } else {
                sendMessage(res, false);
            }
        } else {
            // Пользователь с указанным email не найден, регистрируем нового пользователя
            const newUser = await User.create({
                email,
                username,
                password,
                role_id,
            });
            sendResponse(res, newUser);
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

app.route('/profile')
    .get(isAuthenticated, async (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'views', 'profile.html'));
    })
    .post(isAuthenticated, async (req, res) => {
        const name = req.body.name;
        const surname = req.body.surname;
        const about = req.body.about;
        const [profile, created] = await Profile.findOrCreate({
            where: { user_id: req.session.user_id },
            defaults: { user_id: req.session.user_id },
        });
        if (name && surname && about) {
            profile.name = name;
            profile.surname = surname;
            profile.about = about;
            await profile.save();
        }
        sendResponse(res, profile);
    });

app.route('/');

app.route('/settings').get(isAuthenticated, async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'settings.html'));
});

app.route('/event')
    .get(isAuthenticated, async (req, res) => {
        if (req.query.get) {
            const event = await Event.findAll({
                where: { user_id: req.session.user_id },
            });
            let result = [];
            event.forEach((element) => {
                result.push(element);
            });
            sendMessage(res, true, result);
        } else {
            res.sendFile(path.join(__dirname, 'public', 'views', 'event.html'));
        }
    })
    .post(async (req, res) => {
        const venue_id = req.body.venue_id;
        const status_id = 1;
        const name = 'Мероприятие';
        const event = await Event.create({
            name,
            venue_id,
            status_id,
            user_id: req.session.user_id,
        });
        sendResponse(res, event);
    });

app.route('/status').get(async (req, res) => {
    if (req.query.status) {
        const status = await Status.findByPk(req.query.status);
        sendResponse(res, status);
    }
});

app.route('/create-chat-musician').post(isAuthenticated, async (req, res) => {
    // музыкант пишет организатору
    const venue_id = req.body.venue_id;
    if (venue_id === null) {
        res.json({ status: 'error' });
    }
    const organizer = await Organizer.findOne({
        where: { venue_id },
        attributes: ['user_id'],
    });
    const musician = req.session.user_id;
    const [chat, created] = await Chat.findOrCreate({
        where: { user_id_to: organizer.user_id, user_id_from: musician },
        defaults: { user_id_to: organizer.user_id, user_id_from: musician },
    });
    sendResponse(res, chat);
});

app.route('/send-message').post(isAuthenticated, async (req, res) => {
    const user_message = req.body.user_message;
    const user_id_to = req.body.user_id_to;
    const user_id_from = req.body.user_id_from;
    const chat_id = req.body.chat_id;
    if (user_message && user_id_to && user_id_from && chat_id) {
        const message = await Message.create({
            user_id_to,
            user_id_from,
            chat_id,
            message: user_message,
        });
        sendResponse(res, message);
    } else {
        sendMessage(res, false);
    }
});

app.route('/get-messages').post(isAuthenticated, async (req, res) => {
    const chat_id = req.body.chat_id;
    if (chat_id) {
        const message = await Message.findAll({ where: { chat_id } });
        let result = [];
        message.forEach((element) => {
            result.push(element);
        });
        sendMessage(res, true, result);
    } else {
        sendMessage(res, false);
    }
});

app.get('/whoami', (req, res) => {
    res.json({
        email: req.session.email,
        role: req.session.role,
        user_id: req.session.user_id,
        username: req.session.username,
    });
});

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
