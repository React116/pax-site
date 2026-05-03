const { generateBusinessAIReply } = require('../services/ai/aiReplyService');
const BusinessProfile = require('../models/BusinessProfile');

const isProd = process.env.NODE_ENV === 'production';

/**
 * POST /api/ai/business-reply
 * Kanal webhook'larından veya test chat'ten çağrılır.
 */
const businessReply = async (req, res) => {
  try {
    const { message, conversationId, channel } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0)
      return res.status(400).json({ message: 'Mesaj boş olamaz.' });

    if (!req.business.aiEnabled)
      return res.status(403).json({ message: 'Bu işletme için AI asistan aktif değil.' });

    const result = await generateBusinessAIReply({
      businessId:      req.businessId,
      conversationId:  conversationId || null,
      customerMessage: message.trim(),
      channel:         channel || 'manual',
    });

    res.json(result);
  } catch (err) {
    if (!isProd) console.error('AI reply hatası:', err.message);
    res.status(500).json({ message: err.message || 'AI yanıt üretilemedi.' });
  }
};

/**
 * POST /api/ai/test-reply
 * Sadece dashboard test chat'i için — aiEnabled kontrolü yok.
 */
const testReply = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0)
      return res.status(400).json({ message: 'Mesaj boş olamaz.' });

    const result = await generateBusinessAIReply({
      businessId:      req.businessId,
      conversationId:  null,
      customerMessage: message.trim(),
      channel:         'manual',
    });

    res.json(result);
  } catch (err) {
    if (!isProd) console.error('AI test hatası:', err.message);
    res.status(500).json({ message: err.message || 'AI yanıt üretilemedi.' });
  }
};

/**
 * PUT /api/ai/settings
 * AI ayarlarını günceller.
 */
const updateAISettings = async (req, res) => {
  try {
    const allowed = ['aiEnabled', 'brandTone', 'defaultLanguage', 'fallbackMessage', 'humanHandoffMessage', 'bookingGoalEnabled', 'leadCaptureEnabled'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const profile = await BusinessProfile.findByIdAndUpdate(
      req.businessId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      aiEnabled:           profile.aiEnabled,
      brandTone:           profile.brandTone,
      defaultLanguage:     profile.defaultLanguage,
      fallbackMessage:     profile.fallbackMessage,
      humanHandoffMessage: profile.humanHandoffMessage,
      bookingGoalEnabled:  profile.bookingGoalEnabled,
      leadCaptureEnabled:  profile.leadCaptureEnabled,
    });
  } catch (err) {
    if (!isProd) console.error('AI settings hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * GET /api/ai/settings
 */
const getAISettings = async (req, res) => {
  const p = req.business;
  res.json({
    aiEnabled:           p.aiEnabled           ?? false,
    brandTone:           p.brandTone           || 'professional',
    defaultLanguage:     p.defaultLanguage     || 'tr',
    fallbackMessage:     p.fallbackMessage     || '',
    humanHandoffMessage: p.humanHandoffMessage || '',
    bookingGoalEnabled:  p.bookingGoalEnabled  ?? true,
    leadCaptureEnabled:  p.leadCaptureEnabled  ?? true,
  });
};

module.exports = { businessReply, testReply, updateAISettings, getAISettings };
