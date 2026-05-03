import React, { useState, useEffect, useCallback } from 'react';
import { Users, RefreshCw, ChevronLeft, ChevronRight, Search, Filter, TrendingUp, Inbox } from 'lucide-react';

const STATUS_CONFIG = {
  new:       { label: 'Yeni',       color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'İletişime Geçildi', color: 'bg-amber-100 text-amber-700' },
  converted: { label: 'Dönüştürüldü', color: 'bg-green-100 text-green-700' },
  lost:      { label: 'Kaybedildi', color: 'bg-red-100 text-red-700' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

const fmt = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const LeadsPage = () => {
  const [leads, setLeads]       = useState([]);
  const [stats, setStats]       = useState({ total: 0, byStatus: [] });
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch]     = useState('');

  const token = localStorage.getItem('token');
  const API   = import.meta.env.VITE_API_URL || 'https://pax-backend-9m4q.onrender.com/api';

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (statusFilter) params.set('status', statusFilter);

      const [leadsRes, statsRes] = await Promise.all([
        fetch(`${API}/leads?${params}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/leads/stats`,     { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads);
        setTotal(data.total);
        setPages(data.pages);
      }
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [page, statusFilter, token, API]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Client-side search filter
  const filtered = search.trim()
    ? leads.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search)
      )
    : leads;

  const statCount = (key) => stats.byStatus.find(s => s._id === key)?.count || 0;

  return (
    <div className="space-y-6">
      {/* BAŞLIK */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#001F54]">Lead Yönetimi</h1>
          <p className="text-slate-500 mt-1 text-sm">Formdan gelen tüm talepler</p>
        </div>
        <button onClick={fetchLeads} className="flex items-center gap-2 text-slate-500 hover:text-[#001F54] text-sm font-semibold transition-colors">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Yenile
        </button>
      </div>

      {/* STAT KARTLARI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'total', label: 'Toplam Lead', value: stats.total, color: 'text-[#001F54]', bg: 'bg-blue-50', icon: <Users size={18} className="text-blue-500" /> },
          { key: 'new',       label: 'Yeni',       value: statCount('new'),       color: 'text-blue-700',  bg: 'bg-blue-50',  icon: <Inbox size={18} className="text-blue-500" /> },
          { key: 'converted', label: 'Dönüştürüldü', value: statCount('converted'), color: 'text-green-700', bg: 'bg-green-50', icon: <TrendingUp size={18} className="text-green-500" /> },
          { key: 'contacted', label: 'İletişimde', value: statCount('contacted'), color: 'text-amber-700', bg: 'bg-amber-50', icon: <Filter size={18} className="text-amber-500" /> },
        ].map(s => (
          <div key={s.key} className={`${s.bg} rounded-2xl p-5 border border-white`}>
            <div className="flex items-center justify-between mb-3">
              {s.icon}
              <span className="text-xs text-slate-400 font-semibold">{s.label}</span>
            </div>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* TABLO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="İsim, e-posta veya telefon ara..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white text-slate-600 font-medium"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <RefreshCw size={24} className="animate-spin mr-3" /> Yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Inbox size={40} className="mb-3 text-slate-300" />
            <p className="font-semibold">Henüz lead yok</p>
            <p className="text-sm mt-1">İletişim formu doldurulduğunda burada görünecek.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Ad / Firma</th>
                  <th className="px-5 py-3 hidden md:table-cell">İletişim</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Sektör</th>
                  <th className="px-5 py-3">Durum</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Kaynak</th>
                  <th className="px-5 py-3 hidden md:table-cell">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(lead => (
                  <tr key={lead._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{lead.name}</div>
                      {lead.wantsWhatsApp && (
                        <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">WA İstiyor</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="text-slate-600">{lead.email}</div>
                      <div className="text-slate-400 text-xs">{lead.phone}</div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-slate-500">{lead.sector || '—'}</td>
                    <td className="px-5 py-4"><StatusBadge status={lead.status} /></td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="text-slate-500 text-xs">{lead.utmSource || lead.source || 'website'}</div>
                      {lead.utmCampaign && <div className="text-slate-400 text-[10px]">{lead.utmCampaign}</div>}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-slate-400 text-xs">{fmt(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">{total} lead, sayfa {page}/{pages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
