import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, User, Mail, Lock, Building } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SEO from './components/SEO';
import { useLanguage } from './LanguageContext';
import { useToast, ToastContainer } from './components/Toast';

const sectors = [
  'Klinik / Sağlık / Diş', 'Güzellik / Spa / Kuaför', 'E-Ticaret / Perakende',
  'Eğitim / Danışmanlık', 'Turizm / Otel / Seyahat', 'Gayrimenkul / Emlak',
  'Yazılım / Teknoloji / Ajans', 'Restoran / Cafe / Gıda', 'Lojistik / Taşımacılık',
  'Otomotiv / Galeri', 'Diğer'
];

const Register = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toasts, remove, toast } = useToast();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', company: '', companyType: '', phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const BASE_URL = import.meta.env.VITE_API_URL || 'https://pax-backend-9m4q.onrender.com/api';

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
        setTimeout(() => navigate('/giris-yap'), 1200);
      } else {
        toast.error(data.message || 'Kayıt sırasında bir hata oluştu.');
      }
    } catch {
      toast.error('Sunucuyla iletişim kurulamadı. Lütfen 1 dakika bekleyip tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-6">
      <SEO title={t.seo.register.title} description={t.seo.register.desc} path="/kayit-ol" lang={language} />
      <ToastContainer toasts={toasts} onRemove={remove} />

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#001F54]">Kayıt Ol</h2>
          <p className="text-slate-500 mt-2">PAX Group ailesine katılın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input name="name" placeholder="Ad Soyad" onChange={handleChange} required
              className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]" />
          </div>

          <div className="relative">
            <Building className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input name="company" placeholder="Şirket Adı" onChange={handleChange} required
              className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]" />
          </div>

          <div className="relative">
            <select name="companyType" onChange={handleChange} required
              className="w-full pl-3 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54] text-slate-600 bg-white">
              <option value="">Şirket Türü Seçiniz...</option>
              {sectors.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="w-full">
            <PhoneInput
              country="tr"
              value={formData.phone}
              onChange={phone => setFormData({ ...formData, phone })}
              inputStyle={{ width: '100%', height: '50px', borderRadius: '0.75rem', borderColor: '#e2e8f0', paddingLeft: '48px' }}
              buttonStyle={{ borderRadius: '0.75rem 0 0 0.75rem', borderColor: '#e2e8f0', backgroundColor: 'white' }}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input name="email" type="email" placeholder="E-posta" onChange={handleChange} required
              className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input name="password" type="password" placeholder="Şifre (min. 6 karakter)" onChange={handleChange} required
              className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#001F54] text-white font-bold py-4 rounded-xl hover:bg-[#0f172a] transition-all shadow-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
            {loading
              ? 'İşleniyor...'
              : <><span>Hesap Oluştur</span><ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Zaten hesabınız var mı?{' '}
          <Link to="/giris-yap" className="text-blue-600 font-bold hover:underline">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
