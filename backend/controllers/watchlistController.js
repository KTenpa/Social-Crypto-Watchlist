const Watchlist = require('../models/Watchlist');
const ErrorResponse = require('../utils/errorResponse');

exports.getWatchlist = async (req, res, next) => {
  try {
    const coins = await Watchlist.getByUser(req.user.id);
    res.status(200).json({ success: true, data: coins });
  } catch (err) {
    next(new ErrorResponse('Error fetching watchlist', 500));
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const rowCount = await Watchlist.add(req.user.id, req.body);

    if (rowCount === 0) {
      return res.status(200).json({ success: true, message: 'Coin already in watchlist' });
    }

    res.status(201).json({ success: true, message: 'Coin added to watchlist' });
  } catch (err) {
    next(new ErrorResponse('Error adding coin to watchlist', 500));
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    await Watchlist.remove(req.user.id, req.params.coin_id);
    res.status(200).json({ success: true, message: 'Coin removed from watchlist' });
  } catch (err) {
    next(new ErrorResponse('Error removing coin from watchlist', 500));
  }
};
