const Service = require('../models/Service');

const isProd = process.env.NODE_ENV === 'production';

const getServices = async (req, res) => {
  try {
    const services = await Service.find({ businessId: req.businessId }).sort({ createdAt: 1 }).lean();
    res.json(services);
  } catch (err) {
    if (!isProd) console.error('Hizmet listesi hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description, durationMinutes, price, currency } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2)
      return res.status(400).json({ message: 'Hizmet adı en az 2 karakter olmalıdır.' });

    const service = await Service.create({
      businessId: req.businessId,
      name: name.trim(),
      description: description?.trim() || '',
      durationMinutes: parseInt(durationMinutes) || 60,
      price: parseFloat(price) || 0,
      currency: currency?.trim() || 'TRY',
    });

    res.status(201).json(service);
  } catch (err) {
    if (!isProd) console.error('Hizmet ekleme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const updateService = async (req, res) => {
  try {
    const { name, description, durationMinutes, price, currency, isActive } = req.body;

    // Ownership kontrolü: serviceId businessId ile eşleşmeli
    const service = await Service.findOneAndUpdate(
      { _id: req.params.serviceId, businessId: req.businessId },
      {
        $set: {
          ...(name        !== undefined && { name: name.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(durationMinutes !== undefined && { durationMinutes: parseInt(durationMinutes) }),
          ...(price       !== undefined && { price: parseFloat(price) }),
          ...(currency    !== undefined && { currency: currency.trim() }),
          ...(isActive    !== undefined && { isActive }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!service) return res.status(404).json({ message: 'Hizmet bulunamadı.' });
    res.json(service);
  } catch (err) {
    if (!isProd) console.error('Hizmet güncelleme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.serviceId,
      businessId: req.businessId,
    });
    if (!service) return res.status(404).json({ message: 'Hizmet bulunamadı.' });
    res.json({ message: 'Hizmet silindi.' });
  } catch (err) {
    if (!isProd) console.error('Hizmet silme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getServices, createService, updateService, deleteService };
