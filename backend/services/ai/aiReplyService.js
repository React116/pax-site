const { buildBusinessPrompt } = require('./businessPromptBuilder');
const Message = require('../../models/Message');

const isProd = process.env.NODE_ENV === 'production';

/**
 * İşletmeye özel AI cevabı üretir.
 * OpenAI API'ye istek atar, JSON response döner.
 */
const generateBusinessAIReply = async ({ businessId, conversationId, customerMessage, channel = 'manual', historyLimit = 10 }) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY tanımlı değil.');
  }

  const { systemPrompt } = await buildBusinessPrompt(businessId);

  // Son konuşma geçmişini yükle
  let history = [];
  if (conversationId) {
    const pastMessages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(historyLimit)
      .lean();
    history = pastMessages.reverse().map(m => ({
      role:    m.sender === 'customer' ? 'user' : 'assistant',
      content: m.text,
    }));
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: customerMessage },
  ];

  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature:      0.7,
      max_tokens:       800,
      response_format:  { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API hatası: ${response.status}`);
  }

  const data = await response.json();
  const raw  = data.choices?.[0]?.message?.content || '{}';

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    if (!isProd) console.error('AI JSON parse hatası:', raw);
    parsed = { replyText: raw, intent: 'general', leadTemperature: 'cold' };
  }

  return {
    replyText:             parsed.replyText             || '',
    intent:                parsed.intent                || 'general',
    leadTemperature:       parsed.leadTemperature       || 'cold',
    shouldCreateLead:      Boolean(parsed.shouldCreateLead),
    shouldBookAppointment: Boolean(parsed.shouldBookAppointment),
    appointmentDraft:      parsed.appointmentDraft      || {},
    shouldEscalateToHuman: Boolean(parsed.shouldEscalateToHuman),
    summary:               parsed.summary               || '',
  };
};

module.exports = { generateBusinessAIReply };
