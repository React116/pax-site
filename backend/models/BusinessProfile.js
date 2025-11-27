const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  businessType: { type: String, default: 'pilates' },
  businessName: { type: String, default: '' },
  branches: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  
  socialMedia: {
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  
  workingHours: { type: String, default: '{}' }, 
  languages: { type: String, default: '' },
  serviceDetails: { type: mongoose.Schema.Types.Mixed, default: {} }, 
  
  staffOrItems: [{
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: String, default: '' }
  }],

  instructors: [{
    name: String,
    specialty: String,
    certs: String,
    schedule: String,
    bio: String
  }],

  requiredInfo: { type: String, default: '' },
  healthProtocols: { type: String, default: '' },
  
  faq: [{
    question: { type: String, default: '' },
    answer: { type: String, default: '' }
  }],

  // --- BURASI KESİNLİKLE BÖYLE OLMALI ---
  campaigns: [{
    name: { type: String, default: '' },
    discount: { type: String, default: '' }
  }],
  
  paymentMethods: {
    creditCard: { type: Boolean, default: false },
    transfer: { type: Boolean, default: false },
    pos: { type: Boolean, default: false },
    cash: { type: Boolean, default: false }
  },

  isActive: { type: Boolean, default: false }

}, { timestamps: true, strict: false });

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);