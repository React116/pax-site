const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";

    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token yok, yetkisiz erişim." });
    }

    const token = auth.split(" ")[1];

    // Login token'ını hangi secret ile imzalıyorsan burada da o olmalı
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "gizlisifre123");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token geçersiz.", error: err.message });
  }
};

module.exports = { protect };
