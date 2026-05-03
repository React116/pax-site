/**
 * PAX — Reusable Framer Motion variants
 * Tüm animasyonlar premium, kontrollü ve 60fps hedeflidir.
 * transform + opacity tabanlı — layout shift yok.
 */

// ── Temel fade-up ─────────────────────────────────────────────────────────────
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ── Stagger container ─────────────────────────────────────────────────────────
export const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ── Hızlı stagger (kartlar için) ──────────────────────────────────────────────
export const staggerFast = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

// ── Yatay giriş (soldan / sağdan) ─────────────────────────────────────────────
export const slideLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const slideRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// ── Scale-fade (kartlar, modallar) ────────────────────────────────────────────
export const scaleFade = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ── Hover lift (kart hover efekti) ────────────────────────────────────────────
export const hoverLift = {
  rest:  { y: 0,  scale: 1,    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  hover: { y: -6, scale: 1.01, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

// ── Subtle hover (küçük kartlar) ──────────────────────────────────────────────
export const hoverSubtle = {
  rest:  { y: 0,  transition: { duration: 0.25, ease: 'easeOut' } },
  hover: { y: -3, transition: { duration: 0.25, ease: 'easeOut' } },
};

// ── Viewport defaults (scroll reveal için) ────────────────────────────────────
export const viewport = {
  once:   true,
  amount: 0.15,   // ekranın %15'i görününce tetikle — çok erken değil, çok geç değil
};

export const viewportLazy = {
  once:   true,
  amount: 0.1,
};

// ── Floating card animasyonu (Framer ile — CSS yerine) ────────────────────────
export const floatY = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3.2, ease: 'easeInOut', repeat: Infinity },
  },
};

export const floatYDelay = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3.8, ease: 'easeInOut', repeat: Infinity, delay: 1 },
  },
};

// ── Terminal kutu hover ────────────────────────────────────────────────────────
export const terminalHover = {
  rest:  { scale: 1,    rotateY: 0,   transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  hover: { scale: 1.02, rotateY: 1.5, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ── Section başlığı ───────────────────────────────────────────────────────────
export const sectionTitle = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
