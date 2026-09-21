const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
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
  date: {
    type: String,
    required: true,
    index: true, // e.g. '2026-09-12'
  },
  session: {
    type: String,
    enum: ['MORNING', 'EVENING', 'FULL_DAY'],
    default: 'MORNING',
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'COMPLETED'],
    default: 'ACTIVE',
    index: true,
  },
  isPaused: {
    type: Boolean,
    default: false,
  },
  pauseReason: {
    type: String,
    default: '',
  },
  pausedAt: {
    type: Date,
  },

  // Real-time Token Tracking
  currentTokenNumber: {
    type: String,
    default: 'None',
  },
  currentTokenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
  },
  nextTokenNumber: {
    type: String,
    default: 'None',
  },
  totalTokensIssued: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalTokensCompleted: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalEmergencyTokens: {
    type: Number,
    default: 0,
    min: 0,
  },

  // Configuration
  operatingHours: {
    startTime: { type: String, default: '09:00 AM' },
    endTime: { type: String, default: '01:00 PM' },
  },
  regularTokenSettings: {
    maxTokens: { type: Number, default: 50 },
    estimatedMinutesPerPatient: { type: Number, default: 10 },
    allowWalkIn: { type: Boolean, default: true },
  },
  emergencyTokenSettings: {
    maxEmergencyTokens: { type: Number, default: 10 },
    allowEmergency: { type: Boolean, default: true },
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

queueSchema.pre('save', function () {
  if (!this.id) {
    this.id = `queue-${this._id ? this._id.toString() : Date.now()}`;
  }
});

module.exports = mongoose.models.Queue || mongoose.model('Queue', queueSchema);
