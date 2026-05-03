const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  businessId:   { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true, index: true },
  name:         { type: String, required: true, trim: true },
  role:         { type: String, default: '', trim: true },
  bio:          { type: String, default: '', trim: true },
  phone:        { type: String, default: '', trim: true },
  services:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  workingHours: { type: String, default: '{}' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

StaffSchema.index({ businessId: 1, isActive: 1 });

module.exports = mongoose.model('Staff', StaffSchema);
