const authController = require('../../../controllers/authController');
const User = require('../../../models/User');
const testPool = require('../../../config/testDb');

jest.mock('../../../models/User');

describe('Auth Controller', () => {
  afterEach(async () => {
    await testPool.query('DELETE FROM users');
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('should register a new user', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      User.findByEmail.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: new Date()
      });
      User.getSignedJwtToken.mockReturnValue('fake.jwt.token');

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'fake.jwt.token',
        user: expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com'
        })
      });
    });
  });

  describe('login()', () => {
    it('should login an existing user', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        created_at: new Date()
      };

      User.findByEmail.mockResolvedValue(mockUser);
      User.comparePassword.mockResolvedValue(true);
      User.getSignedJwtToken.mockReturnValue('fake.jwt.token');

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'fake.jwt.token',
        user: expect.objectContaining({
          email: 'test@example.com'
        })
      });
    });
  });
});