/**
 * PAX — Premium Framer Motion variants
 * Dramatik, fark edilir, "million dollar" hissiyat.
 * transform + opacity + scale tabanlı — 60fps, layout shift yok.
 */

const ease = [0.22, 1, 0.36, 1];   // Premium cubic-bezier (Apple/Linear tarzı)
const easeIn = [0.4, 0, 1, 1];

// ── Hero başlık — en dramatik giriş ──────────────────────────────────────────
export const heroTitle = {
  hidden:  { opacity: 0, y: 90, scale: 0.85 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 1.1, ease } },
};

// ── Genel fade-up — gözle görülür hareket ────────────────────────────────────
export const fadeUp = {
  hidden:  { opacity: 0, y: 60, scale: 0.94 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.85, ease } },
};

// ── Yatay giriş — sol / sağ ──────────────────────────────────────────────────
export const slideLeft = {
  hidden:  { opacity: 0, x: -80, scale: 0.94 },
  visible: { opacity: 1, x: 0,   scale: 1,
    transition: { duration: 0.9, ease } },
};

export const slideRight = {
  hidden:  { opacity: 0, x: 80, scale: 0.94 },
  visible: { opacity: 1, x: 0,  scale: 1,
    transition: { duration: 0.9, ease } },
};

// ── Scale-pop — kart girişleri ────────────────────────────────────────────────
export const scaleFade = {
  hidden:  { opacity: 0, scale: 0.80, y: 30 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.7, ease } },
};

// ── Stagger container — varsayılan ───────────────────────────────────────────
export const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

// ── Stagger — hero (daha hızlı) ───────────────────────────────────────────────
export const staggerHero = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};

// ── Stagger — kartlar ─────────────────────────────────────────────────────────
export const staggerFast = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ── Hover — büyük kart ────────────────────────────────────────────────────────
export const hoverLift = {
  rest:  { y: 0,   scale: 1,    transition: { duration: 0.3, ease } },
  hover: { y: -10, scale: 1.02, transition: { duration: 0.3, ease } },
};

// ── Section başlığı ───────────────────────────────────────────────────────────
export const sectionTitle = {
  hidden:  { opacity: 0, y: 40, scale: 0.93 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.75, ease } },
};

// ── Viewport: her zaman tetikle ───────────────────────────────────────────────
export const viewport = { once: true, amount: 0 };

// ── Floating cards — Framer ile sürekli hareket ───────────────────────────────
export const floatY = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 3.4, ease: 'easeInOut', repeat: Infinity },
  },
};

export const floatYDelay = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 4.0, ease: 'easeInOut', repeat: Infinity, delay: 1.2 },
  },
};

// ── Terminal hover — perspektif ────────────────────────────────────────────────
export const terminalHover = {
  rest:  { scale: 1,    rotateY: 0,   transition: { duration: 0.5, ease } },
  hover: { scale: 1.03, rotateY: 2,   transition: { duration: 0.5, ease } },
};

// ── Background orb — sürekli pulse ────────────────────────────────────────────
export const orbPulse = (delay = 0) => ({
  animate: {
    scale: [1, 1.25, 1],
    opacity: [0.15, 0.35, 0.15],
    transition: { duration: 6, ease: 'easeInOut', repeat: Infinity, delay },
  },
});
