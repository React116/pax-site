import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ChevronRight, Bot, Power, Settings, MessageSquare, Users, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast, ToastContainer } from '../components/Toast';
import { staggerFast, fadeUp } from '../utils/animations';

const DashboardOverview = () => {
  const [businessName, setBusinessName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, remove, toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/business-profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setBusinessName(data.businessName || 'İşletme');
          setIsActive(data.isActive || false);
        }
      } catch { /* silent */ }
    };
    fetchProfile();
  }, []);

  const toggleBotStatus = async () => {
    setLoading(true);
    const newStatus = !isActive;
    setIsActive(newStatus);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/business-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: newStatus })
      });
      if (!response.ok) throw new Error();
      toast.success(`Asistan ${newStatus ? 'aktifleştirildi' : 'durduruldu'}.`);
    } catch {
      toast.error('Bağlantı hatası. Değişiklik kaydedilemedi.');
      setIsActive(!newStatus);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { to: '/panel/conversations', icon: <MessageSquare size={18} />, label: 'Konuşmalar',     color: 'bg-indigo-50 text-indigo-600' },
    { to: '/panel/leads',         icon: <Users size={18} />,         label: 'Leads',           color: 'bg-teal-50   text-teal-600'   },
    { to: '/panel/appointments',  icon: <CalendarCheck size={18} />, label: 'Randevular',      color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-3xl font-serif font-bold text-[#001F54]">
          Hoşgeldin, {businessName}
        </h1>
        <p className="text-slate-500 mt-2">İşletmenizin anlık durumu ve kontrol paneli.</p>
      </motion.div>

      {/* Ana kartlar */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial="hidden" animate="visible"
        variants={staggerFast}
      >
        {/* AI ASISTAN KONTROLÜ */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -4, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
              <Bot size={24} />
            </div>
            <motion.span
              key={String(isActive)}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
            >
              {isActive ? 'AKTİF' : 'PASİF'}
            </motion.span>
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-1">AI Asistan Kontrolü</h3>
          <p className="text-sm text-slate-500 mb-6">
            {isActive ? 'Botunuz çalışıyor ve müşterileri yanıtlıyor.' : 'Botunuz şu an devre dışı.'}
          </p>
          <motion.button
            onClick={toggleBotStatus}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
              isActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                : 'bg-[#001F54] text-white hover:bg-[#0f172a] shadow-lg shadow-blue-900/20'
            }`}
          >
            <Power size={18} />
            {loading ? 'İşleniyor...' : isActive ? 'Asistanı Durdur' : 'Asistanı Aktifleştir'}
          </motion.button>
        </motion.div>

        {/* AYARLAR */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -4, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
          className="bg-[#1e3a8a] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group cursor-default"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Settings size={120} />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-white/10 w-fit rounded-xl mb-4 backdrop-blur-sm">
              <Settings size={24} className="text-blue-200" />
            </div>
            <h3 className="text-lg font-bold mb-1">Ayarlar & Yapılandırma</h3>
            <p className="text-blue-200 text-sm mb-6">Hizmet listesi ve bot karakterini düzenleyin.</p>
            <Link
              to="/panel/settings"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              Düzenle <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* CANLI ANALİZLER */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -4, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="p-3 bg-purple-50 text-purple-600 w-fit rounded-xl mb-4">
            <Activity size={24} />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-1">Canlı Analizler</h3>
          <p className="text-sm text-slate-400 mb-3">Mesaj ve randevu istatistikleri burada görünecek.</p>
          <div className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">
            Çok Yakında
          </div>
        </motion.div>
      </motion.div>

      {/* Hızlı bağlantılar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Hızlı Erişim</p>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map((item) => (
            <motion.div key={item.to} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
              <Link
                to={item.to}
                className="flex items-center gap-2 bg-white border border-slate-100 hover:border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
