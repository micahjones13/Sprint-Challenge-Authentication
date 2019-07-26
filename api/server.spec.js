const request = require ('supertest');
const server = require('./server.js');

const db = require('../database/dbConfig.js');







describe('server', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });

  describe('POST /api/register', () => {
    it('return 500 with incorrect submission', async () => {
      const user = { username: 'dummy' };

      return request(server)
        .post('/api/register', user)
        .then(res => {
          expect(res.status).toBe(500);
        });
    });
    it('should return 201 after succesful register', async () => {
      const newUser = {
        username: 'dummy',
        password: 'dummy'
      };

      return request(server)
        .post('/api/register')
        .send(newUser)
        .then(res => {
          expect(res.status).toBe(201);
          
        });
    });
  });

  describe('POST /api/login', () => {
    it('should return 401 with wrong creds entered', async () => {
      const user = {username: 'dummy', password: 'dummy'};
      const newUser = await request(server)
        .post('/api/register')
        .send(user)
        .then(res => console.log(res.body));

      user.password = 'pass'; //changing the pw to be wrong so that it would return a 401

      return request(server)
        .post('/api/login')
        .send(user)
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it('should return 200 with successful login', async () => {
      const user = { username: 'dummy', password: 'dummy' };
      const newUser = await request(server)
        .post('/api/register')
        .send(user)
        .then(res => console.log(res.body));

      return request(server)
        .post('/api/login')
        .send(user)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
  });
});





