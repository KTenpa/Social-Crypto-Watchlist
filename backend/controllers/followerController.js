const Follower = require('../models/Follower');
const ErrorResponse = require('../utils/errorResponse');

exports.followUser = async (req, res, next) => {
  const { id } = req.user;
  const { userId } = req.params;

  if (id == userId) {
    return next(new ErrorResponse('Cannot follow yourself', 400));
  }

  try {
    await Follower.follow(id, userId);
    res.status(200).json({ success: true, message: 'Followed user' });
  } catch (err) {
    next(new ErrorResponse('Error following user', 500));
  }
};

exports.unfollowUser = async (req, res, next) => {
  const { id } = req.user;
  const { userId } = req.params;

  try {
    await Follower.unfollow(id, userId);
    res.status(200).json({ success: true, message: 'Unfollowed user' });
  } catch (err) {
    next(new ErrorResponse('Error unfollowing user', 500));
  }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const following = await Follower.getFollowing(req.params.userId);
    res.status(200).json({ success: true, data: following });
  } catch (err) {
    next(new ErrorResponse('Error fetching following list', 500));
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const followers = await Follower.getFollowers(req.params.userId);
    res.status(200).json({ success: true, data: followers });
  } catch (err) {
    next(new ErrorResponse('Error fetching followers list', 500));
  }
};
