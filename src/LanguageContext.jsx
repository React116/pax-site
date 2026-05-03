// src/LanguageContext.js
import React, { createContext, useState, useContext } from 'react';

// --- TÜM SİTE ÇEVİRİLERİ ---
const translations = {
  tr: {
    images: {
      hero: "/hero-tr.png",
      about: "/about-us-tr.jpg"
    },
    seo: {
      home:    { title: "PAX GROUP | Yapay Zeka & Yazılım Mühendisliği", desc: "PAX GROUP — işletmelerin ölçeklenmesini, operasyonları otomatize etmesini ve dijital dönüşümünü sağlayan akıllı yazılım sistemleri inşa ediyoruz." },
      solutions: { title: "Çözümler | PAX GROUP", desc: "SaaS geliştirme, yapay zeka otomasyonu ve dijital danışmanlık hizmetlerimizle işletmenizi geleceğe taşıyın." },
      pricing:  { title: "Fiyatlar | PAX GROUP", desc: "Her ölçek için şeffaf yazılım ve AI otomasyon paketleri. Projenize özel teklif alın." },
      story:    { title: "Hikayemiz | PAX GROUP", desc: "Karadağ merkezli, küresel hedefli — PAX GROUP'un kuruluş hikayesi ve vizyonu." },
      blog:     { title: "Blog | PAX GROUP", desc: "Yapay zeka, otomasyon ve yazılım geliştirme üzerine teknik içerikler." },
      cases:    { title: "Başarı Hikayeleri | PAX GROUP", desc: "Gerçek projeler, gerçek sonuçlar — PAX GROUP müşteri başarı hikayeleri." },
      login:    { title: "Giriş Yap | PAX GROUP", desc: "PAX GROUP müşteri paneline giriş yapın." },
      register: { title: "Kayıt Ol | PAX GROUP", desc: "PAX GROUP platformuna ücretsiz kayıt olun." },
    },
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
      corporate: "KURUMSAL",
      login: "Giriş Yap",
      register: "Kayıt Ol",
      myPanel: "Panelim",
      goPanel: "Panele Git"
    },
    hero: {
      badge: "ZEKA MÜHENDİSLİĞİ",
      titleStart: "Operasyonlarınızı",
      titleHighlight: "Otomatikleştirin",
      desc: "PAX GROUP, işletmelerin tekrar eden süreçlerini AI ile otomatikleştirir. Müşteri iletişiminden randevu yönetimine, satış takibinden raporlamaya — 48 saatte canlıya geçin.",
      btnDiscover: "Çözümleri Keşfedin",
      btnContact: "Ücretsiz Demo Al"
    },
    stats: {
      langTitle: "Dil Desteği",
      langDesc: "TR, EN, RU ve ME dillerinde tam destek.",
      deployTitle: "Saatte Canlıya Geçiş",
      deployDesc: "Hızlı entegrasyon ile 48 saat içinde sisteminiz hazır.",
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
      title: "Müşteri Deneyimleri",
      subtitle: "Süreçlerini dijitalleştiren işletmelerden.",
      verified: "Doğrulanmış Müşteri",
      reviews: [
        { title: "Sağlık & Klinik", text: "Randevu yönetimi ve hasta iletişimi tamamen otomatik hale geldi. Ekibimiz artık operasyonel işler yerine hastaya odaklanabiliyor." },
        { title: "Sağlık & Wellness", text: "Telefonla gelen rutin sorular neredeyse sıfıra indi. Kapasite doluluk oranımız gözle görülür biçimde arttı." },
        { title: "Gayrimenkul", text: "Potansiyel alıcılar günün her saatinde anında yanıt alabiliyor. Satış sürecimiz çok daha hızlı ilerliyor." },
        { title: "E-Ticaret", text: "Mesai saatleri dışındaki müşteri talepleri artık kaybolmuyor. Sepet terk oranımız belirgin şekilde düştü." },
        { title: "Güzellik & Estetik", text: "Müşterilerimiz WhatsApp üzerinden randevu oluşturabiliyor. Manuel takip ihtiyacımız ortadan kalktı." }
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
      sectors: [
        { value: "Klinik / Sağlık", label: "Klinik / Sağlık / Diş" },
        { value: "Güzellik / Spa / Pilates", label: "Güzellik / Spa / Pilates" },
        { value: "Finans / Danışmanlık", label: "Finans / Danışmanlık" },
        { value: "Eğitim / Kurs", label: "Eğitim / Kurs" },
        { value: "E-Ticaret", label: "E-Ticaret" },
        { value: "Ajans / Yazılım", label: "Ajans / Yazılım" },
        { value: "Turizm / Otel", label: "Turizm / Otel" },
        { value: "Diğer", label: "Diğer" }
      ],
      checkboxText: "Talebimin incelenip bana WhatsApp üzerinden hızlıca dönüş yapılmasını istiyorum.",
      btnSending: "Gönderiliyor...",
      btnSend: "Formu Gönder ve Başvur",
      success: "✅ Mesajınız başarıyla gönderildi!",
      error: "❌ Bir hata oluştu."
    },
    howItWorks: {
      badge: "Süreç",
      title: "Nasıl Çalışıyoruz?",
      subtitle: "Fikrinizden üretime kadar her adımda yanınızdayız.",
      steps: [
        { title: "Analiz & Keşif", desc: "İşletmenizi, hedef kitlenizi ve otomasyon ihtiyaçlarınızı derinlemesine analiz ediyoruz." },
        { title: "Mimari Tasarım", desc: "Ölçeklenebilir, güvenli ve size özel AI altyapısını tasarlıyoruz." },
        { title: "Geliştirme & Entegrasyon", desc: "WhatsApp, web ve sosyal medyaya AI ajanlarını kusursuz entegre ediyoruz." },
        { title: "Canlıya Geçiş & Destek", desc: "7/24 izleme ve teknik destek ile sisteminizi canlı tutuyoruz." }
      ]
    },
    whyPax: {
      title: "Neden PAX GROUP?",
      subtitle: "Balkanlar merkezli AI mühendisliği şirketi olarak fark yaratıyoruz.",
      items: [
        { title: "Veri Güvenliği", desc: "GDPR ve KVKK uyumlu altyapı. Verileriniz şifreli ve korumalı." },
        { title: "Yüksek Performans", desc: "Düşük gecikme süresi ve yüksek erişilebilirlik hedefiyle güvenilir performans." },
        { title: "Sürekli Geliştirme", desc: "AI modellerimiz düzenli olarak güncelleniyor, sisteminiz her zaman güncel kalıyor." },
        { title: "Çok Dilli Destek", desc: "TR, EN, RU ve ME dillerinde doğal dil işleme kabiliyeti." },
        { title: "Özel Model Fine-tuning", desc: "Sektörünüze özgü GPT fine-tuning ile yüksek doğruluk oranları." },
        { title: "Hızlı Entegrasyon", desc: "WhatsApp, Instagram, Web, Telegram — 48 saat içinde canlıya alın." }
      ]
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
    images: {
      hero: "/hero-en.png",
      about: "/about-us-en.jpg"
    },
    seo: {
      home:    { title: "PAX GROUP | AI & Software Engineering", desc: "PAX GROUP — we build intelligent digital systems that help businesses scale, automate operations, and grow with precision." },
      solutions: { title: "Solutions | PAX GROUP", desc: "SaaS development, AI automation, and digital consulting services to transform your business." },
      pricing:  { title: "Pricing | PAX GROUP", desc: "Transparent software and AI automation packages for every scale. Get a custom quote for your project." },
      story:    { title: "Our Story | PAX GROUP", desc: "Based in Montenegro, built for the world — the story and vision behind PAX GROUP." },
      blog:     { title: "Blog | PAX GROUP", desc: "Technical insights on AI, automation, and modern software engineering." },
      cases:    { title: "Case Studies | PAX GROUP", desc: "Real projects, real results — PAX GROUP client success stories." },
      login:    { title: "Login | PAX GROUP", desc: "Sign in to your PAX GROUP client dashboard." },
      register: { title: "Register | PAX GROUP", desc: "Create your free PAX GROUP account." },
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
      corporate: "CORPORATE",
      login: "Login",
      register: "Sign Up",
      myPanel: "My Panel",
      goPanel: "Go to Panel"
    },
    hero: {
      badge: "AI-DRIVEN AUTOMATION",
      titleStart: "Automate Your",
      titleHighlight: "Operations",
      desc: "PAX GROUP helps businesses eliminate repetitive work with AI. From customer communication to appointment management — go live in 48 hours.",
      btnDiscover: "Explore Solutions",
      btnContact: "Get a Free Demo"
    },
    stats: {
      langTitle: "Languages",
      langDesc: "Full support in TR, EN, RU and ME.",
      deployTitle: "Hours to Deploy",
      deployDesc: "Fast integration — your system live within 48 hours.",
      supportTitle: "24/7 Support",
      supportDesc: "Our technical team is always with you.",
      countryTitle: "Countries Served",
      countryDesc: "Global service network spanning Europe and beyond."
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
      title: "Client Experiences",
      subtitle: "From businesses that have digitised their operations.",
      verified: "Verified Client",
      reviews: [
        { title: "Healthcare & Clinic", text: "Appointment management and patient communication became fully automated. Our team can now focus on care, not admin." },
        { title: "Health & Wellness", text: "Routine enquiries by phone dropped to near zero. Our capacity utilisation improved noticeably." },
        { title: "Real Estate", text: "Prospective buyers get instant responses at any hour. Our sales process moves significantly faster." },
        { title: "E-Commerce", text: "Customer requests outside business hours are no longer lost. Cart abandonment dropped measurably." },
        { title: "Beauty & Aesthetics", text: "Clients book appointments directly via WhatsApp. Manual follow-up is a thing of the past." }
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
      sectors: [
        { value: "Healthcare / Clinic", label: "Healthcare / Clinic / Dental" },
        { value: "Beauty / Spa / Wellness", label: "Beauty / Spa / Wellness" },
        { value: "Finance / Consulting", label: "Finance / Consulting" },
        { value: "Education / Courses", label: "Education / Courses" },
        { value: "E-Commerce", label: "E-Commerce" },
        { value: "Agency / Software", label: "Agency / Software" },
        { value: "Tourism / Hotel", label: "Tourism / Hotel" },
        { value: "Other", label: "Other" }
      ],
      checkboxText: "I want my request reviewed and a quick reply via WhatsApp.",
      btnSending: "Sending...",
      btnSend: "Send Form & Apply",
      success: "✅ Your message has been sent successfully!",
      error: "❌ An error occurred."
    },
    howItWorks: {
      badge: "Process",
      title: "How We Work",
      subtitle: "From discovery to deployment — we're with you at every step.",
      steps: [
        { title: "Discovery & Analysis", desc: "We analyse your business, target audience, and automation needs in depth." },
        { title: "Architecture Design", desc: "We design a scalable, secure AI infrastructure tailored to your requirements." },
        { title: "Development & Integration", desc: "We integrate AI agents into WhatsApp, web, and other channels seamlessly." },
        { title: "Deployment & Support", desc: "We keep your system live with 24/7 monitoring and technical support." }
      ]
    },
    whyPax: {
      title: "Why PAX GROUP?",
      subtitle: "A software and AI engineering company built in the Balkans, serving globally.",
      items: [
        { title: "Data Security", desc: "GDPR compliant infrastructure. Your data is encrypted and protected." },
        { title: "Reliable Performance", desc: "Low latency and high availability built into every system we deliver." },
        { title: "Continuous Improvement", desc: "Our AI models are updated regularly so your system stays ahead of the curve." },
        { title: "Multilingual Support", desc: "Natural language processing in TR, EN, RU and ME." },
        { title: "Custom Model Fine-tuning", desc: "GPT fine-tuning tailored to your industry for higher accuracy." },
        { title: "Fast Integration", desc: "WhatsApp, Instagram, Web, Telegram — live within 48 hours." }
      ]
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
    pricingPage: {
      title: "Pricing",
      desc: "Choose the best plan for your business.",
      monthly: "Monthly",
      yearly: "Yearly",
      plans: [
        { name: "Starter", price: "€99", features: ["Basic Features", "Email Support"] },
        { name: "Professional", price: "€299", features: ["All Features", "24/7 Support"] }
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
  },

  ru: {
    images: {
      hero: "/hero-ru.png",
      about: "/about-us-ru.jpg"
    },
    seo: {
      home:    { title: "PAX GROUP | ИИ и программная инженерия", desc: "PAX GROUP — мы создаём интеллектуальные цифровые системы, которые помогают бизнесу масштабироваться и автоматизировать операции." },
      solutions: { title: "Решения | PAX GROUP", desc: "Разработка SaaS, автоматизация на базе ИИ и цифровой консалтинг для вашего бизнеса." },
      pricing:  { title: "Тарифы | PAX GROUP", desc: "Прозрачные пакеты программного обеспечения и автоматизации ИИ для любого масштаба." },
      story:    { title: "Наша история | PAX GROUP", desc: "Базируемся в Черногории, работаем для всего мира — история и видение PAX GROUP." },
      blog:     { title: "Блог | PAX GROUP", desc: "Технические материалы об ИИ, автоматизации и современной разработке программного обеспечения." },
      cases:    { title: "Кейсы | PAX GROUP", desc: "Реальные проекты, реальные результаты — истории успеха клиентов PAX GROUP." },
      login:    { title: "Вход | PAX GROUP", desc: "Войдите в панель управления PAX GROUP." },
      register: { title: "Регистрация | PAX GROUP", desc: "Создайте бесплатную учётную запись PAX GROUP." },
    },
    nav: {
      successStories: "Истории успеха",
      about: "О нас",
      whoWeAre: "Кто мы?",
      whoWeAreDesc: "История PAX Group",
      blog: "Блог и контент",
      blogDesc: "Технологические тренды",
      solutions: "Решения",
      pricing: "Цены",
      contact: "Контакты",
      consult: "Получить консультацию",
      corporate: "КОРПОРАТИВНОЕ",
      login: "Войти",
      register: "Регистрация",
      myPanel: "Мой кабинет",
      goPanel: "Перейти в кабинет"
    },
    hero: {
      badge: "AI-АВТОМАТИЗАЦИЯ",
      titleStart: "Автоматизируйте",
      titleHighlight: "Операции",
      desc: "PAX GROUP помогает бизнесу устранить рутинные процессы с помощью ИИ. От общения с клиентами до записи на приём — запуск за 48 часов.",
      btnDiscover: "Изучить решения",
      btnContact: "Получить демо"
    },
    stats: {
      langTitle: "Языков поддержки",
      langDesc: "Полная поддержка на TR, EN, RU и ME.",
      deployTitle: "Часов до запуска",
      deployDesc: "Быстрая интеграция — система готова за 48 часов.",
      supportTitle: "Поддержка 24/7",
      supportDesc: "Наша техническая команда всегда рядом с вами.",
      countryTitle: "Стран обслуживания",
      countryDesc: "Глобальная сервисная сеть в Европе и за её пределами."
    },
    solutions: {
      title: "Технологические решения",
      subtitle: "Комплексные цифровые услуги для вашего бизнеса.",
      btnDetail: "Подробнее",
      items: [
        { title: "Разработка SaaS платформ", desc: "Масштабируемые и безопасные программные инфраструктуры.", features: ["Современная архитектура", "Облачные технологии", "Высокая безопасность"] },
        { title: "AI-рабочая сила и чатбот", desc: "ИИ-ассистенты, работающие круглосуточно.", features: ["Автоматизация WhatsApp", "Ответы 24/7", "Мультиязычность"] },
        { title: "Стратегический консалтинг", desc: "Создаём дорожную карту цифровой трансформации.", features: ["Дорожная карта", "Снижение затрат", "Анализ рынка"] }
      ]
    },
    vision: {
      badge: "2025 • Черногория",
      titleStart: "Строим будущее",
      titleHighlight: "из Черногории",
      titleEnd: "",
      desc: "PAX GROUP строит надёжный технологический мост из Балкан в мир, объединяя европейскую инженерную дисциплину со скоростью ИИ.",
      btnStory: "Наша история"
    },
    testimonials: {
      title: "Отзывы клиентов",
      subtitle: "От компаний, перешедших на цифровые процессы.",
      verified: "Проверенный клиент",
      reviews: [
        { title: "Здравоохранение и клиника", text: "Управление записями и коммуникация с пациентами полностью автоматизированы. Команда сосредоточилась на уходе, а не на административных задачах." },
        { title: "Здоровье и велнес", text: "Рутинные телефонные запросы практически исчезли. Загруженность мощностей заметно возросла." },
        { title: "Недвижимость", text: "Потенциальные покупатели получают мгновенные ответы в любое время суток. Скорость продаж значительно увеличилась." },
        { title: "Электронная коммерция", text: "Запросы клиентов вне рабочего времени больше не теряются. Процент брошенных корзин снизился." },
        { title: "Красота и эстетика", text: "Клиенты записываются напрямую через WhatsApp. Ручное отслеживание ушло в прошлое." }
      ]
    },
    form: {
      title: "Начнём ваш проект",
      subtitle: "Заполните форму, чтобы трансформировать бизнес с помощью AI.",
      office: "Главный офис",
      phone: "Телефон",
      email: "Эл. почта",
      labels: {
        name: "Ваше имя / Название компании",
        phone: "Номер WhatsApp",
        email: "Ваш Email",
        sector: "Ваша отрасль",
        platforms: "Платформы для использования",
        customers: "Примерное количество клиентов в день",
        intent: "Намерение начать",
        fastReply: "Быстрый ответ"
      },
      placeholders: {
        name: "Напр.: Pax Tourism",
        phone: "+7 XXX XXX XX XX",
        email: "example@company.com",
        select: "Выбрать..."
      },
      intents: {
        now: "Хочу начать прямо сейчас",
        demo: "Хочу посмотреть демо",
        info: "Просто хочу информацию"
      },
      sectors: [
        { value: "Здравоохранение / Клиника", label: "Здравоохранение / Клиника / Стоматология" },
        { value: "Красота / Спа / Велнес", label: "Красота / Спа / Велнес" },
        { value: "Финансы / Консалтинг", label: "Финансы / Консалтинг" },
        { value: "Образование / Курсы", label: "Образование / Курсы" },
        { value: "Электронная коммерция", label: "Электронная коммерция" },
        { value: "Агентство / Разработка", label: "Агентство / Разработка ПО" },
        { value: "Туризм / Гостиница", label: "Туризм / Гостиница" },
        { value: "Другое", label: "Другое" }
      ],
      checkboxText: "Хочу, чтобы мою заявку рассмотрели и ответили через WhatsApp.",
      btnSending: "Отправка...",
      btnSend: "Отправить форму",
      success: "✅ Сообщение успешно отправлено!",
      error: "❌ Произошла ошибка."
    },
    howItWorks: {
      badge: "Процесс",
      title: "Как мы работаем",
      subtitle: "От идеи до запуска — мы рядом на каждом этапе.",
      steps: [
        { title: "Анализ и исследование", desc: "Мы глубоко анализируем ваш бизнес, целевую аудиторию и потребности в автоматизации." },
        { title: "Архитектурное проектирование", desc: "Разрабатываем масштабируемую и безопасную AI-инфраструктуру под ваши задачи." },
        { title: "Разработка и интеграция", desc: "Интегрируем AI-агентов в WhatsApp, веб и другие каналы без сбоев." },
        { title: "Запуск и поддержка", desc: "Мониторинг 24/7 и техническая поддержка, чтобы система работала бесперебойно." }
      ]
    },
    whyPax: {
      title: "Почему PAX GROUP?",
      subtitle: "Инженерная компания в области ПО и AI, базирующаяся на Балканах и работающая глобально.",
      items: [
        { title: "Безопасность данных", desc: "Инфраструктура соответствует GDPR. Ваши данные зашифрованы и защищены." },
        { title: "Надёжная производительность", desc: "Низкая задержка и высокая доступность в каждой системе." },
        { title: "Постоянное развитие", desc: "Наши AI-модели регулярно обновляются, а ваша система остаётся актуальной." },
        { title: "Многоязычная поддержка", desc: "Обработка естественного языка на TR, EN, RU и ME." },
        { title: "Тонкая настройка модели", desc: "Fine-tuning GPT для вашей отрасли обеспечивает высокую точность." },
        { title: "Быстрая интеграция", desc: "WhatsApp, Instagram, веб, Telegram — в работе за 48 часов." }
      ]
    },
    footer: {
      corporate: "Корпоративное",
      legal: "Политика конфиденциальности",
      terms: "Условия использования",
      cookies: "Политика файлов cookie",
      kvkk: "Соответствие GDPR",
      connect: "Оставайтесь на связи",
      rights: "© 2025 PAX GROUP GLOBAL. Все права защищены."
    },
    pricingPage: {
      title: "Тарифы",
      desc: "Выберите лучший план для вашего бизнеса.",
      monthly: "В месяц",
      yearly: "В год",
      plans: [
        { name: "Начальный", price: "€99", features: ["Базовые функции", "Email-поддержка"] },
        { name: "Профессиональный", price: "€299", features: ["Все функции", "Поддержка 24/7"] }
      ]
    },
    storyPage: {
      title: "Наша история",
      content: "Pax Group была основана для служения человечеству с помощью технологий..."
    },
    blogPage: {
      title: "Блог и статьи",
      readMore: "Читать далее"
    }
  },

  me: {
    images: {
      hero: "/hero-me.png",
      about: "/about-us-me.jpg"
    },
    seo: {
      home:    { title: "PAX GROUP | AI i softverski inženjering", desc: "PAX GROUP — gradimo inteligentne digitalne sisteme koji pomažu preduzećima da rastu, automatizuju operacije i digitalno se transformišu." },
      solutions: { title: "Rješenja | PAX GROUP", desc: "SaaS razvoj, AI automatizacija i digitalni konsalting za transformaciju vašeg poslovanja." },
      pricing:  { title: "Cijene | PAX GROUP", desc: "Transparentni paketi softvera i AI automatizacije za svaki nivo. Zatražite ponudu." },
      story:    { title: "Naša priča | PAX GROUP", desc: "Sjedište u Crnoj Gori, globalna vizija — priča i misija PAX GROUP." },
      blog:     { title: "Blog | PAX GROUP", desc: "Tehnički sadržaji o AI, automatizaciji i modernom razvoju softvera." },
      cases:    { title: "Studije slučaja | PAX GROUP", desc: "Pravi projekti, pravi rezultati — priče o uspjehu klijenata PAX GROUP." },
      login:    { title: "Prijava | PAX GROUP", desc: "Prijavite se na PAX GROUP kontrolnu tablu." },
      register: { title: "Registracija | PAX GROUP", desc: "Napravite besplatan PAX GROUP nalog." },
    },
    nav: {
      successStories: "Priče o uspjehu",
      about: "O nama",
      whoWeAre: "Ko smo mi?",
      whoWeAreDesc: "Priča PAX Grupe",
      blog: "Blog i sadržaj",
      blogDesc: "Tehnološki trendovi",
      solutions: "Rješenja",
      pricing: "Cijene",
      contact: "Kontakt",
      consult: "Zatražite savjet",
      corporate: "KORPORATIVNO",
      login: "Prijava",
      register: "Registracija",
      myPanel: "Moj panel",
      goPanel: "Idi na panel"
    },
    hero: {
      badge: "AI AUTOMATIZACIJA",
      titleStart: "Automatizujte",
      titleHighlight: "Operacije",
      desc: "PAX GROUP pomaže preduzećima da eliminišu ponavljajuće procese uz pomoć AI. Od komunikacije s klijentima do zakazivanja — pokretanje za 48 sati.",
      btnDiscover: "Istražite rješenja",
      btnContact: "Besplatna demo"
    },
    stats: {
      langTitle: "Jezičke podrške",
      langDesc: "Potpuna podrška na TR, EN, RU i ME.",
      deployTitle: "Sati do pokretanja",
      deployDesc: "Brza integracija — sistem spreman za 48 sati.",
      supportTitle: "Podrška 24/7",
      supportDesc: "Naš tehnički tim uvijek je uz vas.",
      countryTitle: "Zemalja u usluzi",
      countryDesc: "Globalna servisna mreža širom Evrope i šire."
    },
    solutions: {
      title: "Tehnološka rješenja",
      subtitle: "Sveobuhvatne digitalne usluge za vaše preduzeće.",
      btnDetail: "Pogledajte detalje",
      items: [
        { title: "Razvoj SaaS platformi", desc: "Skalabilne i sigurne softverske infrastrukture.", features: ["Moderna arhitektura", "Zasnovano na oblaku", "Visoka sigurnost"] },
        { title: "AI radna snaga i chatbot", desc: "AI asistenti koji rade 24/7.", features: ["WhatsApp automatizacija", "Odgovor 24/7", "Višejezičnost"] },
        { title: "Strateški konsalting", desc: "Kreiramo putokaz za vašu digitalnu transformaciju.", features: ["Putokaz", "Smanjenje troškova", "Analiza tržišta"] }
      ]
    },
    vision: {
      badge: "2025 • Crna Gora",
      titleStart: "Gradimo budućnost",
      titleHighlight: "iz Crne Gore",
      titleEnd: "",
      desc: "PAX GROUP gradi pouzdan tehnološki most od Balkana prema svijetu, kombinujući evropsku inženjersku disciplinu sa brzinom vještačke inteligencije.",
      btnStory: "Naša priča"
    },
    testimonials: {
      title: "Iskustva klijenata",
      subtitle: "Od preduzeća koja su digitalizovala svoje procese.",
      verified: "Verifikovani klijent",
      reviews: [
        { title: "Zdravstvo i klinika", text: "Upravljanje zakazivanjem i komunikacija s pacijentima su u potpunosti automatizovani. Tim se fokusira na njegu, a ne na administraciju." },
        { title: "Zdravlje i wellness", text: "Rutinski telefonski upiti su gotovo nestali. Iskorišćenost kapaciteta se primjetno povećala." },
        { title: "Nekretnine", text: "Potencijalni kupci dobijaju trenutne odgovore u bilo koje doba dana. Prodajni proces se odvija znatno brže." },
        { title: "E-Commerce", text: "Zahtjevi klijenata van radnog vremena više se ne gube. Stopa napuštanja korpe je opala." },
        { title: "Ljepota i estetika", text: "Klijenti zakazuju direktno putem WhatsApp-a. Ručno praćenje je stvar prošlosti." }
      ]
    },
    form: {
      title: "Pokrenimo vaš projekat",
      subtitle: "Popunite obrazac za transformaciju vašeg poslovanja uz AI.",
      office: "Sjedište",
      phone: "Telefon",
      email: "E-pošta",
      labels: {
        name: "Vaše ime / Naziv kompanije",
        phone: "WhatsApp broj",
        email: "Vaša e-adresa",
        sector: "Vaša industrija",
        platforms: "Platforme koje želite koristiti",
        customers: "Procijenjeni broj klijenata dnevno",
        intent: "Namjera početka",
        fastReply: "Brzi odgovor"
      },
      placeholders: {
        name: "Npr.: Pax Turizam",
        phone: "+382 XX XXX XXX",
        email: "primjer@kompanija.com",
        select: "Odaberite..."
      },
      intents: {
        now: "Želim početi odmah",
        demo: "Želim vidjeti demo",
        info: "Samo tražim informacije"
      },
      sectors: [
        { value: "Zdravstvo / Klinika", label: "Zdravstvo / Klinika / Stomatologija" },
        { value: "Ljepota / Spa / Wellness", label: "Ljepota / Spa / Wellness" },
        { value: "Finansije / Konsalting", label: "Finansije / Konsalting" },
        { value: "Obrazovanje / Kursevi", label: "Obrazovanje / Kursevi" },
        { value: "E-Commerce", label: "E-Commerce" },
        { value: "Agencija / Softver", label: "Agencija / Softver" },
        { value: "Turizam / Hotel", label: "Turizam / Hotel" },
        { value: "Ostalo", label: "Ostalo" }
      ],
      checkboxText: "Želim da moj zahtjev bude pregledan i da mi se brzo odgovori putem WhatsApp-a.",
      btnSending: "Slanje...",
      btnSend: "Pošaljite obrazac",
      success: "✅ Poruka je uspješno poslata!",
      error: "❌ Došlo je do greške."
    },
    howItWorks: {
      badge: "Proces",
      title: "Kako radimo",
      subtitle: "Od ideje do pokretanja — uz vas smo na svakom koraku.",
      steps: [
        { title: "Analiza i istraživanje", desc: "Duboko analiziramo vaše poslovanje, ciljnu publiku i potrebe za automatizacijom." },
        { title: "Arhitektonski dizajn", desc: "Dizajniramo skalabilnu i sigurnu AI infrastrukturu prilagođenu vašim zahtjevima." },
        { title: "Razvoj i integracija", desc: "Integrisani AI agenti u WhatsApp, web i druge kanale bez problema." },
        { title: "Pokretanje i podrška", desc: "Sistem održavamo živim uz 24/7 monitoring i tehničku podršku." }
      ]
    },
    whyPax: {
      title: "Zašto PAX GROUP?",
      subtitle: "Kompanija za softver i AI inženjering sa Balkana, koja posluje globalno.",
      items: [
        { title: "Sigurnost podataka", desc: "Infrastruktura usklađena s GDPR-om. Vaši podaci su šifrovani i zaštićeni." },
        { title: "Pouzdane performanse", desc: "Niska latencija i visoka dostupnost ugrađeni u svaki sistem koji isporučujemo." },
        { title: "Kontinuirani razvoj", desc: "Naši AI modeli se redovno ažuriraju, a vaš sistem ostaje u toku." },
        { title: "Višejezična podrška", desc: "Obrada prirodnog jezika na TR, EN, RU i ME." },
        { title: "Prilagođeno fino podešavanje modela", desc: "GPT fine-tuning prilagođen vašoj industriji za veću tačnost." },
        { title: "Brza integracija", desc: "WhatsApp, Instagram, web, Telegram — u pogonu za 48 sati." }
      ]
    },
    footer: {
      corporate: "Korporativno",
      legal: "Politika privatnosti",
      terms: "Uslovi korišćenja",
      cookies: "Politika kolačića",
      kvkk: "GDPR usklađenost",
      connect: "Ostanite u kontaktu",
      rights: "© 2025 PAX GROUP GLOBAL. Sva prava zadržana."
    },
    pricingPage: {
      title: "Cijene",
      desc: "Odaberite najbolji plan za vaše preduzeće.",
      monthly: "Mjesečno",
      yearly: "Godišnje",
      plans: [
        { name: "Početni", price: "€99", features: ["Osnovne funkcije", "E-mail podrška"] },
        { name: "Profesionalni", price: "€299", features: ["Sve funkcije", "Podrška 24/7"] }
      ]
    },
    storyPage: {
      title: "Naša priča",
      content: "Pax Group je osnovan da služi čovječanstvu uz pomoć tehnologije..."
    },
    blogPage: {
      title: "Blog i napisi",
      readMore: "Pročitajte više"
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
