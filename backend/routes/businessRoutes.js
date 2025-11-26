// MEVCUT GET İSTEĞİNİN ALTINA ŞUNU EKLE:

// @route   PUT /api/business-profile
// @desc    İşletme profilini (isActive durumu dahil) güncelle
// @access  Private (Token gerekli)
router.put('/business-profile', authMiddleware, async (req, res) => {
  try {
    const { isActive, businessName, industry } = req.body;

    // Kullanıcının profilini bul
    let profile = await BusinessProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: 'Profil bulunamadı' });
    }

    // Alanları güncelle (Eğer frontend'den geldiyse güncelle, yoksa eski hali kalsın)
    if (typeof isActive !== 'undefined') profile.isActive = isActive;
    if (businessName) profile.businessName = businessName;
    if (industry) profile.industry = industry;

    await profile.save();

    res.json(profile); // Güncellenmiş profili geri döndür
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Hatası');
  }
});