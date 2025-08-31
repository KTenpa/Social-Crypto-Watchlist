const express = require('express');
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} = require('../controllers/watchlistController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, getWatchlist);
router.post('/', protect, addToWatchlist);
router.delete('/:coin_id', protect, removeFromWatchlist);

module.exports = router;
