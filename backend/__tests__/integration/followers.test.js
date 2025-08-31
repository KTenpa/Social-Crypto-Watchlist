// const request = require('supertest');
// const app = require('../../app');
// const testPool = require('../../config/testDb');

// describe('Followers API Integration Tests', () => {
//   let user1, user2, token1, token2;

//   beforeAll(async () => {
//     await testPool.query('DELETE FROM followers');
//     await testPool.query('DELETE FROM users');

//     // Register user1
//     let res1 = await request(app)
//       .post('/api/v1/auth/register')
//       .send({ name: 'Alice', email: 'alice@test.com', password: 'test123' });
//     user1 = res1.body.user;
//     token1 = res1.body.token;

//     // Register user2
//     let res2 = await request(app)
//       .post('/api/v1/auth/register')
//       .send({ name: 'Bob', email: 'bob@test.com', password: 'test123' });
//     user2 = res2.body.user;
//     token2 = res2.body.token;
//   });

//   afterEach(async () => {
//     await testPool.query('DELETE FROM followers');
//   });

//   afterAll(async () => {
//     await testPool.end();
//   });

//   it('should allow a user to follow another user', async () => {
//     const res = await request(app)
//       .post('/api/v1/follow')
//       .set('Authorization', `Bearer ${token1}`)
//       .send({ following_id: user2.id });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.success).toBe(true);
//   });

//   it('should get followers of a user', async () => {
//     await request(app)
//       .post('/api/v1/follow')
//       .set('Authorization', `Bearer ${token1}`)
//       .send({ following_id: user2.id });

//     const res = await request(app).get(`/api/v1/follow/${user2.id}/followers`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.length).toBeGreaterThan(0);
//   });
// });


const request = require('supertest');
const app = require('../../app');
const testPool = require('../../config/testDb');

describe('Followers API Integration Tests', () => {
  let user1, user2, token1, token2;

  beforeAll(async () => {
    await testPool.query('DELETE FROM followers');
    await testPool.query('DELETE FROM users');

    // Register user1
    let res1 = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Alice', email: 'alice@test.com', password: 'test123' });
    user1 = res1.body.user;
    token1 = res1.body.token;

    // Register user2
    let res2 = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Bob', email: 'bob@test.com', password: 'test123' });
    user2 = res2.body.user;
    token2 = res2.body.token;
  });

  afterEach(async () => {
    await testPool.query('DELETE FROM followers');
  });

  afterAll(async () => {
    await testPool.query('DELETE FROM users');
    await testPool.end();
  });

  it('should allow a user to follow another user', async () => {
    const res = await request(app)
      .post(`/api/v1/follow/${user2.id}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Followed user');
  });

  it('should get followers of a user', async () => {
    await request(app)
      .post(`/api/v1/follow/${user2.id}`)
      .set('Authorization', `Bearer ${token1}`);

    const res = await request(app)
      .get(`/api/v1/follow/followers/${user2.id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get following list of a user', async () => {
    await request(app)
      .post(`/api/v1/follow/${user2.id}`)
      .set('Authorization', `Bearer ${token1}`);

    const res = await request(app)
      .get(`/api/v1/follow/following/${user1.id}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});