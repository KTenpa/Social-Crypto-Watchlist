// const request = require('supertest');
// const app = require('../../app');
// const testPool = require('../../config/testDb');
// const User = require('../../models/User');
// const Coin = require('../../models/Coins');

// describe('Watchlist API Integration Tests', () => {
//   let authToken;
//   let testUser;

//   beforeAll(async () => {
//     await testPool.query('DELETE FROM watchlist');
//     await testPool.query('DELETE FROM users');
//     await testPool.query('DELETE FROM coins');

//     // Seed a coin
//     await Coin.create({
//       id: 'bitcoin',
//       symbol: 'btc',
//       name: 'Bitcoin',
//       image_url: 'https://bitcoin.org/img.png'
//     });

//     // Register and login a user
//     const res = await request(app)
//       .post('/api/v1/auth/register')
//       .send({ name: 'Watch User', email: 'watch@test.com', password: 'test123' });

//     authToken = res.body.token;
//     testUser = res.body.user;
//   });

//   afterEach(async () => {
//     await testPool.query('DELETE FROM watchlist');
//   });

//   afterAll(async () => {
//     await testPool.end();
//   });

//   it('should add a coin to the user watchlist', async () => {
//     const res = await request(app)
//       .post('/api/v1/watchlist')
//       .set('Authorization', `Bearer ${authToken}`)
//       .send({ coin_id: 'bitcoin' });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.success).toBe(true);
//   });

//   it('should get the user watchlist', async () => {
//     // Insert first
//     await request(app)
//       .post('/api/v1/watchlist')
//       .set('Authorization', `Bearer ${authToken}`)
//       .send({ coin_id: 'bitcoin' });

//     const res = await request(app)
//       .get('/api/v1/watchlist')
//       .set('Authorization', `Bearer ${authToken}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.length).toBeGreaterThan(0);
//     expect(res.body.data[0].coin_id).toBe('bitcoin');
//   });
// });


const request = require('supertest');
const app = require('../../app');
const testPool = require('../../config/testDb');
const Coin = require('../../models/Coins');

describe('Watchlist API Integration Tests', () => {
  let authToken;

  beforeAll(async () => {
    await testPool.query('DELETE FROM watchlist');
    await testPool.query('DELETE FROM users');
    await testPool.query('DELETE FROM coins');

    // Seed a coin
    await Coin.create({
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image_url: 'https://bitcoin.org/img.png'
    });

    // Register and login a user
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Watch User', email: 'watch@test.com', password: 'test123' });

    authToken = res.body.token;
  });

  afterEach(async () => {
    await testPool.query('DELETE FROM watchlist');
  });

  afterAll(async () => {
    await testPool.query('DELETE FROM users');
    await testPool.query('DELETE FROM coins');
    await testPool.end();
  });

  it('should add a coin to the user watchlist', async () => {
    const res = await request(app)
      .post('/api/v1/watchlist')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        coin_id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image_url: 'https://bitcoin.org/img.png'
      }); // ✅ full object

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Coin added to watchlist');
  });

  it('should get the user watchlist', async () => {
    await request(app)
      .post('/api/v1/watchlist')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        coin_id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image_url: 'https://bitcoin.org/img.png'
      });

    const res = await request(app)
      .get('/api/v1/watchlist')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].id).toBe('bitcoin'); // ✅ matches Coin model
  });

  it('should remove a coin from the user watchlist', async () => {
    await request(app)
      .post('/api/v1/watchlist')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        coin_id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image_url: 'https://bitcoin.org/img.png'
      });

    const res = await request(app)
      .delete('/api/v1/watchlist/bitcoin')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Coin removed from watchlist');
  });
});