const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User modelinin yolu. Eğer User.js modelin varsa bu çalışır.

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token'ı al (Bearer <token> formatında olduğu için boşluktan bölüyoruz)
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      // NOT: process.env.JWT_SECRET .env dosyasında tanımlı olmalı.
      // Eğer .env dosyan yoksa veya hata alırsan buraya geçici olarak 'gizlisifre' yazabilirsin ama önerilmez.
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizlisifre123');

      // Token içindeki ID'den kullanıcıyı bul
      // -password diyerek şifreyi getirme diyoruz.
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Yetkisiz erişim, token geçersiz' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Yetkisiz erişim, token yok' });
  }
};

module.exports = { protect };