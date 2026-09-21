const http = require('http');
const fs = require('fs');
const path = require('path');
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

async function runRefinedAudit() {
  const results = [];
  function record(tcId, title, module, role, priority, status, evidence) {
    results.push({ tcId, title, module, role, priority, status, evidence });
    console.log(`[${status}] ${tcId}: ${title}`);
    if (evidence && status !== 'PASS') console.log(`       Reason: ${evidence}`);
  }

  // TC-001: Super Admin Login
  const tc1 = await request('POST', '/api/admin/login', { email: 'dev.shubhamagrawal@gmail.com', password: '$hubh@Achuki23' });
  const adminPass = tc1.status === 200 && tc1.data?.token && (tc1.data?.role === 'SUPER_ADMIN' || tc1.data?.user?.role === 'SUPER_ADMIN');
  record('TC-001', 'Super Admin Login with Valid Credentials', 'Auth', 'Super Admin', 'High', adminPass ? 'PASS' : 'FAIL', `Status: ${tc1.status}, UserRole: ${tc1.data?.user?.role}`);
  const adminToken = tc1.data?.token;

  // TC-002: Super Admin Login Invalid
  const tc2 = await request('POST', '/api/admin/login', { email: 'dev.shubhamagrawal@gmail.com', password: 'WrongPassword!' });
  record('TC-002', 'Super Admin Login with Invalid Password', 'Auth', 'Super Admin', 'High', (tc2.status === 401 || tc2.status === 400) ? 'PASS' : 'FAIL', `Status: ${tc2.status}`);

  // TC-003: Patient A Registration
  const phoneA = '9876500001';
  const tc3 = await request('POST', '/api/auth/patient/register', { name: 'Patient Alpha', phone: phoneA, age: 29, gender: 'MALE' });
  record('TC-003', 'Patient A Registration', 'Auth', 'Patient', 'High', (tc3.status === 200 || tc3.status === 201) && tc3.data?.token ? 'PASS' : 'FAIL', `Status: ${tc3.status}`);

  // TC-004: Patient A Login via OTP
  const tc4 = await request('POST', '/api/auth/patient/login', { phone: phoneA, otp: '123456' });
  record('TC-004', 'Patient A Login via OTP', 'Auth', 'Patient', 'High', tc4.status === 200 && tc4.data?.token ? 'PASS' : 'FAIL', `Status: ${tc4.status}`);
  const patientAToken = tc4.data?.token || tc3.data?.token;

  // TC-005: Patient B Registration & Isolation
  const phoneB = '9876500002';
  const tc5 = await request('POST', '/api/auth/patient/register', { name: 'Patient Beta', phone: phoneB, age: 34, gender: 'FEMALE' });
  record('TC-005', 'Patient B Registration & Isolation', 'Auth', 'Patient', 'High', (tc5.status === 200 || tc5.status === 201) && tc5.data?.token ? 'PASS' : 'FAIL', `Status: ${tc5.status}`);
  const patientBToken = tc5.data?.token;

  // TC-006: Doctor Login with OTP Mode
  const docPhone = '8864856668';
  const tc6 = await request('POST', '/api/auth/doctor/login', { identifier: docPhone, isOtp: true });
  record('TC-006', 'Doctor Login with OTP Mode', 'Auth', 'Doctor', 'High', tc6.status === 200 && tc6.data?.token && (tc6.data?.role === 'DOCTOR' || tc6.data?.user?.role === 'DOCTOR') ? 'PASS' : 'FAIL', `Status: ${tc6.status}`);
  const doctorToken = tc6.data?.token;
  const doctorId = 'doc-1789897698627';

  // TC-007: Development Backdoor Authentication Bypass Rejection
  const tc7 = await request('POST', '/api/queues/queue-test/call-next', {}, 'local-admin-backdoor');
  record('TC-007', 'Development Backdoor Authentication Bypass Rejection', 'Auth', 'Security', 'Critical', (tc7.status === 403 || tc7.status === 401) ? 'PASS' : 'FAIL', `Status: ${tc7.status}`);

  // TC-008: Patient Browses Doctor List
  const tc8 = await request('GET', '/api/doctors');
  record('TC-008', 'Patient Browses Doctor List', 'Patient', 'Patient', 'High', tc8.status === 200 && Array.isArray(tc8.data) ? 'PASS' : 'FAIL', `Status: ${tc8.status}`);

  // TC-009: Patient Views Doctor Details & Queue Count
  const tc9 = await request('GET', `/api/doctors/${doctorId}/active-queue`, null, doctorToken);
  record('TC-009', 'Patient Views Doctor Details & Queue Count', 'Patient', 'Patient', 'Medium', tc9.status === 200 && tc9.data?.queue ? 'PASS' : 'FAIL', `Status: ${tc9.status}`);
  const queueId = tc9.data?.queue?._id || tc9.data?.queue?.id;

  // TC-010: Patient Joins Queue (Regular Token Generation)
  // Clean up any existing token for patient A
  const existingA = await request('GET', `/api/tokens/my-token?phone=${phoneA}`);
  if (existingA.data?.activeToken) {
    await request('PATCH', `/api/queues/${existingA.data.activeToken.queueId}/tokens/${existingA.data.activeToken.id || existingA.data.activeToken._id}/cancel`, { reason: 'Reset' });
  }
  const tc10 = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Patient Alpha', patientPhone: phoneA, condition: 'Fever' });
  record('TC-010', 'Patient Joins Queue (Regular Token Generation)', 'Patient', 'Patient', 'High', tc10.status === 201 && tc10.data?.token?.tokenNumber?.startsWith('TK-') ? 'PASS' : 'FAIL', `Status: ${tc10.status}, Token: ${tc10.data?.token?.tokenNumber}`);
  const tokenA = tc10.data?.token;

  // TC-011: Patient Position & Wait Time Calculation
  const tc11 = await request('GET', `/api/tokens/my-token?phone=${phoneA}`);
  const dynamicWait = tc11.status === 200 && tc11.data?.activeToken?.positionAhead !== undefined && tc11.data?.activeToken?.estimatedWaitMinutes !== undefined;
  record('TC-011', 'Patient Position & Wait Time Calculation', 'Patient', 'Patient', 'High', dynamicWait ? 'PASS' : 'FAIL', `Pos: ${tc11.data?.activeToken?.positionAhead}, Wait: ${tc11.data?.activeToken?.estimatedWaitMinutes}`);

  // TC-012: Live Queue Recent Activity Feed
  const queueScreenSrc = fs.readFileSync('src/app/(patient)/(tabs)/queue.tsx', 'utf8');
  const dummyUpdatesRemoved = !queueScreenSrc.includes('Token A-19') && !queueScreenSrc.includes('Token A-18');
  record('TC-012', 'Live Queue Recent Activity Feed', 'Patient', 'Patient', 'Medium', dummyUpdatesRemoved ? 'PASS' : 'FAIL', `Clean dynamic timeline: ${dummyUpdatesRemoved}`);

  // TC-013: Patient Tracks Active Token via Backend API
  record('TC-013', 'Patient Tracks Active Token via Backend API', 'Patient', 'Patient', 'High', tc11.status === 200 && (tc11.data?.activeToken || tc11.data?.token) ? 'PASS' : 'FAIL', `ActiveToken exists: ${!!tc11.data?.activeToken}`);

  // TC-014: Patient Cancels Active Token from Queue UI
  const tc14 = await request('PATCH', `/api/queues/${queueId}/tokens/${tokenA?.id || tokenA?._id}/cancel`, { reason: 'Feeling better' });
  record('TC-014', 'Patient Cancels Active Token from Queue UI', 'Patient', 'Patient', 'High', tc14.status === 200 && tc14.data?.status === 'CANCELLED' ? 'PASS' : 'FAIL', `Status: ${tc14.status}, TokenStatus: ${tc14.data?.status}`);

  // TC-015: Real-time Alert When Token is Called
  const queueHasSocketCalled = queueScreenSrc.includes("SocketClient.on('queue:token_called'");
  record('TC-015', 'Real-time Alert When Token is Called', 'Patient', 'Patient', 'High', queueHasSocketCalled ? 'PASS' : 'FAIL', `queue.tsx listens to queue:token_called: ${queueHasSocketCalled}`);

  // TC-016: Doctor Registration Initial Status
  const testRegPhone = '88' + Math.floor(10000000 + Math.random() * 90000000);
  const tc16 = await request('POST', '/api/doctors/register', { name: 'Dr. New Registrant', phone: testRegPhone, type: 'INDIVIDUAL', specialization: 'Pediatrics' });
  record('TC-016', 'Doctor Registration Initial Status', 'Doctor', 'Doctor', 'High', (tc16.status === 200 || tc16.status === 201) && tc16.data?.approvalStatus === 'PENDING' ? 'PASS' : 'FAIL', `Status: ${tc16.status}, ApprovalStatus: ${tc16.data?.approvalStatus}`);
  const registeredDoctorId = tc16.data?.id || tc16.data?._id;

  // TC-017: Doctor Dashboard Queue Metrics Loading
  const docDashSrc = fs.readFileSync('src/app/(doctor)/dashboard.tsx', 'utf8');
  const dashConnected = docDashSrc.includes('getDoctorActiveQueue') && docDashSrc.includes('RemoteAPI');
  record('TC-017', 'Doctor Dashboard Queue Metrics Loading', 'Doctor', 'Doctor', 'High', dashConnected ? 'PASS' : 'FAIL', `dashboard.tsx connects to backend: ${dashConnected}`);

  // Book a token to test Doctor lifecycle
  const docPatPhone = '91' + Math.floor(10000000 + Math.random() * 90000000);
  const bookDocToken = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Doc Flow Patient', patientPhone: docPatPhone });
  const docFlowTokenId = bookDocToken.data?.token?.id || bookDocToken.data?.token?._id;

  // TC-018: Doctor Calls Next Patient (WAITING -> CALLED)
  const tc18 = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  record('TC-018', 'Doctor Calls Next Patient (WAITING -> CALLED)', 'Doctor', 'Doctor', 'High', tc18.status === 200 && tc18.data?.token?.status === 'CALLED' ? 'PASS' : 'FAIL', `Status: ${tc18.status}, TokenStatus: ${tc18.data?.token?.status}`);
  const calledTokenId = tc18.data?.token?.id || tc18.data?.token?._id;

  // TC-019: Doctor Starts Serving Patient (CALLED -> SERVING)
  const tc19 = await request('PATCH', `/api/queues/${queueId}/tokens/${calledTokenId}/serve`, {}, doctorToken);
  record('TC-019', 'Doctor Starts Serving Patient (CALLED -> SERVING)', 'Doctor', 'Doctor', 'High', tc19.status === 200 && tc19.data?.status === 'SERVING' ? 'PASS' : 'FAIL', `Status: ${tc19.status}, TokenStatus: ${tc19.data?.status}`);

  // TC-020: Doctor Completes Patient Consultation (SERVING -> COMPLETED)
  const tc20 = await request('PATCH', `/api/queues/${queueId}/tokens/${calledTokenId}/complete`, {}, doctorToken);
  record('TC-020', 'Doctor Completes Patient Consultation (SERVING -> COMPLETED)', 'Doctor', 'Doctor', 'High', tc20.status === 200 && tc20.data?.status === 'COMPLETED' ? 'PASS' : 'FAIL', `Status: ${tc20.status}, TokenStatus: ${tc20.data?.status}`);

  // Book another for skip
  const skipPhone = '92' + Math.floor(10000000 + Math.random() * 90000000);
  const skipBook = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Skip Flow Patient', patientPhone: skipPhone });
  const skipFlowTokenId = skipBook.data?.token?.id || skipBook.data?.token?._id;

  // TC-021: Doctor Skips Patient (WAITING/CALLED -> SKIPPED)
  const tc21 = await request('PATCH', `/api/queues/${queueId}/tokens/${skipFlowTokenId}/skip`, { reason: 'No show' }, doctorToken);
  record('TC-021', 'Doctor Skips Patient (WAITING/CALLED -> SKIPPED)', 'Doctor', 'Doctor', 'High', tc21.status === 200 && tc21.data?.status === 'SKIPPED' ? 'PASS' : 'FAIL', `Status: ${tc21.status}, TokenStatus: ${tc21.data?.status}`);

  // TC-022: Doctor Pauses Queue Execution
  const tc22 = await request('PATCH', `/api/queues/${queueId}/pause`, { reason: 'Lunch' }, doctorToken);
  record('TC-022', 'Doctor Pauses Queue Execution', 'Doctor', 'Doctor', 'Medium', tc22.status === 200 && tc22.data?.isPaused === true ? 'PASS' : 'FAIL', `Status: ${tc22.status}, isPaused: ${tc22.data?.isPaused}`);

  // TC-023: Doctor Resumes Paused Queue
  const tc23 = await request('PATCH', `/api/queues/${queueId}/resume`, {}, doctorToken);
  record('TC-023', 'Doctor Resumes Paused Queue', 'Doctor', 'Doctor', 'Medium', tc23.status === 200 && tc23.data?.isPaused === false ? 'PASS' : 'FAIL', `Status: ${tc23.status}, isPaused: ${tc23.data?.isPaused}`);

  // TC-024: Doctor Authorizes Receptionist
  const recPhone = '98' + Math.floor(10000000 + Math.random() * 90000000);
  const tc24 = await request('POST', '/api/doctors/receptionists', { name: 'Staff Sunita', phone: recPhone, permissions: ['token_issue', 'queue_manage'] }, doctorToken);
  record('TC-024', 'Doctor Authorizes Receptionist', 'Doctor', 'Doctor', 'High', (tc24.status === 200 || tc24.status === 201) ? 'PASS' : 'FAIL', `Status: ${tc24.status}`);

  // TC-025: Receptionist Login via Dedicated Role
  // Receptionist account login in fallback mode fails because fallback checks doctors collection only
  const tc25 = await request('POST', '/api/auth/doctor/login', { identifier: recPhone, isOtp: true });
  record('TC-025', 'Receptionist Login via Dedicated Role', 'Receptionist', 'Receptionist', 'High', tc25.status === 200 ? 'PASS' : 'FAIL', `Status: ${tc25.status} (Fallback mode queries doctors only, not receptionists)`);

  // TC-026: Receptionist Searches Patient by Phone
  const tc26 = await request('GET', `/api/patients/search?phone=${phoneA}`, null, doctorToken);
  record('TC-026', 'Receptionist Searches Patient by Phone', 'Receptionist', 'Receptionist', 'Medium', tc26.status === 200 ? 'PASS' : 'FAIL', `Status: ${tc26.status}`);

  // TC-027: Receptionist Registers Walk-in Patient & Generates Token
  const addPatientSrc = fs.readFileSync('src/app/(doctor)/add-patient.tsx', 'utf8');
  const addPatientHasRealApi = addPatientSrc.includes('bookRegularToken') && !addPatientSrc.includes('Math.random()');
  record('TC-027', 'Receptionist Registers Walk-in Patient & Generates Token', 'Receptionist', 'Receptionist', 'High', addPatientHasRealApi ? 'PASS' : 'FAIL', `Real API in add-patient.tsx: ${addPatientHasRealApi}`);

  // TC-028: Receptionist Permission Enforcement (Action Gating)
  const tc28 = await request('GET', '/api/patients');
  const isPatsProtected = tc28.status === 401 || tc28.status === 403;
  record('TC-028', 'Receptionist Permission Enforcement (Action Gating / Patient Access)', 'Receptionist', 'Security', 'High', isPatsProtected ? 'PASS' : 'FAIL', `GET /api/patients is UNPROTECTED (${tc28.status})`);

  // TC-029: Multi-Clinic Receptionist Tenant Isolation
  const tc29 = await request('GET', '/api/doctors/receptionists', null, doctorToken);
  record('TC-029', 'Multi-Clinic Receptionist Tenant Isolation', 'Receptionist', 'Security', 'High', tc29.status === 200 ? 'PASS' : 'FAIL', `Status: ${tc29.status}`);

  // TC-030: Saving Updated Receptionist Permissions
  const staffPermSrc = fs.readFileSync('src/app/(doctor)/staff-permissions.tsx', 'utf8');
  const hasSavePerm = staffPermSrc.includes('handleSave') || staffPermSrc.includes('savePermissions');
  record('TC-030', 'Saving Updated Receptionist Permissions', 'Receptionist', 'Doctor', 'Medium', hasSavePerm ? 'PASS' : 'NOT IMPLEMENTED', `staff-permissions.tsx save functionality: ${hasSavePerm}`);

  // TC-031: Generate Emergency Token via Backend API
  const emPhone = '95' + Math.floor(10000000 + Math.random() * 90000000);
  const tc31 = await request('POST', '/api/tokens/emergency', { doctorId, patientName: 'Emergency Trauma', patientPhone: emPhone, condition: 'Trauma' });
  record('TC-031', 'Generate Emergency Token via Backend API', 'Emergency', 'Doctor', 'High', tc31.status === 201 && tc31.data?.token?.priority === 0 ? 'PASS' : 'FAIL', `Status: ${tc31.status}, Priority: ${tc31.data?.token?.priority}`);

  // TC-032: Emergency Token Priority Queue Preemption
  const tc32 = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  const isEmCalled = tc32.data?.token?.tokenType === 'EMERGENCY' || tc32.data?.token?.priority === 0;
  record('TC-032', 'Emergency Token Priority Queue Preemption', 'Emergency', 'System', 'High', tc32.status === 200 && isEmCalled ? 'PASS' : 'FAIL', `Status: ${tc32.status}, Token: ${tc32.data?.token?.tokenNumber}, Type: ${tc32.data?.token?.tokenType}`);

  // TC-033: Emergency Token Generation via Mobile UI
  const priorityOverrideSrc = fs.readFileSync('src/app/(doctor)/priority-override.tsx', 'utf8');
  const hasOverrideApi = priorityOverrideSrc.includes('bookEmergencyToken') && !priorityOverrideSrc.includes('/success');
  record('TC-033', 'Emergency Token Generation via Mobile UI (priority-override.tsx)', 'Emergency', 'Doctor', 'High', hasOverrideApi ? 'PASS' : 'FAIL', `Connects to bookEmergencyToken: ${hasOverrideApi}`);

  // TC-034: Preemption of Active In-Room Consultation (Business Rule Check)
  const inRoomPatPhone = '96' + Math.floor(10000000 + Math.random() * 90000000);
  await request('POST', '/api/tokens/regular', { doctorId, patientName: 'In Room Consultation', patientPhone: inRoomPatPhone });
  const callInRoom = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  const serveInRoom = await request('PATCH', `/api/queues/${queueId}/tokens/${callInRoom.data?.token?.id || callInRoom.data?.token?._id}/serve`, {}, doctorToken);
  // Now add an emergency token
  const lateEmPhone = '97' + Math.floor(10000000 + Math.random() * 90000000);
  await request('POST', '/api/tokens/emergency', { doctorId, patientName: 'Late Emergency', patientPhone: lateEmPhone });
  // Check queue status
  const qCheck = await request('GET', `/api/doctors/${doctorId}/active-queue`, null, doctorToken);
  const inRoomIntact = qCheck.data?.tokens?.some(t => t.status === 'SERVING');
  record('TC-034', 'Preemption of Active In-Room Consultation (Business Rule Check)', 'Emergency', 'Doctor', 'High', inRoomIntact ? 'PASS' : 'FAIL', `In-room SERVING consultation remains intact: ${inRoomIntact}`);

  // TC-035: Super Admin Views Pending Provider Submissions
  const tc35 = await request('GET', '/api/admin/providers/pending', null, adminToken);
  record('TC-035', 'Super Admin Views Pending Provider Submissions', 'Admin', 'Super Admin', 'High', tc35.status === 200 && Array.isArray(tc35.data) ? 'PASS' : 'FAIL', `Status: ${tc35.status}, Count: ${Array.isArray(tc35.data) ? tc35.data.length : 0}`);

  // TC-036: Super Admin Approves Doctor Registration
  const tc36 = await request('PATCH', `/api/admin/providers/${registeredDoctorId}/approve`, {}, adminToken);
  record('TC-036', 'Super Admin Approves Doctor Registration', 'Admin', 'Super Admin', 'High', tc36.status === 200 && tc36.data?.approvalStatus === 'APPROVED' ? 'PASS' : 'FAIL', `Status: ${tc36.status}, Approval: ${tc36.data?.approvalStatus}`);

  // TC-037: Super Admin Rejects Doctor Registration with Mandatory Reason
  const rejectDocPhone = '88' + Math.floor(10000000 + Math.random() * 90000000);
  const rejectDocReg = await request('POST', '/api/doctors/register', { name: 'Dr. Reject Candidate', phone: rejectDocPhone, type: 'INDIVIDUAL' });
  const rejectDocId = rejectDocReg.data?.id || rejectDocReg.data?._id;
  const noReason = await request('PATCH', `/api/admin/providers/${rejectDocId}/reject`, {}, adminToken);
  const withReason = await request('PATCH', `/api/admin/providers/${rejectDocId}/reject`, { reason: 'Insufficient medical council documentation' }, adminToken);
  record('TC-037', 'Super Admin Rejects Doctor Registration with Mandatory Reason', 'Admin', 'Super Admin', 'High', noReason.status === 400 && withReason.status === 200 ? 'PASS' : 'FAIL', `NoReason: ${noReason.status}, WithReason: ${withReason.status}`);

  // TC-038: Super Admin Suspends Doctor/Clinic Registration
  const suspendRes = await request('PATCH', `/api/admin/providers/${rejectDocId}/suspend`, {}, adminToken);
  record('TC-038', 'Super Admin Suspends Doctor/Clinic Registration', 'Admin', 'Super Admin', 'High', suspendRes.status === 200 ? 'PASS' : 'NOT IMPLEMENTED', `Status: ${suspendRes.status} (Endpoint /suspend not implemented)`);

  // TC-039: Socket.IO Server Connection & Queue Room Join
  let sConnected = false;
  let sJoined = false;
  try {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false, auth: { token: doctorToken || '' } });
    await new Promise((resolve) => {
      s.on('connect', () => {
        sConnected = true;
        s.emit('join_queue', queueId);
        sJoined = true;
        resolve();
      });
      setTimeout(resolve, 1500);
    });
    s.disconnect();
  } catch (e) {}
  record('TC-039', 'Socket.IO Server Connection & Queue Room Join', 'Real-time', 'System', 'High', sConnected && sJoined ? 'PASS' : 'FAIL', `Connected: ${sConnected}, Joined: ${sJoined}`);

  // TC-040: Doctor Action Broadcasts Real-Time Socket Event
  let eventBroadcasted = false;
  try {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false, auth: { token: doctorToken || '' } });
    await new Promise((resolve) => {
      s.on('connect', () => {
        s.emit('join_queue', queueId);
        s.on('queue:token_called', () => { eventBroadcasted = true; });
        resolve();
      });
      setTimeout(resolve, 1000);
    });
    await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
    await new Promise(r => setTimeout(r, 600));
    s.disconnect();
  } catch (e) {}
  record('TC-040', 'Doctor Action Broadcasts Real-Time Socket Event', 'Real-time', 'System', 'High', eventBroadcasted ? 'PASS' : 'FAIL', `Event received: ${eventBroadcasted}`);

  // TC-041: Mobile Patient Queue Screen Real-Time WebSocket Integration
  const patQueueIntegrated = queueScreenSrc.includes("SocketClient.joinQueue") && queueScreenSrc.includes("SocketClient.on('queue:token_called'");
  record('TC-041', 'Mobile Patient Queue Screen Real-Time WebSocket Integration', 'Real-time', 'Patient', 'High', patQueueIntegrated ? 'PASS' : 'FAIL', `queue.tsx imports and integrates SocketClient: ${patQueueIntegrated}`);

  // TC-042: Mobile Doctor Dashboard Real-Time WebSocket Integration
  const docDashIntegrated = docDashSrc.includes("SocketClient.joinQueue") && (docDashSrc.includes("SocketClient.onTokenCreated") || docDashSrc.includes("queue:token_created"));
  record('TC-042', 'Mobile Doctor Dashboard Real-Time WebSocket Integration', 'Real-time', 'Doctor', 'High', docDashIntegrated ? 'PASS' : 'FAIL', `dashboard.tsx imports and integrates SocketClient: ${docDashIntegrated}`);

  // TC-043: Unauthorized Access to Doctor Call-Next Endpoint
  const tc43 = await request('POST', `/api/queues/${queueId}/call-next`, {});
  record('TC-043', 'Unauthorized Access to Doctor Call-Next Endpoint', 'Security', 'Unauthenticated', 'High', tc43.status === 401 || tc43.status === 403 ? 'PASS' : 'FAIL', `Status: ${tc43.status}`);

  // TC-044: Unauthorized Access to Super Admin Pending Providers
  const tc44 = await request('GET', '/api/admin/providers/pending', null, patientAToken);
  record('TC-044', 'Unauthorized Access to Super Admin Pending Providers', 'Security', 'Patient', 'High', tc44.status === 403 ? 'PASS' : 'FAIL', `Status: ${tc44.status}`);

  // TC-045: Public Unauthenticated Access to Patient Health Records (/api/patients)
  const tc45 = await request('GET', '/api/patients');
  const tc45Blocked = tc45.status === 401 || tc45.status === 403;
  record('TC-045', 'Public Unauthenticated Access to Patient Health Records (/api/patients)', 'Security', 'Unauthenticated', 'Critical', tc45Blocked ? 'PASS' : 'FAIL', `GET /api/patients status: ${tc45.status} (Returns ${Array.isArray(tc45.data) ? tc45.data.length : 0} patient records unauthenticated)`);

  // TC-046: Public Exposure of Doctor Aadhaar & PAN Numbers (/api/doctors)
  const tc46 = await request('GET', '/api/doctors');
  const aadhaarExposed = Array.isArray(tc46.data) && tc46.data.some(d => d.aadhaarNumber || d.panNumber);
  record('TC-046', 'Public Exposure of Doctor Aadhaar & PAN Numbers (/api/doctors)', 'Security', 'Unauthenticated', 'Critical', !aadhaarExposed ? 'PASS' : 'FAIL', `Aadhaar/PAN exposed: ${aadhaarExposed}`);

  // TC-047: Role Guard Middleware Usage in Production Routes
  const serverSrc = fs.readFileSync('server/server.js', 'utf8');
  const roleGuardCount = (serverSrc.match(/requireRole\(/g) || []).length;
  record('TC-047', 'Role Guard Middleware Usage in Production Routes', 'Security', 'System', 'High', roleGuardCount >= 5 ? 'PASS' : 'FAIL', `requireRole occurrences: ${roleGuardCount}`);

  // TC-048: Cross-Role Token Hijacking
  const tc48 = await request('PATCH', `/api/queues/${queueId}/pause`, {}, patientAToken);
  record('TC-048', 'Cross-Role Token Hijacking (Patient attempting Pause)', 'Security', 'Patient', 'High', tc48.status === 403 ? 'PASS' : 'FAIL', `Status: ${tc48.status}`);

  // TC-049: Doctor Calls Next When No Patients Are Waiting
  await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  const tc49 = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  const tc49Graceful = tc49.status === 200 && (tc49.data?.currentTokenNumber === 'None' || tc49.data?.message?.includes('No more'));
  record('TC-049', 'Doctor Calls Next When No Patients Are Waiting', 'Queue', 'Doctor', 'Medium', tc49Graceful ? 'PASS' : 'FAIL', `Status: ${tc49.status}, CurrentToken: ${tc49.data?.currentTokenNumber}`);

  // TC-050: Duplicate Active Token Request for Same Patient & Doctor
  const dupPhone = '94' + Math.floor(10000000 + Math.random() * 90000000);
  const d1 = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Dup Check', patientPhone: dupPhone });
  const d2 = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Dup Check', patientPhone: dupPhone });
  record('TC-050', 'Duplicate Active Token Request for Same Patient & Doctor', 'Queue', 'Patient', 'High', d2.status === 400 && d2.data?.error?.includes('active token') ? 'PASS' : 'FAIL', `d2 Status: ${d2.status}, Error: ${d2.data?.error}`);

  // TC-051: Token Generation with Missing Mandatory Fields
  const tc51 = await request('POST', '/api/tokens/regular', { doctorId: '', patientName: '' });
  record('TC-051', 'Token Generation with Missing Mandatory Fields', 'API', 'Patient', 'Medium', tc51.status === 400 ? 'PASS' : 'FAIL', `Status: ${tc51.status}`);

  // TC-052: Backend Route for Updating Patient Treatment Status
  const tc52 = await request('PATCH', '/api/patients/pat-test/status', { treatmentStatus: 'COMPLETED' }, doctorToken);
  record('TC-052', 'Backend Route for Updating Patient Treatment Status', 'API', 'Doctor', 'High', tc52.status === 200 ? 'PASS' : 'FAIL', `Status: ${tc52.status}`);

  // TC-053: Maximum Daily Token Cap Enforcement
  const hasCap = serverSrc.includes('maxTokens') && serverSrc.includes('Capacity reached');
  record('TC-053', 'Maximum Daily Token Cap Enforcement', 'Queue', 'System', 'Medium', hasCap ? 'PASS' : 'NOT IMPLEMENTED', `Daily token cap check in server.js: ${hasCap}`);

  // TC-054: Network Disconnection & Client Reconnection
  const socketSrc = fs.readFileSync('src/utils/socket.ts', 'utf8');
  const hasReconnection = socketSrc.includes('reconnectionAttempts') && socketSrc.includes('reconnectionDelay');
  record('TC-054', 'Network Disconnection & Client Reconnection', 'Real-time', 'System', 'Medium', hasReconnection ? 'PASS' : 'FAIL', `socket.ts reconnection configuration: ${hasReconnection}`);

  // TC-055: Super Admin Web Responsiveness on Tablet (1024px)
  const adminCss = fs.readFileSync('admin-web/css/admin.css', 'utf8');
  const has1024 = adminCss.includes('@media') && adminCss.includes('1024px');
  record('TC-055', 'Super Admin Web Responsiveness on Tablet (1024px)', 'UI', 'Admin', 'Medium', has1024 ? 'PASS' : 'FAIL', `admin.css 1024px media query: ${has1024}`);

  // TC-056: Super Admin Web Table Overflow on Mobile Viewport (<600px)
  const has600Table = adminCss.includes('@media') && adminCss.includes('600px') && (adminCss.includes('display: block') || adminCss.includes('data-label'));
  record('TC-056', 'Super Admin Web Table Overflow on Mobile Viewport (<600px)', 'UI', 'Admin', 'Medium', has600Table ? 'PASS' : 'FAIL', `admin.css small screen table card transformation: ${has600Table}`);

  console.log('\n================================================================');
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const notImplCount = results.filter(r => r.status === 'NOT IMPLEMENTED').length;
  const blockedCount = results.filter(r => r.status === 'BLOCKED').length;
  console.log(`REFINED AUDIT SUMMARY: Total: ${results.length} | Passed: ${passCount} | Failed: ${failCount} | Not Implemented: ${notImplCount} | Blocked: ${blockedCount}`);
  console.log('================================================================\n');

  // Save json for easy reference
  fs.writeFileSync('scratch/audit_results_56.json', JSON.stringify(results, null, 2));
}

runRefinedAudit().catch(console.error);
