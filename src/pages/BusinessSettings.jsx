import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, MapPin, HelpCircle, CreditCard, Trash2, Plus, 
  LayoutGrid, CheckCircle2, AlertCircle, Edit2, Lock, X, 
  Briefcase, Percent, Tag, Globe, Youtube, Linkedin, Video, Instagram 
} from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BUSINESS_TYPES } from '../utils/businessConfig';

/* --- BİLEŞEN 1: KİLİTLENEBİLİR INPUT (İkon Destekli) --- */
const LockableInput = ({ label, value, onChange, name, placeholder, type = "text", className = "", icon: Icon, iconColor = "text-slate-400" }) => {
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
        {Icon && (
          <div className={`absolute left-4 top-3.5 z-10 ${iconColor}`}>
            <Icon size={20} />
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value || ''} 
          onChange={onChange}
          placeholder={placeholder}
          readOnly={isLocked}
          className={`w-full p-3.5 ${Icon ? 'pl-12' : 'pl-4'} pr-12 rounded-xl transition-all duration-300 font-medium ${
            isLocked 
              ? 'bg-slate-100 text-slate-500 border-transparent cursor-default' 
              : 'bg-white text-slate-800 border-blue-500 ring-4 ring-blue-50/50 shadow-sm'
          } border`}
        />
        <button type="button" onClick={toggleLock} className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- BİLEŞEN 2: KİLİTLENEBİLİR TELEFON INPUT (YENİ) --- */
const LockablePhoneInput = ({ label, value, onChange }) => {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="relative group">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <div className={`transition-all duration-300 rounded-xl overflow-hidden border ${isLocked ? 'border-transparent pointer-events-none opacity-80 bg-slate-100' : 'border-blue-500 ring-4 ring-blue-50/50 bg-white'}`}>
           <PhoneInput 
              country={'tr'} 
              value={value} 
              onChange={onChange} 
              disabled={isLocked}
              inputStyle={{
                width:'100%', 
                height:'52px', 
                borderRadius:'0.75rem', 
                border: 'none',
                backgroundColor: isLocked ? '#f1f5f9' : 'white',
                color: isLocked ? '#64748b' : '#1e293b'
              }} 
              buttonStyle={{
                border: 'none',
                backgroundColor: isLocked ? '#f1f5f9' : 'white',
                paddingLeft: '5px'
              }}
           />
        </div>
        <button type="button" onClick={() => setIsLocked(!isLocked)} className={`absolute right-3 top-3 p-1 rounded-lg transition-colors z-20 ${isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white pointer-events-auto' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- BİLEŞEN 3: KİLİTLENEBİLİR TEXTAREA --- */
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
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={isLocked}
          className={`w-full p-3.5 pr-12 rounded-xl transition-all duration-300 font-medium resize-none ${height} ${
            isLocked ? 'bg-slate-100 text-slate-500 border-transparent cursor-default' : 'bg-white text-slate-800 border-blue-500 ring-4 ring-blue-50/50 shadow-sm'
          } border`}
        />
        <button type="button" onClick={() => setIsLocked(!isLocked)} className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- BİLEŞEN 4: KİLİTLENEBİLİR TAG INPUT --- */
const LockableTagInput = ({ label, value, onChange, suggestions = [] }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [inputValue, setInputValue] = useState("");
  
  const tags = Array.isArray(value) ? value : (typeof value === 'string' && value.length > 0 ? value.split(',').map(s => s.trim()) : []);

  const addTag = (tagToAdd) => {
    if (!tagToAdd) return;
    if (!tags.includes(tagToAdd)) onChange([...tags, tagToAdd]);
    setInputValue("");
  };

  const removeTag = (tagToRemove) => onChange(tags.filter(t => t !== tagToRemove));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(inputValue.trim()); }
  };

  return (
    <div className="relative group">
      {label && <label className="label">{label}</label>}
      <div className={`relative w-full p-3.5 rounded-xl border transition-all duration-300 min-h-[60px] flex flex-col justify-center ${isLocked ? 'bg-slate-100 border-transparent' : 'bg-white border-blue-500 ring-4 ring-blue-50/50 shadow-sm'}`}>
        <div className="flex flex-wrap gap-2 pr-8">
           {tags.length === 0 && isLocked && <span className="text-slate-400 text-sm italic">Seçim yapılmadı.</span>}
           {tags.map((tag, idx) => (
             <span key={idx} className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${isLocked ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
               {tag}
               {!isLocked && <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 flex items-center"><X size={14}/></button>}
             </span>
           ))}
           {!isLocked && <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none min-w-[150px] text-sm py-1" placeholder="Ekle..." />}
        </div>
        <button type="button" onClick={() => setIsLocked(!isLocked)} className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}>
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
      {!isLocked && suggestions.length > 0 && (
        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in-up">
           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Öneriler</div>
           <div className="flex flex-wrap gap-2">
             {suggestions.map((sug, i) => (
               <button key={i} type="button" onClick={() => addTag(sug)} disabled={tags.includes(sug)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${tags.includes(sug) ? 'bg-green-100 text-green-700 border-green-200 opacity-50 cursor-not-allowed' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'}`}>
                 {tags.includes(sug) && <CheckCircle2 size={12} className="inline mr-1"/>}{sug}
               </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

/* --- BİLEŞEN 5: KİLİTLENEBİLİR TOGGLE (SWITCH) - GÜNCELLENDİ --- */
const LockableToggle = ({ label, value, onChange }) => {
  const [isLocked, setIsLocked] = useState(true);

  // Kilitli değilse tıklanınca değeri değiştir
  const handleToggle = () => {
    if (!isLocked) {
      onChange(!value);
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${isLocked ? 'bg-slate-100 border-transparent' : 'bg-white border-blue-500 ring-4 ring-blue-50/50'}`}>
      <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={handleToggle}>
        <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${value ? 'bg-green-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}>
           <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
        <div>
           <span className="font-bold text-slate-700 text-sm block">{label}</span>
           <span className="text-xs text-slate-400">{value ? 'Aktif' : 'Pasif'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => setIsLocked(!isLocked)} className={`p-1.5 rounded-lg transition-colors ${isLocked ? 'text-slate-400 hover:text-blue-600' : 'text-blue-600 bg-blue-50'}`}>
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- BİLEŞEN 6: KAMPANYA YÖNETİCİSİ --- */
const CampaignManager = ({ campaigns = [], onChange }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [newCamp, setNewCamp] = useState({ name: '', discount: '' });

  const addCampaign = () => {
    if (newCamp.name && newCamp.discount) {
      onChange([...campaigns, newCamp]);
      setNewCamp({ name: '', discount: '' });
    }
  };

  const removeCampaign = (index) => {
    const updated = campaigns.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="relative group">
      <label className="label">Aktif Kampanyalar</label>
      <div className={`relative w-full p-4 rounded-xl border transition-all duration-300 ${isLocked ? 'bg-slate-100 border-transparent' : 'bg-white border-blue-500 ring-4 ring-blue-50/50'}`}>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
           {campaigns.length === 0 && <div className="text-slate-400 text-sm italic p-2">Aktif kampanya yok.</div>}
           {campaigns.map((camp, idx) => (
             <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">%{camp.discount}</div>
                   <span className="text-sm font-bold text-slate-700">{camp.name}</span>
                </div>
                {!isLocked && <button type="button" onClick={() => removeCampaign(idx)} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>}
             </div>
           ))}
        </div>

        {!isLocked && (
          <div className="mt-4 flex gap-2 items-center pt-4 border-t border-slate-100">
             <input value={newCamp.name} onChange={e => setNewCamp({...newCamp, name: e.target.value})} placeholder="Kampanya Adı" className="flex-1 border p-2 rounded-lg text-sm outline-none focus:border-blue-500"/>
             <div className="relative w-24">
                <Percent size={14} className="absolute left-2 top-2.5 text-slate-400"/>
                <input type="number" value={newCamp.discount} onChange={e => setNewCamp({...newCamp, discount: e.target.value})} placeholder="İndirim" className="w-full border p-2 pl-6 rounded-lg text-sm outline-none focus:border-blue-500"/>
             </div>
             <button type="button" onClick={addCampaign} className="bg-[#001F54] text-white p-2 rounded-lg hover:bg-blue-900"><Plus size={18}/></button>
          </div>
        )}

        <button type="button" onClick={() => setIsLocked(!isLocked)} className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${isLocked ? 'text-slate-400 hover:text-blue-600' : 'text-blue-600 bg-blue-50'}`}>
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

/* --- BİLEŞEN 7: PERSONEL KARTI --- */
const StaffItemCard = ({ item, index, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => { if (!item.name) setIsEditing(true); }, []);

  return (
    <div className={`relative transition-all duration-300 rounded-2xl border ${isEditing ? 'bg-white border-blue-200 shadow-xl scale-[1.01] z-10 p-6' : 'bg-slate-50 border-slate-200 hover:border-blue-200 p-6'}`}>
      <div className="absolute top-4 right-4 flex gap-2">
        <button type="button" onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-green-100 text-green-700' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'}`}>
          {isEditing ? <CheckCircle2 size={18}/> : <Edit2 size={16}/>}
        </button>
        <button type="button" onClick={() => onRemove(index)} className="p-2 rounded-lg bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"><Trash2 size={16}/></button>
      </div>
      {isEditing ? (
        <div className="grid gap-4 animate-fade-in-up">
           <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">İsim / Model</label><input value={item.name || ''} onChange={(e) => onUpdate(index, 'name', e.target.value)} className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500" placeholder="Örn: Dr. Ayşe Yılmaz" /></div>
              <div><label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">Ünvan / Özellik</label><input value={item.title || ''} onChange={(e) => onUpdate(index, 'title', e.target.value)} className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500" placeholder="Örn: Ortodontist" /></div>
           </div>
           <div><label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">Açıklama</label><textarea value={item.desc || ''} onChange={(e) => onUpdate(index, 'desc', e.target.value)} className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500 h-20 resize-none" placeholder="Detaylı bilgi..." /></div>
        </div>
      ) : (
        <div className="pr-12">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">{item.name ? item.name.charAt(0).toUpperCase() : '?'}</div>
              <div><h4 className="font-bold text-slate-800 text-lg">{item.name || 'İsimsiz'}</h4><div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{item.title || 'Ünvan Yok'}</div></div>
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

  const [formData, setFormData] = useState({
    businessType: 'pilates', businessName: '', branches: '', phone: '', email: '', languages: '',
    socialMedia: { website: '', instagram: '', youtube: '', linkedin: '', tiktok: '' },
    workingHours: '{}',
    serviceDetails: {}, staffOrItems: [], faq: [], 
    campaigns: [], 
    paymentMethods: { creditCard: false, transfer: false, pos: false, cash: false }
  });

  const [schedule, setSchedule] = useState({ pzt: { open: true }, sali: { open: true }, cars: { open: true }, pers: { open: true }, cuma: { open: true }, cmt: { open: true }, paz: { open: false } });
  const daysMap = { pzt: 'Pazartesi', sali: 'Salı', cars: 'Çarşamba', pers: 'Perşembe', cuma: 'Cuma', cmt: 'Cumartesi', paz: 'Pazar' };

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || "https://pax-backend-9m4q.onrender.com/api";
      const res = await fetch(`${apiUrl}/business-profile`, { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (res.ok) {
        const data = await res.json();
        const typeFromDb = data.businessType || 'pilates';
        const safeType = (BUSINESS_TYPES && BUSINESS_TYPES[typeFromDb]) ? typeFromDb : 'pilates';
        setSelectedType(safeType);

        if (data.workingHours && data.workingHours !== '{}') try { setSchedule(JSON.parse(data.workingHours)); } catch(e) {}

        let finalServiceDetails = data.serviceDetails || {};
        if (Object.keys(finalServiceDetails).length === 0 && data.classTypes) {
             finalServiceDetails.classTypes = Array.isArray(data.classTypes) ? data.classTypes : data.classTypes.split(','); 
        }

        let finalCampaigns = [];
        if (Array.isArray(data.campaigns)) finalCampaigns = data.campaigns;
        else if (typeof data.campaigns === 'string' && data.campaigns.length > 0) {
            finalCampaigns = [{ name: data.campaigns, discount: '0' }];
        }

        // Social Media Default
        const defaultSocial = { website: '', instagram: '', youtube: '', linkedin: '', tiktok: '' };
        const mergedSocial = { ...defaultSocial, ...(data.socialMedia || {}) };

        setFormData(prev => ({ 
            ...prev, ...data, 
            businessType: safeType,
            staffOrItems: (data.staffOrItems?.length > 0) ? data.staffOrItems : (data.instructors?.map(i => ({ name: i.name, title: i.specialty, desc: i.bio })) || []),
            serviceDetails: finalServiceDetails,
            campaigns: finalCampaigns,
            socialMedia: mergedSocial
        }));
      }
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) { const [p, c] = name.split('.'); setFormData(prev => ({ ...prev, [p]: { ...prev[p], [c]: value } })); } 
    else { setFormData(prev => ({ ...prev, [name]: value })); }
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
        const res = await fetch(`${apiUrl}/business-profile`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(finalData) });
        if (res.ok) setMessage({ type: 'success', text: '✅ Değişiklikler başarıyla kaydedildi!' });
        else throw new Error();
    } catch (e) { setMessage({ type: 'error', text: '❌ Kaydedilemedi.' }); } 
    finally { setLoading(false); setTimeout(() => setMessage(null), 3000); }
  };

  const handleTypeSelect = (key) => { setSelectedType(key); setFormData(p => ({...p, businessType: key})); };
  const currentConfig = (BUSINESS_TYPES && BUSINESS_TYPES[selectedType]) ? BUSINESS_TYPES[selectedType] : BUSINESS_TYPES['pilates'];
  const ActiveIcon = currentConfig?.icon || Briefcase;

  return (
    <div className="pb-20 max-w-5xl mx-auto font-sans">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start