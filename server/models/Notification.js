const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true,
  },
  userId: {
    type: String,
    default: '',
  },
  targetPhone: {
    type: String,
    trim: true,
    default: '',
  },
  targetRole: {
    type: String,
    enum: ['PATIENT', 'DOCTOR', 'SUPER_ADMIN', 'STAFF', 'ALL'],
    default: 'ALL',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['CALL', 'REMINDER', 'SUCCESS', 'DELAY', 'INFO'],
    default: 'INFO',
  },
  isRead: {
    type: Boolean,
    default: false,
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

notificationSchema.pre('save', function () {
  if (!this.id) {
    this.id = 'notif-' + (this._id ? this._id.toString() : Date.now());
  }
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
