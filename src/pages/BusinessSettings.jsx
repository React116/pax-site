import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Settings, MessageSquare, Smartphone, Briefcase } from 'lucide-react';

const BusinessSettings = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State'i
  const [formData, setFormData] = useState({
    businessName: '',
    services: [], // { serviceName, price, description }
    aiConfig: { botName: 'PAX Asistan', tone: 'Resmi', welcomeMessage: '' },
    whatsappConfig: { phoneNumberId: '', accessToken: '' }
  });

  // Backend URL (Kendi Render URL'ini buraya yazmalısın veya .env dosyasından çekmelisin)
  const API_URL = "pax-site-n0p4okoo6-merts-projects-c03e5b92.vercel.app"; 
  // NOT: Eğer localhost'ta test ediyorsan: "http://localhost:5000/api"

  // Token'ı al
  const token = localStorage.getItem('token');

  // Sayfa açılınca verileri çek
  useEffect(() => {
    const fetchProfile = async () => {
      try {
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

  // Input Değişikliklerini Yönet (Nested Objeler için)
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

  // Hizmet Ekleme / Çıkarma / Güncelleme
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

  // Formu Kaydet
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

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800">
        <Settings className="w-8 h-8 text-blue-600" /> İşletme Ayarları
      </h1>

      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. GENEL BİLGİLER */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <Briefcase className="w-5 h-5" /> Genel Bilgiler
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İşletme Adı</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: PAX Danışmanlık"
            />
          </div>
        </div>

        {/* 2. HİZMETLER VE FİYATLAR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
              <Settings className="w-5 h-5" /> Hizmetler & Fiyatlar
            </h2>
            <button type="button" onClick={addService} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
              <Plus size={16} /> Hizmet Ekle
            </button>
          </div>
          
          {formData.services.length === 0 && <p className="text-gray-400 text-sm">Henüz hizmet eklemediniz.</p>}

          <div className="space-y-4">
            {formData.services.map((service, index) => (
              <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    name="serviceName"
                    value={service.serviceName}
                    onChange={(e) => handleServiceChange(index, e)}
                    placeholder="Hizmet Adı (Örn: Web Tasarım)"
                    className="w-full border p-2 rounded text-sm"
                  />
                  <input
                    type="text"
                    name="description"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, e)}
                    placeholder="Kısa Açıklama"
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    name="price"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, e)}
                    placeholder="Fiyat (TL)"
                    className="w-full border p-2 rounded text-sm"
                  />
                </div>
                <button type="button" onClick={() => removeService(index)} className="text-red-500 hover:text-red-700 mt-2">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AI ASİSTAN AYARLARI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <MessageSquare className="w-5 h-5" /> AI Asistan Yapılandırması
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bot Adı</label>
              <input
                type="text"
                name="botName"
                value={formData.aiConfig.botName}
                onChange={(e) => handleChange(e, 'aiConfig')}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konuşma Tonu</label>
              <select
                name="tone"
                value={formData.aiConfig.tone}
                onChange={(e) => handleChange(e, 'aiConfig')}
                className="w-full border p-2 rounded bg-white"
              >
                <option value="Resmi">Resmi</option>
                <option value="Samimi">Samimi</option>
                <option value="Eğlenceli">Eğlenceli</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Karşılama Mesajı</label>
              <textarea
                name="welcomeMessage"
                value={formData.aiConfig.welcomeMessage}
                onChange={(e) => handleChange(e, 'aiConfig')}
                className="w-full border p-2 rounded h-24"
                placeholder="Müşteri ilk yazdığında ne söylensin?"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 4. WHATSAPP API AYARLARI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <Smartphone className="w-5 h-5" /> WhatsApp API Bağlantısı
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
              <input
                type="text"
                name="phoneNumberId"
                value={formData.whatsappConfig.phoneNumberId}
                onChange={(e) => handleChange(e, 'whatsappConfig')}
                className="w-full border p-2 rounded font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
              <input
                type="password"
                name="accessToken"
                value={formData.whatsappConfig.accessToken}
                onChange={(e) => handleChange(e, 'whatsappConfig')}
                className="w-full border p-2 rounded font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* KAYDET BUTONU */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <Save size={20} /> Ayarları Kaydet
        </button>

      </form>
    </div>
  );
};

export default BusinessSettings;