import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, MapPin, HelpCircle, CreditCard, Trash2, Plus,
  LayoutGrid, CheckCircle2, AlertCircle, Edit2, X,
  Briefcase, Percent, Tag, ChevronLeft,
  Building2, Globe, Clock, Users,
  Loader2, ArrowRight
} from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { api } from '../services/api';
import { BUSINESS_TYPES } from '../utils/businessConfig';
import { staggerFast, scaleFade } from '../utils/animations';

/* ─── KÜÇÜK YARDIMCI BİLEŞENLER ─────────────────────────────────────────── */

const LockableInput = ({ label, value, onChange, name, placeholder, type = 'text', className = '' }) => {
  const [isLocked, setIsLocked] = useState(true);
  const inputRef = useRef(null);
  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (isLocked) setTimeout(() => inputRef.current?.focus(), 100);
  };
  return (
    <div className={`relative group ${className}`}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={isLocked}
          className={`w-full p-3.5 pr-12 rounded-xl transition-all duration-300 font-medium ${
            isLocked
              ? 'bg-slate-100 text-slate-500 border-transparent cursor-default'
              : 'bg-white text-slate-800 border-blue-500 ring-4 ring-blue-50/50 shadow-sm'
          } border`}
        />
        <button
          type="button"
          onClick={toggleLock}
          className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
            isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

const LockableTextarea = ({ label, value, onChange, name, placeholder, height = 'h-24' }) => {
  const [isLocked, setIsLocked] = useState(true);
  return (
    <div className="relative group">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <textarea
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={isLocked}
          className={`w-full p-3.5 pr-12 rounded-xl transition-all duration-300 font-medium resize-none ${height} ${
            isLocked
              ? 'bg-slate-100 text-slate-500 border-transparent cursor-default'
              : 'bg-white text-slate-800 border-blue-500 ring-4 ring-blue-50/50 shadow-sm'
          } border`}
        />
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
            isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

const LockableTagInput = ({ label, value, onChange, suggestions = [] }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const tags = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.length > 0
    ? value.split(',').map((s) => s.trim())
    : [];

  const addTag = (tagToAdd) => {
    if (!tagToAdd) return;
    if (!tags.includes(tagToAdd)) onChange([...tags, tagToAdd]);
    setInputValue('');
  };
  const removeTag = (tagToRemove) => onChange(tags.filter((t) => t !== tagToRemove));
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  return (
    <div className="relative group">
      {label && <label className="label">{label}</label>}
      <div
        className={`relative w-full p-3.5 rounded-xl border transition-all duration-300 min-h-[60px] flex flex-col justify-center ${
          isLocked ? 'bg-slate-100 border-transparent' : 'bg-white border-blue-500 ring-4 ring-blue-50/50 shadow-sm'
        }`}
      >
        <div className="flex flex-wrap gap-2 pr-8">
          {tags.length === 0 && isLocked && <span className="text-slate-400 text-sm italic">Seçim yapılmadı.</span>}
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${
                isLocked ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {tag}{' '}
              {!isLocked && (
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 flex items-center">
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
          {!isLocked && (
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none min-w-[150px] text-sm py-1"
              placeholder="Ekle..."
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
            isLocked ? 'text-slate-400 hover:text-blue-600 hover:bg-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
      {!isLocked && suggestions.length > 0 && (
        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in-up">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Öneriler</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addTag(sug)}
                disabled={tags.includes(sug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  tags.includes(sug)
                    ? 'bg-green-100 text-green-700 border-green-200 opacity-50 cursor-not-allowed'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm'
                }`}
              >
                {tags.includes(sug) && <CheckCircle2 size={12} className="inline mr-1" />}
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LockableToggle = ({ label, value, onChange }) => {
  const [isLocked, setIsLocked] = useState(true);
  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
        isLocked ? 'bg-slate-100 border-transparent' : 'bg-white border-blue-500 ring-4 ring-blue-50/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative ${value ? 'bg-green-500' : 'bg-slate-300'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
        <span className="font-bold text-slate-700 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        {!isLocked && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange(true)}
              className={`px-3 py-1 rounded text-xs font-bold ${value ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
            >
              VAR
            </button>
            <button
              type="button"
              onClick={() => onChange(false)}
              className={`px-3 py-1 rounded text-xs font-bold ${!value ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}
            >
              YOK
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`p-1.5 rounded-lg transition-colors ${isLocked ? 'text-slate-400 hover:text-blue-600' : 'text-blue-600 bg-blue-50'}`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

const CampaignManager = ({ campaigns = [], onChange }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [newCamp, setNewCamp] = useState({ name: '', discount: '' });

  const addCampaign = () => {
    if (newCamp.name && newCamp.discount) {
      onChange([...campaigns, newCamp]);
      setNewCamp({ name: '', discount: '' });
    }
  };
  const removeCampaign = (index) => onChange(campaigns.filter((_, i) => i !== index));

  return (
    <div className="relative group">
      <label className="label">Aktif Kampanyalar</label>
      <div
        className={`relative w-full p-4 rounded-xl border transition-all duration-300 ${
          isLocked ? 'bg-slate-100 border-transparent' : 'bg-white border-blue-500 ring-4 ring-blue-50/50'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {campaigns.length === 0 && <div className="text-slate-400 text-sm italic p-2">Aktif kampanya yok.</div>}
          {campaigns.map((camp, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                  %{camp.discount}
                </div>
                <span className="text-sm font-bold text-slate-700">{camp.name}</span>
              </div>
              {!isLocked && (
                <button type="button" onClick={() => removeCampaign(idx)} className="text-slate-300 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        {!isLocked && (
          <div className="mt-4 flex gap-2 items-center pt-4 border-t border-slate-100">
            <input
              value={newCamp.name}
              onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
              placeholder="Kampanya Adı"
              className="flex-1 border p-2 rounded-lg text-sm outline-none focus:border-blue-500"
            />
            <div className="relative w-24">
              <Percent size={14} className="absolute left-2 top-2.5 text-slate-400" />
              <input
                type="number"
                value={newCamp.discount}
                onChange={(e) => setNewCamp({ ...newCamp, discount: e.target.value })}
                placeholder="İndirim"
                className="w-full border p-2 pl-6 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
            <button type="button" onClick={addCampaign} className="bg-[#001F54] text-white p-2 rounded-lg hover:bg-blue-900">
              <Plus size={18} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
            isLocked ? 'text-slate-400 hover:text-blue-600' : 'text-blue-600 bg-blue-50'
          }`}
        >
          {isLocked ? <Edit2 size={16} /> : <CheckCircle2 size={18} />}
        </button>
      </div>
    </div>
  );
};

const StaffItemCard = ({ item, index, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (!item.name) setIsEditing(true);
  }, []);

  return (
    <div
      className={`relative transition-all duration-300 rounded-2xl border ${
        isEditing ? 'bg-white border-blue-200 shadow-xl scale-[1.01] z-10 p-6' : 'bg-slate-50 border-slate-200 hover:border-blue-200 p-6'
      }`}
    >
      <div className="absolute top-4 right-4 z-50 flex gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(!isEditing);
          }}
          className={`p-2 rounded-lg transition-colors ${
            isEditing ? 'bg-green-100 text-green-700' : 'bg-white text-slate-400 hover:text-blue-600 shadow-sm'
          }`}
        >
          {isEditing ? <CheckCircle2 size={18} /> : <Edit2 size={16} />}
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 rounded-lg bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {isEditing ? (
        <div className="grid gap-4 animate-fade-in-up">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">İsim / Model</label>
              <input
                value={item.name || ''}
                onChange={(e) => onUpdate(index, 'name', e.target.value)}
                className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500"
                placeholder="Örn: Dr. Ayşe Yılmaz"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">Ünvan / Özellik</label>
              <input
                value={item.title || ''}
                onChange={(e) => onUpdate(index, 'title', e.target.value)}
                className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500"
                placeholder="Örn: Ortodontist"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-blue-600 uppercase mb-1 block">Açıklama</label>
            <textarea
              value={item.desc || ''}
              onChange={(e) => onUpdate(index, 'desc', e.target.value)}
              className="w-full p-2.5 bg-blue-50/30 border border-blue-200 rounded-lg outline-none focus:border-blue-500 h-20 resize-none"
              placeholder="Detaylı bilgi..."
            />
          </div>
        </div>
      ) : (
        <div className="pr-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
              {item.name ? item.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-lg">{item.name || 'İsimsiz'}</h4>
              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">{item.title || 'Ünvan Yok'}</div>
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mt-3 pl-[3.25rem]">{item.desc || 'Açıklama girilmemiş.'}</p>
        </div>
      )}
    </div>
  );
};

/* ─── ONBOARDING AŞAMASI ─────────────────────────────────────────────────── */

const OnboardingStep1 = ({ selectedType, onSelect, onNext }) => {
  return (
    <motion.div
      key="onb-step1"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-4xl mx-auto py-8"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
          <Building2 size={14} />
          Adım 1 / 2
        </div>
        <h2 className="text-3xl font-bold text-[#001F54] mb-3">İşletme Profilinizi Kurun</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Sektörünüzü seçin. AI asistanınız ve müşteri paneli bu seçime göre kişiselleştirilecektir.
        </p>
      </div>

      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10"
      >
        {Object.keys(BUSINESS_TYPES).map((key) => {
          const TypeIcon = BUSINESS_TYPES[key].icon;
          const isSelected = selectedType === key;
          return (
            <motion.button
              key={key}
              type="button"
              variants={scaleFade}
              onClick={() => onSelect(key)}
              className={`group p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 text-center ${
                isSelected
                  ? 'bg-[#001F54] border-[#001F54] text-white scale-105 shadow-xl ring-4 ring-blue-400/30'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:shadow-md hover:scale-[1.02]'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isSelected ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-50'
                }`}
              >
                <TypeIcon size={24} className={isSelected ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'} />
              </div>
              <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                {BUSINESS_TYPES[key].label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedType}
          className="inline-flex items-center gap-3 bg-[#001F54] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#0a2a6e] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100"
        >
          Devam Et
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const OnboardingStep2 = ({ formData, phone, onPhoneChange, schedule, onScheduleChange, onFormChange, onBack, onSubmit, loading }) => {
  const quickDays = {
    weekdays: ['pzt', 'sali', 'cars', 'pers', 'cuma'],
    saturday: ['cmt'],
  };

  const toggleWeekdays = (open) => {
    quickDays.weekdays.forEach((d) => onScheduleChange(d, 'open', open));
  };
  const toggleSaturday = (open) => {
    onScheduleChange('cmt', 'open', open);
  };

  const weekdaysOpen = quickDays.weekdays.every((d) => schedule[d]?.open);
  const saturdayOpen = schedule.cmt?.open;

  return (
    <motion.div
      key="onb-step2"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl mx-auto py-8"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
          <CheckCircle2 size={14} />
          Adım 2 / 2
        </div>
        <h2 className="text-3xl font-bold text-[#001F54] mb-3">Harika! Birkaç Temel Bilgi</h2>
        <p className="text-slate-500">Bu bilgiler profilinizi tamamlamak için gereklidir.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 space-y-6">
        <div>
          <label className="label">İşletme / Marka Adı</label>
          <input
            name="businessName"
            value={formData.businessName || ''}
            onChange={onFormChange}
            placeholder="Örn: Pax Pilates Stüdyosu"
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none font-medium text-slate-800 transition-all"
          />
        </div>

        <div>
          <label className="label">Telefon Numarası</label>
          <PhoneInput
            country={'tr'}
            value={phone}
            onChange={onPhoneChange}
            inputStyle={{ width: '100%', height: '52px', borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
          />
        </div>

        <div>
          <label className="label">Hızlı Çalışma Saati Kurulumu</label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-700 text-sm">Haftaiçi (Pzt–Cuma)</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {weekdaysOpen ? `${schedule.pzt?.start || '09:00'} – ${schedule.pzt?.end || '18:00'}` : 'Kapalı'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {weekdaysOpen && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={schedule.pzt?.start || '09:00'}
                      onChange={(e) => quickDays.weekdays.forEach((d) => onScheduleChange(d, 'start', e.target.value))}
                      className="border rounded-lg px-2 py-1.5 text-xs focus:border-blue-500 outline-none"
                    />
                    <span className="text-slate-400 text-xs">–</span>
                    <input
                      type="time"
                      value={schedule.pzt?.end || '18:00'}
                      onChange={(e) => quickDays.weekdays.forEach((d) => onScheduleChange(d, 'end', e.target.value))}
                      className="border rounded-lg px-2 py-1.5 text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleWeekdays(!weekdaysOpen)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative ${weekdaysOpen ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${weekdaysOpen ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-700 text-sm">Cumartesi</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {saturdayOpen ? `${schedule.cmt?.start || '09:00'} – ${schedule.cmt?.end || '15:00'}` : 'Kapalı'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {saturdayOpen && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={schedule.cmt?.start || '09:00'}
                      onChange={(e) => onScheduleChange('cmt', 'start', e.target.value)}
                      className="border rounded-lg px-2 py-1.5 text-xs focus:border-blue-500 outline-none"
                    />
                    <span className="text-slate-400 text-xs">–</span>
                    <input
                      type="time"
                      value={schedule.cmt?.end || '15:00'}
                      onChange={(e) => onScheduleChange('cmt', 'end', e.target.value)}
                      className="border rounded-lg px-2 py-1.5 text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleSaturday(!saturdayOpen)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative ${saturdayOpen ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${saturdayOpen ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-3 rounded-xl hover:bg-slate-100 transition-all"
        >
          <ChevronLeft size={18} />
          Geri
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!formData.businessName || loading}
          className="inline-flex items-center gap-3 bg-[#001F54] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0a2a6e] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Oluşturuluyor...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              Profil Oluştur
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

/* ─── TOAST BİLEŞENİ ──────────────────────────────────────────────────────── */

const Toast = ({ message }) => {
  if (!message) return null;
  const isSuccess = message.type === 'success';
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 40, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold ${
            isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─── ANA COMPONENT ───────────────────────────────────────────────────────── */

const BusinessSettings = () => {
  const [phase, setPhase] = useState('loading');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showTypeChanger, setShowTypeChanger] = useState(false);
  const [pendingType, setPendingType] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedType, setSelectedType] = useState('pilates');

  const [formData, setFormData] = useState({
    businessType: 'pilates',
    businessName: '',
    branches: '',
    phone: '',
    email: '',
    languages: '',
    socialMedia: { website: '', instagram: '', facebook: '' },
    workingHours: '{}',
    serviceDetails: {},
    staffOrItems: [],
    faq: [],
    campaigns: [],
    paymentMethods: { creditCard: false, transfer: false, pos: false, cash: false },
  });

  const [schedule, setSchedule] = useState({
    pzt:  { open: true,  start: '09:00', end: '18:00' },
    sali: { open: true,  start: '09:00', end: '18:00' },
    cars: { open: true,  start: '09:00', end: '18:00' },
    pers: { open: true,  start: '09:00', end: '18:00' },
    cuma: { open: true,  start: '09:00', end: '18:00' },
    cmt:  { open: true,  start: '09:00', end: '15:00' },
    paz:  { open: false, start: '10:00', end: '14:00' },
  });

  const daysMap = {
    pzt: 'Pazartesi', sali: 'Salı', cars: 'Çarşamba',
    pers: 'Perşembe', cuma: 'Cuma', cmt: 'Cumartesi', paz: 'Pazar',
  };

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.get('/business-profile');

      const typeFromDb = data?.businessType || 'pilates';
      const safeType = BUSINESS_TYPES && BUSINESS_TYPES[typeFromDb] ? typeFromDb : 'pilates';
      setSelectedType(safeType);

      if (data?.workingHours && data.workingHours !== '{}') {
        try {
          setSchedule(JSON.parse(data.workingHours));
        } catch (_) {}
      }

      let finalServiceDetails = data?.serviceDetails || {};
      if (Object.keys(finalServiceDetails).length === 0 && data?.classTypes) {
        finalServiceDetails.classTypes = Array.isArray(data.classTypes)
          ? data.classTypes
          : data.classTypes.split(',');
      }

      let finalCampaigns = [];
      if (Array.isArray(data?.campaigns)) finalCampaigns = data.campaigns;
      else if (typeof data?.campaigns === 'string' && data.campaigns.length > 0) {
        finalCampaigns = [{ name: data.campaigns, discount: '0' }];
      }

      setFormData((prev) => ({
        ...prev,
        ...data,
        businessType: safeType,
        staffOrItems:
          data?.staffOrItems?.length > 0
            ? data.staffOrItems
            : (data?.instructors?.map((i) => ({ name: i.name, title: i.specialty, desc: i.bio })) || []),
        serviceDetails: finalServiceDetails,
        campaigns: finalCampaigns,
      }));

      setPhase(data?.businessName ? 'settings' : 'onboarding');
    } catch (_) {
      setPhase('onboarding');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [p, c] = name.split('.');
      setFormData((prev) => ({ ...prev, [p]: { ...prev[p], [c]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceDetailChange = (key, value) => {
    setFormData((prev) => ({ ...prev, serviceDetails: { ...prev.serviceDetails, [key]: value } }));
  };

  const addItem = () =>
    setFormData((p) => ({ ...p, staffOrItems: [...p.staffOrItems, { name: '', title: '', desc: '' }] }));
  const removeItem = (i) =>
    setFormData((p) => ({ ...p, staffOrItems: p.staffOrItems.filter((_, idx) => idx !== i) }));
  const updateItem = (i, field, value) => {
    const n = [...formData.staffOrItems];
    n[i][field] = value;
    setFormData((p) => ({ ...p, staffOrItems: n }));
  };

  const handleScheduleChange = (day, field, value) =>
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));

  const buildPayload = () => ({
    ...formData,
    workingHours: JSON.stringify(schedule),
    campaigns: Array.isArray(formData.campaigns) ? formData.campaigns : [],
    faq: Array.isArray(formData.faq) ? formData.faq : [],
    staffOrItems: Array.isArray(formData.staffOrItems) ? formData.staffOrItems : [],
  });

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await api.put('/business-profile', buildPayload());
      showToast('success', 'Değişiklikler başarıyla kaydedildi.');
    } catch (err) {
      showToast('error', 'Kaydedilemedi: ' + (err?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async () => {
    if (!formData.businessName) return;
    setLoading(true);
    try {
      await api.put('/business-profile', buildPayload());
      setPhase('settings');
    } catch (err) {
      showToast('error', 'Profil oluşturulamadı: ' + (err?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (key) => {
    setSelectedType(key);
    setFormData((p) => ({ ...p, businessType: key }));
  };

  const confirmTypeChange = () => {
    if (pendingType) {
      handleTypeSelect(pendingType);
      setPendingType(null);
    }
    setShowTypeChanger(false);
    setActiveTab('general');
  };

  const currentConfig =
    BUSINESS_TYPES && BUSINESS_TYPES[selectedType] ? BUSINESS_TYPES[selectedType] : BUSINESS_TYPES['pilates'];
  const ActiveIcon = currentConfig?.icon || Briefcase;

  const tabs = [
    { key: 'general', label: 'Genel Bilgiler', icon: <MapPin size={15} /> },
    ...(currentConfig.tabs || [])
      .filter((t) => ['services', 'inventory', 'menu', 'rules'].includes(t))
      .map((t) => ({ key: t, label: currentConfig.labels?.[t] || t, icon: <Tag size={15} /> })),
    ...(currentConfig.tabs || []).includes('staff')
      ? [{ key: 'staff', label: currentConfig.labels?.staff || 'Ekip', icon: <Users size={15} /> }]
      : [],
    { key: 'ai', label: 'AI & SSS', icon: <HelpCircle size={15} /> },
    { key: 'payment', label: 'Ödeme', icon: <CreditCard size={15} /> },
  ];

  /* ── LOADING ── */
  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={24} className="animate-spin text-blue-600" />
          <span className="font-medium">Profil yükleniyor...</span>
        </div>
      </div>
    );
  }

  /* ── ONBOARDING ── */
  if (phase === 'onboarding') {
    return (
      <div className="pb-16 max-w-5xl mx-auto font-sans">
        <Toast message={message} />
        <AnimatePresence mode="wait">
          {onboardingStep === 1 ? (
            <OnboardingStep1
              key="step1"
              selectedType={selectedType}
              onSelect={handleTypeSelect}
              onNext={() => setOnboardingStep(2)}
            />
          ) : (
            <OnboardingStep2
              key="step2"
              formData={formData}
              phone={formData.phone}
              onPhoneChange={(val) => setFormData({ ...formData, phone: val })}
              schedule={schedule}
              onScheduleChange={handleScheduleChange}
              onFormChange={handleChange}
              onBack={() => setOnboardingStep(1)}
              onSubmit={handleOnboardingSubmit}
              loading={loading}
            />
          )}
        </AnimatePresence>
        <style>{baseStyles}</style>
      </div>
    );
  }

  /* ── SETTINGS ── */
  return (
    <div className="pb-24 max-w-5xl mx-auto font-sans">
      <Toast message={message} />

      {/* Header Kartı */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#001F54] flex items-center justify-center shadow-lg">
            <ActiveIcon size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#001F54]">{formData.businessName || 'İşletme Adı'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                {currentConfig?.label || selectedType}
              </span>
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Aktif
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setShowTypeChanger(!showTypeChanger); setPendingType(null); }}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
        >
          <LayoutGrid size={16} />
          İşletme Türünü Değiştir
        </button>
      </motion.div>

      {/* Tür Değiştir Paneli */}
      <AnimatePresence>
        {showTypeChanger && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Yeni sektör seçin</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-5">
                {Object.keys(BUSINESS_TYPES).map((key) => {
                  const TypeIcon = BUSINESS_TYPES[key].icon;
                  const active = (pendingType || selectedType) === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPendingType(key)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all text-center ${
                        active
                          ? 'bg-[#001F54] border-[#001F54] text-white shadow-lg scale-105'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-white'
                      }`}
                    >
                      <TypeIcon size={20} />
                      <span className="text-[10px] font-bold leading-tight">{BUSINESS_TYPES[key].label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={confirmTypeChange}
                  disabled={!pendingType || pendingType === selectedType}
                  className="inline-flex items-center gap-2 bg-[#001F54] text-white px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0a2a6e] transition-all"
                >
                  <CheckCircle2 size={16} />
                  Değişikliği Onayla
                </button>
                <button
                  type="button"
                  onClick={() => { setShowTypeChanger(false); setPendingType(null); }}
                  className="text-sm font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
                >
                  İptal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Konteyner */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          {/* Tab Bar */}
          <div className="flex overflow-x-auto scrollbar-hide p-3 gap-1.5 border-b border-slate-100 bg-slate-50/60">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-[#001F54] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab İçerik */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div
                  key="tab-general"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <LockableInput
                      label="İşletme / Marka Adı"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Örn: Pax Pilates"
                    />
                    <div className="relative group">
                      <label className="label">Telefon</label>
                      <PhoneInput
                        country={'tr'}
                        value={formData.phone}
                        onChange={(val) => setFormData({ ...formData, phone: val })}
                        inputStyle={{ width: '100%', height: '52px', borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
                      />
                    </div>
                  </div>

                  <LockableTextarea
                    label="Adres ve Konum"
                    name="branches"
                    value={formData.branches}
                    onChange={handleChange}
                    placeholder="Adres..."
                    height="h-24"
                  />

                  {/* Çalışma Saatleri */}
                  <div>
                    <label className="label mb-3 flex items-center gap-2">
                      <Clock size={13} />
                      Çalışma Saatleri
                    </label>
                    <div className="space-y-2">
                      {Object.keys(schedule).map((day) => (
                        <div
                          key={day}
                          className="flex flex-wrap gap-3 items-center bg-slate-50 border border-slate-200 p-3 rounded-xl"
                        >
                          <div className="w-24 font-bold text-xs text-slate-700">{daysMap[day]}</div>
                          <button
                            type="button"
                            onClick={() => handleScheduleChange(day, 'open', !schedule[day]?.open)}
                            className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 relative flex-shrink-0 ${
                              schedule[day]?.open ? 'bg-green-500' : 'bg-slate-300'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                                schedule[day]?.open ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          {schedule[day]?.open ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={schedule[day]?.start || '09:00'}
                                onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                                className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:border-blue-500 outline-none bg-white"
                              />
                              <span className="text-slate-400 text-xs font-bold">–</span>
                              <input
                                type="time"
                                value={schedule[day]?.end || '18:00'}
                                onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                                className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:border-blue-500 outline-none bg-white"
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Kapalı</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sosyal Medya */}
                  <div>
                    <label className="label mb-3 flex items-center gap-2">
                      <Globe size={13} />
                      Dijital Varlık
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <LockableInput
                        label="Website"
                        name="socialMedia.website"
                        value={formData.socialMedia?.website}
                        onChange={handleChange}
                        placeholder="https://"
                      />
                      <LockableInput
                        label="Instagram"
                        name="socialMedia.instagram"
                        value={formData.socialMedia?.instagram}
                        onChange={handleChange}
                        placeholder="@kullanici"
                      />
                      <LockableInput
                        label="Facebook"
                        name="socialMedia.facebook"
                        value={formData.socialMedia?.facebook}
                        onChange={handleChange}
                        placeholder="facebook.com/..."
                      />
                      <LockableInput
                        label="Desteklenen Diller"
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        placeholder="TR, EN"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {['services', 'inventory', 'menu', 'rules'].includes(activeTab) && (
                <motion.div
                  key={`tab-${activeTab}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-blue-600">
                      <ActiveIcon size={20} />
                    </div>
                    <p>
                      <strong>{currentConfig.label}</strong> için özel alanlar.
                    </p>
                  </div>
                  {(currentConfig.fields?.[activeTab] || []).map((field) => {
                    const isObject = typeof field === 'object';
                    const key = isObject ? field.key : field;
                    const label = isObject
                      ? field.label
                      : key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

                    if (isObject && field.type === 'tags') {
                      return (
                        <LockableTagInput
                          key={key}
                          label={label}
                          value={formData.serviceDetails?.[key]}
                          suggestions={field.suggestions}
                          onChange={(newTags) => handleServiceDetailChange(key, newTags)}
                        />
                      );
                    }
                    if (isObject && field.type === 'toggle') {
                      return (
                        <LockableToggle
                          key={key}
                          label={label}
                          value={formData.serviceDetails?.[key] || false}
                          onChange={(val) => handleServiceDetailChange(key, val)}
                        />
                      );
                    }
                    return (
                      <LockableTextarea
                        key={key}
                        label={label}
                        value={formData.serviceDetails?.[key] || ''}
                        onChange={(e) => handleServiceDetailChange(key, e.target.value)}
                        placeholder={`${label} detayları...`}
                        height="h-32"
                      />
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'staff' && (
                <motion.div
                  key="tab-staff"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {formData.staffOrItems.map((item, index) => (
                      <StaffItemCard key={index} index={index} item={item} onUpdate={updateItem} onRemove={removeItem} />
                    ))}
                  </div>
                  <button type="button" onClick={addItem} className="dashed-btn py-6 hover:shadow-md">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                      <Plus size={24} />
                    </div>
                    <span className="text-blue-800 font-bold">{currentConfig.labels?.newItemBtn || 'Yeni Ekle'}</span>
                  </button>
                </motion.div>
              )}

              {activeTab === 'ai' && (
                <motion.div
                  key="tab-ai"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  {formData.faq.map((q, i) => (
                    <div key={i} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                      <div className="flex-1 space-y-4">
                        <LockableInput
                          label={`Soru ${i + 1}`}
                          value={q.question}
                          onChange={(e) => {
                            const n = [...formData.faq];
                            n[i].question = e.target.value;
                            setFormData({ ...formData, faq: n });
                          }}
                          placeholder="?"
                        />
                        <LockableTextarea
                          label="Cevap"
                          value={q.answer}
                          onChange={(e) => {
                            const n = [...formData.faq];
                            n[i].answer = e.target.value;
                            setFormData({ ...formData, faq: n });
                          }}
                          placeholder="..."
                          height="h-20"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, faq: formData.faq.filter((_, x) => x !== i) })}
                        className="text-slate-300 hover:text-red-500 absolute top-4 right-4"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, faq: [...formData.faq, { question: '', answer: '' }] })}
                    className="dashed-btn"
                  >
                    <Plus size={18} /> Soru Ekle
                  </button>
                </motion.div>
              )}

              {activeTab === 'payment' && (
                <motion.div
                  key="tab-payment"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-8"
                >
                  <div>
                    <label className="label mb-4">Kabul Edilen Ödeme Yöntemleri</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { key: 'creditCard', label: 'Kredi Kartı' },
                        { key: 'transfer', label: 'Havale / EFT' },
                        { key: 'pos', label: 'POS Cihazı' },
                        { key: 'cash', label: 'Nakit' },
                      ].map(({ key, label }) => (
                        <label
                          key={key}
                          className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center gap-2 transition-all ${
                            formData.paymentMethods?.[key]
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.paymentMethods?.[key] || false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentMethods: { ...formData.paymentMethods, [key]: e.target.checked },
                              })
                            }
                            className="hidden"
                          />
                          <span className="font-bold text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <CampaignManager
                    campaigns={formData.campaigns || []}
                    onChange={(newVal) => setFormData((p) => ({ ...p, campaigns: newVal }))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sticky Save */}
        <div className="sticky bottom-6 z-20 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#001F54] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#0a2a6e] shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save size={20} />
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </form>

      <style>{baseStyles}</style>
    </div>
  );
};

const baseStyles = `
  .label { display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
  .dashed-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; padding: 1rem; border: 2px dashed #cbd5e1; border-radius: 0.75rem; color: #64748b; font-weight: 600; transition: all 0.2s; cursor: pointer; background: transparent; }
  .dashed-btn:hover { border-color: #001F54; color: #001F54; background: #f8fafc; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
`;

export default BusinessSettings;
