const mongoose = require('mongoose');

const BusinessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // --- TEMEL BİLGİLER ---
  businessType:       { type: String, default: 'pilates' },
  businessTypeLocked: { type: Boolean, default: false },
  businessName:       { type: String, default: '', trim: true },
  branches:           { type: String, default: '' },
  phone:              { type: String, default: '' },
  email:              { type: String, default: '' },

  // --- LOKASYON ---
  city:     { type: String, default: '' },
  country:  { type: String, default: '' },
  timezone: { type: String, default: 'Europe/Istanbul' },

  // --- SOSYAL MEDYA ---
  socialMedia: {
    website:   { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook:  { type: String, default: '' },
  },

  workingHours: { type: String, default: '{}' },
  languages:    { type: String, default: '' },

  // --- AI AYARLARI ---
  aiEnabled:            { type: Boolean, default: false },
  brandTone:            { type: String, enum: ['professional', 'friendly', 'luxury', 'energetic', 'calm'], default: 'professional' },
  defaultLanguage:      { type: String, default: 'tr' },
  fallbackMessage:      { type: String, default: '' },
  humanHandoffMessage:  { type: String, default: '' },
  bookingGoalEnabled:   { type: Boolean, default: true },
  leadCaptureEnabled:   { type: Boolean, default: true },

  // --- ESNEK ALANLAR (mevcut frontend uyumu için korundu) ---
  serviceDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  staffOrItems:   { type: Array, default: [] },
  faq:            { type: Array, default: [] },
  campaigns:      { type: Array, default: [] },

  // Eski yapı — FAZ 2'de Staff modeline taşınacak
  instructors: [{
    name:      String,
    specialty: String,
    certs:     String,
    schedule:  String,
    bio:       String,
  }],

  requiredInfo:    { type: String, default: '' },
  healthProtocols: { type: String, default: '' },

  paymentMethods: {
    creditCard: { type: Boolean, default: false },
    transfer:   { type: Boolean, default: false },
    pos:        { type: Boolean, default: false },
    cash:       { type: Boolean, default: false },
  },

  isActive: { type: Boolean, default: false },

}, { timestamps: true, strict: false });

BusinessProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('BusinessProfile', BusinessProfileSchema);
