const BusinessProfile = require('../models/BusinessProfile');

// 1. Profil Getirme Fonksiyonu (Mevcut haliyle kalsın)
const getProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ msg: 'İşletme profili bulunamadı' });
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Hatası');
  }
};

// 2. Profil Güncelleme Fonksiyonu (BURASI DÜZELTİLDİ)
const updateProfile = async (req, res) => {
  try {
    // Frontend'den gelen verileri alıyoruz. 'isActive' buraya eklendi.
    const { businessName, industry, isActive } = req.body;

    // Kullanıcının profilini veritabanında bul
    let profile = await BusinessProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Profil bulunamadı' });
    }

    // Gelen veriler varsa güncelle
    if (businessName) profile.businessName = businessName;
    if (industry) profile.industry = industry;

    // isActive bir Boolean (true/false) olduğu için özel kontrol yapıyoruz
    // "undefined değilse" yani frontend bunu gönderdiyse güncelle diyoruz.
    if (typeof isActive !== 'undefined') {
      profile.isActive = isActive;
    }

    // Değişiklikleri kaydet
    await profile.save();

    // Güncel profili frontend'e geri gönder
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Hatası');
  }
};

// Fonksiyonları dışarı aktar
module.exports = {
  getProfile,
  updateProfile
};