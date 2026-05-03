const isProd = process.env.NODE_ENV === 'production';

/**
 * Telegram'a mesaj gönderir.
 * botToken ve chatId gereklidir.
 */
const sendTelegramMessage = async ({ botToken, chatId, text }) => {
  if (!botToken || !chatId) {
    if (!isProd) console.log('[Telegram MOCK] token veya chatId eksik — mesaj gönderilemedi.');
    return { ok: false, error: 'Eksik credentials' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    const data = await res.json();
    if (!data.ok) {
      if (!isProd) console.error('[Telegram] Gönderim hatası:', data.description);
      return { ok: false, error: data.description };
    }
    return { ok: true, messageId: data.result?.message_id };
  } catch (err) {
    if (!isProd) console.error('[Telegram] Fetch hatası:', err.message);
    return { ok: false, error: err.message };
  }
};

/**
 * Gelen Telegram webhook verisini normalize eder.
 */
const normalizeTelegramMessage = (body) => {
  const message = body?.message || body?.edited_message;
  if (!message) return null;
  return {
    externalUserId: String(message.from?.id || ''),
    customerName:   [message.from?.first_name, message.from?.last_name].filter(Boolean).join(' ') || 'Telegram Kullanıcısı',
    phone:          '',
    text:           message.text || '',
    channel:        'telegram',
    chatId:         String(message.chat?.id || message.from?.id || ''),
  };
};

module.exports = { sendTelegramMessage, normalizeTelegramMessage };
