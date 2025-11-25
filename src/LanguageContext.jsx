// src/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';

// --- TÜM SİTE ÇEVİRİLERİ ---
const translations = {
  tr: {
    // --- GÖRSELLER (Dil bazlı görsel değişimi için) ---
    images: {
      hero: "/hero-tr.png", // Örnek: Türkçe görsel yolu
      about: "/about-us-tr.jpg"
    },
    // --- NAVİGASYON ---
    nav: {
      successStories: "Başarı Hikayeleri",
      about: "Hakkımızda",
      whoWeAre: "Biz Kimiz?",
      whoWeAreDesc: "PAX Group Hikayesi",
      blog: "Blog & İçerik",
      blogDesc: "Teknoloji Trendleri",
      solutions: "Çözümler",
      pricing: "Fiyatlar",
      contact: "İletişim",
      consult: "Danışmanlık Al",
      corporate: "KURUMSAL"
    },
    // --- ANA SAYFA (Home) ---
    hero: {
      badge: "ZEKA MÜHENDİSLİĞİ",
      titleStart: "Ticaretin",
      titleHighlight: "Sinir Ağı",
      desc: "PAX GROUP, modern işletmeler için AI-yerel altyapılar inşa ediyor. Otonom ajanlardan özel SaaS mimarilerine kadar, dijital geleceği bugünden kuruyoruz.",
      btnDiscover: "Çözümleri Keşfedin",
      btnContact: "İletişim"
    },
    stats: {
      msgTitle: "Aylık AI Mesajı",
      msgDesc: "Yüksek kapasiteli sunucularımızla kesintisiz iletişim.",
      satisfactionTitle: "Müşteri Memnuniyeti",
      satisfactionDesc: "Global partnerlerimizin geri bildirim başarı oranı.",
      supportTitle: "Kesintisiz Destek",
      supportDesc: "Teknik ekibimiz her an yanınızda, sorunsuz operasyon.",
      countryTitle: "Ülkeye Hizmet",
      countryDesc: "Balkanlar'dan Avrupa'ya uzanan global hizmet ağı."
    },
    solutions: {
      title: "Teknolojik Çözümler",
      subtitle: "İşletmenizi geleceğe taşıyan uçtan uca dijital hizmetler.",
      btnDetail: "Detaylı İncele",
      items: [
        { title: "Özel SaaS Geliştirme", desc: "İşletmenizin ihtiyaçlarına tam uyan, ölçeklenebilir ve güvenli yazılım altyapıları.", features: ["Modern Mimari", "Bulut Tabanlı", "Yüksek Güvenlik"] },
        { title: "AI İş Gücü & Chatbot", desc: "7/24 çalışan, müşterileri karşılayan ve satış yapan yapay zeka asistanları.", features: ["WhatsApp Otomasyonu", "7/24 Yanıt", "Çoklu Dil"] },
        { title: "Stratejik Danışmanlık", desc: "Dijital dönüşüm sürecinizde yol haritası çiziyor ve verimliliği artırıyoruz.", features: ["Yol Haritası", "Maliyet Düşürme", "Pazar Analizi"] }
      ]
    },
    vision: {
      badge: "2025 • Karadağ",
      titleStart: "Geleceği",
      titleHighlight: "Karadağ'dan",
      titleEnd: "İnşa Ediyoruz.",
      desc: "PAX GROUP, Avrupa standartlarında mühendislik disiplinini yapay zeka hızıyla birleştirerek Balkanlar'dan dünyaya uzanan güvenilir bir teknoloji köprüsü kuruyor.",
      btnStory: "Hikayemizi Oku"
    },
    testimonials: {
      title: "Başarı Hikayeleri",
      subtitle: "İş süreçlerini otomatize eden işletmeler ne diyor?",
      reviews: [
        { title: "Diş Kliniği Sahibi", text: "Randevu takibi tamamen otomatikleşti." },
        { title: "Pilates Stüdyosu", text: "Telefon trafiğimiz %80 azaldı." },
        { title: "Gayrimenkul Danışmanı", text: "Müşterilerimiz 7/24 anında yanıt alıyor." },
        { title: "E-Ticaret Sahibi", text: "Gece gelen sipariş sorularını artık kaçırmıyoruz." },
        { title: "Güzellik Merkezi", text: "Danışanlarımız WhatsApp üzerinden randevu oluşturabiliyor." }
      ]
    },
    form: {
      title: "Projenizi Başlatalım",
      subtitle: "İşletmenizi yapay zeka ile dönüştürmek için aşağıdaki formu doldurun.",
      office: "Merkez Ofis",
      phone: "Telefon",
      email: "E-posta",
      labels: {
        name: "Adınız / Firma Adı",
        phone: "WhatsApp Numaranız",
        email: "E-posta Adresiniz",
        sector: "Sektörünüz",
        platforms: "Kullanmak İstediğiniz Platformlar",
        customers: "Günlük Yaklaşık Müşteri Sayınız",
        intent: "Başlama Niyetiniz",
        fastReply: "Hızlı Dönüş"
      },
      placeholders: {
        name: "Örn: Pax Turizm",
        phone: "+90 5XX XXX XX XX",
        email: "ornek@sirket.com",
        select: "Seçiniz..."
      },
      intents: {
        now: "Hemen iletişime geçmek istiyorum",
        demo: "Demo görmek istiyorum",
        info: "Sadece bilgi almak istiyorum"
      },
      checkboxText: "Talebimin incelenip bana WhatsApp üzerinden hızlıca dönüş yapılmasını istiyorum.",
      btnSending: "Gönderiliyor...",
      btnSend: "Formu Gönder ve Başvur",
      success: "✅ Mesajınız başarıyla gönderildi!",
      error: "❌ Bir hata oluştu."
    },
    footer: {
      corporate: "Kurumsal",
      legal: "Gizlilik Politikası",
      terms: "Kullanım Koşulları",
      cookies: "Çerez Politikası",
      kvkk: "KVKK / GDPR Uyumu",
      connect: "Bağlantıda Kalın",
      rights: "© 2025 PAX GROUP GLOBAL. Tüm hakları saklıdır."
    },
    // --- DİĞER SAYFALAR (Burayı kendi içeriklerinize göre doldurmalısınız) ---
    pricingPage: {
      title: "Fiyatlandırma",
      desc: "İşletmeniz için en uygun paketi seçin.",
      monthly: "Aylık",
      yearly: "Yıllık",
      plans: [
        { name: "Başlangıç", price: "₺999", features: ["Temel Özellikler", "E-posta Desteği"] },
        { name: "Profesyonel", price: "₺2999", features: ["Tüm Özellikler", "7/24 Destek"] }
      ]
    },
    storyPage: {
      title: "Bizim Hikayemiz",
      content: "Pax Group, teknolojiyi insanlığın hizmetine sunmak için kuruldu..."
    },
    blogPage: {
      title: "Blog & Yazılar",
      readMore: "Devamını Oku"
    }
  },
  en: {
    // --- IMAGES (Language based) ---
    images: {
      hero: "/hero-en.png",
      about: "/about-us-en.jpg"
    },
    nav: {
      successStories: "Success Stories",
      about: "About Us",
      whoWeAre: "Who We Are?",
      whoWeAreDesc: "The PAX Group Story",
      blog: "Blog & Insights",
      blogDesc: "Tech Trends",
      solutions: "Solutions",
      pricing: "Pricing",
      contact: "Contact",
      consult: "Get Consultancy",
      corporate: "CORPORATE"
    },
    hero: {
      badge: "INTELLIGENCE ENGINEERING",
      titleStart: "Neural Network",
      titleHighlight: "of Commerce",
      desc: "PAX GROUP builds AI-native infrastructures for modern businesses. From autonomous agents to custom SaaS architectures, we are engineering the digital future today.",
      btnDiscover: "Discover Solutions",
      btnContact: "Contact Us"
    },
    stats: {
      msgTitle: "Monthly AI Msgs",
      msgDesc: "Uninterrupted communication with high-capacity servers.",
      satisfactionTitle: "Client Satisfaction",
      satisfactionDesc: "Success rate based on feedback.",
      supportTitle: "24/7 Support",
      supportDesc: "Our technical team is always with you.",
      countryTitle: "Countries Served",
      countryDesc: "Global service network."
    },
    solutions: {
      title: "Technological Solutions",
      subtitle: "End-to-end digital services to carry your business into the future.",
      btnDetail: "View Details",
      items: [
        { title: "Custom SaaS Development", desc: "Scalable and secure software infrastructures.", features: ["Modern Architecture", "Cloud-Based", "High Security"] },
        { title: "AI Workforce & Chatbot", desc: "AI assistants that work 24/7.", features: ["WhatsApp Automation", "24/7 Response", "Multi-Language"] },
        { title: "Strategic Consulting", desc: "We draw a roadmap for your digital transformation.", features: ["Roadmap", "Cost Reduction", "Market Analysis"] }
      ]
    },
    vision: {
      badge: "2025 • Montenegro",
      titleStart: "Building Future from",
      titleHighlight: "Montenegro",
      titleEnd: "",
      desc: "PAX GROUP establishes a reliable technology bridge from the Balkans to the world by combining European engineering discipline with the speed of AI.",
      btnStory: "Read Our Story"
    },
    testimonials: {
      title: "Success Stories",
      subtitle: "What do businesses say?",
      reviews: [
        { title: "Dental Clinic Owner", text: "Appointment tracking is completely automated." },
        { title: "Pilates Studio Manager", text: "Phone traffic decreased by 80%." },
        { title: "Real Estate Consultant", text: "Our customers get instant responses 24/7." },
        { title: "E-Commerce Owner", text: "We no longer miss order questions coming at night." },
        { title: "Beauty Center Founder", text: "Clients can create appointments via WhatsApp." }
      ]
    },
    form: {
      title: "Let's Start Your Project",
      subtitle: "Fill out the form below to transform your business with AI.",
      office: "Headquarters",
      phone: "Phone",
      email: "Email",
      labels: {
        name: "Your Name / Company Name",
        phone: "WhatsApp Number",
        email: "Your Email Address",
        sector: "Your Industry",
        platforms: "Platforms You Want to Use",
        customers: "Daily Approx. Customer Count",
        intent: "Intention to Start",
        fastReply: "Fast Reply"
      },
      placeholders: {
        name: "Ex: Pax Tourism",
        phone: "+90 5XX XXX XX XX",
        email: "example@company.com",
        select: "Select..."
      },
      intents: {
        now: "I want to start immediately",
        demo: "I want to see a demo",
        info: "I just want information"
      },
      checkboxText: "I want my request reviewed and a quick reply via WhatsApp.",
      btnSending: "Sending...",
      btnSend: "Send Form & Apply",
      success: "✅ Your message has been sent successfully!",
      error: "❌ An error occurred."
    },
    footer: {
      corporate: "Corporate",
      legal: "Privacy Policy",
      terms: "Terms of Use",
      cookies: "Cookie Policy",
      kvkk: "KVKK / GDPR Compliance",
      connect: "Stay Connected",
      rights: "© 2025 PAX GROUP GLOBAL. All rights reserved."
    },
    // --- OTHER PAGES (Update these with your content) ---
    pricingPage: {
      title: "Pricing",
      desc: "Choose the best plan for your business.",
      monthly: "Monthly",
      yearly: "Yearly",
      plans: [
        { name: "Starter", price: "$99", features: ["Basic Features", "Email Support"] },
        { name: "Professional", price: "$299", features: ["All Features", "24/7 Support"] }
      ]
    },
    storyPage: {
      title: "Our Story",
      content: "Pax Group was founded to serve humanity with technology..."
    },
    blogPage: {
      title: "Blog & Insights",
      readMore: "Read More"
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('tr');
  
  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);