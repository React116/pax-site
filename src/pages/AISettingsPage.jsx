import React, { useState, useEffect, useRef } from 'react';
import { Bot, Save, Send, Loader2, X, Zap, MessageSquare, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { api } from '../services/api';

// ─── Sabitler ───────────────────────────────────────────────
const BRAND_TONES = [
  { value: 'professional', label: 'Profesyonel',  desc: 'Resmi, güven verici' },
  { value: 'friendly',     label: 'Samimi',        desc: 'Sıcak, arkadaşça' },
  { value: 'luxury',       label: 'Lüks',          desc: 'Sofistike, premium' },
  { value: 'energetic',    label: 'Enerjik',       desc: 'Dinamik, motive edici' },
  { value: 'calm',         label: 'Sakin',         desc: 'Anlayışlı, dinlendirici' },
];

const LANGUAGES = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'me', label: 'Crnogorski' },
];

const SENDER_STYLE = {
  customer: 'bg-white border border-slate-200 text-slate-800 self-start',
  ai:       'bg-blue-600 text-white self-end',
  user:     'bg-[#001F54] text-white self-end',
};

// ─── Toggle bileşeni ─────────────────────────────────────────
const Toggle = ({ value, onChange, label, desc }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
    <div>
      <p className="font-semibold text-slate-800 text-sm">{label}</p>
      {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
    </div>
    <button type="button" onClick={() => onChange(!value)} className="shrink-0 ml-4">
      {value
        ? <ToggleRight size={32} className="text-blue-600" />
        : <ToggleLeft  size={32} className="text-slate-300" />}
    </button>
  </div>
);

// ─── Test Chat ───────────────────────────────────────────────
const TestChat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Bu test ortamı — AI, işletme bilgilerinize göre cevap üretiyor.' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setError('');
    setMessages(prev => [...prev, { role: 'customer', text }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/test-reply', { message: text });
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: res.replyText, meta: { intent: res.intent, temperature: res.leadTemperature, escalate: res.shouldEscalateToHuman } }
      ]);
    } catch (e) {
      setError(e.message);
      setMessages(prev => [...prev, { role: 'system', text: `Hata: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setMessages([{ role: 'system', text: 'Sohbet temizlendi.' }]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bot size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">AI Test Chat</span>
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">CANLI TEST</span>
        </div>
        <button onClick={clear} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Temizle</button>
      </div>

      {/* Mesajlar */}
      <div className="flex flex-col gap-3 p-4 h-72 overflow-y-auto bg-slate-50/50">
        {messages.map((msg, i) => {
          if (msg.role === 'system') {
            return (
              <div key={i} className="flex justify-center">
                <span className="bg-slate-200 text-slate-500 text-[10px] px-3 py-1 rounded-full">{msg.text}</span>
              </div>
            );
          }
          const isAI = msg.role === 'ai';
          return (
            <div key={i} className={`flex flex-col max-w-[80%] ${isAI ? 'self-end items-end' : 'self-start items-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm ${isAI ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'} shadow-sm`}>
                {msg.text}
              </div>
              {isAI && msg.meta && (
                <div className="flex gap-1.5 mt-1.5 flex-wrap justify-end">
                  {msg.meta.intent && <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">{msg.meta.intent}</span>}
                  {msg.meta.temperature && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${msg.meta.temperature === 'hot' ? 'bg-red-100 text-red-700' : msg.meta.temperature === 'warm' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>{msg.meta.temperature}</span>}
                  {msg.meta.escalate && <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-1.5 py-0.5 rounded">⚠ Operatör</span>}
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="self-end flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm shadow-sm">
            <Loader2 size={13} className="animate-spin" /> Yazıyor...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex gap-2 p-4 border-t border-slate-100">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Müşteri gibi bir mesaj yaz..."
          disabled={loading}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-50"
        />
        <button type="submit" disabled={loading || !input.trim()} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

// ─── Ana Sayfa ───────────────────────────────────────────────
const AISettingsPage = () => {
  const [settings, setSettings] = useState({
    aiEnabled:           false,
    brandTone:           'professional',
    defaultLanguage:     'tr',
    fallbackMessage:     '',
    humanHandoffMessage: '',
    bookingGoalEnabled:  true,
    leadCaptureEnabled:  true,
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    api.get('/ai/settings')
      .then(data => setSettings(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await api.put('/ai/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-blue-500" /></div>;

  return (
    <div className="max-w-3xl space-y-8">
      {/* Başlık */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#001F54] font-serif">AI Asistan Ayarları</h1>
            <p className="text-slate-500 text-sm">İşletmenize özel AI davranışını yapılandırın.</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${settings.aiEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          <Zap size={12} /> {settings.aiEnabled ? 'AI Aktif' : 'AI Pasif'}
        </div>
      </div>

      {/* Hata / Başarı */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          {error} <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✅ Ayarlar kaydedildi.
        </div>
      )}

      <form onSubmit={save} className="space-y-6">
        {/* Genel Togglelar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Genel</h2>
          <Toggle
            value={settings.aiEnabled}
            onChange={v => set('aiEnabled', v)}
            label="AI Asistanı Aktifleştir"
            desc="Kanalardan gelen mesajlara AI otomatik cevap verir."
          />
          <Toggle
            value={settings.bookingGoalEnabled}
            onChange={v => set('bookingGoalEnabled', v)}
            label="Randevu Hedefi"
            desc="AI, müşteriyi randevuya yönlendirmeye çalışır."
          />
          <Toggle
            value={settings.leadCaptureEnabled}
            onChange={v => set('leadCaptureEnabled', v)}
            label="Lead Yakalama"
            desc="AI, potansiyel müşteri bilgilerini otomatik kaydeder."
          />
        </div>

        {/* Marka Tonu */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Marka Tonu</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BRAND_TONES.map(tone => (
              <button
                key={tone.value}
                type="button"
                onClick={() => set('brandTone', tone.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${settings.brandTone === tone.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-200'}`}
              >
                <p className={`font-bold text-sm ${settings.brandTone === tone.value ? 'text-blue-700' : 'text-slate-800'}`}>{tone.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{tone.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dil ve Mesajlar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Dil & Mesajlar</h2>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Varsayılan Yanıt Dili</label>
            <select
              value={settings.defaultLanguage}
              onChange={e => set('defaultLanguage', e.target.value)}
              className="w-full sm:w-48 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
            >
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1"><Info size={11} /> Müşteri farklı dilde yazarsa AI otomatik o dile geçer.</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Geri Dönüş Mesajı</label>
            <textarea
              value={settings.fallbackMessage}
              onChange={e => set('fallbackMessage', e.target.value)}
              placeholder="AI cevap veremediğinde: 'Bu konuda size yardımcı olmak için lütfen bizi arayın...'"
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Operatöre Devir Mesajı</label>
            <textarea
              value={settings.humanHandoffMessage}
              onChange={e => set('humanHandoffMessage', e.target.value)}
              placeholder="'Sizi ekibimizden birine bağlıyorum, kısa süre içinde dönüş yapacağız...'"
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Kaydet */}
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#001F54] text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-900 transition-colors disabled:opacity-60 shadow-sm">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Ayarları Kaydet
        </button>
      </form>

      {/* Test Chat */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-600" />
          <h2 className="font-bold text-slate-800">AI Test Chat</h2>
        </div>
        <p className="text-sm text-slate-500">
          Müşteri gibi mesaj yaz, AI'ın işletme bilgilerine göre nasıl cevap vereceğini gör.
          {!settings.aiEnabled && <span className="ml-1 text-amber-600 font-medium">⚠ AI şu an pasif ama test yapabilirsin.</span>}
        </p>
        <TestChat />
      </div>
    </div>
  );
};

export default AISettingsPage;
