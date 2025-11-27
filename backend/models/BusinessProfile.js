const mongoose = require('mongoose');

// --- ALT ŞEMALAR (Bu yöntem hatayı %100 engeller) ---

// Kampanya Alt Şeması
const CampaignSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  discount: { type: String, default: '' }
}, { _id: false }); // ID oluşturma dedik, karmaşayı önler

// SSS (FAQ) Alt Şeması
const FaqSchema = new mongoose.Schema({
  question: { type: String, default: '' },
  answer: { type: String, default: '' }
}, { _id: false });

// Personel / Ürün Alt Şeması
const StaffSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  image: { type: String, default: '' },
  price: { type: String, default: '' }
}, { _id: false });

// --- ANA İŞLETME ŞEMASI ---

const BusinessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Temel Bilgiler
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
  
  // Çalışma saatleri
  workingHours: { type: String, default: '{}' }, 
  languages: { type: String, default: '' },

  // Hizmet Detayları (Mixed: Esnek yapı)
  serviceDetails: { type: mongoose.Schema.Types.Mixed, default: {} }, 
  
  // YENİLENMİŞ LİSTE YAPILARI (Yukarıdaki şemaları kullanıyor)
  staffOrItems: { type: [StaffSchema], default: [] },
  faq: { type: [FaqSchema], default: [] },
  campaigns: { type: [CampaignSchema], default: [] },

  // Eski yapıdan kalanlar (Bozulmaması için String tutuyoruz)
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