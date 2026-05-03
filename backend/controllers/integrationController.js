const ChannelIntegration = require('../models/ChannelIntegration');

// GET /api/integrations
const listIntegrations = async (req, res) => {
  const integrations = await ChannelIntegration.find({ businessId: req.businessId })
    .select('-credentials -__v')  // Credentials frontend'e gönderilmez
    .lean();
  res.json(integrations);
};

// GET /api/integrations/:channel
const getIntegration = async (req, res) => {
  const { channel } = req.params;
  const integration = await ChannelIntegration.findOne({
    businessId: req.businessId,
    channel,
  }).select('-credentials').lean();

  if (!integration) return res.status(404).json({ message: 'Entegrasyon bulunamadı.' });
  res.json(integration);
};

// POST /api/integrations/:channel  — Oluştur veya güncelle
const upsertIntegration = async (req, res) => {
  const { channel } = req.params;
  const VALID_CHANNELS = ['telegram', 'whatsapp', 'viber', 'webchat', 'instagram'];

  if (!VALID_CHANNELS.includes(channel)) {
    return res.status(400).json({ message: 'Geçersiz kanal.' });
  }

  const { credentials, webhookUrl } = req.body;

  const integration = await ChannelIntegration.findOneAndUpdate(
    { businessId: req.businessId, channel },
    {
      $set: {
        ...(credentials  && { credentials }),
        ...(webhookUrl !== undefined && { webhookUrl }),
        status:   'connected',
        isActive: true,
        lastSyncAt: new Date(),
        lastError: '',
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.json({ message: 'Entegrasyon kaydedildi.', id: integration._id, status: integration.status });
};

// DELETE /api/integrations/:channel  — Bağlantıyı kes (credentials sil)
const disconnectIntegration = async (req, res) => {
  const { channel } = req.params;

  await ChannelIntegration.findOneAndUpdate(
    { businessId: req.businessId, channel },
    { $set: { credentials: {}, status: 'disconnected', isActive: false, webhookUrl: '' } }
  );

  res.json({ message: 'Entegrasyon bağlantısı kesildi.' });
};

module.exports = { listIntegrations, getIntegration, upsertIntegration, disconnectIntegration };
