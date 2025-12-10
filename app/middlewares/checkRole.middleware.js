const User = require('../models/admin/user.model');

const checkAdminRole = async (req, res, next) => {
  try {
    const userId = req.user.userId; // Get userId from decoded token
    
    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        result: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        result: false,
        message: 'User account is inactive'
      });
    }

    // Check if user has admin role
    if (user.roles !== 'ADMIN') {
      return res.status(403).json({
        result: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Add full user object to request for potential use in controllers
    req.userDetails = user;
    next();
  } catch (error) {
    return res.status(500).json({
      result: false,
      message: error.message
    });
  }
};

module.exports = {
  checkAdminRole
};
