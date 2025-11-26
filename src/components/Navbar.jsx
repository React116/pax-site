// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Settings, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Basit bir kontrol: Token varsa kullanıcı giriş yapmıştır
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Tokeni sil
    navigate('/login'); // Giriş sayfasına at
    window.location.reload(); // State'i temizlemek için sayfayı yenile
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              PAX GROUP
            </Link>
          </div>

          {/* MASAÜSTÜ MENÜ */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/panel" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors">
                  <LayoutDashboard size={18} />
                  <span>Panelim</span>
                </Link>
                
                {/* YENİ EKLENEN AYARLAR BUTONU */}
                <Link to="/settings" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors">
                  <Settings size={18} />
                  <span>Ayarlar</span>
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md transition-colors"
                >
                  <LogOut size={18} />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2">Giriş Yap</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Kayıt Ol</Link>
              </>
            )}
          </div>

          {/* MOBİL MENÜ BUTONU */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL MENÜ İÇERİĞİ */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link to="/panel" className="block text-gray-600 py-2 hover:text-blue-600">Panelim</Link>
              <Link to="/settings" className="block text-gray-600 py-2 hover:text-blue-600">İşletme Ayarları</Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-600 py-2">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-600 py-2">Giriş Yap</Link>
              <Link to="/register" className="block text-blue-600 font-bold py-2">Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;