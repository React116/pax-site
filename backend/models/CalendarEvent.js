const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', index: true },
  title:      { type: String, required: true, trim: true },
  start:      { type: Date, required: true },
  end:        { type: Date, required: true },
  type:       { type: String, default: 'private' },
  instructor: { type: String, default: '' },
  room:       { type: String, default: 'Ana Salon' },
  status:     { type: String, default: 'confirmed' },
  desc:       { type: String, default: '' },
  color:      { type: String, default: '#3b82f6' },
}, { timestamps: true });

CalendarEventSchema.index({ userId: 1, start: 1 });

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);
