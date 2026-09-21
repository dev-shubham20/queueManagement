const http = require('http');
const jwt = require('jsonwebtoken');
const { io } = require('socket.io-client');

require('dotenv').config();
const BASE_URL = 'http://localhost:5001';
const JWT_SECRET = process.env.JWT_SECRET || 'carequeue_super_secret_jwt_key_2026';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runSecurityAudit() {
  console.log('====================================================');
  console.log('       STARTING DEEP SECURITY & PRIVACY AUDIT       ');
  console.log('====================================================\n');

  const findings = [];
  function recordSec(id, title, category, severity, pass, details) {
    findings.push({ id, title, category, severity, pass, details });
    const tag = pass ? '[SEC-PASS]' : '[SEC-FAIL]';
    console.log(`${tag} ${id}: ${title} -> ${pass ? 'SECURE' : 'VULNERABLE'} (${severity})`);
    if (details) console.log(`       Details: ${details}`);
  }

  // Generate valid test JWTs for each role
  const patientToken = jwt.sign({ userId: 'pat-sec-1', phone: '9876500001', role: 'PATIENT', name: 'Security Patient' }, JWT_SECRET, { expiresIn: '1h' });
  const doctorAToken = jwt.sign({ userId: 'doc-sec-A', id: 'doc-sec-A', doctorId: 'doc-sec-A', phone: '8888800001', role: 'DOCTOR', name: 'Dr. Alpha' }, JWT_SECRET, { expiresIn: '1h' });
  const doctorBToken = jwt.sign({ userId: 'doc-sec-B', id: 'doc-sec-B', doctorId: 'doc-sec-B', phone: '8888800002', role: 'DOCTOR', name: 'Dr. Beta' }, JWT_SECRET, { expiresIn: '1h' });
  const receptionistToken = jwt.sign({ userId: 'rec-sec-1', phone: '7777700001', role: 'RECEPTIONIST', name: 'Staff Ritu', permissions: ['token_issue'] }, JWT_SECRET, { expiresIn: '1h' });
  const adminToken = jwt.sign({ userId: 'admin-sec', email: 'admin@carequeue.com', role: 'SUPER_ADMIN', name: 'Admin Root' }, JWT_SECRET, { expiresIn: '1h' });

  // Expired and tampered tokens
  const expiredToken = jwt.sign({ userId: 'pat-exp', role: 'PATIENT' }, JWT_SECRET, { expiresIn: '-1s' });
  const tamperedToken = patientToken.slice(0, -5) + 'xxxxx';
  const backdoorToken = 'local-admin-bypass-token';

  // --- SECTION 1: AUTHENTICATION & JWT VALIDATION ---
  console.log('\n--- 1. AUTHENTICATION & JWT INTEGRITY ---');

  // SEC-01: Backdoor Token Bypass (local-*)
  const bRes = await request('POST', '/api/queues/queue-test/call-next', {}, backdoorToken);
  recordSec('SEC-01', 'Backdoor token bypass rejection (local-*)', 'Authentication', 'Critical', bRes.status === 403 || bRes.status === 401, `Status: ${bRes.status}, Body: ${JSON.stringify(bRes.data)}`);

  // SEC-02: Expired JWT Rejection
  const expRes = await request('POST', '/api/queues/queue-test/call-next', {}, expiredToken);
  recordSec('SEC-02', 'Expired JWT token rejection', 'Authentication', 'High', expRes.status === 403 || expRes.status === 401, `Status: ${expRes.status}`);

  // SEC-03: Tampered Signature Rejection
  const tampRes = await request('POST', '/api/queues/queue-test/call-next', {}, tamperedToken);
  recordSec('SEC-03', 'Tampered JWT signature rejection', 'Authentication', 'High', tampRes.status === 403 || tampRes.status === 401, `Status: ${tampRes.status}`);

  // SEC-04: Empty Authorization Header
  const emptyRes = await request('POST', '/api/queues/queue-test/call-next', {});
  recordSec('SEC-04', 'Unauthenticated request to call-next', 'Authentication', 'Critical', emptyRes.status === 401 || emptyRes.status === 403, `Status: ${emptyRes.status}`);

  // --- SECTION 2: ROLE ESCALATION & ACCESS CONTROL ---
  console.log('\n--- 2. ROLE ESCALATION & ACCESS CONTROL ---');

  // SEC-05: Patient attempting Doctor call-next
  const patCallRes = await request('POST', '/api/queues/queue-test/call-next', {}, patientToken);
  recordSec('SEC-05', 'Patient attempting Doctor call-next', 'Authorization', 'High', patCallRes.status === 403, `Status: ${patCallRes.status}`);

  // SEC-06: Patient attempting Doctor complete token
  const patCompRes = await request('PATCH', '/api/queues/queue-test/tokens/tk-1/complete', {}, patientToken);
  recordSec('SEC-06', 'Patient attempting Doctor complete token', 'Authorization', 'High', patCompRes.status === 403, `Status: ${patCompRes.status}`);

  // SEC-07: Patient attempting Doctor skip token
  const patSkipRes = await request('PATCH', '/api/queues/queue-test/tokens/tk-1/skip', {}, patientToken);
  recordSec('SEC-07', 'Patient attempting Doctor skip token', 'Authorization', 'High', patSkipRes.status === 403, `Status: ${patSkipRes.status}`);

  // SEC-08: Patient attempting Queue pause
  const patPauseRes = await request('PATCH', '/api/queues/queue-test/pause', {}, patientToken);
  recordSec('SEC-08', 'Patient attempting Queue pause', 'Authorization', 'High', patPauseRes.status === 403, `Status: ${patPauseRes.status}`);

  // SEC-09: Patient attempting Super Admin pending providers
  const patAdminRes = await request('GET', '/api/admin/providers/pending', null, patientToken);
  recordSec('SEC-09', 'Patient attempting Super Admin pending providers', 'Authorization', 'Critical', patAdminRes.status === 403, `Status: ${patAdminRes.status}`);

  // SEC-10: Patient attempting Super Admin approve doctor
  const patApproveRes = await request('PATCH', '/api/admin/providers/doc-test/approve', {}, patientToken);
  recordSec('SEC-10', 'Patient attempting Super Admin approve doctor', 'Authorization', 'Critical', patApproveRes.status === 403, `Status: ${patApproveRes.status}`);

  // SEC-11: Receptionist attempting Super Admin approve doctor
  const recApproveRes = await request('PATCH', '/api/admin/providers/doc-test/approve', {}, receptionistToken);
  recordSec('SEC-11', 'Receptionist attempting Super Admin approve doctor', 'Authorization', 'Critical', recApproveRes.status === 403, `Status: ${recApproveRes.status}`);

  // --- SECTION 3: CROSS-TENANT & CROSS-DOCTOR QUEUE ISOLATION ---
  console.log('\n--- 3. CROSS-DOCTOR QUEUE ISOLATION ---');

  // Seed a queue for Doctor A
  const queueARes = await request('GET', '/api/doctors/doc-sec-A/active-queue', null, doctorAToken);
  const queueAId = queueARes.data?.queue?.id || queueARes.data?.queue?._id;

  // SEC-12: Doctor B attempting to mutate Doctor A's queue
  const docBTamperRes = await request('POST', `/api/queues/${queueAId}/call-next`, {}, doctorBToken);
  const isDoctorBlocked = docBTamperRes.status === 403;
  recordSec('SEC-12', 'Doctor B attempting to mutate Doctor A queue (Cross-Doctor Isolation)', 'Authorization', 'High', isDoctorBlocked, `Status: ${docBTamperRes.status}, Body: ${JSON.stringify(docBTamperRes.data)}`);

  // --- SECTION 4: PRIVACY & SENSITIVE DATA EXPOSURE ---
  console.log('\n--- 4. PRIVACY & SENSITIVE DATA EXPOSURE ---');

  // SEC-13: Unauthenticated Access to Patient Health Records (GET /api/patients)
  const patsRes = await request('GET', '/api/patients');
  const patsExposed = patsRes.status === 200 && Array.isArray(patsRes.data) && patsRes.data.length > 0;
  recordSec('SEC-13', 'Unauthenticated access to all patient medical records (GET /api/patients)', 'Privacy', 'Critical', !patsExposed, `Status: ${patsRes.status}, Returned ${Array.isArray(patsRes.data) ? patsRes.data.length : 0} patient records unauthenticated!`);

  // SEC-14: Aadhaar & PAN Exposure in Doctor Directory (GET /api/doctors)
  const docsRes = await request('GET', '/api/doctors');
  let aadhaarExposed = false;
  if (Array.isArray(docsRes.data)) {
    aadhaarExposed = docsRes.data.some(d => d.aadhaarNumber || d.panNumber || (d.documents && d.documents.some(doc => doc.url && (doc.url.includes('aadhaar') || doc.url.includes('pan')))));
  }
  recordSec('SEC-14', 'Doctor Aadhaar & PAN number exposure in public list (GET /api/doctors)', 'Privacy', 'High', !aadhaarExposed, `Status: ${docsRes.status}, Aadhaar/PAN exposed: ${aadhaarExposed}`);

  // SEC-15: IDOR in Token Tracking (GET /api/tokens/my-token?phone=...)
  // Anyone with a patient phone can query their active medical condition and token without auth
  const idorRes = await request('GET', `/api/tokens/my-token?phone=9876500001`);
  const idorConditionExposed = idorRes.status === 200 && idorRes.data?.activeToken && idorRes.data?.activeToken?.condition;
  recordSec('SEC-15', 'Unauthenticated IDOR: Querying any patient token & medical condition by phone', 'Privacy', 'Medium', !idorConditionExposed, `Status: ${idorRes.status}, Condition exposed: ${idorRes.data?.activeToken?.condition}`);

  // SEC-16: Unauthenticated Token Cancellation (PATCH /api/queues/:queueId/tokens/:tokenId/cancel)
  // Can anyone cancel another patient's token without an auth token?
  const anonCancelRes = await request('PATCH', `/api/queues/${queueAId}/tokens/tk-test/cancel`, { reason: 'Malicious cancel' });
  const anonCancelAllowed = anonCancelRes.status === 200;
  recordSec('SEC-16', 'Unauthenticated arbitrary token cancellation', 'Authorization', 'High', !anonCancelAllowed, `Status: ${anonCancelRes.status}, Anonymous cancel allowed: ${anonCancelAllowed}`);

  // --- SECTION 5: REAL-TIME WEBSOCKET AUTHORIZATION ---
  console.log('\n--- 5. REAL-TIME WEBSOCKET AUTHORIZATION ---');

  // SEC-17: Anonymous client joining private queue room
  let joinedQueueRoom = false;
  try {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false });
    await new Promise((resolve) => {
      s.on('connect', () => {
        s.emit('join_queue', 'queue-private-123');
        joinedQueueRoom = true;
        resolve();
      });
      setTimeout(resolve, 1500);
    });
    s.disconnect();
  } catch (e) {}
  recordSec('SEC-17', 'Unauthenticated client joins any queue broadcast room', 'Real-time Security', 'Medium', !joinedQueueRoom, `Socket joined queue room without auth handshake: ${joinedQueueRoom}`);

  // SEC-18: Anonymous client joining arbitrary patient alert room (join_patient)
  let joinedPatientRoom = false;
  try {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false });
    await new Promise((resolve) => {
      s.on('connect', () => {
        s.emit('join_patient', '9999999999');
        joinedPatientRoom = true;
        resolve();
      });
      setTimeout(resolve, 1500);
    });
    s.disconnect();
  } catch (e) {}
  recordSec('SEC-18', 'Unauthenticated client joins any patient private alert room (join_patient)', 'Real-time Security', 'High', !joinedPatientRoom, `Socket joined patient room without auth handshake: ${joinedPatientRoom}`);

  console.log('\n====================================================');
  console.log(`SECURITY AUDIT SUMMARY: Total Checked: ${findings.length}, Secure (Pass): ${findings.filter(f => f.pass).length}, Vulnerable (Fail): ${findings.filter(f => !f.pass).length}`);
  console.log('====================================================\n');
  return findings;
}

runSecurityAudit().catch(console.error);
