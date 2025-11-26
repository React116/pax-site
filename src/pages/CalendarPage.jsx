// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import tr from 'date-fns/locale/tr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const locales = {
  'tr': tr,
  'en-US': enUS,
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
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', desc: '' });
  
  // BURAYA KENDİ RENDER URL'Nİ YAZ
  const API_URL = `${import.meta.env.VITE_API_URL}/calendar`;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if(!token) return;
    try {
      const res = await fetch(`${API_URL}/calendar`, { headers: { 'x-auth-token': token } });
      if(res.ok) {
          const data = await res.json();
          const parsedEvents = data.map(ev => ({
            ...ev,
            start: new Date(ev.start),
            end: new Date(ev.end)
          }));
          setEvents(parsedEvents);
      }
    } catch(err) { console.error(err); }
  };

  const handleAddEvent = async () => {
    if(!newEvent.title || !newEvent.start || !newEvent.end) return;
    try {
      const res = await fetch(`${API_URL}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newEvent)
      });
      if(res.ok) {
        fetchEvents();
        setShowModal(false);
        setNewEvent({ title: '', start: '', end: '', desc: '' });
      }
    } catch(err) { console.error(err); }
  };

  const handleDeleteEvent = async (id) => {
    if(window.confirm('Bu etkinliği silmek istediğine emin misin?')) {
        try {
            await fetch(`${API_URL}/calendar/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            fetchEvents();
        } catch(err) { console.error(err); }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-[#0f172a] font-serif flex items-center gap-2"><CalendarIcon /> Takvim & Ajanda</h1>
           <p className="text-slate-500 text-sm">Randevularınızı ve notlarınızı buradan takip edin.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#001F54] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-900 transition-colors">
          <Plus size={18} /> Yeni Etkinlik
        </button>
      </div>

      <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden" style={{ minHeight: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture='tr'
          messages={{ next: "İleri", previous: "Geri", today: "Bugün", month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" }}
          eventPropGetter={(event) => ({
            style: { backgroundColor: event.color || '#3b82f6', borderRadius: '8px', border: 'none' }
          })}
          onSelectEvent={(event) => handleDeleteEvent(event._id)}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-[#001F54]">Yeni Etkinlik Ekle</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400 hover:text-red-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Başlık (Örn: Müşteri Toplantısı)" className="w-full border p-3 rounded-xl outline-none focus:border-blue-500" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500">Başlangıç</label><input type="datetime-local" className="w-full border p-2 rounded-xl text-sm" value={newEvent.start} onChange={e => setNewEvent({...newEvent, start: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-slate-500">Bitiş</label><input type="datetime-local" className="w-full border p-2 rounded-xl text-sm" value={newEvent.end} onChange={e => setNewEvent({...newEvent, end: e.target.value})} /></div>
              </div>
              <textarea placeholder="Notlar / Detaylar" className="w-full border p-3 rounded-xl outline-none focus:border-blue-500 h-24 text-sm" value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})}></textarea>
              <button onClick={handleAddEvent} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Kaydet</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;