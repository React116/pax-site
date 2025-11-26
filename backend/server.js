const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // .env dosyasını okumak için (bunu kurman lazım: npm install dotenv)

// Route Dosyaları
const businessRoutes = require('./routes/businessRoutes');
// EĞER authRoutes dosyan varsa onu çağır. Yoksa aşağıda geçici olarak yazdım.
// const authRoutes = require('./routes/authRoutes'); 

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Güvenlik için domain kısıtlaması daha sonra eklenebilir
app.use(express.json()); 

// --- VERİTABANI BAĞLANTISI ---
// Güvenlik: Şifreyi buraya açık yazma, process.env kullan
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin12345@cluster0.azdm782.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Veritabanına Bağlandı!'))
  .catch(err => console.error('❌ Veritabanı Hatası:', err));

// --- ROTALAR ---
app.use('/api/business-profile', businessRoutes);

// !!! EKSİK OLAN KISIM: LOGIN VE REGISTER ROTALARI !!!
// Normalde bunları ayrı bir 'routes/authRoutes.js' dosyasında tutmalısın.
// Örnek olarak buraya ekliyorum, kendi Auth controller'ını bağlamalısın.
const User = require('./models/User'); // User modelin olduğunu varsayıyorum
const jwt = require('jsonwebtoken');

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, company } = req.body;
        // Basit kayıt mantığı (Şifre hashleme eklenmeli!)
        const user = await User.create({ name, email, password, company }); 
        res.status(201).json({ message: "Kayıt başarılı", user });
    } catch (error) {
        res.status(500).json({ message: "Kayıt hatası", error: error.message });
    }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || user.password !== password) { // Not: Gerçek projede bcrypt.compare kullan
            return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
        }

        // Token oluştur
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'gizlisifre', { expiresIn: '30d' });
        
        res.json({ 
            message: "Giriş başarılı",
            token, 
            user: { name: user.name, company: user.company } 
        });
    } catch (error) {
        res.status(500).json({ message: "Giriş hatası", error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));