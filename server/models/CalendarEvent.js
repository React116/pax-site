const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  desc: { type: String },
  allDay: { type: Boolean, default: false },
  color: { type: String, default: '#3b82f6' } // Mavi varsayılan
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);