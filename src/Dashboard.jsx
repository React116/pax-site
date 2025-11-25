import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, MessageSquare, Settings, User } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // LocalStorage'dan (tarayıcı hafızasından) kullanıcı ismini alıyoruz
  // (Giriş yaparken buraya kaydedeceğiz)
  const userName = localStorage.getItem("userName") || "Kullanıcı";
  const userCompany = localStorage.getItem("userCompany") || "Şirketim";

const handleLogout = () => {
    // 1. Hafızayı temizle
    localStorage.removeItem("userName");
    localStorage.removeItem("userCompany");
    
    // 2. Sayfayı Ana Sayfaya yönlendir ve YENİLE (Refresh)
    // (Böylece Navbar güncellenir ve tekrar Giriş/Kayıt butonları gelir)
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-64 bg-[#001F54] text-white fixed h-full hidden md:flex flex-col">
        <div className="p-6 text-2xl font-serif font-bold border-b border-blue-900">
          PAX PANEL
        </div>
        
        <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                {userName.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-sm">{userName}</div>
                <div className="text-xs text-blue-200">{userCompany}</div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
            <button className="flex items-center gap-3 w-full p-3 bg-blue-800 rounded-xl text-sm font-medium"><LayoutDashboard size={20}/> Genel Bakış</button>
            <button className="flex items-center gap-3 w-full p-3 hover:bg-blue-900 rounded-xl text-sm font-medium transition-colors text-blue-200"><MessageSquare size={20}/> AI Sohbetleri</button>
            <button className="flex items-center gap-3 w-full p-3 hover:bg-blue-900 rounded-xl text-sm font-medium transition-colors text-blue-200"><Settings size={20}/> Ayarlar</button>
        </nav>

        <div className="p-6">
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-300 hover:text-white transition-colors text-sm font-bold">
                <LogOut size={18}/> Çıkış Yap
            </button>
        </div>
      </aside>

      {/* SAĞ İÇERİK */}
      <main className="flex-1 md:ml-64 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Hoş Geldin, {userName} 👋</h1>
        
        {/* İSTATİSTİK KARTLARI */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Toplam Müşteri</div>
                <div className="text-3xl font-bold text-[#001F54]">1,240</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-xs font-bold uppercase mb-2">AI Mesaj Hakkı</div>
                <div className="text-3xl font-bold text-green-600">850 <span className="text-sm text-slate-400 font-normal">/ 1000</span></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Aktif Asistanlar</div>
                <div className="text-3xl font-bold text-blue-600">2</div>
            </div>
        </div>

        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
            <h3 className="text-xl font-bold text-slate-700 mb-2">Henüz Bir Aktivite Yok</h3>
            <p className="text-slate-500">AI asistanınız şu an bekleme modunda.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;