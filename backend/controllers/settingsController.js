// backend/controllers/settingsController.js
const Banner = require('../models/Banner');
const Promotion = require('../models/Promotion');
const SiteSettings = require('../models/SiteSettings');
const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;

// Improved helper function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.includes('cloudinary.com')) {
      console.log('Invalid or non-Cloudinary URL:', imageUrl);
      return null;
    }
    
    // Extract the public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/[cloud]/image/upload/[version]/[folder]/[public_id].[ext]
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      console.log('Upload segment not found in URL');
      return null;
    }
    
    // Get everything after 'upload' and before the file extension
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const publicIdWithExt = pathAfterUpload.split('.')[0]; // Remove file extension
    
    console.log('Extracted public_id:', publicIdWithExt);
    return publicIdWithExt;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

// --- Banner Management ---

// @desc    Get all banners
// @route   GET /api/settings/banners
// @access  Private (Admin)
exports.getBanners = async (req, res) => {
  try {
    console.log('--- Fetching all banners ---');
    const banners = await Banner.find({}).sort({ order: 1 });
    console.log(`Found ${banners.length} banners`);
    
    // Add validation to ensure each banner has required fields
    const validBanners = banners.map(banner => {
      return {
        _id: banner._id,
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        imageUrl: banner.imageUrl || '',
        buttonText: banner.buttonText || 'Shop Now',
        buttonLink: banner.buttonLink || '/products',
        status: banner.status || 'Active',
        order: banner.order || 0,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt
      };
    });
    
    res.json(validBanners);
  } catch (error) {
    console.error("Get banners error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: 'Server error fetching banners',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Create a new banner
// @route   POST /api/settings/banners
// @access  Private (Admin)
exports.createBanner = async (req, res) => {
  const { title, subtitle, buttonText, buttonLink, status, order } = req.body;

  try {
    console.log('--- Entering createBanner ---');
    console.log('Received Form Data:', req.body);
    console.log('Received Files:', req.file ? 'Present' : 'Missing');

    // Validate required fields
    if (!title || !title.trim()) {
      console.log('Validation Error: Banner title is missing or empty.');
      return res.status(400).json({ message: 'Banner title is required' });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.log('Upload Error: No file received.');
      return res.status(400).json({ message: 'Banner image is required' });
    }

    // Log the complete file object for debugging
    console.log('Complete req.file object:', JSON.stringify(req.file, null, 2));

    // Validate uploaded file
    if (!req.file.path) {
      console.error('Upload Error: req.file.path is missing!');
      console.error('File object details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        size: req.file.size,
        destination: req.file.destination,
        filename: req.file.filename,
        path: req.file.path,
        buffer: req.file.buffer ? 'Present' : 'Missing'
      });
      return res.status(500).json({ 
        message: 'Uploaded file path is missing. Please check Cloudinary configuration.',
        debug: 'File upload to Cloudinary failed'
      });
    }

    console.log('File uploaded successfully:', {
      path: req.file.path,
      public_id: req.file.public_id || 'Not available',
      filename: req.file.filename || 'Not available'
    });

    // Create banner object
    const banner = new Banner({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      imageUrl: req.file.path,
      buttonText: buttonText || 'Shop Now',
      buttonLink: buttonLink || '/products',
      status: status || 'Active',
      order: parseInt(order) || 0,
    });

    console.log('Banner object prepared:', {
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      status: banner.status,
      order: banner.order,
    });

    // Save to database
    const createdBanner = await banner.save();
    console.log('Banner saved successfully with ID:', createdBanner._id);

    res.status(201).json(createdBanner);
    console.log('--- Exiting createBanner successfully ---');

  } catch (error) {
    console.error("--- ERROR: Failed to create banner ---");
    console.error("Error Type:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    // Clean up uploaded file on error
    if (req.file && req.file.public_id) {
      try {
        console.log(`Cleaning up Cloudinary file: ${req.file.public_id}`);
        await cloudinary.uploader.destroy(req.file.public_id);
        console.log('Cleanup successful');
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
    }
    
    res.status(500).json({ 
      message: 'Server error creating banner. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update a banner
// @route   PUT /api/settings/banners/:id
// @access  Private (Admin)
exports.updateBanner = async (req, res) => {
  const { title, subtitle, buttonText, buttonLink, status, order } = req.body;

  try {
    console.log('--- Entering updateBanner ---');
    console.log('Banner ID:', req.params.id);
    console.log('Update data:', req.body);

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid banner ID format' });
    }

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      console.log('Banner not found for update.');
      return res.status(404).json({ message: 'Banner not found' });
    }

    console.log('Existing banner:', banner);

    // Handle image update if new file is uploaded
    let oldImagePublicId = null;
    if (req.file) {
      console.log('New image uploaded for update:', {
        path: req.file.path,
        public_id: req.file.public_id
      });

      // Get old image public_id for cleanup
      if (banner.imageUrl) {
        oldImagePublicId = extractPublicIdFromUrl(banner.imageUrl);
        console.log('Old image public_id extracted:', oldImagePublicId);
      }

      // Update image URL
      banner.imageUrl = req.file.path;
    }

    // Update other fields
    if (title && title.trim()) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (buttonText) banner.buttonText = buttonText;
    if (buttonLink) banner.buttonLink = buttonLink;
    if (status) banner.status = status;
    if (order !== undefined) banner.order = parseInt(order) || 0;

    // Save updated banner
    const updatedBanner = await banner.save();
    console.log('Banner updated successfully');

    // Delete old image from Cloudinary after successful update
    if (oldImagePublicId && req.file) {
      try {
        console.log(`Deleting old image: ${oldImagePublicId}`);
        await cloudinary.uploader.destroy(oldImagePublicId);
        console.log('Old image deleted successfully');
      } catch (cleanupError) {
        console.error("Error deleting old image:", cleanupError);
        // Don't fail the request if cleanup fails
      }
    }

    res.json(updatedBanner);
    console.log('--- Exiting updateBanner successfully ---');

  } catch (error) {
    console.error("--- ERROR: Failed to update banner ---");
    console.error("Error:", error);

    // Clean up new uploaded file if update failed
    if (req.file && req.file.public_id) {
      try {
        console.log(`Cleaning up new uploaded file: ${req.file.public_id}`);
        await cloudinary.uploader.destroy(req.file.public_id);
      } catch (cleanupError) {
        console.error("Error cleaning up new file:", cleanupError);
      }
    }
    
    res.status(500).json({ 
      message: 'Server error updating banner',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/settings/banners/:id
// @access  Private (Admin)
exports.deleteBanner = async (req, res) => {
  try {
    console.log('--- Entering deleteBanner ---');
    console.log('Banner ID:', req.params.id);

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid banner ID format' });
    }

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      console.log('Banner not found for deletion.');
      return res.status(404).json({ message: 'Banner not found' });
    }

    console.log('Banner to delete:', banner);

    // Extract public_id and delete from Cloudinary
    if (banner.imageUrl) {
      const publicId = extractPublicIdFromUrl(banner.imageUrl);
      if (publicId) {
        try {
          console.log(`Deleting image from Cloudinary: ${publicId}`);
          const result = await cloudinary.uploader.destroy(publicId);
          console.log('Cloudinary deletion result:', result);
        } catch (cleanupError) {
          console.error("Error deleting image from Cloudinary:", cleanupError);
          // Continue with banner deletion even if image cleanup fails
        }
      }
    }

    // Delete banner from database
    await banner.deleteOne();
    console.log('Banner deleted from database successfully');

    res.json({ message: 'Banner removed successfully' });
    console.log('--- Exiting deleteBanner successfully ---');

  } catch (error) {
    console.error("--- ERROR: Failed to delete banner ---");
    console.error("Error:", error);
    res.status(500).json({ 
      message: 'Server error deleting banner',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// --- Rest of the exports remain the same ---
// ... (keeping all other functions as they were)

// --- Promotion Management ---
exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({})
      .populate('applicableCategories', 'name')
      .sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    console.error("Get promotions error:", error);
    res.status(500).json({ message: 'Server error fetching promotions' });
  }
};

exports.createPromotion = async (req, res) => {
  const { 
    code, description, discountType, discountValue, minOrderValue, maxDiscount,
    startDate, endDate, usageLimit, applicableCategories 
  } = req.body;

  try {
    if (!code || !description || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const existingPromotion = await Promotion.findOne({ code: code.toUpperCase() });
    if (existingPromotion) {
      return res.status(400).json({ message: 'Promotion code already exists' });
    }

    const promotion = new Promotion({
      code: code.toUpperCase(),
      description,
      discountType: discountType || 'percentage',
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      usageLimit,
      applicableCategories: applicableCategories || [],
    });

    const createdPromotion = await promotion.save();
    await createdPromotion.populate('applicableCategories', 'name');
    res.status(201).json(createdPromotion);
  } catch (error) {
    console.error("Create promotion error:", error);
    res.status(500).json({ message: 'Server error creating promotion' });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    const { 
      code, description, discountType, discountValue, minOrderValue, maxDiscount,
      startDate, endDate, isActive, usageLimit, applicableCategories 
    } = req.body;

    if (code && code.toUpperCase() !== promotion.code) {
      const existingPromotion = await Promotion.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: promotion._id }
      });
      if (existingPromotion) {
        return res.status(400).json({ message: 'Promotion code already exists' });
      }
    }

    promotion.code = code ? code.toUpperCase() : promotion.code;
    promotion.description = description || promotion.description;
    promotion.discountType = discountType || promotion.discountType;
    promotion.discountValue = discountValue !== undefined ? discountValue : promotion.discountValue;
    promotion.minOrderValue = minOrderValue !== undefined ? minOrderValue : promotion.minOrderValue;
    promotion.maxDiscount = maxDiscount !== undefined ? maxDiscount : promotion.maxDiscount;
    promotion.startDate = startDate ? new Date(startDate) : promotion.startDate;
    promotion.endDate = endDate ? new Date(endDate) : promotion.endDate;
    promotion.isActive = isActive !== undefined ? isActive : promotion.isActive;
    promotion.usageLimit = usageLimit !== undefined ? usageLimit : promotion.usageLimit;
    promotion.applicableCategories = applicableCategories !== undefined ? applicableCategories : promotion.applicableCategories;

    const updatedPromotion = await promotion.save();
    await updatedPromotion.populate('applicableCategories', 'name');
    res.json(updatedPromotion);
  } catch (error) {
    console.error("Update promotion error:", error);
    res.status(500).json({ message: 'Server error updating promotion' });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    await promotion.deleteOne();
    res.json({ message: 'Promotion removed successfully' });
  } catch (error) {
    console.error("Delete promotion error:", error);
    res.status(500).json({ message: 'Server error deleting promotion' });
  }
};

// --- Site Settings Management ---
exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error("Get site settings error:", error);
    res.status(500).json({ message: 'Server error fetching site settings' });
  }
};

exports.updateSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    
    const {
      privacyPolicy, returnPolicy, termsOfService, shippingPolicy,
      contactInfo, socialMedia, paymentGateway, seoSettings
    } = req.body;

    if (privacyPolicy !== undefined) settings.privacyPolicy = privacyPolicy;
    if (returnPolicy !== undefined) settings.returnPolicy = returnPolicy;
    if (termsOfService !== undefined) settings.termsOfService = termsOfService;
    if (shippingPolicy !== undefined) settings.shippingPolicy = shippingPolicy;
    
    if (contactInfo) {
      settings.contactInfo = { ...settings.contactInfo, ...contactInfo };
    }
    
    if (socialMedia) {
      settings.socialMedia = { ...settings.socialMedia, ...socialMedia };
    }
    
    if (paymentGateway) {
      settings.paymentGateway = { ...settings.paymentGateway, ...paymentGateway };
    }
    
    if (seoSettings) {
      settings.seoSettings = { ...settings.seoSettings, ...seoSettings };
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error("Update site settings error:", error);
    res.status(500).json({ message: 'Server error updating site settings' });
  }
};

// --- Homepage Data for Frontend ---
exports.getHomepageData = async (req, res) => {
  try {
    const banners = await Banner.find({ status: 'Active' }).sort({ order: 1 });
    
    const newArrivals = await Product.find({ status: 'Active' })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(8);

    const featuredProducts = await Product.aggregate([
      { $match: { status: 'Active' } },
      { $sample: { size: 4 } }
    ]);

    await Product.populate(featuredProducts, { path: 'category', select: 'name' });

    res.json({
      banners,
      newArrivals,
      featuredProducts
    });
  } catch (error) {
    console.error("Get homepage data error:", error);
    res.status(500).json({ message: 'Server error fetching homepage data' });
  }
};

exports.getPublicSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    
    const publicSettings = {
      privacyPolicy: settings.privacyPolicy,
      returnPolicy: settings.returnPolicy,
      termsOfService: settings.termsOfService,
      shippingPolicy: settings.shippingPolicy,
      contactInfo: settings.contactInfo,
      socialMedia: settings.socialMedia,
      seoSettings: settings.seoSettings,
    };

    res.json(publicSettings);
  } catch (error) {
    console.error("Get public site settings error:", error);
    res.status(500).json({ message: 'Server error fetching site settings' });
  }
};