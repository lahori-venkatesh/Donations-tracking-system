const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 10 // Maximum 10 files per request
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size allowed is 10MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed per request.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (err.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

// Generate unique filename
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(6).toString('hex');
  const extension = path.extname(originalName);
  return `${timestamp}-${randomString}${extension}`;
};

// Validate file size and type
const validateFile = (file) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'application/pdf'
  ];

  if (file.size > maxSize) {
    throw new Error('File size exceeds maximum limit');
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(`File type ${file.mimetype} is not allowed`);
  }

  return true;
};

module.exports = {
  upload,
  handleMulterError,
  generateFileName,
  validateFile
};