const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const isProd = process.env.NODE_ENV === 'production';

const validateAuthInput = (email, password) => {
  if (!email || typeof email !== 'string' || !email.includes('@'))
    return 'Geçerli bir e-posta adresi giriniz.';
  if (!password || typeof password !== 'string' || password.length < 6)
    return 'Şifre en az 6 karakter olmalıdır.';
  return null;
};

const register = async (req, res) => {
  try {
    const { name, email, password, company, phone } = req.body;

    const validationError = validateAuthInput(email, password);
    if (validationError) return res.status(400).json({ message: validationError });

    if (!name || typeof name !== 'string' || name.trim().length < 2)
      return res.status(400).json({ message: 'Ad alanı en az 2 karakter olmalıdır.' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      company: company?.trim() || '',
      phone: phone?.trim() || '',
    });

    res.status(201).json({ message: 'Kayıt başarılı.' });
  } catch (err) {
    if (!isProd) console.error('Register hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateAuthInput(email, password);
    if (validationError) return res.status(400).json({ message: validationError });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'E-posta veya şifre hatalı.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'E-posta veya şifre hatalı.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Giriş başarılı.',
      token,
      user: { name: user.name, company: user.company, role: user.role },
    });
  } catch (err) {
    if (!isProd) console.error('Login hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { register, login };
