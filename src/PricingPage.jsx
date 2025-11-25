import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowLeft, Zap, Star, Briefcase } from 'lucide-react';

const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <ScrollToTop />
      
      {/* HEADER */}
      
      <div className="bg-[#001F54] py-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-6">
            Basit, Şeffaf Fiyatlandırma
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
            İşletmenizin büyüklüğüne ve ihtiyaçlarına en uygun planı seçin. Gizli ücret yok, taahhüt yok.
          </p>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* PLAN 1: BASIC */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="h-2 w-full bg-green-500 absolute top-0 left-0"></div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Zap className="text-green-500 fill-green-500" size={20} /> BASIC
            </h3>
            <p className="text-slate-500 text-sm mb-6">Yeni başlayan işletmeler ve bireysel profesyoneller için.</p>
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-[#001F54]">$99</span>
              <span className="text-slate-500 ml-2">/ay</span>
            </div>
            
            <button className="w-full py-3 rounded-lg border-2 border-[#001F54] text-[#001F54] font-bold hover:bg-[#001F54] hover:text-white transition-all mb-8">
              Hemen Başla
            </button>

            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0" /> WhatsApp ve Web Chatbot</li>
              <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0" /> Otomatik randevu & takip</li>
              <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0" /> Tek sektör asistanı</li>
              <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0" /> 500 AI mesaj limiti / ay</li>
              <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0" /> Tek kullanıcı (Admin)</li>
              <li className="flex gap-3"><Check size={18} className="text-green-500 shrink-0" /> E-posta destek</li>
            </ul>
          </div>

          {/* PLAN 2: PRO (POPULAR) */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500 p-8 transform scale-105 z-10 relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
              En Çok Tercih Edilen
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Star className="text-blue-500 fill-blue-500" size={20} /> PRO
            </h3>
            <p className="text-slate-500 text-sm mb-6">Büyüyen işletmeler için tam kapsamlı çözüm.</p>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold text-[#001F54]">$199</span>
              <span className="text-slate-500 ml-2">/ay</span>
            </div>
            
            <button className="w-full py-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all mb-8">
              Pro Planı Seç
            </button>

            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> <strong>Basic'teki tüm özellikler</strong></li>
              <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> Instagram DM Entegrasyonu</li>
              <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> 3 Farklı Sektör Asistanı</li>
              <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> 2000 AI mesaj limiti / ay</li>
              <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> 5 Personel Erişimi</li>
              <li className="flex gap-3"><Check size={18} className="text-blue-500 shrink-0" /> Öncelikli Canlı Destek</li>
            </ul>
          </div>

          {/* PLAN 3: ENTERPRISE (GÜNCELLENDİ) */}
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 hover:-translate-y-1 transition-transform duration-300 relative text-white">
            <div className="h-2 w-full bg-purple-500 absolute top-0 left-0"></div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-purple-400">
              <Briefcase className="text-purple-500" size={20} /> ENTERPRISE
            </h3>
            <p className="text-slate-400 text-sm mb-6">Zincir işletmeler ve ajanslar için sınırsız güç.</p>
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-white">$4,999</span>
              <span className="text-slate-400 ml-2">/ay</span>
            </div>
            
            <button className="w-full py-3 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all mb-8">
              Bize Ulaşın
            </button>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0" /> <strong>Pro'daki tüm özellikler</strong></li>
              <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0" /> WhatsApp Business API & Green Tick</li>
              <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0" /> Sınırsız Sektör & Mesaj</li>
              <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0" /> Özel API (ERP, CRM, n8n)</li>
              <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0" /> White-label (Markanızla Sunum)</li>
              <li className="flex gap-3"><Check size={18} className="text-purple-400 shrink-0" /> 7/24 SLA Destek & Eğitim</li>
            </ul>
          </div>

        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center text-[#0f172a] font-serif mb-12">Detaylı Karşılaştırma</h2>
        
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider w-1/4">Özellikler</th>
                <th className="p-6 text-center text-[#001F54] font-bold w-1/4">BASIC ($99)</th>
                <th className="p-6 text-center text-blue-600 font-bold w-1/4 bg-blue-50/50">PRO ($199)</th>
                <th className="p-6 text-center text-purple-600 font-bold w-1/4">ENTERPRISE ($4,999)</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600">
              {/* Kanal & Mesaj */}
              <tr className="border-b border-slate-100"><td colSpan="4" className="bg-slate-50/50 p-3 px-6 font-bold text-xs text-slate-400 uppercase tracking-widest">Kanal & Kapasite</td></tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 px-6 font-medium">AI Mesaj Limiti</td>
                <td className="p-4 text-center">500 / Ay</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">2.000 / Ay</td>
                <td className="p-4 text-center font-bold text-purple-600">Sınırsız</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 px-6 font-medium">Kanallar</td>
                <td className="p-4 text-center">WhatsApp, Web</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">WhatsApp, Web, Instagram</td>
                <td className="p-4 text-center font-bold text-purple-600">Tümü + API</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 px-6 font-medium">Asistan Sayısı</td>
                <td className="p-4 text-center">1 Sektör</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">3 Sektör</td>
                <td className="p-4 text-center font-bold text-purple-600">Sınırsız</td>
              </tr>

              {/* Erişim & Yönetim */}
              <tr className="border-b border-slate-100"><td colSpan="4" className="bg-slate-50/50 p-3 px-6 font-bold text-xs text-slate-400 uppercase tracking-widest">Yönetim</td></tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 px-6 font-medium">Kullanıcı Erişimi</td>
                <td className="p-4 text-center">1 (Admin)</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">5 Personel</td>
                <td className="p-4 text-center font-bold text-purple-600">Sınırsız</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 px-6 font-medium">Randevu Modülü</td>
                <td className="p-4 text-center"><Check size={18} className="mx-auto text-green-500" /></td>
                <td className="p-4 text-center bg-blue-50/30"><Check size={18} className="mx-auto text-blue-500" /></td>
                <td className="p-4 text-center"><Check size={18} className="mx-auto text-purple-500" /></td>
              </tr>

              {/* Gelişmiş */}
              <tr className="border-b border-slate-100"><td colSpan="4" className="bg-slate-50/50 p-3 px-6 font-bold text-xs text-slate-400 uppercase tracking-widest">Gelişmiş Özellikler</td></tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 px-6 font-medium">API & Webhooks</td>
                <td className="p-4 text-center"><X size={18} className="mx-auto text-slate-300" /></td>
                <td className="p-4 text-center bg-blue-50/30"><X size={18} className="mx-auto text-slate-300" /></td>
                <td className="p-4 text-center"><Check size={18} className="mx-auto text-purple-500" /></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 px-6 font-medium">White-label (Kendi Markan)</td>
                <td className="p-4 text-center"><X size={18} className="mx-auto text-slate-300" /></td>
                <td className="p-4 text-center bg-blue-50/30"><X size={18} className="mx-auto text-slate-300" /></td>
                <td className="p-4 text-center"><Check size={18} className="mx-auto text-purple-500" /></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 px-6 font-medium">Destek Seviyesi</td>
                <td className="p-4 text-center">E-posta</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">WhatsApp & Canlı</td>
                <td className="p-4 text-center font-bold text-purple-600">7/24 SLA + Özel Temsilci</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PricingPage;