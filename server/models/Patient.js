const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 130,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    default: 'MALE',
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  assignedDoctorId: {
    type: String,
    trim: true,
    default: '',
  },
  assignedDoctorName: {
    type: String,
    trim: true,
    default: '',
  },
  clinicName: {
    type: String,
    trim: true,
    default: '',
  },
  tokenNumber: {
    type: String,
    trim: true,
    default: '',
  },
  treatmentStatus: {
    type: String,
    enum: ['IN_CONSULTATION', 'WAITING', 'COMPLETED', 'REGISTERED'],
    default: 'REGISTERED',
  },
  condition: {
    type: String,
    trim: true,
    default: 'General Consultation',
  },
  lastVisitDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  totalVisits: {
    type: Number,
    default: 1,
    min: 1,
  },
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

patientSchema.pre('save', function () {
  if (!this.id) {
    this.id = 'pat-' + (this._id ? this._id.toString() : Date.now());
  }
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
