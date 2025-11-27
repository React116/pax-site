import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, MapPin, HelpCircle, CreditCard, Trash2, Plus, 
  LayoutGrid, CheckCircle2, AlertCircle, Edit2, Lock, X, Briefcase 
} from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Config importunda hata olursa diye try-catch gibi davranacak bir yapı yok ama
// BUSINESS_TYPES'ın undefined gelme ihtimaline karşı aşağıda kontrol ekledik.
import { BUSINESS_TYPES } from '../utils/businessConfig';

/* --- BİLEŞEN 1: KİLİTLENEBİLİR INPUT --- */
const LockableInput = ({ label, value, onChange, name, placeholder, type = "text", className = "" }) => {
  const [isLocked, setIsLocked] = useState(true);
  const inputRef = useRef(null);

  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (isLocked) setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className={`relative group ${className}`}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          name={name}
          // Çökme Önleyici: value null/undefined ise boş string ver
          value={value || ''} 
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
            isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- BİLEŞEN 2: KİLİTLENEBİLİR TEXTAREA --- */
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
          value={value || ''} // Çökme Önleyici
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
            isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- BİLEŞEN 3: KİLİTLENEBİLİR TAG INPUT --- */
const LockableTagInput = ({ label, value, onChange, suggestions = [] }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [inputValue, setInputValue] = useState("");
  
  // Çökme Önleyici: value bir string veya array değilse boş array yap
  const tags = Array.isArray(value) 
    ? value 
    : (typeof value === 'string' && value.length > 0 ? value.split(',').map(s => s.trim()) : []);

  const addTag = (tagToAdd) => {
    if (!tagToAdd) return;
    if (!tags.includes(tagToAdd)) {
      const newTags = [...tags, tagToAdd];
      onChange(newTags);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    onChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  return (
    <div className="relative group">
      {label && <label className="label">{label}</label>}
      
      <div className={`relative w-full p-3.5 rounded-xl border transition-all duration-300 min-h-[60px] flex flex-col justify-center ${
          isLocked 
            ? 'bg-slate-100 border-transparent' 
            : 'bg-white border-blue-500 ring-4 ring-blue-50/50 shadow-sm'
        }`}>
        
        <div className="flex flex-wrap gap-2 pr-8">
           {tags.length === 0 && isLocked && <span className="text-slate-400 text-sm italic">Henüz seçim yapılmamış.</span>}
           {tags.map((tag, idx) => (
             <span key={idx} className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${
               isLocked ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'
             }`}>
               {tag}
               {!isLocked && (
                 <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 flex items-center"><X size={14}/></button>
               )}
             </span>
           ))}
           
           {!isLocked && (
             <input 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={handleKeyDown}
               className="flex-1 bg-transparent outline-none min-w-[150px] text-sm py-1"
               placeholder="Ekle..."
             />
           )}
        </div>

        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
            isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>

      {!isLocked && suggestions && suggestions.length > 0 && (
        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in-up">
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Öneriler</div>
           <div className="flex flex-wrap gap-2">
             {suggestions.map((sug, i) => (
               <button 
                 key={i} 
                 type="button" 
                 onClick={() => addTag(sug)}
                 disabled={tags.includes(sug)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                   tags.includes(sug) 
                     ? 'bg-green-100 text-green-700 border-green-200 opacity-50 cursor-not-allowed' 
                     : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'
                 }`}
               >
                 {tags.includes(sug) && <CheckCircle2 size={12} className="inline mr-1"/>}
                 {sug}
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

/* --- BİLEŞEN 4: PERSONEL KARTI --- */
const StaffItemCard = ({ item, index, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => { if (!item.name) setIsEditing(true); }, []);

  return (
    <div className={`relative transition-all duration-300 rounded-2xl border ${
      isEditing 
        ? 'bg-white border-blue-200 shadow-xl scale-[1.01] z-10 p-6' 
        : 'bg-slate-50 border-slate-200 hover:border-blue-200 p-6'
    }`}>
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
        <div className="grid gap-4 animate-fade-in-up">
           <div className="grid md:grid-cols-2 gap-4">
              <div>
                  <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">İsim / Model</label>
                  <input value={item.name || ''} onChange={(e) => onUpdate(index, 'name', e.target.value)} className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500" placeholder="Örn: Dr. Ayşe Yılmaz" />
              </div>
              <div>
                  <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">Ünvan / Özellik</label>
                  <input value={item.title || ''} onChange={(e) => onUpdate(index, 'title', e.target.value)} className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500" placeholder="Örn: Ortodontist" />
              </div>
           </div>
           <div>
              <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">Açıklama</label>
              <textarea value={item.desc || ''} onChange={(e) => onUpdate(index, 'desc', e.target.value)} className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500 h-20 resize-none" placeholder="Detaylı bilgi..." />
           </div>
        </div>
      ) : (
        <div className="pr-12">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">{item.name ? item.name.charAt(0).toUpperCase() : '?'}</div>
              <div>
                 <h4 className="font-bold text-slate-800 text-lg">{item.name || 'İsimsiz'}</h4>
                 <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{item.title || 'Ünvan Yok'}</div>
              </div>
           </div>
           <p className="text-slate-500 text-sm leading-relaxed mt-3 pl-[3.25rem]">{item.desc || 'Açıklama girilmemiş.'}</p>
        </div>
      )}
    </div>
  );
};

/* --- ANA COMPONENT --- */
const BusinessSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedType, setSelectedType] = useState('pilates');

  // Form State
  const [formData, setFormData] = useState({
    businessType: 'pilates', businessName: '', branches: '', phone: '', email: '', languages: '',
    socialMedia: { website: '', instagram: '', facebook: '' },
    workingHours: '{}',
    serviceDetails: {}, staffOrItems: [], faq: [], campaigns: '',
    paymentMethods: { creditCard: false, transfer: false, pos: false, cash: false }
  });

  const [schedule, setSchedule] = useState({ pzt: { open: true }, sali: { open: true }, cars: { open: true }, pers: { open: true }, cuma: { open: true }, cmt: { open: true }, paz: { open: false } });
  const daysMap = { pzt: 'Pazartesi', sali: 'Salı', cars: 'Çarşamba', pers: 'Perşembe', cuma: 'Cuma', cmt: 'Cumartesi', paz: 'Pazar' };

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      // API URL kontrolü
      const apiUrl = import.meta.env.VITE_API_URL || "https://pax-backend-9m4q.onrender.com/api";
      
      const res = await fetch(`${apiUrl}/business-profile`, { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (res.ok) {
        const data = await res.json();
        
        // Çökme Önleyici: Eğer veritabanındaki type bilinmiyorsa 'pilates' yap
        const typeFromDb = data.businessType || 'pilates';
        const safeType = (BUSINESS_TYPES && BUSINESS_TYPES[typeFromDb]) ? typeFromDb : 'pilates';
        
        setSelectedType(safeType);

        if (data.workingHours && data.workingHours !== '{}') try { setSchedule(JSON.parse(data.workingHours)); } catch(e) {}

        let finalServiceDetails = data.serviceDetails || {};
        if (Object.keys(finalServiceDetails).length === 0) {
             if(data.classTypes) finalServiceDetails.classTypes = Array.isArray(data.classTypes) ? data.classTypes : data.classTypes.split(','); 
        }

        setFormData(prev => ({ 
            ...prev, ...data, 
            businessType: safeType,
            staffOrItems: (data.staffOrItems?.length > 0) ? data.staffOrItems : (data.instructors?.map(i => ({ name: i.name, title: i.specialty, desc: i.bio })) || []),
            serviceDetails: finalServiceDetails 
        }));
      }
    } catch (err) { console.error("Veri çekme hatası:", err); }
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
    setFormData(prev => ({ ...prev, serviceDetails: { ...prev.serviceDetails, [key]: value } }));
  };

  const addItem = () => setFormData(p => ({ ...p, staffOrItems: [...p.staffOrItems, { name: '', title: '', desc: '' }] }));
  const removeItem = (i) => setFormData(p => ({ ...p, staffOrItems: p.staffOrItems.filter((_, idx) => idx !== i) }));
  const updateItem = (i, field, value) => { const n = [...formData.staffOrItems]; n[i][field] = value; setFormData(p => ({ ...p, staffOrItems: n })); };
  const handleScheduleChange = (day, field, value) => setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const finalData = { ...formData, workingHours: JSON.stringify(schedule) };
    try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || "https://pax-backend-9m4q.onrender.com/api";
        const res = await fetch(`${apiUrl}/business-profile`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(finalData)
        });
        if (res.ok) setMessage({ type: 'success', text: '✅ Değişiklikler başarıyla kaydedildi!' });
        else throw new Error();
    } catch (e) { setMessage({ type: 'error', text: '❌ Kaydedilemedi.' }); } 
    finally { setLoading(false); setTimeout(() => setMessage(null), 3000); }
  };

  const handleTypeSelect = (key) => { setSelectedType(key); setFormData(p => ({...p, businessType: key})); };
  
  // ÇÖKME ÖNLEYİCİ ANAHTAR NOKTA:
  // Eğer BUSINESS_TYPES yüklenemezse veya selectedType hatalıysa varsayılanı kullan
  const currentConfig = (BUSINESS_TYPES && BUSINESS_TYPES[selectedType]) ? BUSINESS_TYPES[selectedType] : BUSINESS_TYPES['pilates'];
  
  // Ikon hatasını önlemek için değişkene ata
  const ActiveIcon = currentConfig?.icon || Briefcase;

  return (
    <div className="pb-20 max-w-5xl mx-auto font-sans">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-3xl font-bold text-[#001F54] font-serif">İşletme Yapılandırması</h1><p className="text-slate-500 text-sm mt-1">Sektörünüzü seçin ve bilgilerinizi yönetin.</p></div>
        {message && <div className={`px-4 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 animate-bounce-in ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{message.text}</div>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><LayoutGrid size={18} className="text-blue-600"/> İşletme Türü</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {BUSINESS_TYPES && Object.keys(BUSINESS_TYPES).map(key => {
                    const TypeIcon = BUSINESS_TYPES[key].icon;
                    return (
                        <button key={key} type="button" onClick={() => handleTypeSelect(key)} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all relative ${selectedType === key ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105 z-10' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white opacity-70 hover:opacity-100'}`}>
                            <TypeIcon size={24} /><span className="text-[10px] font-bold text-center leading-tight">{BUSINESS_TYPES[key].label}</span>
                        </button>
                    )
                })}
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
            <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-hide bg-slate-50/50">
                <button type="button" onClick={() => setActiveTab('general')} className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}><MapPin size={16}/> Genel Bilgiler</button>
                {(currentConfig.tabs || []).includes('services') && <button type="button" onClick={() => setActiveTab('services')} className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}>{currentConfig.labels?.services || 'Hizmetler'}</button>}
                {(currentConfig.tabs || []).includes('staff') && <button type="button" onClick={() => setActiveTab('staff')} className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}>{currentConfig.labels?.staff || 'Personel'}</button>}
                {(currentConfig.tabs || []).includes('inventory') && <button type="button" onClick={() => setActiveTab('inventory')} className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}>{currentConfig.labels?.inventory || 'Envanter'}</button>}
                {(currentConfig.tabs || []).includes('menu') && <button type="button" onClick={() => setActiveTab('menu')} className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}>{currentConfig.labels?.menu || 'Menü'}</button>}
                {(currentConfig.tabs || []).includes('rules') && <button type="button" onClick={() => setActiveTab('rules')} className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}>{currentConfig.labels?.rules || 'Kurallar'}</button>}
                <button type="button" onClick={() => setActiveTab('ai')} className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}><HelpCircle size={16}/> AI & SSS</button>
                <button type="button" onClick={() => setActiveTab('payment')} className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}><CreditCard size={16}/> Ödeme</button>
            </div>

            <div className="p-8">
                {activeTab === 'general' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="grid md:grid-cols-2 gap-8">
                            <LockableInput label="İşletme / Marka Adı" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Örn: Pax Pilates" />
                            <div className="relative group"><label className="label">Telefon</label><div className="relative"><PhoneInput country={'tr'} value={formData.phone} onChange={val => setFormData({...formData, phone: val})} inputStyle={{width:'100%', height:'52px', borderRadius:'0.75rem', borderColor:'#e2e8f0'}} /><div className="absolute right-3 top-3 text-slate-300 pointer-events-none"><Lock size={16}/></div></div></div>
                        </div>
                        <LockableTextarea label="Adres ve Konum" name="branches" value={formData.branches} onChange={handleChange} placeholder="Adres..." height="h-24"/>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group relative hover:border-blue-200"><div className="flex justify-between mb-4"><h4 className="label mb-0">Çalışma Saatleri</h4><Lock size={14} className="text-slate-400 group-hover:text-blue-500"/></div><div className="space-y-2 opacity-70 group-hover:opacity-100 transition-opacity">{Object.keys(schedule).map(day => (<div key={day} className="flex gap-4 items-center bg-white p-2 rounded-lg border border-slate-200"><span className="w-20 font-bold capitalize text-xs">{daysMap[day]}</span><input type="checkbox" checked={schedule[day]?.open} onChange={(e)=>handleScheduleChange(day,'open',e.target.checked)}/><input type="time" value={schedule[day]?.start||'09:00'} onChange={(e)=>handleScheduleChange(day,'start',e.target.value)} className="border rounded px-1 text-xs"/><input type="time" value={schedule[day]?.end||'18:00'} onChange={(e)=>handleScheduleChange(day,'end',e.target.value)} className="border rounded px-1 text-xs"/></div>))}</div></div>
                        <div className="grid md:grid-cols-3 gap-6"><LockableInput label="Website" name="socialMedia.website" value={formData.socialMedia.website} onChange={handleChange} placeholder="https://" /><LockableInput label="Instagram" name="socialMedia.instagram" value={formData.socialMedia.instagram} onChange={handleChange} placeholder="@" /><LockableInput label="Diller" name="languages" value={formData.languages} onChange={handleChange} placeholder="TR, EN" /></div>
                    </div>
                )}

                {(['services', 'inventory', 'menu', 'rules'].includes(activeTab)) && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-6 border border-blue-100 flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-blue-600"><ActiveIcon size={20}/></div>
                            <p><strong>{currentConfig.label}</strong> için özel alanlar.</p>
                        </div>
                        {(currentConfig.fields[activeTab] || []).map((field, idx) => {
                            const isObject = typeof field === 'object';
                            const key = isObject ? field.key : field;
                            const label = isObject ? field.label : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            
                            if (isObject && field.type === 'tags') {
                                return (
                                    <LockableTagInput 
                                        key={key}
                                        label={label}
                                        value={formData.serviceDetails?.[key]}
                                        suggestions={field.suggestions}
                                        onChange={(newTags) => handleServiceDetailChange(key, newTags)}
                                    />
                                );
                            }
                            
                            return (
                                <LockableTextarea
                                    key={key}
                                    label={label}
                                    value={formData.serviceDetails?.[key] || ''}
                                    onChange={(e) => handleServiceDetailChange(key, e.target.value)}
                                    placeholder={`${label} detayları...`}
                                    height="h-32"
                                />
                            );
                        })}
                    </div>
                )}

                {(['staff', 'inventory'].includes(activeTab)) && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="grid md:grid-cols-2 gap-6">{formData.staffOrItems.map((item, index) => (<StaffItemCard key={index} index={index} item={item} onUpdate={updateItem} onRemove={removeItem} />))}</div>
                        <button type="button" onClick={addItem} className="dashed-btn py-6 hover:shadow-md"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform"><Plus size={24}/></div><span className="text-blue-800 font-bold">{currentConfig.labels?.newItemBtn || 'Yeni Ekle'}</span></button>
                    </div>
                )}

                {activeTab === 'ai' && (<div className="space-y-6 animate-fade-in-up">{formData.faq.map((q, i) => (<div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 relative"><div className="flex-1 space-y-4"><LockableInput label={`Soru ${i+1}`} value={q.question} onChange={e=>{const n=[...formData.faq];n[i].question=e.target.value;setFormData({...formData,faq:n})}} placeholder="?" /><LockableTextarea label="Cevap" value={q.answer} onChange={e=>{const n=[...formData.faq];n[i].answer=e.target.value;setFormData({...formData,faq:n})}} placeholder="..." height="h-20" /></div><button type="button" onClick={()=>{setFormData({...formData, faq:formData.faq.filter((_,x)=>x!==i)})}} className="text-slate-300 hover:text-red-500 absolute top-4 right-4"><Trash2 size={20}/></button></div>))}<button type="button" onClick={()=>setFormData({...formData, faq:[...formData.faq, {question:'', answer:''}]})} className="dashed-btn"><Plus size={18}/> Soru Ekle</button></div>)}
                {activeTab === 'payment' && (<div className="animate-fade-in-up space-y-8"><div><label className="label mb-4">Kabul Edilen Ödeme Yöntemleri</label><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{['creditCard', 'transfer', 'pos', 'cash'].map(m => (<label key={m} className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center gap-2 transition-all ${formData.paymentMethods[m] ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}><input type="checkbox" checked={formData.paymentMethods[m]} onChange={e=>setFormData({...formData, paymentMethods: {...formData.paymentMethods, [m]: e.target.checked}})} className="hidden"/><span className="capitalize font-bold text-sm">{m}</span></label>))}</div></div><LockableTextarea label="Kampanyalar & İndirimler" name="campaigns" value={formData.campaigns} onChange={handleChange} placeholder="..." height="h-32"/></div>)}
            </div>
        </div>
        <div className="sticky bottom-6 z-20 flex justify-end"><button type="submit" disabled={loading} className="bg-[#001F54] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#0f172a] shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100">{loading ? 'Kaydediliyor...' : <><Save size={20}/> Değişiklikleri Kaydet</>}</button></div>
      </form>
      <style>{`
        .label { display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .tab-btn { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 600; color: #64748b; border-bottom: 2px solid transparent; white-space: nowrap; transition: all 0.2s; }
        .tab-btn:hover { color: #1e293b; background: #f1f5f9; }
        .tab-btn.active { color: #001F54; border-bottom-color: #001F54; background: white; }
        .dashed-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; padding: 1rem; border: 2px dashed #cbd5e1; border-radius: 0.75rem; color: #64748b; font-weight: 600; transition: all 0.2s; cursor: pointer; background: transparent; }
        .dashed-btn:hover { border-color: #001F54; color: #001F54; background: #f8fafc; }
        .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default BusinessSettings;