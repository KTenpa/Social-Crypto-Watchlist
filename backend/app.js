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

// const PORT = process.env.PORT || 5000;

// Export the app for testing
module.exports = app;

// Start server only if not in test environment
// if (process.env.NODE_ENV !== 'test') {
//   const server = app.listen(
//     PORT,
//     console.log(
//       `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
//     )
//   );

//   // Handle unhandled promise rejections
//   process.on('unhandledRejection', (err, promise) => {
//     console.log(`Error: ${err.message}`);
//     // Close server & exit process
//     server.close(() => process.exit(1));
//   });
// }