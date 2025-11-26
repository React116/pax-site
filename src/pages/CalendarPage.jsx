import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { tr } from 'date-fns/locale'; // Türkçe dil desteği
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, X, Calendar as CalendarIcon, Trash2, Clock, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Takvim ayarları (Türkçe)
const locales = {
  'tr': tr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    start: '', 
    end: '', 
    desc: '',
    color: '#3b82f6' // Varsayılan renk
  });

  const BASE_URL = import.meta.env.VITE_API_URL || "https://pax-backend-9m4q.onrender.com/api";
  const token = localStorage.getItem('token');

  // --- Verileri Çek ---
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/calendar`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Backend'den gelen String tarihleri JS Date objesine çeviriyoruz
        const parsedEvents = data.map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end)
        }));
        setEvents(parsedEvents);
      }
    } catch (err) {
      console.error("Takvim yükleme hatası:", err);
    }
  };

  // --- Yeni Etkinlik Ekle ---
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
        alert("Lütfen başlık, başlangıç ve bitiş tarihlerini giriniz.");
        return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/calendar`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newEvent)
      });
      
      if (res.ok) {
        await fetchEvents(); // Listeyi güncelle
        setShowModal(false);
        setNewEvent({ title: '', start: '', end: '', desc: '', color: '#3b82f6' });
      } else {
        alert("Kaydedilemedi.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Etkinlik Sil ---
  const handleDeleteEvent = async (event) => {
    if (window.confirm(`"${event.title}" etkinliğini silmek istiyor musunuz?`)) {
        try {
            await fetch(`${BASE_URL}/calendar/${event._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Listeden çıkart (tekrar fetch etmeye gerek yok, daha hızlı)
            setEvents(events.filter(e => e._id !== event._id));
        } catch (err) {
            console.error(err);
        }
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* BAŞLIK ALANI */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-[#0f172a] font-serif flex items-center gap-2">
             <CalendarIcon className="text-blue-600" /> Takvim & Ajanda
           </h1>
           <p className="text-slate-500 text-sm mt-1">Müşteri randevularını ve özel notlarını buradan yönet.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-[#001F54] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-900 transition-all hover:scale-105"
        >
          <Plus size={20} /> Yeni Ekle
        </button>
      </div>

      {/* TAKVİM ALANI */}
      <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', fontFamily: 'Inter, sans-serif' }}
          culture='tr'
          messages={{ 
              next: "İleri", 
              previous: "Geri", 
              today: "Bugün", 
              month: "Ay", 
              week: "Hafta", 
              day: "Gün", 
              agenda: "Ajanda",
              date: "Tarih",
              time: "Saat",
              event: "Etkinlik",
              noEventsInRange: "Bu aralıkta etkinlik yok."
          }}
          eventPropGetter={(event) => ({
            style: { 
                backgroundColor: event.color, 
                borderRadius: '6px', 
                border: 'none',
                fontSize: '13px',
                fontWeight: '500',
                padding: '2px 5px'
            }
          })}
          onSelectEvent={handleDeleteEvent} // Tıklayınca silme sorar
        />
      </div>

      {/* MODAL (POPUP) */}
      <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{scale: 0.9, opacity: 0, y: 20}} 
            animate={{scale: 1, opacity: 1, y: 0}} 
            exit={{scale: 0.9, opacity: 0}}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-xl text-[#001F54] flex items-center gap-2">
                <Plus size={20} /> Etkinlik Oluştur
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-red-50 rounded-full group transition-colors">
                <X size={20} className="text-slate-400 group-hover:text-red-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Başlık */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Etkinlik Başlığı</label>
                <input 
                  type="text" 
                  placeholder="Örn: Müşteri Ahmet Bey ile Toplantı" 
                  className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                  value={newEvent.title} 
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                />
              </div>

              {/* Tarih Seçimi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Clock size={12}/> Başlangıç</label>
                    <input 
                      type="datetime-local" 
                      className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      value={newEvent.start} 
                      onChange={e => setNewEvent({...newEvent, start: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><Clock size={12}/> Bitiş</label>
                    <input 
                      type="datetime-local" 
                      className="w-full border border-slate-200 bg-slate-50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                      value={newEvent.end} 
                      onChange={e => setNewEvent({...newEvent, end: e.target.value})} 
                    />
                </div>
              </div>
              
              {/* Renk Seçimi */}
              <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Etiket Rengi</label>
                 <div className="flex gap-3">
                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                        <button 
                           key={color}
                           onClick={() => setNewEvent({...newEvent, color})}
                           className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newEvent.color === color ? 'border-slate-600 scale-110' : 'border-transparent'}`}
                           style={{ backgroundColor: color }}
                        />
                    ))}
                 </div>
              </div>

              {/* Açıklama */}
              <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1"><AlignLeft size={12}/> Notlar</label>
                 <textarea 
                   placeholder="Detaylar, notlar veya adres..." 
                   className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24 text-sm resize-none" 
                   value={newEvent.desc} 
                   onChange={e => setNewEvent({...newEvent, desc: e.target.value})}
                 ></textarea>
              </div>

              {/* Buton */}
              <button 
                onClick={handleAddEvent} 
                disabled={loading}
                className="w-full bg-[#001F54] text-white py-3.5 rounded-xl font-bold hover:bg-[#0f172a] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Etkinliği Kaydet'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarPage;