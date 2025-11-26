const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- YENİ ALANLAR ---
  businessName: { type: String, default: '' },
  branches: { type: String, default: '' },
  phone: { type: String, default: '' }, // Telefon artık String
  email: { type: String, default: '' },
  
  socialMedia: {
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  
  // Saatler JSON string olarak gelecek (Frontend'de öyle ayarladık)
  workingHours: { type: String, default: '{}' }, 
  languages: { type: String, default: '' },

  classTypes: { type: String, default: '' },
  classFormat: { type: String, default: '' },
  duration: { type: String, default: '' },
  pricing: { type: String, default: '' },
  
  freeTrial: { type: Boolean, default: false },
  onlineService: { type: Boolean, default: false },

  // Array yapısı
  instructors: [{
    name: String,
    specialty: String,
    certs: String,
    schedule: String,
    bio: String
  }],

  requiredInfo: { type: String, default: '' },
  ageLimit: { type: String, default: '' },
  healthProtocols: { type: String, default: '' },
  doctorApproval: { type: Boolean, default: false },

  faq: [{
    question: String,
    answer: String
  }],

  campaigns: { type: String, default: '' },
  referralDiscount: { type: Boolean, default: false },
  corporateMemberships: { type: Boolean, default: false },

  paymentMethods: {
    creditCard: { type: Boolean, default: false },
    transfer: { type: Boolean, default: false },
    pos: { type: Boolean, default: false },
    cash: { type: Boolean, default: false }
  },

  isActive: { type: Boolean, default: false }

}, { timestamps: true, strict: false }); // strict: false diyerek esneklik sağlıyoruz

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);