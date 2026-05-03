import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ChevronRight, Bot, Power, Settings } from 'lucide-react';
import { useToast, ToastContainer } from '../components/Toast';

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

  return (
    <div className="space-y-8">
      <ToastContainer toasts={toasts} onRemove={remove} />

      <div>
        <h1 className="text-3xl font-serif font-bold text-[#001F54]">
          Hoşgeldin, {businessName} 👋
        </h1>
        <p className="text-slate-500 mt-2">İşletmenizin anlık durumu ve kontrol paneli.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* AI ASISTAN KONTROLÜ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
              <Bot size={24} />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {isActive ? 'AKTİF' : 'PASİF'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-1">AI Asistan Kontrolü</h3>
          <p className="text-sm text-slate-500 mb-6">
            {isActive ? 'Botunuz çalışıyor ve müşterileri yanıtlıyor.' : 'Botunuz şu an devre dışı.'}
          </p>
          <button
            onClick={toggleBotStatus}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
              isActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                : 'bg-[#001F54] text-white hover:bg-[#0f172a] shadow-lg shadow-blue-900/20'
            }`}
          >
            <Power size={18} />
            {loading ? 'İşleniyor...' : isActive ? 'Asistanı Durdur' : 'Asistanı Aktifleştir'}
          </button>
        </div>

        {/* AYARLAR */}
        <div className="bg-[#1e3a8a] p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
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
        </div>

        {/* CANLI ANALİZLER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <div className="p-3 bg-purple-50 text-purple-600 w-fit rounded-xl mb-4">
            <Activity size={24} />
          </div>
          <h3 className="text-lg font-bold text-[#0f172a] mb-1">Canlı Analizler</h3>
          <p className="text-sm text-slate-400 mb-3">Mesaj ve randevu istatistikleri burada görünecek.</p>
          <div className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">
            Çok Yakında
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
