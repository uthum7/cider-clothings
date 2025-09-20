const mongoose = require('mongoose');

const siteSettingsSchema = mongoose.Schema({
  privacyPolicy: {
    type: String,
    default: '',
  },
  returnPolicy: {
    type: String,
    default: '',
  },
  termsOfService: {
    type: String,
    default: '',
  },
  shippingPolicy: {
    type: String,
    default: '',
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
  },
  paymentGateway: {
    provider: {
      type: String,
      default: 'payhere',
    },
    merchantId: String,
    merchantSecret: String,
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  seoSettings: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
}, { timestamps: true });

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);