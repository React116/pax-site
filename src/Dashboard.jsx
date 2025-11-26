import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Settings, BarChart3, Bot, UserCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // LocalStorage'dan kullanıcı ismini al
    const user = localStorage.getItem('userName');
    if (user) {
      setUserName(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/giris-yap');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* ÜST BAŞLIK */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#001F54]">Hoşgeldin, {userName} 👋</h1>
            <p className="text-slate-500 mt-1">İşletmeni buradan yönetebilirsin.</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>

        {/* KARTLAR GRİD YAPISI */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. KART: İŞLETME AYARLARI (BİZİM İÇİN ÖNEMLİ OLAN BU) */}
          <Link to="/settings" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Settings size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">İşletme & AI Ayarları</h3>
            <p className="text-slate-500 text-sm mb-4">Hizmetlerini ekle, fiyatlarını güncelle ve AI asistanının nasıl konuşacağını belirle.</p>
            <span className="text-blue-600 font-bold text-sm flex items-center gap-1">Yapılandır &rarr;</span>
          </Link>

          {/* 2. KART: İSTATİSTİKLER (GELECEKTE EKLENECEK) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 opacity-60 cursor-not-allowed">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">İstatistikler</h3>
            <p className="text-slate-500 text-sm">Görüşme sayıları ve müşteri analizleri çok yakında burada olacak.</p>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 mt-2 inline-block">Yakında</span>
          </div>

          {/* 3. KART: BOT DURUMU */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
              <Bot size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Asistan Durumu</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-700 font-bold text-sm">Aktif & Çalışıyor</span>
            </div>
            <p className="text-slate-500 text-sm">Botunuz şu anda müşterilere yanıt vermeye hazır.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;