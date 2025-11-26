const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const businessRoutes = require('./routes/businessRoutes');

const app = express();

// --- AYARLAR ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 

// --- VERİTABANI BAĞLANTISI ---
const MONGO_URI = 'mongodb+srv://admin:admin12345@cluster0.azdm782.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Veritabanına Bağlandı!'))
  .catch(err => console.error('❌ Veritabanı Hatası:', err));

// --- GÜNCELLENMİŞ TAKVİM MODELİ (Frontend ile Uyumlu) ---
const CalendarEventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true }, // Müşteri Adı
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    type: { type: String, default: 'private' }, // private, reformer, group...
    instructor: { type: String, default: '' },
    room: { type: String, default: 'Ana Salon' },
    status: { type: String, default: 'confirmed' }, // confirmed, pending, cancelled
    desc: { type: String, default: '' }, // Müşteri notları
    color: { type: String, default: '#3b82f6' }
});

const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token yok, yetkisiz erişim." });

    jwt.verify(token, 'gizlisifre123', (err, user) => {
        if (err) return res.status(403).json({ message: "Token geçersiz." });
        req.user = user;
        next();
    });
};

// --- ANA ROTA ---
app.get('/', (req, res) => res.send('Backend Çalışıyor v3 (Calendar Updated)'));

// --- AUTH ROTALARI ---
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
        const token = jwt.sign({ id: user._id }, 'gizlisifre123', { expiresIn: '30d' });
        res.json({message:"Giriş Başarılı", token, user: {name: user.name, company: user.company}});
    } catch(e) { res.status(500).json({error: e.message}); }
});

// --- TAKVİM ROTALARI (CRUD) ---

// 1. Etkinlikleri Getir
app.get('/api/calendar', authenticateToken, async (req, res) => {
    try {
        const events = await CalendarEvent.find({ userId: req.user.id });
        res.json(events);
    } catch (error) { res.status(500).json({ error: "Veri çekilemedi" }); }
});

// 2. Yeni Etkinlik Ekle
app.post('/api/calendar', authenticateToken, async (req, res) => {
    try {
        // Frontend'den gelen tüm veriyi (instructor, type vs.) alıyoruz
        const newEvent = await CalendarEvent.create({
            userId: req.user.id,
            ...req.body 
        });
        res.status(201).json(newEvent);
    } catch (error) { 
        console.error("Ekleme Hatası:", error);
        res.status(500).json({ error: "Eklenemedi" }); 
    }
});

// 3. Etkinlik Güncelle (Sürükle-Bırak ve Düzenleme için KRİTİK)
app.put('/api/calendar/:id', authenticateToken, async (req, res) => {
    try {
        const updatedEvent = await CalendarEvent.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, // Sadece kendi etkinliğini güncelleyebilir
            { $set: req.body },
            { new: true } // Güncellenmiş veriyi döndür
        );
        res.json(updatedEvent);
    } catch (error) { 
        console.error("Güncelleme Hatası:", error);
        res.status(500).json({ error: "Güncellenemedi" }); 
    }
});

// 4. Etkinlik Sil
app.delete('/api/calendar/:id', authenticateToken, async (req, res) => {
    try {
        await CalendarEvent.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Silindi" });
    } catch (error) { res.status(500).json({ error: "Silinemedi" }); }
});

// --- DİĞER ROTALAR ---
app.use('/api/business-profile', businessRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda yayında (Full Calendar Destekli)!`));