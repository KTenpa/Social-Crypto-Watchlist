const request = require('supertest');
const app = require('../../app');
const testPool = require('../../config/testDb');
const Coin = require('../../models/Coins');

describe('Coins API Integration Tests', () => {
  beforeAll(async () => {
    await testPool.query('DELETE FROM coins');
  });

  afterEach(async () => {
    await testPool.query('DELETE FROM coins');
  });

  afterAll(async () => {
    await testPool.end();
  });

  describe('GET /api/v1/coins/search/:query', () => {
    it('should search coins from CoinGecko', async () => {
      const res = await request(app)
        .get('/api/v1/coins/search/bitcoin');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('coins');
    });
  });

  describe('GET /api/v1/coins', () => {
    it('should get all coins from database', async () => {
      // Add test coin
      await Coin.create({
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image_url: 'https://bitcoin.org/image.png'
      });

      const res = await request(app)
        .get('/api/v1/coins');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe('bitcoin');
    });
  });

  // Add more tests for other endpoints
});