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
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
