// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

console.log('=== Cloudinary Configuration ===');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'MISSING');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'MISSING');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'MISSING');

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ ERROR: Missing Cloudinary environment variables!');
    console.error('Please check your .env file has:');
    console.error('CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.error('CLOUDINARY_API_KEY=your_api_key');
    console.error('CLOUDINARY_API_SECRET=your_api_secret');
    throw new Error('Missing Cloudinary configuration');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection on startup
async function testCloudinaryConnection() {
    try {
        const result = await cloudinary.api.ping();
        console.log('✅ Cloudinary connection successful');
    } catch (error) {
        console.error('❌ Cloudinary connection failed:', error.message);
        console.error('Please verify your Cloudinary credentials');
    }
}

// Test connection (don't await to avoid blocking startup)
testCloudinaryConnection().catch(console.error);

// Configure storage for multer with enhanced error handling
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log(`Cloudinary Upload: Processing ${file.originalname}`);
        
        try {
            // Generate unique public_id for reliable file management
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            
            // Determine prefix based on the upload context
            let prefix = 'banner';
            
            // You can differentiate based on the request path
            if (req.route && req.route.path.includes('product')) {
                prefix = 'product';
            } else if (req.route && req.route.path.includes('banner')) {
                prefix = 'banner';
            } else if (req.route && req.route.path.includes('user')) {
                prefix = 'user';
            }
            
            const publicId = `${prefix}_${uniqueSuffix}`;
            console.log(`Cloudinary Upload: Generated public_id: ${publicId}`);
            
            return {
                folder: 'MERN-CLOTHING-SHOP-AVATARS',
                allowed_formats: ['jpeg', 'png', 'jpg', 'webp', 'gif'],
                public_id: publicId,
                // Enhanced transformation for better optimization
                transformation: [
                    {
                        quality: 'auto:best', // Better quality optimization
                        fetch_format: 'auto', // Automatic format selection
                        flags: 'progressive', // Progressive loading
                        width: 2000, // Max width
                        height: 1200, // Max height
                        crop: 'limit' // Only resize if larger
                    }
                ]
            };
        } catch (error) {
            console.error('Cloudinary params error:', error);
            throw error;
        }
    },
});

// Add event listeners for debugging
const originalHandleFile = storage._handleFile;
storage._handleFile = function(req, file, cb) {
    console.log(`Cloudinary Upload: Starting upload for ${file.originalname}`);
    
    originalHandleFile.call(this, req, file, (error, info) => {
        if (error) {
            console.error('Cloudinary Upload Error:', {
                message: error.message,
                name: error.name,
                http_code: error.http_code
            });
            cb(error);
        } else {
            console.log('Cloudinary Upload Success:', {
                public_id: info.public_id,
                secure_url: info.secure_url,
                format: info.format,
                bytes: info.bytes
            });
            cb(null, info);
        }
    });
};

console.log('✅ Cloudinary storage configured successfully');

module.exports = {
    cloudinary,
    storage,
};