// src/pages/DashboardOverview.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Power, Settings, ChevronRight, BarChart3, Activity } from 'lucide-react';

const DashboardOverview = () => {
  const [userName, setUserName] = useState('');
  const [isBotActive, setIsBotActive] = useState(false);
  const [loadingBot, setLoadingBot] = useState(false);

  // BURAYA KENDİ RENDER URL'Nİ YAZ
  const API_URL = "https://senin-backend-urlin.onrender.com/api"; 
  const token = localStorage.getItem('token');

  useEffect(() => {
    const user = localStorage.getItem('userName');
    if (user) setUserName(user);
    fetchBotStatus();
  }, []);

  const fetchBotStatus = async () => {
    if(!token) return;
    try {
      const res = await fetch(`${API_URL}/business`, { headers: { 'x-auth-token': token } });
      const data = await res.json();
      if(data.profile && data.profile.aiConfig) {
        setIsBotActive(data.profile.aiConfig.isActive);
      }
    } catch(err) { console.error(err); }
  };

  const toggleBot = async () => {
    setLoadingBot(true);
    const newState = !isBotActive;
    
    try {
      // 1. Önce mevcut veriyi çek
      const res = await fetch(`${API_URL}/business`, { headers: { 'x-auth-token': token } });
      const data = await res.json();
      
      // 2. Sadece aktiflik durumunu değiştir
      const updatedProfile = {
        ...data.profile,
        aiConfig: { ...data.profile.aiConfig, isActive: newState }
      };

      // 3. Güncellenmiş veriyi geri gönder
      await fetch(`${API_URL}/business`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(updatedProfile)
      });

      // 4. Ekranda güncelle
      setIsBotActive(newState);
    } catch(err) {
      console.error("Bot durumu değiştirilemedi", err);
      alert("Bot durumu değiştirilemedi, lütfen tekrar deneyin.");
    } finally {
      setLoadingBot(false);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-10">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-bold text-[#0f172a] mb-2 font-serif">Hoşgeldin, {userName} 👋</motion.h1>
        <p className="text-slate-500 text-lg">İşletmenizin anlık durumu ve kontrol paneli.</p>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* BOT KARTI */}
        <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-1">
          <div className="h-full bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
             <div className={`absolute inset-0 transition-opacity duration-500 ${isBotActive ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isBotActive ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-100 text-slate-400'}`}><Bot size={32} /></div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${isBotActive ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{isBotActive ? 'Canlı' : 'Pasif'}</div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">AI Asistan Kontrolü</h3>
              <p className="text-slate-500 text-sm mb-6">Botunuz şu an {isBotActive ? 'yanıt veriyor.' : 'devre dışı.'}</p>
            </div>
            <button onClick={toggleBot} disabled={loadingBot} className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${isBotActive ? 'bg-white text-red-500 border border-red-100 hover:bg-red-50' : 'bg-[#001F54] text-white hover:bg-[#0f172a]'}`}>
              <Power size={18} /> {loadingBot ? 'İşleniyor...' : (isBotActive ? 'Asistanı Durdur' : 'Asistanı Aktifleştir')}
            </button>
          </div>
        </motion.div>

        {/* AYARLAR KARTI */}
        <motion.div variants={item} className="col-span-1">
          <Link to="/panel/settings" className="block h-full bg-gradient-to-br from-blue-600 to-[#001F54] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20"><Settings size={120} /></div>
            <div className="flex flex-col h-full justify-between relative z-10">
              <div><div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4"><Settings size={24} className="text-white" /></div><h3 className="text-xl font-bold mb-2">Ayarlar & Yapılandırma</h3><p className="text-blue-100 text-sm">Hizmet listesi ve bot karakterini düzenleyin.</p></div>
              <div className="mt-6 flex items-center gap-2 font-bold text-sm bg-white/10 w-fit px-4 py-2 rounded-lg group-hover:bg-white group-hover:text-blue-900 transition-colors">Düzenle <ChevronRight size={16} /></div>
            </div>
          </Link>
        </motion.div>

        {/* ANALİZ KARTI */}
        <motion.div variants={item} className="col-span-1">
          <div className="h-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden opacity-70 cursor-not-allowed">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4"><Activity size={24} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Canlı Analizler</h3>
            <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 uppercase">Çok Yakında</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;