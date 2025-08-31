const request = require('supertest');
const app = require('../../app');
const testPool = require('../../config/testDb');
const User = require('../../models/User');

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    // Ensure the test database is clean before starting
    await testPool.query('DELETE FROM users');
  });

  afterEach(async () => {
    // Clean up after each test
    await testPool.query('DELETE FROM users');
  });

  afterAll(async () => {
    // Close the database connection
    await testPool.end();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Integration Test User',
        email: 'integration@test.com',
        password: 'testpassword'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(userData.email);

      // Verify the user exists in the database
      const dbUser = await User.findByEmail(userData.email);
      expect(dbUser).toBeTruthy();
      expect(dbUser.email).toBe(userData.email);
    });

    it('should not register with duplicate email', async () => {
      const userData = {
        name: 'Integration Test User',
        email: 'duplicate@test.com',
        password: 'testpassword'
      };

      // First registration
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      // Second registration with same email
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('already exists');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const userData = {
      name: 'Login Test User',
      email: 'login@test.com',
      password: 'loginpassword'
    };

    beforeEach(async () => {
      // Register a user to test login
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(userData.email);
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'anypassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    const userData = {
      name: 'Me Test User',
      email: 'me@test.com',
      password: 'mepassword'
    };

    let authToken;

    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      authToken = loginRes.body.token;
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.email).toBe(userData.email);
    });

    it('should not get current user without token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me');

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });

    it('should not get current user with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
});