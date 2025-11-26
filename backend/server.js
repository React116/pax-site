const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // User modelini çağırdık
const businessRoutes = require('./routes/businessRoutes');

const app = express();

// --- MIDDLEWARE ---
// Cors ayarı: Her yerden gelen isteği kabul et (Sorunu çözmek için en geniş izin)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 

// --- VERİTABANI BAĞLANTISI ---
// Şifreni buraya hard-code yazdım ki env hatası olmasın, çalışınca gizleriz.
const MONGO_URI = 'REDACTED_MONGO_URI';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Veritabanına Bağlandı!'))
  .catch(err => console.error('❌ Veritabanı Hatası:', err));

// --- TEST ROTASI (Backend çalışıyor mu diye) ---
app.get('/', (req, res) => {
    res.send('Backend Sunucusu Çalışıyor! PAX GROUP');
});

// --- AUTH ROTALARI (Giriş ve Kayıt) ---

// 1. KAYIT OL (Register)
app.post('/api/auth/register', async (req, res) => {
    console.log("📝 Kayıt isteği geldi:", req.body); // Log ekledik
    try {
        const { name, email, password, company, phone, companyType } = req.body;

        // E-posta kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
        }

        // Yeni kullanıcı oluştur
        const newUser = await User.create({ 
            name, 
            email, 
            password, // Not: İlerde şifreleme eklenmeli
            company: company || '',
            // Diğer alanlar modelde yoksa hata vermez, Mongo esnektir
        });

        res.status(201).json({ message: "Kayıt başarılı", user: newUser });
    } catch (error) {
        console.error("Kayıt Hatası:", error);
        res.status(500).json({ message: "Sunucu hatası oluştu.", error: error.message });
    }
});

// 2. GİRİŞ YAP (Login)
app.post('/api/auth/login', async (req, res) => {
    console.log("🔑 Giriş isteği geldi:", req.body.email);
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Hatalı şifre." });
        }

        // Token oluştur
        const token = jwt.sign({ id: user._id }, 'REDACTED_JWT_SECRET', { expiresIn: '30d' });

        res.json({
            message: "Giriş başarılı",
            token,
            user: { name: user.name, company: user.company }
        });

    } catch (error) {
        console.error("Giriş Hatası:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    }
});

// --- DİĞER ROTALAR ---
app.use('/api/business-profile', businessRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda yayında!`));