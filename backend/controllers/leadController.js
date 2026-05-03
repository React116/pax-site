const Lead = require('../models/Lead');
const BusinessProfile = require('../models/BusinessProfile');

const isProd = process.env.NODE_ENV === 'production';

const createLead = async (req, res) => {
  try {
    const { name, phone, email, sector, platforms, customerCount, intent, wantsWhatsApp, utmSource, utmMedium, utmCampaign } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2)
      return res.status(400).json({ message: 'İsim alanı gereklidir.' });
    if (!phone || typeof phone !== 'string')
      return res.status(400).json({ message: 'Telefon alanı gereklidir.' });
    if (!email || typeof email !== 'string' || !email.includes('@'))
      return res.status(400).json({ message: 'Geçerli bir e-posta giriniz.' });

    const lead = await Lead.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      sector:        sector?.trim()        || '',
      platforms:     platforms?.trim()     || '',
      customerCount: customerCount?.trim() || '',
      intent:        intent?.trim()        || '',
      wantsWhatsApp: wantsWhatsApp === true || wantsWhatsApp === 'true',
      utmSource:     utmSource?.trim()     || '',
      utmMedium:     utmMedium?.trim()     || '',
      utmCampaign:   utmCampaign?.trim()   || '',
    });

    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead._id, ...lead.toObject() }),
      }).catch((err) => {
        if (!isProd) console.error('n8n webhook hatası:', err.message);
      });
    }

    res.status(201).json({ message: 'Talebiniz alındı. En kısa sürede dönüş yapacağız.' });
  } catch (err) {
    if (!isProd) console.error('Lead kayıt hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const getLeads = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    // businessId filtresi: kullanıcının işletmesine ait leadler
    const businessProfile = await BusinessProfile.findOne({ userId: req.user.id }).lean();
    const baseFilter = businessProfile ? { businessId: businessProfile._id } : {};
    const filter = req.query.status
      ? { ...baseFilter, status: req.query.status }
      : baseFilter;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(filter),
    ]);

    res.json({ leads, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    if (!isProd) console.error('Lead listesi hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const getLeadStats = async (req, res) => {
  try {
    const businessProfile = await BusinessProfile.findOne({ userId: req.user.id }).lean();
    const matchFilter = businessProfile ? { businessId: businessProfile._id } : {};

    const [total, byStatus] = await Promise.all([
      Lead.countDocuments(matchFilter),
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({ total, byStatus });
  } catch (err) {
    if (!isProd) console.error('Lead stats hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { createLead, getLeads, getLeadStats };
