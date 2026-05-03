const Conversation = require('../models/Conversation');
const Message      = require('../models/Message');

const isProd = process.env.NODE_ENV === 'production';

// GET /api/conversations
const getConversations = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const filter = { businessId: req.businessId };
    if (req.query.status)  filter.status  = req.query.status;
    if (req.query.channel) filter.channel = req.query.channel;

    const [conversations, total] = await Promise.all([
      Conversation.find(filter)
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Conversation.countDocuments(filter),
    ]);

    res.json({ conversations, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    if (!isProd) console.error('Konuşma listesi hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// GET /api/conversations/:conversationId
const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      businessId: req.businessId,
    }).lean();

    if (!conversation) return res.status(404).json({ message: 'Konuşma bulunamadı.' });

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ conversation, messages });
  } catch (err) {
    if (!isProd) console.error('Konuşma detay hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// POST /api/conversations  (manuel konuşma başlat)
const createConversation = async (req, res) => {
  try {
    const { customerName, phone, channel } = req.body;

    if (!customerName || customerName.trim().length < 2)
      return res.status(400).json({ message: 'Müşteri adı gereklidir.' });

    const conversation = await Conversation.create({
      businessId:   req.businessId,
      customerName: customerName.trim(),
      phone:        phone?.trim() || '',
      channel:      channel || 'manual',
    });

    res.status(201).json(conversation);
  } catch (err) {
    if (!isProd) console.error('Konuşma oluşturma hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// PUT /api/conversations/:conversationId/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['open', 'ai_active', 'human_required', 'closed'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Geçersiz status.' });

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.conversationId, businessId: req.businessId },
      { $set: { status } },
      { new: true }
    );

    if (!conversation) return res.status(404).json({ message: 'Konuşma bulunamadı.' });
    res.json(conversation);
  } catch (err) {
    if (!isProd) console.error('Status güncelleme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// POST /api/conversations/:conversationId/messages  (operatör mesajı)
const sendMessage = async (req, res) => {
  try {
    const { text, sender = 'human' } = req.body;
    if (!text || text.trim().length === 0)
      return res.status(400).json({ message: 'Mesaj boş olamaz.' });

    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      businessId: req.businessId,
    });
    if (!conversation) return res.status(404).json({ message: 'Konuşma bulunamadı.' });

    const message = await Message.create({
      businessId:     req.businessId,
      conversationId: conversation._id,
      sender:         ['human', 'system'].includes(sender) ? sender : 'human',
      text:           text.trim(),
      channel:        conversation.channel,
    });

    // Konuşmayı güncelle
    await Conversation.findByIdAndUpdate(conversation._id, {
      $set:  { lastMessageText: text.trim(), lastMessageAt: new Date() },
      $inc:  { messageCount: 1 },
    });

    res.status(201).json(message);
  } catch (err) {
    if (!isProd) console.error('Mesaj gönderme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// DELETE /api/conversations/:conversationId
const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.conversationId,
      businessId: req.businessId,
    });
    if (!conversation) return res.status(404).json({ message: 'Konuşma bulunamadı.' });

    await Message.deleteMany({ conversationId: conversation._id });
    res.json({ message: 'Konuşma silindi.' });
  } catch (err) {
    if (!isProd) console.error('Konuşma silme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getConversations, getConversation, createConversation, updateStatus, sendMessage, deleteConversation };
