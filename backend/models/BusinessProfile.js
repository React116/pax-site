const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- 1. GENEL BİLGİLER ---
  businessName: { type: String, default: '' },
  branches: { type: String, default: '' }, // Şube sayısı ve lokasyonlar
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  socialMedia: {
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  workingHours: { type: String, default: '' },
  languages: { type: String, default: '' }, // Türkçe, İngilizce vb.

  // --- 2. HİZMET & DERS DETAYLARI ---
  classTypes: { type: String, default: '' }, // Mat, Reformer vs.
  classFormat: { type: String, default: '' }, // Grup, Özel, Kombin
  duration: { type: String, default: '' }, // 40dk, 50dk
  pricing: { type: String, default: '' }, // Paket yapıları
  freeTrial: { type: Boolean, default: false },
  onlineService: { type: Boolean, default: false },

  // --- 3. EĞİTMEN BİLGİLERİ (Array Yapısı) ---
  instructors: [{
    name: String,
    specialty: String,
    certs: String, // Sertifikalar
    schedule: String,
    bio: String
  }],

  // --- 4. REZERVASYON & KURALLAR ---
  requiredInfo: { type: String, default: '' }, // İsim, Tel vb.
  
  // --- 5. MÜŞTERİ PROFİLİ & SAĞLIK ---
  ageLimit: { type: String, default: '' },
  healthProtocols: { type: String, default: '' }, // Fıtık, hamilelik vs.
  doctorApproval: { type: Boolean, default: false },

  // --- 6. AI EĞİTİM VERİLERİ (FAQ) ---
  faq: [{
    question: String,
    answer: String
  }],

  // --- 7. KAMPANYALAR ---
  campaigns: { type: String, default: '' }, // Yeni yıl, Black Friday
  referralDiscount: { type: Boolean, default: false },
  corporateMemberships: { type: Boolean, default: false },

  // --- 8. ÖDEME YÖNTEMLERİ ---
  paymentMethods: {
    creditCard: { type: Boolean, default: false },
    transfer: { type: Boolean, default: false }, // Havale
    pos: { type: Boolean, default: false },
    cash: { type: Boolean, default: false }
  },

  isActive: { type: Boolean, default: false } // AI Asistan durumu
}, { timestamps: true });

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);