const express = require('express');
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  searchUsers,
  removeFollower
} = require('../controllers/followerController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/:userId', protect, followUser);
router.delete('/:userId', protect, unfollowUser);
router.get('/following/:userId', protect, getFollowing);
router.get('/followers/:userId', protect, getFollowers);
router.get('/search/:query', protect, searchUsers);
router.delete('/follower/:userId', protect, removeFollower);

module.exports = router;
