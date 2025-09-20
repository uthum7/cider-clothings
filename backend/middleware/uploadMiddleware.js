// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const { storage } = require('../config/cloudinary');

console.log('Upload Middleware: Initializing with Cloudinary storage');

// Configure multer with Cloudinary storage and enhanced options
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for large banner images
    files: 1, // Maximum 1 file per request
  },
  fileFilter: (req, file, cb) => {
    console.log('Upload Middleware: Processing file:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname
    });

    // Allowed image types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ];

    // Check if file type is allowed
    if (allowedMimeTypes.includes(file.mimetype)) {
      console.log('Upload Middleware: File accepted');
      cb(null, true);
    } else {
      console.log('Upload Middleware: File rejected - invalid type:', file.mimetype);
      cb(new Error(`Invalid file type. Please upload: ${allowedMimeTypes.join(', ')}`), false);
    }
  },
});

// Error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
  console.log('Upload Middleware: Handling potential error');
  
  if (err instanceof multer.MulterError) {
    console.error('Multer Error Details:', {
      code: err.code,
      message: err.message,
      field: err.field
    });
    
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          message: 'File too large. Maximum size is 5MB.',
          error: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          message: 'Too many files. Maximum 1 file allowed.',
          error: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          message: 'Unexpected file field. Expected field name: "image"',
          error: 'UNEXPECTED_FIELD'
        });
      default:
        return res.status(400).json({ 
          message: `Upload error: ${err.message}`,
          error: err.code
        });
    }
  }
  
  // Handle custom file filter errors
  if (err && err.message) {
    console.error('File Filter Error:', err.message);
    return res.status(400).json({ 
      message: err.message,
      error: 'INVALID_FILE_TYPE'
    });
  }
  
  // Handle other errors
  if (err) {
    console.error('General Upload Error:', err);
    return res.status(500).json({ 
      message: 'File upload failed. Please try again.',
      error: 'UPLOAD_FAILED'
    });
  }
  
  console.log('Upload Middleware: No errors, proceeding to next middleware');
  next();
};

// Create upload instance with error handling
const uploadWithErrorHandling = (fieldName = 'image') => {
  return [
    upload.single(fieldName),
    handleMulterError
  ];
};

// Export both the basic upload and the enhanced version
module.exports = upload;
module.exports.withErrorHandling = uploadWithErrorHandling;
module.exports.handleError = handleMulterError;