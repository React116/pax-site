const Appointment = require('../models/Appointment');
const Service     = require('../models/Service');
const Staff       = require('../models/Staff');
const { getAvailableSlots } = require('../services/availabilityService');

const isProd = process.env.NODE_ENV === 'production';

// GET /api/appointments
const getAppointments = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 20);
    const skip   = (page - 1) * limit;

    const filter = { businessId: req.businessId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.staffId) filter.staffId = req.query.staffId;

    // Tarih filtresi: from=YYYY-MM-DD&to=YYYY-MM-DD
    if (req.query.from || req.query.to) {
      filter.startTime = {};
      if (req.query.from) filter.startTime.$gte = new Date(req.query.from);
      if (req.query.to)   filter.startTime.$lte = new Date(req.query.to + 'T23:59:59');
    }

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('serviceId', 'name durationMinutes price currency')
        .populate('staffId', 'name role')
        .sort({ startTime: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    res.json({ appointments, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    if (!isProd) console.error('Randevu listesi hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { customerName, phone, email, serviceId, staffId, startTime, notes, sourceChannel } = req.body;

    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2)
      return res.status(400).json({ message: 'Müşteri adı gereklidir.' });
    if (!startTime)
      return res.status(400).json({ message: 'Başlangıç zamanı gereklidir.' });

    // Bitiş zamanını servis süresine göre hesapla
    let endTime = req.body.endTime;
    if (!endTime && serviceId) {
      const service = await Service.findOne({ _id: serviceId, businessId: req.businessId }).lean();
      if (service) {
        endTime = new Date(new Date(startTime).getTime() + service.durationMinutes * 60 * 1000);
      }
    }
    if (!endTime) {
      // Servis yoksa 1 saat varsayılan
      endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000);
    }

    // Staff işletmeye ait mi?
    if (staffId) {
      const staffMember = await Staff.findOne({ _id: staffId, businessId: req.businessId }).lean();
      if (!staffMember) return res.status(400).json({ message: 'Personel bulunamadı.' });
    }

    const appointment = await Appointment.create({
      businessId: req.businessId,
      customerName: customerName.trim(),
      phone:         phone?.trim()  || '',
      email:         email?.toLowerCase().trim() || '',
      serviceId:     serviceId  || undefined,
      staffId:       staffId    || undefined,
      startTime:     new Date(startTime),
      endTime:       new Date(endTime),
      notes:         notes?.trim() || '',
      sourceChannel: sourceChannel || 'manual',
    });

    const populated = await appointment.populate([
      { path: 'serviceId', select: 'name durationMinutes price currency' },
      { path: 'staffId',   select: 'name role' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    if (!isProd) console.error('Randevu oluşturma hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// PUT /api/appointments/:appointmentId
const updateAppointment = async (req, res) => {
  try {
    const allowed = ['customerName', 'phone', 'email', 'serviceId', 'staffId', 'startTime', 'endTime', 'status', 'notes'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.appointmentId, businessId: req.businessId },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate([
      { path: 'serviceId', select: 'name durationMinutes price currency' },
      { path: 'staffId',   select: 'name role' },
    ]);

    if (!appointment) return res.status(404).json({ message: 'Randevu bulunamadı.' });
    res.json(appointment);
  } catch (err) {
    if (!isProd) console.error('Randevu güncelleme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// DELETE /api/appointments/:appointmentId
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.appointmentId,
      businessId: req.businessId,
    });
    if (!appointment) return res.status(404).json({ message: 'Randevu bulunamadı.' });
    res.json({ message: 'Randevu silindi.' });
  } catch (err) {
    if (!isProd) console.error('Randevu silme hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// GET /api/appointments/availability
const getAvailability = async (req, res) => {
  try {
    const { date, serviceId, staffId } = req.query;

    if (!date) return res.status(400).json({ message: 'date parametresi gereklidir. (YYYY-MM-DD)' });

    let durationMinutes = 60;
    let staffWorkingHours = null;

    if (serviceId) {
      const service = await Service.findOne({ _id: serviceId, businessId: req.businessId }).lean();
      if (service) durationMinutes = service.durationMinutes;
    }

    if (staffId) {
      const staffMember = await Staff.findOne({ _id: staffId, businessId: req.businessId }).lean();
      if (staffMember) staffWorkingHours = staffMember.workingHours;
    }

    const slots = await getAvailableSlots({
      businessId: req.businessId,
      date,
      durationMinutes,
      staffId,
      businessWorkingHours: req.business.workingHours,
      staffWorkingHours,
    });

    res.json({ date, durationMinutes, slots });
  } catch (err) {
    if (!isProd) console.error('Müsaitlik hatası:', err.message);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getAppointments, createAppointment, updateAppointment, deleteAppointment, getAvailability };
