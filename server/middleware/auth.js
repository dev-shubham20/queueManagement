const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'carequeue_super_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }


  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch {
      // Proceed unauthenticated if token is invalid in optional context
    }
  }
  next();
}

function requireRole(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const userRole = (req.user.role || '').toUpperCase();
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
        currentRole: req.user.role,
      });
    }
    next();
  };
}

function canManageQueue(queue, user) {
  if (!queue || !user) return false;
  const role = (user.role || '').toUpperCase();
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true;

  if (role !== 'DOCTOR' && role !== 'CLINIC' && role !== 'RECEPTIONIST' && role !== 'STAFF') {
    return false;
  }

  const userDocIds = [user.doctorId, user.userId, user.id, user.clinicId]
    .filter(Boolean)
    .map(id => id.toString());
  const queueDocIds = [queue.doctorId, queue.clinicId]
    .filter(Boolean)
    .map(id => id.toString());

  if (userDocIds.some(uId => queueDocIds.includes(uId))) {
    return true;
  }

  // Also support matching by phone if doctorId is not explicitly set in JWT
  if (user.phone) {
    const cleanUserPhone = String(user.phone).replace(/\D/g, '');
    if (queue.doctorPhone && String(queue.doctorPhone).replace(/\D/g, '') === cleanUserPhone) {
      return true;
    }
    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(__dirname, '..', 'data.json');
      if (fs.existsSync(dataFile)) {
        const db = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        const matchedDoc = (db.doctors || []).find(d => String(d.phone).replace(/\D/g, '') === cleanUserPhone);
        if (matchedDoc && (queueDocIds.includes(String(matchedDoc.id)) || queueDocIds.includes(String(matchedDoc._id)))) {
          return true;
        }
        if (role === 'RECEPTIONIST' || role === 'STAFF') {
          const matchedRec = (db.receptionists || []).find(r => String(r.phone).replace(/\D/g, '') === cleanUserPhone || r.id === user.id || r.id === user.userId);
          if (matchedRec) {
            const recClinicIds = [matchedRec.clinicId, matchedRec.authorizedByDoctorId].filter(Boolean).map(String);
            if (recClinicIds.some(rcId => queueDocIds.includes(rcId))) {
              return true;
            }
          }
        }
      }
    } catch {
      // Ignore if fallback file read fails
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Permission normalization — maps legacy flat strings to canonical colon-style
// and vice-versa so callers only need to specify the canonical name.
// ---------------------------------------------------------------------------
const PERMISSION_ALIASES = {
  'token:create':           ['token_issue', 'walkin_create'],
  'token:create_emergency': ['token_issue'],
  'token:cancel':           ['token_cancel'],
  'queue:pause':            ['queue_manage'],
  'queue:resume':           ['queue_manage'],
  'queue:view':             ['queue_manage', 'queue_view'],
  'patient:search':         ['patient_records'],
  'patient:create':         ['patient_records'],
};

/**
 * Check whether a user (JWT payload or Receptionist record) holds a given
 * canonical permission.  Checks both the canonical string AND any known
 * legacy/alias equivalents so the codebase only needs to use canonical names.
 *
 * @param {object} user  - req.user or a receptionist record
 * @param {string} perm  - canonical permission e.g. 'token:create'
 * @returns {boolean}
 */
function hasPermission(user, perm) {
  if (!user) return false;
  const role = (user.role || '').toUpperCase();
  // SUPER_ADMIN and ADMIN have all permissions
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true;
  // DOCTOR and CLINIC have all clinic permissions
  if (role === 'DOCTOR' || role === 'CLINIC') return true;

  const userPerms = Array.isArray(user.permissions) ? user.permissions : [];
  // Direct match
  if (userPerms.includes(perm)) return true;
  // Alias/legacy match
  const aliases = PERMISSION_ALIASES[perm] || [];
  return aliases.some(a => userPerms.includes(a));
}

/**
 * Middleware to ensure the calling provider (Doctor/Clinic) is not suspended.
 * If user is SUPER_ADMIN, PATIENT, or RECEPTIONIST, they pass through (receptionist suspension checked separately if applicable).
 * If user is DOCTOR or CLINIC, checks if their status or approvalStatus is SUSPENDED.
 */
async function requireActiveProvider(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const role = (req.user.role || '').toUpperCase();
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return next();
  }

  // Check if token explicitly carries SUSPENDED approvalStatus or status
  if (req.user.status === 'SUSPENDED' || req.user.approvalStatus === 'SUSPENDED') {
    return res.status(403).json({ error: 'Doctor account is currently suspended.' });
  }

  if (role === 'DOCTOR' || role === 'CLINIC') {
    const docId = String(req.user.doctorId || req.user.userId || req.user.id || '');
    const cleanPhone = String(req.user.phone || '').replace(/\D/g, '');

    try {
      const mongoose = require('mongoose');
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        const Doctor = mongoose.models.Doctor || require('../models/Doctor');
        const filter = [];
        if (docId) {
          filter.push({ id: docId });
          if (docId.match(/^[0-9a-fA-F]{24}$/)) {
            filter.push({ _id: docId });
          }
        }
        if (cleanPhone) {
          filter.push({ phone: cleanPhone });
        }
        if (req.user.userId && String(req.user.userId).match(/^[0-9a-fA-F]{24}$/)) {
          filter.push({ userId: req.user.userId });
        }
        if (filter.length > 0) {
          const doc = await Doctor.findOne({ $or: filter });
          if (doc && (doc.status === 'SUSPENDED' || doc.approvalStatus === 'SUSPENDED')) {
            return res.status(403).json({ error: 'Doctor account is currently suspended.' });
          }
        }
      }
    } catch (err) {
      // Fallback check continues
    }

    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(__dirname, '..', 'data.json');
      if (fs.existsSync(dataFile)) {
        const db = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        const matchedDoc = (db.doctors || []).find(d =>
          (docId && (String(d.id) === docId || String(d._id) === docId)) ||
          (cleanPhone && String(d.phone).replace(/\D/g, '') === cleanPhone)
        );
        if (matchedDoc && (matchedDoc.status === 'SUSPENDED' || matchedDoc.approvalStatus === 'SUSPENDED')) {
          return res.status(403).json({ error: 'Doctor account is currently suspended.' });
        }
      }
    } catch {
      // Ignore if fallback file read fails
    }
  }

  next();
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  canManageQueue,
  hasPermission,
  requireActiveProvider,
  JWT_SECRET,
};

