const BusinessProfile = require('../models/BusinessProfile');

// 1. Profil Getirme
const getProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(200).json({});
    }
    res.json(profile);
  } catch (err) {
    console.error("Profil Getirme Hatası:", err.message);
    res.status(500).json({ message: 'Server Hatası: Veri çekilemedi.' });
  }
};

// 2. Profil Güncelleme (HATA ÇÖZÜMÜ BURADA)
const updateProfile = async (req, res) => {
  console.log("📡 GÜNCELLEME İSTEĞİ:", req.user.id);

  try {
    const updates = { ...req.body };

    // --- GÜVENLİK VE TEMİZLİK ---
    delete updates.userId;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // --- KRİTİK DÜZELTME: CAMPAIGNS ---
    // Eğer frontend'den campaigns geliyorsa ve dizi değilse, boş dizi yap.
    // Bu, "Cast to embedded failed" hatasını önler.
    if (updates.campaigns && !Array.isArray(updates.campaigns)) {
        console.log("⚠️ Uyarı: Campaigns dizi değil, düzeltiliyor...");
        updates.campaigns = [];
    }

    // Veritabanı İşlemi
    const profile = await BusinessProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    console.log("✅ Başarıyla Kaydedildi.");
    res.json(profile);

  } catch (err) {
    console.error("❌ KAYIT HATASI DETAYI:", err);
    
    // BURASI DÜZELTİLDİ: Artık düz yazı (send) yerine JSON gönderiyoruz.
    // Frontend artık "Unexpected token S" hatası vermeyecek, gerçek hatayı gösterecek.
    res.status(500).json({ 
        message: 'Kaydedilemedi: ' + (err.message || 'Bilinmeyen sunucu hatası'),
        error: err.toString()
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};