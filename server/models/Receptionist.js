const mongoose = require('mongoose');

const receptionistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true,
  },
  authorizedByDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
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
    index: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'DEACTIVATED'],
    default: 'ACTIVE',
    index: true,
  },
  permissions: {
    type: [String],
    default: [
      'token:create',
      'token:create_emergency',
      'token:cancel',
      'patient:search',
      'patient:create',
      'queue:pause',
      'queue:resume',
      'queue:view',
    ],
  },
  shift: {
    startTime: { type: String, default: '08:00 AM' },
    endTime: { type: String, default: '04:00 PM' },
    workDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  },
  authorizedAt: {
    type: Date,
    default: Date.now,
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

module.exports = mongoose.models.Receptionist || mongoose.model('Receptionist', receptionistSchema);
