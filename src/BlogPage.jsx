import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: "2025 AI Trendleri: İşletmeler Nasıl Hazırlanmalı?",
      excerpt: "Yapay zeka sadece bir araç değil, artık bir iş ortağı. 2025 yılında işletmeleri bekleyen otonom ajanlar ve hiper-otomasyon devrimine hazır mısınız?",
      category: "Trendler",
      date: "24 Kasım 2025",
      readTime: "8 dk okuma",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=500",
      author: "PAX Research Team"
    },
    {
      id: 2,
      title: "WhatsApp Business API ile Satışları 3'e Katlayın",
      excerpt: "Müşterileriniz e-postaları açmıyor ama WhatsApp'a anında bakıyor. Satış huninizi (Sales Funnel) WhatsApp üzerine kurmanın stratejik yolları.",
      category: "Satış & Pazarlama",
      date: "20 Kasım 2025",
      readTime: "6 dk okuma",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800&h=500",
      author: "Can Demir"
    },
    {
      id: 3,
      title: "Chatbotlar Öldü Mü? Otonom AI Ajanları Devri",
      excerpt: "Basit kural tabanlı botların devri bitti. Artık düşünen, karar veren ve işlemi sonuna kadar götüren 'Yapay Zeka Ajanları' (AI Agents) sahnede.",
      category: "Teknoloji",
      date: "15 Kasım 2025",
      readTime: "7 dk okuma",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800&h=500",
      author: "Teknoloji Ekibi"
    },
    {
      id: 4,
      title: "Sağlık Turizminde Dijital Dönüşüm ve AI",
      excerpt: "Yabancı hastalarla iletişimde dil bariyerini kaldıran, randevuları otomatikleyen ve hasta takibi yapan sistemlerin klinikler için ROI analizi.",
      category: "Sektörel",
      date: "10 Kasım 2025",
      readTime: "5 dk okuma",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800&h=500",
      author: "Dr. AI Analyst"
    },
    {
      id: 5,
      title: "E-Ticarette Hiper-Kişiselleştirme",
      excerpt: "Her müşteriye ismiyle hitap etmek yetmez. Onların alışkanlıklarına göre dinamik vitrinler oluşturan algoritmalar ciroyu nasıl etkiliyor?",
      category: "E-Ticaret",
      date: "05 Kasım 2025",
      readTime: "6 dk okuma",
      // GÖRSEL GÜNCELLENDİ (SAĞLAM LİNK)
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800&h=500",
      author: "PAX Commerce"
    },
    {
      id: 6,
      title: "Operasyonel Maliyetleri Düşürme Rehberi",
      excerpt: "Personel maliyetlerinin arttığı dönemde, tekrarlayan işleri yapay zekaya devrederek %40'a varan tasarruf sağlamanın matematiksel formülü.",
      category: "Verimlilik",
      date: "01 Kasım 2025",
      readTime: "9 dk okuma",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500",
      author: "Finans Ekibi"
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full border border-blue-200 bg-white text-blue-600 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
          PAX BİLGİ MERKEZİ
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-6 font-serif">
          Geleceği Şekillendiren <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#001F54] to-blue-600">Fikirler ve Analizler</span>
        </motion.h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Teknoloji dünyasındaki son gelişmeler, sektörel analizler ve işletmenizi büyütecek stratejik rehberler.
        </p>
      </div>

      {/* BLOG GRID */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full"
          >
            {/* LINK WRAPPER - ARTIK RESME TIKLAYINCA DA GİDİYOR */}
            <Link to={`/blog/${post.id}`} className="block h-full flex flex-col">
              
              {/* Image Wrapper */}
              <div className="relative h-56 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#001F54] flex items-center gap-1">
                  <Tag size={12} /> {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 font-medium">
                  <div className="flex items-center gap-1"><Calendar size={14} /> {post.date}</div>
                  <div className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</div>
                </div>
                
                <h3 className="text-xl font-bold text-[#0f172a] mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#001F54]"><User size={12}/></div>
                    {post.author}
                  </div>
                  <div className="text-[#001F54] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Oku <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* NEWSLETTER BOX */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <div className="bg-[#001F54] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
           <div className="relative z-10">
             <h3 className="text-2xl font-bold text-white mb-4 font-serif">Trendleri Kaçırmayın</h3>
             <p className="text-blue-200 mb-8">Her hafta en yeni AI stratejilerini e-posta kutunuza gönderiyoruz. Spam yok, sadece bilgi.</p>
             <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
               <input type="email" placeholder="E-posta adresiniz" className="flex-1 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-blue-400" />
               <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-500 transition-colors">Abone Ol</button>
             </form>
           </div>
        </div>
      </div>

    </div>
  );
};

export default BlogPage;