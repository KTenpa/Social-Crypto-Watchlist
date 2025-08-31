const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load test environment variables
dotenv.config({ path: '.env.test' });

const testPool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Verify connection
testPool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to test database:', err);
  } else {
    console.log('Connected to test database');
  }
});

module.exports = testPool;