const Follower = require('../models/Follower');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Follow another user.
 * @route POST /follow/:userId
 * @access Private
 */
exports.followUser = async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.userId);
    if (targetId === req.user.id) return next(new ErrorResponse("Can't follow yourself", 400));

    await Follower.follow(req.user.id, targetId);
    res.status(200).json({ success: true, message: 'User followed' });
  } catch (err) {
    next(new ErrorResponse('Error following user', 500));
  }
};

/**
 * Unfollow a user.
 * @route DELETE /follow/:userId
 * @access Private
 */
exports.unfollowUser = async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.userId);
    await Follower.unfollow(req.user.id, targetId);
    res.status(200).json({ success: true, message: 'User unfollowed' });
  } catch (err) {
    next(new ErrorResponse('Error unfollowing user', 500));
  }
};

/**
 * Get followers of a user.
 * @route GET /follow/followers/:userId
 * @access Private
 */
exports.getFollowers = async (req, res, next) => {
  try {
    const followers = await Follower.getFollowers(req.params.userId);
    res.status(200).json({ success: true, data: followers });
  } catch (err) {
    next(new ErrorResponse('Error fetching followers', 500));
  }
};

/**
 * Get following of a user.
 * @route GET /follow/following/:userId
 * @access Private
 */
exports.getFollowing = async (req, res, next) => {
  try {
    const following = await Follower.getFollowing(req.params.userId);
    res.status(200).json({ success: true, data: following });
  } catch (err) {
    next(new ErrorResponse('Error fetching following', 500));
  }
};

/**
 * Remove a follower from current user.
 * @route DELETE /follow/remove/:userId
 * @access Private
 */
exports.removeFollower = async (req, res, next) => {
  try {
    const followerId = parseInt(req.params.userId);
    // Delete where the follower_id is the target user, and following_id is current user
    await Follower.unfollow(followerId, req.user.id);
    res.status(200).json({ success: true, message: 'Follower removed' });
  } catch (err) {
    next(new ErrorResponse('Error removing follower', 500));
  }
};

/**
 * Search users by name or email.
 * @route GET /follow/search/:query
 * @access Private
 */
exports.searchUsers = async (req, res, next) => {
  try {
    const q = req.params.query;
    const users = await User.search(q);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(new ErrorResponse('Error searching users', 500));
  }
};
