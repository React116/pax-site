import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Settings, Calendar, BarChart3, LogOut, Bot,
  Menu, X, Users, PackageOpen, UserSquare2, CalendarCheck,
  MessageSquare, Sparkles, Plug,
} from 'lucide-react';

const menuItems = [
  { path: '/panel',               icon: <LayoutDashboard size={20} />, label: 'Genel Bakış',        exact: true },
  { path: '/panel/settings',      icon: <Settings size={20} />,        label: 'İşletme Ayarları' },
  { path: '/panel/services',      icon: <PackageOpen size={20} />,     label: 'Hizmetler' },
  { path: '/panel/staff',         icon: <UserSquare2 size={20} />,     label: 'Personel & Eğitmenler' },
  { path: '/panel/appointments',  icon: <CalendarCheck size={20} />,   label: 'Randevular' },
  { path: '/panel/conversations', icon: <MessageSquare size={20} />,   label: 'Konuşmalar' },
  { path: '/panel/integrations',  icon: <Plug size={20} />,            label: 'Entegrasyonlar' },
  { path: '/panel/ai-settings',   icon: <Sparkles size={20} />,        label: 'AI Asistan' },
  { path: '/panel/calendar',      icon: <Calendar size={20} />,        label: 'Takvim & Ajanda' },
  { path: '/panel/leads',         icon: <Users size={20} />,           label: 'Leads & Talepler' },
  { path: '/panel/stats',         icon: <BarChart3 size={20} />,       label: 'İstatistikler' },
];

const SidebarContent = ({ location, onClose }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Yönetici';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/giris-yap');
  };

  return (
    <div className="flex flex-col h-full">
      {/* LOGO */}
      <div className="p-6 border-b border-blue-900/50 flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-blue-600 p-2 rounded-lg"
        >
          <Bot size={24} className="text-white" />
        </motion.div>
        <div className="flex-1">
          <h1 className="font-bold text-lg tracking-wide">PAX PANEL</h1>
          <p className="text-[10px] text-blue-300 tracking-widest uppercase">Management</p>
        </div>
        {onClose && (
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-blue-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </motion.button>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-bold text-blue-400 px-4 mb-3 uppercase tracking-wider">Menü</div>

        {menuItems.map((item, i) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={item.path}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group overflow-hidden ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 font-medium'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {/* Active background glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-blue-600 rounded-xl -z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.div
                  className="relative z-10"
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                </motion.div>
                <span className="relative z-10 text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavDot"
                    className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  >
                    <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                  </motion.div>
                )}
              </Link>
            </motion.div>
          );
        })}

        <div className="text-xs font-bold text-blue-400 px-4 mt-8 mb-2 uppercase tracking-wider">Analiz</div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100/60 text-left cursor-not-allowed">
          <BarChart3 size={20} />
          <span className="text-sm">Raporlar (Yakında)</span>
        </button>
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-blue-900/50 bg-[#00153a]">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs border-2 border-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{userName}</p>
            <Link to="/" className="text-[10px] text-blue-300 hover:text-white flex items-center gap-1 transition-colors">
              Web Sitesine Dön
            </Link>
          </div>
        </div>
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full border border-blue-800 text-blue-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> Çıkış Yap
        </motion.button>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-[#001F54] text-white flex-col shadow-2xl z-50">
        <SidebarContent location={location} onClose={null} />
      </aside>

      {/* ── MOBILE OVERLAY ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── MOBILE SIDEBAR ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="lg:hidden fixed left-0 top-0 h-full w-72 bg-[#001F54] text-white flex flex-col shadow-2xl z-50"
          >
            <SidebarContent location={location} onClose={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          <motion.button
            onClick={() => setMobileOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-slate-600 hover:text-[#001F54] transition-colors p-1"
            aria-label="Menüyü aç"
          >
            <Menu size={22} />
          </motion.button>
          <div className="flex items-center gap-2">
            <div className="bg-[#001F54] p-1.5 rounded-md">
              <Bot size={16} className="text-white" />
            </div>
            <span className="font-bold text-[#001F54] text-sm tracking-wide">PAX PANEL</span>
          </div>
        </div>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="p-4 md:p-8 max-w-6xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
