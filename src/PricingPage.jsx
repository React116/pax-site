import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowLeft, Zap, Star, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from './components/SEO';
import { useLanguage } from './LanguageContext';
import { fadeUp, stagger, staggerFast, sectionTitle, scaleFade, viewport } from './utils/animations';

const ScrollToTop = () => { useEffect(() => { window.scrollTo(0, 0); }, []); return null; };

/* Annual price = monthly * 12 * 0.8 (20% discount) */
const PLANS = [
  {
    key: 'basic',
    name: 'BASIC',
    icon: (active) => <Zap className={active ? 'text-green-500 fill-green-500' : 'text-green-500'} size={20} />,
    accentColor: 'bg-green-500',
    monthly: 99,
    featured: false,
    dark: false,
    btnClass: 'border-2 border-[#001F54] text-[#001F54] hover:bg-[#001F54] hover:text-white',
    btnLabel: 'Hemen Başla',
    desc: 'Yeni başlayan işletmeler ve bireysel profesyoneller için.',
    features: [
      'WhatsApp ve Web Chatbot',
      'Otomatik randevu & takip',
      'Tek sektör asistanı',
      '500 AI mesaj limiti / ay',
      'Tek kullanıcı (Admin)',
      'E-posta destek',
    ],
    checkColor: 'text-green-500',
  },
  {
    key: 'pro',
    name: 'PRO',
    icon: (active) => <Star className={active ? 'text-blue-500 fill-blue-500' : 'text-blue-500'} size={20} />,
    accentColor: 'bg-blue-500',
    monthly: 199,
    featured: true,
    dark: false,
    btnClass: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30',
    btnLabel: 'Pro Planı Seç',
    desc: 'Büyüyen işletmeler için tam kapsamlı çözüm.',
    features: [
      "Basic'teki tüm özellikler",
      'Instagram DM Entegrasyonu',
      '3 Farklı Sektör Asistanı',
      '2000 AI mesaj limiti / ay',
      '5 Personel Erişimi',
      'Öncelikli Canlı Destek',
    ],
    checkColor: 'text-blue-500',
  },
  {
    key: 'enterprise',
    name: 'ENTERPRISE',
    icon: () => <Briefcase className="text-purple-400" size={20} />,
    accentColor: 'bg-purple-500',
    monthly: 4999,
    featured: false,
    dark: true,
    btnClass: 'bg-purple-600 text-white hover:bg-purple-700',
    btnLabel: 'Bize Ulaşın',
    desc: 'Zincir işletmeler ve ajanslar için sınırsız güç.',
    features: [
      "Pro'daki tüm özellikler",
      'WhatsApp Business API & Green Tick',
      'Sınırsız Sektör & Mesaj',
      'Özel API (ERP, CRM, n8n)',
      'White-label (Markanızla Sunum)',
      '7/24 SLA Destek & Eğitim',
    ],
    checkColor: 'text-purple-400',
  },
];

const fmt = (n) => n.toLocaleString('en-US');

const PricingPage = () => {
  const { t, language } = useLanguage();
  const [annual, setAnnual] = useState(false);

  const price = (monthly) => annual ? Math.round(monthly * 12 * 0.8) : monthly;
  const period = annual ? '/yıl' : '/ay';

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <SEO title={t.seo.pricing.title} description={t.seo.pricing.desc} path="/fiyatlar" lang={language} />
      <ScrollToTop />

      {/* HEADER */}
      <div className="bg-[#001F54] py-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        {/* Subtle glow orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          initial="hidden" animate="visible"
          variants={stagger}
          className="max-w-7xl mx-auto px-6 relative z-10 text-center"
        >
          <motion.div variants={fadeUp}>
            <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors text-sm font-semibold">
              <ArrowLeft size={16} /> Ana Sayfaya Dön
            </Link>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white font-serif mb-6">
            Basit, Şeffaf Fiyatlandırma
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-blue-100 max-w-2xl mx-auto font-light mb-10">
            İşletmenizin büyüklüğüne ve ihtiyaçlarına en uygun planı seçin. Gizli ücret yok, taahhüt yok.
          </motion.p>

          {/* BILLING TOGGLE */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-4 bg-white/10 rounded-full px-2 py-2 backdrop-blur-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? 'bg-white text-[#001F54] shadow' : 'text-white'}`}
            >
              Aylık
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-white text-[#001F54] shadow' : 'text-white'}`}
            >
              Yıllık
              <span className="bg-green-400 text-[#001F54] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                %20 indirim
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <motion.div
          className="grid lg:grid-cols-3 gap-8 items-start"
          initial="hidden" animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.key}
              variants={{
                hidden:   { opacity: 0, y: 32 },
                visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{
                y: plan.featured ? -6 : -4,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              }}
              className={`rounded-2xl shadow-xl p-8 relative overflow-hidden
                ${plan.featured
                  ? 'border-2 border-blue-500 scale-105 z-10 shadow-2xl bg-white'
                  : plan.dark
                    ? 'bg-slate-900 border border-slate-800 text-white'
                    : 'bg-white border border-slate-100'
                }`}
            >
              {/* Top accent bar */}
              <div className={`h-1.5 w-full absolute top-0 left-0 ${plan.accentColor}`} />

              {plan.featured && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">
                  En Çok Tercih Edilen
                </div>
              )}

              <h3 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${plan.dark ? 'text-purple-400' : 'text-slate-800'}`}>
                {plan.icon(true)} {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>

              {/* Price */}
              <div className="flex items-baseline mb-2">
                <motion.span
                  key={`${plan.key}-${annual}`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`${plan.featured ? 'text-5xl' : 'text-4xl'} font-bold ${plan.dark ? 'text-white' : 'text-[#001F54]'}`}
                >
                  ${fmt(price(plan.monthly))}
                </motion.span>
                <span className={`ml-2 ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>{period}</span>
              </div>

              {annual && (
                <p className="text-xs text-green-500 font-semibold mb-6">
                  Aylık ${fmt(Math.round(price(plan.monthly) / 12))} — ${fmt(plan.monthly * 12 - price(plan.monthly))} tasarruf
                </p>
              )}
              {!annual && <div className="mb-6" />}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`w-full py-3 rounded-xl font-bold transition-all mb-8 ${plan.btnClass}`}
              >
                {plan.btnLabel}
              </motion.button>

              <ul className={`space-y-4 text-sm ${plan.dark ? 'text-slate-300' : 'text-slate-600'}`}>
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-3">
                    <Check size={18} className={`${plan.checkColor} shrink-0`} />
                    {i === 0 ? <strong>{f}</strong> : f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* COMPARISON TABLE */}
      <motion.div
        initial="hidden" whileInView="visible"
        variants={sectionTitle} viewport={viewport}
        className="max-w-6xl mx-auto px-6 py-24"
      >
        <h2 className="text-3xl font-bold text-center text-[#0f172a] font-serif mb-12">Detaylı Karşılaştırma</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm bg-white"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider w-1/4">Özellikler</th>
                <th className="p-6 text-center text-[#001F54] font-bold w-1/4">BASIC</th>
                <th className="p-6 text-center text-blue-600 font-bold w-1/4 bg-blue-50/50">PRO</th>
                <th className="p-6 text-center text-purple-600 font-bold w-1/4">ENTERPRISE</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600">
              <tr className="border-b border-slate-100"><td colSpan="4" className="bg-slate-50/50 p-3 px-6 font-bold text-xs text-slate-400 uppercase tracking-widest">Kanal & Kapasite</td></tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 px-6 font-medium">AI Mesaj Limiti</td>
                <td className="p-4 text-center">500 / Ay</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">2.000 / Ay</td>
                <td className="p-4 text-center font-bold text-purple-600">Sınırsız</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 px-6 font-medium">Kanallar</td>
                <td className="p-4 text-center">WhatsApp, Web</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">WhatsApp, Web, Instagram</td>
                <td className="p-4 text-center font-bold text-purple-600">Tümü + API</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 px-6 font-medium">Asistan Sayısı</td>
                <td className="p-4 text-center">1 Sektör</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">3 Sektör</td>
                <td className="p-4 text-center font-bold text-purple-600">Sınırsız</td>
              </tr>
              <tr className="border-b border-slate-100"><td colSpan="4" className="bg-slate-50/50 p-3 px-6 font-bold text-xs text-slate-400 uppercase tracking-widest">Yönetim</td></tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 px-6 font-medium">Kullanıcı Erişimi</td>
                <td className="p-4 text-center">1 (Admin)</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">5 Personel</td>
                <td className="p-4 text-center font-bold text-purple-600">Sınırsız</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 px-6 font-medium">Randevu Modülü</td>
                <td className="p-4 text-center"><Check size={18} className="mx-auto text-green-500" /></td>
                <td className="p-4 text-center bg-blue-50/30"><Check size={18} className="mx-auto text-blue-500" /></td>
                <td className="p-4 text-center"><Check size={18} className="mx-auto text-purple-500" /></td>
              </tr>
              <tr className="border-b border-slate-100"><td colSpan="4" className="bg-slate-50/50 p-3 px-6 font-bold text-xs text-slate-400 uppercase tracking-widest">Gelişmiş Özellikler</td></tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 px-6 font-medium">API & Webhooks</td>
                <td className="p-4 text-center"><X size={18} className="mx-auto text-slate-300" /></td>
                <td className="p-4 text-center bg-blue-50/30"><X size={18} className="mx-auto text-slate-300" /></td>
                <td className="p-4 text-center"><Check size={18} className="mx-auto text-purple-500" /></td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 px-6 font-medium">White-label (Kendi Markan)</td>
                <td className="p-4 text-center"><X size={18} className="mx-auto text-slate-300" /></td>
                <td className="p-4 text-center bg-blue-50/30"><X size={18} className="mx-auto text-slate-300" /></td>
                <td className="p-4 text-center"><Check size={18} className="mx-auto text-purple-500" /></td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 px-6 font-medium">Destek Seviyesi</td>
                <td className="p-4 text-center">E-posta</td>
                <td className="p-4 text-center font-bold text-blue-600 bg-blue-50/30">WhatsApp & Canlı</td>
                <td className="p-4 text-center font-bold text-purple-600">7/24 SLA + Özel Temsilci</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PricingPage;
