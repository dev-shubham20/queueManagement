const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['INDIVIDUAL', 'CLINIC'],
    default: 'INDIVIDUAL',
    required: true,
  },

  // Practitioner Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  medicalRegNumber: {
    type: String,
    trim: true,
    default: '',
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  qualifications: {
    type: String,
    default: 'MBBS',
  },
  experience: {
    type: String,
    default: '5 years',
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: '',
  },
  about: {
    type: String,
    default: '',
  },

  // Clinic / Hospital Information
  clinicName: {
    type: String,
    trim: true,
    default: '',
  },
  clinicType: {
    type: String,
    enum: ['clinic', 'hospital', 'private_practice'],
    default: 'clinic',
  },
  address: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: 'Bangalore',
  },
  contactNumber: {
    type: String,
    default: '',
  },
  whatsappNumber: {
    type: String,
    default: '',
  },
  establishedYear: {
    type: String,
    default: '',
  },
  specialties: {
    type: [String],
    default: [],
  },
  consultationFee: {
    type: String,
    default: '₹500',
  },
  payAtReception: {
    type: Boolean,
    default: true,
  },

  // Clinic Owner Details (for Clinic/Hospital account)
  ownerName: {
    type: String,
    default: '',
  },
  ownerPhone: {
    type: String,
    default: '',
  },
  ownerEmail: {
    type: String,
    default: '',
  },
  aadhaarNumber: {
    type: String,
    default: '',
  },
  panNumber: {
    type: String,
    default: '',
  },

  // Working Hours & Queue Configuration
  workingHours: {
    morningSession: { type: Boolean, default: true },
    eveningSession: { type: Boolean, default: true },
    morningOffs: { type: [String], default: ['Sun'] },
    eveningOffs: { type: [String], default: ['Sun'] },
    maxTokensMorning: { type: Number, default: 40 },
    maxTokensEvening: { type: Number, default: 30 },
    avgConsultationTime: { type: String, default: '10 Minutes' },
    allowWalkIn: { type: Boolean, default: true },
  },

  // ===== APPROVAL LIFECYCLE & OPERATIONAL STATUS =====
  // Operational toggle (ACTIVE = accepting queue, DEACTIVATED = paused, SUSPENDED = locked by admin)
  status: {
    type: String,
    enum: ['ACTIVE', 'DEACTIVATED', 'SUSPENDED'],
    default: 'DEACTIVATED',
  },
  // Super Admin approval lifecycle (PENDING = awaiting review, APPROVED = authorized, REJECTED = declined, SUSPENDED = frozen)
  approvalStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
    default: 'PENDING',
    index: true,
  },
  rejectionReason: {
    type: String,
    default: '',
  },
  approvedAt: {
    type: Date,
  },
  approvedBy: {
    type: String,
    default: '',
  },
  rejectedAt: {
    type: Date,
  },
  rejectedBy: {
    type: String,
    default: '',
  },

  // Live Queue Metrics
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  patientsCurrentlyTreating: {
    type: Number,
    default: 0,
    min: 0,
  },
  waitingQueueCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalPatientsTreated: {
    type: Number,
    default: 0,
    min: 0,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
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

// Auto-assign custom id if not provided
doctorSchema.pre('save', function () {
  if (!this.id) {
    this.id = 'doc-' + (this._id ? this._id.toString() : Date.now());
  }
});

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
