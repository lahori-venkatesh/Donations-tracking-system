const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'donatetrack') => {
  try {
    const result = await cloudinary.uploader.upload(file.path || `data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

// Upload document to Cloudinary
const uploadDocument = async (file, folder = 'donatetrack/documents') => {
  try {
    const result = await cloudinary.uploader.upload(file.path || `data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
      folder: folder,
      resource_type: 'auto',
      format: 'pdf'
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    logger.error('Cloudinary document upload error:', error);
    throw new Error('Document upload failed');
  }
};

// Delete file from Cloudinary
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new Error('File deletion failed');
  }
};

// Generate optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format
  });
};

// Generate thumbnail URL
const getThumbnailUrl = (publicId, size = 200) => {
  return cloudinary.url(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  });
};

module.exports = {
  uploadImage,
  uploadDocument,
  deleteFile,
  getOptimizedImageUrl,
  getThumbnailUrl,
  cloudinary
};