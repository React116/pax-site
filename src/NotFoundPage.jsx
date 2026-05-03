import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6">
    <div className="text-center max-w-lg">
      <div className="text-[120px] font-bold text-slate-100 font-serif leading-none select-none">404</div>
      <h1 className="text-3xl font-bold text-[#0f172a] font-serif mb-4 -mt-4">Sayfa Bulunamadı</h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-[#001F54] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#0f172a] transition-all shadow-lg"
        >
          <Home size={16} /> Ana Sayfaya Dön
        </Link>
        <Link
          to="/sss"
          className="inline-flex items-center justify-center gap-2 border-2 border-[#001F54] text-[#001F54] px-6 py-3 rounded-full font-bold text-sm hover:bg-[#001F54] hover:text-white transition-all"
        >
          SSS <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
