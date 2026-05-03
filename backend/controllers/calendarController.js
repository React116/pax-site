const CalendarEvent = require('../models/CalendarEvent');
const BusinessProfile = require('../models/BusinessProfile');

const isProd = process.env.NODE_ENV === 'production';

// Kullanıcının businessId'sini getirir (cache için req'e atar)
const getBusinessId = async (userId) => {
  const profile = await BusinessProfile.findOne({ userId }).select('_id').lean();
  return profile?._id || null;
};

const getEvents = async (req, res) => {
  try {
    const businessId = await getBusinessId(req.user.id);
    const filter = businessId
      ? { $or: [{ businessId }, { userId: req.user.id }] }
      : { userId: req.user.id };

    const events = await CalendarEvent.find(filter).lean();
    res.json(events);
  } catch (err) {
    if (!isProd) console.error('Takvim getirme hatası:', err.message);
    res.status(500).json({ message: 'Veri çekilemedi.' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, start, end } = req.body;
    if (!title || !start || !end)
      return res.status(400).json({ message: 'title, start ve end alanları zorunludur.' });

    const businessId = await getBusinessId(req.user.id);

    const event = await CalendarEvent.create({
      userId: req.user.id,
      ...(businessId && { businessId }),
      ...req.body,
    });
    res.status(201).json(event);
  } catch (err) {
    if (!isProd) console.error('Takvim ekleme hatası:', err.message);
    res.status(500).json({ message: 'Eklenemedi.' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: 'Etkinlik bulunamadı.' });
    res.json(event);
  } catch (err) {
    if (!isProd) console.error('Takvim güncelleme hatası:', err.message);
    res.status(500).json({ message: 'Güncellenemedi.' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: 'Etkinlik bulunamadı.' });
    res.json({ message: 'Silindi.' });
  } catch (err) {
    if (!isProd) console.error('Takvim silme hatası:', err.message);
    res.status(500).json({ message: 'Silinemedi.' });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
