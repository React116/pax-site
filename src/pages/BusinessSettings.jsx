import React, { useState, useEffect } from 'react';
import { 
  Save, MapPin, HelpCircle, CreditCard, Trash2, Plus, 
  LayoutGrid, CheckCircle2, AlertCircle 
} from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BUSINESS_TYPES } from '../utils/businessConfig'; // Config dosyamızı çağırdık

const BusinessSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  
  // Hangi sektör seçili?
  const [selectedType, setSelectedType] = useState('pilates');

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    businessType: 'pilates',
    businessName: '', branches: '', phone: '', email: '', languages: '',
    socialMedia: { website: '', instagram: '', facebook: '' },
    workingHours: '{}',
    
    // Generic (Ortak) Hizmet Detayları
    serviceDetails: {}, 
    
    // Generic (Ortak) Personel/Ürün Listesi
    staffOrItems: [],
    
    // AI & SSS
    faq: [],
    
    // Ödeme
    campaigns: '',
    paymentMethods: { creditCard: false, transfer: false, pos: false, cash: false }
  });

  // Saat Yönetimi (State olarak ayrı tutuyoruz, kaydederken JSON yapacağız)
  const [schedule, setSchedule] = useState({
    pzt: { open: true, start: '09:00', end: '21:00' },
    sali: { open: true, start: '09:00', end: '21:00' },
    cars: { open: true, start: '09:00', end: '21:00' },
    pers: { open: true, start: '09:00', end: '21:00' },
    cuma: { open: true, start: '09:00', end: '21:00' },
    cmt: { open: true, start: '10:00', end: '18:00' },
    paz: { open: false, start: '10:00', end: '18:00' },
  });
  
  const daysMap = { pzt: 'Pazartesi', sali: 'Salı', cars: 'Çarşamba', pers: 'Perşembe', cuma: 'Cuma', cmt: 'Cumartesi', paz: 'Pazar' };

  // --- 1. VERİLERİ ÇEK ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const res = await fetch(`${apiUrl}/business-profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        
        // Sektör tipini ayarla (yoksa varsayılan pilates)
        const type = data.businessType || 'pilates';
        setSelectedType(type);

        // Saatleri parse et
        if (data.workingHours && data.workingHours !== '{}') {
           try { setSchedule(JSON.parse(data.workingHours)); } catch(e) {}
        }

        // Personel listesi kontrolü (Eski veri mi yeni veri mi?)
        let finalStaff = [];
        if (data.staffOrItems && data.staffOrItems.length > 0) {
            finalStaff = data.staffOrItems;
        } else if (data.instructors && data.instructors.length > 0) {
            // Eski 'instructors' verisi varsa onu yeni yapıya dönüştür
            finalStaff = data.instructors.map(inst => ({
                name: inst.name,
                title: inst.specialty || '', // Eski specialty -> yeni title
                desc: inst.bio || ''
            }));
        }

        // Service Details kontrolü (Eski verileri serviceDetails içine atalım)
        let finalServiceDetails = data.serviceDetails || {};
        // Eğer serviceDetails boşsa ama eski root alanlar doluysa onları içeri al (Migration logic)
        if (Object.keys(finalServiceDetails).length === 0) {
             if(data.classTypes) finalServiceDetails.classTypes = data.classTypes;
             if(data.pricing) finalServiceDetails.pricing = data.pricing;
             if(data.duration) finalServiceDetails.duration = data.duration;
        }

        setFormData(prev => ({ 
            ...prev, 
            ...data,
            staffOrItems: finalStaff,
            serviceDetails: finalServiceDetails
        }));
      }
    } catch (err) { console.error("Profil yükleme hatası", err); }
  };

  // --- 2. HANDLERS ---
  
  // Sektör Değişimi
  const handleTypeSelect = (typeKey) => {
    setSelectedType(typeKey);
    setFormData(prev => ({ ...prev, businessType: typeKey }));
    
    // Kullanıcıya bilgi ver
    setMessage({ type: 'info', text: `${BUSINESS_TYPES[typeKey].label} modu seçildi. Form alanları güncellendi.` });
    setTimeout(() => setMessage(null), 3000);
  };

  // Genel Input Değişimi
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
       const [p, c] = name.split('.');
       setFormData(prev => ({ ...prev, [p]: { ...prev[p], [c]: value } }));
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Dinamik Hizmet Detayları Değişimi (serviceDetails içindekiler)
  const handleServiceDetailChange = (key, value) => {
    setFormData(prev => ({
        ...prev,
        serviceDetails: { ...prev.serviceDetails, [key]: value }
    }));
  };

  // Personel / Ürün Ekle-Çıkar
  const addItem = () => setFormData(p => ({ ...p, staffOrItems: [...p.staffOrItems, { name: '', title: '', desc: '' }] }));
  const removeItem = (i) => setFormData(p => ({ ...p, staffOrItems: p.staffOrItems.filter((_, idx) => idx !== i) }));
  const updateItem = (i, field, value) => {
     const n = [...formData.staffOrItems];
     n[i][field] = value; 
     setFormData(p => ({ ...p, staffOrItems: n }));
  };

  // Saat Değişimi
  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  // FAQ Yönetimi
  const addFaq = () => setFormData(p => ({ ...p, faq: [...p.faq, { question: '', answer: '' }] }));
  const removeFaq = (i) => setFormData(p => ({ ...p, faq: p.faq.filter((_, idx) => idx !== i) }));
  const updateFaq = (i, f, v) => {
     const n = [...formData.faq]; n[i][f] = v; setFormData(p => ({ ...p, faq: n }));
  };

  // KAYDETME
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const finalData = { 
        ...formData, 
        workingHours: JSON.stringify(schedule)
    };

    try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/business-profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(finalData)
        });

        if (res.ok) {
            setMessage({ type: 'success', text: '✅ Ayarlar başarıyla kaydedildi!' });
        } else {
            throw new Error();
        }
    } catch (e) {
        setMessage({ type: 'error', text: '❌ Kaydedilemedi. Sunucu hatası.' });
    } finally {
        setLoading(false);
        setTimeout(() => setMessage(null), 3000);
    }
  };

  // Şu anki config (seçili sektöre göre)
  const currentConfig = BUSINESS_TYPES[selectedType];

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      
      {/* BAŞLIK & MESAJ ALANI */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-[#001F54] font-serif">İşletme Yapılandırması</h1>
           <p className="text-slate-500 text-sm mt-1">Sektörünüzü seçin ve işletmenizi özelleştirin.</p>
        </div>
        {message && (
            <div className={`px-4 py-3 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 animate-bounce-in ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {message.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                {message.text}
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. SEKTÖR SEÇİMİ (GRID) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <LayoutGrid size={18} className="text-blue-600"/> 
                İşletme Türü
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Object.keys(BUSINESS_TYPES).map(key => {
                    const TypeIcon = BUSINESS_TYPES[key].icon;
                    const isSelected = selectedType === key;
                    return (
                        <button 
                            key={key} 
                            type="button" 
                            onClick={() => handleTypeSelect(key)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all relative ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105 z-10' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-blue-300'}`}
                        >
                            <TypeIcon size={24} />
                            <span className="text-[10px] font-bold text-center leading-tight">{BUSINESS_TYPES[key].label}</span>
                            {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                        </button>
                    )
                })}
            </div>
        </div>

        {/* 2. TAB MENÜSÜ */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
            <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-hide bg-slate-50/50">
                <button type="button" onClick={() => setActiveTab('general')} className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}>
                    <MapPin size={16}/> Genel Bilgiler
                </button>
                
                {/* Dinamik Tablar (Config'e göre render edilir) */}
                {currentConfig.tabs.includes('services') && (
                    <button type="button" onClick={() => setActiveTab('services')} className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}>
                        {currentConfig.labels.services}
                    </button>
                )}
                {currentConfig.tabs.includes('staff') && (
                    <button type="button" onClick={() => setActiveTab('staff')} className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}>
                        {currentConfig.labels.staff}
                    </button>
                )}
                {/* Inventory / Menu Tabları */}
                {currentConfig.tabs.includes('inventory') && (
                    <button type="button" onClick={() => setActiveTab('inventory')} className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}>
                        {currentConfig.labels.inventory}
                    </button>
                )}
                {currentConfig.tabs.includes('menu') && (
                    <button type="button" onClick={() => setActiveTab('menu')} className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}>
                        {currentConfig.labels.menu}
                    </button>
                )}
                {currentConfig.tabs.includes('rules') && (
                    <button type="button" onClick={() => setActiveTab('rules')} className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}>
                        {currentConfig.labels.rules}
                    </button>
                )}

                <button type="button" onClick={() => setActiveTab('ai')} className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}>
                    <HelpCircle size={16}/> AI & SSS
                </button>
                <button type="button" onClick={() => setActiveTab('payment')} className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}>
                    <CreditCard size={16}/> Ödeme
                </button>
            </div>

            <div className="p-8">
                
                {/* --- TAB: GENEL BİLGİLER (HERKES İÇİN AYNI) --- */}
                {activeTab === 'general' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="label">İşletme / Marka Adı</label>
                                <input name="businessName" value={formData.businessName} onChange={handleChange} className="input-field" placeholder="Örn: Pax Pilates" />
                            </div>
                            <div>
                                <label className="label">İletişim Numarası (WhatsApp)</label>
                                <PhoneInput 
                                    country={'tr'} 
                                    value={formData.phone} 
                                    onChange={val => setFormData({...formData, phone: val})} 
                                    inputStyle={{width:'100%', height:'48px', borderRadius:'0.75rem', borderColor:'#e2e8f0'}} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Adres ve Konum Bilgisi</label>
                            <textarea name="branches" value={formData.branches} onChange={handleChange} className="input-field h-20" placeholder="Açık adres ve Google Maps linki..." />
                        </div>

                        {/* Çalışma Saatleri */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                             <h4 className="label mb-4">Çalışma Saatleri Planlaması</h4>
                             <div className="space-y-2">
                                {Object.keys(schedule).map(day => (
                                    <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                                        <div className="w-24 font-bold capitalize text-slate-700">{daysMap[day]}</div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={schedule[day]?.open} onChange={(e) => handleScheduleChange(day, 'open', e.target.checked)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                        {schedule[day]?.open ? (
                                            <div className="flex items-center gap-2">
                                                <input type="time" value={schedule[day].start || '09:00'} onChange={(e)=>handleScheduleChange(day,'start',e.target.value)} className="border rounded-lg px-2 py-1 text-sm"/>
                                                <span className="text-slate-400">-</span>
                                                <input type="time" value={schedule[day].end || '18:00'} onChange={(e)=>handleScheduleChange(day,'end',e.target.value)} className="border rounded-lg px-2 py-1 text-sm"/>
                                            </div>
                                        ) : <span className="text-slate-400 text-xs italic ml-2">Kapalı</span>}
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div><label className="label">Website</label><input name="socialMedia.website" value={formData.socialMedia.website} onChange={handleChange} className="input-field" placeholder="https://" /></div>
                            <div><label className="label">Instagram</label><input name="socialMedia.instagram" value={formData.socialMedia.instagram} onChange={handleChange} className="input-field" placeholder="@kullaniciadi" /></div>
                            <div><label className="label">Hizmet Dilleri</label><input name="languages" value={formData.languages} onChange={handleChange} className="input-field" placeholder="TR, EN, RU" /></div>
                        </div>
                    </div>
                )}

                {/* --- TAB: DİNAMİK HİZMETLER / ENVANTER / MENÜ / KURALLAR --- */}
                {(['services', 'inventory', 'menu', 'rules'].includes(activeTab)) && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-6 border border-blue-100 flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-blue-600"><currentConfig.icon size={20}/></div>
                            <p><strong>{currentConfig.label}</strong> için özel alanları düzenliyorsunuz.</p>
                        </div>
                        
                        {/* Config'deki alanları otomatik üret */}
                        {(currentConfig.fields[activeTab] || []).map(fieldKey => (
                            <div key={fieldKey}>
                                <label className="label capitalize text-slate-600">
                                    {fieldKey
                                        .replace(/([A-Z])/g, ' $1') // CamelCase'i ayır
                                        .replace(/^./, str => str.toUpperCase()) // İlk harfi büyüt
                                    }
                                </label>
                                <textarea 
                                    value={formData.serviceDetails[fieldKey] || ''} 
                                    onChange={(e) => handleServiceDetailChange(fieldKey, e.target.value)}
                                    className="input-field h-24"
                                    placeholder={`${fieldKey} detaylarını buraya giriniz...`}
                                />
                            </div>
                        ))}
                        
                        {/* Eğer alan listesi boşsa (örn: inventory array ise) */}
                        {(!currentConfig.fields[activeTab] || currentConfig.fields[activeTab].length === 0) && (
                            <div className="text-center text-slate-400 py-10">Bu alan için özel liste yapısı aşağıdadır veya tanımlanmamıştır.</div>
                        )}
                    </div>
                )}

                {/* --- TAB: PERSONEL / ARAÇLAR / ODALAR (LİSTE YAPISI) --- */}
                {(['staff', 'inventory'].includes(activeTab) && (!currentConfig.fields[activeTab] || currentConfig.fields[activeTab].length === 0)) && (
                    <div className="space-y-6 animate-fade-in-up">
                        {formData.staffOrItems.map((item, index) => (
                            <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative group transition-all hover:shadow-md hover:bg-white hover:border-blue-200">
                                <button type="button" onClick={() => removeItem(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="label text-[10px]">İsim / Model</label>
                                        <input placeholder="Örn: Dr. Ahmet / BMW 520i" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} className="input-field bg-white" />
                                    </div>
                                    <div>
                                        <label className="label text-[10px]">Ünvan / Plaka / Özellik</label>
                                        <input placeholder="Örn: Uzman Diş Hekimi / 34 ABC 34" value={item.title} onChange={(e) => updateItem(index, 'title', e.target.value)} className="input-field bg-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label text-[10px]">Açıklama / Biyografi</label>
                                    <textarea placeholder="Detaylı bilgi..." value={item.desc} onChange={(e) => updateItem(index, 'desc', e.target.value)} className="input-field bg-white h-20" />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addItem} className="dashed-btn">
                            <Plus size={18}/> {currentConfig.labels.newItemBtn || 'Yeni Ekle'}
                        </button>
                    </div>
                )}

                {/* --- TAB: AI & SSS (ORTAK) --- */}
                {activeTab === 'ai' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-amber-50 p-4 rounded-xl text-amber-800 text-sm border border-amber-100">
                            AI Asistanınız buradaki Soru-Cevap ikililerini öğrenerek müşterilerinize 7/24 otomatik cevap verir.
                        </div>
                        {formData.faq.map((q, i) => (
                            <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex-1 space-y-2">
                                    <input placeholder="Soru (Örn: Otopark var mı?)" value={q.question} onChange={e=>{const n=[...formData.faq];n[i].question=e.target.value;setFormData({...formData,faq:n})}} className="input-field font-bold text-[#001F54]" />
                                    <textarea placeholder="Cevap (Örn: Evet, müşterilerimize özel ücretsiz otoparkımız mevcuttur.)" value={q.answer} onChange={e=>{const n=[...formData.faq];n[i].answer=e.target.value;setFormData({...formData,faq:n})}} className="input-field h-20" />
                                </div>
                                <button type="button" onClick={()=>{setFormData({...formData, faq:formData.faq.filter((_,x)=>x!==i)})}} className="text-slate-300 hover:text-red-500 mt-2"><Trash2 size={20}/></button>
                            </div>
                        ))}
                        <button type="button" onClick={()=>setFormData({...formData, faq:[...formData.faq, {question:'', answer:''}]})} className="dashed-btn"><Plus size={18}/> Yeni Soru Ekle</button>
                    </div>
                )}
                
                {/* --- TAB: ÖDEME (ORTAK) --- */}
                {activeTab === 'payment' && (
                    <div className="animate-fade-in-up space-y-8">
                         <div>
                            <label className="label mb-4">Kabul Edilen Ödeme Yöntemleri</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['creditCard', 'transfer', 'pos', 'cash'].map(m => (
                                    <label key={m} className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center gap-2 transition-all ${formData.paymentMethods[m] ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        <input type="checkbox" checked={formData.paymentMethods[m]} onChange={e=>setFormData({...formData, paymentMethods: {...formData.paymentMethods, [m]: e.target.checked}})} className="hidden"/>
                                        <span className="capitalize font-bold text-sm">{m === 'creditCard' ? 'Kredi Kartı' : m === 'transfer' ? 'Havale/EFT' : m === 'pos' ? 'POS Cihazı' : 'Nakit'}</span>
                                    </label>
                                ))}
                            </div>
                         </div>
                         <div>
                            <label className="label">Kampanyalar & İndirimler</label>
                            <textarea name="campaigns" value={formData.campaigns} onChange={handleChange} className="input-field h-32" placeholder="Örn: İlk derste %20 indirim..." />
                         </div>
                    </div>
                )}

            </div>
        </div>

        {/* KAYDET BUTONU */}
        <div className="sticky bottom-6 z-20 flex justify-end">
             <button type="button" onClick={handleSubmit} disabled={loading} className="bg-[#001F54] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#0f172a] shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                {loading ? 'Kaydediliyor...' : <><Save size={20}/> Değişiklikleri Kaydet</>}
             </button>
        </div>

      </form>
      
      {/* CUSTOM CSS FOR THIS PAGE */}
      <style>{`
        .label { display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .input-field { width: 100%; padding: 0.85rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; font-size: 0.95rem; color: #1e293b; background: #fff; }
        .input-field:focus { border-color: #001F54; ring: 2px solid #001F54; box-shadow: 0 0 0 4px rgba(0,31,84,0.1); }
        
        .tab-btn { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 600; color: #64748b; border-bottom: 2px solid transparent; white-space: nowrap; transition: all 0.2s; }
        .tab-btn:hover { color: #1e293b; background: #f1f5f9; }
        .tab-btn.active { color: #001F54; border-bottom-color: #001F54; background: white; }
        
        .dashed-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 1rem; border: 2px dashed #cbd5e1; border-radius: 0.75rem; color: #64748b; font-weight: 600; transition: all 0.2s; cursor: pointer; background: transparent; }
        .dashed-btn:hover { border-color: #001F54; color: #001F54; background: #f8fafc; }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default BusinessSettings;