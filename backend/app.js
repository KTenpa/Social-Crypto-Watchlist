/**
 * @file app.js
 * @description Main Express application setup for the Capstone project.
 *              Configures middleware, routes, and global error handling.
 */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './.env' });

// Route files
const auth = require('./routes/authRoutes');
const coin = require('./routes/coinRoutes');
const followerRoutes = require('./routes/followerRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/coins', coin);
app.use('/api/v1/follow', followerRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);

const { errorHandler } = require('./controllers/authController');
app.use(errorHandler);

// Export the app for testing
module.exports = app;
