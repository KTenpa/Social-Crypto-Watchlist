process.env.NODE_ENV = 'test';

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

const testPool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Global setup for tests
beforeAll(async () => {
  // Drop and recreate users table
  await testPool.query(`
    DROP TABLE IF EXISTS users CASCADE;
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Drop and recreate coins table
  await testPool.query(`
    DROP TABLE IF EXISTS coins CASCADE;
    CREATE TABLE coins (
      id TEXT PRIMARY KEY,
      symbol VARCHAR(20) NOT NULL,
      name VARCHAR(100) NOT NULL,
      image_url TEXT
    )
  `);

  // Add watchlist table
  await testPool.query(`
    DROP TABLE IF EXISTS watchlist CASCADE;
    CREATE TABLE watchlist (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      coin_id TEXT REFERENCES coins(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, coin_id)
    )
  `);

  // Add followers table
  await testPool.query(`
    DROP TABLE IF EXISTS followers CASCADE;
    CREATE TABLE followers (
      id SERIAL PRIMARY KEY,
      follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (follower_id, following_id)
    )
  `);
});

// Clean up after all tests
afterAll(async () => {
  await testPool.query('DROP TABLE IF EXISTS watchlist CASCADE');
  await testPool.query('DROP TABLE IF EXISTS followers CASCADE');
  await testPool.query('DROP TABLE IF EXISTS coins CASCADE');
  await testPool.query('DROP TABLE IF EXISTS users CASCADE');
  await testPool.end();
});
