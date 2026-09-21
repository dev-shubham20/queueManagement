const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    trim: true,
    default: 'User',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    select: false, // Do not include in queries by default
  },
  role: {
    type: String,
    enum: [
      'patient', 'doctor', 'clinic', 'receptionist', 'staff', 'super_admin',
      'PATIENT', 'DOCTOR', 'CLINIC', 'RECEPTIONIST', 'STAFF', 'SUPER_ADMIN'
    ],
    default: 'PATIENT',
    index: true,
  },
  status: {
    type: String,
    enum: [
      'approved', 'pending', 'rejected', 'suspended',
      'APPROVED', 'PENDING', 'REJECTED', 'SUSPENDED'
    ],
    default: 'APPROVED',
    index: true,
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  permissions: {
    type: [String],
    default: [], // e.g., ['token:create', 'token:create_emergency', 'queue:pause', 'queue:resume', 'patient:search']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Pre-save hook: Hash password securely if modified
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Return safe user object without password
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
