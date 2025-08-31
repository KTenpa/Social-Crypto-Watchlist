const express = require('express');
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers
} = require('../controllers/followerController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/:userId', protect, followUser);
router.delete('/:userId', protect, unfollowUser);
router.get('/following/:userId', protect, getFollowing);
router.get('/followers/:userId', protect, getFollowers);

module.exports = router;
