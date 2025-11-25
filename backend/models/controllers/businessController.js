const BusinessProfile = require('../models/BusinessProfile');

// Profil Getir (Eğer yoksa boş bir tane oluşturup döner)
exports.getProfile = async (req, res) => {
  try {
    let profile = await BusinessProfile.findOne({ userId: req.user.id });

    if (!profile) {
      // Profil yoksa varsayılan boş bir profil oluştur
      profile = new BusinessProfile({ userId: req.user.id });
      await profile.save();
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Profil Getirme Hatası:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
};

// Profil Güncelle (Upsert mantığı: varsa güncelle, yoksa oluştur)
exports.updateProfile = async (req, res) => {
  try {
    const { businessName, industry, phone, address, aiConfig, services, workingHours, integration } = req.body;

    // Alanları güncelle
    const profile = await BusinessProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          businessName,
          industry,
          phone,
          address,
          aiConfig,
          services,
          workingHours,
          integration
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true } // Güncel halini döndür, yoksa oluştur
    );

    res.status(200).json({ success: true, data: profile, message: 'Ayarlar başarıyla kaydedildi.' });
  } catch (error) {
    console.error('Profil Güncelleme Hatası:', error);
    res.status(500).json({ success: false, message: 'Kaydetme sırasında hata oluştu.' });
  }
};