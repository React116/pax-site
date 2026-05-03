const BusinessProfile = require('../models/BusinessProfile');

const isProd = process.env.NODE_ENV === 'production';

const getProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(200).json({});
    res.json(profile);
  } catch (err) {
    if (!isProd) console.error('Profil Getirme Hatası:', err.message);
    res.status(500).json({ message: 'Veri çekilemedi.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Korunan alanları temizle
    delete updates.userId;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // İşletme türü kilidi
    const existingProfile = await BusinessProfile.findOne({ userId: req.user.id });
    if (existingProfile?.businessTypeLocked) {
      updates.businessType = existingProfile.businessType;
      updates.businessTypeLocked = true;
    } else if (typeof updates.businessType !== 'undefined') {
      updates.businessTypeLocked = true;
    }

    // campaigns dizi değilse temizle
    if (updates.campaigns && !Array.isArray(updates.campaigns)) {
      updates.campaigns = [];
    }

    const profile = await BusinessProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(profile);
  } catch (err) {
    if (!isProd) console.error('Kayıt Hatası:', err.message);
    res.status(500).json({ message: 'Kaydedilemedi.' });
  }
};

module.exports = { getProfile, updateProfile };
