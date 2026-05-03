import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import SEO from './components/SEO';
import { useLanguage } from './LanguageContext';
import { useToast, ToastContainer } from './components/Toast';

const Login = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { toasts, remove, toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        if (data.user.company) localStorage.setItem('userCompany', data.user.company);
        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
        setTimeout(() => navigate('/panel'), 800);
      } else {
        toast.error(data.message || 'Giriş başarısız.');
      }
    } catch {
      toast.error('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-6">
      <SEO title={t.seo.login.title} description={t.seo.login.desc} path="/giris-yap" lang={language} />
      <ToastContainer toasts={toasts} onRemove={remove} />

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#001F54]">Giriş Yap</h2>
          <p className="text-slate-500 mt-2">Müşteri paneline erişin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              name="email" type="email" placeholder="E-posta Adresi"
              onChange={handleChange} required
              className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              name="password" type="password" placeholder="Şifre"
              onChange={handleChange} required
              className="w-full pl-10 p-3.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#001F54]"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#001F54] text-white font-bold py-4 rounded-xl hover:bg-[#0f172a] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : <><span>Giriş Yap</span><ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Hesabınız yok mu?{' '}
          <Link to="/kayit-ol" className="text-blue-600 font-bold hover:underline">Hemen Kayıt Olun</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
