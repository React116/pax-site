const { sendTelegramMessage }  = require('./telegramService');
const { sendWhatsAppMessage }  = require('./whatsappService');
const { sendViberMessage }     = require('./viberService');

/**
 * Kanalı belirleyip doğru servis ile mesaj gönderir.
 * @param {Object} opts
 * @param {string} opts.channel   - 'telegram' | 'whatsapp' | 'viber' | 'webchat'
 * @param {Object} opts.credentials - ChannelIntegration.credentials
 * @param {string} opts.chatId    - Alıcı ID / telefon numarası
 * @param {string} opts.text      - Gönderilecek metin
 */
const routeOutboundMessage = async ({ channel, credentials, chatId, text }) => {
  switch (channel) {
    case 'telegram':
      return sendTelegramMessage({ botToken: credentials.botToken, chatId, text });

    case 'whatsapp':
      return sendWhatsAppMessage({
        accessToken:   credentials.accessToken,
        phoneNumberId: credentials.phoneNumberId,
        to:            chatId,
        text,
      });

    case 'viber':
      return sendViberMessage({ botToken: credentials.botToken, receiver: chatId, text });

    case 'webchat':
      // Webchat: mesajlar WebSocket / SSE üzerinden iletilir — bu serviste gönderim yok
      return { ok: true, messageId: null };

    default:
      return { ok: false, error: `Bilinmeyen kanal: ${channel}` };
  }
};

module.exports = { routeOutboundMessage };
