import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar as CalIcon, Search, Filter, 
  ChevronLeft, ChevronRight, Clock, User, 
  MapPin, CheckCircle2, AlertCircle, Zap, 
  MoreHorizontal, X, LayoutGrid, List
} from 'lucide-react';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// --- AYARLAR & LOCALIZER ---
const locales = { 'tr': tr };
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

// --- DERS TİPLERİ & RENK PALETİ (Premium Pastel) ---
const EVENT_TYPES = {
  private: { label: 'Özel Ders', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  reformer: { label: 'Reformer', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  yoga: { label: 'Yoga', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  group: { label: 'Grup Ders', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  online: { label: 'Online', color: 'bg-slate-100 text-slate-700 border-slate-200' }
};

const CalendarPage = () => {
  // --- STATE ---
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  
  // Filtreler
  const [filterType, setFilterType] = useState('all');

  const BASE_URL = import.meta.env.VITE_API_URL || "https://pax-backend-9m4q.onrender.com/api";
  const token = localStorage.getItem('token');

  // --- VERİ ÇEKME (MOCK DATA İLE BAŞLANGIÇ) ---
  // Backend tam hazır olana kadar UI'ı göstermek için sahte veri de ekliyorum.
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
        const parsedEvents = data.map(ev => ({
          ...ev,
          id: ev._id,
          start: new Date(ev.start),
          end: new Date(ev.end),
          // Backend'de henüz olmayan alanlar için varsayılanlar (UI testi için)
          type: ev.color === '#8b5cf6' ? 'private' : 'reformer', 
          clientName: ev.title.split(' - ')[0] || 'Müşteri',
          instructor: 'Buse Hoca',
          room: 'Salon A',
          status: 'confirmed'
        }));
        setEvents(parsedEvents);
      }
    } catch (err) { console.error(err); }
  };

  // --- DRAG & DROP İŞLEMLERİ ---
  const onEventDrop = ({ event, start, end }) => {
    const updatedEvents = events.map(existing => 
      existing.id === event.id ? { ...existing, start, end } : existing
    );
    setEvents(updatedEvents);
    // Backend Update İsteği Burada Atılacak
    // updateBackend(event.id, { start, end });
  };

  const onEventResize = ({ event, start, end }) => {
    const updatedEvents = events.map(existing => 
      existing.id === event.id ? { ...existing, start, end } : existing
    );
    setEvents(updatedEvents);
  };

  // --- ÖZEL COMPONENTLER ---
  
  // 1. Özel Takvim Hücresi (Event Component)
  const CustomEvent = ({ event }) => {
    const style = EVENT_TYPES[event.type || 'reformer'];
    return (
      <div className={`h-full w-full px-2 py-1 rounded-md border-l-4 text-xs font-medium leading-tight shadow-sm transition-all hover:brightness-95 ${style.color} ${style.border}`}>
        <div className="font-bold truncate">{event.title}</div>
        <div className="text-[10px] opacity-80 truncate">{format(event.start, 'HH:mm')} • {event.room}</div>
      </div>
    );
  };

  // 2. Özel Toolbar (Header)
  const CustomToolbar = (toolbar) => {
    const goToBack = () => { toolbar.onNavigate('PREV'); setDate(toolbar.date); };
    const goToNext = () => { toolbar.onNavigate('NEXT'); setDate(toolbar.date); };
    const goToCurrent = () => { toolbar.onNavigate('TODAY'); setDate(new Date()); };

    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Sol: Tarih Navigasyonu */}
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
           <button onClick={goToBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronLeft size={18}/></button>
           <span className="text-sm font-bold text-slate-700 min-w-[140px] text-center select-none cursor-pointer" onClick={goToCurrent}>
             {format(toolbar.date, 'MMMM yyyy', { locale: tr }).toUpperCase()}
           </span>
           <button onClick={goToNext} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronRight size={18}/></button>
        </div>

        {/* Orta: Görünüm Değiştirici (Segmented Control) */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
           {['month', 'week', 'day'].map((v) => (
             <button 
               key={v}
               onClick={() => { setView(v); toolbar.onView(v); }}
               className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === v ? 'bg-white text-[#001F54] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {v === 'month' ? 'Ay' : v === 'week' ? 'Hafta' : 'Gün'}
             </button>
           ))}
        </div>

        {/* Sağ: Aksiyonlar */}
        <div className="flex gap-2">
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#001F54] shadow-sm"><Filter size={18}/></button>
           <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#001F54] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-[#0f172a] transition-transform active:scale-95">
             <Plus size={18} /> <span className="hidden md:inline">Yeni Randevu</span>
           </button>
        </div>
      </div>
    );
  };

  // --- RENDER ---
  return (
    <div className="h-[calc(100vh-40px)] flex gap-6 overflow-hidden">
      
      {/* SOL: TAKVİM ALANI */}
      <div className="flex-1 flex flex-col h-full">
        {/* Üst Bilgi Barı (AI Insight) */}
        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-4 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between px-4">
           <div className="flex items-center gap-2 text-sm text-[#001F54]">
             <Zap size={16} className="text-amber-500 fill-amber-500" /> 
             <span className="font-bold">AI Analizi:</span> 
             <span className="opacity-80">Bu hafta doluluk oranınız %78. Salı 14:00-16:00 arası boşluk var, kampanya çıkılabilir.</span>
           </div>
           <button className="text-xs font-bold text-blue-600 hover:underline">Detaylar</button>
        </motion.div>

        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            date={date}
            onNavigate={setDate}
            onView={setView}
            selectable
            resizable
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            onSelectEvent={(event) => setSelectedEvent(event)}
            components={{
              toolbar: CustomToolbar,
              event: CustomEvent
            }}
            culture='tr'
            messages={{ next: "İleri", previous: "Geri", today: "Bugün", month: "Ay", week: "Hafta", day: "Gün" }}
            className="modern-calendar"
          />
        </div>
      </div>

      {/* SAĞ: AKILLI PANEL (Smart Panel) */}
      <div className="w-80 hidden xl:flex flex-col gap-4 h-full overflow-y-auto pb-4">
        
        {/* 1. SEÇİLİ ETKİNLİK DETAYI (Veya Boş Durum) */}
        <AnimatePresence mode="wait">
        {selectedEvent ? (
          <motion.div 
            key="event-detail"
            initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 20}}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${EVENT_TYPES[selectedEvent.type || 'private'].color}`}>
                 {EVENT_TYPES[selectedEvent.type || 'private'].label}
               </span>
               <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
            </div>
            
            <h2 className="text-xl font-bold text-[#0f172a] mb-1 font-serif">{selectedEvent.title}</h2>
            <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedEvent.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              {selectedEvent.status === 'confirmed' ? 'Onaylandı' : 'Bekliyor'}
            </div>

            <div className="space-y-4">
               <InfoRow icon={Clock} label="Zaman" value={`${format(selectedEvent.start, 'HH:mm')} - ${format(selectedEvent.end, 'HH:mm')}`} />
               <InfoRow icon={User} label="Eğitmen" value={selectedEvent.instructor || 'Atanmadı'} />
               <InfoRow icon={MapPin} label="Salon" value={selectedEvent.room || 'Ana Salon'} />
               
               <div className="pt-4 border-t border-slate-100">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Müşteri Notları</div>
                 <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                   Bel fıtığı geçmişi var, zorlayıcı hareketlerden kaçınılmalı.
                 </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
               <button className="py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">Düzenle</button>
               <button className="py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100">İptal Et</button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
             key="empty-state"
             initial={{opacity: 0}} animate={{opacity: 1}}
             className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center py-12"
          >
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <LayoutGrid className="text-slate-400" />
             </div>
             <h3 className="font-bold text-slate-700">Etkinlik Seçilmedi</h3>
             <p className="text-xs text-slate-500 mt-2">Detayları görmek için takvimden bir randevuya tıklayın.</p>
          </motion.div>
        )}
        </AnimatePresence>

        {/* 2. EĞİTMEN DURUMU (Küçük Liste) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex-1">
           <h3 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2 text-sm">
             <User size={16} /> Eğitmen Durumu
           </h3>
           <div className="space-y-3">
              <InstructorStatus name="Buse Hoca" status="busy" task="Ders: Reformer" />
              <InstructorStatus name="Ahmet Hoca" status="available" task="Müsait" />
              <InstructorStatus name="Selin Hoca" status="break" task="Mola" />
           </div>
        </div>

      </div>

      {/* MODAL (Basitleştirilmiş) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
           <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md">
              <div className="flex justify-between mb-4">
                 <h3 className="font-bold text-lg text-[#001F54]">Hızlı Randevu</h3>
                 <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400"/></button>
              </div>
              <p className="text-sm text-slate-500 mb-4">Detaylı form buraya gelecek. Şimdilik demo.</p>
              <button onClick={() => setShowModal(false)} className="w-full bg-[#001F54] text-white py-3 rounded-xl font-bold">Tamam</button>
           </motion.div>
        </div>
      )}
      
      {/* CSS OVERRIDES (Apple Style Calendar) */}
      <style>{`
        .modern-calendar .rbc-header {
          padding: 12px 0;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          border-bottom: 1px solid #f1f5f9;
        }
        .modern-calendar .rbc-day-bg { border-left: 1px solid #f8fafc; }
        .modern-calendar .rbc-off-range-bg { background: #f8fafc; }
        .modern-calendar .rbc-today { background: #eff6ff; }
        .modern-calendar .rbc-time-content { border-top: 1px solid #f1f5f9; }
        .modern-calendar .rbc-time-view .rbc-row { min-height: 20px; }
        .rbc-event { 
            background: transparent !important; 
            padding: 0 !important; 
            border: none !important;
            outline: none !important;
        }
        .rbc-event:focus { outline: none; }
      `}</style>

    </div>
  );
};

// --- YARDIMCI BİLEŞENLER ---

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
       <Icon size={14} />
     </div>
     <div>
       <div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div>
       <div className="text-sm font-bold text-slate-700">{value}</div>
     </div>
  </div>
);

const InstructorStatus = ({ name, status, task }) => (
  <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
     <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'busy' ? 'bg-red-500' : status === 'available' ? 'bg-green-500' : 'bg-amber-400'}`}></div>
        <div className="text-sm font-bold text-slate-700">{name}</div>
     </div>
     <div className="text-xs text-slate-500">{task}</div>
  </div>
);

export default CalendarPage;