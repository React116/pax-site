const BusinessProfile = require('../models/BusinessProfile');

// 1. Profil Getirme Fonksiyonu (GET)
const getProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user.id });
    
    // Profil yoksa boş obje dön
    if (!profile) {
      return res.status(200).json({});
    }
    
    res.json(profile);
  } catch (err) {
    console.error("Profil Getirme Hatası:", err.message);
    res.status(500).send('Server Hatası');
  }
};

// 2. Profil Güncelleme Fonksiyonu (PUT) - DEBUG MODU
const updateProfile = async (req, res) => {
  // --- KONSOL LOGLARI (Sorunu bulmak için buraya bakacağız) ---
  console.log("-------------------------------------------------");
  console.log("📡 GÜNCELLEME İSTEĞİ GELDİ");
  console.log("👤 İşlem Yapan Kullanıcı ID:", req.user ? req.user.id : 'KULLANICI BULUNAMADI!');
  
  // Gelen veriyi detaylı görelim (Hangi alanlar geliyor?)
  console.log("📦 Frontend'den Gelen Veri:", JSON.stringify(req.body, null, 2)); 

  try {
    // Frontend'den gelen verileri al
    const updates = req.body;

    // GÜVENLİK: ID ve Tarih alanlarını gelen veriden temizle
    delete updates.userId;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Veritabanı İşlemi
    const profile = await BusinessProfile.findOneAndUpdate(
      { userId: req.user.id }, // Kimi?
      { $set: updates },       // Neyi?
      { new: true, upsert: true, runValidators: true } // runValidators: Model kurallarına uymayan veriyi reddet
    );

    console.log("✅ BAŞARIYLA KAYDEDİLDİ. Profil ID:", profile._id);
    console.log("-------------------------------------------------");
    
    res.json(profile);

  } catch (err) {
    // HATA VARSA DETAYLI YAZDIR
    console.error("❌ KAYIT BAŞARISIZ OLDU!");
    console.error("Hata Detayı:", err); // Hatanın tamamını gör
    console.log("-------------------------------------------------");
    
    res.status(500).send('Server Hatası: ' + err.message);
  }
};

module.exports = {
  getProfile,
  updateProfile
};