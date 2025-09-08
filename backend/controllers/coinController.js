const axios = require('axios');
const Coin = require('../models/Coins');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Search coins from CoinGecko.
 * @route GET /coins/search/:query
 * @access Public
 */
exports.searchCoins = async (req, res, next) => {
  try {
    const { query } = req.params;
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/search?query=${query}`
    );
    
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (err) {
    next(new ErrorResponse('Error searching coins', 500));
  }
};

/**
 * Get all coins from database.
 * @route GET /coins
 * @access Public
 */
exports.getCoins = async (req, res, next) => {
  try {
    const coins = await Coin.findAll();
    res.status(200).json({
      success: true,
      count: coins.length,
      data: coins
    });
  } catch (err) {
    next(new ErrorResponse('Error fetching coins', 500));
  }
};

/**
 * Get single coin by ID.
 * @route GET /coins/:id
 * @access Public
 */
exports.getCoin = async (req, res, next) => {
  try {
    const coin = await Coin.findById(req.params.id);
    
    if (!coin) {
      return next(new ErrorResponse(`Coin not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: coin
    });
  } catch (err) {
    next(new ErrorResponse('Error fetching coin', 500));
  }
};

/**
 * Add a new coin to database.
 * @route POST /coins
 * @access Private
 */
exports.addCoin = async (req, res, next) => {
  try {
    const { id, symbol, name, image_url } = req.body;
    
    // Check if coin already exists
    const existingCoin = await Coin.findById(id);
    if (existingCoin) {
      return next(new ErrorResponse(`Coin with id ${id} already exists`, 400));
    }
    
    const coin = await Coin.create({ id, symbol, name, image_url });
    
    res.status(201).json({
      success: true,
      data: coin
    });
  } catch (err) {
    next(new ErrorResponse('Error adding coin', 500));
  }
};