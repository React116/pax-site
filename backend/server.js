const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const businessRoutes = require('./routes/businessRoutes');

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 

const MONGO_URI = 'REDACTED_MONGO_URI';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Veritabanına Bağlandı!'))
  .catch(err => console.error('❌ Veritabanı Hatası:', err));

// --- YENİ EKLENEN MODEL: TAKVİM ETKİNLİĞİ ---
const CalendarEventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    desc: { type: String, default: '' },
    color: { type: String, default: '#3b82f6' } // Varsayılan mavi
});
const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);

// --- AUTH MIDDLEWARE (Kullanıcıyı Tanıma) ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) return res.status(401).json({ message: "Token yok, yetkisiz erişim." });

    jwt.verify(token, 'REDACTED_JWT_SECRET', (err, user) => {
        if (err) return res.status(403).json({ message: "Token geçersiz." });
        req.user = user;
        next();
    });
};

// --- ROTALAR ---

app.get('/', (req, res) => res.send('Backend Çalışıyor v2'));

// AUTH Rotaları (Aynen kalsın)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, company, phone } = req.body;
        const existing = await User.findOne({ email });
        if(existing) return res.status(400).json({message: "E-posta kayıtlı"});
        const user = await User.create({ name, email, password, company, phone });
        res.status(201).json({message:"Kayıt Başarılı", user});
    } catch(e) { res.status(500).json({error: e.message}); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user || user.password !== password) return res.status(401).json({message:"Hatalı giriş"});
        const token = jwt.sign({ id: user._id }, 'REDACTED_JWT_SECRET', { expiresIn: '30d' });
        res.json({message:"Giriş Başarılı", token, user: {name: user.name, company: user.company}});
    } catch(e) { res.status(500).json({error: e.message}); }
});

// --- YENİ TAKVİM ROTALARI (API ENDPOINTS) ---

// 1. Etkinlikleri Getir
app.get('/api/calendar', authenticateToken, async (req, res) => {
    try {
        // Sadece giriş yapan kullanıcının etkinliklerini bul
        const events = await CalendarEvent.find({ userId: req.user.id });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Takvim verisi çekilemedi." });
    }
});

// 2. Yeni Etkinlik Ekle
app.post('/api/calendar', authenticateToken, async (req, res) => {
    try {
        const { title, start, end, desc, color } = req.body;
        const newEvent = await CalendarEvent.create({
            userId: req.user.id,
            title,
            start,
            end,
            desc,
            color
        });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: "Etkinlik eklenemedi." });
    }
});

// 3. Etkinlik Sil
app.delete('/api/calendar/:id', authenticateToken, async (req, res) => {
    try {
        await CalendarEvent.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Silindi" });
    } catch (error) {
        res.status(500).json({ message: "Silinemedi." });
    }
});

app.use('/api/business-profile', businessRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda güncellendi!`));