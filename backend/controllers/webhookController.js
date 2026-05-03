const ChannelIntegration         = require('../models/ChannelIntegration');
const Conversation               = require('../models/Conversation');
const Message                    = require('../models/Message');
const { normalizeTelegramMessage } = require('../services/channels/telegramService');
const { normalizeWhatsAppMessage } = require('../services/channels/whatsappService');
const { normalizeViberMessage }    = require('../services/channels/viberService');
const { generateBusinessAIReply }  = require('../services/ai/aiReplyService');
const { routeOutboundMessage }     = require('../services/channels/channelRouter');

const isProd = process.env.NODE_ENV === 'production';

/**
 * Gelen mesajı işler:
 *  1. Normalize et
 *  2. ChannelIntegration → businessId bul
 *  3. Conversation upsert
 *  4. Müşteri mesajını kaydet
 *  5. AI yanıtı üret
 *  6. AI mesajını kaydet
 *  7. Kanala gönder
 */
const processIncoming = async ({ channel, integration, normalizedMsg }) => {
  const { externalUserId, customerName, phone, text, chatId } = normalizedMsg;
  const businessId = integration.businessId;

  // Conversation upsert
  let conversation = await Conversation.findOne({ businessId, channel, externalUserId });
  if (!conversation) {
    conversation = await Conversation.create({
      businessId,
      channel,
      externalUserId,
      customerName,
      phone,
      chatId,
      status: 'ai_active',
    });
  }

  // Müşteri mesajını kaydet
  await Message.create({
    conversationId: conversation._id,
    sender:         'customer',
    text,
  });

  // Sadece ai_active ise AI yanıtla
  if (conversation.status !== 'ai_active') return;

  try {
    const aiResult = await generateBusinessAIReply({
      businessId,
      conversationId: conversation._id,
      customerMessage: text,
      channel,
    });

    if (!aiResult?.replyText) return;

    // AI mesajını kaydet
    await Message.create({
      conversationId: conversation._id,
      sender:         'ai',
      text:           aiResult.replyText,
      metadata: {
        intent:          aiResult.intent,
        leadTemperature: aiResult.leadTemperature,
        shouldEscalate:  aiResult.shouldEscalateToHuman,
      },
    });

    // Eskalasyon gerekiyorsa durumu güncelle
    if (aiResult.shouldEscalateToHuman) {
      await Conversation.findByIdAndUpdate(conversation._id, { status: 'human_required' });
    }

    // Kanala gönder
    await routeOutboundMessage({
      channel,
      credentials: integration.credentials,
      chatId,
      text: aiResult.replyText,
    });
  } catch (err) {
    if (!isProd) console.error('[Webhook] AI yanıt hatası:', err.message);
  }
};

// ─── TELEGRAM WEBHOOK ────────────────────────────────────────────────────────

// GET /api/webhooks/telegram/:businessId  — Token doğrulama (setWebhook için)
const telegramVerify = (req, res) => {
  res.sendStatus(200);
};

// POST /api/webhooks/telegram/:businessId
const telegramWebhook = async (req, res) => {
  res.sendStatus(200); // Telegram'a hemen 200 dön

  try {
    const { businessId } = req.params;
    const integration = await ChannelIntegration.findOne({ businessId, channel: 'telegram', isActive: true });
    if (!integration) return;

    const normalizedMsg = normalizeTelegramMessage(req.body);
    if (!normalizedMsg) return;

    await processIncoming({ channel: 'telegram', integration, normalizedMsg });
  } catch (err) {
    if (!isProd) console.error('[Telegram Webhook]', err.message);
  }
};

// ─── WHATSAPP WEBHOOK ─────────────────────────────────────────────────────────

// GET /api/webhooks/whatsapp/:businessId  — Meta webhook doğrulama
const whatsappVerify = (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'pax_whatsapp_verify';
  if (mode === 'subscribe' && token === expectedToken) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
};

// POST /api/webhooks/whatsapp/:businessId
const whatsappWebhook = async (req, res) => {
  res.sendStatus(200);

  try {
    const { businessId } = req.params;
    const integration = await ChannelIntegration.findOne({ businessId, channel: 'whatsapp', isActive: true });
    if (!integration) return;

    const normalizedMsg = normalizeWhatsAppMessage(req.body);
    if (!normalizedMsg) return;

    await processIncoming({ channel: 'whatsapp', integration, normalizedMsg });
  } catch (err) {
    if (!isProd) console.error('[WhatsApp Webhook]', err.message);
  }
};

// ─── VIBER WEBHOOK ────────────────────────────────────────────────────────────

// POST /api/webhooks/viber/:businessId
const viberWebhook = async (req, res) => {
  res.sendStatus(200);

  try {
    const { businessId } = req.params;

    // Viber set_webhook callback — sadece ok dön
    if (req.body?.event === 'webhook') return;

    const integration = await ChannelIntegration.findOne({ businessId, channel: 'viber', isActive: true });
    if (!integration) return;

    const normalizedMsg = normalizeViberMessage(req.body);
    if (!normalizedMsg) return;

    await processIncoming({ channel: 'viber', integration, normalizedMsg });
  } catch (err) {
    if (!isProd) console.error('[Viber Webhook]', err.message);
  }
};

module.exports = { telegramVerify, telegramWebhook, whatsappVerify, whatsappWebhook, viberWebhook };
