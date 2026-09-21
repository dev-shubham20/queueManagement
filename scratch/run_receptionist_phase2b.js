/**
 * CareQueue Phase 2B Receptionist & Clinic Operations Test Suite
 * Validates receptionist authentication, permission granularity, queue control,
 * token issuance gating, clinic scoping, and cross-doctor protection.
 */

const http = require('http');
const jwt = require('jsonwebtoken');

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
  console.log('=== CareQueue Phase 2B Receptionist Operations Test Suite ===\n');
  const results = [];
  let pass = 0, fail = 0;

  function record(id, title, status, evidence = '') {
    results.push({ id, title, status, evidence });
    const icon = status === 'PASS' ? 'PASS' : 'FAIL';
    console.log(`[${icon}] ${id}: ${title}`);
    if (status !== 'PASS' && evidence) console.log(`       => ${evidence}`);
    if (status === 'PASS') pass++; else fail++;
  }

  // 1. Authenticate primary live Doctor
  const docLogin = await request('POST', '/api/auth/doctor/login', { identifier: '8864856668', isOtp: true });
  const docToken = docLogin.data?.token;
  const docId = docLogin.data?.user?.doctorId || docLogin.data?.user?.id || 'doc-1789897698627';

  if (!docToken) {
    console.error('Failed to log in doctor. Check if server is running.');
    process.exit(1);
  }
  record('P2B-01', 'Doctor Login & Token Generation', 'PASS', `Doctor ID: ${docId}`);

  // Fetch or create Doctor Active Queue
  const qRes = await request('GET', `/api/doctors/${docId}/active-queue`, null, docToken);
  const queueId = qRes.data?.queue?._id || qRes.data?.queue?.id;
  record('P2B-02', 'Fetch Doctor Active Queue', queueId ? 'PASS' : 'FAIL', `Queue ID: ${queueId}`);

  // 2. Authorize a new Receptionist via Doctor API
  const testPhone = '98' + Math.floor(10000000 + Math.random() * 90000000);
  const regRec = await request('POST', '/api/doctors/receptionists', {
    name: 'P2B Test Receptionist',
    phone: testPhone,
    permissions: ['token_issue', 'queue_manage', 'token:create', 'queue:pause', 'queue:resume'],
  }, docToken);

  const recId = regRec.data?.receptionist?.id || regRec.data?.receptionist?._id;
  record('P2B-03', 'Doctor Authorizes New Receptionist', regRec.status === 201 && recId ? 'PASS' : 'FAIL', `Rec ID: ${recId}`);

  // 3. Receptionist Login via /api/auth/doctor/login (Fallback / Mongo)
  const recLogin = await request('POST', '/api/auth/doctor/login', { identifier: testPhone, isOtp: true });
  const recToken = recLogin.data?.token;
  const recUser = recLogin.data?.user;
  const recRole = (recLogin.data?.role || recUser?.role || '').toUpperCase();
  record('P2B-04', 'Receptionist Fallback/DB Login Success', recLogin.status === 200 && recToken && recRole === 'RECEPTIONIST' ? 'PASS' : 'FAIL', `Role: ${recRole}, Token: ${!!recToken}`);

  // 4. Receptionist JWT Claims Check
  const decodedRec = recToken ? jwt.decode(recToken) : null;
  const hasClaims = decodedRec && decodedRec.role === 'RECEPTIONIST' && Array.isArray(decodedRec.permissions);
  record('P2B-05', 'Receptionist JWT Contains Role & Permissions', hasClaims ? 'PASS' : 'FAIL', `Claims: ${JSON.stringify({ role: decodedRec?.role, permissions: decodedRec?.permissions })}`);

  // 5. Receptionist with token_issue can issue regular token
  const patPhone1 = '97' + Math.floor(10000000 + Math.random() * 90000000);
  const issueReg = await request('POST', '/api/tokens/regular', {
    doctorId: docId,
    patientName: 'P2B Walk-in Patient 1',
    patientPhone: patPhone1,
  }, recToken);
  const token1Number = issueReg.data?.token?.tokenNumber;
  record('P2B-06', 'Receptionist with token_issue issues Regular Token', (issueReg.status === 200 || issueReg.status === 201) && token1Number ? 'PASS' : 'FAIL', `Token Number: ${token1Number}`);

  // 6. Receptionist with token_issue can issue emergency token
  const patPhone2 = '97' + Math.floor(10000000 + Math.random() * 90000000);
  const issueEmg = await request('POST', '/api/tokens/emergency', {
    doctorId: docId,
    patientName: 'P2B Emergency Patient 2',
    patientPhone: patPhone2,
    condition: 'Acute chest pain',
  }, recToken);
  const emgTokenNumber = issueEmg.data?.token?.tokenNumber;
  record('P2B-07', 'Receptionist with token_issue issues Emergency Token', (issueEmg.status === 200 || issueEmg.status === 201) && emgTokenNumber ? 'PASS' : 'FAIL', `Emergency Token: ${emgTokenNumber}`);

  // 7. Receptionist with queue_manage can pause queue
  const pauseRes = await request('PATCH', `/api/queues/${queueId}/pause`, { reason: 'Receptionist desk break' }, recToken);
  record('P2B-08', 'Receptionist with queue_manage Pauses Queue', pauseRes.status === 200 && pauseRes.data?.isPaused === true ? 'PASS' : 'FAIL', `Status: ${pauseRes.status}`);

  // 8. Receptionist with queue_manage can resume queue
  const resumeRes = await request('PATCH', `/api/queues/${queueId}/resume`, {}, recToken);
  record('P2B-09', 'Receptionist with queue_manage Resumes Queue', resumeRes.status === 200 && resumeRes.data?.isPaused === false ? 'PASS' : 'FAIL', `Status: ${resumeRes.status}`);

  // 9. Doctor Updates Receptionist Permissions (Strip token_issue & queue_manage)
  const patchPerms = await request('PATCH', `/api/doctors/receptionists/${recId}/permissions`, {
    permissions: ['patient_records', 'patient:search'], // stripped token & queue rights
  }, docToken);
  record('P2B-10', 'Doctor Updates Staff Permissions (Restricted)', patchPerms.status === 200 ? 'PASS' : 'FAIL', `Response: ${patchPerms.status}`);

  // 10. Restricted Receptionist Token Simulation
  // Create token with restricted permissions for immediate verification
  const restrictedRecToken = jwt.sign({
    id: recId,
    userId: recId,
    role: 'RECEPTIONIST',
    phone: testPhone,
    clinicId: docId,
    doctorId: docId,
    permissions: ['patient_records', 'patient:search'],
  }, JWT_SECRET, { expiresIn: '1h' });

  // 11. Restricted Receptionist Denied Regular Token Issue
  const patPhone3 = '97' + Math.floor(10000000 + Math.random() * 90000000);
  const deniedReg = await request('POST', '/api/tokens/regular', {
    doctorId: docId,
    patientName: 'P2B Should Fail Patient',
    patientPhone: patPhone3,
  }, restrictedRecToken);
  record('P2B-11', 'Restricted Receptionist Denied Token Issue (403)', deniedReg.status === 403 ? 'PASS' : 'FAIL', `Status: ${deniedReg.status}`);

  // 12. Restricted Receptionist Denied Emergency Token Issue
  const deniedEmg = await request('POST', '/api/tokens/emergency', {
    doctorId: docId,
    patientName: 'P2B Should Fail Emergency',
    patientPhone: patPhone3,
  }, restrictedRecToken);
  record('P2B-12', 'Restricted Receptionist Denied Emergency Token (403)', deniedEmg.status === 403 ? 'PASS' : 'FAIL', `Status: ${deniedEmg.status}`);

  // 13. Restricted Receptionist Denied Pause Queue
  const deniedPause = await request('PATCH', `/api/queues/${queueId}/pause`, { reason: 'Unauthorized pause' }, restrictedRecToken);
  record('P2B-13', 'Restricted Receptionist Denied Pause Queue (403)', deniedPause.status === 403 ? 'PASS' : 'FAIL', `Status: ${deniedPause.status}`);

  // 14. Restricted Receptionist Denied Resume Queue
  const deniedResume = await request('PATCH', `/api/queues/${queueId}/resume`, {}, restrictedRecToken);
  record('P2B-14', 'Restricted Receptionist Denied Resume Queue (403)', deniedResume.status === 403 ? 'PASS' : 'FAIL', `Status: ${deniedResume.status}`);

  // 15. Unauthenticated Caller Cannot Update Permissions (401)
  const anonPatch = await request('PATCH', `/api/doctors/receptionists/${recId}/permissions`, { permissions: ['all'] }, null);
  record('P2B-15', 'Anonymous Denied Update Staff Permissions (401)', anonPatch.status === 401 ? 'PASS' : 'FAIL', `Status: ${anonPatch.status}`);

  // 16. Patient Role Cannot Update Staff Permissions (403)
  const patToken = jwt.sign({ userId: 'pat-1', role: 'PATIENT', phone: '9999900001' }, JWT_SECRET, { expiresIn: '1h' });
  const patPatch = await request('PATCH', `/api/doctors/receptionists/${recId}/permissions`, { permissions: ['all'] }, patToken);
  record('P2B-16', 'Patient Role Denied Update Staff Permissions (403)', patPatch.status === 403 ? 'PASS' : 'FAIL', `Status: ${patPatch.status}`);

  // 17. Receptionist Role Cannot Update Staff Permissions (403)
  const recPatch = await request('PATCH', `/api/doctors/receptionists/${recId}/permissions`, { permissions: ['all'] }, recToken);
  record('P2B-17', 'Receptionist Role Denied Update Staff Permissions (403)', recPatch.status === 403 ? 'PASS' : 'FAIL', `Status: ${recPatch.status}`);

  // 18. Other Doctor Cannot Manage This Queue
  const doctorBToken = jwt.sign({
    userId: 'doc-foreign-99',
    id: 'doc-foreign-99',
    doctorId: 'doc-foreign-99',
    clinicId: 'doc-foreign-99',
    role: 'DOCTOR',
    phone: '8999900099',
  }, JWT_SECRET, { expiresIn: '1h' });
  const foreignPause = await request('PATCH', `/api/queues/${queueId}/pause`, { reason: 'Foreign pause' }, doctorBToken);
  record('P2B-18', 'Foreign Doctor Denied Queue Management (403)', foreignPause.status === 403 ? 'PASS' : 'FAIL', `Status: ${foreignPause.status}`);

  // 19. Receptionist Clinic Isolation on Other Doctor Queue
  const foreignRecToken = jwt.sign({
    userId: 'rec-foreign-99',
    id: 'rec-foreign-99',
    role: 'RECEPTIONIST',
    clinicId: 'clinic-other-123',
    doctorId: 'clinic-other-123',
    permissions: ['queue_manage', 'queue:pause'],
  }, JWT_SECRET, { expiresIn: '1h' });
  const foreignRecPause = await request('PATCH', `/api/queues/${queueId}/pause`, { reason: 'Other clinic receptionist' }, foreignRecToken);
  record('P2B-19', 'Foreign Clinic Receptionist Denied Queue Pause (403)', foreignRecPause.status === 403 ? 'PASS' : 'FAIL', `Status: ${foreignRecPause.status}`);

  // 20. Super Admin Can Update Permissions
  const adminToken = jwt.sign({ userId: 'admin-1', role: 'SUPER_ADMIN', email: 'admin@carequeue.com' }, JWT_SECRET, { expiresIn: '1h' });
  const adminPatch = await request('PATCH', `/api/doctors/receptionists/${recId}/permissions`, {
    permissions: ['token_issue', 'queue_manage'],
  }, adminToken);
  record('P2B-20', 'Super Admin Can Update Receptionist Permissions', adminPatch.status === 200 ? 'PASS' : 'FAIL', `Status: ${adminPatch.status}`);

  // 21. Receptionist Patient Search Clinic Isolation
  // First register patient to ensure patient record exists in practice
  await request('POST', '/api/auth/patient/register', {
    name: 'P2B Scoped Patient',
    phone: patPhone1,
    age: 30,
    gender: 'MALE',
  });
  const searchRes = await request('GET', `/api/patients/search?phone=${patPhone1}`, null, recToken);
  record('P2B-21', 'Receptionist Scoped Patient Search Success', searchRes.status === 200 && searchRes.data?.patient ? 'PASS' : 'FAIL', `Status: ${searchRes.status}`);

  // 22. Receptionist Cannot Search Unrelated Patient
  const foreignPatPhone = '9912345678';
  const foreignSearch = await request('GET', `/api/patients/search?phone=${foreignPatPhone}`, null, recToken);
  record('P2B-22', 'Receptionist Search Isolated from Foreign Patients', (foreignSearch.status === 403 || foreignSearch.status === 404) ? 'PASS' : 'FAIL', `Status: ${foreignSearch.status}`);

  console.log('\n========================================');
  console.log(`Phase 2B Results: ${pass} PASSED, ${fail} FAILED (Total: ${pass + fail})`);
  console.log('========================================\n');

  if (fail > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Suite error:', err);
  process.exit(1);
});
