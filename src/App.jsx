import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Menu, X, Code2, BrainCircuit, LineChart,
  MapPin, Phone, Mail, CheckCircle2, MessageSquare,
  Linkedin, Instagram, Youtube, Send, Twitter, ShieldCheck, Lock, Check, Star,
  TrendingUp, Activity, Server, ChevronDown, BookOpen, Globe, User, Settings,
  Zap, Shield, Cpu, Layers, Rocket, Database, Cloud, GitBranch, Gauge, Sparkles,
  Terminal, Workflow, ChevronRight, Bot, Search
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
import CalendarPage from './pages/CalendarPage';

// --- PANEL VE AUTH IMPORTLARI ---
import Register from './Register';
import Login from './Login';
import DashboardLayout from './layouts/DashboardLayout';   // YENİ: Sidebar'ı tutan kabuk
import DashboardOverview from './pages/DashboardOverview'; // YENİ: Ana panel görünümü
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

// --- COUNTER HOOK ---
const useCountUp = (end, duration = 1800) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);
  return { count, ref };
};

// --- NAVBAR (MENÜ - TEMİZ HALİ) ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const { language, toggleLanguage, t } = useLanguage();

  const langs = [
    { code: 'tr', flag: 'https://flagcdn.com/w40/tr.png', label: 'Türkçe' },
    { code: 'en', flag: 'https://flagcdn.com/w40/gb.png', label: 'English' },
    { code: 'ru', flag: 'https://flagcdn.com/w40/ru.png', label: 'Русский' },
    { code: 'me', flag: 'https://flagcdn.com/w40/me.png', label: 'Crnogorski' },
  ];
  const currentLang = langs.find(l => l.code === language);

  // Sayfa değişimini ve giriş durumunu takip et
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("userName");
    setIsLoggedIn(!!user);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          
          {/* DİL DROPDOWN */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-sm font-bold text-[#001F54] border border-transparent hover:border-slate-200"
            >
              <img src={currentLang.flag} alt={currentLang.code} className="w-5 h-auto rounded-sm shadow-sm" />
              <span className="uppercase text-xs">{currentLang.code}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-50">
                {langs.map(({ code, flag, label }) => (
                  <button
                    key={code}
                    onClick={() => { toggleLanguage(code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${language === code ? 'bg-blue-50 text-[#001F54] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <img src={flag} alt={label} className="w-6 h-auto rounded-sm shadow-sm" />
                    <span>{label}</span>
                    {language === code && <Check size={14} className="ml-auto text-[#001F54]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* GİRİŞ KONTROLÜ - SADECE PANEL BUTONU */}
          {isLoggedIn ? (
            <Link to="/panel" className="bg-green-500 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-green-600 transition-all flex items-center gap-2 shadow-md">
               <User size={18} /> {t.nav.myPanel}
            </Link>
          ) : (
            <div className="flex items-center gap-3">
               <Link to="/giris-yap" className="text-[#001F54] font-bold hover:text-blue-600">{t.nav.login}</Link>
               <Link to="/kayit-ol" className="bg-[#001F54] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-[#0f172a]">{t.nav.register}</Link>
            </div>
          )}

        </div>
        
        {/* MOBİL HAMBURGER BUTONU */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 font-bold text-sm text-[#001F54] border border-slate-200 px-3 py-1.5 rounded-full bg-slate-50"
          >
            <img src={currentLang.flag} alt={currentLang.code} className="w-5 h-auto rounded-sm shadow-sm" />
            <span className="text-xs uppercase">{currentLang.code}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
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
                   <User size={20} /> {t.nav.goPanel}
                </Link>
             ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/giris-yap" onClick={() => setIsOpen(false)} className="text-center py-3 border border-slate-200 rounded-xl font-bold text-[#001F54]">{t.nav.login}</Link>
                  <Link to="/kayit-ol" onClick={() => setIsOpen(false)} className="text-center py-3 bg-[#001F54] text-white rounded-xl font-bold">{t.nav.register}</Link>
                </div>
             )}
          </div>

          {/* MOBİL DİL SEÇİCİ */}
          <div className="pb-4 border-b border-slate-50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dil / Language</div>
            <div className="flex flex-col gap-1">
              {langs.map(({ code, flag, label }) => (
                <button
                  key={code}
                  onClick={() => { toggleLanguage(code); setIsOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${language === code ? 'bg-[#001F54] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <img src={flag} alt={label} className="w-6 h-auto rounded-sm shadow-sm" />
                  <span>{label}</span>
                  {language === code && <Check size={14} className="ml-auto text-white" />}
                </button>
              ))}
            </div>
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

// --- İSTATİSTİKLER (AnimasyonLU) ---
const StatCard = ({ end, suffix = '', label, desc, highlight }) => {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref} className={`p-8 rounded-3xl text-center transition-all duration-300 hover:-translate-y-2 group ${highlight ? 'bg-gradient-to-br from-[#001F54] to-[#0f2b6b] shadow-2xl shadow-blue-900/30 border-0' : 'bg-white border border-slate-100 shadow-sm hover:shadow-xl'}`}>
      <div className={`text-4xl md:text-5xl font-bold mb-2 font-serif group-hover:scale-110 transition-transform ${highlight ? 'text-white' : 'text-[#001F54]'}`}>
        {count}{suffix}
      </div>
      <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>{label}</div>
      <p className={`text-xs leading-relaxed px-2 ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>{desc}</p>
    </div>
  );
};

const StatsSection = ({ t }) => (
  <div className="py-20 bg-slate-50 relative z-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard end={500} suffix="k+" label={t.stats.msgTitle} desc={t.stats.msgDesc} />
        <StatCard end={99} suffix="%" label={t.stats.satisfactionTitle} desc={t.stats.satisfactionDesc} highlight />
        <StatCard end={24} suffix="/7" label={t.stats.supportTitle} desc={t.stats.supportDesc} />
        <StatCard end={10} suffix="+" label={t.stats.countryTitle} desc={t.stats.countryDesc} />
      </div>
    </div>
  </div>
);

// --- TEKNOLOJİ BANNER ---
const TechBanner = () => {
  const techs = ['OpenAI GPT-4o', 'React 19', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'WhatsApp API', 'Redis', 'Stripe', 'Vercel', 'TypeScript', 'Tailwind CSS'];
  return (
    <div className="py-6 bg-[#0d1117] overflow-hidden border-y border-slate-800">
      <div className="relative flex overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#0d1117] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#0d1117] to-transparent z-10 pointer-events-none" />
        <motion.div
          className="flex gap-0 shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          style={{ width: "max-content" }}
        >
          {[...techs, ...techs].map((tech, i) => (
            <div key={i} className="flex items-center gap-3 px-6 border-r border-slate-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-slate-400 font-code text-sm whitespace-nowrap">{tech}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- NASIL ÇALIŞIR ---
const HowItWorks = () => {
  const steps = [
    { icon: <Search size={24} />, num: "01", title: "Analiz & Keşif", desc: "İşletmenizi, hedef kitlenizi ve otomasyon ihtiyaçlarınızı derinlemesine analiz ediyoruz.", color: "from-blue-500 to-blue-600" },
    { icon: <Layers size={24} />, num: "02", title: "Mimari Tasarım", desc: "Ölçeklenebilir, güvenli ve size özel AI altyapısını tasarlıyoruz.", color: "from-violet-500 to-violet-600" },
    { icon: <Code2 size={24} />, num: "03", title: "Geliştirme & Entegrasyon", desc: "WhatsApp, web ve sosyal medyaya AI ajanlarını kusursuz entegre ediyoruz.", color: "from-teal-500 to-teal-600" },
    { icon: <Rocket size={24} />, num: "04", title: "Canlıya Geçiş & Destek", desc: "7/24 izleme ve teknik destek ile sisteminizi canlı tutuyoruz.", color: "from-orange-500 to-orange-600" },
  ];
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.05)_0%,_transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
            <Workflow size={12} /> Süreç
          </div>
          <h2 className="text-4xl font-bold text-[#0f172a] font-serif mb-4">Nasıl Çalışıyoruz?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Fikrinizden üretime kadar her adımda yanınızdayız.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="tech-card relative rounded-2xl p-7 border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>
              <div className="text-5xl font-bold text-slate-100 font-code absolute top-5 right-5 select-none">{step.num}</div>
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}
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
      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-16 lg:pt-44 lg:pb-28 overflow-hidden bg-[#f8fafc]">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Gradient orbs */}
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-300/20 rounded-full blur-[100px] animate-blob pointer-events-none" />
        <div className="absolute bottom-10 right-[5%] w-80 h-80 bg-violet-300/20 rounded-full blur-[80px] animate-blob-slow pointer-events-none" />
        <div className="absolute top-40 right-[30%] w-64 h-64 bg-teal-300/15 rounded-full blur-[80px] animate-blob-slow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">{t.hero.badge}</span>
              </motion.div>

              {/* Title */}
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-[5.5rem] font-bold text-[#0f172a] leading-[1.05] mb-6 font-serif tracking-tight">
                {t.hero.titleStart} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-blue-500 to-teal-500 animate-gradient-x">{t.hero.titleHighlight}</span>
                <span className="text-teal-500">.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                {t.hero.desc}
              </motion.p>

              {/* Tech stack pills */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-10">
                {[
                  { icon: <BrainCircuit size={13} />, label: 'GPT-4o' },
                  { icon: <Code2 size={13} />, label: 'React 19' },
                  { icon: <Database size={13} />, label: 'MongoDB' },
                  { icon: <Cloud size={13} />, label: 'AWS' },
                  { icon: <Zap size={13} />, label: 'Edge AI' },
                ].map(({ icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors">
                    <span className="text-blue-500">{icon}</span>{label}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link to="/cozumler" className="bg-[#001F54] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#0f172a] hover:scale-[1.02] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 group">
                  {t.hero.btnDiscover} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-full font-bold text-sm text-[#001F54] bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm flex items-center justify-center gap-2">
                  <MessageSquare size={16} /> {t.hero.btnContact}
                </button>
              </motion.div>
            </motion.div>

            {/* ─── SAĞ: DARK CODE TERMİNAL ─── */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              {/* Glow halo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-teal-500/10 blur-3xl rounded-full -z-10" />

              {/* Terminal window */}
              <div className="relative bg-[#0d1117] rounded-2xl border border-slate-700/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-5 py-3 bg-[#161b22] border-b border-slate-700/80">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-3 flex items-center gap-2 text-slate-400 text-xs font-code">
                    <Terminal size={12} /> pax-ai-engine  ~  main
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-[10px] font-code font-bold">LIVE</span>
                  </div>
                </div>

                {/* Code body */}
                <div className="p-6 font-code text-[13px] space-y-1.5 leading-relaxed">
                  <div><span className="text-slate-500">// PAX AI Engine v3.1 — production</span></div>
                  <div className="mt-2">
                    <span className="text-purple-400">import</span>
                    <span className="text-white"> {"{ PaxAgent }"} </span>
                    <span className="text-purple-400">from</span>
                    <span className="text-green-400"> '@paxgroup/core'</span>
                  </div>
                  <div>
                    <span className="text-purple-400">import</span>
                    <span className="text-white"> {"{ WhatsApp, WebChat }"} </span>
                    <span className="text-purple-400">from</span>
                    <span className="text-green-400"> '@paxgroup/channels'</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-blue-400">const</span>
                    <span className="text-yellow-300"> agent </span>
                    <span className="text-white">= </span>
                    <span className="text-blue-400">new </span>
                    <span className="text-teal-400">PaxAgent</span>
                    <span className="text-white">{"({"}</span>
                  </div>
                  <div className="pl-4"><span className="text-orange-300">model</span><span className="text-white">: </span><span className="text-green-400">'gpt-4o'</span><span className="text-white">,</span></div>
                  <div className="pl-4"><span className="text-orange-300">channels</span><span className="text-white">: [WhatsApp, WebChat],</span></div>
                  <div className="pl-4"><span className="text-orange-300">languages</span><span className="text-white">: [</span><span className="text-green-400">'tr'</span><span className="text-white">, </span><span className="text-green-400">'en'</span><span className="text-white">, </span><span className="text-green-400">'ru'</span><span className="text-white">, </span><span className="text-green-400">'me'</span><span className="text-white">],</span></div>
                  <div className="pl-4"><span className="text-orange-300">mode</span><span className="text-white">: </span><span className="text-green-400">'autonomous'</span></div>
                  <div><span className="text-white">{"});"}</span></div>
                  <div className="mt-2">
                    <span className="text-blue-400">await </span>
                    <span className="text-yellow-300">agent</span>
                    <span className="text-white">.</span>
                    <span className="text-teal-400">deploy</span>
                    <span className="text-white">()</span>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2"><span className="text-green-400">✓</span><span className="text-green-400 text-xs">Agent deployed successfully</span></div>
                    <div className="flex items-center gap-2"><span className="text-green-400">✓</span><span className="text-slate-300 text-xs">Listening on 4 channels</span></div>
                    <div className="flex items-center gap-2"><span className="text-green-400">✓</span><span className="text-slate-300 text-xs">Handling 1,247 active conversations</span></div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-blue-400">›</span>
                      <span className="text-white animate-cursor">_</span>
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div className="border-t border-slate-700/80 px-5 py-2.5 flex justify-between text-[11px] font-code bg-[#0d1117]">
                  <span className="text-slate-500">uptime <span className="text-green-400">99.99%</span></span>
                  <span className="text-slate-500">msgs/day <span className="text-blue-400">17,439</span></span>
                  <span className="text-slate-500">latency <span className="text-teal-400">42ms</span></span>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-5 -right-10 bg-white rounded-2xl shadow-2xl border border-slate-100 px-4 py-3 flex items-center gap-3 animate-float">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center"><TrendingUp size={18} className="text-green-600" /></div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Revenue Growth</div>
                  <div className="text-base font-bold text-slate-800">+127%</div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-8 bg-[#001F54] text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-float-delay">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center"><Bot size={18} className="text-blue-200" /></div>
                <div>
                  <div className="text-[10px] text-blue-200 font-bold uppercase">AI Agents</div>
                  <div className="text-xs font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      
      {/* ─── İSTATİSTİKLER ─── */}
      <StatsSection t={t} />

      {/* ─── TEKNOLOJİ BANNER ─── */}
      <TechBanner />

      {/* ─── ÇÖZÜMLER ─── */}
      <section id="solutions" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(37,99,235,0.04)_0%,_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} /> {t.solutions.title}
            </div>
            <h2 className="text-4xl font-bold text-[#0f172a] mb-4 font-serif">{t.solutions.title}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{t.solutions.subtitle}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }}
                className="tech-card relative rounded-2xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full bg-white group">
                {/* Top accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${idx === 0 ? 'from-blue-500 to-blue-600' : idx === 1 ? 'from-teal-500 to-teal-600' : 'from-violet-500 to-violet-600'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <h3 className="text-xl font-bold text-[#001F54] mb-3 font-serif">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6 text-sm">{item.desc}</p>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.features.map((feature, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-semibold text-slate-600">
                        <Check size={10} className="text-green-500 stroke-[3]" />{feature}
                      </span>
                    ))}
                  </div>
                  <Link to={`/cozumler#${item.id}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#001F54] font-bold hover:bg-[#001F54] hover:text-white hover:border-[#001F54] transition-all text-sm group/btn">
                    {t.solutions.btnDetail} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NASIL ÇALIŞIR ─── */}
      <HowItWorks />

      {/* ─── VİZYON ─── */}
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

      {/* ─── NEDEN PAX? ─── */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0f172a] font-serif mb-4">Neden PAX GROUP?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Balkanlar'ın en yenilikçi AI mühendisliği firması olarak fark yaratıyoruz.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Shield size={22} />, title: "Enterprise Güvenlik", desc: "SOC2, GDPR ve KVKK uyumlu altyapı. Verileriniz her zaman korumalı.", color: "text-blue-600 bg-blue-50" },
              { icon: <Gauge size={22} />, title: "Yüksek Performans", desc: "42ms ortalama yanıt süresi ile rakipsiz hız. 99.99% uptime garantisi.", color: "text-green-600 bg-green-50" },
              { icon: <GitBranch size={22} />, title: "Sürekli Güncelleme", desc: "AI modellerimiz her gün optimize ediliyor. Siz uyurken biz çalışıyoruz.", color: "text-violet-600 bg-violet-50" },
              { icon: <Globe size={22} />, title: "Çok Dilli AI", desc: "TR, EN, RU, ME ve 20+ dilde doğal dil işleme kabiliyeti.", color: "text-teal-600 bg-teal-50" },
              { icon: <Cpu size={22} />, title: "Özel Model Fine-tuning", desc: "Sektörünüze özgü GPT fine-tuning ile rakipsiz doğruluk oranları.", color: "text-orange-600 bg-orange-50" },
              { icon: <Zap size={22} />, title: "Hızlı Entegrasyon", desc: "WhatsApp, Instagram, Web, Telegram — 48 saat içinde canlıya alın.", color: "text-yellow-600 bg-yellow-50" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 flex gap-4 group hover:-translate-y-1">
                <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <div>
                  <h4 className="font-bold text-[#0f172a] mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <AdvancedContactForm />
    </>
  );
};

const WhatsAppButton = () => (
  <a href="https://wa.me/38268599708" target="_blank" rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-[#20bc5a] transition-all duration-300 flex items-center justify-center"
    aria-label="WhatsApp"
  >
    <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.627 4.672 1.816 6.693L2.667 29.333l6.827-1.789A13.287 13.287 0 0 0 16.003 29.333C23.37 29.333 29.333 23.363 29.333 16S23.37 2.667 16.003 2.667zm0 2.4c6.032 0 10.933 4.902 10.933 10.933S22.035 26.933 16.003 26.933c-2.052 0-3.99-.565-5.653-1.548l-.407-.24-4.05 1.062 1.082-3.945-.264-.424A10.897 10.897 0 0 1 5.07 16c0-6.031 4.901-10.933 10.933-10.933zm-3.29 5.6c-.197 0-.516.074-.787.369-.27.296-1.033 1.01-1.033 2.46s1.057 2.853 1.205 3.051c.147.197 2.066 3.276 5.07 4.464 2.503.987 3.011.79 3.554.741.542-.049 1.747-.714 1.994-1.404.247-.69.247-1.28.173-1.404-.074-.123-.271-.197-.567-.345-.296-.148-1.747-.862-2.018-.96-.27-.098-.467-.148-.664.148-.197.296-.762.96-.934 1.157-.172.197-.345.222-.641.074-.296-.148-1.25-.46-2.38-1.47-.88-.786-1.474-1.756-1.647-2.053-.172-.296-.018-.456.13-.603.132-.133.296-.345.444-.517.148-.173.197-.297.296-.494.099-.197.05-.37-.024-.517-.074-.148-.653-1.608-.908-2.2-.24-.57-.487-.493-.664-.502l-.566-.01z"/>
    </svg>
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
              <Route path="/panel" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="settings" element={<BusinessSettings />} />
                <Route path="calendar" element={<CalendarPage />} />
              </Route>

            </Routes>
          </Layout>

        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;