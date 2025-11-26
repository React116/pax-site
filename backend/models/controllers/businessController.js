const BusinessProfile = require('../models/BusinessProfile');

// Mevcut getProfile fonksiyonun muhtemelen burada duruyor, ona dokunma.
// Sadece updateProfile fonksiyonunu bu şekilde güncelle:

const updateProfile = async (req, res) => {
  try {
    // 1. Frontend'den gelen verileri al (isActive'i buraya ekledik)
    const { businessName, industry, isActive } = req.body;

    // 2. Kullanıcının profilini veritabanında bul
    let profile = await BusinessProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'İşletme profili bulunamadı.' });
    }

    // 3. Gelen veriler varsa güncelle
    if (businessName) profile.businessName = businessName;
    if (industry) profile.industry = industry;
    
    // isActive özel bir durum (Boolean olduğu için)
    // Eğer frontend isActive bilgisini gönderdiyse (true veya false), güncelle
    if (typeof isActive !== 'undefined') {
      profile.isActive = isActive;
    }

    // 4. Kaydet
    await profile.save();

    // 5. Güncel hali geri gönder
    res.json(profile);

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Hatası: Profil güncellenemedi.');
  }
};

// getProfile ve updateProfile'ı dışarı aktar (Zaten dosyanın sonunda vardır)
module.exports = {
  getProfile: require('./businessController').getProfile, // (Mevcut getProfile'ın importu bozulmasın diye burayı böyle yazdım, sen sadece updateProfile'ı değiştirsen yeter)
  updateProfile
};