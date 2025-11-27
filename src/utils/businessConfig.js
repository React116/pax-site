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
  "Vinyasa Flow",
  "Hatha Yoga",
  "Yin Yoga",
  "Kundalini Yoga",
  "Hamile Yogası",
  "Meditation & Breathwork",
  "Ashtanga Yoga",
  "Power Yoga"
];

export const BUSINESS_TYPES = {
  // --- 1. SAĞLIK & GÜZELLİK ---
  pilates: {
    label: "Pilates Stüdyosu",
    icon: Leaf,
    tabs: ['services', 'staff', 'health'],
    labels: {
      staff: "Eğitmenler",
      services: "Dersler & Paketler",
      newItemBtn: "Yeni Eğitmen Ekle"
    },
    fields: {
      services: [
        { key: 'classTypes', type: 'tags', suggestions: PILATES_SUGGESTIONS, label: 'Ders Türleri (Etiketler)' },
        'classFormat', 
        'duration', 
        'freeTrial', 
        'onlineService'
      ],
      staffSchema: { name: '', title: '', desc: '' }
    }
  },
  yoga: {
    label: "Yoga Stüdyosu",
    icon: Activity, // Flower2 yerine Activity kullandık (Daha güvenli)
    tabs: ['services', 'staff', 'health'],
    labels: {
      staff: "Eğitmenler / Yogi",
      services: "Ders Akışları",
      newItemBtn: "Eğitmen Ekle"
    },
    fields: {
      services: [
        { key: 'classTypes', type: 'tags', suggestions: YOGA_SUGGESTIONS, label: 'Yoga Türleri' },
        'meditation', 
        'duration'
      ],
      staffSchema: { name: '', title: '', desc: '' }
    }
  },
  dental: {
    label: "Diş Kliniği / Poliklinik",
    icon: Stethoscope,
    tabs: ['services', 'staff', 'health'],
    labels: {
      staff: "Hekimler / Doktorlar",
      services: "Tedavi Türleri",
      newItemBtn: "Yeni Hekim Ekle"
    },
    fields: {
      services: ['treatmentTypes', 'insurance', 'emergencyService'],
      staffSchema: { name: '', title: '', desc: '' }
    }
  },
  beauty: {
    label: "Güzellik / Berber / Kuaför",
    icon: Scissors,
    tabs: ['services', 'staff'],
    labels: {
      staff: "Uzmanlar / Stilistler",
      services: "Hizmet Menüsü",
      newItemBtn: "Yeni Uzman Ekle"
    },
    fields: {
      services: ['serviceMenu', 'brandsUsed', 'duration'],
      staffSchema: { name: '', title: '', instagram: '' }
    }
  },
  aesthetic: {
    label: "Estetik / Güzellik Merkezi",
    icon: Smile, // Dna yerine Smile (Standart)
    tabs: ['services', 'staff', 'health'],
    labels: {
      staff: "Uzmanlar / Doktorlar",
      services: "Uygulamalar (Botoks vb.)",
      newItemBtn: "Uzman Ekle"
    },
    fields: {
      services: ['procedures', 'devices', 'consultationFee'],
      staffSchema: { name: '', title: '', desc: '' }
    }
  },
  dietitian: {
    label: "Diyetisyen / Beslenme",
    icon: ShoppingBag,
    tabs: ['services', 'health'],
    labels: {
      staff: "Diyetisyenler",
      services: "Danışmanlık Paketleri",
      newItemBtn: "Diyetisyen Ekle"
    },
    fields: {
      services: ['packageTypes', 'onlineConsultation', 'bodyAnalysis'],
      staffSchema: { name: '', title: '' }
    }
  },
  psychology: {
    label: "Psikolog / Terapi",
    icon: Smile,
    tabs: ['services', 'staff'],
    labels: {
      staff: "Terapistler",
      services: "Seans Türleri",
      newItemBtn: "Terapist Ekle"
    },
    fields: {
      services: ['sessionTypes', 'duration', 'onlineTherapy'],
      staffSchema: { name: '', title: '', approach: '' }
    }
  },

  // --- 2. HUKUK & DANIŞMANLIK ---
  lawyer: {
    label: "Avukatlık / Hukuk Bürosu",
    icon: Gavel,
    tabs: ['services', 'staff'],
    labels: {
      staff: "Avukatlar",
      services: "Uzmanlık Alanları",
      newItemBtn: "Avukat Ekle"
    },
    fields: {
      services: ['practiceAreas', 'consultationFee', 'barAssociation'],
      staffSchema: { name: '', title: '', barNo: '' }
    }
  },
  accountant: {
    label: "Mali Müşavir / Muhasebe",
    icon: Calculator,
    tabs: ['services'],
    labels: {
      services: "Hizmet Kapsamı",
      newItemBtn: "Personel Ekle"
    },
    fields: {
      services: ['companyTypes', 'eInvoice', 'consultancy'],
      staffSchema: { name: '', title: '' }
    }
  },

  // --- 3. TURİZM & HİZMET ---
  rentacar: {
    label: "Rent a Car / Araç Kiralama",
    icon: Car,
    tabs: ['inventory', 'rules'],
    labels: {
      inventory: "Araç Filosu",
      rules: "Kiralama Koşulları",
      newItemBtn: "Yeni Araç Ekle"
    },
    fields: {
      inventory: [],
      rules: ['deposit', 'minAge', 'licenseYear', 'kmLimit']
    }
  },
  hotel: {
    label: "Otel / Villa Kiralama",
    icon: Home, 
    tabs: ['inventory', 'rules'],
    labels: {
      inventory: "Odalar / Villalar",
      rules: "Konaklama Kuralları",
      newItemBtn: "Oda Tipi Ekle"
    },
    fields: {
      inventory: [],
      rules: ['checkInTime', 'checkOutTime', 'petsAllowed', 'deposit']
    }
  },
  restaurant: {
    label: "Restoran / Cafe",
    icon: Utensils,
    tabs: ['menu', 'reservation'],
    labels: {
      menu: "Menü & Mutfak",
      reservation: "Rezervasyon Ayarları",
      newItemBtn: "Menü Kategorisi Ekle"
    },
    fields: {
      menu: ['cuisineType', 'menuLink', 'deliveryApps'],
      reservation: ['tableCapacity', 'depositRequired', 'specialEvents']
    }
  }
};