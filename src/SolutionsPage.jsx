import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, Code2, BrainCircuit, LineChart, 
  Server, Shield, Database, Smartphone, 
  Bot, MessageSquare, Zap, Users, 
  Target, TrendingUp, Layers, CheckCircle2 
} from 'lucide-react';

const SolutionsPage = () => {
  const { hash } = useLocation();

  // Sayfa açıldığında veya hash değiştiğinde ilgili bölüme kaydır
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* HEADER */}
      <div className="bg-[#001F54] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-6 leading-tight">
            Geleceği Şekillendiren <br /> <span className="text-blue-400">Teknolojik Altyapılar</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
            PAX GROUP olarak sunduğumuz çözümler, sadece bugünün sorunlarını çözmekle kalmaz; işletmenizi önümüzdeki 10 yılın dijital rekabetine hazırlar.
          </p>
        </div>
      </div>

      {/* 1. BÖLÜM: SAAS (WEB & MOBİL) */}
      <section id="saas" className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
              <Code2 className="text-blue-600" size={36} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-6 font-serif">Özel SaaS Geliştirme</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Paket programların sınırlarına sıkışmayın. İşletmenizin benzersiz akışına tam uyum sağlayan, bulut tabanlı, ölçeklenebilir ve yüksek güvenlikli yazılım mimarileri inşa ediyoruz.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              E-Ticaret yönetim panellerinden, karmaşık CRM sistemlerine; B2B pazar yerlerinden finansal analiz araçlarına kadar her türlü dijital ürünü, <strong>React, Node.js ve Python</strong> teknolojileriyle sıfırdan kodluyoruz.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <Server className="text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0f172a]">Bulut Mimarisi</h4>
                  <p className="text-sm text-slate-500">AWS veya Google Cloud üzerinde %99.9 uptime garantili altyapı.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Smartphone className="text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0f172a]">Multi-Platform</h4>
                  <p className="text-sm text-slate-500">Hem Web, hem iOS hem de Android uyumlu responsive tasarım.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Database className="text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0f172a]">Ölçeklenebilirlik</h4>
                  <p className="text-sm text-slate-500">10 kullanıcıdan 1 milyon kullanıcıya sorunsuz büyüme.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0f172a]">Siber Güvenlik</h4>
                  <p className="text-sm text-slate-500">End-to-End şifreleme ve düzenli penetrasyon testleri.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Görsel Temsili (Kod Bloğu) */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-700">
             <div className="absolute top-0 right-0 p-4 opacity-20"><Code2 size={120} className="text-white"/></div>
             <div className="font-mono text-sm text-blue-300 space-y-4 relative z-10">
               <div className="flex gap-4"><span className="text-slate-500">01</span><span>import <span className="text-yellow-300">{`{ EnterpriseCore }`}</span> from <span className="text-green-400">'@pax/saas'</span>;</span></div>
               <div className="flex gap-4"><span className="text-slate-500">02</span><span></span></div>
               <div className="flex gap-4"><span className="text-slate-500">03</span><span className="text-slate-400">// Sistem Başlatılıyor...</span></div>
               <div className="flex gap-4"><span className="text-slate-500">04</span><span>const <span className="text-purple-400">app</span> = new EnterpriseCore({`{`}</span></div>
               <div className="flex gap-4"><span className="text-slate-500">05</span><span className="pl-4">securityLevel: <span className="text-orange-400">'MAXIMUM'</span>,</span></div>
               <div className="flex gap-4"><span className="text-slate-500">06</span><span className="pl-4">database: <span className="text-green-400">'PostgreSQL_Cluster'</span>,</span></div>
               <div className="flex gap-4"><span className="text-slate-500">07</span><span className="pl-4">users: <span className="text-blue-400">1000000+</span></span></div>
               <div className="flex gap-4"><span className="text-slate-500">08</span><span>{`}`});</span></div>
               <div className="flex gap-4"><span className="text-slate-500">09</span><span></span></div>
               <div className="flex gap-4"><span className="text-slate-500">10</span><span className="text-green-400">app.deploy(); // 🚀 Sistem Yayında</span></div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. BÖLÜM: AI & CHATBOT */}
      <section id="ai" className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Sol Görsel (Chat UI) */}
          <div className="order-2 lg:order-1 bg-white rounded-3xl p-8 shadow-xl border border-slate-200 relative">
             <div className="space-y-4">
                <div className="flex justify-end"><div className="bg-blue-600 text-white p-3 rounded-l-xl rounded-tr-xl max-w-[80%] text-sm">Randevu almak istiyorum, müsaitlik var mı?</div></div>
                <div className="flex justify-start items-end gap-2">
                   <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center"><Bot size={18} className="text-teal-600"/></div>
                   <div className="bg-slate-100 text-slate-700 p-3 rounded-r-xl rounded-tl-xl max-w-[80%] text-sm">
                      Merhaba! 👋 Evet, yarın saat 14:00 ve 16:30 için boşluğumuz var. Hangisini rezerve edeyim?
                   </div>
                </div>
                <div className="flex justify-end"><div className="bg-blue-600 text-white p-3 rounded-l-xl rounded-tr-xl max-w-[80%] text-sm">14:00 uygun.</div></div>
                <div className="flex justify-start items-end gap-2">
                   <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center"><Bot size={18} className="text-teal-600"/></div>
                   <div className="bg-slate-100 text-slate-700 p-3 rounded-r-xl rounded-tl-xl max-w-[80%] text-sm">
                      Harika! 🎉 14:00 randevunuzu oluşturdum. Size bir onay SMS'i gönderdim. Görüşmek üzere!
                   </div>
                </div>
             </div>
             <div className="absolute -right-4 -bottom-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
               <Zap size={14} fill="currentColor" /> Yanıt Hızı: 0.2sn
             </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-8">
              <BrainCircuit className="text-teal-600" size={36} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-6 font-serif">AI İş Gücü & Chatbot</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Müşteri hizmetleri bir maliyet kalemi değil, gelir kapısıdır. PAX AI Asistanları, işletmenizin <strong>WhatsApp, Instagram ve Web Sitesi</strong> üzerinde 7/24 uyanık kalmasını sağlar.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Sıradan "tuşlamalı" botları unutun. Doğal dil işleme (NLP) yeteneğine sahip asistanlarımız, müşterinizle bir insan gibi sohbet eder, ürün satar, randevu alır ve şikayetleri yönetir.
            </p>
            
            <ul className="space-y-4">
               <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                 <MessageSquare className="text-teal-500" />
                 <span className="text-slate-700 font-medium">WhatsApp Business API Entegrasyonu</span>
               </li>
               <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                 <Users className="text-teal-500" />
                 <span className="text-slate-700 font-medium">Aynı anda 10.000+ müşteriyle görüşme</span>
               </li>
               <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                 <Bot className="text-teal-500" />
                 <span className="text-slate-700 font-medium">Satış Hunisi ve Lead Toplama</span>
               </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. BÖLÜM: DANIŞMANLIK */}
      <section id="consulting" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
              <LineChart className="text-indigo-600" size={36} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-6 font-serif">Stratejik Danışmanlık</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Teknoloji yatırımı kumar değildir. Yanlış altyapı seçimi, şirketlere milyonlarca dolara ve yıllarca zaman kaybına mal olabilir. PAX GROUP olarak, dijital dönüşümünüzde size <strong>Pusula</strong> oluyoruz.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Mevcut sistemlerinizi analiz ediyor, verimsiz noktaları tespit ediyor ve sizi hedeflerinize en kısa yoldan ulaştıracak teknoloji yığınını (Tech Stack) kuruyoruz.
            </p>
            
            <div className="space-y-6 border-l-2 border-indigo-100 pl-6">
              <div>
                <h4 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                   <Target className="text-indigo-500" size={20}/> Dijital Olgunluk Analizi
                </h4>
                <p className="text-slate-500 mt-2">Şirketinizin şu an nerede olduğunu ve nereye gitmesi gerektiğini verilerle raporluyoruz.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                   <TrendingUp className="text-indigo-500" size={20}/> Maliyet Optimizasyonu
                </h4>
                <p className="text-slate-500 mt-2">Gereksiz lisansları ve sunucu giderlerini tespit edip %40'a varan tasarruf sağlıyoruz.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                   <Layers className="text-indigo-500" size={20}/> Süreç Otomasyonu
                </h4>
                <p className="text-slate-500 mt-2">İnsan hatasına açık, tekrar eden manuel işleri yazılımlara devrediyoruz.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
             <h3 className="text-xl font-bold text-[#001F54] mb-6">Danışmanlık Sürecimiz</h3>
             <div className="space-y-8 relative">
                {/* Timeline Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                
                <div className="relative pl-12">
                   <div className="absolute left-0 top-1 w-8 h-8 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">1</div>
                   <h4 className="font-bold text-slate-800">Analiz & Keşif</h4>
                   <p className="text-sm text-slate-500">İş modelinizi ve ihtiyaçlarınızı dinliyoruz.</p>
                </div>
                <div className="relative pl-12">
                   <div className="absolute left-0 top-1 w-8 h-8 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">2</div>
                   <h4 className="font-bold text-slate-800">Strateji & Planlama</h4>
                   <p className="text-sm text-slate-500">Hangi teknolojilerin kullanılacağını belirliyoruz.</p>
                </div>
                <div className="relative pl-12">
                   <div className="absolute left-0 top-1 w-8 h-8 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">3</div>
                   <h4 className="font-bold text-slate-800">Uygulama & Geliştirme</h4>
                   <p className="text-sm text-slate-500">Sistemi kuruyor ve entegre ediyoruz.</p>
                </div>
                <div className="relative pl-12">
                   <div className="absolute left-0 top-1 w-8 h-8 bg-indigo-600 border-2 border-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white"><CheckCircle2 size={14}/></div>
                   <h4 className="font-bold text-slate-800">Eğitim & Devir</h4>
                   <p className="text-sm text-slate-500">Ekibinize sistemi öğretiyor ve teslim ediyoruz.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <div className="bg-[#0f172a] py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">Dijital Dönüşüme Hazır mısınız?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
          İşletmenizi bir üst seviyeye taşıyacak teknolojileri konuşmak için uzmanlarımızla ücretsiz bir görüşme planlayın.
        </p>
        <Link to="/#contact" className="inline-block bg-blue-600 text-white font-bold py-4 px-10 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-900/50">
           Hemen İletişime Geçin
        </Link>
      </div>

    </div>
  );
};

export default SolutionsPage;