import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, TrendingUp, Clock, Phone, ShoppingBag, Users, ChevronRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const CaseStudyCard = ({ data, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center mb-32`}
    >
      {/* SOL TARA: METİN & HİKAYE */}
      <div className="flex-1 space-y-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${data.bg} ${data.text} text-xs font-bold uppercase tracking-wider`}>
          {data.icon} {data.category}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-[#0f172a] font-serif leading-tight">
          {data.title}
        </h3>
        <p className="text-lg text-slate-600 leading-relaxed">
          {data.description}
        </p>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
             <div className="mt-1 bg-red-100 p-1.5 rounded-full text-red-600 shrink-0"><Clock size={16} /></div>
             <div>
               <h4 className="font-bold text-slate-800 text-sm uppercase">Sorun Neydi?</h4>
               <p className="text-sm text-slate-600 mt-1">{data.problem}</p>
             </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
             <div className="mt-1 bg-green-100 p-1.5 rounded-full text-green-600 shrink-0"><CheckCircle2 size={16} /></div>
             <div>
               <h4 className="font-bold text-[#001F54] text-sm uppercase">PAX Çözümü</h4>
               <p className="text-sm text-slate-600 mt-1">{data.solution}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
           {data.stats.map((stat, i) => (
             <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-3xl font-bold text-[#001F54]">{stat.value}</div>
                <div className="text-xs text-slate-500 font-bold uppercase">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>

      {/* SAĞ TARAF: GÖRSEL GRAFİK (BEFORE/AFTER) */}
      <div className="flex-1 w-full">
        <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
           <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${data.gradient}`}></div>
           
           <div className="flex items-center justify-between mb-8">
             <div className="font-bold text-slate-700 flex items-center gap-2"><BarChart3 size={18} /> Performans Analizi</div>
             <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Q4 VERİLERİ</div>
           </div>

           {/* Grafik Alanı */}
           <div className="flex items-end justify-center gap-8 h-64 relative z-10">
              {/* Before Bar */}
              <div className="flex flex-col items-center gap-3 w-1/3 group-hover:opacity-60 transition-opacity">
                 <div className="text-slate-400 font-bold text-sm">ÖNCESİ</div>
                 <div className="w-full bg-slate-200 rounded-t-xl relative flex items-end justify-center pb-4" style={{ height: data.chart.beforeHeight }}>
                    <span className="font-bold text-slate-500">{data.chart.beforeVal}</span>
                 </div>
              </div>
              
              {/* Arrow */}
              <div className="mb-12 text-green-500 animate-pulse">
                <ArrowRight size={32} />
              </div>

              {/* After Bar */}
              <div className="flex flex-col items-center gap-3 w-1/3">
                 <div className="text-[#001F54] font-bold text-sm">SONRASI</div>
                 <div className={`w-full rounded-t-xl relative flex items-end justify-center pb-4 shadow-lg bg-gradient-to-t ${data.gradient}`} style={{ height: data.chart.afterHeight }}>
                    <span className="font-bold text-white text-lg">{data.chart.afterVal}</span>
                 </div>
              </div>
           </div>

           {/* Alt Bilgi */}
           <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-500">Müşterimiz <span className="font-bold text-[#001F54]">{data.clientName}</span>, PAX altyapısına geçtikten sonra {data.highlightTime} içinde yatırımını amorti etti.</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const CaseStudiesPage = () => {
  const cases = [
    {
      category: "Klinik & Sağlık",
      icon: <Phone size={14} />,
      title: "Telefon Trafiğini %80 Azalttık",
      clientName: "Private Dental Clinic Budva",
      description: "Karadağ'ın önde gelen diş kliniklerinden biri, yoğun sezonlarda telefonlara yetişemiyor ve potansiyel hasta kaybediyordu.",
      problem: "Resepsiyonist günde 200+ çağrı alıyor, randevu teyitleri ve fiyat sorma aramaları nedeniyle klinikteki hastalarla ilgilenemiyordu.",
      solution: "WhatsApp AI Asistanı entegre edildi. Fiyat listesi, konum ve randevu uygunluğu otomatik yanıtlandı. Sadece acil durumlar personele aktarıldı.",
      highlightTime: "3 hafta",
      bg: "bg-blue-50",
      text: "text-blue-600",
      gradient: "from-blue-500 to-cyan-400",
      stats: [
        { value: "%80", label: "Çağrı Azalması" },
        { value: "24/7", label: "Randevu Sistemi" }
      ],
      chart: { beforeHeight: "100px", beforeVal: "200 Çağrı", afterHeight: "40px", afterVal: "40 Çağrı" } // Ters orantı (azalma başarısı)
    },
    {
      category: "E-Ticaret",
      icon: <ShoppingBag size={14} />,
      title: "Gece Satışlarını %40 Artırdık",
      clientName: "Balkan Fashion Store",
      description: "Lüks giyim satan e-ticaret sitesi, mesai saatleri dışında gelen 'Beden uyar mı?', 'Kumaşı nedir?' soruları cevapsız kaldığı için sepet terk oranları yüksekti.",
      problem: "Müşterilerin %60'ı akşam 20:00 - 01:00 arası alışveriş yapıyordu ancak destek ekibi çalışmıyordu.",
      solution: "Ürün veritabanına bağlı GPT-4 tabanlı Chatbot kuruldu. Bot, beden tablosunu analiz edip müşteriye özel önerilerde bulundu.",
      highlightTime: "1 ay",
      bg: "bg-purple-50",
      text: "text-purple-600",
      gradient: "from-purple-500 to-pink-400",
      stats: [
        { value: "+%40", label: "Ciro Artışı" },
        { value: "%15", label: "Sepet Kurtarma" }
      ],
      chart: { beforeHeight: "80px", beforeVal: "€12k Ciro", afterHeight: "180px", afterVal: "€16.8k Ciro" }
    },
    {
      category: "Gayrimenkul",
      icon: <Users size={14} />,
      title: "Kalitesiz Leadleri Eledik",
      clientName: "Montenegro Luxury Homes",
      description: "Emlak danışmanları, bütçesi yetersiz veya sadece merak eden kişilerle saatlerce telefon görüşmesi yapıp vakit kaybediyordu.",
      problem: "Gelen her 100 talebin sadece 5 tanesi gerçek alıcıydı. Danışmanlar yorgundu.",
      solution: "Lead Kalifikasyon Botu devreye alındı. Müşterinin bütçesi, ne zaman alacağı ve kriterleri bot tarafından sorulup puanlandı. Sadece yüksek puanlılar danışmana iletildi.",
      highlightTime: "2 hafta",
      bg: "bg-amber-50",
      text: "text-amber-600",
      gradient: "from-amber-500 to-orange-400",
      stats: [
        { value: "3x", label: "Verim Artışı" },
        { value: "%95", label: "Doğru Eşleşme" }
      ],
      chart: { beforeHeight: "60px", beforeVal: "5 Satış", afterHeight: "160px", afterVal: "15 Satış" }
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-white">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-[#001F54] text-xs font-bold tracking-widest uppercase mb-6">
          Somut Sonuçlar
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 font-serif">
          Söz Değil, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Veri Sunuyoruz.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 max-w-2xl mx-auto">
          PAX GROUP ile dijital dönüşümünü tamamlayan işletmelerin gerçek verilerle kanıtlanmış başarı hikayelerini inceleyin.
        </motion.p>
      </div>

      {/* METRIC STRIP */}
      <div className="bg-[#0f172a] text-white py-12 mb-32 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
           <div><div className="text-3xl font-bold text-green-400 mb-1">€1.2M+</div><div className="text-xs text-slate-400 uppercase tracking-widest">Oluşturulan Ek Gelir</div></div>
           <div><div className="text-3xl font-bold text-blue-400 mb-1">150k+</div><div className="text-xs text-slate-400 uppercase tracking-widest">Tasarruf Edilen Saat</div></div>
           <div><div className="text-3xl font-bold text-purple-400 mb-1">%99.9</div><div className="text-xs text-slate-400 uppercase tracking-widest">Sistem Uptime</div></div>
           <div><div className="text-3xl font-bold text-amber-400 mb-1">5 Ülke</div><div className="text-xs text-slate-400 uppercase tracking-widest">Global Operasyon</div></div>
        </div>
      </div>

      {/* CASE STUDIES LOOP */}
      <div className="max-w-7xl mx-auto px-6">
        {cases.map((item, index) => (
          <CaseStudyCard key={index} data={item} index={index} />
        ))}
      </div>

      {/* CTA SECTION */}
      <div className="max-w-5xl mx-auto px-6 mt-20">
        <div className="bg-[#001F54] rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">Sizin Başarı Hikayenizi Yazalım</h2>
            <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">İşletmenizin potansiyelini yapay zeka ile ortaya çıkarın. Ücretsiz analiz için hemen görüşelim.</p>
            <Link to="/#contact" className="inline-flex items-center gap-2 bg-white text-[#001F54] px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg hover:scale-105">
              Ücretsiz Analiz Alın <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudiesPage;