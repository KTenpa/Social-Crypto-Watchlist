const express = require('express');
const {
  searchCoins,
  getCoins,
  getCoin,
  addCoin
} = require('../controllers/coinController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   GET /api/v1/coins/search/:query
 * @desc    Search coins using CoinGecko API
 * @access  Public
 */
router.get('/search/:query', searchCoins);

/**
 * @route   GET /api/v1/coins
 * @desc    Get all coins from the database
 * @access  Public
 */
router.get('/', getCoins);

/**
 * @route   GET /api/v1/coins/:id
 * @desc    Get details of a single coin by ID
 * @access  Public
 */
router.get('/:id', getCoin);


/**
 * @route   POST /api/v1/coins
 * @desc    Add a coin to the database
 * @access  Private
 */
router.post('/', protect, addCoin); // Protected route

module.exports = router;