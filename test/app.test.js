const request = require('supertest');
let app = require('../app').app;

describe('Проверка работы системы', function () {
    // case 1
    it('GET main page', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(done)
    })
})