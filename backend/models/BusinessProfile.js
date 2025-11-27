const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- TEMEL BİLGİLER ---
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

  // --- ESNEK ALANLAR (HATA ÇÖZÜMÜ BURADA) ---
  // validation failed hatasını engellemek için tipleri "Array" yaptık.
  // Mongoose artık bunların içini kontrol etmeden direkt kaydedecek.
  
  serviceDetails: { type: mongoose.Schema.Types.Mixed, default: {} }, 
  
  staffOrItems: { type: Array, default: [] },
  
  faq: { type: Array, default: [] },

  campaigns: { type: Array, default: [] },

  // Eski yapı
  instructors: [{
    name: String,
    specialty: String,
    certs: String,
    schedule: String,
    bio: String
  }],

  requiredInfo: { type: String, default: '' },
  healthProtocols: { type: String, default: '' },
  
  paymentMethods: {
    creditCard: { type: Boolean, default: false },
    transfer: { type: Boolean, default: false },
    pos: { type: Boolean, default: false },
    cash: { type: Boolean, default: false }
  },

  isActive: { type: Boolean, default: false }

}, { timestamps: true, strict: false });

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);