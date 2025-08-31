const axios = require('axios');
const Coin = require('../models/Coins');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Search coins from CoinGecko
// @route   GET /api/v1/coins/search/:query
// @access  Public
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

// @desc    Get all coins from database
// @route   GET /api/v1/coins
// @access  Public
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

// @desc    Get single coin from database
// @route   GET /api/v1/coins/:id
// @access  Public
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

// @desc    Add coin to database
// @route   POST /api/v1/coins
// @access  Private (you might want to protect this)
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