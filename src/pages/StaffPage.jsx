import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, Loader2, Users } from 'lucide-react';
import { api } from '../services/api';

const emptyForm = { name: '', role: '', bio: '', phone: '' };

const StaffForm = ({ initial = emptyForm, services = [], onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleService = (id) => {
    const current = form.services || [];
    const exists = current.includes(id);
    set('services', exists ? current.filter(s => s !== id) : [...current, id]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Ad Soyad *</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="ör: Ayşe Yılmaz"
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Unvan / Rol</label>
          <input
            value={form.role}
            onChange={e => set('role', e.target.value)}
            placeholder="ör: Baş Eğitmen"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Telefon</label>
          <input
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="+90 555 000 00 00"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Biyografi</label>
          <textarea
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            placeholder="Kısa biyografi..."
            rows={2}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white resize-none"
          />
        </div>
        {services.length > 0 && (
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Verilen Hizmetler</label>
            <div className="flex flex-wrap gap-2">
              {services.map(s => {
                const active = (form.services || []).includes(s._id);
                return (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => toggleService(s._id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${active ? 'bg-[#001F54] text-white border-[#001F54]' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}
                  >
                    {active && <Check size={11} className="inline mr-1" />}{s.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <X size={15} /> İptal
        </button>
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001F54] text-white text-sm font-medium hover:bg-blue-900 transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Kaydet
        </button>
      </div>
    </form>
  );
};

const StaffPage = () => {
  const [staff, setStaff]       = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [staffData, serviceData] = await Promise.all([
        api.get('/staff'),
        api.get('/services'),
      ]);
      setStaff(staffData);
      setServices(serviceData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const created = await api.post('/staff', form);
      setStaff(prev => [...prev, created]);
      setShowForm(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      const updated = await api.put(`/staff/${editingId}`, form);
      setStaff(prev => prev.map(s => s._id === editingId ? updated : s));
      setEditingId(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu personeli silmek istediğinizden emin misiniz?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/staff/${id}`);
      setStaff(prev => prev.filter(s => s._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (member) => {
    try {
      const updated = await api.put(`/staff/${member._id}`, { isActive: !member.isActive });
      setStaff(prev => prev.map(s => s._id === member._id ? updated : s));
    } catch (e) {
      setError(e.message);
    }
  };

  const getInitialForm = (member) => ({
    name:     member.name,
    role:     member.role,
    bio:      member.bio,
    phone:    member.phone,
    services: (member.services || []).map(s => s._id || s),
  });

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#001F54] font-serif">Personel & Eğitmenler</h1>
          <p className="text-slate-500 text-sm mt-1">Ekibinizi ve uzmanlık alanlarını yönetin.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="flex items-center gap-2 bg-[#001F54] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Plus size={16} /> Yeni Personel
          </button>
        )}
      </div>

      {/* Hata */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      {/* Yeni personel formu */}
      {showForm && !editingId && (
        <StaffForm services={services} onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      )}

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : staff.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Users size={48} className="mb-4 opacity-40" />
          <p className="font-medium">Henüz personel eklenmemiş.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 font-medium text-sm hover:underline">
            İlk personeli ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {staff.map(member => (
            <div key={member._id}>
              {editingId === member._id ? (
                <StaffForm
                  initial={getInitialForm(member)}
                  services={services}
                  onSave={handleUpdate}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              ) : (
                <div className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col gap-3 transition-all ${member.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#001F54] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{member.name}</h3>
                        {member.role && <p className="text-xs text-slate-400">{member.role}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleActive(member)}
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {member.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                  </div>

                  {member.bio && <p className="text-xs text-slate-500 line-clamp-2">{member.bio}</p>}

                  {member.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {member.services.map(s => (
                        <span key={s._id || s} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {s.name || '—'}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => { setEditingId(member._id); setShowForm(false); }}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
                    >
                      <Pencil size={13} /> Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      disabled={deletingId === member._id}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors font-medium ml-auto"
                    >
                      {deletingId === member._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      Sil
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffPage;
