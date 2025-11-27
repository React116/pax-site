import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, MapPin, HelpCircle, CreditCard, Trash2, Plus, 
  LayoutGrid, CheckCircle2, AlertCircle, Edit2, Lock, Unlock, X 
} from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BUSINESS_TYPES } from '../utils/businessConfig';

/* --- YARDIMCI BİLEŞEN: KİLİTLENEBİLİR INPUT --- */
const LockableInput = ({ label, value, onChange, name, placeholder, type = "text", className = "" }) => {
  const [isLocked, setIsLocked] = useState(true);
  const inputRef = useRef(null);

  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (isLocked) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={isLocked}
          className={`w-full p-3.5 pr-12 rounded-xl transition-all duration-300 font-medium ${
            isLocked 
              ? 'bg-slate-100 text-slate-500 border-transparent cursor-default' 
              : 'bg-white text-slate-800 border-blue-500 ring-4 ring-blue-50/50 shadow-sm'
          } border`}
        />
        <button
          type="button"
          onClick={toggleLock}
          className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
            isLocked 
              ? 'text-slate-400 hover:text-blue-600 hover:bg-white' 
              : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- YARDIMCI BİLEŞEN: KİLİTLENEBİLİR TEXTAREA --- */
const LockableTextarea = ({ label, value, onChange, name, placeholder, height = "h-24" }) => {
  const [isLocked, setIsLocked] = useState(true);
  const inputRef = useRef(null);

  return (
    <div className="relative group">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <textarea
          ref={inputRef}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={isLocked}
          className={`w-full p-3.5 pr-12 rounded-xl transition-all duration-300 font-medium resize-none ${height} ${
            isLocked 
              ? 'bg-slate-100 text-slate-500 border-transparent cursor-default' 
              : 'bg-white text-slate-800 border-blue-500 ring-4 ring-blue-50/50 shadow-sm'
          } border`}
        />
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
            isLocked 
              ? 'text-slate-400 hover:text-blue-600 hover:bg-white' 
              : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- YARDIMCI BİLEŞEN: PERSONEL/ÜRÜN KARTI --- */
const StaffItemCard = ({ item, index, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Yeni eklenen boş bir kart ise direkt edit modunda aç
  useEffect(() => { if (!item.name) setIsEditing(true); }, []);

  return (
    <div className={`relative transition-all duration-300 rounded-2xl border ${
      isEditing 
        ? 'bg-white border-blue-200 shadow-xl scale-[1.01] z-10 p-6' 
        : 'bg-slate-50 border-slate-200 hover:border-blue-200 p-6'
    }`}>
      
      {/* Aksiyon Butonları */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          type="button" 
          onClick={() => setIsEditing(!isEditing)}
          className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-green-100 text-green-700' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}
        >
          {isEditing ? <CheckCircle2 size={18}/> : <Edit2 size={16}/>}
        </button>
        <button 
          type="button" 
          onClick={() => onRemove(index)} 
          className="p-2 rounded-lg bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
        >
          <Trash2 size={16}/>
        </button>
      </div>

      {isEditing ? (
        // --- DÜZENLEME MODU ---
        <div className="grid gap-4 animate-fade-in-up">
           <div className="grid md:grid-cols-2 gap-4">
              <div>
                  <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">İsim / Model</label>
                  <input 
                    value={item.name} 
                    onChange={(e) => onUpdate(index, 'name', e.target.value)} 
                    className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500"
                    placeholder="Örn: Dr. Ayşe Yılmaz"
                  />
              </div>
              <div>
                  <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">Ünvan / Özellik</label>
                  <input 
                    value={item.title} 
                    onChange={(e) => onUpdate(index, 'title', e.target.value)} 
                    className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500"
                    placeholder="Örn: Ortodontist"
                  />
              </div>
           </div>
           <div>
              <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">Açıklama</label>
              <textarea 
                value={item.desc} 
                onChange={(e) => onUpdate(index, 'desc', e.target.value)} 
                className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500 h-20 resize-none"
                placeholder="Detaylı bilgi..."
              />
           </div>
        </div>
      ) : (
        // --- GÖRÜNTÜLEME MODU (KİLİTLİ) ---
        <div className="pr-12">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                {item.name ? item.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                 <h4 className="font-bold text-slate-800 text-lg">{item.name || 'İsimsiz'}</h4>
                 <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{item.title || 'Ünvan Yok'}</div>
              </div>
           </div>
           <p className="text-slate-500 text-sm leading-relaxed mt-3 pl-[3.25rem]">
             {item.desc || 'Açıklama girilmemiş.'}
           </p>
        </div>
      )}
    </div>
  );
};


/* --- ANA SAYFA COMPONENT --- */
const BusinessSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedType, setSelectedType] = useState('pilates');

  // Form State
  const [formData, setFormData] = useState({
    businessType: 'pilates',
    businessName: '', branches: '', phone: '', email: '', languages: '',
    socialMedia: { website: '', instagram: '', facebook: '' },
    workingHours: '{}',
    serviceDetails: {}, 
    staffOrItems: [],
    faq: [],
    campaigns: '',
    paymentMethods: { creditCard: false, transfer: false, pos: false, cash: false }
  });

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

  // --- VERİ ÇEKME ---
  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const res = await fetch(`${apiUrl}/business-profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        
        const type = data.businessType || 'pilates';
        setSelectedType(type);

        if (data.workingHours && data.workingHours !== '{}') {
           try { setSchedule(JSON.parse(data.workingHours)); } catch(e) {}
        }

        let finalStaff = [];
        if (data.staffOrItems && data.staffOrItems.length > 0) {
            finalStaff = data.staffOrItems;
        } else if (data.instructors && data.instructors.length > 0) {
            finalStaff = data.instructors.map(inst => ({
                name: inst.name,
                title: inst.specialty || '',
                desc: inst.bio || ''
            }));
        }

        let finalServiceDetails = data.serviceDetails || {};
        if (Object.keys(finalServiceDetails).length === 0) {
             if(data.classTypes) finalServiceDetails.classTypes = data.classTypes;
             if(data.pricing) finalServiceDetails.pricing = data.pricing;
             if(data.duration) finalServiceDetails.duration = data.duration;
        }

        setFormData(prev => ({ ...prev, ...data, staffOrItems: finalStaff, serviceDetails: finalServiceDetails }));
      }
    } catch (err) { console.error("Profil yükleme hatası", err); }
  };

  // --- HANDLERS ---
  const handleTypeSelect = (typeKey) => {
    setSelectedType(typeKey);
    setFormData(prev => ({ ...prev, businessType: typeKey }));
    setMessage({ type: 'info', text: `${BUSINESS_TYPES[typeKey].label} modu seçildi. Alanlar güncellendi.` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
       const [p, c] = name.split('.');
       setFormData(prev => ({ ...prev, [p]: { ...prev[p], [c]: value } }));
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceDetailChange = (key, value) => {
    setFormData(prev => ({
        ...prev,
        serviceDetails: { ...prev.serviceDetails, [key]: value }
    }));
  };

  const addItem = () => setFormData(p => ({ ...p, staffOrItems: [...p.staffOrItems, { name: '', title: '', desc: '' }] }));
  const removeItem = (i) => setFormData(p => ({ ...p, staffOrItems: p.staffOrItems.filter((_, idx) => idx !== i) }));
  const updateItem = (i, field, value) => {
     const n = [...formData.staffOrItems];
     n[i][field] = value; 
     setFormData(p => ({ ...p, staffOrItems: n }));
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const finalData = { ...formData, workingHours: JSON.stringify(schedule) };

    try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/business-profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(finalData)
        });

        if (res.ok) {
            setMessage({ type: 'success', text: '✅ Değişiklikler başarıyla kaydedildi!' });
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

  const currentConfig = BUSINESS_TYPES[selectedType];

  return (
    <div className="pb-20 max-w-5xl mx-auto font-sans">
      
      {/* BAŞLIK & MESAJ ALANI */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-[#001F54] font-serif">İşletme Yapılandırması</h1>
           <p className="text-slate-500 text-sm mt-1">Sektörünüzü seçin ve bilgilerinizi güvenle yönetin.</p>
        </div>
        {message && (
            <div className={`px-4 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 animate-bounce-in ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                {message.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
                {message.text}
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. SEKTÖR SEÇİMİ (GRID) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <LayoutGrid size={18} className="text-blue-600"/> 
                İşletme Türü (Değiştirmek için tıklayın)
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
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all relative ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105 z-10' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-blue-300 opacity-70 hover:opacity-100'}`}
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
                {/* Dinamik Tablar */}
                {currentConfig.tabs.includes('services') && <button type="button" onClick={() => setActiveTab('services')} className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}>{currentConfig.labels.services}</button>}
                {currentConfig.tabs.includes('staff') && <button type="button" onClick={() => setActiveTab('staff')} className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}>{currentConfig.labels.staff}</button>}
                {currentConfig.tabs.includes('inventory') && <button type="button" onClick={() => setActiveTab('inventory')} className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}>{currentConfig.labels.inventory}</button>}
                {currentConfig.tabs.includes('menu') && <button type="button" onClick={() => setActiveTab('menu')} className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}>{currentConfig.labels.menu}</button>}
                {currentConfig.tabs.includes('rules') && <button type="button" onClick={() => setActiveTab('rules')} className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}>{currentConfig.labels.rules}</button>}
                <button type="button" onClick={() => setActiveTab('ai')} className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}><HelpCircle size={16}/> AI & SSS</button>
                <button type="button" onClick={() => setActiveTab('payment')} className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}><CreditCard size={16}/> Ödeme</button>
            </div>

            <div className="p-8">
                
                {/* --- TAB: GENEL BİLGİLER --- */}
                {activeTab === 'general' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="grid md:grid-cols-2 gap-8">
                            <LockableInput 
                                label="İşletme / Marka Adı" 
                                name="businessName" 
                                value={formData.businessName} 
                                onChange={handleChange} 
                                placeholder="Örn: Pax Pilates" 
                            />
                            {/* PhoneInput özel yapı gerektiriyor */}
                            <div className="relative group">
                                <label className="label">İletişim Numarası (WhatsApp)</label>
                                <div className="relative">
                                    <PhoneInput 
                                        country={'tr'} 
                                        value={formData.phone} 
                                        onChange={val => setFormData({...formData, phone: val})} 
                                        inputStyle={{width:'100%', height:'52px', borderRadius:'0.75rem', borderColor:'#e2e8f0', backgroundColor:'white'}} 
                                        buttonStyle={{borderRadius:'0.75rem 0 0 0.75rem', borderColor:'#e2e8f0', backgroundColor:'#f8fafc'}}
                                    />
                                    {/* Kilit İkonu (Görsel Süs) */}
                                    <div className="absolute right-3 top-3 text-slate-300 pointer-events-none"><Lock size={16}/></div>
                                </div>
                            </div>
                        </div>

                        <LockableTextarea 
                            label="Adres ve Konum Linki" 
                            name="branches" 
                            value={formData.branches} 
                            onChange={handleChange} 
                            placeholder="Açık adres ve Google Maps linki..." 
                            height="h-24"
                        />

                        {/* Çalışma Saatleri - Yarı Kilitli Görünüm */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative group hover:border-blue-200 transition-colors">
                             <div className="flex items-center justify-between mb-4">
                                <h4 className="label mb-0 text-slate-700">Çalışma Saatleri Planlaması</h4>
                                <Lock size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors"/>
                             </div>
                             <div className="space-y-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                {Object.keys(schedule).map(day => (
                                    <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                                        <div className="w-24 font-bold capitalize text-slate-700">{daysMap[day]}</div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={schedule[day]?.open} onChange={(e) => handleScheduleChange(day, 'open', e.target.checked)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                        {schedule[day]?.open ? (
                                            <div className="flex items-center gap-2">
                                                <input type="time" value={schedule[day].start || '09:00'} onChange={(e)=>handleScheduleChange(day,'start',e.target.value)} className="border rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"/>
                                                <span className="text-slate-400">-</span>
                                                <input type="time" value={schedule[day].end || '18:00'} onChange={(e)=>handleScheduleChange(day,'end',e.target.value)} className="border rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"/>
                                            </div>
                                        ) : <span className="text-slate-400 text-xs italic ml-2">Kapalı</span>}
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <LockableInput label="Website" name="socialMedia.website" value={formData.socialMedia.website} onChange={handleChange} placeholder="https://" />
                            <LockableInput label="Instagram" name="socialMedia.instagram" value={formData.socialMedia.instagram} onChange={handleChange} placeholder="@kullaniciadi" />
                            <LockableInput label="Hizmet Dilleri" name="languages" value={formData.languages} onChange={handleChange} placeholder="TR, EN, RU" />
                        </div>
                    </div>
                )}

                {/* --- TAB: DİNAMİK HİZMETLER --- */}
                {(['services', 'inventory', 'menu', 'rules'].includes(activeTab)) && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-6 border border-blue-100 flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-blue-600"><currentConfig.icon size={20}/></div>
                            <p><strong>{currentConfig.label}</strong> için özel alanları düzenliyorsunuz.</p>
                        </div>
                        
                        {(currentConfig.fields[activeTab] || []).map(fieldKey => (
                            <LockableTextarea
                                key={fieldKey}
                                label={fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                value={formData.serviceDetails[fieldKey] || ''}
                                onChange={(e) => handleServiceDetailChange(fieldKey, e.target.value)}
                                placeholder={`${fieldKey} detaylarını buraya giriniz...`}
                                height="h-32"
                            />
                        ))}
                    </div>
                )}

                {/* --- TAB: PERSONEL / ARAÇLAR / ODALAR --- */}
                {(['staff', 'inventory'].includes(activeTab)) && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="grid md:grid-cols-2 gap-6">
                            {formData.staffOrItems.map((item, index) => (
                                <StaffItemCard 
                                    key={index} 
                                    index={index} 
                                    item={item} 
                                    onUpdate={updateItem} 
                                    onRemove={removeItem} 
                                />
                            ))}
                        </div>
                        <button type="button" onClick={addItem} className="dashed-btn py-6 hover:shadow-md">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform"><Plus size={24}/></div>
                            <span className="text-blue-800 font-bold">{currentConfig.labels.newItemBtn || 'Yeni Ekle'}</span>
                        </button>
                    </div>
                )}

                {/* --- TAB: AI & SSS (LOCKABLE) --- */}
                {activeTab === 'ai' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-amber-50 p-4 rounded-xl text-amber-800 text-sm border border-amber-100">
                            AI Asistanınız buradaki Soru-Cevap ikililerini öğrenerek müşterilerinize 7/24 otomatik cevap verir.
                        </div>
                        {formData.faq.map((q, i) => (
                            <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 group hover:border-blue-200 transition-colors relative">
                                <div className="flex-1 space-y-4">
                                    <LockableInput label={`Soru ${i+1}`} value={q.question} onChange={e=>{const n=[...formData.faq];n[i].question=e.target.value;setFormData({...formData,faq:n})}} placeholder="Müşteri ne sorabilir?" />
                                    <LockableTextarea label="Cevap" value={q.answer} onChange={e=>{const n=[...formData.faq];n[i].answer=e.target.value;setFormData({...formData,faq:n})}} placeholder="AI nasıl cevaplamalı?" height="h-20" />
                                </div>
                                <button type="button" onClick={()=>{setFormData({...formData, faq:formData.faq.filter((_,x)=>x!==i)})}} className="text-slate-300 hover:text-red-500 absolute top-4 right-4"><Trash2 size={20}/></button>
                            </div>
                        ))}
                        <button type="button" onClick={()=>setFormData({...formData, faq:[...formData.faq, {question:'', answer:''}]})} className="dashed-btn"><Plus size={18}/> Yeni Soru Ekle</button>
                    </div>
                )}
                
                {/* --- TAB: ÖDEME (LOCKABLE) --- */}
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
                         <LockableTextarea 
                            label="Kampanyalar & İndirimler" 
                            name="campaigns" 
                            value={formData.campaigns} 
                            onChange={handleChange} 
                            placeholder="Örn: İlk derste %20 indirim..." 
                            height="h-32"
                        />
                    </div>
                )}

            </div>
        </div>

        {/* KAYDET BUTONU */}
        <div className="sticky bottom-6 z-20 flex justify-end">
             <button type="submit" disabled={loading} className="bg-[#001F54] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#0f172a] shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100">
                {loading ? 'Kaydediliyor...' : <><Save size={20}/> Değişiklikleri Kaydet</>}
             </button>
        </div>

      </form>
      
      <style>{`
        .label { display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .tab-btn { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 600; color: #64748b; border-bottom: 2px solid transparent; white-space: nowrap; transition: all 0.2s; }
        .tab-btn:hover { color: #1e293b; background: #f1f5f9; }
        .tab-btn.active { color: #001F54; border-bottom-color: #001F54; background: white; }
        .dashed-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; padding: 1rem; border: 2px dashed #cbd5e1; border-radius: 0.75rem; color: #64748b; font-weight: 600; transition: all 0.2s; cursor: pointer; background: transparent; }
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