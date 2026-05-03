require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const compression = require('compression');

const connectDB  = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes     = require('./routes/authRoutes');
const leadRoutes     = require('./routes/leadRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const businessRoutes = require('./routes/businessRoutes');
const serviceRoutes     = require('./routes/serviceRoutes');
const staffRoutes       = require('./routes/staffRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Veritabanı bağlantısı
connectDB();

const app = express();

// --- GÜVENLİK & PERFORMANS ---
app.use(helmet());
app.use(compression());

// --- CORS ---
const ALLOWED_ORIGINS = [
  'https://www.paxgroupglobal.com',
  'https://paxgroupglobal.com',
  'http://localhost:5173',
  'http://localhost:4173',
];
if (process.env.FRONTEND_URL) ALLOWED_ORIGINS.push(process.env.FRONTEND_URL);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('CORS: izin verilmeyen kaynak — ' + origin));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// --- ROTALAR ---
app.get('/', (req, res) => res.json({ status: 'ok', message: 'PAX Backend v5' }));

app.use('/api/auth',             authRoutes);
app.use('/api/leads',            leadRoutes);
app.use('/api/calendar',         calendarRoutes);
app.use('/api/business-profile', businessRoutes);
app.use('/api/services',         serviceRoutes);
app.use('/api/staff',            staffRoutes);
app.use('/api/appointments',     appointmentRoutes);

// --- HATA YÖNETİMİ ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
