import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2, X, Check, CalendarCheck, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { api } from '../services/api';

const STATUS_CONFIG = {
  pending:   { label: 'Bekliyor',   color: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Onaylandı',  color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'İptal',      color: 'bg-red-100 text-red-700' },
};

const STATUSES = Object.keys(STATUS_CONFIG);

const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtTime = (d) => new Date(d).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>;
};

// --- FORM ---
const AppointmentForm = ({ services, staff, onSave, onCancel, saving }) => {
  const [form, setForm] = useState({
    customerName: '', phone: '', email: '',
    serviceId: '', staffId: '', startTime: '', notes: '',
  });
  const [slots, setSlots]     = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const loadSlots = useCallback(async (date, serviceId, staffId) => {
    if (!date) return;
    setLoadingSlots(true);
    setSlots([]);
    try {
      const params = new URLSearchParams({ date });
      if (serviceId) params.set('serviceId', serviceId);
      if (staffId)   params.set('staffId', staffId);
      const data = await api.get(`/appointments/availability?${params}`);
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    set('startTime', '');
    loadSlots(date, form.serviceId, form.staffId);
  };

  const handleServiceChange = (serviceId) => {
    set('serviceId', serviceId);
    set('startTime', '');
    if (selectedDate) loadSlots(selectedDate, serviceId, form.staffId);
  };

  const handleStaffChange = (staffId) => {
    set('staffId', staffId);
    set('startTime', '');
    if (selectedDate) loadSlots(selectedDate, form.serviceId, staffId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4">
      <h3 className="font-bold text-[#001F54] text-sm">Yeni Randevu</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Müşteri Adı *</label>
          <input value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Ad Soyad" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Telefon</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+90 555 000 00 00" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Hizmet</label>
          <select value={form.serviceId} onChange={e => handleServiceChange(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500">
            <option value="">— Seçiniz —</option>
            {services.map(s => <option key={s._id} value={s._id}>{s.name} ({s.durationMinutes} dk)</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Personel</label>
          <select value={form.staffId} onChange={e => handleStaffChange(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500">
            <option value="">— Seçiniz —</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.name}{s.role ? ` (${s.role})` : ''}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Tarih *</label>
          <input type="date" min={today} value={selectedDate} onChange={e => handleDateChange(e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Saat *</label>
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-sm text-slate-400 py-2.5"><Loader2 size={14} className="animate-spin" /> Müsait saatler yükleniyor...</div>
          ) : slots.length > 0 ? (
            <select value={form.startTime} onChange={e => set('startTime', e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500">
              <option value="">— Saat Seçiniz —</option>
              {slots.map((slot, i) => (
                <option key={i} value={slot.start}>{slot.startStr} – {slot.endStr}</option>
              ))}
            </select>
          ) : selectedDate ? (
            <div className="text-xs text-slate-400 py-2.5 px-1">Bu gün için müsait saat bulunamadı.</div>
          ) : (
            <input type="datetime-local" min={today} value={form.startTime} onChange={e => set('startTime', e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500" />
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Notlar</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 resize-none" />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <X size={15} /> İptal
        </button>
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001F54] text-white text-sm font-medium hover:bg-blue-900 disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Kaydet
        </button>
      </div>
    </form>
  );
};

// --- ANA SAYFA ---
const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (statusFilter) params.set('status', statusFilter);

      const [apptData, svcData, staffData] = await Promise.all([
        api.get(`/appointments?${params}`),
        api.get('/services'),
        api.get('/staff'),
      ]);
      setAppointments(apptData.appointments);
      setTotal(apptData.total);
      setPages(apptData.pages);
      setServices(svcData);
      setStaff(staffData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const created = await api.post('/appointments', form);
      setAppointments(prev => [created, ...prev]);
      setShowForm(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const updated = await api.put(`/appointments/${id}`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? updated : a));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#001F54] font-serif">Randevular</h1>
          <p className="text-slate-500 text-sm mt-1">Toplam {total} randevu</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#001F54] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors shadow-sm">
            <Plus size={16} /> Yeni Randevu
          </button>
        )}
      </div>

      {/* Hata */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          {error} <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      {/* Yeni randevu formu */}
      {showForm && (
        <AppointmentForm services={services} staff={staff} onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      )}

      {/* Filtreler */}
      <div className="flex flex-wrap gap-2">
        {['', ...STATUSES].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${statusFilter === s ? 'bg-[#001F54] text-white border-[#001F54]' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}>
            {s ? STATUS_CONFIG[s].label : 'Tümü'}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-blue-500" /></div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <CalendarCheck size={48} className="mb-4 opacity-40" />
          <p className="font-medium">Randevu bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map(appt => (
            <div key={appt._id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
              {/* Sol: tarih */}
              <div className="shrink-0 w-16 text-center bg-slate-50 rounded-xl p-2 border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase">{new Date(appt.startTime).toLocaleDateString('tr-TR', { month: 'short' })}</div>
                <div className="text-2xl font-bold text-[#001F54]">{new Date(appt.startTime).getDate()}</div>
                <div className="text-xs text-slate-500 font-medium">{fmtTime(appt.startTime)}</div>
              </div>

              {/* Orta: bilgiler */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-800">{appt.customerName}</span>
                  <StatusBadge status={appt.status} />
                  {appt.sourceChannel !== 'manual' && (
                    <span className="bg-violet-50 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">{appt.sourceChannel}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                  {appt.serviceId && <span>{appt.serviceId.name}</span>}
                  {appt.staffId   && <span>· {appt.staffId.name}</span>}
                  {appt.phone     && <span>· {appt.phone}</span>}
                </div>
                {appt.notes && <p className="text-xs text-slate-400 mt-1 truncate">{appt.notes}</p>}
              </div>

              {/* Sağ: aksiyonlar */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {appt.status === 'pending' && (
                  <button onClick={() => changeStatus(appt._id, 'confirmed')} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">Onayla</button>
                )}
                {appt.status === 'confirmed' && (
                  <button onClick={() => changeStatus(appt._id, 'completed')} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors">Tamamla</button>
                )}
                {(appt.status === 'pending' || appt.status === 'confirmed') && (
                  <button onClick={() => changeStatus(appt._id, 'cancelled')} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">İptal</button>
                )}
                <button onClick={() => handleDelete(appt._id)} disabled={deletingId === appt._id} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                  {deletingId === appt._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-slate-600 font-medium">{page} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
