import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, Send, Plus, X, Loader2, ChevronLeft, ChevronRight, ArrowLeft, Bot, User, Settings } from 'lucide-react';
import { api } from '../services/api';

// ─── Sabitler ───────────────────────────────────────────────
const CHANNEL_CONFIG = {
  whatsapp:  { label: 'WhatsApp',  color: 'bg-green-100 text-green-700' },
  telegram:  { label: 'Telegram',  color: 'bg-sky-100 text-sky-700' },
  viber:     { label: 'Viber',     color: 'bg-violet-100 text-violet-700' },
  instagram: { label: 'Instagram', color: 'bg-pink-100 text-pink-700' },
  webchat:   { label: 'Web Chat',  color: 'bg-blue-100 text-blue-700' },
  manual:    { label: 'Manuel',    color: 'bg-slate-100 text-slate-600' },
};

const STATUS_CONFIG = {
  open:           { label: 'Açık',           color: 'bg-green-100 text-green-700' },
  ai_active:      { label: 'AI Aktif',       color: 'bg-blue-100 text-blue-700' },
  human_required: { label: 'Operatör Gerekli', color: 'bg-amber-100 text-amber-700' },
  closed:         { label: 'Kapalı',         color: 'bg-slate-100 text-slate-500' },
};

const TEMP_CONFIG = {
  hot:  { label: '🔥 Sıcak', color: 'bg-red-100 text-red-700' },
  warm: { label: '🟡 Ilık',  color: 'bg-amber-100 text-amber-700' },
  cold: { label: '🔵 Soğuk', color: 'bg-sky-100 text-sky-700' },
  '':   { label: '',         color: '' },
};

const SENDER_CONFIG = {
  customer: { label: 'Müşteri', align: 'left',  bubble: 'bg-white border border-slate-200 text-slate-800' },
  ai:       { label: 'AI',      align: 'right', bubble: 'bg-blue-600 text-white' },
  human:    { label: 'Operatör',align: 'right', bubble: 'bg-[#001F54] text-white' },
  system:   { label: 'Sistem',  align: 'center',bubble: 'bg-slate-100 text-slate-500 text-xs italic' },
};

const fmtTime = (d) => new Date(d).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
const fmtDate = (d) => {
  const date = new Date(d);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return fmtTime(d);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
};

// ─── Chip bileşenleri ────────────────────────────────────────
const ChannelBadge = ({ channel }) => {
  const cfg = CHANNEL_CONFIG[channel] || CHANNEL_CONFIG.manual;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>;
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>;
};

// ─── Yeni konuşma formu ──────────────────────────────────────
const NewConversationForm = ({ onSave, onCancel, saving }) => {
  const [form, setForm] = useState({ customerName: '', phone: '', channel: 'manual' });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
      <h3 className="font-bold text-[#001F54] text-sm">Yeni Konuşma</h3>
      <input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="Müşteri Adı *" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500" />
      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Telefon" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500" />
      <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500">
        {Object.entries(CHANNEL_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
      </select>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"><X size={14} /> İptal</button>
        <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001F54] text-white text-sm font-medium hover:bg-blue-900 disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Oluştur
        </button>
      </div>
    </form>
  );
};

// ─── Mesaj thread görünümü ───────────────────────────────────
const MessageThread = ({ conversation, messages, onSendMessage, onStatusChange, onBack, sending }) => {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  const chCfg  = CHANNEL_CONFIG[conversation.channel]  || CHANNEL_CONFIG.manual;
  const stCfg  = STATUS_CONFIG[conversation.status]    || STATUS_CONFIG.open;
  const tmpCfg = TEMP_CONFIG[conversation.leadTemperature] || TEMP_CONFIG[''];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white shrink-0">
        <button onClick={onBack} className="lg:hidden p-1.5 text-slate-500 hover:text-[#001F54] transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#001F54] text-white flex items-center justify-center font-bold text-sm shrink-0">
          {conversation.customerName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 text-sm">{conversation.customerName}</span>
            <ChannelBadge channel={conversation.channel} />
            {tmpCfg.label && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tmpCfg.color}`}>{tmpCfg.label}</span>}
          </div>
          {conversation.phone && <p className="text-xs text-slate-400">{conversation.phone}</p>}
        </div>
        {/* Status değiştirici */}
        <select
          value={conversation.status}
          onChange={e => onStatusChange(e.target.value)}
          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200 ${stCfg.color}`}
        >
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
            <MessageSquare size={32} className="mb-2 opacity-40" />
            <p className="text-sm">Henüz mesaj yok.</p>
          </div>
        )}
        {messages.map(msg => {
          const cfg = SENDER_CONFIG[msg.sender] || SENDER_CONFIG.customer;
          if (msg.sender === 'system') {
            return (
              <div key={msg._id} className="flex justify-center">
                <span className="bg-slate-200 text-slate-500 text-[10px] px-3 py-1 rounded-full">{msg.text}</span>
              </div>
            );
          }
          const isRight = cfg.align === 'right';
          return (
            <div key={msg._id} className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[75%]">
                <div className={`flex items-end gap-1.5 ${isRight ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isRight ? 'bg-[#001F54]' : 'bg-slate-300'}`}>
                    {msg.sender === 'ai' ? <Bot size={12} className="text-white" /> : <User size={12} className="text-white" />}
                  </div>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${cfg.bubble} ${isRight ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
                <p className={`text-[10px] text-slate-400 mt-1 ${isRight ? 'text-right pr-8' : 'pl-8'}`}>{cfg.label} · {fmtTime(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Mesaj gönderme */}
      {conversation.status !== 'closed' && (
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex gap-2 shrink-0">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
          <button type="submit" disabled={sending || !text.trim()} className="bg-[#001F54] text-white px-4 py-2.5 rounded-xl hover:bg-blue-900 transition-colors disabled:opacity-50">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      )}
    </div>
  );
};

// ─── Ana sayfa ───────────────────────────────────────────────
const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]   = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Seçili konuşma
  const [selected, setSelected]   = useState(null); // { conversation, messages }
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [sending, setSending]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set('status', statusFilter);
      const data = await api.get(`/conversations?${params}`);
      setConversations(data.conversations);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openConversation = async (conv) => {
    setLoadingMsg(true);
    setSelected({ conversation: conv, messages: [] });
    try {
      const data = await api.get(`/conversations/${conv._id}`);
      setSelected({ conversation: data.conversation, messages: data.messages });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingMsg(false);
    }
  };

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const created = await api.post('/conversations', form);
      setConversations(prev => [created, ...prev]);
      setShowForm(false);
      openConversation(created);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!selected) return;
    setSending(true);
    try {
      const msg = await api.post(`/conversations/${selected.conversation._id}/messages`, { text, sender: 'human' });
      setSelected(prev => ({ ...prev, messages: [...prev.messages, msg] }));
      setConversations(prev => prev.map(c =>
        c._id === selected.conversation._id
          ? { ...c, lastMessageText: text, lastMessageAt: new Date().toISOString() }
          : c
      ));
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status) => {
    if (!selected) return;
    try {
      const updated = await api.put(`/conversations/${selected.conversation._id}/status`, { status });
      setSelected(prev => ({ ...prev, conversation: updated }));
      setConversations(prev => prev.map(c => c._id === updated._id ? { ...c, status: updated.status } : c));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-0 -mx-4 md:-mx-8 -mt-4 md:-mt-8">
      {/* Error banner */}
      {error && (
        <div className="mx-4 md:mx-8 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          {error} <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── SOL: Konuşma listesi ── */}
        <div className={`${selected ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 xl:w-96 border-r border-slate-200 bg-white shrink-0`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold text-[#001F54] text-lg">Konuşmalar</h1>
                <p className="text-xs text-slate-400">{total} konuşma</p>
              </div>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-[#001F54] text-white px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-900">
                <Plus size={14} /> Yeni
              </button>
            </div>
            {showForm && <NewConversationForm onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />}
            {/* Filtreler */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {['', 'open', 'ai_active', 'human_required', 'closed'].map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${statusFilter === s ? 'bg-[#001F54] text-white border-[#001F54]' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}>
                  {s ? STATUS_CONFIG[s].label : 'Tümü'}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-blue-500" /></div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <MessageSquare size={32} className="mb-2 opacity-40" />
                <p className="text-sm">Konuşma bulunamadı.</p>
              </div>
            ) : (
              conversations.map(conv => {
                const isActive = selected?.conversation._id === conv._id;
                return (
                  <button key={conv._id} onClick={() => openConversation(conv)}
                    className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${isActive ? 'bg-blue-50 border-r-2 border-r-[#001F54]' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#001F54] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {conv.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-slate-800 text-sm truncate">{conv.customerName}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{fmtDate(conv.lastMessageAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <ChannelBadge channel={conv.channel} />
                          <StatusBadge status={conv.status} />
                        </div>
                        {conv.lastMessageText && (
                          <p className="text-xs text-slate-400 truncate mt-1">{conv.lastMessageText}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 p-3 border-t border-slate-200">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs text-slate-500">{page}/{pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── SAĞ: Mesaj thread ── */}
        <div className={`${selected ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <MessageSquare size={48} className="mb-3 opacity-30" />
              <p className="font-medium">Bir konuşma seçin</p>
            </div>
          ) : loadingMsg ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 size={28} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <MessageThread
              conversation={selected.conversation}
              messages={selected.messages}
              onSendMessage={handleSendMessage}
              onStatusChange={handleStatusChange}
              onBack={() => setSelected(null)}
              sending={sending}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;
