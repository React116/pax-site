const BusinessProfile = require('../../models/BusinessProfile');
const Service         = require('../../models/Service');
const Staff           = require('../../models/Staff');

/**
 * İşletme verilerinden AI sistem promptu oluşturur.
 * Tüm cevaplar sadece bu verilere dayanır — uydurma yapmaz.
 */
const buildBusinessPrompt = async (businessId) => {
  const [profile, services, staff] = await Promise.all([
    BusinessProfile.findById(businessId).lean(),
    Service.find({ businessId, isActive: true }).lean(),
    Staff.find({ businessId, isActive: true }).lean(),
  ]);

  if (!profile) throw new Error('İşletme profili bulunamadı.');

  const tone = {
    professional: 'Profesyonel, resmi ve güven verici bir ton kullan.',
    friendly:     'Samimi, sıcak ve arkadaşça bir ton kullan.',
    luxury:       'Sofistike, özel ve premium bir ton kullan.',
    energetic:    'Enerjik, dinamik ve motive edici bir ton kullan.',
    calm:         'Sakin, anlayışlı ve dinlendirici bir ton kullan.',
  }[profile.brandTone || 'professional'];

  // Çalışma saatlerini okunabilir hale getir
  let workingHoursText = '';
  try {
    const wh = typeof profile.workingHours === 'string'
      ? JSON.parse(profile.workingHours)
      : (profile.workingHours || {});
    const dayMap = { monday:'Pazartesi', tuesday:'Salı', wednesday:'Çarşamba', thursday:'Perşembe', friday:'Cuma', saturday:'Cumartesi', sunday:'Pazar', pzt:'Pazartesi', sali:'Salı', cars:'Çarşamba', pers:'Perşembe', cuma:'Cuma', cmt:'Cumartesi', paz:'Pazar' };
    const lines = Object.entries(wh)
      .map(([day, val]) => {
        const label = dayMap[day] || day;
        if (val?.closed === false || val?.open === false) return `${label}: Kapalı`;
        const start = val?.start || val?.open_time || '09:00';
        const end   = val?.end   || val?.close_time || '18:00';
        return `${label}: ${start} - ${end}`;
      });
    workingHoursText = lines.join('\n');
  } catch { workingHoursText = 'Belirtilmemiş'; }

  // Hizmetler
  const servicesText = services.length > 0
    ? services.map(s =>
        `- ${s.name}${s.durationMinutes ? ` (${s.durationMinutes} dk)` : ''}${s.price > 0 ? ` — ${s.price} ${s.currency}` : ''}${s.description ? `: ${s.description}` : ''}`
      ).join('\n')
    : 'Henüz hizmet eklenmemiş.';

  // Personel
  const staffText = staff.length > 0
    ? staff.map(s => `- ${s.name}${s.role ? ` (${s.role})` : ''}${s.bio ? `: ${s.bio}` : ''}`).join('\n')
    : 'Personel bilgisi girilmemiş.';

  // SSS
  const faqText = Array.isArray(profile.faq) && profile.faq.length > 0
    ? profile.faq.map(f => `S: ${f.question}\nC: ${f.answer}`).join('\n\n')
    : '';

  const systemPrompt = `Sen "${profile.businessName || 'İşletme'}" adlı işletmenin AI asistanısın.
${tone}
Müşterinin dilinde cevap ver. Kısa, doğal ve mesajlaşmaya uygun cevaplar yaz.
Sadece aşağıdaki işletme bilgilerine dayanarak cevap ver. Bilmediğin şeyleri uydurma.

=== İŞLETME BİLGİLERİ ===
Ad: ${profile.businessName || 'Belirtilmemiş'}
Tür: ${profile.businessType || 'Belirtilmemiş'}
Telefon: ${profile.phone || 'Belirtilmemiş'}
E-posta: ${profile.email || 'Belirtilmemiş'}
Adres: ${profile.branches || 'Belirtilmemiş'}
${profile.city ? `Şehir: ${profile.city}` : ''}
${profile.country ? `Ülke: ${profile.country}` : ''}
Web: ${profile.socialMedia?.website || 'Belirtilmemiş'}
Instagram: ${profile.socialMedia?.instagram || 'Belirtilmemiş'}

=== ÇALIŞMA SAATLERİ ===
${workingHoursText}

=== HİZMETLER ===
${servicesText}

=== PERSONEL ===
${staffText}

${faqText ? `=== SIK SORULAN SORULAR ===\n${faqText}` : ''}

=== KURALLAR ===
- Fiyat, hizmet, müsaitlik bilgilerini sadece yukarıdaki verilerden al.
- Bilgi yoksa "Bu konuda sizi daha iyi yönlendirmek için [telefon]'u arayabilirsiniz." de.
- Müşteri randevu almak istiyorsa yönlendir ve gerekli bilgileri topla.
- Müşteri şikayetçiyse veya insan istiyorsa shouldEscalateToHuman: true yap.
- Müşteri fiyat/randevu/hizmet soruyorsa leadTemperature: "hot" yap.

ÇIKTI FORMAT (JSON — başka bir şey yazma):
{
  "replyText": "...",
  "intent": "pricing|appointment|location|working_hours|service_question|complaint|human_request|general",
  "leadTemperature": "hot|warm|cold",
  "shouldCreateLead": true|false,
  "shouldBookAppointment": true|false,
  "appointmentDraft": { "serviceName": "", "preferredDate": "", "preferredTime": "", "staffName": "" },
  "shouldEscalateToHuman": true|false,
  "summary": "kısa özet"
}`;

  return { systemPrompt, profile };
};

module.exports = { buildBusinessPrompt };
