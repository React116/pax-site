import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, MapPin, Phone, Globe, User, Clock, CreditCard, HelpCircle, ShieldAlert, Award } from 'lucide-react';

const BusinessSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    businessName: '', branches: '', phone: '', email: '',
    socialMedia: { website: '', instagram: '', facebook: '' },
    workingHours: '', languages: '',
    classTypes: '', classFormat: '', duration: '', pricing: '',
    freeTrial: false, onlineService: false,
    instructors: [], // Array
    requiredInfo: '', ageLimit: '', healthProtocols: '', doctorApproval: false,
    faq: [], // Array
    campaigns: '', referralDiscount: false, corporateMemberships: false,
    paymentMethods: { creditCard: false, transfer: false, pos: false, cash: false }
  });

  // --- VERİ ÇEKME ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/business-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Gelen veriyi state'e yaz (Eksik alanları varsayılanla doldur)
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Veri çekilemedi", error);
    }
  };

  // --- VERİ GÜNCELLEME (GENEL) ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Nested objeler (socialMedia, paymentMethods)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // --- EĞİTMEN YÖNETİMİ ---
  const addInstructor = () => {
    setFormData(prev => ({
      ...prev,
      instructors: [...prev.instructors, { name: '', specialty: '', certs: '', bio: '' }]
    }));
  };
  const updateInstructor = (index, field, value) => {
    const newInstructors = [...formData.instructors];
    newInstructors[index][field] = value;
    setFormData({ ...formData, instructors: newInstructors });
  };
  const removeInstructor = (index) => {
    const newInstructors = formData.instructors.filter((_, i) => i !== index);
    setFormData({ ...formData, instructors: newInstructors });
  };

  // --- SSS (FAQ) YÖNETİMİ ---
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  };
  const updateFaq = (index, field, value) => {
    const newFaq = [...formData.faq];
    newFaq[index][field] = value;
    setFormData({ ...formData, faq: newFaq });
  };
  const removeFaq = (index) => {
    const newFaq = formData.faq.filter((_, i) => i !== index);
    setFormData({ ...formData, faq: newFaq });
  };

  // --- KAYDETME FONKSİYONU ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/business-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Bilgiler başarıyla güncellendi! Asistanınız bu verilerle eğitilecek.' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Kaydetme hatası');
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Kaydedilemedi. Sunucu hatası.' });
    } finally {
      setLoading(false);
    }
  };

  // --- TAB MENU BİLEŞENİ ---
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 ${
        activeTab === id 
          ? 'border-[#001F54] text-[#001F54] bg-blue-50' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <div className="pb-20">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#001F54] font-serif">İşletme Yapılandırması</h1>
          <p className="text-slate-500 text-sm">AI Asistanınızın müşterilere ne cevap vereceğini buradan yönetin.</p>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* TAB MENU */}
        <div className="flex overflow-x-auto border-b border-slate-100">
          <TabButton id="general" label="Genel Bilgiler" icon={MapPin} />
          <TabButton id="services" label="Hizmet & Fiyat" icon={Award} />
          <TabButton id="instructors" label="Eğitmenler" icon={User} />
          <TabButton id="health" label="Sağlık & Kurallar" icon={ShieldAlert} />
          <TabButton id="ai" label="AI & SSS" icon={HelpCircle} />
          <TabButton id="payment" label="Ödeme & Kampanya" icon={CreditCard} />
        </div>

        {/* TAB İÇERİKLERİ */}
        <div className="p-8">
          
          {/* 1. TAB: GENEL BİLGİLER */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="label">Firma Adı (Marka)</label><input name="businessName" value={formData.businessName} onChange={handleChange} className="input-field" placeholder="Örn: Pax Pilates Studio" /></div>
                <div><label className="label">Telefon (WhatsApp)</label><input name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+90 5XX..." /></div>
              </div>
              <div><label className="label">Şube & Lokasyonlar (Adres + Maps)</label><textarea name="branches" value={formData.branches} onChange={handleChange} className="input-field h-24" placeholder="Adres bilgisi ve Google Maps linki..." /></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="label">E-posta</label><input name="email" value={formData.email} onChange={handleChange} className="input-field" /></div>
                <div><label className="label">Çalışma Saatleri</label><input name="workingHours" value={formData.workingHours} onChange={handleChange} className="input-field" placeholder="Pzt-Cuma: 09:00 - 21:00..." /></div>
              </div>
              <div><label className="label">Hizmet Verilen Diller</label><input name="languages" value={formData.languages} onChange={handleChange} className="input-field" placeholder="Türkçe, İngilizce..." /></div>
              
              <div className="grid md:grid-cols-3 gap-6">
                 <div><label className="label">Website</label><input name="socialMedia.website" value={formData.socialMedia.website} onChange={handleChange} className="input-field" placeholder="www.site.com" /></div>
                 <div><label className="label">Instagram</label><input name="socialMedia.instagram" value={formData.socialMedia.instagram} onChange={handleChange} className="input-field" placeholder="@kullaniciadi" /></div>
                 <div><label className="label">Facebook</label><input name="socialMedia.facebook" value={formData.socialMedia.facebook} onChange={handleChange} className="input-field" /></div>
              </div>
            </div>
          )}

          {/* 2. TAB: HİZMET & FİYAT */}
          {activeTab === 'services' && (
             <div className="space-y-6 animate-fade-in-up">
                <div><label className="label">Verilen Ders Türleri</label><textarea name="classTypes" value={formData.classTypes} onChange={handleChange} className="input-field" placeholder="Mat Pilates, Reformer, Hamile Pilatesi, Yoga..." /></div>
                <div className="grid md:grid-cols-2 gap-6">
                   <div><label className="label">Ders Formatı</label><input name="classFormat" value={formData.classFormat} onChange={handleChange} className="input-field" placeholder="Özel Ders, 3 Kişilik Grup, Düet..." /></div>
                   <div><label className="label">Ders Süreleri</label><input name="duration" value={formData.duration} onChange={handleChange} className="input-field" placeholder="50 Dakika / 1 Saat" /></div>
                </div>
                <div><label className="label">Paket ve Fiyat Yapısı</label><textarea name="pricing" value={formData.pricing} onChange={handleChange} className="input-field h-32" placeholder="Tek ders: 1000 TL&#10;10'lu Paket: 9000 TL..." /></div>
                <div className="flex gap-6 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="freeTrial" checked={formData.freeTrial} onChange={handleChange} className="w-5 h-5 accent-[#001F54]"/> <span className="font-medium">Ücretsiz Deneme Dersi Var</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="onlineService" checked={formData.onlineService} onChange={handleChange} className="w-5 h-5 accent-[#001F54]"/> <span className="font-medium">Online / Evde Hizmet Var</span></label>
                </div>
             </div>
          )}

          {/* 3. TAB: EĞİTMENLER */}
          {activeTab === 'instructors' && (
            <div className="space-y-6 animate-fade-in-up">
               {formData.instructors.map((inst, index) => (
                 <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative group">
                    <button type="button" onClick={() => removeInstructor(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                       <input placeholder="Eğitmen Adı" value={inst.name} onChange={(e)=>updateInstructor(index, 'name', e.target.value)} className="input-field bg-white" />
                       <input placeholder="Uzmanlık Alanı" value={inst.specialty} onChange={(e)=>updateInstructor(index, 'specialty', e.target.value)} className="input-field bg-white" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                       <input placeholder="Sertifikalar" value={inst.certs} onChange={(e)=>updateInstructor(index, 'certs', e.target.value)} className="input-field bg-white" />
                       <input placeholder="Çalışma Günleri" value={inst.schedule} onChange={(e)=>updateInstructor(index, 'schedule', e.target.value)} className="input-field bg-white" />
                    </div>
                    <textarea placeholder="Kısa Tanıtım (Biyografi)" value={inst.bio} onChange={(e)=>updateInstructor(index, 'bio', e.target.value)} className="input-field bg-white h-20" />
                 </div>
               ))}
               <button type="button" onClick={addInstructor} className="flex items-center gap-2 text-[#001F54] font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-dashed border-blue-200 w-full justify-center">
                 <Plus size={18}/> Yeni Eğitmen Ekle
               </button>
            </div>
          )}

          {/* 4. TAB: SAĞLIK & KURALLAR */}
          {activeTab === 'health' && (
             <div className="space-y-6 animate-fade-in-up">
                <div><label className="label">Rezervasyon İçin İstenen Bilgiler</label><input name="requiredInfo" value={formData.requiredInfo} onChange={handleChange} className="input-field" placeholder="İsim, Soyisim, Telefon, Sağlık Geçmişi..." /></div>
                <div><label className="label">Yaş Sınırı / Kriterler</label><input name="ageLimit" value={formData.ageLimit} onChange={handleChange} className="input-field" placeholder="16 yaş ve üzeri..." /></div>
                <div><label className="label">Sağlık Protokolleri (Fıtık, Hamilelik vb.)</label><textarea name="healthProtocols" value={formData.healthProtocols} onChange={handleChange} className="input-field h-24" placeholder="Hamile pilatesi için doktor onayı şarttır..." /></div>
                <label className="flex items-center gap-2 cursor-pointer bg-red-50 p-4 rounded-xl border border-red-100"><input type="checkbox" name="doctorApproval" checked={formData.doctorApproval} onChange={handleChange} className="w-5 h-5 accent-red-600"/> <span className="font-bold text-red-800">Ciddi rahatsızlıklarda doktor onayı zorunludur</span></label>
             </div>
          )}

          {/* 5. TAB: AI & SSS */}
          {activeTab === 'ai' && (
             <div className="space-y-6 animate-fade-in-up">
                <div className="bg-blue-50 p-4 rounded-xl mb-4 text-sm text-blue-800 border border-blue-100 flex gap-3">
                   <HelpCircle size={24} className="shrink-0"/>
                   <p>Buraya ekleyeceğiniz Soru-Cevaplar, AI Asistanınızın müşterilere vereceği yanıtları doğrudan eğitir. Ne kadar detay, o kadar iyi!</p>
                </div>
                {formData.faq.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                     <div className="flex-1 space-y-2">
                        <input placeholder="Soru: (Örn: Yanımda ne getirmeliyim?)" value={item.question} onChange={(e)=>updateFaq(index, 'question', e.target.value)} className="input-field font-bold text-[#001F54]" />
                        <textarea placeholder="Cevap: (Örn: Havlu ve su yeterli...)" value={item.answer} onChange={(e)=>updateFaq(index, 'answer', e.target.value)} className="input-field h-20" />
                     </div>
                     <button type="button" onClick={() => removeFaq(index)} className="mt-2 text-slate-400 hover:text-red-500"><Trash2 size={20}/></button>
                  </div>
                ))}
                <button type="button" onClick={addFaq} className="flex items-center gap-2 text-[#001F54] font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-dashed border-blue-200 w-full justify-center">
                 <Plus size={18}/> Sık Sorulan Soru Ekle
               </button>
             </div>
          )}

          {/* 6. TAB: ÖDEME & KAMPANYA */}
          {activeTab === 'payment' && (
             <div className="space-y-6 animate-fade-in-up">
                <div><label className="label">Kampanyalar</label><textarea name="campaigns" value={formData.campaigns} onChange={handleChange} className="input-field h-24" placeholder="Arkadaşını getir %10 indirim..." /></div>
                <div className="flex flex-wrap gap-6 mb-6">
                   <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="referralDiscount" checked={formData.referralDiscount} onChange={handleChange} className="w-5 h-5 accent-[#001F54]"/> <span>Referans İndirimi</span></label>
                   <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="corporateMemberships" checked={formData.corporateMemberships} onChange={handleChange} className="w-5 h-5 accent-[#001F54]"/> <span>Kurumsal Üyelik</span></label>
                </div>
                <div className="border-t border-slate-100 pt-6">
                   <label className="label mb-4 block">Kabul Edilen Ödeme Yöntemleri</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.paymentMethods.creditCard ? 'bg-blue-50 border-blue-500 text-[#001F54]' : 'bg-white border-slate-200'}`}>
                         <input type="checkbox" name="paymentMethods.creditCard" checked={formData.paymentMethods.creditCard} onChange={handleChange} className="hidden"/>
                         <CreditCard size={24}/> <span className="font-bold text-sm">Kredi Kartı</span>
                      </label>
                      <label className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.paymentMethods.transfer ? 'bg-blue-50 border-blue-500 text-[#001F54]' : 'bg-white border-slate-200'}`}>
                         <input type="checkbox" name="paymentMethods.transfer" checked={formData.paymentMethods.transfer} onChange={handleChange} className="hidden"/>
                         <Globe size={24}/> <span className="font-bold text-sm">Havale / EFT</span>
                      </label>
                      <label className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.paymentMethods.pos ? 'bg-blue-50 border-blue-500 text-[#001F54]' : 'bg-white border-slate-200'}`}>
                         <input type="checkbox" name="paymentMethods.pos" checked={formData.paymentMethods.pos} onChange={handleChange} className="hidden"/>
                         <MapPin size={24}/> <span className="font-bold text-sm">Fiziksel POS</span>
                      </label>
                      <label className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.paymentMethods.cash ? 'bg-blue-50 border-blue-500 text-[#001F54]' : 'bg-white border-slate-200'}`}>
                         <input type="checkbox" name="paymentMethods.cash" checked={formData.paymentMethods.cash} onChange={handleChange} className="hidden"/>
                         <div className="font-serif font-bold text-xl">₺</div> <span className="font-bold text-sm">Nakit</span>
                      </label>
                   </div>
                </div>
             </div>
          )}

        </div>

        {/* FOOTER (KAYDET BUTONU) */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-end sticky bottom-0 z-10">
          <button 
             type="submit" 
             disabled={loading}
             className="bg-[#001F54] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0f172a] hover:scale-[1.02] transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
          >
             {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"/> : <Save size={20}/>}
             Değişiklikleri Kaydet
          </button>
        </div>
      </form>

      {/* CSS YARDIMCISI */}
      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .input-field { width: 100%; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; font-size: 0.95rem; color: #1e293b; }
        .input-field:focus { border-color: #001F54; ring: 2px solid #001F54; box-shadow: 0 0 0 3px rgba(0, 31, 84, 0.1); }
      `}</style>
    </div>
  );
};

export default BusinessSettings;