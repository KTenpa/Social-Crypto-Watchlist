CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true
);

CREATE TABLE coins (
    id TEXT PRIMARY KEY, -- CoinGecko coin ID
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    image_url TEXT
);

CREATE TABLE followers (
    id SERIAL PRIMARY KEY,
    follower_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (follower_id, following_id)
);

CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coin_id TEXT NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
    UNIQUE (user_id, coin_id)
);
