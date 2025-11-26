// src/pages/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Power, Settings, ChevronRight, BarChart3, Activity } from 'lucide-react';

const DashboardOverview = () => {
  const [userName, setUserName] = useState('');
  const [isBotActive, setIsBotActive] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('userName');
    if (user) setUserName(user);
  }, []);

  const toggleBot = () => setIsBotActive(!isBotActive);

  // Animasyon varyantları
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-[#0f172a] mb-2 font-serif"
        >
          Hoşgeldin, {userName} 👋
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg"
        >
          İşletmenizin anlık durumu ve kontrol paneli.
        </motion.p>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. KART: AI ASİSTAN (PREMIUM GÖRÜNÜM) */}
        <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-1">
          <div className="h-full bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
            {/* Arkaplan Efekti */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isBotActive ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isBotActive ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-100 text-slate-400'}`}>
                  <Bot size={32} />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${isBotActive ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  {isBotActive ? 'Canlı' : 'Pasif'}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">AI Asistan Kontrolü</h3>
              <p className="text-slate-500 text-sm mb-6">Botunuz şu an {isBotActive ? 'müşterileri karşılıyor ve soruları yanıtlıyor.' : 'kapalı, müşterilere otomatik yanıt verilmiyor.'}</p>
            </div>

            <button 
              onClick={toggleBot}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-95 ${
                isBotActive 
                  ? 'bg-white text-red-500 border border-red-100 hover:bg-red-50 hover:border-red-200' 
                  : 'bg-[#001F54] text-white hover:bg-[#0f172a] shadow-blue-900/20'
              }`}
            >
              <Power size={18} />
              {isBotActive ? 'Asistanı Durdur' : 'Asistanı Aktifleştir'}
            </button>
          </div>
        </motion.div>

        {/* 2. KART: AYARLAR (NAVİGASYON) */}
        <motion.div variants={item} className="col-span-1">
          <Link to="/panel/settings" className="block h-full bg-gradient-to-br from-blue-600 to-[#001F54] text-white rounded-3xl p-6 shadow-xl shadow-blue-900/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Settings size={120} />
            </div>
            
            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 border border-white/10">
                  <Settings size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ayarlar & Yapılandırma</h3>
                <p className="text-blue-100 text-sm leading-relaxed">Hizmet listesi, fiyatlandırma ve bot karakterini buradan düzenleyin.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-bold text-sm bg-white/10 w-fit px-4 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white group-hover:text-blue-900 transition-colors">
                 Düzenle <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 3. KART: İSTATİSTİKLER (COMING SOON) */}
        <motion.div variants={item} className="col-span-1">
          <div className="h-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity group">
            <div className="absolute -right-6 -bottom-6 text-slate-50 opacity-50 group-hover:scale-110 transition-transform">
               <BarChart3 size={150} />
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
               <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Canlı Analizler</h3>
            <p className="text-slate-500 text-sm mb-4">Görüşme metrikleri ve müşteri memnuniyet oranları.</p>
            <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 uppercase tracking-wide">
              Çok Yakında
            </span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default DashboardOverview;