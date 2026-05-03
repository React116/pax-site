const Appointment = require('../models/Appointment');
const Service     = require('../models/Service');
const Staff       = require('../models/Staff');

/**
 * Bir günün çalışma saatlerini parse eder.
 * workingHours: JSON string  { "monday": { "open": "09:00", "close": "18:00", "closed": false }, ... }
 * Gün adları: monday, tuesday, wednesday, thursday, friday, saturday, sunday
 */
const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const parseWorkingHours = (workingHoursJson, date) => {
  try {
    const hours = typeof workingHoursJson === 'string'
      ? JSON.parse(workingHoursJson)
      : (workingHoursJson || {});
    const dayName = DAY_NAMES[new Date(date).getDay()];
    const day = hours[dayName];
    if (!day || day.closed) return null; // kapalı
    return { open: day.open || '09:00', close: day.close || '18:00' };
  } catch {
    return { open: '09:00', close: '18:00' }; // fallback
  }
};

/**
 * "HH:MM" string'ini o günün Date nesnesine çevirir.
 */
const toDateOnDay = (timeStr, baseDate) => {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
};

/**
 * Verilen gün için müsait slotları döner.
 *
 * @param {Object} params
 * @param {string} params.businessId
 * @param {string} params.date          - "YYYY-MM-DD"
 * @param {number} params.durationMinutes
 * @param {string} [params.staffId]     - opsiyonel
 * @param {Object} params.businessWorkingHours - BusinessProfile.workingHours
 * @param {string} [params.staffWorkingHours]  - Staff.workingHours (opsiyonel)
 * @returns {Array<{ start: Date, end: Date, startStr: string, endStr: string }>}
 */
const getAvailableSlots = async ({ businessId, date, durationMinutes, staffId, businessWorkingHours, staffWorkingHours }) => {
  // Çalışma saatlerini belirle (staff varsa daha kısıtlayıcı olanı al)
  const bizHours  = parseWorkingHours(businessWorkingHours, date);
  if (!bizHours) return []; // işletme o gün kapalı

  const staffHours = staffId && staffWorkingHours
    ? parseWorkingHours(staffWorkingHours, date)
    : null;

  // Efektif açılış/kapanış saati
  const openStr  = staffHours ? (staffHours.open  > bizHours.open  ? staffHours.open  : bizHours.open)  : bizHours.open;
  const closeStr = staffHours ? (staffHours.close < bizHours.close ? staffHours.close : bizHours.close) : bizHours.close;

  const openTime  = toDateOnDay(openStr,  date);
  const closeTime = toDateOnDay(closeStr, date);

  // O gün o işletme/personel için mevcut randevuları çek
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd   = new Date(date); dayEnd.setHours(23, 59, 59, 999);

  const existingFilter = {
    businessId,
    status:    { $nin: ['cancelled'] },
    startTime: { $gte: dayStart, $lte: dayEnd },
  };
  if (staffId) existingFilter.staffId = staffId;

  const existing = await Appointment.find(existingFilter).select('startTime endTime').lean();

  // Slot üret (her durationMinutes dakikada bir)
  const slots = [];
  let cursor = new Date(openTime);

  while (true) {
    const slotEnd = new Date(cursor.getTime() + durationMinutes * 60 * 1000);
    if (slotEnd > closeTime) break;

    // Bu slot mevcut randevularla çakışıyor mu?
    const clash = existing.some(appt => {
      const aStart = new Date(appt.startTime);
      const aEnd   = new Date(appt.endTime);
      return cursor < aEnd && slotEnd > aStart;
    });

    if (!clash) {
      const fmt = (d) => d.toTimeString().slice(0, 5);
      slots.push({ start: new Date(cursor), end: slotEnd, startStr: fmt(cursor), endStr: fmt(slotEnd) });
    }

    cursor = new Date(cursor.getTime() + durationMinutes * 60 * 1000);
  }

  return slots;
};

module.exports = { getAvailableSlots };
