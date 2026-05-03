const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  businessId:      { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true, index: true },
  name:            { type: String, required: true, trim: true },
  description:     { type: String, default: '', trim: true },
  durationMinutes: { type: Number, default: 60, min: 1 },
  price:           { type: Number, default: 0, min: 0 },
  currency:        { type: String, default: 'TRY', trim: true },
  isActive:        { type: Boolean, default: true },
}, { timestamps: true });

ServiceSchema.index({ businessId: 1, isActive: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
