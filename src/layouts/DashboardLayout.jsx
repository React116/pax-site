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

  // Menü Link Bileşeni
  const SidebarLink = ({ to, icon: Icon, label }) => {
    // Tam eşleşme veya alt yol kontrolü
    const isActive = location.pathname === to;
    
    return (
      <Link to={to} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
          isActive 
            ? 'text-white shadow-lg shadow-blue-900/40' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}>
          {/* Aktif Arkaplanı (Gradient) */}
          {isActive && (
            <motion.div 
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          
          <Icon size={20} className="relative z-10" />
          <span className="relative z-10 font-medium tracking-wide">{label}</span>
          {isActive && <ChevronRight size={16} className="relative z-10 ml-auto opacity-80" />}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      
      {/* --- SIDEBAR (SOL MENÜ) --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#001F54] text-white transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col shadow-2xl`}>
        
        {/* Logo Alanı */}
        <div className="h-24 flex items-center px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={80} />
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-tight text-white">PAX PANEL</span>
            <span className="text-[10px] text-blue-200 uppercase tracking-[0.2em]">Management</span>
          </div>
        </div>

        {/* Menü Linkleri */}
        <div className="p-6 space-y-2 flex-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 mt-2">Menü</div>
          <SidebarLink to="/panel" icon={LayoutDashboard} label="Genel Bakış" />
          <SidebarLink to="/panel/settings" icon={Settings} label="İşletme Ayarları" />
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 mt-8">Analiz</div>
          <SidebarLink to="#" icon={BarChart3} label="İstatistikler" />
        </div>

        {/* Alt Kısım */}
        <div className="p-6 border-t border-white/5 bg-[#001845]">
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

      {/* --- ANA İÇERİK ALANI --- */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Arka plan dekoru */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>

        {/* Mobil Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md h-16 border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
           <span className="font-bold text-[#001F54]">PAX GROUP</span>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2 rounded-lg hover:bg-slate-100">
             {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
           </button>
        </header>

        {/* Değişen İçerik (Outlet) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative z-10 scroll-smooth">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;