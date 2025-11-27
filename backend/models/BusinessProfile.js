const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- TEMEL BİLGİLER ---
  businessType: { type: String, default: 'pilates' }, // Varsayılan pilates
  businessName: { type: String, default: '' },
  branches: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  
  socialMedia: {
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  
  // Çalışma saatleri JSON string olarak tutulur
  workingHours: { type: String, default: '{}' }, 
  languages: { type: String, default: '' },

  // --- DİNAMİK ALANLAR (Sektöre göre değişir) ---
  
  // 1. Hizmet Detayları (classTypes, treatmentTypes, menu vb. buraya gelir)
  serviceDetails: { type: mongoose.Schema.Types.Mixed, default: {} }, 
  
  // 2. Liste Verileri (Eğitmenler, Doktorlar, Araçlar, Odalar buraya gelir)
  staffOrItems: [{
    name: String, // İsim veya Araç Modeli
    title: String, // Ünvan veya Plaka
    desc: String, // Biyografi veya Özellikler
    image: String,
    price: String
  }],

  // Eski yapı bozulmasın diye tutuyoruz (Migration için)
  instructors: [{
    name: String,
    specialty: String,
    certs: String,
    schedule: String,
    bio: String
  }],

  // --- GENEL AYARLAR ---
  requiredInfo: { type: String, default: '' }, // Rezervasyonda istenenler
  healthProtocols: { type: String, default: '' },
  
  faq: [{
    question: String,
    answer: String
  }],

  campaigns: { type: String, default: '' },
  
  paymentMethods: {
    creditCard: { type: Boolean, default: false },
    transfer: { type: Boolean, default: false },
    pos: { type: Boolean, default: false },
    cash: { type: Boolean, default: false }
  },

  isActive: { type: Boolean, default: false }

}, { timestamps: true, strict: false }); // strict:false ile esneklik sağladık

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);