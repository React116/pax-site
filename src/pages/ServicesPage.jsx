import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, Loader2, PackageOpen } from 'lucide-react';
import { api } from '../services/api';

const CURRENCIES = ['TRY', 'USD', 'EUR', 'GBP'];

const emptyForm = { name: '', description: '', durationMinutes: 60, price: '', currency: 'TRY' };

const ServiceForm = ({ initial = emptyForm, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Hizmet Adı *</label>
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="ör: Reformer Pilates"
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Açıklama</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Kısa hizmet açıklaması..."
            rows={2}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Süre (dakika)</label>
          <input
            type="number"
            min={1}
            value={form.durationMinutes}
            onChange={e => set('durationMinutes', e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Fiyat</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="0"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="w-24">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Para Birimi</label>
            <select
              value={form.currency}
              onChange={e => set('currency', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
            >
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
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

const ServicesPage = () => {
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
      const data = await api.get('/services');
      setServices(data);
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
      const created = await api.post('/services', form);
      setServices(prev => [...prev, created]);
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
      const updated = await api.put(`/services/${editingId}`, form);
      setServices(prev => prev.map(s => s._id === editingId ? updated : s));
      setEditingId(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (service) => {
    try {
      const updated = await api.put(`/services/${service._id}`, { isActive: !service.isActive });
      setServices(prev => prev.map(s => s._id === service._id ? updated : s));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#001F54] font-serif">Hizmetler</h1>
          <p className="text-slate-500 text-sm mt-1">İşletmenizin sunduğu hizmetleri yönetin.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="flex items-center gap-2 bg-[#001F54] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Plus size={16} /> Yeni Hizmet
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

      {/* Yeni hizmet formu */}
      {showForm && !editingId && (
        <ServiceForm onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      )}

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : services.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <PackageOpen size={48} className="mb-4 opacity-40" />
          <p className="font-medium">Henüz hizmet eklenmemiş.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 font-medium text-sm hover:underline">
            İlk hizmeti ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map(service => (
            <div key={service._id}>
              {editingId === service._id ? (
                <ServiceForm
                  initial={{ name: service.name, description: service.description, durationMinutes: service.durationMinutes, price: service.price, currency: service.currency }}
                  onSave={handleUpdate}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              ) : (
                <div className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col gap-3 transition-all ${service.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{service.name}</h3>
                      {service.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{service.description}</p>}
                    </div>
                    <button
                      onClick={() => toggleActive(service)}
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {service.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">{service.durationMinutes} dk</span>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold">
                      {service.price > 0 ? `${service.price} ${service.currency}` : 'Ücretsiz'}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => { setEditingId(service._id); setShowForm(false); }}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
                    >
                      <Pencil size={13} /> Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      disabled={deletingId === service._id}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors font-medium ml-auto"
                    >
                      {deletingId === service._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
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

export default ServicesPage;
