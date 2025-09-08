-- Insert some test users
INSERT INTO users (name, email, password, is_public)
VALUES 
('alice', 'alice@example.com', 'hashedpassword1', true),
('bob', 'bob@example.com', 'hashedpassword2', true),
('charlie', 'charlie@example.com', 'hashedpassword3', false);

-- Insert some coins (CoinGecko IDs)
INSERT INTO coins (id, symbol, name, image_url)
VALUES
('bitcoin', 'btc', 'Bitcoin', 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'),
('ethereum', 'eth', 'Ethereum', 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'),
('dogecoin', 'doge', 'Dogecoin', 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png');

-- Add some watchlist entries
INSERT INTO watchlist (user_id, coin_id)
VALUES
(1, 'bitcoin'),
(1, 'ethereum'),
(2, 'dogecoin'),
(3, 'bitcoin');

-- Add some follower relationships
INSERT INTO followers (follower_id, following_id)
VALUES
(1, 2),  -- Alice follows Bob
(2, 1),  -- Bob follows Alice
(3, 1);  -- Charlie follows Alice
