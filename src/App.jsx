import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Menu, X, Code2, BrainCircuit, LineChart, 
  MapPin, Phone, Mail, CheckCircle2, MessageSquare, 
  Linkedin, Instagram, Youtube, Send, Twitter, ShieldCheck, Lock, Check, Star,
  TrendingUp, Activity, Server, ChevronDown, BookOpen, Globe, User, Settings 
} from 'lucide-react';

// --- SAYFA İMPORTLARI ---
import { PrivacyPolicy, TermsOfUse, CookiePolicy, KvkkText } from './LegalPages';
import PricingPage from './PricingPage';
import BlogPostDetail from './BlogPostDetail';
import SolutionsPage from './SolutionsPage';
import StoryPage from './HikayeSayfasi'; 
import CaseStudiesPage from './CaseStudiesPage';
import BlogPage from './BlogPage';
import BusinessSettings from './pages/BusinessSettings';
import DashboardLayout from './layouts/DashboardLayout'; // YENİ
import DashboardOverview from './pages/DashboardOverview'; // YENİ
// BusinessSettings zaten vardı

// --- YENİ EKLENEN SAYFALAR ---
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute'; 
import { LanguageProvider, useLanguage } from './LanguageContext';

// --- SAYFA KAYDIRMA YARDIMCISI ---
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

// --- ANİMASYON AYARLARI ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

// --- NAVBAR (MENÜ - TEMİZ HALİ) ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  
  // Sayfa değişimini ve giriş durumunu takip et
  const location = useLocation(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("userName");
    setIsLoggedIn(!!user); 
  }, [location]); 
  
  const scrollToContact = () => {
    if (window.location.pathname === '/') {
       const contactSection = document.getElementById('contact');
       if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
       window.location.href = '/#contact';
    }
    setIsOpen(false);
  };

  return (
    <nav className="glass-nav fixed w-full top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
           <img 
             src="/logo.jpeg" 
             alt="PAX Logo" 
             className="h-20 w-auto object-contain mix-blend-multiply" 
           />
           <span className="text-2xl font-serif font-extrabold tracking-tight text-[#001F54] group-hover:opacity-80 transition-opacity">PAX GROUP</span>
        </Link>

        {/* MASAÜSTÜ MENÜSÜ */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-slate-600 font-sans text-sm tracking-wide z-50">
          
          <Link to="/basari-hikayeleri" className="text-orange-600 font-bold hover:text-[#001F54] transition-colors flex items-center gap-1">
            <TrendingUp size={16} /> {t.nav.successStories}
          </Link>

          {/* HAKKIMIZDA DROPDOWN */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-[#001F54] transition-colors py-8 outline-none">
              {t.nav.about} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full -left-4 w-56 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden hidden group-hover:block transform transition-all duration-200 origin-top">
              <div className="py-2">
                <Link to="/hikayemiz" className="block px-6 py-3 hover:bg-slate-50 text-slate-600 hover:text-[#001F54] transition-colors">
                  <div className="font-bold text-sm">{t.nav.whoWeAre}</div>
                  <div className="text-xs text-slate-400">{t.nav.whoWeAreDesc}</div>
                </Link>
                <div className="border-t border-slate-50 my-1"></div>
                <Link to="/blog" className="block px-6 py-3 hover:bg-slate-50 text-slate-600 hover:text-[#001F54] transition-colors">
                  <div className="font-bold text-sm flex items-center gap-2">{t.nav.blog} <span className="bg-blue-100 text-blue-600 text-[9px] px-1.5 py-0.5 rounded-full">NEW</span></div>
                  <div className="text-xs text-slate-400">{t.nav.blogDesc}</div>
                </Link>
              </div>
            </div>
          </div>

          <Link to="/cozumler" className="hover:text-[#001F54] transition-colors font-bold text-blue-600">{t.nav.solutions}</Link>
          <Link to="/fiyatlar" className="hover:text-[#001F54] transition-colors font-bold text-blue-600">{t.nav.pricing}</Link>
          <button onClick={scrollToContact} className="hover:text-[#001F54] transition-colors cursor-pointer">{t.nav.contact}</button>
          
          {/* DİL BUTONLARI */}
          <div className="flex items-center bg-slate-100 rounded-full p-1 h-8">
            <button onClick={() => toggleLanguage('tr')} className={`px-3 h-full rounded-full text-xs font-bold transition-all ${language === 'tr' ? 'bg-white text-[#001F54] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>TR</button>
            <button onClick={() => toggleLanguage('en')} className={`px-3 h-full rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-white text-[#001F54] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>EN</button>
          </div>

          {/* GİRİŞ KONTROLÜ - SADECE PANEL BUTONU */}
          {isLoggedIn ? (
            <Link to="/panel" className="bg-green-500 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-green-600 transition-all flex items-center gap-2 shadow-md">
               <User size={18} /> Panelim
            </Link>
          ) : (
            <div className="flex items-center gap-3">
               <Link to="/giris-yap" className="text-[#001F54] font-bold hover:text-blue-600">Giriş Yap</Link>
               <Link to="/kayit-ol" className="bg-[#001F54] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-[#0f172a]">Kayıt Ol</Link>
            </div>
          )}

        </div>
        
        {/* MOBİL HAMBURGER BUTONU */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => toggleLanguage(language === 'tr' ? 'en' : 'tr')} className="flex items-center gap-1 font-bold text-sm text-[#001F54] border border-slate-200 px-2 py-1 rounded-md">
            <Globe size={16}/> {language.toUpperCase()}
          </button>
          <button className="text-[#001F54]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBİL MENÜ İÇERİĞİ */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-2xl top-24 max-h-[80vh] overflow-y-auto">
          
          <div className="pb-4 border-b border-slate-50">
             {isLoggedIn ? (
                <Link to="/panel" onClick={() => setIsOpen(false)} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                   <User size={20} /> Panele Git
                </Link>
             ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/giris-yap" onClick={() => setIsOpen(false)} className="text-center py-3 border border-slate-200 rounded-xl font-bold text-[#001F54]">Giriş Yap</Link>
                  <Link to="/kayit-ol" onClick={() => setIsOpen(false)} className="text-center py-3 bg-[#001F54] text-white rounded-xl font-bold">Kayıt Ol</Link>
                </div>
             )}
          </div>

          <Link to="/basari-hikayeleri" onClick={() => setIsOpen(false)} className="text-lg font-bold text-orange-600 flex items-center gap-2"><TrendingUp size={20}/> {t.nav.successStories}</Link>
          <div className="border-t border-b border-slate-50 py-4 space-y-4">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.nav.corporate}</div>
             <Link to="/hikayemiz" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-800">{t.nav.whoWeAre}</Link>
             <Link to="/blog" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-800 flex items-center gap-2"><BookOpen size={18}/> {t.nav.blog}</Link>
          </div>
          <Link to="/cozumler" onClick={() => setIsOpen(false)} className="text-lg font-medium text-blue-600 font-bold">{t.nav.solutions}</Link>
          <Link to="/fiyatlar" onClick={() => setIsOpen(false)} className="text-lg font-medium text-blue-600 font-bold">{t.nav.pricing}</Link>
          <button onClick={scrollToContact} className="text-lg font-medium text-slate-800 text-left">{t.nav.contact}</button>
        </div>
      )}
    </nav>
  );
};


/////// --- FOOTER ---

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0f172a] text-slate-400 pt-16 pb-8 border-t border-slate-800 font-sans text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="font-serif text-white text-2xl font-bold tracking-tight mb-4">PAX GROUP</div>
            <div className="flex items-start gap-3"><MapPin size={18} className="text-blue-500 shrink-0 mt-1" /><span>Zrtava Fasizma 46,<br/>Budva, Montenegro</span></div>
            <div className="flex items-center gap-3"><Phone size={18} className="text-blue-500 shrink-0" /><span>+382 68 599708</span></div>
            <div className="flex items-center gap-3"><Mail size={18} className="text-blue-500 shrink-0" /><span>contact@paxgroupglobal.com</span></div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">{t.footer.corporate}</h4>
            <ul className="space-y-4">
              <li><Link to="/basari-hikayeleri" className="hover:text-blue-400 transition-colors">{t.nav.successStories}</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors">{t.nav.blog}</Link></li>
              <li><Link to="/gizlilik-politikasi" className="hover:text-blue-400 transition-colors">{t.footer.legal}</Link></li>
              <li><Link to="/kullanim-kosullari" className="hover:text-blue-400 transition-colors">{t.footer.terms}</Link></li>
              <li><Link to="/cerez-politikasi" className="hover:text-blue-400 transition-colors">{t.footer.cookies}</Link></li>
              <li><Link to="/kvkk-gdpr" className="hover:text-blue-400 transition-colors flex items-center gap-2">{t.footer.kvkk} <ShieldCheck size={14}/></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">{t.footer.connect}</h4>
            <div className="flex gap-4 mb-8">
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Linkedin size={20}/></a>
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-black hover:text-white transition-all"><Twitter size={20}/></a>
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-pink-600 hover:text-white transition-all"><Instagram size={20}/></a>
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Youtube size={20}/></a>
              <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-sky-500 hover:text-white transition-all"><Send size={20}/></a>
            </div>
            <div className="flex flex-col gap-2 text-xs"><div className="flex items-center gap-2 text-green-400"><Lock size={14}/> SSL Secure 256-bit</div><div className="flex items-center gap-2 text-blue-400"><CheckCircle2 size={14}/> GDPR Compliant</div></div>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-700 h-48 md:h-auto">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2936.566860074697!2d18.8359!3d42.2913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134dd495f3c5b5ad%3A0xdb6b6f790315f69!2sZrtava%20fa%C5%A1izma%2C%20Budva%2C%20Karada%C4%9F!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str" width="100%" height="100%" style={{border:0, filter: 'grayscale(100%) invert(90%) contrast(85%)'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"></iframe>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-600 flex flex-col md:flex-row justify-between items-center"><p>{t.footer.rights}</p><p>Montenegro • Europe</p></div>
      </div>
    </footer>
  );
};

// --- İLETİŞİM FORMU ---
const AdvancedContactForm = () => {
  const [formStatus, setFormStatus] = useState(null);
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const formData = new FormData(e.target);
    const platforms = [];
    document.querySelectorAll('input[name="platforms"]:checked').forEach((checkbox) => {
      platforms.push(checkbox.value);
    });
    formData.set('platforms', platforms.join(', '));

    try {
      const response = await fetch("https://formsubmit.co/ajax/contact@paxgroupglobal.com", {
        method: "POST", body: formData
      });
      if (response.ok) { setFormStatus('success'); e.target.reset(); } 
      else { setFormStatus('error'); }
    } catch (error) { setFormStatus('error'); }
  };

  return (
    <section id="contact" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-16">
        <div className="lg:col-span-2">
          <div className="sticky top-32">
            <h2 className="text-4xl font-bold text-[#0f172a] mb-6 font-serif">{t.form.title}</h2>
            <p className="text-slate-600 mb-8 text-lg">{t.form.subtitle}</p>
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4"><div className="bg-blue-100 p-3 rounded-full text-[#001F54]"><MapPin size={20} /></div><div><h4 className="font-bold text-[#0f172a]">{t.form.office}</h4><p className="text-sm text-slate-500">Zrtava Fasizma 46, Montenegro</p></div></div>
              <div className="flex items-center gap-4"><div className="bg-blue-100 p-3 rounded-full text-[#001F54]"><Phone size={20} /></div><div><h4 className="font-bold text-[#0f172a]">{t.form.phone}</h4><p className="text-sm text-slate-500">+382 68 599708</p></div></div>
              <div className="flex items-center gap-4"><div className="bg-blue-100 p-3 rounded-full text-[#001F54]"><Mail size={20} /></div><div><h4 className="font-bold text-[#0f172a]">{t.form.email}</h4><p className="text-sm text-slate-500">contact@paxgroupglobal.com</p></div></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#001F54] via-blue-500 to-teal-400"></div>
            <input type="hidden" name="_subject" value="PAX WEB: Yeni Danışmanlık Talebi!" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.form.labels.name}</label><input required name="İsim_Firma" type="text" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#001F54] outline-none transition-all" placeholder={t.form.placeholders.name} /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.form.labels.phone}</label><input required name="Telefon" type="tel" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#001F54] outline-none transition-all" placeholder={t.form.placeholders.phone} /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.form.labels.email}</label><input required name="email" type="email" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#001F54] outline-none transition-all" placeholder={t.form.placeholders.email} /></div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.form.labels.sector}</label>
                <select required name="Sektör" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#001F54] outline-none transition-all text-slate-600">
                  <option value="">{t.form.placeholders.select}</option><option value="Klinik / Sağlık">Klinik / Sağlık / Diş</option><option value="Güzellik / Spa / Pilates">Güzellik / Spa / Pilates</option><option value="Finans / Danışmanlık">Finans / Danışmanlık</option><option value="Eğitim / Kurs">Eğitim / Kurs</option><option value="E-Ticaret">E-Ticaret</option><option value="Ajans / Yazılım">Ajans / Yazılım</option><option value="Turizm / Otel">Turizm / Otel</option><option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t.form.labels.platforms}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['WhatsApp', 'Instagram DM', 'Web Chat', 'Telegram'].map((plat) => (
                    <label key={plat} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <input type="checkbox" name="platforms" value={plat} className="w-5 h-5 text-[#001F54] rounded focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-700">{plat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t.form.labels.customers}</label>
                <div className="flex flex-wrap gap-4">
                  {['1-20', '20-100', '100+'].map((count) => (
                    <label key={count} className="flex items-center gap-2 cursor-pointer">
                      <input required type="radio" name="Müşteri_Sayısı" value={count} className="w-4 h-4 text-[#001F54] focus:ring-[#001F54]" />
                      <span className="text-sm text-slate-600">{count}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.form.labels.intent}</label>
                <select required name="Niyet" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#001F54] outline-none transition-all text-slate-600">
                  <option value="">{t.form.placeholders.select}</option>
                  <option value="Hemen Başlamak İstiyorum">{t.form.intents.now}</option>
                  <option value="Demo Görmek İstiyorum">{t.form.intents.demo}</option>
                  <option value="Bilgi Almak İstiyorum">{t.form.intents.info}</option>
                </select>
              </div>
              <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl cursor-pointer border border-blue-100">
                <input type="checkbox" name="WhatsApp_Dönüş_İstiyor" value="EVET" className="w-5 h-5 mt-0.5 text-[#001F54] rounded focus:ring-[#001F54]" />
                <span className="text-sm text-slate-600"><strong>{t.form.labels.fastReply}:</strong> {t.form.checkboxText}</span>
              </label>
              {formStatus === 'success' ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center font-bold border border-green-200">{t.form.success}</div>
              ) : formStatus === 'error' ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl text-center font-bold border border-red-200">{t.form.error}</div>
              ) : (
                <button type="submit" disabled={formStatus === 'sending'} className="w-full bg-[#001F54] text-white font-bold py-4 rounded-xl hover:bg-[#0f172a] hover:scale-[1.01] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {formStatus === 'sending' ? t.form.btnSending : <><Send size={20} /> {t.form.btnSend}</>}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// --- MÜŞTERİ YORUMLARI ---
const Testimonials = () => {
  const { t } = useLanguage();
  const reviewsData = [
    { img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" },
    { img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" },
    { img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200" },
    { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" },
    { img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=200" }
  ];

  const reviews = t.testimonials.reviews.map((review, i) => ({
    ...review,
    img: reviewsData[i % reviewsData.length].img
  }));

  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-3xl font-bold text-[#0f172a] font-serif mb-4">{t.testimonials.title}</h2>
        <p className="text-slate-500">{t.testimonials.subtitle}</p>
      </div>
      <div className="relative w-full flex overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        <motion.div className="flex gap-6 px-4" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 50 }} style={{ width: "max-content" }}>
          {[...reviews, ...reviews].map((review, i) => (
            <div key={i} className="w-[350px] bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img src={review.img} alt={review.title} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"/>
                  <div><div className="h-3 w-24 bg-slate-300 rounded blur-[2px] mb-1 opacity-60 select-none">Gizli İsim</div><div className="text-[10px] font-bold text-[#001F54] uppercase tracking-wider">{review.title}</div></div>
                </div>
                <p className="text-slate-600 text-sm italic leading-relaxed">"{review.text}"</p>
              </div>
              <div className="flex gap-1 mt-4 text-orange-400 text-xs">★★★★★</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- ANA SAYFA ---
const HomePage = () => {
  const { t } = useLanguage();
  
  const solutionsData = [
    { id: "saas", icon: <Code2 className="text-[#3b82f6]" size={36} />, bg: "bg-blue-50" },
    { id: "ai", icon: <BrainCircuit className="text-teal-500" size={36} />, bg: "bg-teal-50" },
    { id: "consulting", icon: <LineChart className="text-indigo-500" size={36} />, bg: "bg-indigo-50" }
  ];

  const solutions = t.solutions.items.map((item, i) => ({
    ...item,
    ...solutionsData[i]
  }));

  return (
    <>
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-60"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">{t.hero.badge}</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-[5.5rem] font-bold text-[#0f172a] leading-[1] mb-6 font-serif tracking-tight">
                {t.hero.titleStart} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1d4ed8]">{t.hero.titleHighlight}</span>
                <span className="text-teal-500">.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg font-medium">
                {t.hero.desc}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link to="/cozumler" className="bg-[#001F54] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#0f172a] hover:scale-[1.02] transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2">
                  {t.hero.btnDiscover} <ArrowRight size={18} />
                </Link>
                <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 rounded-full font-bold text-sm text-[#001F54] bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm">
                  {t.hero.btnContact}
                </button>
              </motion.div>
            </motion.div>

            {/* DASHBOARD GÖRSELİ */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 blur-3xl rounded-full -z-10"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] p-8 w-full max-w-lg mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-wider uppercase">
                    <Activity size={14} /> LIVE DASHBOARD
                  </div>
                </div>
                <div className="relative h-48 w-full bg-gradient-to-b from-slate-50 to-white rounded-xl border border-dashed border-slate-200 mb-6 overflow-hidden flex items-end px-4 pb-0">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 opacity-30">
                     {[...Array(24)].map((_,i) => <div key={i} className="border-r border-t border-slate-100"></div>)}
                  </div>
                  <svg className="w-full h-full visible relative z-10 drop-shadow-md" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <path d="M0,80 C30,80 50,60 80,50 C110,40 140,45 170,20 L200,15" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,80 C30,80 50,60 80,50 C110,40 140,45 170,20 L200,15 V100 H0 Z" fill="url(#chartFill)" stroke="none" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-100"><CheckCircle2 size={20} /></div>
                    <div><div className="text-[10px] text-slate-400 font-bold uppercase">Status</div><div className="text-sm font-bold text-slate-800">All Systems Go</div></div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100"><Server size={20} /></div>
                    <div><div className="text-[10px] text-slate-400 font-bold uppercase">Uptime</div><div className="text-sm font-bold text-slate-800">99.99%</div></div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce [animation-duration:3s]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><TrendingUp size={20} /></div>
                    <div><div className="text-[10px] text-slate-400 font-bold uppercase">Revenue Growth</div><div className="text-xl font-bold text-slate-800">+127%</div></div>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-8 bg-[#001F54] text-white p-4 rounded-2xl shadow-xl shadow-blue-900/20 flex items-center gap-3 pr-6">
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><BrainCircuit size={20} className="text-blue-200" /></div>
                   <div><div className="text-[10px] text-blue-200 font-bold uppercase">AI Agents</div><div className="text-sm font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400"></span> Online</div></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* İSTATİSTİKLER */}
      <div className="py-20 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
               <div className="text-4xl md:text-5xl font-bold text-[#001F54] mb-2 font-serif group-hover:scale-110 transition-transform">500k+</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t.stats.msgTitle}</div>
               <p className="text-xs text-slate-500 leading-relaxed px-2">{t.stats.msgDesc}</p>
            </div>
            <div className="bg-[#001F54] p-8 rounded-3xl text-center shadow-2xl transform md:scale-110 z-10 border-4 border-white">
               <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">%99</div>
               <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-3">{t.stats.satisfactionTitle}</div>
               <p className="text-xs text-blue-100 leading-relaxed px-2">{t.stats.satisfactionDesc}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
               <div className="text-4xl md:text-5xl font-bold text-[#001F54] mb-2 font-serif group-hover:scale-110 transition-transform">7/24</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t.stats.supportTitle}</div>
               <p className="text-xs text-slate-500 leading-relaxed px-2">{t.stats.supportDesc}</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
               <div className="text-4xl md:text-5xl font-bold text-[#001F54] mb-2 font-serif group-hover:scale-110 transition-transform">10+</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t.stats.countryTitle}</div>
               <p className="text-xs text-slate-500 leading-relaxed px-2">{t.stats.countryDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ÇÖZÜMLER */}
      <section id="solutions" className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[#0f172a] mb-4 font-serif">{t.solutions.title}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{t.solutions.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>{item.icon}</div>
                <h3 className="text-2xl font-bold text-[#001F54] mb-3 font-serif">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">{item.desc}</p>
                <div className="mt-auto">
                  <div className="w-full h-px bg-slate-100 mb-6"></div>
                  <ul className="space-y-3">{item.features.map((feature, i) => (<li key={i} className="flex items-start gap-3 text-sm text-slate-600"><div className="mt-1 bg-green-100 p-1 rounded-full"><Check size={12} className="text-green-600 stroke-[3]" /></div>{feature}</li>))}</ul>
                  <Link to={`/cozumler#${item.id}`} className="block text-center w-full mt-8 py-3 rounded-xl border border-[#001F54] text-[#001F54] font-semibold hover:bg-[#001F54] hover:text-white transition-all text-sm">{t.solutions.btnDetail}</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VİZYON */}
      <div id="about" className="relative py-32 bg-[#0a192f] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold uppercase mb-6">
              <Star size={12} className="fill-blue-300" /> {t.vision.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif leading-tight">
              {t.vision.titleStart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">{t.vision.titleHighlight}</span> {t.vision.titleEnd}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              {t.vision.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/hikayemiz" className="inline-flex items-center justify-center gap-2 bg-white text-[#0a192f] px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {t.vision.btnStory} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          {/* SAĞ TARAF: SOYUT GÖRSEL */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-[#112240] p-8 rounded-3xl border border-slate-700 shadow-2xl">
               <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                 <div className="text-white font-bold">PAX VISION</div>
                 <div className="flex gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
               </div>
               <div className="space-y-4 font-mono text-sm text-blue-300">
                 <p>{`> Initializing PAX Core...`}</p>
                 <p>{`> Location: `}<span className="text-green-400">Montenegro (ME)</span></p>
                 <p>{`> Target: `}<span className="text-yellow-400">Global Impact</span></p>
                 <p>{`> Status: `}<span className="text-white bg-green-600 px-2 py-0.5 rounded">ONLINE</span></p>
                 <div className="h-2 bg-slate-700 rounded-full mt-4 overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-blue-400 to-teal-400 w-[100%] animate-[width_2s_ease-in-out]"></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <Testimonials />
      <AdvancedContactForm />
    </>
  );
};

const WhatsAppButton = () => (
  <a href="https://wa.me/38268599708" target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center">
    <MessageSquare size={28} fill="white" />
  </a>
);

// --- YENİ EKLENEN LAYOUT BİLEŞENİ ---
const Layout = ({ children }) => {
  const location = useLocation();
  // /panel ile başlayan TÜM sayfalarda Navbar/Footer gizle
  const isDashboard = location.pathname.startsWith('/panel'); 

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
      {!isDashboard && <WhatsAppButton />}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="antialiased selection:bg-blue-100 selection:text-[#001F54]">
          <ScrollToTop />
          
          {/* Layout bileşeni Rotaları sarmalar ve Navbar kontrolünü yapar */}
          <Layout>
           // src/App.jsx içindeki Routes kısmı:

<Routes>
  {/* --- GENEL SAYFALAR --- */}
  <Route path="/" element={<HomePage />} />
  <Route path="/basari-hikayeleri" element={<CaseStudiesPage />} />
  <Route path="/blog" element={<BlogPage />} />
  <Route path="/blog/:id" element={<BlogPostDetail />} />
  <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
  <Route path="/kullanim-kosullari" element={<TermsOfUse />} />
  <Route path="/cerez-politikasi" element={<CookiePolicy />} />
  <Route path="/kvkk-gdpr" element={<KvkkText />} />
  <Route path="/fiyatlar" element={<PricingPage />} />
  <Route path="/cozumler" element={<SolutionsPage />} />
  <Route path="/hikayemiz" element={<StoryPage />} />
  
  <Route path="/giris-yap" element={<Login />} />
  <Route path="/kayit-ol" element={<Register />} />

  {/* --- PANEL ROTALARI (NESTED) --- */}
  {/* Ana Panel Yolu: /panel */}
  <Route 
    path="/panel" 
    element={
      <ProtectedRoute>
        {/* Layout her zaman görünecek */}
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    {/* /panel adresine girince Overview açılacak */}
    <Route index element={<DashboardOverview />} />
    
    {/* /panel/settings adresine girince Settings, Layout'un içinde açılacak */}
    <Route path="settings" element={<BusinessSettings />} />
  </Route>

</Routes>
          </Layout>

        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;