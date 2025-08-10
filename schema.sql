-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true
);

-- Coins Table
CREATE TABLE coins (
  id TEXT PRIMARY KEY, -- CoinGecko coin ID
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT
);

-- Followers Table
CREATE TABLE followers (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (follower_id, following_id)
);

-- Watchlist Table
CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coin_id TEXT REFERENCES coins(id) ON DELETE CASCADE,
  UNIQUE (user_id, coin_id)
);
