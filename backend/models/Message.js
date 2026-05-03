const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  businessId:     { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true, index: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender:         { type: String, enum: ['customer', 'ai', 'human', 'system'], required: true },
  text:           { type: String, required: true, trim: true },
  channel:        { type: String, enum: ['whatsapp', 'telegram', 'viber', 'webchat', 'instagram', 'manual'], default: 'manual' },
  metadata:       { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

MessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
