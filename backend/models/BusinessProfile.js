const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Her kullanıcının sadece 1 işletme profili olabilir
  },
  businessName: {
    type: String,
    trim: true,
    default: ''
  },
  industry: {
    type: String,
    enum: ['pilates', 'dental', 'general'], // İleride burayı genişleteceğiz
    default: 'pilates'
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  // AI Davranış Ayarları
  aiConfig: {
    assistantName: { type: String, default: 'Asistan' },
    language: { type: String, default: 'tr' }, // tr veya en
    tone: { type: String, default: 'friendly' } // friendly, formal, enthusiastic
  },
  // Hizmetler ve Fiyatlar (Dinamik Liste)
  services: [
    {
      name: { type: String, required: true }, // Örn: Reformer Pilates
      price: { type: Number, default: 0 },    // Örn: 500
      duration: { type: Number, default: 60 }, // Dakika cinsinden
      description: String
    }
  ],
  // Çalışma Saatleri (Basit yapı)
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' },
    offDays: { type: [Number], default: [0] } // 0=Pazar, 6=Cumartesi vb.
  },
  // 360dialog & Entegrasyon Bilgileri
  integration: {
    whatsappPhoneId: { type: String, default: '' },
    apiKey: { type: String, default: '' }, // 360dialog API Key
    isConnected: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);