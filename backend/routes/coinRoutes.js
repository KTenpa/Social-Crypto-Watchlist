const express = require('express');
const {
  searchCoins,
  getCoins,
  getCoin,
  addCoin
} = require('../controllers/coinController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/search/:query', searchCoins);
router.get('/', getCoins);
router.get('/:id', getCoin);
router.post('/', protect, addCoin); // Protected route

module.exports = router;