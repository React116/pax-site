const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  businessId:    { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true, index: true },
  customerName:  { type: String, required: true, trim: true },
  phone:         { type: String, default: '', trim: true },
  email:         { type: String, default: '', trim: true, lowercase: true },
  serviceId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  staffId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  startTime:     { type: Date, required: true },
  endTime:       { type: Date, required: true },
  status:        { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  sourceChannel: { type: String, enum: ['manual', 'whatsapp', 'telegram', 'viber', 'webchat'], default: 'manual' },
  notes:         { type: String, default: '' },
}, { timestamps: true });

AppointmentSchema.index({ businessId: 1, startTime: 1 });
AppointmentSchema.index({ businessId: 1, status: 1 });
AppointmentSchema.index({ staffId: 1, startTime: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
