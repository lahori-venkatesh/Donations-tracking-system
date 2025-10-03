const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Development mode: Handle test users
      if (process.env.NODE_ENV === 'development') {
        const testUsers = {
          '507f1f77bcf86cd799439011': {
            id: '507f1f77bcf86cd799439011',
            name: 'Test Donor',
            email: 'donor@test.com',
            role: 'donor',
            isActive: true
          },
          '507f1f77bcf86cd799439012': {
            id: '507f1f77bcf86cd799439012',
            name: 'Test NGO',
            email: 'ngo@test.com',
            role: 'ngo',
            isActive: true
          },
          '507f1f77bcf86cd799439013': {
            id: '507f1f77bcf86cd799439013',
            name: 'Admin User',
            email: 'admin@donatetrack.com',
            role: 'admin',
            isActive: true
          }
        };

        const testUser = testUsers[decoded.id];
        if (testUser) {
          req.user = testUser;
          return next();
        }
      }

      // Production mode: Get user from database
      try {
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'No user found with this token'
          });
        }

        // Check if user is active
        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            message: 'User account is not active'
          });
        }

        req.user = user;
        next();
      } catch (dbError) {
        // If database is not available in development, deny access
        if (process.env.NODE_ENV === 'development') {
          return res.status(401).json({
            success: false,
            message: 'Database not available'
          });
        }
        throw dbError;
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};