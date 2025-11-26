const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Route dosyasını çağırıyoruz
const businessRoutes = require('./routes/businessRoutes');

const app = express();

// --- MIDDLEWARE (ÖNCE BUNLAR YAZILMALI) ---
app.use(cors());
app.use(express.json()); // DÜZELTME: Bu satır en üste taşındı! Artık gelen veriyi okuyabilir.

// --- ROTALAR ---
// DÜZELTME: Adres '/api/business-profile' olarak güncellendi!
app.use('/api/business-profile', businessRoutes); 

// --- VERİTABANI BAĞLANTISI ---
mongoose.connect('mongodb+srv://admin:admin12345@cluster0.azdm782.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Veritabanına Bağlandı!'))
  .catch(err => console.log('❌ Veritabanı Hatası:', err));

// --- MODEL TANIMLARI (Eğer bu dosyada kalacaksa) ---
// Not: Normalde modeller ayrı dosyada olur ama şimdilik burada kalsın, bozmayalım.
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    // Diğer alanlar...
});
// Buradaki model tanımların aynen kalsın, elleme...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));