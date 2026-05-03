const isProd = process.env.NODE_ENV === 'production';

/**
 * WhatsApp Business API (Meta) ile mesaj gönderir.
 */
const sendWhatsAppMessage = async ({ accessToken, phoneNumberId, to, text }) => {
  if (!accessToken || !phoneNumberId || !to) {
    if (!isProd) console.log('[WhatsApp MOCK] Eksik credentials — mesaj gönderilemedi.');
    return { ok: false, error: 'Eksik credentials' };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    });
    const data = await res.json();
    if (data.error) {
      if (!isProd) console.error('[WhatsApp] Gönderim hatası:', data.error.message);
      return { ok: false, error: data.error.message };
    }
    return { ok: true, messageId: data.messages?.[0]?.id };
  } catch (err) {
    if (!isProd) console.error('[WhatsApp] Fetch hatası:', err.message);
    return { ok: false, error: err.message };
  }
};

/**
 * Gelen WhatsApp webhook verisini normalize eder.
 */
const normalizeWhatsAppMessage = (body) => {
  try {
    const entry   = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value   = changes?.value;
    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    if (!message || message.type !== 'text') return null;

    return {
      externalUserId: message.from,
      customerName:   contact?.profile?.name || 'WhatsApp Kullanıcısı',
      phone:          message.from,
      text:           message.text?.body || '',
      channel:        'whatsapp',
      chatId:         message.from,
    };
  } catch {
    return null;
  }
};

module.exports = { sendWhatsAppMessage, normalizeWhatsAppMessage };
