const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: '1 tablet' },
  duration: { type: String, default: '5 days' },
  instructions: { type: String, default: 'After meals' },
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  diagnosis: { type: String, default: '' },
  notes: { type: String, default: '' },
  medicines: [medicineSchema],
  prescribedAt: { type: Date, default: Date.now },
}, { _id: false });

const appointmentSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
  },
  token: {
    type: String,
    required: true,
    trim: true,
  },
  doctorId: {
    type: String,
    required: true,
    trim: true,
  },
  doctorName: {
    type: String,
    required: true,
    trim: true,
  },
  clinicName: {
    type: String,
    trim: true,
    default: '',
  },
  specialty: {
    type: String,
    trim: true,
    default: 'General Physician',
  },
  patientId: {
    type: String,
    trim: true,
    default: '',
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  patientPhone: {
    type: String,
    required: true,
    trim: true,
  },
  condition: {
    type: String,
    trim: true,
    default: 'General Consultation',
  },
  appointmentDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  session: {
    type: String,
    default: 'Morning',
  },
  fee: {
    type: String,
    default: '₹500',
  },
  positionAhead: {
    type: Number,
    default: 0,
    min: 0,
  },
  expectedTime: {
    type: String,
    default: 'In ~20 mins',
  },
  treatmentStatus: {
    type: String,
    enum: ['WAITING', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED'],
    default: 'WAITING',
  },
  paymentStatus: {
    type: String,
    enum: ['AT_CLINIC', 'PAID', 'PENDING'],
    default: 'AT_CLINIC',
  },
  prescription: prescriptionSchema,
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      if (!ret.id && ret._id) ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

appointmentSchema.pre('save', function () {
  if (!this.id) {
    this.id = 'apt-' + (this._id ? this._id.toString() : Date.now());
  }
});

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
