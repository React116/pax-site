import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Zap, Shield, Users, Target, Star } from 'lucide-react';

const StoryPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* HERO HEADER */}
      <div className="relative bg-[#001F54] py-32 overflow-hidden">
        {/* Arka plan desenleri */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-8 leading-tight">
            Sınırsız Zeka, <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-200">Stratejik Konum.</span>
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed font-light max-w-2xl mx-auto">
            Balkanlar'ın kalbinden dünyaya açılan, yapay zeka tabanlı yeni nesil mühendislik üssü: PAX GROUP'un doğuş hikayesi.
          </p>
        </div>
      </div>

      {/* BÖLÜM 1: BAŞLANGIÇ (GRID LAYOUT) */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#001F54] text-xs font-bold uppercase tracking-widest mb-6">
              <Star size={14} className="fill-[#001F54]" /> Kuruluş: 2025
            </div>
            <h2 className="text-4xl font-bold text-[#0f172a] mb-6 font-serif">Neden Karadağ?</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              2025 yılında, teknolojinin sadece Silikon Vadisi'ne özgü olmadığını kanıtlamak için yola çıktık. Karadağ (Montenegro), bizim için sadece bir ofis adresi değil, stratejik bir tercih.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Avrupa'nın dijital standartlarına tam uyumlu, ancak Doğu'nun hızına ve esnekliğine sahip bir merkez üssü kurduk. Burası, GMT+1 zaman diliminde, hem Avrupa hem de Ortadoğu pazarlarına aynı anda hizmet verebildiğimiz, veri güvenliğinin en üst düzeyde olduğu bir teknoloji limanıdır.
            </p>
            <div className="p-6 bg-slate-100 rounded-2xl border-l-4 border-[#001F54]">
              <p className="text-[#001F54] font-medium italic">
                "Amacımız; karmaşık yazılım süreçlerini, Karadağ'ın sakin ve odaklanmış atmosferinde, yapay zeka hızıyla sadeleştirmektir."
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-3xl transform rotate-3 blur-lg opacity-30"></div>
            {/* YENİLENEN GÖRSEL LINKI */}
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
              alt="PAX Office Concept" 
              className="relative rounded-3xl shadow-2xl border-4 border-white w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>

      {/* BÖLÜM 2: DEĞERLER (BENTO GRID) */}
      <div className="bg-[#0f172a] py-24 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Bizi Farklı Kılan DNA</h2>
            <p className="text-slate-400">Sıradan bir yazılım ajansı değil, stratejik bir partneriz.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Kart 1 */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-blue-500 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                <Zap className="text-blue-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hız Tutkusu</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Geleneksel yazılım geliştirme aylar sürer. Biz, AI destekli modüllerimizle bu süreyi haftalara indiriyoruz. Pazar fırsatlarını kaçırmanızı engelliyoruz.
              </p>
            </div>

            {/* Kart 2 */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-teal-500 transition-colors group">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition-colors">
                <Shield className="text-teal-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Şeffaflık & Güven</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Kodlarımız "White-Box" prensibiyle yazılır. Sürpriz maliyetler yok, gizli arka kapılar yok. Her satır kodun mülkiyeti size aittir.
              </p>
            </div>

            {/* Kart 3 */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-purple-500 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                <Globe className="text-purple-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Vizyon</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sadece yerel değil, global ölçeklenebilirlik için tasarlıyoruz. Altyapınız, bugün 100 kullanıcıyı, yarın 1 milyon kullanıcıyı kaldıracak güçte kurulur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BÖLÜM 3: VİZYON & EKİP */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-block p-3 bg-blue-50 rounded-full mb-6">
          <Users size={32} className="text-[#001F54]" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-8 font-serif">Geleceği İnşa Eden Ekip</h2>
        <p className="text-xl text-slate-600 leading-relaxed font-light mb-12">
          "PAX GROUP, sadece kod yazan mühendislerden değil; işletme stratejistleri, veri bilimciler ve kullanıcı deneyimi tasarımcılarından oluşan multidisipliner bir ordudur."
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-12">
          <div>
            <div className="text-4xl font-bold text-[#001F54] mb-2 font-serif">50+</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mühendis</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#001F54] mb-2 font-serif">3</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kıta</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#001F54] mb-2 font-serif">24/7</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operasyon</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#001F54] mb-2 font-serif">∞</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">İnovasyon</div>
          </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="bg-slate-50 border-t border-slate-200 py-20 text-center">
        <h3 className="text-2xl font-bold text-[#0f172a] mb-6">Bu Hikayenin Bir Parçası Olun</h3>
        <Link to="/#contact" className="bg-[#001F54] text-white px-8 py-4 rounded-full font-bold hover:bg-blue-900 transition-colors shadow-xl">
          Projemi Başlat
        </Link>
      </div>

    </div>
  );
};

export default StoryPage;