const User = require('../../../models/User');
const testPool = require('../../../config/testDb');

describe('User Model', () => {
  afterEach(async () => {
    await testPool.query('DELETE FROM users');
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      expect(user).toHaveProperty('id');
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
    });

    it('should hash the password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = await User.create(userData);
      const dbUser = await testPool.query('SELECT password FROM users WHERE id = $1', [user.id]);
      expect(dbUser.rows[0].password).not.toBe(userData.password);
    });
  });

  describe('findByEmail()', () => {
    it('should find a user by email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      await User.create(userData);

      const foundUser = await User.findByEmail(userData.email);
      expect(foundUser.email).toBe(userData.email);
    });
  });

  describe('comparePassword()', () => {
    it('should return true for matching passwords', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await User.prototype.constructor.hashPassword(plainPassword);
      const isMatch = await User.comparePassword(plainPassword, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const hashedPassword = await User.prototype.constructor.hashPassword('password123');
      const isMatch = await User.comparePassword('wrongpassword', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});