const session = require('express-session');
const fileUpload = require('express-fileupload');
const handlebars = require('express-handlebars');
const express = require('express');
const path = require('path');
const fs = require('fs');
const secret = 'zxc';
const PORT = 3000;
const app = express();

// Директория для данных пользователя
const user_dir = 'users_img';
// Директория для треков пользователя
const track_dir = 'tracks';
// Директория для изображений
const imgs_dir = 'imgs';
// Имя файлов для аватарок
const img_icon = 'account';
const user_settings = 'settings';
// Имя файлов для бекграундов
const img_back = 'background';

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
const Schedule = require(modelDir + '/schedule');

// Используем сессии
app.use(
    session({
        user_id: '',
        username: '',
        role: '',
        email: '',
        redirect: '',
        secret: secret,
        proxy: true,
        name: 'XSOUND',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 600000,
            secure: false, // Используйте secure: true, если ваш сайт работает по HTTPS
            sameSite: 'strict', // Можно использовать 'strict', 'lax' или 'none'
        },
    })
);

app.set('enable proxy');

app.use(fileUpload());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('views', path.join('public', 'views'));
app.set('view engine', 'handlebars');

app.get('/test', (req, res) => {
    res.render('test');
});
// Middleware функция для проверки аутентификации пользователя
function isAuthenticated(req, res, next) {
    // Проверяем, существует ли username в сессии
    if (req.session.username) {
        // Если пользователь аутентифицирован, передаем управление следующему обработчику
        next();
    } else {
        req.session.redirect = req.route.path;
        // Если пользователь не аутентифицирован, перенаправляем на страницу логина
        res.redirect('/login');
    }
}

function isAdmin(req, res, next) {
    if (req.session.role === 3) {
        next();
    } else {
        req.session.redirect = '/';
        res.redirect('/');
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

function getImage(userId, typeImage) {
    let ext = '';
    let img = '';
    switch (typeImage) {
        case 'account':
            img = img_icon;
            break;
        case 'background':
            img = img_back;
            break;
    }
    const dir = fs.readdirSync(
        path.join(__dirname, user_dir, String(userId), imgs_dir),
    );
    dir.forEach((file) => {
        if (file.startsWith(img)) {
            ext = path.extname(file);
        }
    });

    const directoryPath = '/' + String(userId) + '/' + imgs_dir;
    const fullFileName = img + ext;
    const fullPath = 'file' + directoryPath + '/' + fullFileName;
    console.log(fullPath);
    return fullPath;
}

function getAccountImage(userId) {
    return getImage(userId, 'account');
}

function getBackgroundImage(userId) {
    return getImage(userId, 'background');
}

app.get('/', (req, res) => {
    res.render('home', { scroll: true, index: true });
    // res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/about', (req, res) => {
    res.render('about', { about: true });
    // res.sendFile(path.join(__dirname, 'public', 'views', 'about.html'));
});

app.get('/get-redirect', (req, res) => {
    if (req.session.redirect) {
        sendMessage(res, true, req.session.redirect);
    } else {
        sendMessage(res, true, '/map');
    }
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
            if (req.session.role === 3) {
                req.session.redirect = '/admin/page';
            }
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
    if (venue_id) {
        const venue = await Venue.findByPk(venue_id);
        sendResponse(res, venue);
    }
});

app.route('/profile')
    .get(isAuthenticated, async (req, res) => {
        if (req.query.card) {
            try {
                const card = Number(req.query.card);
                const musician = await Musician.findByPk(card);
                if (musician) {
                    res.render('card', { data: musician.dataValues });
                }
                else {
                    res.redirect('/');
                }
            }
            catch (err) {
                res.redirect('/');
            }
        }
        else {
            if (req.session.role === 1) {
                res.sendFile(
                    path.join(
                        __dirname,
                        'public',
                        'views',
                        'musician-profile.html',
                    ),
                );
            } else {
                res.sendFile(
                    path.join(
                        __dirname,
                        'public',
                        'views',
                        'organizer-profile.html',
                    ),
                );
            }
        }
    })
    .post(isAuthenticated, async (req, res) => {
        const name = req.body.name;
        const surname = req.body.surname;
        const about = req.body.about;
        const musicianName = req.body.musicianName;
        const links = req.body.links;
        const [profile, created] = await Profile.findOrCreate({
            where: { user_id: req.session.user_id },
            defaults: { user_id: req.session.user_id },
        });
        const [musician, createdMusician] = await Musician.findOrCreate({
            where: { user_id: req.session.user_id },
            defaults: { user_id: req.session.user_id },
        });
        if (musicianName) {
            musician.musician_name = musicianName;
            await musician.save();
        }
        if (links) {
            musician.links = JSON.parse(links);
            await musician.save();
        }
        if (name && surname && about) {
            profile.name = name;
            profile.surname = surname;
            profile.about = about;
            await profile.save();
        }
        sendResponse(res, profile);
    });

app.post('/musician', isAuthenticated, async (req, res) => {
    const user_id = req.session.user_id;
    const musician = await Musician.findOne({ where: { user_id } });
    sendResponse(res, musician);
});

app.route('/settings').get(isAuthenticated, async (req, res) => {
    if (req.session.role === 1) {
        res.sendFile(path.join(__dirname, 'public', 'views', 'settings.html'));
    }
    else {
        res.sendFile(path.join(__dirname, 'public', 'views', 'settings_organizer.html'));
    }
});

app.post('/schedule', isAuthenticated, async (req, res) => {
    const venue_id = req.body.venue_id;
    const schedule = await Schedule.findAll({ where: { venue_id } });
    let result = [];
    schedule.forEach((element) => {
        result.push(element);
    });
    console.log(result);
    sendMessage(res, true, result);
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
            if (req.session.role === 1) {
                res.sendFile(path.join(__dirname, 'public', 'views', 'event.html'));
            }
            else {
                res.sendFile(path.join(__dirname, 'public', 'views', 'event_organizer.html'));
            }
        }
    })
    .post(isAuthenticated, async (req, res) => {
        const venue_id = req.body.venue_id;
        const date = req.body.date;
        const status_id = 1;
        const name = 'Мероприятие';
        const event = await Event.create({
            name,
            venue_id,
            status_id,
            date,
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

app.route('/upload_tracks').post(isAuthenticated, async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // добавить надо в бд, чтобы в списке показывалось, а в итоге просто директорию считает

    console.log('FILE');
    const music = req.files.music;
    const directoryPath = path.join(
        __dirname,
        user_dir,
        String(req.session.user_id),
        track_dir,
    );

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true }); // creates directory and any necessary subdirectories
    }

    music.mv(path.join(directoryPath, music.name), function (err) {
        if (err) return res.status(500).send(err);

        res.redirect('/profile');
    });
});

app.route('/colors')
    .post(isAuthenticated, (req, res) => {
        const directoryPath = path.join(
            __dirname,
            user_dir,
            String(req.session.user_id),
            user_settings,
        );
        console.log(directoryPath);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true }); // creates directory and any necessary subdirectories
        }
        const colors = req.body.colors;
        fs.writeFileSync(
            path.join(directoryPath, 'color.json'),
            JSON.stringify(colors),
        );
    })
    .get(isAuthenticated, (req, res) => {
        try {
            const directoryPath = path.join(
                __dirname,
                user_dir,
                String(req.session.user_id),
                user_settings,
            );
            const data = fs.readFileSync(
                path.join(directoryPath, 'color.json'),
            );
            sendMessage(res, true, JSON.parse(data.toString()));
        } catch (err) {
            sendMessage(res, false, err);
        }
    });

app.post('/upload/:type', isAuthenticated, async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const icon = req.files.file;
    const fileName = icon.name;
    const directoryPath = path.join(
        __dirname,
        user_dir,
        String(req.session.user_id),
        imgs_dir,
    );

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true }); // creates directory and any necessary subdirectories
    }

    const type = req.params.type;
    let fileType = '';
    switch (type) {
        case 'account':
            fileType = img_icon;
            break;
        case 'background':
            fileType = img_back;
            break;
    }

    const fullFileName =
        fileType + fileName.substr(fileName.lastIndexOf('.'), fileName.length);

    const dir = fs.readdirSync(directoryPath);
    dir.forEach((file) => {
        if (file.startsWith(fileType)) {
            fs.unlinkSync(path.join(directoryPath, file));
        }
    });

    icon.mv(path.join(directoryPath, fullFileName), function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });
});

app.get('/get_image/:typeImage', isAuthenticated, (req, res) => {
    const typeImage = req.params.typeImage;
    switch (typeImage) {
        case 'account':
            try {
                const fullPath = getAccountImage(req.session.user_id);
                sendMessage(res, true, fullPath);
            } catch (err) {
                sendMessage(res, false, err);
            }
            break;
        case 'background':
            try {
                const fullPath = getBackgroundImage(req.session.user_id);
                sendMessage(res, true, fullPath);
            } catch (err) {
                sendMessage(res, false, err);
            }
            break;
    }
});

app.get('/get-tracks', isAuthenticated, (req, res) => {
    try {
        let list = [];
        const fullPath = path.join(
            __dirname,
            user_dir,
            String(req.session.user_id),
            track_dir,
        );
        const dir = fs.readdirSync(fullPath);
        dir.forEach((file) => {
            list.push({
                title: file,
                src:
                    '/file/' +
                    req.session.user_id +
                    '/' +
                    track_dir +
                    '/' +
                    file,
            });
        });
        sendMessage(res, true, list);
    } catch (err) {
        sendMessage(res, false, err);
    }
});

app.get(`/file/:userId/:folder/:filename`, isAuthenticated, (req, res) => {
    if (req.session.redirect === '/:userId/:filename') {
        req.session.redirect = '/profile';
        return res.redirect('/profile');
    }
    const dirPath = path.join(
        __dirname,
        user_dir,
        req.params.userId,
        req.params.folder,
    );
    console.log(dirPath);
    console.log(req.params.filename);
    if (fs.existsSync(path.join(dirPath, req.params.filename))) {
        res.sendFile(path.join(dirPath, req.params.filename));
    } else {
        res.sendFile(path.join(__dirname, user_dir, '0', 'account.png'));
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

app.get('/roles', isAdmin, async (req, res) => {
    const role = await Role.findAll();
    let result = [];
    role.forEach((element) => {
        result.push(element);
    });
    sendMessage(res, true, result);
});

app.route('/admin/:model/:type/:id')
    .get(isAdmin, async (req, res) => {
        const model = req.params.model;
        const type = req.params.type;
        const id = req.params.id;

        // Маппинг моделей на соответствующие классы
        const modelMap = {
            'user': User,
            'venue': Venue,
        };

        if (modelMap.hasOwnProperty(model)) {
            const Model = modelMap[model];
            if (type === 'update' || type === 'delete') {
                if (id) {
                    try {
                        const instance = await Model.findByPk(id);
                        if (instance) {
                            if (type === 'update') {
                                sendMessage(res, true, instance);
                            } else {
                                await instance.destroy();
                                sendMessage(res, true);
                            }
                        } else {
                            sendMessage(res, false, 'Instance not found');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        sendMessage(res, false, 'Error occurred');
                    }
                } else {
                    sendMessage(res, false, 'Invalid ID');
                }
            } else {
                sendMessage(res, false, 'Invalid operation type');
            }
        } else {
            sendMessage(res, false, 'Invalid model');
        }
    })
    .post(isAdmin, async (req, res) => {
        if (req.params.type === 'update') {
            const id = req.params.id;
            if (id) {
                switch (req.params.model) {
                    case 'user':
                        const user = await User.findByPk(id);
                        const username = req.body.username;
                        const password = req.body.password;
                        const email = req.body.email;
                        if (username && password && email) {
                            user.email = email;
                            user.password = password;
                            user.username = username;
                            user.save();
                        }
                        break;
                    case 'venue':
                        const venue = await Venue.findByPk(id);
                        const name = req.body.name;
                        const capacity = req.body.capacity;
                        const info = req.body.info;
                        if (name && capacity && info) {
                            venue.name = name;
                            venue.capacity = capacity;
                            venue.info = info;
                            venue.save();
                        }
                        break;
                }

            }
            sendMessage(res, true);
        } else {
            sendMessage(req, false);
        }
    });

app.route('/admin/:type').get(isAdmin, async (req, res) => {
    if (req.params.type === 'page') {
        res.render('admin', { page: true });
    } else if (req.params.type === 'users') {
        const users = await User.findAll();
        let result = [];
        users.forEach((element) => {
            if (element.id !== req.session.user_id) {
                result.push(element);
            }
        });
        res.render('admin', {
            users: result,
            pageName: 'Изменить информацию о пользователе',
        });
    } else if (req.params.type === 'venues') {
        const venue = await Venue.findAll();
        let result = [];
        venue.forEach((element) => {
            if (element.id !== req.session.user_id) {
                result.push(element);
            }
        });
        res.render('admin', {
            venues: result,
            pageName: 'Изменить информацию о площадках',
        });
    }
});

app.all('/logout', (req, res) => {
    req.session.email = '';
    req.session.user_id = '';
    req.session.username = '';
    req.session.role_id = '';
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

// for tests
module.exports.app = app;
