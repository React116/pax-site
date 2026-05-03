require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const xss = require('xss-clean');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('./models/User');
const Lead = require('./models/Lead');
const businessRoutes = require('./routes/businessRoutes');

const app = express();

// --- GÜVENLİK & PERFORMANS ---
app.use(helmet());
app.use(compression());
app.use(xss());

// --- CORS ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- VERİTABANI BAĞLANTISI ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Veritabanına Bağlandı!'))
  .catch(err => console.error('❌ Veritabanı Hatası:', err.message));

// --- RATE LIMITING ---
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Çok fazla deneme. Lütfen 15 dakika bekleyin.' }
});

const calendarLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 dakika
    max: 60,
    message: { message: 'İstek limiti aşıldı.' }
});

const leadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 5,
    message: { message: 'Bu saatte çok fazla form gönderimi. Lütfen daha sonra deneyin.' }
});

// --- TAKVİM MODELİ ---
const CalendarEventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    type: { type: String, default: 'private' },
    instructor: { type: String, default: '' },
    room: { type: String, default: 'Ana Salon' },
    status: { type: String, default: 'confirmed' },
    desc: { type: String, default: '' },
    color: { type: String, default: '#3b82f6' }
});

const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token yok, yetkisiz erişim.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token geçersiz.' });
        req.user = user;
        next();
    });
};

// --- INPUT VALIDATION YARDIMCISI ---
const validateAuthInput = (email, password) => {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return 'Geçerli bir e-posta adresi giriniz.';
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        return 'Şifre en az 6 karakter olmalıdır.';
    }
    return null;
};

// --- LOGLAMA (production'da console'u kapat) ---
const log = process.env.NODE_ENV === 'production'
    ? () => {}
    : console.log;
const logError = (msg, err) => {
    if (process.env.NODE_ENV !== 'production') console.error(msg, err?.message || err);
};

// --- ANA ROTA ---
app.get('/', (req, res) => res.json({ status: 'ok', message: 'PAX Backend v4' }));

// --- AUTH ROTALARI (rate limited) ---
app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const { name, email, password, company, phone } = req.body;

        const validationError = validateAuthInput(email, password);
        if (validationError) return res.status(400).json({ message: validationError });

        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({ message: 'Ad alanı en az 2 karakter olmalıdır.' });
        }

        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            company: company?.trim() || '',
            phone: phone?.trim() || ''
        });

        res.status(201).json({ message: 'Kayıt başarılı.' });
    } catch (e) {
        logError('Register hatası:', e);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        const validationError = validateAuthInput(email, password);
        if (validationError) return res.status(400).json({ message: validationError });

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(401).json({ message: 'E-posta veya şifre hatalı.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'E-posta veya şifre hatalı.' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({
            message: 'Giriş başarılı.',
            token,
            user: { name: user.name, company: user.company }
        });
    } catch (e) {
        logError('Login hatası:', e);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// --- LEAD FORMU ---
app.post('/api/leads', leadLimiter, async (req, res) => {
    try {
        const { name, phone, email, sector, platforms, customerCount, intent, wantsWhatsApp, utmSource, utmMedium, utmCampaign } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({ message: 'İsim alanı gereklidir.' });
        }
        if (!phone || typeof phone !== 'string') {
            return res.status(400).json({ message: 'Telefon alanı gereklidir.' });
        }
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ message: 'Geçerli bir e-posta giriniz.' });
        }

        const lead = await Lead.create({
            name: name.trim(),
            phone: phone.trim(),
            email: email.toLowerCase().trim(),
            sector: sector?.trim() || '',
            platforms: platforms?.trim() || '',
            customerCount: customerCount?.trim() || '',
            intent: intent?.trim() || '',
            wantsWhatsApp: wantsWhatsApp === true || wantsWhatsApp === 'true',
            utmSource:     utmSource?.trim()   || '',
            utmMedium:     utmMedium?.trim()   || '',
            utmCampaign:   utmCampaign?.trim() || '',
        });

        // n8n webhook (opsiyonel — env var tanımlıysa ilet)
        if (process.env.N8N_WEBHOOK_URL) {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: lead._id, ...lead.toObject() }),
            }).catch((err) => logError('n8n webhook hatası:', err));
        }

        res.status(201).json({ message: 'Talebiniz alındı. En kısa sürede dönüş yapacağız.' });
    } catch (err) {
        logError('Lead kayıt hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// --- LEAD YÖNETİMİ (auth gerekli) ---
app.get('/api/leads', authenticateToken, async (req, res) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);
        const skip  = (page - 1) * limit;
        const filter = req.query.status ? { status: req.query.status } : {};

        const [leads, total] = await Promise.all([
            Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Lead.countDocuments(filter),
        ]);
        res.json({ leads, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        logError('Lead listesi hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

app.get('/api/leads/stats', authenticateToken, async (req, res) => {
    try {
        const [total, byStatus] = await Promise.all([
            Lead.countDocuments(),
            Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        ]);
        res.json({ total, byStatus });
    } catch (err) {
        logError('Lead stats hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// --- TAKVİM ROTALARI (CRUD) ---
app.get('/api/calendar', authenticateToken, calendarLimiter, async (req, res) => {
    try {
        const events = await CalendarEvent.find({ userId: req.user.id });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Veri çekilemedi.' });
    }
});

app.post('/api/calendar', authenticateToken, calendarLimiter, async (req, res) => {
    try {
        const newEvent = await CalendarEvent.create({
            userId: req.user.id,
            ...req.body
        });
        res.status(201).json(newEvent);
    } catch (error) {
        logError('Ekleme Hatası:', error);
        res.status(500).json({ error: 'Eklenemedi.' });
    }
});

app.put('/api/calendar/:id', authenticateToken, calendarLimiter, async (req, res) => {
    try {
        const updatedEvent = await CalendarEvent.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: req.body },
            { new: true }
        );
        res.json(updatedEvent);
    } catch (error) {
        logError('Güncelleme Hatası:', error);
        res.status(500).json({ error: 'Güncellenemedi.' });
    }
});

app.delete('/api/calendar/:id', authenticateToken, calendarLimiter, async (req, res) => {
    try {
        await CalendarEvent.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Silindi.' });
    } catch (error) {
        res.status(500).json({ error: 'Silinemedi.' });
    }
});

// --- DİĞER ROTALAR ---
app.use('/api/business-profile', businessRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 PAX Backend ${PORT} portunda çalışıyor.`));
