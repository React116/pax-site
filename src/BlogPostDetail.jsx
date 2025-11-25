import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

// --- BLOG VERİTABANI (İÇERİKLER BURADA) ---
const blogPosts = [
  {
    id: 1,
    title: "2025 AI Trendleri: İşletmeler Nasıl Hazırlanmalı?",
    category: "Trendler",
    date: "24 Kasım 2025",
    readTime: "8 dk okuma",
    author: "PAX Research Team",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p class="lead">Yapay zeka artık bir "gelecek teknolojisi" değil, bugünün rekabet şartı. 2024 yılı üretken yapay zekanın (Generative AI) yılıydı, peki 2025'te bizi neler bekliyor?</p>
      
      <h3>1. Otonom Ajanlar (Autonomous Agents) Yükselişi</h3>
      <p>Şu ana kadar kullandığımız AI araçları (ChatGPT gibi) "pasif" araçlardı. Yani siz bir komut verirdiniz, o cevaplardı. 2025, "Aktif Ajanların" yılı olacak. Bu ajanlar, sadece soruyu cevaplamakla kalmayıp, sizin adınıza aksiyon alabilecekler.</p>
      <p>Örneğin, bir seyahat acentesi için çalışan AI ajanı, müşterinin talebini anlayıp, uçak biletini rezerve edecek, otelle iletişime geçip özel istekleri iletecek ve takvime işleyecektir. PAX Group olarak geliştirdiğimiz altyapılar şu an bu otonomiyi test ediyor.</p>

      <h3>2. Hiper-Kişiselleştirme ve "Segment of One"</h3>
      <p>Pazarlamada segmentasyon devri kapanıyor. Artık "Tek Kişilik Segment" (Segment of One) dönemi başlıyor. AI, milyonlarca müşterinizin her birine, sanki tek müşteriniz oymuş gibi davranmanızı sağlıyor. Web sitenizin anasayfası, giren kişinin geçmiş davranışlarına göre saniyeler içinde yeniden tasarlanacak.</p>

      <h3>3. Multimodal Yapay Zeka</h3>
      <p>Metin tabanlı iletişim, yerini ses, görüntü ve videonun aynı anda işlendiği modellere bırakıyor. Müşteriniz ürününüzün fotoğrafını çekip "Bunun bir boy büyüğü var mı?" diye sorduğunda, sistem görseli tanıyıp stok kontrolü yapabilecek.</p>

      <h3>4. AI Regülasyonları ve Etik (EU AI Act)</h3>
      <p>Avrupa Birliği'nin AI Yasası (EU AI Act) ile birlikte, işletmelerin kullandıkları algoritmaların şeffaflığı ve güvenliği denetlenecek. "Kara kutu" (Black Box) sistemler yerine, neden o kararı verdiğini açıklayabilen (Explainable AI) sistemlere geçiş zorunlu hale gelecek.</p>

      <h3>Sonuç: Hazır mısınız?</h3>
      <p>2025'te işletmeler ikiye ayrılacak: Yapay zekayı bir departman olarak görenler ve yapay zekayı şirketin DNA'sına işleyenler. PAX Group olarak misyonumuz, sizi ikinci gruba dahil etmek.</p>
    `
  },
  {
    id: 2,
    title: "WhatsApp Business API ile Satışları 3'e Katlayın",
    category: "Satış & Pazarlama",
    date: "20 Kasım 2025",
    readTime: "6 dk okuma",
    author: "Can Demir",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p class="lead">E-posta pazarlamasının açılma oranları %15-20 seviyelerinde sıkışıp kalmışken, WhatsApp mesajlarının açılma oranı %98. Peki bu gücü satış huninize (Sales Funnel) nasıl entegre edersiniz?</p>

      <h3>Neden WhatsApp Business API?</h3>
      <p>Standart WhatsApp Business uygulaması, küçük işletmeler için harikadır ancak ölçeklenemez. Binlerce müşteriye aynı anda manuel cevap veremezsiniz. API entegrasyonu, bu süreci otomatize eder ve CRM sisteminize (HubSpot, Salesforce vb.) bağlar.</p>

      <h3>Strateji 1: Terk Edilen Sepetleri Kurtarma</h3>
      <p>E-ticaret sitelerinde sepet terk etme oranı %70'tir. Müşteri sepetinde ürün bırakıp çıktığında, 1 saat sonra gelen samimi bir WhatsApp mesajı ("Merhaba Ahmet, beğendiğin ayakkabıyı senin için ayırdık, tükenmeden almak ister misin?") dönüşüm oranlarını %45 artırmaktadır.</p>

      <h3>Strateji 2: Katalog ve Uygulama İçi Satış</h3>
      <p>Müşteriyi web sitesine yönlendirmek her zaman gerekli değildir. WhatsApp'ın yeni "Flows" özelliği sayesinde, müşteri uygulamadan hiç çıkmadan ürün kataloğunu gezebilir, seçim yapabilir ve hatta ödeme yapabilir. Sürtünmesiz deneyim, satışı hızlandırır.</p>

      <h3>Strateji 3: 7/24 Müşteri Desteği ve SSS</h3>
      <p>"Kargom nerede?", "İade koşulları neler?" gibi sorular destek ekibinizin vaktinin %60'ını alır. Bir AI Chatbot, bu soruları saniyeler içinde yanıtlayarak insan kaynağınızı daha karmaşık problemler için saklar.</p>

      <div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 my-6">
        <strong>PAX İpucu:</strong> WhatsApp üzerinden çok sık ve alakasız mesaj atmak, numaranızın "Spam" olarak işaretlenmesine neden olabilir. Bizim geliştirdiğimiz algoritmalar, müşterinin en müsait olduğu saati ve ilgilendiği ürün grubunu analiz ederek sadece "değerli" bildirimler gönderir.
      </div>
    `
  },
  {
    id: 3,
    title: "Chatbotlar Öldü Mü? Otonom AI Ajanları Devri",
    category: "Teknoloji",
    date: "15 Kasım 2025",
    readTime: "7 dk okuma",
    author: "Teknoloji Ekibi",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p class="lead">Ekranda beliren ve sadece "Evet/Hayır" seçenekleri sunan o eski, sinir bozucu chatbotları unutun. Yapay Zeka Ajanları (AI Agents) devri başladı.</p>

      <h3>Chatbot vs. AI Ajanı: Fark Nedir?</h3>
      <p>Geleneksel chatbotlar "Karar Ağacı" (Decision Tree) mantığıyla çalışır. Önceden kodlanmamış bir soruyla karşılaştıklarında tıkanırlar. "Üzgünüm, bunu anlayamadım" cümlesi onların imzasıdır.</p>
      <p><strong>Otonom AI Ajanları</strong> ise Büyük Dil Modelleri (LLM - GPT-4, Claude 3 vb.) kullanır. Bağlamı anlarlar, hafızaları vardır ve en önemlisi "Amaç Odaklı" (Goal Oriented) çalışırlar.</p>

      <h3>Gerçek Hayat Senaryosu: Diş Kliniği Randevusu</h3>
      <ul>
        <li><strong>Eski Chatbot:</strong> "Randevu almak için 1'e bas." -> "Hangi gün?" -> "Saat seç." (Esneklik yok)</li>
        <li><strong>AI Ajanı:</strong> Müşteri: "Haftaya salı öğleden sonra boşluğunuz var mı? Dişim çok ağrıyor."<br>
        Ajan: "Geçmiş olsun Mehmet Bey. Salı 14:00 ve 16:30 boş. Ağrınız çoksa Pazartesi akşam 19:00'a sıkıştırabilirim, ne dersiniz?"</li>
      </ul>
      <p>Aradaki fark sadece teknoloji değil, "Empati" ve "Sorun Çözme" yeteneğidir.</p>

      <h3>İşletmeler İçin Avantajları</h3>
      <p>AI Ajanları, veritabanınıza bağlanarak stok kontrolü yapabilir, CRM'den müşteri geçmişini çekip "Geçen ay aldığınız serumdan memnun kaldınız mı?" diye sorabilir. Bu, müşteri sadakatini (LTV) artıran en büyük faktördür.</p>
    `
  },
  {
    id: 4,
    title: "Sağlık Turizminde Dijital Dönüşüm ve AI",
    category: "Sektörel",
    date: "10 Kasım 2025",
    readTime: "5 dk okuma",
    author: "Dr. AI Analyst",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p class="lead">Türkiye ve Balkanlar, sağlık turizminin merkez üssü haline geldi. Ancak yabancı hastalarla iletişimde yaşanan dil bariyerleri ve operasyonel gecikmeler, milyonlarca dolar kayba neden oluyor.</p>

      <h3>1. Dil Bariyerini Kaldıran Gerçek Zamanlı Çeviri</h3>
      <p>Bir hasta İtalya'dan yazdığında, kliniğinizdeki personelin İtalyanca bilmesine gerek yok. PAX Group'un geliştirdiği AI sistemleri, gelen mesajı anında Türkçeye, personelin cevabını da anında kusursuz bir İtalyancaya çevirir. Bu Google Translate çevirisi değil, tıbbi terminolojiye hakim, kurumsal bir dildir.</p>

      <h3>2. 7/24 Ön Teşhis (Triage) ve Lead Kalifikasyonu</h3>
      <p>Her "Fiyat nedir?" sorusu gerçek bir hasta adayı değildir. AI asistanı, doktordan önce bir ön görüşme yaparak hastanın şikayetlerini, fotoğraflarını (güvenli bir şekilde) ve tıbbi geçmişini toplar. Doktora sadece "Onaylanmış ve Hazır" hastalar yönlendirilir. Bu, doktorun verimliliğini %300 artırır.</p>

      <h3>3. Tedavi Sonrası Takip (After-Care)</h3>
      <p>Hasta ülkesine döndüğünde iletişim kopmamalıdır. "İlacınızı aldınız mı?", "Bugün şişlik durumu nasıl?" gibi otomatik ama kişisel takip mesajları, hasta memnuniyetini zirveye taşır ve "Word of Mouth" (Tavsiye) pazarlamasını güçlendirir.</p>

      <h3>Yatırım Getirisi (ROI)</h3>
      <p>Sağlık turizminde bir hastanın ortalama değeri (LTV) yüksektir. Ayda sadece 3 ekstra hasta kazandıran bir AI sistemi, maliyetini ilk haftadan amorti eder.</p>
    `
  },
  {
    id: 5,
    title: "E-Ticarette Hiper-Kişiselleştirme",
    category: "E-Ticaret",
    date: "05 Kasım 2025",
    readTime: "6 dk okuma",
    author: "PAX Commerce",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p class="lead">Müşterileriniz artık binlerce ürün arasında kaybolmak istemiyor. Onlar, sanki mağazaya girdiklerinde satış danışmanının onları tanıdığı gibi bir deneyim bekliyor.</p>

      <h3>Dinamik Vitrin Yönetimi</h3>
      <p>İki farklı müşteri sitenize girdiğinde neden aynı anasayfayı görsün? 
      <br><strong>Müşteri A:</strong> Sporcu, koşu ayakkabılarına bakıyor.
      <br><strong>Müşteri B:</strong> Ofis çalışanı, laptop çantalarına bakıyor.
      <br>AI algoritmaları, ziyaretçinin çerezlerini ve geçmişini analiz ederek anasayfa bannerlarını, öne çıkan ürünleri saniyeler içinde değiştirir.</p>

      <h3>Görsel Arama ve Stil Danışmanlığı</h3>
      <p>Müşteri, Instagram'da gördüğü bir kombinin ekran görüntüsünü sitenize yüklediğinde, yapay zeka envanterinizdeki en benzer ürünleri bulup getirebilir. Hatta "Bu gömleğin altına hangi pantolon gider?" sorusuna, moda trendlerine uygun kombin önerileri sunabilir.</p>

      <h3>Akıllı Fiyatlandırma (Dynamic Pricing)</h3>
      <p>Rakip fiyatlarını, stok durumunu ve talep yoğunluğunu anlık izleyen AI, kar marjınızı maksimize edecek en doğru fiyatı belirleyebilir. İndirim dönemlerinde "kime, ne kadar indirim" yapılacağını belirleyerek karlılığı korur.</p>

      <h3>Sonuç</h3>
      <p>Kişiselleştirme, müşteriye "Beni anlıyorlar" hissini verir. Bu his, fiyattan daha güçlü bir satın alma motivasyonudur.</p>
    `
  },
  {
    id: 6,
    title: "Operasyonel Maliyetleri Düşürme Rehberi",
    category: "Verimlilik",
    date: "01 Kasım 2025",
    readTime: "9 dk okuma",
    author: "Finans Ekibi",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600",
    content: `
      <p class="lead">Ekonomik belirsizlik dönemlerinde ciro artırmak kadar, maliyetleri düşürmek de kritiktir. Yapay zeka, personel azaltmak değil, personelin verimsiz işlerden kurtulmasını sağlamak içindir.</p>

      <h3>1. Veri Girişi ve Muhasebe Otomasyonu</h3>
      <p>Faturaların sisteme girilmesi, stok sayımı, banka mutabakatları... Bu işlemler manuel yapıldığında hem hata riski yüksektir hem de çok vakit alır. OCR (Optik Karakter Tanıma) ve RPA (Robotik Süreç Otomasyonu) teknolojileri ile faturalar taranır ve muhasebe programına hatasız işlenir.</p>

      <h3>2. İK ve İşe Alım Süreçleri</h3>
      <p>Bir iş ilanına gelen 500 CV'yi tek tek okumak bir İK uzmanının 3 gününü alır. AI, adayları yeteneklerine göre saniyeler içinde puanlar ve en uygun 10 adayı mülakat için sıralar. Ayrıca çalışanların izin takibi, bordro soruları gibi rutin işleri otomatik yanıtlayan iç asistanlar kullanılır.</p>

      <h3>3. Pazarlama İçeriği Üretimi</h3>
      <p>Blog yazıları, sosyal medya postları, ürün açıklamaları... Bir metin yazarının günde üretebileceği içerik sınırlıdır. Ancak bir editörün kontrolündeki AI, günde yüzlerce SEO uyumlu ürün açıklaması yazabilir. Bu, içerik maliyetlerini %80 düşürür.</p>

      <h3>Matematiksel Gerçek</h3>
      <p>Ayda 3.000 TL maaş alan bir personelin, günde 2 saatini verimsiz işe harcaması, işletmeye yılda binlerce dolar zarar yazar. AI yatırımı, bu "görünmez giderleri" ortadan kaldırır.</p>
    `
  }
];

const BlogPostDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">İçerik Bulunamadı</h2>
          <Link to="/blog" className="text-blue-600 hover:underline">Blog sayfasına dön</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pt-32 pb-20">
      
      {/* ÜST GÖRSEL & BAŞLIK ALANI */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#001F54] transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Blog'a Dön
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
            <Tag size={12} /> {post.category}
          </span>
          <span className="text-slate-400 text-sm flex items-center gap-1">
            <Calendar size={14} /> {post.date}
          </span>
          <span className="text-slate-400 text-sm flex items-center gap-1">
            <Clock size={14} /> {post.readTime}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] mb-8 font-serif leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-y border-slate-100 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#001F54] text-white flex items-center justify-center font-bold">
               <User size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{post.author}</div>
              <div className="text-xs text-slate-500">PAX Group Editor</div>
            </div>
          </div>
          <div className="flex gap-4">
             <button className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Share2 size={18} /></button>
             <button className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Linkedin size={18} /></button>
             <button className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Twitter size={18} /></button>
          </div>
        </div>
      </div>

      {/* ANA GÖRSEL */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden shadow-2xl aspect-video relative"
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </motion.div>
      </div>

      {/* İÇERİK METNİ */}
      <div className="max-w-3xl mx-auto px-6">
        <div 
          className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:text-[#0f172a] prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* ALT BİLGİ & CTA */}
        <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-blue-100 text-center">
           <h3 className="text-2xl font-bold text-[#001F54] mb-4 font-serif">Bu stratejiyi işinizde uygulamak ister misiniz?</h3>
           <p className="text-slate-600 mb-6">PAX Group uzmanları ile 15 dakikalık ücretsiz bir keşif toplantısı yapın, size özel yol haritasını çıkaralım.</p>
           <Link to="/#contact" className="inline-block bg-[#001F54] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition-all shadow-lg">
             Hemen Danışmanlık Alın
           </Link>
        </div>
      </div>

    </article>
  );
};

export default BlogPostDetail;