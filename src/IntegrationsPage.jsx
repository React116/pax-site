import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Check, ArrowRight } from 'lucide-react';
import SEO from './components/SEO';
import { useLanguage } from './LanguageContext';

const ScrollToTop = () => { useEffect(() => { window.scrollTo(0, 0); }, []); return null; };

const INTEGRATIONS = [
  {
    category: 'Mesajlaşma & CRM',
    items: [
      { name: 'WhatsApp Business', desc: 'Müşteri mesajlarını otomatik yanıtla, randevu al, hatırlatma gönder.', status: 'live', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' },
      { name: 'Instagram DM', desc: 'DM\'lere AI ile anında cevap ver, ürün sorularını yönet.', status: 'live', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
      { name: 'Telegram', desc: 'Telegram botunuzu PAX AI ile güçlendirin.', status: 'soon', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' },
      { name: 'HubSpot CRM', desc: 'Yeni leadleri otomatik HubSpot\'a aktar, pipeline\'ı güncel tut.', status: 'soon', logo: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png' },
    ]
  },
  {
    category: 'E-Ticaret & Ödeme',
    items: [
      { name: 'Shopify', desc: 'Ürün sorularını, sipariş takibini ve iade süreçlerini otomatikleştir.', status: 'soon', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' },
      { name: 'WooCommerce', desc: 'WordPress mağazanızı AI destekli müşteri hizmetleriyle güçlendirin.', status: 'soon', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/WooCommerce_logo.svg' },
      { name: 'Stripe', desc: 'Ödeme durumu sorularını otomatik yanıtla, fatura bilgisi paylaş.', status: 'soon', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
    ]
  },
  {
    category: 'Otomasyon & API',
    items: [
      { name: 'n8n', desc: 'Sınırsız iş akışı otomasyonu. PAX AI + n8n = tam otomasyon gücü.', status: 'live', logo: 'https://n8n.io/favicon.ico' },
      { name: 'Zapier', desc: '5000+ uygulama ile bağlantı kur, veriyi otomatik aktar.', status: 'soon', logo: 'https://cdn.zapier.com/zapier/images/logos/zapier-logo.png' },
      { name: 'Make (Integromat)', desc: 'Görsel iş akışı kurucuyla PAX AI\'ı her sisteme bağla.', status: 'soon', logo: 'https://www.make.com/en/help/image/uuid-b80b2b3a-c7c6-4f4f-9ebe-a9e7c977929a.png' },
      { name: 'REST API', desc: 'Özel entegrasyon için tam dokümantasyonlu REST API erişimi.', status: 'live', logo: null },
    ]
  },
  {
    category: 'Takvim & Randevu',
    items: [
      { name: 'Google Calendar', desc: 'Randevuları otomatik Google Takvim\'e ekle ve güncelle.', status: 'live', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' },
      { name: 'Calendly', desc: 'Müşterileriniz Calendly üzerinden randevu alırken AI süreci yönetir.', status: 'soon', logo: 'https://assets.calendly.com/packs/browser/media/images/svg/calendly_logo_icon_only.svg' },
      { name: 'Simplybook.me', desc: 'Klinik ve sağlık sektörüne özel rezervasyon entegrasyonu.', status: 'soon', logo: null },
    ]
  },
];

const StatusBadge = ({ status }) => status === 'live'
  ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Aktif</span>
  : <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Yakında</span>;

const IntegrationsPage = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <SEO
        title="Entegrasyonlar — PAX Group | WhatsApp, n8n, CRM ve daha fazlası"
        description="PAX Group'un desteklediği entegrasyonlar: WhatsApp Business, Instagram DM, Google Calendar, n8n, Shopify ve daha fazlası."
        path="/entegrasyonlar"
        lang={language}
      />
      <ScrollToTop />

      {/* HEADER */}
      <div className="bg-[#001F54] py-20 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
            <Zap size={14} className="text-amber-400" /> Açık Entegrasyon Ekosistemi
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">
            Her Sisteminizle<br />
            <span className="text-cyan-400">Sorunsuz Entegrasyon</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-light">
            PAX Group, kullandığınız araçlarla doğrudan entegre olur. Tek bir platform üzerinden tüm müşteri iletişimini ve iş süreçlerinizi yönetin.
          </p>
        </div>
      </div>

      {/* INTEGRATION GRID */}
      <div className="max-w-6xl mx-auto px-6 py-20 -mt-8">
        <div className="space-y-14">
          {INTEGRATIONS.map((group) => (
            <div key={group.category}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">{group.category}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:shadow-md ${
                      item.status === 'live' ? 'border-slate-200' : 'border-slate-100 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.logo
                          ? <img src={item.logo} alt={item.name} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display='none'; }}/>
                          : <span className="text-[10px] font-black text-slate-400">API</span>
                        }
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOM INTEGRATION CTA */}
      <div className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] font-serif mb-4">
            Aradığınız Entegrasyon Listede Yok mu?
          </h2>
          <p className="text-slate-500 mb-4 text-lg">
            Enterprise planımızda özel API geliştirme ve ERP/CRM entegrasyonu sunuyoruz. Ekibimiz, mevcut sistemlerinize özel köprüler tasarlar.
          </p>
          <ul className="flex flex-wrap justify-center gap-3 mb-10 text-sm text-slate-600">
            {['REST API Erişimi', 'Webhook Desteği', 'Özel n8n Akışları', 'ERP & CRM Köprüsü', 'White-label Seçeneği'].map(f => (
              <li key={f} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                <Check size={13} className="text-green-500" /> {f}
              </li>
            ))}
          </ul>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 bg-[#001F54] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#0f172a] transition-all shadow-lg"
          >
            Özel Entegrasyon Talep Et <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
