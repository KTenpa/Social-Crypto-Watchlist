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

/**
 * @route   POST /api/v1/follow/:userId
 * @desc    Follow a user
 * @access  Private
 */
router.post('/:userId', protect, followUser);

/**
 * @route   DELETE /api/v1/follow/:userId
 * @desc    Unfollow a user
 * @access  Private
 */
router.delete('/:userId', protect, unfollowUser);

/**
 * @route   GET /api/v1/follow/following/:userId
 * @desc    Get the list of users a given user is following
 * @access  Private
 */
router.get('/following/:userId', protect, getFollowing);

/**
 * @route   GET /api/v1/follow/followers/:userId
 * @desc    Get the list of followers of a given user
 * @access  Private
 */
router.get('/followers/:userId', protect, getFollowers);

/**
 * @route   GET /api/v1/follow/search/:query
 * @desc    Search for users by name or email
 * @access  Private
 */
router.get('/search/:query', protect, searchUsers);

/**
 * @route   DELETE /api/v1/follow/follower/:userId
 * @desc    Remove a follower from the current user's followers
 * @access  Private
 */
router.delete('/follower/:userId', protect, removeFollower);

module.exports = router;
