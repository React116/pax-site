import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowLeft, MessageSquare } from 'lucide-react';
import SEO from './components/SEO';
import { useLanguage } from './LanguageContext';

const faqs = [
  {
    q: "Entegrasyon süreci ne kadar sürer?",
    a: "Standart WhatsApp AI asistanı entegrasyonları 48 saat içinde canlıya geçer. SaaS geliştirme ve özel sistemler 2-8 hafta arasında değişir; proje keşif görüşmesinde net takvim belirlenir."
  },
  {
    q: "Verilerimiz nerede depolanıyor? Güvenli mi?",
    a: "Tüm veriler MongoDB Atlas üzerinde, Avrupa veri merkezlerinde şifreli olarak saklanır. GDPR ve Türkiye KVKK standartlarına tam uyumluyuz. Müşteri verileri üçüncü taraflarla paylaşılmaz."
  },
  {
    q: "Hangi platformlar için entegrasyon yapıyorsunuz?",
    a: "WhatsApp Business API, Instagram DM, Web Chat (canlı destek widget), Telegram ve e-posta otomasyonu. Shopify, WooCommerce, Google Workspace ve özel CRM sistemleriyle entegrasyon da mümkün."
  },
  {
    q: "Kontrat esnekliği nasıl? Uzun vadeli bağlılık gerekiyor mu?",
    a: "Hayır. Aylık, yıllık veya proje bazlı paketler sunuyoruz. Yıllık paketlerde %20 indirim uygulanır. İptal durumunda o ay sonunda hizmet sona erer, ek ücret talep edilmez."
  },
  {
    q: "AI asistanım yanlış cevap verirse ne olur?",
    a: "Sistemi eğitim sürecinde kapsamlı test ediyoruz. Canlı kullanımda asistan yanıt veremediği sorularda konuşmayı insan operatörüne yönlendirir. Hatalı cevaplar için 7 gün içinde model güncellemesi yapıyoruz."
  },
  {
    q: "Türkçe dışında dil desteği var mı?",
    a: "Evet. Türkçe, İngilizce, Rusça ve Karadağca dillerinde tam destek sağlıyoruz. Arapça, Almanca ve İspanyolca için talep bazlı özelleştirme yapılabilir."
  },
  {
    q: "Fiyatlandırma nasıl işliyor? Gizli ücret var mı?",
    a: "Fiyatlandırma sayfamızda tüm paketler şeffaf şekilde listelenmiştir. Kurulum ücreti ilk ay faturasına dahildir. Mesaj hacmine göre ek ücretlendirme yoktur; sabit aylık paket modeliyle çalışıyoruz."
  },
  {
    q: "Demo veya ücretsiz deneme mümkün mü?",
    a: "Evet. 30 dakikalık ücretsiz keşif görüşmesinde mevcut sisteminizi analiz edip, PAX çözümlerinin nasıl entegre edileceğini canlı olarak gösteriyoruz. İletişim formundan 'Demo Görmek İstiyorum' seçeneğini işaretleyin."
  },
  {
    q: "Mevcut yazılımımla (ERP, CRM vb.) entegrasyon mümkün mü?",
    a: "Çoğu durumda evet. REST API veya webhook desteği olan her sisteme entegrasyon sağlayabiliriz. Sisteminize özel analiz için teknik keşif görüşmesi yapıyoruz."
  },
  {
    q: "Destek ve bakım nasıl işliyor?",
    a: "Tüm aktif müşterilerimize 24/7 teknik destek sağlıyoruz. Kritik sorunlar (sistem çökmesi) 1 saat içinde yanıtlanır. Düzenli bakım ve model güncellemeleri paket fiyatına dahildir."
  },
];

const FaqItem = ({ q, a, isOpen, onClick }) => (
  <div className="border-b border-slate-100 last:border-0">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-5 text-left gap-4 group"
    >
      <span className="font-semibold text-[#0f172a] text-sm md:text-base group-hover:text-blue-600 transition-colors">
        {q}
      </span>
      <ChevronDown
        size={18}
        className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
      />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
      <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
    </div>
  </div>
);

const FaqPage = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="SSS — Sık Sorulan Sorular | PAX GROUP"
        description="PAX GROUP hakkında merak ettiğiniz her şey: entegrasyon süreci, fiyatlandırma, veri güvenliği, destek ve daha fazlası."
        path="/sss"
        lang={language}
      />

      {/* Header */}
      <div className="bg-[#001F54] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Ana Sayfa
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
            Destek
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Sık Sorulan Sorular
          </h1>
          <p className="text-blue-200 text-lg">
            Aklınızdaki soruyu burada bulamazsanız, doğrudan yazın.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-20">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-100 px-8">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#001F54] rounded-3xl p-8 text-center">
          <h3 className="text-white font-bold text-xl font-serif mb-2">Aradığınızı bulamadınız mı?</h3>
          <p className="text-blue-200 text-sm mb-6">Ekibimiz ortalama 2 saat içinde yanıt verir.</p>
          <button
            onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              window.location.href = '/#contact';
            }}
            className="inline-flex items-center gap-2 bg-white text-[#001F54] px-6 py-3 rounded-full font-bold text-sm hover:bg-blue-50 transition-all"
          >
            <MessageSquare size={16} /> Bize Yazın
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
