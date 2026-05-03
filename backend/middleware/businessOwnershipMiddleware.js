const BusinessProfile = require('../models/BusinessProfile');

/**
 * protect() middleware'inden sonra çalışır (req.user zorunlu).
 * Kullanıcının BusinessProfile'ını bulur; yoksa otomatik oluşturur.
 * req.businessId ve req.business'ı atar.
 */
const attachBusiness = async (req, res, next) => {
  try {
    let profile = await BusinessProfile.findOne({ userId: req.user.id });

    if (!profile) {
      // Kullanıcı henüz işletme kurulumunu tamamlamamış — boş profil oluştur
      profile = await BusinessProfile.create({ userId: req.user.id });
    }

    req.businessId = profile._id;
    req.business   = profile;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { attachBusiness };
