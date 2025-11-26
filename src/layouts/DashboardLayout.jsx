import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  BarChart3, 
  LogOut, 
  Bot 
} from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Yönetici';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/giris-yap');
  };

  const menuItems = [
    { path: '/panel', icon: <LayoutDashboard size={20} />, label: 'Genel Bakış', exact: true },
    { path: '/panel/settings', icon: <Settings size={20} />, label: 'İşletme Ayarları' },
    { path: '/panel/calendar', icon: <Calendar size={20} />, label: 'Takvim & Ajanda' },
    { path: '/panel/stats', icon: <BarChart3 size={20} />, label: 'İstatistikler' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* --- SIDEBAR (SOL MENÜ) --- */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#001F54] text-white flex flex-col shadow-2xl z-50">
        
        {/* LOGO ALANI */}
        <div className="p-6 border-b border-blue-900/50 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Bot size={24} className="text-white" />
            </div>
            <div>
                <h1 className="font-bold text-lg tracking-wide">PAX PANEL</h1>
                <p className="text-[10px] text-blue-300 tracking-widest uppercase">Management</p>
            </div>
        </div>

        {/* MENÜ LİNKLERİ */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-blue-400 px-4 mb-2 uppercase tracking-wider">Menü</div>
          
          {menuItems.map((item) => {
            // Aktif sayfa kontrolü (tam eşleşme veya alt yol)
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-medium' 
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
                    {item.icon}
                </div>
                <span className="text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            );
          })}
          
          <div className="text-xs font-bold text-blue-400 px-4 mt-8 mb-2 uppercase tracking-wider">Analiz</div>
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-white/10 hover:text-white transition-all text-left">
              <BarChart3 size={20} />
              <span className="text-sm">Raporlar (Yakında)</span>
           </button>
        </nav>

        {/* ALT KISIM (ÇIKIŞ YAP) */}
        <div className="p-4 border-t border-blue-900/50 bg-[#00153a]">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs border-2 border-white">
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{userName}</p>
                    <Link to="/" className="text-[10px] text-blue-300 hover:text-white flex items-center gap-1">
                        Web Sitesine Dön
                    </Link>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full border border-blue-800 text-blue-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
                <LogOut size={16} /> Çıkış Yap
            </button>
        </div>
      </aside>

      {/* --- ANA İÇERİK ALANI (SAĞ TARAF) --- */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
           {/* Outlet: React Router buraya alt sayfaları (Settings, Calendar vb.) yerleştirir */}
           <Outlet /> 
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;