const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  phone:         { type: String, required: true, trim: true },
  email:         { type: String, required: true, trim: true, lowercase: true },
  sector:        { type: String, default: '' },
  platforms:     { type: String, default: '' },
  customerCount: { type: String, default: '' },
  intent:        { type: String, default: '' },
  wantsWhatsApp: { type: Boolean, default: false },
  source:        { type: String, default: 'website' },
  utmSource:     { type: String, default: '' },
  utmMedium:     { type: String, default: '' },
  utmCampaign:   { type: String, default: '' },
  // CRM alanları
  status:        { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
  score:         { type: Number, default: 0 },
  assignedTo:    { type: String, default: '' },
  notes:         { type: String, default: '' },
}, { timestamps: true });

LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', LeadSchema);
