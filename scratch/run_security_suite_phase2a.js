/**
 * CareQueue Phase 2A Security Suite
 * Tests 24 security scenarios
 */

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
        try { json = JSON.parse(data); } catch (e) { json = data; }
        resolve({ status: res.statusCode, data: json });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('=== CareQueue Phase 2A Security Suite ===\n');
  const results = [];
  let pass = 0, fail = 0;

  function record(id, title, status, evidence = '') {
    results.push({ id, title, status, evidence });
    const icon = status === 'PASS' ? 'PASS' : 'FAIL';
    console.log(`[${icon}] ${id}: ${title}`);
    if (status !== 'PASS' && evidence) console.log(`       => ${evidence}`);
    if (status === 'PASS') pass++; else fail++;
  }

  const PATIENT_PHONE = '9876500001';
  const PATIENT_B_PHONE = '9876500002';
  const patientToken = jwt.sign({ userId: 'pat-sec-1', phone: PATIENT_PHONE, role: 'PATIENT', name: 'Security Patient' }, JWT_SECRET, { expiresIn: '1h' });
  const patientBToken = jwt.sign({ userId: 'pat-sec-2', phone: PATIENT_B_PHONE, role: 'PATIENT', name: 'Security Patient B' }, JWT_SECRET, { expiresIn: '1h' });
  const doctorBToken = jwt.sign({ userId: 'doc-sec-B', id: 'doc-sec-B', doctorId: 'doc-sec-B', clinicId: 'doc-sec-B', phone: '8888800002', role: 'DOCTOR', name: 'Dr. Beta' }, JWT_SECRET, { expiresIn: '1h' });
  const adminToken = jwt.sign({ userId: 'admin-sec', email: 'admin@carequeue.com', role: 'SUPER_ADMIN', name: 'Admin Root' }, JWT_SECRET, { expiresIn: '1h' });
  const expiredToken = jwt.sign({ userId: 'exp-user', role: 'DOCTOR' }, JWT_SECRET, { expiresIn: '-1s' });

  const docLogin = await request('POST', '/api/auth/doctor/login', { identifier: '8864856668', isOtp: true });
  const liveDoctorToken = docLogin.data && docLogin.data.token;
  const liveDocId = 'doc-1789897698627';
  const qRes = await request('GET', `/api/doctors/${liveDocId}/active-queue`, null, liveDoctorToken);
  const liveQueueId = qRes.data && qRes.data.queue && (qRes.data.queue._id || qRes.data.queue.id);
  console.log('Live Queue ID:', liveQueueId);
  console.log('Live Doctor Token:', liveDoctorToken ? 'Yes' : 'No');
  console.log('');

  // SECTION 1: Unauthenticated
  console.log('--- SECTION 1: Unauthenticated Access ---');
  const r1 = await request('GET', '/api/patients');
  record('SEC-001', 'Anonymous GET /api/patients -> 401', r1.status === 401 ? 'PASS' : 'FAIL', `Got: ${r1.status}`);

  const r2 = await request('GET', '/api/patients/search?phone=9876500001');
  record('SEC-002', 'Anonymous GET /api/patients/search -> 401', r2.status === 401 ? 'PASS' : 'FAIL', `Got: ${r2.status}`);

  const r3 = await request('GET', '/api/tokens/my-token?phone=9876500001');
  record('SEC-003', 'Anonymous GET /api/tokens/my-token -> 401', r3.status === 401 ? 'PASS' : 'FAIL', `Got: ${r3.status}`);

  const r4 = await request('POST', `/api/queues/${liveQueueId || 'queue-test'}/call-next`, {});
  record('SEC-004', 'Anonymous POST call-next -> 401', r4.status === 401 ? 'PASS' : 'FAIL', `Got: ${r4.status}`);

  const r5 = await request('PATCH', `/api/queues/${liveQueueId || 'queue-test'}/pause`, {});
  record('SEC-005', 'Anonymous PATCH pause -> 401', r5.status === 401 ? 'PASS' : 'FAIL', `Got: ${r5.status}`);

  const r6 = await request('GET', '/api/tokens/my-token?phone=9876500001', null, expiredToken);
  record('SEC-006', 'Expired JWT -> 403', r6.status === 403 ? 'PASS' : 'FAIL', `Got: ${r6.status}`);

  const r7 = await request('GET', '/api/patients', null, (liveDoctorToken || doctorBToken) + 'tampered');
  record('SEC-007', 'Tampered JWT -> 403', r7.status === 403 ? 'PASS' : 'FAIL', `Got: ${r7.status}`);

  // SECTION 2: Patient role restrictions
  console.log('\n--- SECTION 2: Patient Role Restrictions ---');
  const r8 = await request('GET', '/api/patients', null, patientToken);
  record('SEC-008', 'PATIENT GET /api/patients -> 403', r8.status === 403 ? 'PASS' : 'FAIL', `Got: ${r8.status}`);

  const r9 = await request('POST', `/api/queues/${liveQueueId || 'queue-test'}/call-next`, {}, patientToken);
  record('SEC-009', 'PATIENT POST call-next -> 403', r9.status === 403 ? 'PASS' : 'FAIL', `Got: ${r9.status}`);

  const r10 = await request('PATCH', `/api/queues/${liveQueueId || 'queue-test'}/pause`, {}, patientToken);
  record('SEC-010', 'PATIENT PATCH pause -> 403', r10.status === 403 ? 'PASS' : 'FAIL', `Got: ${r10.status}`);

  const r11 = await request('GET', `/api/patients/search?phone=${PATIENT_PHONE}`, null, patientToken);
  record('SEC-011', 'PATIENT GET /api/patients/search -> 403', r11.status === 403 ? 'PASS' : 'FAIL', `Got: ${r11.status}`);

  // SECTION 3: IDOR
  console.log('\n--- SECTION 3: Patient Token IDOR ---');
  const r12 = await request('GET', `/api/tokens/my-token?phone=${PATIENT_PHONE}`, null, patientToken);
  record('SEC-012', 'Patient A reads own token (not 403)', r12.status !== 403 ? 'PASS' : 'FAIL', `Got: ${r12.status}`);

  const r13 = await request('GET', `/api/tokens/my-token?phone=${PATIENT_B_PHONE}`, null, patientToken);
  record('SEC-013', 'Patient A reads Patient B token -> 403', r13.status === 403 ? 'PASS' : 'FAIL', `Got: ${r13.status}`);

  // SECTION 4: Cross-doctor queue isolation
  console.log('\n--- SECTION 4: Cross-Doctor Queue Isolation ---');
  if (liveQueueId) {
    const r14 = await request('POST', `/api/queues/${liveQueueId}/call-next`, {}, doctorBToken);
    record('SEC-014', 'Doctor B call-next on Doctor A queue -> 403', r14.status === 403 ? 'PASS' : 'FAIL', `Got: ${r14.status}`);

    const r15 = await request('PATCH', `/api/queues/${liveQueueId}/pause`, {}, doctorBToken);
    record('SEC-015', 'Doctor B pause Doctor A queue -> 403', r15.status === 403 ? 'PASS' : 'FAIL', `Got: ${r15.status}`);

    const r16 = await request('PATCH', `/api/queues/${liveQueueId}/resume`, {}, doctorBToken);
    record('SEC-016', 'Doctor B resume Doctor A queue -> 403', r16.status === 403 ? 'PASS' : 'FAIL', `Got: ${r16.status}`);

    const r17 = await request('POST', `/api/queues/${liveQueueId}/call-next`, {}, liveDoctorToken);
    record('SEC-017', 'Live Doctor A call-next own queue -> 200', r17.status === 200 ? 'PASS' : 'FAIL', `Got: ${r17.status}`);

    const r18p = await request('PATCH', `/api/queues/${liveQueueId}/pause`, { reason: 'Admin test' }, adminToken);
    const r18r = await request('PATCH', `/api/queues/${liveQueueId}/resume`, {}, adminToken);
    record('SEC-018', 'Super Admin pause/resume any queue -> 200', r18p.status === 200 && r18r.status === 200 ? 'PASS' : 'FAIL', `Pause:${r18p.status} Resume:${r18r.status}`);
  } else {
    ['SEC-014','SEC-015','SEC-016','SEC-017','SEC-018'].forEach(id => record(id, id + ' (no live queue)', 'FAIL', 'No live queue available'));
  }

  // SECTION 5: Cancel ownership
  console.log('\n--- SECTION 5: Cancel Token Ownership ---');
  const bookRes = await request('POST', '/api/tokens/regular', {
    doctorId: liveDocId, patientName: 'Security Test', patientPhone: PATIENT_PHONE,
    patientAge: 30, patientGender: 'MALE', condition: 'Security Test'
  });
  const bookedTokenId = bookRes.data && bookRes.data.token && (bookRes.data.token._id || bookRes.data.token.id);
  const bookedQueueId = bookRes.data && bookRes.data.token && bookRes.data.token.queueId;
  if (bookedTokenId && bookedQueueId) {
    const r19 = await request('PATCH', `/api/queues/${bookedQueueId}/tokens/${bookedTokenId}/cancel`, { reason: 'Attack' }, patientBToken);
    record('SEC-019', 'Patient B cancel Patient A token -> 403', r19.status === 403 ? 'PASS' : 'FAIL', `Got: ${r19.status}`);
    const r20 = await request('PATCH', `/api/queues/${bookedQueueId}/tokens/${bookedTokenId}/cancel`, { reason: 'Self cancel' }, patientToken);
    record('SEC-020', 'Patient A cancel own token -> 200', r20.status === 200 ? 'PASS' : 'FAIL', `Got: ${r20.status}`);
  } else {
    record('SEC-019', 'Patient B cancel Patient A token -> 403', 'FAIL', `Could not book token: ${bookRes.status}`);
    record('SEC-020', 'Patient A cancel own token -> 200', 'FAIL', 'No token available');
  }

  // SECTION 6: Socket.IO JWT enforcement
  console.log('\n--- SECTION 6: Socket.IO JWT Enforcement ---');

  let unauthRejected = false;
  await new Promise(resolve => {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false });
    s.on('connect', () => { s.disconnect(); resolve(); });
    s.on('connect_error', () => { unauthRejected = true; s.disconnect(); resolve(); });
    setTimeout(resolve, 3000);
  });
  record('SEC-021', 'Unauthenticated socket -> rejected', unauthRejected ? 'PASS' : 'FAIL', `Rejected: ${unauthRejected}`);

  let validConnected = false;
  await new Promise(resolve => {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false, auth: { token: liveDoctorToken || adminToken } });
    s.on('connect', () => { validConnected = true; s.disconnect(); resolve(); });
    s.on('connect_error', () => { resolve(); });
    setTimeout(resolve, 3000);
  });
  record('SEC-022', 'Valid JWT socket -> connected', validConnected ? 'PASS' : 'FAIL', `Connected: ${validConnected}`);

  let expiredRejected = false;
  await new Promise(resolve => {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false, auth: { token: expiredToken } });
    s.on('connect', () => { s.disconnect(); resolve(); });
    s.on('connect_error', () => { expiredRejected = true; s.disconnect(); resolve(); });
    setTimeout(resolve, 3000);
  });
  record('SEC-023', 'Expired JWT socket -> rejected', expiredRejected ? 'PASS' : 'FAIL', `Rejected: ${expiredRejected}`);

  // SECTION 7: Super Admin access
  console.log('\n--- SECTION 7: Super Admin Access ---');
  const r24 = await request('GET', '/api/patients', null, adminToken);
  record('SEC-024', 'Super Admin GET /api/patients -> 200', r24.status === 200 ? 'PASS' : 'FAIL', `Got: ${r24.status}`);

  const total = pass + fail;
  console.log(`\n=== PHASE 2A RESULTS: ${pass}/${total} PASSED ===`);
  if (fail > 0) {
    console.log('\nFAILED:');
    results.filter(r => r.status !== 'PASS').forEach(r => console.log(`  [${r.id}] ${r.title} => ${r.evidence}`));
  }
  return { pass, fail, total };
}

run().then(s => process.exit(s.fail > 0 ? 1 : 0)).catch(e => { console.error(e); process.exit(1); });
