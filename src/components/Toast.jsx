import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error:   <XCircle    size={18} className="text-red-500   shrink-0" />,
  info:    <AlertCircle size={18} className="text-blue-500  shrink-0" />,
};

const COLORS = {
  success: 'border-l-green-500 bg-white',
  error:   'border-l-red-500   bg-white',
  info:    'border-l-blue-500  bg-white',
};

/* ─── Single toast item ─── */
const ToastItem = ({ id, type = 'info', message, onRemove }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // slide in
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 max-w-sm w-full
        ${COLORS[type]}
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
    >
      {ICONS[type]}
      <p className="text-sm text-slate-700 leading-snug flex-1">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(id), 300); }}
        className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
};

/* ─── Container rendered at root ─── */
export const ToastContainer = ({ toasts, onRemove }) => (
  <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
    {toasts.map(t => (
      <div key={t.id} className="pointer-events-auto">
        <ToastItem {...t} onRemove={onRemove} />
      </div>
    ))}
  </div>
);

/* ─── Hook ─── */
let _counter = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((message, type = 'info') => {
    const id = ++_counter;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const toast = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
    info:    (msg) => add(msg, 'info'),
  };

  return { toasts, remove, toast };
};
