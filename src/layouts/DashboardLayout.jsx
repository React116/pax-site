// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Settings, BarChart3, LogOut, 
  Menu, X, Globe, ChevronRight, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/giris-yap');
    window.location.reload();
  };

  // Sidebar Linki
  const SidebarLink = ({ to, icon: Icon, label }) => {
    // URL kontrolü: Tam eşleşme mi yoksa alt sayfa mı?
    const isActive = location.pathname === to;
    
    return (
      <Link to={to} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
          isActive 
            ? 'text-white shadow-lg shadow-blue-900/40 bg-blue-600/20' // Hafif mavi arkaplan
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}>
          {/* Aktif olduğunda sol tarafta mavi bir çizgi */}
          {isActive && (
            <motion.div 
              layoutId="activeTab"
              className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
          
          <Icon size={20} className={`relative z-10 ${isActive ? 'text-blue-400' : ''}`} />
          <span className={`relative z-10 font-medium tracking-wide ${isActive ? 'text-white' : ''}`}>{label}</span>
          
          {isActive && <ChevronRight size={16} className="relative z-10 ml-auto opacity-80 text-blue-400" />}
        </div>
      </Link>
    );
  };

  return (
    // h-screen: Tüm ekranı kapla, overflow-hidden: Ana sayfada scroll çıkmasın
    <div className="h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#001F54] text-white transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col shadow-2xl`}>
        
        {/* Logo */}
        <div className="h-24 flex items-center px-8 border-b border-white/5 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={80} />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-tight text-white">PAX PANEL</span>
            <span className="text-[10px] text-blue-200 uppercase tracking-[0.2em]">Management</span>
          </div>
        </div>

        {/* Linkler */}
        <div className="p-6 space-y-2 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 mt-2">Menü</div>
          <SidebarLink to="/panel" icon={LayoutDashboard} label="Genel Bakış" />
          <SidebarLink to="/panel/settings" icon={Settings} label="İşletme Ayarları" />
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 mt-8">Analiz</div>
          <SidebarLink to="#" icon={BarChart3} label="İstatistikler" />
        </div>

        {/* Alt Footer */}
        <div className="p-6 border-t border-white/5 bg-[#001845] shrink-0">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-xs mb-4 px-2 transition-colors">
            <Globe size={14} /> Web Sitesine Dön
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-white/5 text-red-300 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl transition-all text-sm font-bold border border-white/5 hover:border-transparent"
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* --- ANA İÇERİK --- */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header (Mobil) */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md h-16 border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40 shrink-0">
           <span className="font-bold text-[#001F54]">PAX GROUP</span>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2 rounded-lg hover:bg-slate-100">
             {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
           </button>
        </header>

        {/* OUTLET: Burası değişen kısımdır. Scroll burada olmalı. */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative z-10 scroll-smooth">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;