import { 
  Leaf, Stethoscope, Gavel, Scissors, Utensils, 
  Car, Home, Calculator, ShoppingBag, 
  Smile, Activity, Briefcase
} from 'lucide-react';

// Pilates için Önerilen Ders Listesi
const PILATES_SUGGESTIONS = [
  "Reformer Beginner / Intermediate",
  "Klinik Pilates",
  "Hamile Pilatesi",
  "Jumpboard Cardio Reformer",
  "Postnatal Recovery Pilates",
  "Mat Group Pilates",
  "Power & HIIT Pilates",
  "Skolyoz / Duruş Düzeltici Pilates",
  "Private Reformer",
  "Barre + Reformer Fusion"
];

// Yoga için Önerilen Ders Listesi
const YOGA_SUGGESTIONS = [
  "Vinyasa Flow", "Hatha Yoga", "Yin Yoga", 
  "Kundalini Yoga", "Hamile Yogası", "Meditation & Breathwork"
];

// Süre Önerileri
const DURATION_SUGGESTIONS = ["40 Dakika", "50 Dakika", "1 Saat", "90 Dakika"];

export const BUSINESS_TYPES = {
  // --- 1. SAĞLIK & GÜZELLİK ---
  pilates: {
    label: "Pilates Stüdyosu",
    icon: Leaf,
    tabs: ['services', 'staff', 'health'],
    labels: {
      staff: "Eğitmenler",
      services: "Ders Ayarları",
      newItemBtn: "Yeni Eğitmen Ekle"
    },
    fields: {
      services: [
        // classFormat KALDIRILDI
        { key: 'classTypes', type: 'tags', suggestions: PILATES_SUGGESTIONS, label: 'Ders Türleri' },
        { key: 'duration', type: 'tags', suggestions: DURATION_SUGGESTIONS, label: 'Ders Süreleri' },
        { key: 'freeTrial', type: 'toggle', label: 'Ücretsiz Deneme Dersi Var mı?' },
        { key: 'onlineService', type: 'toggle', label: 'Online / Uzaktan Eğitim Var mı?' }
      ],
      staffSchema: { name: '', title: '', desc: '' }
    }
  },
  yoga: {
    label: "Yoga Stüdyosu",
    icon: Activity,
    tabs: ['services', 'staff', 'health'],
    labels: {
      staff: "Eğitmenler / Yogi",
      services: "Ders Ayarları",
      newItemBtn: "Eğitmen Ekle"
    },
    fields: {
      services: [
        { key: 'classTypes', type: 'tags', suggestions: YOGA_SUGGESTIONS, label: 'Yoga Türleri' },
        { key: 'duration', type: 'tags', suggestions: DURATION_SUGGESTIONS, label: 'Ders Süreleri' },
        { key: 'freeTrial', type: 'toggle', label: 'Ücretsiz Deneme Dersi' },
        { key: 'onlineService', type: 'toggle', label: 'Online Ders İmkanı' }
      ],
      staffSchema: { name: '', title: '', desc: '' }
    }
  },
  // ... Diğer sektörler aynı kalabilir, sadece yukarıdakileri güncellemen yeterli.
  // Diğer sektörlerin kodlarını önceki cevaptan aynen koruyabilirsin.
  dental: {
    label: "Diş Kliniği / Poliklinik",
    icon: Stethoscope,
    tabs: ['services', 'staff', 'health'],
    labels: { staff: "Hekimler", services: "Tedavi Türleri", newItemBtn: "Hekim Ekle" },
    fields: {
      services: ['treatmentTypes', 'insurance', 'emergencyService'],
      staffSchema: { name: '', title: '', desc: '' }
    }
  },
  beauty: {
    label: "Güzellik / Kuaför",
    icon: Scissors,
    tabs: ['services', 'staff'],
    labels: { staff: "Uzmanlar", services: "Hizmet Menüsü", newItemBtn: "Uzman Ekle" },
    fields: {
      services: ['serviceMenu', 'brandsUsed', 'duration'],
      staffSchema: { name: '', title: '', instagram: '' }
    }
  },
  aesthetic: {
    label: "Estetik Merkezi",
    icon: Smile,
    tabs: ['services', 'staff', 'health'],
    labels: { staff: "Uzmanlar", services: "Uygulamalar", newItemBtn: "Uzman Ekle" },
    fields: {
      services: ['procedures', 'devices', 'consultationFee'],
      staffSchema: { name: '', title: '', desc: '' }
    }
  },
  dietitian: {
    label: "Diyetisyen",
    icon: ShoppingBag,
    tabs: ['services', 'health'],
    labels: { staff: "Diyetisyenler", services: "Paketler", newItemBtn: "Ekle" },
    fields: {
      services: ['packageTypes', 'onlineConsultation', 'bodyAnalysis'],
      staffSchema: { name: '', title: '' }
    }
  },
  psychology: {
    label: "Psikolog / Terapi",
    icon: Smile,
    tabs: ['services', 'staff'],
    labels: { staff: "Terapistler", services: "Seanslar", newItemBtn: "Ekle" },
    fields: {
      services: ['sessionTypes', 'duration', 'onlineTherapy'],
      staffSchema: { name: '', title: '', approach: '' }
    }
  },
  lawyer: {
    label: "Avukatlık Bürosu",
    icon: Gavel,
    tabs: ['services', 'staff'],
    labels: { staff: "Avukatlar", services: "Uzmanlıklar", newItemBtn: "Ekle" },
    fields: {
      services: ['practiceAreas', 'consultationFee', 'barAssociation'],
      staffSchema: { name: '', title: '', barNo: '' }
    }
  },
  accountant: {
    label: "Mali Müşavir",
    icon: Calculator,
    tabs: ['services'],
    labels: { services: "Hizmetler", newItemBtn: "Ekle" },
    fields: {
      services: ['companyTypes', 'eInvoice', 'consultancy'],
      staffSchema: { name: '', title: '' }
    }
  },
  rentacar: {
    label: "Rent a Car",
    icon: Car,
    tabs: ['inventory', 'rules'],
    labels: { inventory: "Filo", rules: "Koşullar", newItemBtn: "Araç Ekle" },
    fields: { inventory: [], rules: ['deposit', 'minAge', 'licenseYear', 'kmLimit'] }
  },
  hotel: {
    label: "Otel / Villa",
    icon: Home,
    tabs: ['inventory', 'rules'],
    labels: { inventory: "Odalar", rules: "Kurallar", newItemBtn: "Oda Ekle" },
    fields: { inventory: [], rules: ['checkInTime', 'checkOutTime', 'petsAllowed', 'deposit'] }
  },
  restaurant: {
    label: "Restoran",
    icon: Utensils,
    tabs: ['menu', 'reservation'],
    labels: { menu: "Menü", reservation: "Rezervasyon", newItemBtn: "Ekle" },
    fields: {
      menu: ['cuisineType', 'menuLink', 'deliveryApps'],
      reservation: ['tableCapacity', 'depositRequired', 'specialEvents']
    }
  }
};