const Staff = require('../models/Staff');

const isProd = process.env.NODE_ENV === 'production';

const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ businessId: req.businessId })
      .populate('services', 'name price currency')
      .sort({ createdAt: 1 })
      .lean();
    res.json(staff);
  } catch (err) {
    if (!isProd) console.error('Personel listesi hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const createStaff = async (req, res) => {
  try {
    const { name, role, bio, phone, services, workingHours } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2)
      return res.status(400).json({ message: 'Personel adı en az 2 karakter olmalıdır.' });

    const member = await Staff.create({
      businessId: req.businessId,
      name: name.trim(),
      role:         role?.trim()         || '',
      bio:          bio?.trim()          || '',
      phone:        phone?.trim()        || '',
      services:     Array.isArray(services) ? services : [],
      workingHours: workingHours        || '{}',
    });

    res.status(201).json(member);
  } catch (err) {
    if (!isProd) console.error('Personel ekleme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { name, role, bio, phone, services, workingHours, isActive } = req.body;

    const member = await Staff.findOneAndUpdate(
      { _id: req.params.staffId, businessId: req.businessId },
      {
        $set: {
          ...(name         !== undefined && { name: name.trim() }),
          ...(role         !== undefined && { role: role.trim() }),
          ...(bio          !== undefined && { bio: bio.trim() }),
          ...(phone        !== undefined && { phone: phone.trim() }),
          ...(services     !== undefined && { services }),
          ...(workingHours !== undefined && { workingHours }),
          ...(isActive     !== undefined && { isActive }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!member) return res.status(404).json({ message: 'Personel bulunamadı.' });
    res.json(member);
  } catch (err) {
    if (!isProd) console.error('Personel güncelleme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const member = await Staff.findOneAndDelete({
      _id: req.params.staffId,
      businessId: req.businessId,
    });
    if (!member) return res.status(404).json({ message: 'Personel bulunamadı.' });
    res.json({ message: 'Personel silindi.' });
  } catch (err) {
    if (!isProd) console.error('Personel silme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getStaff, createStaff, updateStaff, deleteStaff };
