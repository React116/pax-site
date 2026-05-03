const isProd = process.env.NODE_ENV === 'production';

/**
 * Viber'a mesaj gönderir.
 * botToken ve receiver gereklidir.
 */
const sendViberMessage = async ({ botToken, receiver, text }) => {
  if (!botToken || !receiver) {
    if (!isProd) console.log('[Viber MOCK] token veya receiver eksik — mesaj gönderilemedi.');
    return { ok: false, error: 'Eksik credentials' };
  }

  try {
    const res = await fetch('https://chatapi.viber.com/pa/send_message', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'X-Viber-Auth-Token': botToken,
      },
      body: JSON.stringify({
        receiver,
        min_api_version: 1,
        sender: { name: 'PAX Bot' },
        type: 'text',
        text,
      }),
    });
    const data = await res.json();
    if (data.status !== 0) {
      if (!isProd) console.error('[Viber] Gönderim hatası:', data.status_message);
      return { ok: false, error: data.status_message };
    }
    return { ok: true, messageId: data.message_token };
  } catch (err) {
    if (!isProd) console.error('[Viber] Fetch hatası:', err.message);
    return { ok: false, error: err.message };
  }
};

/**
 * Gelen Viber webhook verisini normalize eder.
 */
const normalizeViberMessage = (body) => {
  try {
    if (body?.event !== 'message') return null;
    const sender  = body.sender;
    const message = body.message;
    if (!message || message.type !== 'text') return null;

    return {
      externalUserId: sender?.id || '',
      customerName:   sender?.name || 'Viber Kullanıcısı',
      phone:          '',
      text:           message.text || '',
      channel:        'viber',
      chatId:         sender?.id || '',
    };
  } catch {
    return null;
  }
};

module.exports = { sendViberMessage, normalizeViberMessage };
