const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/email');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Update last login
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      donorProfile: user.donorProfile,
      ngoProfile: user.ngoProfile
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role: role || 'donor',
      phone
    };

    // Initialize profile based on role
    if (role === 'ngo') {
      userData.ngoProfile = {
        organizationName: name,
        verificationStatus: 'pending'
      };
    } else if (role === 'donor') {
      userData.donorProfile = {
        totalDonated: 0,
        donationCount: 0
      };
    }

    const user = await User.create(userData);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
      await sendEmail({
        email: user.email,
        subject: 'Email Verification - DonateTrack',
        template: 'emailVerification',
        data: {
          name: user.name,
          verificationUrl
        }
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Development mode: Allow test credentials without database
    if (process.env.NODE_ENV === 'development') {
      const testUsers = {
        'donor@test.com': {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Donor',
          email: 'donor@test.com',
          role: 'donor',
          isVerified: true,
          isActive: true,
          donorProfile: {
            totalDonated: 5000,
            donationCount: 3
          }
        },
        'ngo@test.com': {
          _id: '507f1f77bcf86cd799439012',
          name: 'Test NGO',
          email: 'ngo@test.com',
          role: 'ngo',
          isVerified: true,
          isActive: true,
          ngoProfile: {
            organizationName: 'Test NGO Foundation',
            verificationStatus: 'verified'
          }
        },
        'admin@donatetrack.com': {
          _id: '507f1f77bcf86cd799439013',
          name: 'Admin User',
          email: 'admin@donatetrack.com',
          role: 'admin',
          isVerified: true,
          isActive: true
        }
      };

      const testPasswords = {
        'donor@test.com': 'donor123',
        'ngo@test.com': 'ngo123',
        'admin@donatetrack.com': 'admin123'
      };

      if (testUsers[email] && testPasswords[email] === password) {
        const user = testUsers[email];
        const token = generateToken(user._id);

        return res.status(200).json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            avatar: user.avatar,
            donorProfile: user.donorProfile,
            ngoProfile: user.ngoProfile
          }
        });
      }
    }

    // Production mode: Use database authentication
    try {
      // Check for user
      const user = await User.findByEmail(email).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account temporarily locked due to too many failed login attempts'
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        await user.incLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      sendTokenResponse(user, 200, res);
    } catch (dbError) {
      // If database is not available, fall back to test credentials in development
      if (process.env.NODE_ENV === 'development') {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Database not available. Use test credentials: donor@test.com/donor123, ngo@test.com/ngo123, admin@donatetrack.com/admin123'
        });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Development mode: Handle test users
    if (process.env.NODE_ENV === 'development') {
      const testUsers = {
        '507f1f77bcf86cd799439011': {
          _id: '507f1f77bcf86cd799439011',
          name: 'Test Donor',
          email: 'donor@test.com',
          role: 'donor',
          isVerified: true,
          avatar: null,
          donorProfile: {
            totalDonated: 5000,
            donationCount: 3
          },
          createdAt: new Date('2024-01-01')
        },
        '507f1f77bcf86cd799439012': {
          _id: '507f1f77bcf86cd799439012',
          name: 'Test NGO',
          email: 'ngo@test.com',
          role: 'ngo',
          isVerified: true,
          avatar: null,
          ngoProfile: {
            organizationName: 'Test NGO Foundation',
            verificationStatus: 'verified'
          },
          createdAt: new Date('2024-01-01')
        },
        '507f1f77bcf86cd799439013': {
          _id: '507f1f77bcf86cd799439013',
          name: 'Admin User',
          email: 'admin@donatetrack.com',
          role: 'admin',
          isVerified: true,
          avatar: null,
          createdAt: new Date('2024-01-01')
        }
      };

      const testUser = testUsers[req.user.id];
      if (testUser) {
        return res.status(200).json({
          success: true,
          user: {
            id: testUser._id,
            name: testUser.name,
            email: testUser.email,
            role: testUser.role,
            isVerified: testUser.isVerified,
            avatar: testUser.avatar,
            donorProfile: testUser.donorProfile,
            ngoProfile: testUser.ngoProfile,
            createdAt: testUser.createdAt
          }
        });
      }
    }

    // Production mode: Use database
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        donorProfile: user.donorProfile,
        ngoProfile: user.ngoProfile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    // Get hashed token
    const verificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: verificationToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify user
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset - DonateTrack',
        template: 'passwordReset',
        data: {
          name: user.name,
          resetUrl
        }
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetPasswordToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password update'
    });
  }
};

// @desc    Validate token
// @route   GET /api/auth/validate
// @access  Private
exports.validateToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is invalid'
    });
  }
};