const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  businessId:     { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true, index: true },
  channel:        { type: String, enum: ['whatsapp', 'telegram', 'viber', 'webchat', 'instagram', 'manual'], default: 'manual' },
  externalUserId: { type: String, default: '' }, // platform'dan gelen kullanıcı id'si
  customerName:   { type: String, default: 'Bilinmeyen', trim: true },
  phone:          { type: String, default: '', trim: true },
  status:         { type: String, enum: ['open', 'ai_active', 'human_required', 'closed'], default: 'open' },
  intent:         { type: String, default: '' },
  leadTemperature:{ type: String, enum: ['hot', 'warm', 'cold', ''], default: '' },
  lastMessageAt:  { type: Date, default: Date.now },
  lastMessageText:{ type: String, default: '' },
  messageCount:   { type: Number, default: 0 },
}, { timestamps: true });

ConversationSchema.index({ businessId: 1, lastMessageAt: -1 });
ConversationSchema.index({ businessId: 1, status: 1 });

module.exports = mongoose.model('Conversation', ConversationSchema);
