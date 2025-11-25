import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Cookie } from 'lucide-react';

// Sayfa açıldığında en üste kaydırma
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

// Ortak Tasarım Şablonu
const LegalLayout = ({ title, icon, lastUpdated, children }) => (
  <div className="min-h-screen bg-[#f8fafc] py-24 px-6 font-sans">
    <ScrollToTop />
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-slate-200">
      
      {/* Üst Kısım */}
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[#001F54] font-semibold mb-8 hover:bg-blue-50 px-4 py-2 rounded-full transition-all">
          <ArrowLeft size={18} /> Ana Sayfaya Dön
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-50 text-[#001F54] rounded-xl">
            {icon}
          </div>
          <span className="text-slate-500 text-sm font-medium tracking-wide uppercase">Yasal Dökümanlar</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] mb-4">
          {title}
        </h1>
        <p className="text-slate-400 text-sm">Son Güncelleme: {lastUpdated}</p>
      </div>

      {/* İçerik Alanı */}
      <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

// --- 1. GİZLİLİK POLİTİKASI ---
export const PrivacyPolicy = () => (
  <LegalLayout 
    title="Gizlilik Politikası" 
    icon={<Shield size={32} />}
    lastUpdated="24 Kasım 2025"
  >
    <p className="lead text-xl text-slate-800 font-medium">
      PAX GROUP ("Şirket", "Biz") olarak, gizliliğinize ve kişisel verilerinizin güvenliğine büyük önem veriyoruz. Bu politika, web sitemizi kullandığınızda verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu şeffaf bir şekilde açıklar.
    </p>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">1. Toplanan Veriler</h3>
    <p>Hizmetlerimizi sunarken aşağıdaki veri türlerini toplayabiliriz:</p>
    <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
      <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, unvan.</li>
      <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, şirket adresi.</li>
      <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, işletim sistemi, ziyaret süreleri ve sayfa gezintileri.</li>
      <li><strong>Pazarlama Verileri:</strong> Bülten tercihleriniz ve iletişim izinleriniz.</li>
    </ul>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">2. Verilerin Kullanım Amacı</h3>
    <p>Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
    <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
      <li>Sözleşmesel yükümlülüklerin yerine getirilmesi ve danışmanlık hizmetlerinin sunulması.</li>
      <li>Müşteri destek süreçlerinin yönetilmesi ve taleplerin yanıtlanması.</li>
      <li>Yasal yükümlülüklere uyum (Karadağ ve Uluslararası yasalar).</li>
      <li>Hizmet kalitesinin artırılması ve site güvenliğinin sağlanması.</li>
    </ul>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">3. Verilerin Paylaşımı</h3>
    <p>
      Kişisel verileriniz, izniniz olmaksızın üçüncü şahıslara satılmaz. Ancak, aşağıdaki durumlarda paylaşım yapılabilir:
    </p>
    <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
      <li><strong>Yasal Zorunluluklar:</strong> Mahkeme emirleri veya resmi makamların talepleri doğrultusunda.</li>
      <li><strong>Hizmet Sağlayıcılar:</strong> Veri barındırma (hosting), e-posta servisleri ve analiz araçları gibi teknik altyapı sağlayıcıları.</li>
    </ul>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">4. Veri Güvenliği</h3>
    <p>
      Verileriniz, endüstri standardı <strong>SSL (Secure Socket Layer)</strong> şifreleme teknolojisi ile korunmaktadır. Sunucularımız düzenli güvenlik taramalarından geçmekte ve yetkisiz erişime karşı korunmaktadır.
    </p>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">5. Kullanıcı Hakları (GDPR & KVKK)</h3>
    <p>Kullanıcı olarak aşağıdaki haklara sahipsiniz:</p>
    <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
      <li>Verilerinizin işlenip işlenmediğini öğrenme.</li>
      <li>Verilerinizin silinmesini veya düzeltilmesini talep etme ("Unutulma Hakkı").</li>
      <li>Veri işlemeye itiraz etme.</li>
    </ul>
    <p className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
      Haklarınızı kullanmak için <strong>contact@paxgroupglobal.com</strong> adresine e-posta gönderebilirsiniz. Talebiniz 30 gün içinde yanıtlanacaktır.
    </p>
  </LegalLayout>
);

// --- 2. KULLANIM KOŞULLARI ---
export const TermsOfUse = () => (
  <LegalLayout 
    title="Kullanım Koşulları" 
    icon={<FileText size={32} />}
    lastUpdated="24 Kasım 2025"
  >
    <p className="lead text-xl text-slate-800 font-medium">
      Lütfen web sitemizi ("Site") kullanmadan önce bu Kullanım Koşullarını dikkatlice okuyunuz. Siteye erişerek veya kullanarak, bu koşulları kabul etmiş sayılırsınız.
    </p>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">1. Genel Hükümler</h3>
    <p>
      PAX GROUP, bu sitedeki içerikleri, fiyatları ve koşulları önceden haber vermeksizin değiştirme hakkını saklı tutar. Site üzerinde yer alan bilgiler genel bilgilendirme amaçlıdır ve profesyonel danışmanlık yerine geçmez.
    </p>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">2. Fikri Mülkiyet Hakları</h3>
    <p>
      Sitede yer alan tüm yazılımlar, tasarımlar, grafikler, logolar ve metinler PAX GROUP'un mülkiyetindedir. Bu içerikler, uluslararası telif hakkı yasaları ile korunmaktadır. İzinsiz olarak:
    </p>
    <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
      <li>Kopyalanamaz, çoğaltılamaz veya dağıtılamaz.</li>
      <li>Tersine mühendislik (Reverse Engineering) yapılamaz.</li>
      <li>Ticari amaçla kullanılamaz.</li>
    </ul>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">3. Yasaklanmış Faaliyetler</h3>
    <p>Kullanıcılar siteyi kullanırken aşağıdaki eylemlerden kaçınmalıdır:</p>
    <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
      <li>Site güvenliğini tehdit edecek saldırılar (DDoS, virüs yayma vb.).</li>
      <li>Diğer kullanıcıların verilerine izinsiz erişim sağlama.</li>
      <li>Siteyi yasa dışı faaliyetler için kullanma.</li>
    </ul>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">4. Sorumluluk Reddi</h3>
    <p>
      PAX GROUP, sitenin kesintisiz veya hatasız çalışacağını garanti etmez. Site kullanımı sonucunda oluşabilecek dolaylı veya doğrudan zararlardan şirketimiz sorumlu tutulamaz.
    </p>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">5. Uygulanacak Hukuk</h3>
    <p>
      Bu koşullardan doğacak uyuşmazlıklarda <strong>Karadağ (Montenegro)</strong> mahkemeleri yetkilidir.
    </p>
  </LegalLayout>
);

// --- 3. ÇEREZ POLİTİKASI ---
export const CookiePolicy = () => (
  <LegalLayout 
    title="Çerez (Cookie) Politikası" 
    icon={<Cookie size={32} />}
    lastUpdated="24 Kasım 2025"
  >
    <p className="lead text-xl text-slate-800 font-medium">
      Web sitemizde kullanıcı deneyimini iyileştirmek, site trafiğini analiz etmek ve hizmetlerimizi kişiselleştirmek amacıyla çerezler kullanılmaktadır.
    </p>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">1. Çerez Nedir?</h3>
    <p>
      Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler, sitenin daha verimli çalışmasını sağlar.
    </p>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">2. Kullandığımız Çerez Türleri</h3>
    <div className="space-y-6 mt-4">
      <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-blue-500">
        <h4 className="font-bold text-lg text-[#001F54]">Zorunlu Çerezler</h4>
        <p className="text-sm text-slate-600 mt-2">Sitenin temel fonksiyonlarının (sayfalar arası geçiş, güvenlik) çalışması için gereklidir. Bu çerezler kapatılamaz.</p>
      </div>
      
      <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-teal-500">
        <h4 className="font-bold text-lg text-[#001F54]">Analitik Çerezler</h4>
        <p className="text-sm text-slate-600 mt-2">Ziyaretçilerin siteyi nasıl kullandığını (hangi sayfalara girildiğini, ne kadar kalındığını) analiz etmemize yarar (Örn: Google Analytics).</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-indigo-500">
        <h4 className="font-bold text-lg text-[#001F54]">Pazarlama Çerezleri</h4>
        <p className="text-sm text-slate-600 mt-2">Size ilgi alanlarınıza uygun içerikler sunmak için kullanılır.</p>
      </div>
    </div>

    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">3. Çerezleri Nasıl Yönetebilirsiniz?</h3>
    <p>
      Çoğu tarayıcı çerezleri otomatik olarak kabul eder. Ancak, tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya silebilirsiniz.
    </p>
    <ul className="list-disc pl-6 space-y-2 marker:text-blue-500 mt-2">
      <li><strong>Google Chrome:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler</li>
      <li><strong>Safari:</strong> Tercihler &gt; Gizlilik</li>
      <li><strong>Firefox:</strong> Seçenekler &gt; Gizlilik ve Güvenlik</li>
    </ul>
    <p className="mt-4 text-red-500 text-sm">
      * Zorunlu çerezleri devre dışı bırakmanız durumunda web sitesinin bazı özellikleri düzgün çalışmayabilir.
    </p>
  </LegalLayout>
);

// --- 4. KVKK / GDPR AYDINLATMA ---
export const KvkkText = () => (
  <LegalLayout 
    title="KVKK ve GDPR Aydınlatma Metni" 
    icon={<Shield size={32} />}
    lastUpdated="24 Kasım 2025"
  >
    <p className="lead text-xl text-slate-800 font-medium">
      Bu metin, PAX GROUP olarak veri sorumlusu sıfatıyla, kişisel verilerinizin 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Genel Veri Koruma Tüzüğü (GDPR) uyarınca işlenmesine ilişkin aydınlatma amacı taşımaktadır.
    </p>
    <p className="mt-4">
      Detaylı bilgi için lütfen <Link to="/gizlilik-politikasi" className="text-blue-600 underline font-bold">Gizlilik Politikamızı</Link> inceleyiniz. Bu bölüm, yasal uyumluluk referanslarını içerir.
    </p>
    
    <h3 className="text-[#001F54] font-bold mt-8 mb-4 text-2xl">İletişim</h3>
    <p>
      Veri sorumlusu ile iletişime geçmek için: <br/>
      <strong>Adres:</strong> Zrtava Fasizma 46, Karadağ (Montenegro)<br/>
      <strong>E-posta:</strong> contact@paxgroupglobal.com
    </p>
  </LegalLayout>
);