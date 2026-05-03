const mongoose = require('mongoose');

const ChannelIntegrationSchema = new mongoose.Schema({
  businessId:  { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true, index: true },
  channel:     { type: String, enum: ['telegram', 'whatsapp', 'viber', 'webchat', 'instagram'], required: true },
  provider:    { type: String, default: '' },

  // Credentials — production'da encrypt edilmeli (FAZ ilerleyen)
  credentials: { type: mongoose.Schema.Types.Mixed, default: {} },
  // Örnek telegram: { botToken: '...' }
  // Örnek whatsapp: { accessToken: '...', phoneNumberId: '...' }
  // Örnek viber:    { botToken: '...' }

  webhookUrl:  { type: String, default: '' },
  status:      { type: String, enum: ['disconnected', 'connected', 'error'], default: 'disconnected' },
  isActive:    { type: Boolean, default: false },
  lastSyncAt:  { type: Date },
  lastError:   { type: String, default: '' },
}, { timestamps: true });

// Her işletme için her kanaldan yalnızca 1 entegrasyon
ChannelIntegrationSchema.index({ businessId: 1, channel: 1 }, { unique: true });

module.exports = mongoose.model('ChannelIntegration', ChannelIntegrationSchema);
