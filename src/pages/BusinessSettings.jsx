// src/pages/BusinessSettings.jsx
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Settings, MessageSquare, Smartphone, Briefcase, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BusinessSettings = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // API URL Ayarı
  const API_URL = "https://senin-backend-urlin.onrender.com/api"; // Render linkini buraya koy

  const [formData, setFormData] = useState({
    businessName: '',
    services: [],
    aiConfig: { botName: 'PAX Asistan', tone: 'Resmi', welcomeMessage: '' },
    whatsappConfig: { phoneNumberId: '', accessToken: '' }
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Hata almamak için token kontrolü
        if (!token) return;
        
        const res = await fetch(`${API_URL}/business`, {
          headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        
        if (data.profile) {
          setFormData({
            businessName: data.profile.businessName || '',
            services: data.profile.services || [],
            aiConfig: data.profile.aiConfig || { botName: '', tone: 'Resmi', welcomeMessage: '' },
            whatsappConfig: data.profile.whatsappConfig || { phoneNumberId: '', accessToken: '' }
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e, section = null) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [e.target.name]: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleServiceChange = (index, e) => {
    const newServices = [...formData.services];
    newServices[index][e.target.name] = e.target.value;
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { serviceName: '', price: '', description: '' }]
    });
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: newServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: 'info', text: 'Kaydediliyor...' });

    try {
      const res = await fetch(`${API_URL}/business`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Ayarlar başarıyla güncellendi!' });
      } else {
        setMessage({ type: 'error', text: 'Kaydederken bir hata oluştu.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Sunucu bağlantı hatası.' });
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Veriler yükleniyor...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <Link to="/panel" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-[#001F54] transition-colors">
           <ChevronLeft size={20} />
        </Link>
        <div>
           <h1 className="text-3xl font-bold text-[#0f172a] font-serif">İşletme Ayarları</h1>
           <p className="text-slate-500 text-sm">Botun müşterilerinize vereceği yanıtları buradan yönetin.</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
          <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* GRUP 1: GENEL & AI */}
        <div className="grid lg:grid-cols-2 gap-6">
           {/* Genel Bilgiler */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#001F54]">
               <Briefcase size={18} /> İşletme Bilgisi
             </h2>
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">İşletme Adı</label>
               <input
                 type="text"
                 name="businessName"
                 value={formData.businessName}
                 onChange={handleChange}
                 className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                 placeholder="Örn: PAX Danışmanlık"
               />
             </div>
           </div>

           {/* AI Yapılandırma */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#001F54]">
               <MessageSquare size={18} /> Asistan Kimliği
             </h2>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bot Adı</label>
                   <input
                     type="text"
                     name="botName"
                     value={formData.aiConfig.botName}
                     onChange={(e) => handleChange(e, 'aiConfig')}
                     className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ton</label>
                   <select
                     name="tone"
                     value={formData.aiConfig.tone}
                     onChange={(e) => handleChange(e, 'aiConfig')}
                     className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                   >
                     <option value="Resmi">Resmi</option>
                     <option value="Samimi">Samimi</option>
                     <option value="Eğlenceli">Eğlenceli</option>
                   </select>
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Karşılama Mesajı</label>
                  <textarea
                    name="welcomeMessage"
                    value={formData.aiConfig.welcomeMessage}
                    onChange={(e) => handleChange(e, 'aiConfig')}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20 text-sm"
                    placeholder="Müşteri ilk yazdığında ne söylensin?"
                  ></textarea>
               </div>
             </div>
           </div>
        </div>

        {/* GRUP 2: HİZMETLER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#001F54]">
              <Settings size={18} /> Hizmetler & Fiyat Listesi
            </h2>
            <button type="button" onClick={addService} className="text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1 transition-colors">
              <Plus size={14} /> Yeni Ekle
            </button>
          </div>
          
          {formData.services.length === 0 && (
             <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                Henüz hizmet eklenmemiş. "Yeni Ekle" butonuna basarak başlayın.
             </div>
          )}

          <div className="space-y-3">
            {formData.services.map((service, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    name="serviceName"
                    value={service.serviceName}
                    onChange={(e) => handleServiceChange(index, e)}
                    placeholder="Hizmet Adı"
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    name="description"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, e)}
                    placeholder="Kısa Açıklama"
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="w-full md:w-32">
                  <input
                    type="number"
                    name="price"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, e)}
                    placeholder="Fiyat"
                    className="w-full bg-white border border-slate-200 p-2 rounded-lg text-sm focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <button type="button" onClick={() => removeService(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end md:self-center">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* GRUP 3: WHATSAPP API (Gizlenebilir yapılabilir ama şimdilik açık) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 opacity-80 hover:opacity-100 transition-opacity">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
            <Smartphone size={18} /> WhatsApp API (Teknik)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number ID</label>
              <input
                type="text"
                name="phoneNumberId"
                value={formData.whatsappConfig.phoneNumberId}
                onChange={(e) => handleChange(e, 'whatsappConfig')}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Access Token</label>
              <input
                type="password"
                name="accessToken"
                value={formData.whatsappConfig.accessToken}
                onChange={(e) => handleChange(e, 'whatsappConfig')}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* KAYDET BUTONU */}
        <div className="sticky bottom-6 z-20">
            <button
            type="submit"
            className="w-full bg-[#001F54] hover:bg-blue-900 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/20 hover:scale-[1.01]"
            >
            <Save size={20} /> Değişiklikleri Kaydet
            </button>
        </div>

      </form>
    </motion.div>
  );
};

export default BusinessSettings;