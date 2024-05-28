const request = require('supertest');
const appModule = require('../app');
let app = appModule.app;

const login = { email: "tst@gmail.com", password: "tst" };
const register = { email: "1tst@gmail.com", password: "1tst" };

describe('Проверка работы системы', function () {
    it('GET: Главная страница', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(done);
    });

    it('POST: Авторизация', function(done) {
        request(app)
            .post('/login')
            .send(login)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .expect((res) => {
                if (res.body.status !== 'success') {
                    throw new Error('Авторизация не прошла');
                }
            })
            .end(done);
    });

    it('POST: Регистрация', function(done) {
        request(app) 
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .expect((res) => {
                if (res.body.status !== 'success') {
                    throw new Error('Регистрация не прошла');
                }
            })
            .end(done);
    });
});