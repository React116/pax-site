import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // src/Login.jsx içindeki handleSubmit fonksiyonu:

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const apiUrl = import.meta.env.VITE_API_URL;

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      // 1. TOKEN'I KAYDET (Bu anahtarın)
      localStorage.setItem("token", data.token);
      
      // 2. Kullanıcı bilgilerini kaydet
      localStorage.setItem("userName", data.user.name);
      if(data.user.company) localStorage.setItem("userCompany", data.user.company);

      alert("✅ Giriş Başarılı!");
      navigate('/panel'); 
    } else {
      alert("❌ Hata: " + (data.message || "Giriş başarısız"));
    }
  } catch (error) {
    console.error(error);
    alert("Sunucuya bağlanılamadı.");
  }
};


  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#001F54]">Giriş Yap</h2>
            <p className="text-slate-500 mt-2">Müşteri paneline erişin</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
            <input name="email" type="email" placeholder="E-posta Adresi" onChange={handleChange} required className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]"/>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18}/>
            <input name="password" type="password" placeholder="Şifre" onChange={handleChange} required className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]"/>
          </div>

          <button type="submit" className="w-full bg-[#001F54] text-white font-bold py-4 rounded-xl hover:bg-[#0f172a] transition-all shadow-lg flex items-center justify-center gap-2">
            Giriş Yap <ArrowRight size={20}/>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
            Hesabınız yok mu? <Link to="/kayit-ol" className="text-blue-600 font-bold hover:underline">Hemen Kayıt Olun</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;