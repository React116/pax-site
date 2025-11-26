import React, { useState, useEffect } from 'react';
import { Save, MapPin, Award, User, ShieldAlert, HelpCircle, CreditCard, Trash2, Plus } from 'lucide-react';

// TELEFON GİRİŞİ İÇİN KÜTÜPHANE
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const BusinessSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    businessName: '', branches: '', phone: '', email: '',
    socialMedia: { website: '', instagram: '', facebook: '' },
    // Çalışma saatlerini JSON string olarak tutacağız ama UI'da obje olarak yöneteceğiz
    workingHours: '{}', 
    languages: '',
    classTypes: '', classFormat: '', duration: '', pricing: '',
    freeTrial: false, onlineService: false,
    instructors: [],
    requiredInfo: '', ageLimit: '', healthProtocols: '', doctorApproval: false,
    faq: [],
    campaigns: '', referralDiscount: false, corporateMemberships: false,
    paymentMethods: { creditCard: false, transfer: false, pos: false, cash: false }
  });

  // --- SAAT YÖNETİMİ İÇİN STATE ---
  // Backend'e string olarak gidiyor ama burada rahat yönetmek için obje yapıyoruz
  const [schedule, setSchedule] = useState({
    pzt: { open: true, start: '09:00', end: '21:00' },
    sali: { open: true, start: '09:00', end: '21:00' },
    cars: { open: true, start: '09:00', end: '21:00' },
    pers: { open: true, start: '09:00', end: '21:00' },
    cuma: { open: true, start: '09:00', end: '21:00' },
    cmt: { open: true, start: '10:00', end: '18:00' },
    paz: { open: false, start: '10:00', end: '18:00' },
  });

  const daysMap = {
    pzt: 'Pazartesi', sali: 'Salı', cars: 'Çarşamba', pers: 'Perşembe',
    cuma: 'Cuma', cmt: 'Cumartesi', paz: 'Pazar'
  };

  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token'); // Token'ı kutudan al
    const apiUrl = import.meta.env.VITE_API_URL; // Adresi .env'den al

    if (!token) {
      console.error("Token bulunamadı, giriş yapılmamış.");
      return;
    }

    const res = await fetch(`${apiUrl}/business-profile`, {
      headers: { 'Authorization': `Bearer ${token}` } // Token'ı header'a ekle
    });

    if (res.ok) {
      const data = await res.json();
      setFormData(prev => ({ ...prev, ...data }));

      if (data.workingHours && data.workingHours !== '{}') {
          try {
              setSchedule(JSON.parse(data.workingHours));
          } catch (e) {
              console.log("Saat verisi parse hatası.");
          }
      }
    }
  } catch (error) {
    console.error("Veri çekilemedi", error);
  }
};

  // --- GENEL DEĞİŞİKLİK YÖNETİMİ ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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

  // --- SAAT DEĞİŞİKLİĞİ ---
  const handleScheduleChange = (day, field, value) => {
    const newSchedule = { ...schedule, [day]: { ...schedule[day], [field]: value } };
    setSchedule(newSchedule);
    // Form verisine JSON string olarak kaydet
    setFormData(prev => ({ ...prev, workingHours: JSON.stringify(newSchedule) }));
  };

  // --- TELEFON DEĞİŞİKLİĞİ ---
  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  // --- EĞİTMEN YÖNETİMİ ---
  const addInstructor = () => setFormData(p => ({ ...p, instructors: [...p.instructors, { name: '', specialty: '', certs: '', bio: '' }] }));
  const removeInstructor = (i) => setFormData(p => ({ ...p, instructors: p.instructors.filter((_, idx) => idx !== i) }));
  const updateInstructor = (i, f, v) => {
     const n = [...formData.instructors]; n[i][f] = v; setFormData(p => ({ ...p, instructors: n }));
  };

  // --- FAQ YÖNETİMİ ---
  const addFaq = () => setFormData(p => ({ ...p, faq: [...p.faq, { question: '', answer: '' }] }));
  const removeFaq = (i) => setFormData(p => ({ ...p, faq: p.faq.filter((_, idx) => idx !== i) }));
  const updateFaq = (i, f, v) => {
     const n = [...formData.faq]; n[i][f] = v; setFormData(p => ({ ...p, faq: n }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  const finalData = { ...formData, workingHours: JSON.stringify(schedule) };

  try {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;

    const res = await fetch(`${apiUrl}/business-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Token olmadan kayıt yapmaz
      },
      body: JSON.stringify(finalData)
    });

    if (res.ok) {
      setMessage({ type: 'success', text: '✅ Bilgiler başarıyla kaydedildi!' });
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

  const TabButton = ({ id, label, icon: Icon }) => (
    <button type="button" onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === id ? 'border-[#001F54] text-[#001F54] bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <div className="pb-20">
      <div className="mb-6 flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-[#001F54] font-serif">İşletme Yapılandırması</h1></div>
        {message && <div className={`px-4 py-2 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-100">
          <TabButton id="general" label="Genel Bilgiler" icon={MapPin} />
          <TabButton id="services" label="Hizmet & Fiyat" icon={Award} />
          <TabButton id="instructors" label="Eğitmenler" icon={User} />
          <TabButton id="health" label="Sağlık" icon={ShieldAlert} />
          <TabButton id="ai" label="AI & SSS" icon={HelpCircle} />
          <TabButton id="payment" label="Ödeme" icon={CreditCard} />
        </div>

        <div className="p-8">
          {/* TAB 1: GENEL BİLGİLER */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="grid md:grid-cols-2 gap-8">
                <div><label className="label">Firma Adı (Marka)</label><input name="businessName" value={formData.businessName} onChange={handleChange} className="input-field" placeholder="Örn: Pax Pilates Studio" /></div>
                
                {/* YENİ TELEFON GİRİŞİ */}
                <div>
                    <label className="label">Telefon (WhatsApp)</label>
                    <div className="phone-input-container">
                        <PhoneInput
                            country={'tr'} // Varsayılan ülke
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            enableSearch={true}
                            disableSearchIcon={true}
                            inputStyle={{
                                width: '100%',
                                height: '48px',
                                fontSize: '15px',
                                paddingLeft: '48px',
                                borderRadius: '0.75rem',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff'
                            }}
                            buttonStyle={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.75rem 0 0 0.75rem',
                                backgroundColor: '#f8fafc'
                            }}
                        />
                    </div>
                </div>
              </div>

              <div><label className="label">Şube & Lokasyonlar</label><textarea name="branches" value={formData.branches} onChange={handleChange} className="input-field h-24" placeholder="Adres ve Maps linki..." /></div>

              {/* YENİ ÇALIŞMA SAATLERİ SEÇİCİSİ */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <label className="label mb-4 block">Çalışma Saatleri Planlaması</label>
                  <div className="space-y-3">
                      {Object.keys(schedule).map((dayKey) => (
                          <div key={dayKey} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                              <div className="w-24 font-bold text-slate-700">{daysMap[dayKey]}</div>
                              
                              <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={schedule[dayKey].open} onChange={(e) => handleScheduleChange(dayKey, 'open', e.target.checked)} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                  <span className="ml-3 text-sm font-medium text-slate-600">{schedule[dayKey].open ? 'Açık' : 'Kapalı'}</span>
                              </label>

                              {schedule[dayKey].open && (
                                  <div className="flex items-center gap-2 animate-fade-in-up">
                                      <input type="time" value={schedule[dayKey].start} onChange={(e) => handleScheduleChange(dayKey, 'start', e.target.value)} className="input-field py-1 px-2 w-32 text-center" />
                                      <span className="text-slate-400">-</span>
                                      <input type="time" value={schedule[dayKey].end} onChange={(e) => handleScheduleChange(dayKey, 'end', e.target.value)} className="input-field py-1 px-2 w-32 text-center" />
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div><label className="label">E-posta</label><input name="email" value={formData.email} onChange={handleChange} className="input-field" /></div>
                <div><label className="label">Hizmet Dilleri</label><input name="languages" value={formData.languages} onChange={handleChange} className="input-field" /></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                 <div><label className="label">Website</label><input name="socialMedia.website" value={formData.socialMedia.website} onChange={handleChange} className="input-field" /></div>
                 <div><label className="label">Instagram</label><input name="socialMedia.instagram" value={formData.socialMedia.instagram} onChange={handleChange} className="input-field" /></div>
                 <div><label className="label">Facebook</label><input name="socialMedia.facebook" value={formData.socialMedia.facebook} onChange={handleChange} className="input-field" /></div>
              </div>
            </div>
          )}

          {/* Diğer Tab'lar aynı kalabilir, sadece görsel temizliği koruyoruz */}
          {/* TAB 2: HİZMET & FİYAT */}
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

          {/* TAB 3: EĞİTMENLER */}
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
               <button type="button" onClick={addInstructor} className="flex items-center gap-2 text-[#001F54] font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-dashed border-blue-200 w-full justify-center"><Plus size={18}/> Yeni Eğitmen Ekle</button>
            </div>
          )}

           {/* TAB 4: SAĞLIK */}
           {activeTab === 'health' && (
             <div className="space-y-6 animate-fade-in-up">
                <div><label className="label">Rezervasyon İçin İstenen Bilgiler</label><input name="requiredInfo" value={formData.requiredInfo} onChange={handleChange} className="input-field" placeholder="İsim, Soyisim, Telefon, Sağlık Geçmişi..." /></div>
                <div><label className="label">Yaş Sınırı / Kriterler</label><input name="ageLimit" value={formData.ageLimit} onChange={handleChange} className="input-field" placeholder="16 yaş ve üzeri..." /></div>
                <div><label className="label">Sağlık Protokolleri</label><textarea name="healthProtocols" value={formData.healthProtocols} onChange={handleChange} className="input-field h-24" placeholder="Hamile pilatesi için doktor onayı şarttır..." /></div>
                <label className="flex items-center gap-2 cursor-pointer bg-red-50 p-4 rounded-xl border border-red-100"><input type="checkbox" name="doctorApproval" checked={formData.doctorApproval} onChange={handleChange} className="w-5 h-5 accent-red-600"/> <span className="font-bold text-red-800">Ciddi rahatsızlıklarda doktor onayı zorunludur</span></label>
             </div>
          )}

          {/* TAB 5: AI & SSS */}
          {activeTab === 'ai' && (
             <div className="space-y-6 animate-fade-in-up">
                <div className="bg-blue-50 p-4 rounded-xl mb-4 text-sm text-blue-800 border border-blue-100 flex gap-3"><HelpCircle size={24} className="shrink-0"/><p>Buraya ekleyeceğiniz Soru-Cevaplar, AI Asistanınızın müşterilere vereceği yanıtları doğrudan eğitir.</p></div>
                {formData.faq.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                     <div className="flex-1 space-y-2">
                        <input placeholder="Soru" value={item.question} onChange={(e)=>updateFaq(index, 'question', e.target.value)} className="input-field font-bold text-[#001F54]" />
                        <textarea placeholder="Cevap" value={item.answer} onChange={(e)=>updateFaq(index, 'answer', e.target.value)} className="input-field h-20" />
                     </div>
                     <button type="button" onClick={() => removeFaq(index)} className="mt-2 text-slate-400 hover:text-red-500"><Trash2 size={20}/></button>
                  </div>
                ))}
                <button type="button" onClick={addFaq} className="flex items-center gap-2 text-[#001F54] font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-dashed border-blue-200 w-full justify-center"><Plus size={18}/> Sık Sorulan Soru Ekle</button>
             </div>
          )}

          {/* TAB 6: ÖDEME & KAMPANYA */}
          {activeTab === 'payment' && (
             <div className="space-y-6 animate-fade-in-up">
                <div><label className="label">Kampanyalar</label><textarea name="campaigns" value={formData.campaigns} onChange={handleChange} className="input-field h-24" /></div>
                <div className="flex flex-wrap gap-6 mb-6">
                   <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="referralDiscount" checked={formData.referralDiscount} onChange={handleChange} className="w-5 h-5 accent-[#001F54]"/> <span>Referans İndirimi</span></label>
                   <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="corporateMemberships" checked={formData.corporateMemberships} onChange={handleChange} className="w-5 h-5 accent-[#001F54]"/> <span>Kurumsal Üyelik</span></label>
                </div>
                <div className="border-t border-slate-100 pt-6">
                   <label className="label mb-4 block">Kabul Edilen Ödeme Yöntemleri</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['creditCard', 'transfer', 'pos', 'cash'].map(method => (
                          <label key={method} className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.paymentMethods[method] ? 'bg-blue-50 border-blue-500 text-[#001F54]' : 'bg-white border-slate-200'}`}>
                             <input type="checkbox" name={`paymentMethods.${method}`} checked={formData.paymentMethods[method]} onChange={handleChange} className="hidden"/>
                             <span className="font-bold text-sm capitalize">{method === 'creditCard' ? 'Kredi Kartı' : method === 'transfer' ? 'Havale/EFT' : method === 'pos' ? 'POS' : 'Nakit'}</span>
                          </label>
                      ))}
                   </div>
                </div>
             </div>
          )}

        </div>

        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-end sticky bottom-0 z-10">
          <button type="submit" disabled={loading} className="bg-[#001F54] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0f172a] hover:scale-[1.02] transition-all shadow-xl flex items-center gap-2 disabled:opacity-50">
             {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"/> : <Save size={20}/>}
             Değişiklikleri Kaydet
          </button>
        </div>
      </form>
      
      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .input-field { width: 100%; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; font-size: 0.95rem; color: #1e293b; }
        .input-field:focus { border-color: #001F54; ring: 2px solid #001F54; box-shadow: 0 0 0 3px rgba(0, 31, 84, 0.1); }
      `}</style>
    </div>
  );
};

export default BusinessSettings;