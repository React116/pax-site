import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LogOut, Settings, BarChart3, Bot, LayoutDashboard, 
  ChevronRight, Power, Globe, Menu, X 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [isBotActive, setIsBotActive] = useState(false); // Bot durumu için state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('userName');
    if (user) setUserName(user);
    
    // İleride buraya backend'den botun gerçek durumunu çeken kod gelecek
    // şimdilik varsayılan kapalı (false) veya local'den okuyabiliriz.
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/giris-yap');
    window.location.reload();
  };

  const toggleBot = () => {
    setIsBotActive(!isBotActive);
    // Burada ileride backend'e istek atacağız: /api/bot/toggle
  };

  // Sidebar Link Bileşeni
  const SidebarLink = ({ to, icon: Icon, label, active }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-[#112240] hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* --- SIDEBAR (SOL MENÜ) --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#001F54] text-white transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static flex flex-col`}>
        
        {/* Logo Alanı */}
        <div className="h-24 flex items-center px-8 border-b border-white/10">
          <span className="text-2xl font-serif font-bold tracking-tight">PAX PANEL</span>
        </div>

        {/* Menü Linkleri */}
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 mt-4">Yönetim</div>
          <SidebarLink to="/panel" icon={LayoutDashboard} label="Genel Bakış" active={location.pathname === '/panel'} />
          <SidebarLink to="/settings" icon={Settings} label="İşletme Ayarları" active={location.pathname === '/settings'} />
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 mt-8">Analiz</div>
          <SidebarLink to="#" icon={BarChart3} label="İstatistikler (Yakında)" />
        </div>

        {/* Alt Kısım */}
        <div className="p-4 border-t border-white/10 bg-[#0a192f]">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 px-2 transition-colors">
            <Globe size={16} /> Web Sitesine Dön
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* --- ANA İÇERİK (SAĞ TARAF) --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header (Mobil İçin) */}
        <header className="md:hidden bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4">
           <span className="font-bold text-[#001F54]">PAX GROUP</span>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
             {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
           </button>
        </header>

        {/* İçerik Alanı */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          
          <div className="max-w-5xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Hoşgeldin, {userName} 👋</h1>
              <p className="text-slate-500">İşletmenizin durumu aşağıda özetlenmiştir.</p>
            </header>

            {/* DASHBOARD KARTLARI */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* 1. KART: ASİSTAN DURUMU (TOGGLE EKLENDİ) */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-4 opacity-10 transform scale-150 transition-colors ${isBotActive ? 'text-green-500' : 'text-slate-400'}`}>
                   <Bot size={100} />
                </div>
                
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isBotActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Bot size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">AI Asistan</h3>
                  <div className="flex items-center gap-2 mb-6 h-6">
                    <span className={`w-2.5 h-2.5 rounded-full ${isBotActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    <span className={`text-sm font-bold ${isBotActive ? 'text-green-600' : 'text-slate-500'}`}>
                      {isBotActive ? 'Aktif & Yanıtlıyor' : 'Devre Dışı'}
                    </span>
                  </div>
                </div>

                {/* TOGGLE BUTONU */}
                <button 
                  onClick={toggleBot}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    isBotActive 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                      : 'bg-[#001F54] text-white hover:bg-[#0f172a] hover:scale-[1.02]'
                  }`}
                >
                  <Power size={18} />
                  {isBotActive ? 'Asistanı Durdur' : 'Asistanı Başlat'}
                </button>
              </div>

              {/* 2. KART: İŞLETME AYARLARI */}
              <Link to="/settings" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:rotate-12 transition-transform">
                    <Settings size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Ayarlar & Yapılandırma</h3>
                  <p className="text-slate-500 text-sm">Hizmetlerinizi, fiyatlarınızı ve bot karakterini buradan düzenleyin.</p>
                </div>
                <div className="mt-6 flex items-center text-blue-600 font-bold text-sm gap-1">
                   Düzenle <ChevronRight size={16} />
                </div>
              </Link>

              {/* 3. KART: İSTATİSTİKLER */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 opacity-60 flex flex-col justify-between cursor-not-allowed">
                <div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                    <BarChart3 size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Analizler</h3>
                  <p className="text-slate-500 text-sm">Toplam görüşme, mesaj sayısı ve dönüşüm oranları yakında.</p>
                </div>
                <div className="mt-6">
                   <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded border border-slate-200">Çok Yakında</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;