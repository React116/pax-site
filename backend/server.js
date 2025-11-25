// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin12345@cluster0.azdm782.mongodb.net/?appName=Cluster0')
  .then(() => console.log('✅ Veritabanına Bağlandı!'))
  .catch(err => console.log('❌ Veritabanı Hatası:', err));

// GÜNCELLEME BURADA: companyType eklendi
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  company: String,
  companyType: String, // YENİ ALAN
  phone: String
});
const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
  try {
    // GÜNCELLEME BURADA: companyType verisini de alıyoruz
    const { name, email, password, company, companyType, phone } = req.body;
    
    // YENİ ALAN ile kayıt oluşturuyoruz
    const newUser = new User({ name, email, password, company, companyType, phone });
    
    await newUser.save();

    res.status(201).json({ message: "Kayıt Başarılı!", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Kayıt olurken hata oluştu" });
  }
});

app.listen(5000, () => {
// GİRİŞ YAPMA ROTASI (LOGIN)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("--------------------------------");
    console.log("DENEME YAPILIYOR:");
    console.log("Gelen E-posta:", email);
    console.log("Gelen Şifre:", password);

    const user = await User.findOne({ email: email });

    if (user) {
      console.log("Kullanıcı Bulundu. Veritabanındaki Şifre:", user.password);
      
      // Şifre kontrolü
      // (Trim komutu boşlukları temizler, garanti olsun diye ekledik)
      if (user.password === password) {
        console.log("✅ ŞİFRE DOĞRU!");
        res.json({ 
          message: "Giriş Başarılı", 
          user: { 
            name: user.name, 
            email: user.email, 
            company: user.company 
          } 
        });
      } else {
        console.log("❌ ŞİFRE YANLIŞ! (Eşleşmedi)");
        res.status(400).json({ message: "Hatalı Şifre!" });
      }
    } else {
      console.log("❌ KULLANICI BULUNAMADI");
      res.status(404).json({ message: "Kullanıcı Bulunamadı!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});
  console.log('🚀 Server 5000 portunda çalışıyor...');
});