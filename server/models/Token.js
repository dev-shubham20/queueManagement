const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
  },
  tokenNumber: {
    type: String,
    required: true,
    index: true, // e.g. 'TK-01', 'EM-01'
  },
  tokenType: {
    type: String,
    enum: ['REGULAR', 'EMERGENCY'],
    default: 'REGULAR',
    index: true,
  },
  queueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true,
    index: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true,
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
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
    index: true,
  },
  patientAge: {
    type: Number,
    default: 30,
  },
  patientGender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    default: 'OTHER',
  },
  condition: {
    type: String,
    default: 'General Consultation',
  },
  source: {
    type: String,
    enum: ['APP_BOOKING', 'WALK_IN_RECEPTIONIST'],
    default: 'APP_BOOKING',
  },
  priority: {
    type: Number,
    default: 1, // 0 = Emergency (priority override), 1 = Regular
    index: true,
  },
  status: {
    type: String,
    enum: ['WAITING', 'CALLED', 'SERVING', 'COMPLETED', 'SKIPPED', 'CANCELLED'],
    default: 'WAITING',
    index: true,
  },
  positionAhead: {
    type: Number,
    default: 0,
    min: 0,
  },
  estimatedWaitMinutes: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  calledAt: {
    type: Date,
  },
  servingStartedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
    default: '',
  },
  createdByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    },
  },
});

tokenSchema.pre('save', function () {
  if (!this.id) {
    this.id = `tk-${this._id ? this._id.toString() : Date.now()}`;
  }
});

module.exports = mongoose.models.Token || mongoose.model('Token', tokenSchema);
