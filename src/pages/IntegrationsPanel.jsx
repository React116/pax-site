import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import {
  MessageCircle, Send, Phone, Globe, Instagram,
  CheckCircle2, XCircle, Loader2, RefreshCw, Copy, ExternalLink,
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://pax-backend-api.onrender.com';

const CHANNELS = [
  {
    id:       'telegram',
    label:    'Telegram',
    icon:     <Send size={22} className="text-sky-400" />,
    color:    'sky',
    fields:   [{ key: 'botToken', label: 'Bot Token', placeholder: '123456789:AAFxxxx...' }],
    helpUrl:  'https://core.telegram.org/bots#how-do-i-create-a-bot',
    helpText: '@BotFather ile bot oluşturun ve token alın.',
    webhookInfo: true,
  },
  {
    id:       'whatsapp',
    label:    'WhatsApp Business',
    icon:     <MessageCircle size={22} className="text-green-400" />,
    color:    'green',
    fields:   [
      { key: 'accessToken',   label: 'Access Token',     placeholder: 'EAAxxxx...' },
      { key: 'phoneNumberId', label: 'Phone Number ID',  placeholder: '1234567890' },
    ],
    helpUrl:  'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
    helpText: 'Meta Developer Console → WhatsApp → API Setup.',
    webhookInfo: true,
    verifyToken: true,
  },
  {
    id:       'viber',
    label:    'Viber',
    icon:     <Phone size={22} className="text-purple-400" />,
    color:    'purple',
    fields:   [{ key: 'botToken', label: 'Bot Token', placeholder: 'xxxx-xxxx-xxxx-xxxx-1' }],
    helpUrl:  'https://developers.viber.com/docs/api/rest-bot-api/',
    helpText: 'Viber Admin Panel → Create Bot Account → Bot Key.',
    webhookInfo: true,
  },
  {
    id:       'webchat',
    label:    'Web Chat Widget',
    icon:     <Globe size={22} className="text-blue-400" />,
    color:    'blue',
    fields:   [],
    helpText: 'Web sitenize yerleştirmek için snippet alın.',
    webhookInfo: false,
  },
  {
    id:       'instagram',
    label:    'Instagram (Yakında)',
    icon:     <Instagram size={22} className="text-pink-400" />,
    color:    'pink',
    fields:   [],
    helpText: 'Instagram DM entegrasyonu çok yakında.',
    webhookInfo: false,
    comingSoon: true,
  },
];

const StatusBadge = ({ status }) => {
  if (status === 'connected') return (
    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
      <CheckCircle2 size={12} /> Bağlı
    </span>
  );
  if (status === 'error') return (
    <span className="flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
      <XCircle size={12} /> Hata
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
      Bağlı Değil
    </span>
  );
};

const ChannelCard = ({ channel, integration, onSave, onDisconnect }) => {
  const [open,   setOpen]   = useState(false);
  const [fields, setFields] = useState({});
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error,  setError]  = useState('');

  const status = integration?.status || 'disconnected';

  // Webhook URL: backend public endpoint
  const getWebhookUrl = () => {
    if (!integration?._id && !integration) return '—';
    // businessId is embedded in the URL
    return `${BACKEND_URL}/api/webhooks/${channel.id}/${integration?.businessId || ''}`;
  };

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = async () => {
    setError('');
    // Validate required fields
    for (const f of channel.fields) {
      if (!fields[f.key]?.trim()) {
        setError(`${f.label} boş bırakılamaz.`);
        return;
      }
    }
    setSaving(true);
    try {
      await onSave(channel.id, { credentials: fields });
      setOpen(false);
      setFields({});
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm(`${channel.label} bağlantısını kesmek istediğinize emin misiniz?`)) return;
    setSaving(true);
    try {
      await onDisconnect(channel.id);
    } finally {
      setSaving(false);
    }
  };

  const colorMap = {
    sky:    'border-sky-200    bg-sky-50',
    green:  'border-green-200  bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    blue:   'border-blue-200   bg-blue-50',
    pink:   'border-pink-200   bg-pink-50',
  };

  return (
    <div className={`border rounded-2xl p-5 transition-all ${channel.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[channel.color] || 'bg-slate-100'}`}>
            {channel.icon}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{channel.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{channel.helpText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={status} />
          {!channel.comingSoon && (
            status === 'connected' ? (
              <button
                onClick={handleDisconnect}
                disabled={saving}
                className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-lg transition-all"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : 'Bağlantıyı Kes'}
              </button>
            ) : (
              channel.fields.length > 0 && (
                <button
                  onClick={() => setOpen(!open)}
                  className="text-xs text-white bg-[#001F54] hover:bg-blue-800 px-3 py-1 rounded-lg transition-all"
                >
                  {open ? 'Kapat' : 'Bağla'}
                </button>
              )
            )
          )}
        </div>
      </div>

      {/* Webhook info — show when connected */}
      {status === 'connected' && channel.webhookInfo && (
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-slate-600 mb-1">Webhook URL</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-slate-700 break-all flex-1">{getWebhookUrl()}</code>
            <button
              onClick={() => handleCopy(getWebhookUrl())}
              className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
              title="Kopyala"
            >
              {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>
          {channel.verifyToken && (
            <>
              <p className="text-xs font-semibold text-slate-600 mb-1 mt-3">Verify Token</p>
              <code className="text-xs text-slate-700">pax_whatsapp_verify</code>
            </>
          )}
          {channel.helpUrl && (
            <a href={channel.helpUrl} target="_blank" rel="noreferrer"
               className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
              Kurulum Kılavuzu <ExternalLink size={11} />
            </a>
          )}
        </div>
      )}

      {/* Setup form */}
      {open && !channel.comingSoon && status !== 'connected' && (
        <div className="mt-4 border-t border-slate-100 pt-4 space-y-3">
          {channel.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
              <input
                type="text"
                placeholder={f.placeholder}
                value={fields[f.key] || ''}
                onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {channel.helpUrl && (
            <a href={channel.helpUrl} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
              Nereden alırım? <ExternalLink size={11} />
            </a>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#001F54] hover:bg-blue-800 text-white text-sm font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> Kaydediliyor...</> : 'Bağlantıyı Kaydet'}
          </button>
        </div>
      )}

      {/* Webchat snippet */}
      {channel.id === 'webchat' && (
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-slate-600 mb-1">Widget Snippet (Yakında)</p>
          <code className="text-xs text-slate-500">&lt;!-- Web chat widget entegrasyonu yakında eklenecek --&gt;</code>
        </div>
      )}
    </div>
  );
};

const IntegrationsPanel = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/integrations');
      setIntegrations(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIntegrations(); }, [fetchIntegrations]);

  const getIntegration = (channelId) =>
    integrations.find((i) => i.channel === channelId) || null;

  const handleSave = async (channelId, body) => {
    await api.post(`/api/integrations/${channelId}`, body);
    await fetchIntegrations();
  };

  const handleDisconnect = async (channelId) => {
    await api.delete(`/api/integrations/${channelId}`);
    await fetchIntegrations();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kanal Entegrasyonları</h1>
          <p className="text-slate-500 text-sm mt-1">
            WhatsApp, Telegram ve Viber botlarınızı bağlayın — AI asistanınız otomatik yanıtlar verir.
          </p>
        </div>
        <button
          onClick={fetchIntegrations}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-lg transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {CHANNELS.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              integration={getIntegration(channel.id)}
              onSave={handleSave}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IntegrationsPanel;
