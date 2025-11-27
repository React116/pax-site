import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, Navigate } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Filter, ChevronLeft, ChevronRight, Clock, User, 
  MapPin, X, LayoutGrid, Trash2, Edit2, 
  AlertTriangle, Check, Zap, CalendarDays
} from 'lucide-react';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = { 'tr': tr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const DnDCalendar = withDragAndDrop(Calendar);

// Renkler ve stiller
const EVENT_TYPES = {
  private: { label: 'Özel Ders', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  reformer: { label: 'Reformer', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  yoga: { label: 'Yoga', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  group: { label: 'Grup Ders', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  online: { label: 'Online', color: 'bg-slate-100 text-slate-800 border-slate-300' }
};

const CalendarPage = () => {
  // --- STATE ---
  const [events, setEvents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.WEEK); // Haftalık daha detaylı görünür
  const [date, setDate] = useState(new Date());
  
  // UI States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dragConfirm, setDragConfirm] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
     id: null, title: '', start: '', end: '', type: 'private', 
     instructor: '', room: 'Ana Salon', desc: '', status: 'confirmed'
  });

  const [filterType, setFilterType] = useState('all');
  
  const BASE_URL = import.meta.env.VITE_API_URL || "https://pax-backend-9m4q.onrender.com/api";
  const token = localStorage.getItem('token');

  // --- 1. VERİLERİ ÇEK ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!token) return;
    try {
      const [calRes, profileRes] = await Promise.all([
        fetch(`${BASE_URL}/calendar`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${BASE_URL}/business-profile`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (calRes.ok) {
        const data = await calRes.json();
        const parsed = data.map(ev => ({
          ...ev,
          id: ev._id, 
          start: new Date(ev.start),
          end: new Date(ev.end),
        }));
        setEvents(parsed);
      }

      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile.instructors && profile.instructors.length > 0) {
            setInstructors(profile.instructors);
        } else {
            setInstructors([{ name: 'Genel Eğitmen' }]);
        }
      }
    } catch (err) { console.error("Veri hatası:", err); }
  };

  // --- 2. NAVİGASYON ---
  const handleNavigate = useCallback((newDate) => setDate(newDate), []);
  const handleViewChange = useCallback((newView) => setView(newView), []);

  // --- 3. SÜRÜKLE & BIRAK ---
  const onEventDropRequest = ({ event, start, end }) => {
    setDragConfirm({ event, start, end });
  };

  const confirmEventDrop = async () => {
    if (!dragConfirm) return;
    const { event, start, end } = dragConfirm;
    const newStart = new Date(start);
    const newEnd = new Date(end);
    
    const updatedEvent = { ...event, start: newStart, end: newEnd };
    setEvents(prevEvents => prevEvents.map(e => e.id === event.id ? updatedEvent : e));

    if (selectedEvent && selectedEvent.id === event.id) {
        setSelectedEvent(updatedEvent);
    }

    try {
      await fetch(`${BASE_URL}/calendar/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ start: newStart, end: newEnd })
      });
    } catch (err) { console.error("Drop hatası:", err); fetchData(); }

    setDragConfirm(null);
  };

  const cancelEventDrop = () => setDragConfirm(null);

  // --- 4. KAYDETME ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.start || !formData.end) return alert("Zorunlu alanları doldurun.");

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode ? `${BASE_URL}/calendar/${formData.id}` : `${BASE_URL}/calendar`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchData();
        setShowModal(false);
        resetForm();
      } else { alert("İşlem başarısız."); }
    } catch (err) { console.error(err); }
  };

  // --- 5. SİLME ---
  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
        await fetch(`${BASE_URL}/calendar/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setEvents(prev => prev.filter(e => e.id !== id));
        setSelectedEvent(null);
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', start: '', end: '', type: 'private', instructor: '', room: 'Ana Salon', desc: '', status: 'confirmed' });
    setIsEditMode(false);
  };

  const openNewModal = () => {
    resetForm();
    const now = new Date();
    now.setMinutes(now.getMinutes() > 30 ? 60 : 30);
    now.setSeconds(0);
    const oneHourLater = new Date(now.getTime() + 60*60*1000);
    const toLocalISO = (d) => {
       const offset = d.getTimezoneOffset() * 60000;
       return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };
    setFormData(prev => ({ ...prev, start: toLocalISO(now), end: toLocalISO(oneHourLater) }));
    setShowModal(true);
  };

  const openEditModal = (event) => {
    const toLocalISO = (d) => d ? new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';
    setFormData({
        id: event.id, title: event.title, start: toLocalISO(event.start), end: toLocalISO(event.end),
        type: event.type || 'private', instructor: event.instructor || '', room: event.room || 'Ana Salon',
        desc: event.desc || '', status: event.status || 'confirmed'
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return events;
    return events.filter(e => e.type === filterType);
  }, [events, filterType]);

  const CustomToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate(Navigate.PREVIOUS);
    const goToNext = () => toolbar.onNavigate(Navigate.NEXT);
    const goToCurrent = () => toolbar.onNavigate(Navigate.TODAY);
    const label = () => (
        <span className="text-sm font-bold text-slate-700 min-w-[140px] text-center select-none cursor-pointer" onClick={goToCurrent}>
          {format(toolbar.date, view === 'day' ? 'd MMMM yyyy' : 'MMMM yyyy', { locale: tr }).toUpperCase()}
        </span>
    );

    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
           <button onClick={goToBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronLeft size={18}/></button>
           {label()}
           <button onClick={goToNext} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronRight size={18}/></button>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
           {['month', 'week', 'day'].map((v) => (
             <button key={v} onClick={() => toolbar.onView(v)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${toolbar.view === v ? 'bg-white text-[#001F54] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
               {v === 'month' ? 'Ay' : v === 'week' ? 'Hafta' : 'Gün'}
             </button>
           ))}
        </div>
        <div className="flex gap-2 items-center relative z-20">
            <div className="relative">
                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-2 p-2.5 border rounded-xl text-xs font-bold shadow-sm transition-all ${isFilterOpen ? 'bg-slate-50 border-slate-300 text-[#001F54]' : 'bg-white border-slate-200 text-slate-500'}`}>
                    <Filter size={16}/> {filterType === 'all' ? 'Filtrele' : EVENT_TYPES[filterType]?.label}
                </button>
                {isFilterOpen && (
                    <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in-up">
                        <button onClick={() => { setFilterType('all'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-3 text-xs hover:bg-slate-50 font-bold border-b border-slate-50">Tümünü Göster</button>
                        {Object.keys(EVENT_TYPES).map(type => (
                            <button key={type} onClick={() => { setFilterType(type); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${EVENT_TYPES[type].color.split(' ')[0].replace('text', 'bg').replace('border', 'bg')}`}></span>
                                {EVENT_TYPES[type].label}
                            </button>
                        ))}
                    </div>
                    </>
                )}
            </div>
            <button onClick={openNewModal} className="flex items-center gap-2 bg-[#001F54] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-[#0f172a] active:scale-95 transition-all">
                <Plus size={18} /> <span className="hidden md:inline">Yeni Randevu</span>
            </button>
        </div>
      </div>
    );
  };

  // --- GÖRSEL İYİLEŞTİRİLMİŞ EVENT KARTI ---
  const CustomEvent = ({ event }) => {
    const style = EVENT_TYPES[event.type || 'private'] || EVENT_TYPES.private;
    return (
      <div className={`h-full w-full px-2 py-1 rounded-md border-l-4 shadow-sm flex flex-col justify-start overflow-hidden transition-all hover:brightness-95 ${style.color} ${style.border}`}>
        
        {/* Üst Satır: Saat ve Salon */}
        <div className="flex justify-between items-center text-[10px] opacity-80 mb-0.5 font-medium">
           <span>{format(event.start, 'HH:mm')}</span>
           <span className="truncate max-w-[50px] hidden sm:inline">{event.room}</span>
        </div>

        {/* Başlık: Müşteri Adı (Kalın ve Okunaklı) */}
        <div className="font-bold text-xs leading-tight line-clamp-2 break-words mb-auto">
            {event.title}
        </div>

        {/* Alt: Eğitmen */}
        <div className="text-[9px] opacity-90 mt-1 flex items-center gap-1 truncate">
           <User size={10} className="shrink-0" /> {event.instructor}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-40px)] flex gap-6 overflow-hidden relative">
      
      <div className="flex-1 flex flex-col h-full relative z-0">
        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-4 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between px-4">
           <div className="flex items-center gap-2 text-sm text-[#001F54]">
             <Zap size={16} className="text-amber-500 fill-amber-500" /> 
             <span className="font-bold">AI Asistanı:</span> 
             <span className="opacity-80">
                {events.length === 0 ? "Henüz randevu yok." : `Bu hafta ${events.length} randevunuz var. Doluluk oranı %${Math.min(events.length * 2, 100)}.`}
             </span>
           </div>
        </motion.div>

        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
          <DnDCalendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            date={date}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            selectable
            resizable
            onEventDrop={onEventDropRequest} 
            onEventResize={onEventDropRequest} 
            onSelectEvent={(event) => setSelectedEvent(event)}
            components={{ toolbar: CustomToolbar, event: CustomEvent }}
            culture='tr'
            messages={{ next: "İleri", previous: "Geri", today: "Bugün", month: "Ay", week: "Hafta", day: "Gün" }}
            className="modern-calendar"
          />
        </div>
      </div>

      <div className="w-80 hidden xl:flex flex-col gap-4 h-full overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
        {selectedEvent ? (
          <motion.div 
            key={selectedEvent.id}
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
              {selectedEvent.status === 'confirmed' ? 'Onaylandı' : 'Beklemede'}
            </div>

            <div className="space-y-4">
               <InfoRow icon={CalendarDays} label="Tarih" value={format(new Date(selectedEvent.start), 'd MMMM yyyy', { locale: tr })} />
               <InfoRow icon={Clock} label="Saat" value={`${format(new Date(selectedEvent.start), 'HH:mm')} - ${format(new Date(selectedEvent.end), 'HH:mm')}`} />
               <InfoRow icon={User} label="Eğitmen" value={selectedEvent.instructor || 'Atanmadı'} />
               <InfoRow icon={MapPin} label="Salon" value={selectedEvent.room || 'Ana Salon'} />
               {selectedEvent.desc && (
                <div className="pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notlar</div>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">{selectedEvent.desc}</p>
                </div>
               )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
               <button onClick={() => openEditModal(selectedEvent)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors">
                  <Edit2 size={14}/> Düzenle
               </button>
               <button onClick={() => handleDelete(selectedEvent.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-colors">
                  <Trash2 size={14}/> İptal Et
               </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center py-12">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><LayoutGrid className="text-slate-400" /></div>
             <h3 className="font-bold text-slate-700">Etkinlik Seçilmedi</h3>
             <p className="text-xs text-slate-500 mt-2">Detayları görmek için takvimden bir randevuya tıklayın.</p>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* --- MODAL: ONAY PENCERESİ (CONFIRMATION) --- */}
      {dragConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{scale: 0.9, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-slate-200 text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-2">Zaman Değişikliği</h3>
                <p className="text-sm text-slate-500 mb-6">
                    <span className="font-bold text-slate-800">{dragConfirm.event.title}</span> randevusunu şu zamana taşımak üzeresiniz: <br/>
                    <span className="font-bold text-[#001F54] mt-2 block bg-blue-50 py-1 rounded">
                        {format(dragConfirm.start, 'd MMMM HH:mm', { locale: tr })} - {format(dragConfirm.end, 'HH:mm')}
                    </span>
                    <br/>Bu işlemi onaylıyor musunuz?
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={cancelEventDrop} className="py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">İptal</button>
                    <button onClick={confirmEventDrop} className="py-3 rounded-xl bg-[#001F54] text-white font-bold hover:bg-[#0f172a] flex items-center justify-center gap-2">
                        <Check size={18}/> Onayla
                    </button>
                </div>
            </motion.div>
        </div>
      )}

      {/* --- MODAL: YENİ/DÜZENLE --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
           <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white p-0 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-lg text-[#001F54]">{isEditMode ? 'Randevuyu Düzenle' : 'Yeni Randevu Oluştur'}</h3>
                 <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Müşteri Adı</label>
                    <input required type="text" placeholder="Örn: Ayşe Yılmaz" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"/>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Hizmet Tipi</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                            {Object.keys(EVENT_TYPES).map(key => <option key={key} value={key}>{EVENT_TYPES[key].label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Eğitmen</label>
                        <select value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                            <option value="">Seçiniz</option>
                            {instructors.map((inst, i) => <option key={i} value={inst.name}>{inst.name}</option>)}
                        </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Başlangıç</label>
                        <input required type="datetime-local" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Bitiş</label>
                        <input required type="datetime-local" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm"/>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Notlar</label>
                    <textarea placeholder="Sağlık durumu, özel istekler..." value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm h-20 resize-none"></textarea>
                 </div>

                 <div className="pt-2">
                    <button type="submit" className="w-full bg-[#001F54] text-white py-3.5 rounded-xl font-bold hover:bg-[#0f172a] shadow-lg transition-all">
                        {isEditMode ? 'Değişiklikleri Kaydet' : 'Randevuyu Oluştur'}
                    </button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}

      <style>{`
        .modern-calendar .rbc-header { padding: 12px 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        .modern-calendar .rbc-day-bg { border-left: 1px solid #f8fafc; }
        .modern-calendar .rbc-off-range-bg { background: #f8fafc; }
        .modern-calendar .rbc-today { background: #eff6ff; }
        .modern-calendar .rbc-time-content { border-top: 1px solid #f1f5f9; }
        .rbc-event { background: transparent !important; padding: 0 !important; border: none !important; outline: none !important; }
      `}</style>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Icon size={14} /></div>
     <div><div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div><div className="text-sm font-bold text-slate-700">{value}</div></div>
  </div>
);

export default CalendarPage;