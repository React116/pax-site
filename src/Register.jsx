import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, User, Mail, Lock, Building } from 'lucide-react';

// Telefon modülü
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    companyType: '', // Yeni alan
    phone: ''
  });

  // Sektör Listesi
  const sectors = [
    "Klinik / Sağlık / Diş",
    "Güzellik / Spa / Kuaför",
    "E-Ticaret / Perakende",
    "Eğitim / Danışmanlık",
    "Turizm / Otel / Seyahat",
    "Gayrimenkul / Emlak",
    "Yazılım / Teknoloji / Ajans",
    "Restoran / Cafe / Gıda",
    "Lojistik / Taşımacılık",
    "Otomotiv / Galeri",
    "Diğer"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 127.0.0.1 kullanıyoruz (localhost hatasını önlemek için)
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Kayıt Başarılı! Hoş geldin.");
        navigate('/');
      } else {
        alert("❌ Hata: " + data.message);
      }
    } catch (error) {
      console.error("Bağlantı Hatası:", error);
      alert("Sunucuyla iletişim kurulamadı.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#001F54]">Kayıt Ol</h2>
            <p className="text-slate-500 mt-2">PAX Group ailesine katılın</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ad Soyad */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-400" size={18}/>
            <input name="name" placeholder="Ad Soyad" onChange={handleChange} required className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]"/>
          </div>
          
          {/* Şirket Adı */}
          <div className="relative">
            <Building className="absolute left-3 top-3.5 text-slate-400" size={18}/>
            <input name="company" placeholder="Şirket Adı" onChange={handleChange} required className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]"/>
          </div>

          {/* Şirket Türü (Dropdown) */}
          <div className="relative">
            <select 
              name="companyType" 
              onChange={handleChange} 
              required 
              className="w-full pl-3 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54] text-slate-600 bg-white"
            >
              <option value="">Şirket Türü Seçiniz...</option>
              {sectors.map((sector, index) => (
                <option key={index} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {/* Telefon (Bayraklı Modül) */}
          <div className="w-full">
            <PhoneInput
              country={'me'} // Varsayılan Karadağ (Montenegro)
              value={formData.phone}
              onChange={phone => setFormData({ ...formData, phone })}
              inputStyle={{
                width: '100%',
                height: '50px',
                borderRadius: '0.75rem',
                borderColor: '#e2e8f0',
                paddingLeft: '48px'
              }}
              buttonStyle={{
                borderRadius: '0.75rem 0 0 0.75rem',
                borderColor: '#e2e8f0',
                backgroundColor: 'white'
              }}
              dropdownStyle={{
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              preferredCountries={['me', 'tr', 'de', 'gb', 'us']} // En üstte çıkacak ülkeler
              enableSearch={true} // Ülke arama özelliği
            />
          </div>

          {/* E-posta */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
            <input name="email" type="email" placeholder="E-posta" onChange={handleChange} required className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]"/>
          </div>

          {/* Şifre */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18}/>
            <input name="password" type="password" placeholder="Şifre" onChange={handleChange} required className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]"/>
          </div>

          <button type="submit" className="w-full bg-[#001F54] text-white font-bold py-4 rounded-xl hover:bg-[#0f172a] transition-all shadow-lg flex items-center justify-center gap-2 mt-6">
            Hesap Oluştur <ArrowRight size={20}/>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
            Zaten hesabınız var mı? <Link to="/" className="text-blue-600 font-bold hover:underline">Ana Sayfaya Dön</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;