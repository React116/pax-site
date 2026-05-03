import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Calendar, BarChart3, LogOut, Bot, Menu, X, Users, PackageOpen, UserSquare2, CalendarCheck, MessageSquare, Sparkles } from 'lucide-react';

const menuItems = [
  { path: '/panel',                icon: <LayoutDashboard size={20} />, label: 'Genel Bakış',          exact: true },
  { path: '/panel/settings',       icon: <Settings size={20} />,        label: 'İşletme Ayarları' },
  { path: '/panel/services',       icon: <PackageOpen size={20} />,     label: 'Hizmetler' },
  { path: '/panel/staff',          icon: <UserSquare2 size={20} />,     label: 'Personel & Eğitmenler' },
  { path: '/panel/appointments',   icon: <CalendarCheck size={20} />,   label: 'Randevular' },
  { path: '/panel/conversations',  icon: <MessageSquare size={20} />,   label: 'Konuşmalar' },
  { path: '/panel/ai-settings',   icon: <Sparkles size={20} />,        label: 'AI Asistan' },
  { path: '/panel/calendar',      icon: <Calendar size={20} />,        label: 'Takvim & Ajanda' },
  { path: '/panel/leads',          icon: <Users size={20} />,           label: 'Leads & Talepler' },
  { path: '/panel/stats',          icon: <BarChart3 size={20} />,       label: 'İstatistikler' },
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
        <div className="bg-blue-600 p-2 rounded-lg">
          <Bot size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-lg tracking-wide">PAX PANEL</h1>
          <p className="text-[10px] text-blue-300 tracking-widest uppercase">Management</p>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-blue-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-blue-400 px-4 mb-2 uppercase tracking-wider">Menü</div>

        {menuItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
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

      {/* FOOTER */}
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
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE SIDEBAR ── */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-[#001F54] text-white flex flex-col shadow-2xl z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent location={location} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-slate-600 hover:text-[#001F54] transition-colors p-1"
            aria-label="Menüyü aç"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-[#001F54] p-1.5 rounded-md">
              <Bot size={16} className="text-white" />
            </div>
            <span className="font-bold text-[#001F54] text-sm tracking-wide">PAX PANEL</span>
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
