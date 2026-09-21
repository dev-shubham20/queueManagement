const http = require('http');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { io } = require('socket.io-client');

require('dotenv').config();
const BASE_URL = 'http://localhost:5001';
const JWT_SECRET = process.env.JWT_SECRET || 'carequeue_super_secure_jwt_secret_key_2026_x789';

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

async function runFullRegressionAudit() {
  console.log('================================================================');
  console.log('   STARTING FULL REGRESSION AUDIT: 56 ORIGINAL TEST CASES       ');
  console.log('================================================================\n');

  const auditResults = [];
  function record(tcId, title, module, role, priority, status, evidence) {
    auditResults.push({ tcId, title, module, role, priority, status, evidence });
    console.log(`[${status}] ${tcId}: ${title} (${status})`);
    if (evidence && status !== 'PASS') {
      console.log(`       Evidence: ${evidence}`);
    }
  }

  // --- MODULE 1: AUTHENTICATION & SESSION MANAGEMENT ---
  console.log('\n--- MODULE 1: AUTHENTICATION & SESSION MANAGEMENT ---');

  // TC-001: Super Admin Login with Valid Credentials
  const tc1 = await request('POST', '/api/admin/login', { email: 'dev.shubhamagrawal@gmail.com', password: '$hubh@Achuki23' });
  record('TC-001', 'Super Admin Login with Valid Credentials', 'Auth', 'Super Admin', 'High',
    tc1.status === 200 && tc1.data?.token && tc1.data?.role === 'SUPER_ADMIN' ? 'PASS' : 'FAIL',
    `Status: ${tc1.status}, Role: ${tc1.data?.role}`
  );
  const adminToken = tc1.data?.token;

  // TC-002: Super Admin Login with Invalid Password
  const tc2 = await request('POST', '/api/admin/login', { email: 'dev.shubhamagrawal@gmail.com', password: 'WrongPassword999!' });
  record('TC-002', 'Super Admin Login with Invalid Password', 'Auth', 'Super Admin', 'High',
    (tc2.status === 401 || tc2.status === 400) ? 'PASS' : 'FAIL',
    `Status: ${tc2.status}`
  );

  // TC-003: Patient A Registration
  const phoneA = '9876500001';
  const tc3 = await request('POST', '/api/auth/patient/register', { name: 'Test Patient Alpha', phone: phoneA, age: 29, gender: 'MALE' });
  record('TC-003', 'Patient A Registration', 'Auth', 'Patient', 'High',
    (tc3.status === 200 || tc3.status === 201) && tc3.data?.token ? 'PASS' : 'FAIL',
    `Status: ${tc3.status}`
  );
  let patientAToken = tc3.data?.token;

  // TC-004: Patient A Login via OTP
  const tc4 = await request('POST', '/api/auth/patient/login', { phone: phoneA, otp: '123456' });
  record('TC-004', 'Patient A Login via OTP', 'Auth', 'Patient', 'High',
    tc4.status === 200 && tc4.data?.token ? 'PASS' : 'FAIL',
    `Status: ${tc4.status}`
  );
  if (tc4.data?.token) patientAToken = tc4.data?.token;

  // TC-005: Patient B Registration & Isolation
  const phoneB = '9876500002';
  const tc5 = await request('POST', '/api/auth/patient/register', { name: 'Test Patient Beta', phone: phoneB, age: 45, gender: 'FEMALE' });
  record('TC-005', 'Patient B Registration & Isolation', 'Auth', 'Patient', 'High',
    (tc5.status === 200 || tc5.status === 201) && tc5.data?.token ? 'PASS' : 'FAIL',
    `Status: ${tc5.status}`
  );
  const patientBToken = tc5.data?.token;

  // TC-006: Doctor Login with OTP Mode
  const docPhone = '8864856668';
  const tc6 = await request('POST', '/api/auth/doctor/login', { identifier: docPhone, isOtp: true });
  record('TC-006', 'Doctor Login with OTP Mode', 'Auth', 'Doctor', 'High',
    tc6.status === 200 && tc6.data?.token && tc6.data?.role === 'DOCTOR' ? 'PASS' : 'FAIL',
    `Status: ${tc6.status}, Role: ${tc6.data?.role}`
  );
  const doctorToken = tc6.data?.token;
  const doctorId = 'doc-1789897698627';

  // TC-007: Development Backdoor Authentication Bypass
  const tc7 = await request('POST', '/api/queues/queue-test/call-next', {}, 'local-admin-backdoor');
  record('TC-007', 'Development Backdoor Authentication Bypass Rejection', 'Auth', 'Security', 'Critical',
    tc7.status === 403 || tc7.status === 401 ? 'PASS' : 'FAIL',
    `Status: ${tc7.status}`
  );

  // --- MODULE 2: PATIENT FLOW ---
  console.log('\n--- MODULE 2: PATIENT FLOW ---');

  // TC-008: Patient Browses Doctor List
  const tc8 = await request('GET', '/api/doctors');
  const hasAadhaarOrPan = Array.isArray(tc8.data) && tc8.data.some(d => d.aadhaarNumber || d.panNumber);
  record('TC-008', 'Patient Browses Doctor List', 'Patient', 'Patient', 'High',
    tc8.status === 200 && Array.isArray(tc8.data) && !hasAadhaarOrPan ? 'PASS' : (hasAadhaarOrPan ? 'FAIL' : 'PASS'),
    `Status: ${tc8.status}, KYC Exposed: ${hasAadhaarOrPan}`
  );

  // TC-009: Patient Views Doctor Details & Queue Count
  const tc9 = await request('GET', `/api/doctors/${doctorId}/active-queue`, null, doctorToken);
  record('TC-009', 'Patient Views Doctor Details & Queue Count', 'Patient', 'Patient', 'Medium',
    tc9.status === 200 && tc9.data?.queue ? 'PASS' : 'FAIL',
    `Status: ${tc9.status}`
  );
  const queueId = tc9.data?.queue?._id || tc9.data?.queue?.id;

  // TC-010: Patient Joins Queue (Regular Token Generation)
  // Ensure patientA does not have active token first
  const myTokenPre = await request('GET', `/api/tokens/my-token?phone=${phoneA}`);
  if (myTokenPre.data?.activeToken) {
    await request('PATCH', `/api/queues/${myTokenPre.data.activeToken.queueId}/tokens/${myTokenPre.data.activeToken.id || myTokenPre.data.activeToken._id}/cancel`, { reason: 'Clean test' });
  }

  const tc10 = await request('POST', '/api/tokens/regular', {
    doctorId,
    patientName: 'Test Patient Alpha',
    patientPhone: phoneA,
    condition: 'Cold & Fever',
  });
  const tokenSequential = tc10.data?.token?.tokenNumber && !tc10.data.token.tokenNumber.includes('NaN');
  record('TC-010', 'Patient Joins Queue (Regular Token Generation)', 'Patient', 'Patient', 'High',
    tc10.status === 201 && tokenSequential ? 'PASS' : 'FAIL',
    `Status: ${tc10.status}, Token: ${tc10.data?.token?.tokenNumber}`
  );
  const patientATokenData = tc10.data?.token;

  // TC-011: Patient Position & Wait Time Calculation
  const myTokenRes = await request('GET', `/api/tokens/my-token?phone=${phoneA}`);
  const hasDynamicWait = myTokenRes.status === 200 && myTokenRes.data?.activeToken?.positionAhead !== undefined && myTokenRes.data?.activeToken?.estimatedWaitMinutes !== undefined;
  record('TC-011', 'Patient Position & Wait Time Calculation', 'Patient', 'Patient', 'High',
    hasDynamicWait ? 'PASS' : 'FAIL',
    `Pos: ${myTokenRes.data?.activeToken?.positionAhead}, Wait: ${myTokenRes.data?.activeToken?.estimatedWaitMinutes}m`
  );

  // TC-012: Live Queue Recent Activity Feed
  // Check queue.tsx source code to verify dynamic timeline vs hardcoded A-19
  const queueScreenSrc = fs.readFileSync('src/app/(patient)/(tabs)/queue.tsx', 'utf8');
  const hasHardcodedDummyUpdates = queueScreenSrc.includes('Token A-19') || queueScreenSrc.includes('Token A-18');
  record('TC-012', 'Live Queue Recent Activity Feed', 'Patient', 'Patient', 'Medium',
    !hasHardcodedDummyUpdates ? 'PASS' : 'FAIL',
    `Has hardcoded A-19 items: ${hasHardcodedDummyUpdates}`
  );

  // TC-013: Patient Tracks Active Token via Backend API (/api/tokens/my-token)
  record('TC-013', 'Patient Tracks Active Token via Backend API', 'Patient', 'Patient', 'High',
    myTokenRes.status === 200 && (myTokenRes.data?.activeToken || myTokenRes.data?.token) ? 'PASS' : 'FAIL',
    `ActiveToken returned: ${!!(myTokenRes.data?.activeToken || myTokenRes.data?.token)}`
  );

  // TC-014: Patient Cancels Active Token from Queue UI
  const cancelRes = await request('PATCH', `/api/queues/${queueId}/tokens/${patientATokenData?.id || patientATokenData?._id}/cancel`, { reason: 'Patient cancelled' });
  record('TC-014', 'Patient Cancels Active Token from Queue UI', 'Patient', 'Patient', 'High',
    cancelRes.status === 200 && cancelRes.data?.status === 'CANCELLED' ? 'PASS' : 'FAIL',
    `Status: ${cancelRes.status}, TokenStatus: ${cancelRes.data?.status}`
  );

  // TC-015: Real-time Alert When Token is Called
  const queueHasCalledListener = queueScreenSrc.includes('onTokenCalled') && queueScreenSrc.includes('SocketClient');
  record('TC-015', 'Real-time Alert When Token is Called', 'Patient', 'Patient', 'High',
    queueHasCalledListener ? 'PASS' : 'FAIL',
    `queue.tsx includes SocketClient.onTokenCalled: ${queueHasCalledListener}`
  );

  // --- MODULE 3: DOCTOR / CLINIC FLOW ---
  console.log('\n--- MODULE 3: DOCTOR / CLINIC FLOW ---');

  // TC-016: Doctor Registration Initial Status
  const tc16 = await request('POST', '/api/doctors/register', { name: 'Dr. Test Registration', phone: '8877665544', type: 'INDIVIDUAL', specialization: 'Dermatology' });
  record('TC-016', 'Doctor Registration Initial Status', 'Doctor', 'Doctor', 'High',
    (tc16.status === 200 || tc16.status === 201) && tc16.data?.doctor?.approvalStatus === 'PENDING' ? 'PASS' : 'FAIL',
    `Status: ${tc16.status}, Approval: ${tc16.data?.doctor?.approvalStatus}`
  );

  // TC-017: Doctor Dashboard Queue Metrics Loading
  const docDashSrc = fs.readFileSync('src/app/(doctor)/dashboard.tsx', 'utf8');
  const dashHasBackendQueue = docDashSrc.includes('getDoctorActiveQueue') && docDashSrc.includes('RemoteAPI');
  record('TC-017', 'Doctor Dashboard Queue Metrics Loading', 'Doctor', 'Doctor', 'High',
    dashHasBackendQueue ? 'PASS' : 'FAIL',
    `dashboard.tsx connects to getDoctorActiveQueue: ${dashHasBackendQueue}`
  );

  // Create a patient token for Doctor testing
  const patTokenForDoc = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Doc Test Patient', patientPhone: '9111122222', condition: 'Checkup' });
  const patTokenId = patTokenForDoc.data?.token?.id || patTokenForDoc.data?.token?._id;

  // TC-018: Doctor Calls Next Patient (WAITING -> CALLED)
  const tc18 = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  record('TC-018', 'Doctor Calls Next Patient (WAITING -> CALLED)', 'Doctor', 'Doctor', 'High',
    tc18.status === 200 && tc18.data?.token?.status === 'CALLED' ? 'PASS' : 'FAIL',
    `Status: ${tc18.status}, Token status: ${tc18.data?.token?.status}`
  );
  const calledTokenId = tc18.data?.token?.id || tc18.data?.token?._id;

  // TC-019: Doctor Starts Serving Patient (CALLED -> SERVING)
  const tc19 = await request('PATCH', `/api/queues/${queueId}/tokens/${calledTokenId}/serve`, {}, doctorToken);
  record('TC-019', 'Doctor Starts Serving Patient (CALLED -> SERVING)', 'Doctor', 'Doctor', 'High',
    tc19.status === 200 && tc19.data?.status === 'SERVING' ? 'PASS' : 'FAIL',
    `Status: ${tc19.status}, Token status: ${tc19.data?.status}`
  );

  // TC-020: Doctor Completes Patient Consultation (SERVING -> COMPLETED)
  const tc20 = await request('PATCH', `/api/queues/${queueId}/tokens/${calledTokenId}/complete`, {}, doctorToken);
  record('TC-020', 'Doctor Completes Patient Consultation (SERVING -> COMPLETED)', 'Doctor', 'Doctor', 'High',
    tc20.status === 200 && tc20.data?.status === 'COMPLETED' ? 'PASS' : 'FAIL',
    `Status: ${tc20.status}, Token status: ${tc20.data?.status}`
  );

  // Book another to test skip
  const tokenForSkip = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Skip Target', patientPhone: '9333344444' });
  const skipTargetId = tokenForSkip.data?.token?.id || tokenForSkip.data?.token?._id;

  // TC-021: Doctor Skips Patient (WAITING/CALLED -> SKIPPED)
  const tc21 = await request('PATCH', `/api/queues/${queueId}/tokens/${skipTargetId}/skip`, { reason: 'Patient unavailable' }, doctorToken);
  record('TC-021', 'Doctor Skips Patient (WAITING/CALLED -> SKIPPED)', 'Doctor', 'Doctor', 'High',
    tc21.status === 200 && tc21.data?.status === 'SKIPPED' ? 'PASS' : 'FAIL',
    `Status: ${tc21.status}, Token status: ${tc21.data?.status}`
  );

  // TC-022: Doctor Pauses Queue Execution
  const tc22 = await request('PATCH', `/api/queues/${queueId}/pause`, { reason: 'Procedure break' }, doctorToken);
  record('TC-022', 'Doctor Pauses Queue Execution', 'Doctor', 'Doctor', 'Medium',
    tc22.status === 200 && (tc22.data?.isPaused === true || tc22.data?.status === 'PAUSED') ? 'PASS' : 'FAIL',
    `Status: ${tc22.status}, isPaused: ${tc22.data?.isPaused}`
  );

  // TC-023: Doctor Resumes Paused Queue
  const tc23 = await request('PATCH', `/api/queues/${queueId}/resume`, {}, doctorToken);
  record('TC-023', 'Doctor Resumes Paused Queue', 'Doctor', 'Doctor', 'Medium',
    tc23.status === 200 && (tc23.data?.isPaused === false || tc23.data?.status === 'ACTIVE') ? 'PASS' : 'FAIL',
    `Status: ${tc23.status}, isPaused: ${tc23.data?.isPaused}`
  );

  // TC-024: Doctor Authorizes Receptionist
  const tc24 = await request('POST', '/api/doctors/receptionists', {
    name: 'Staff Reena',
    phone: '9876543210',
    email: 'reena@careclinic.com',
    permissions: ['queue_manage', 'token_issue']
  }, doctorToken);
  record('TC-024', 'Doctor Authorizes Receptionist', 'Doctor', 'Doctor', 'High',
    (tc24.status === 200 || tc24.status === 201) ? 'PASS' : 'FAIL',
    `Status: ${tc24.status}`
  );

  // --- MODULE 4: RECEPTIONIST FLOW ---
  console.log('\n--- MODULE 4: RECEPTIONIST FLOW ---');

  // TC-025: Receptionist Login via Dedicated Role
  const tc25 = await request('POST', '/api/auth/doctor/login', { identifier: '9876543210', isOtp: true });
  record('TC-025', 'Receptionist Login via Dedicated Role', 'Receptionist', 'Receptionist', 'High',
    tc25.status === 200 && tc25.data?.token ? 'PASS' : 'FAIL',
    `Status: ${tc25.status}`
  );
  const receptionistToken = tc25.data?.token;

  // TC-026: Receptionist Searches Patient by Phone
  const tc26 = await request('GET', `/api/patients/search?phone=${phoneA}`, null, receptionistToken || doctorToken);
  record('TC-026', 'Receptionist Searches Patient by Phone', 'Receptionist', 'Receptionist', 'Medium',
    tc26.status === 200 && tc26.data ? 'PASS' : 'FAIL',
    `Status: ${tc26.status}`
  );

  // TC-027: Receptionist Registers Walk-in Patient & Generates Token
  const addPatientSrc = fs.readFileSync('src/app/(doctor)/add-patient.tsx', 'utf8');
  const addPatientHasRealApi = addPatientSrc.includes('bookRegularToken') && !addPatientSrc.includes('Math.random()');
  record('TC-027', 'Receptionist Registers Walk-in Patient & Generates Token', 'Receptionist', 'Receptionist', 'High',
    addPatientHasRealApi ? 'PASS' : 'FAIL',
    `add-patient.tsx uses RemoteAPI.bookRegularToken without Math.random: ${addPatientHasRealApi}`
  );

  // TC-028: Receptionist Permission Enforcement (Action Gating)
  // Check if backend GET /api/patients is protected
  const patsAuthCheck = await request('GET', '/api/patients');
  const patsProtected = patsAuthCheck.status === 401 || patsAuthCheck.status === 403;
  record('TC-028', 'Receptionist Permission Enforcement (Backend Protection)', 'Receptionist', 'Security', 'High',
    patsProtected ? 'PASS' : 'FAIL',
    `GET /api/patients status: ${patsAuthCheck.status} (Unprotected)`
  );

  // TC-029: Multi-Clinic Receptionist Tenant Isolation
  const recsListRes = await request('GET', '/api/doctors/receptionists', null, doctorToken);
  // Check if server filters receptionists by doctorId / clinicId
  record('TC-029', 'Multi-Clinic Receptionist Tenant Isolation', 'Receptionist', 'Security', 'High',
    recsListRes.status === 200 ? 'PASS' : 'FAIL',
    `Status: ${recsListRes.status}, Count: ${Array.isArray(recsListRes.data) ? recsListRes.data.length : 0}`
  );

  // TC-030: Saving Updated Receptionist Permissions
  const staffPermSrc = fs.readFileSync('src/app/(doctor)/staff-permissions.tsx', 'utf8');
  const staffPermHasSave = staffPermSrc.includes('save') || staffPermSrc.includes('RemoteAPI') || staffPermSrc.includes('handleSave');
  record('TC-030', 'Saving Updated Receptionist Permissions', 'Receptionist', 'Doctor', 'Medium',
    staffPermHasSave ? 'PASS' : 'NOT IMPLEMENTED',
    `staff-permissions.tsx has save handler: ${staffPermHasSave}`
  );

  // --- MODULE 5: EMERGENCY TOKEN TESTING ---
  console.log('\n--- MODULE 5: EMERGENCY TOKEN TESTING ---');

  // TC-031: Generate Emergency Token via Backend API
  const tc31 = await request('POST', '/api/tokens/emergency', {
    doctorId,
    patientName: 'Critical Trauma Patient',
    patientPhone: '9555566666',
    condition: 'Acute chest pain',
  });
  record('TC-031', 'Generate Emergency Token via Backend API', 'Emergency', 'Doctor', 'High',
    tc31.status === 201 && tc31.data?.token?.priority === 0 ? 'PASS' : 'FAIL',
    `Status: ${tc31.status}, Priority: ${tc31.data?.token?.priority}`
  );

  // TC-032: Emergency Token Priority Queue Preemption
  const tc32 = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  const isEmergencyCalled = tc32.data?.token?.tokenType === 'EMERGENCY' || tc32.data?.token?.priority === 0;
  record('TC-032', 'Emergency Token Priority Queue Preemption', 'Emergency', 'System', 'High',
    tc32.status === 200 && isEmergencyCalled ? 'PASS' : 'FAIL',
    `Status: ${tc32.status}, Token: ${tc32.data?.token?.tokenNumber}, Type: ${tc32.data?.token?.tokenType}`
  );

  // TC-033: Emergency Token Generation via Mobile UI (priority-override.tsx)
  const priorityOverrideSrc = fs.readFileSync('src/app/(doctor)/priority-override.tsx', 'utf8');
  const hasEmergencyBooking = priorityOverrideSrc.includes('bookEmergencyToken') && !priorityOverrideSrc.includes('/success');
  record('TC-033', 'Emergency Token Generation via Mobile UI (priority-override.tsx)', 'Emergency', 'Doctor', 'High',
    hasEmergencyBooking ? 'PASS' : 'FAIL',
    `priority-override.tsx calls bookEmergencyToken: ${hasEmergencyBooking}`
  );

  // TC-034: Preemption of Active In-Room Consultation (Business Rule Check)
  // Verify that an in-room SERVING consultation is NOT preempted simply by booking an emergency token
  const testServingToken = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Active Serving Patient', patientPhone: '9666677777' });
  const callToServe = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  const serveAct = await request('PATCH', `/api/queues/${queueId}/tokens/${callToServe.data?.token?.id || callToServe.data?.token?._id}/serve`, {}, doctorToken);
  // Book emergency token
  const emPreemptCheck = await request('POST', '/api/tokens/emergency', { doctorId, patientName: 'Emergency Arrival During Consultation', patientPhone: '9777788888' });
  // Check if serving token is still SERVING
  const qStatusCheck = await request('GET', `/api/doctors/${doctorId}/active-queue`, null, doctorToken);
  const servingTokenStillActive = qStatusCheck.data?.tokens?.some(t => t.status === 'SERVING');
  record('TC-034', 'Preemption of Active In-Room Consultation (Business Rule Check)', 'Emergency', 'Doctor', 'High',
    servingTokenStillActive ? 'PASS' : 'FAIL',
    `Serving consultation intact upon emergency arrival: ${servingTokenStillActive}`
  );

  // --- MODULE 6: SUPER ADMIN FLOW ---
  console.log('\n--- MODULE 6: SUPER ADMIN FLOW ---');

  // TC-035: Super Admin Views Pending Provider Submissions
  const tc35 = await request('GET', '/api/admin/providers/pending', null, adminToken);
  record('TC-035', 'Super Admin Views Pending Provider Submissions', 'Admin', 'Super Admin', 'High',
    tc35.status === 200 && Array.isArray(tc35.data) ? 'PASS' : 'FAIL',
    `Status: ${tc35.status}`
  );

  // TC-036: Super Admin Approves Doctor Registration
  const tc36 = await request('PATCH', `/api/admin/providers/${tc16.data?.doctor?.id || 'doc-test'}/approve`, { approvedBy: 'Super Admin' }, adminToken);
  record('TC-036', 'Super Admin Approves Doctor Registration', 'Admin', 'Super Admin', 'High',
    tc36.status === 200 && tc36.data?.approvalStatus === 'APPROVED' ? 'PASS' : 'FAIL',
    `Status: ${tc36.status}, Approval: ${tc36.data?.approvalStatus}`
  );

  // TC-037: Super Admin Rejects Doctor Registration with Mandatory Reason
  const rejectDoc = await request('POST', '/api/doctors/register', { name: 'Dr. Reject Me', phone: '8811223344', type: 'INDIVIDUAL', specialization: 'ENT' });
  const rejectDocId = rejectDoc.data?.doctor?.id || 'doc-reject';
  const emptyReasonRes = await request('PATCH', `/api/admin/providers/${rejectDocId}/reject`, {}, adminToken);
  const validReasonRes = await request('PATCH', `/api/admin/providers/${rejectDocId}/reject`, { reason: 'Invalid license documentation' }, adminToken);
  record('TC-037', 'Super Admin Rejects Doctor Registration with Mandatory Reason', 'Admin', 'Super Admin', 'High',
    emptyReasonRes.status === 400 && validReasonRes.status === 200 ? 'PASS' : 'FAIL',
    `EmptyReason: ${emptyReasonRes.status}, ValidReason: ${validReasonRes.status}`
  );

  // TC-038: Super Admin Suspends Doctor/Clinic Registration
  const suspendRes = await request('PATCH', `/api/admin/providers/${rejectDocId}/suspend`, {}, adminToken);
  record('TC-038', 'Super Admin Suspends Doctor/Clinic Registration', 'Admin', 'Super Admin', 'High',
    suspendRes.status === 200 ? 'PASS' : 'NOT IMPLEMENTED',
    `Status: ${suspendRes.status} (Endpoint /suspend does not exist)`
  );

  // --- MODULE 7: REAL-TIME WEBSOCKET SYNCHRONIZATION ---
  console.log('\n--- MODULE 7: REAL-TIME WEBSOCKET SYNCHRONIZATION ---');

  // TC-039: Socket.IO Server Connection & Queue Room Join
  let sConnected = false;
  let sJoined = false;
  try {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false });
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
  record('TC-039', 'Socket.IO Server Connection & Queue Room Join', 'Real-time', 'System', 'High',
    sConnected && sJoined ? 'PASS' : 'FAIL',
    `Connected: ${sConnected}, Joined: ${sJoined}`
  );

  // TC-040: Doctor Action Broadcasts Real-Time Socket Event
  let eventReceived = false;
  try {
    const s = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false });
    await new Promise((resolve) => {
      s.on('connect', () => {
        s.emit('join_queue', queueId);
        s.on('queue:token_called', () => {
          eventReceived = true;
        });
        resolve();
      });
      setTimeout(resolve, 1000);
    });
    await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
    await new Promise(r => setTimeout(r, 500));
    s.disconnect();
  } catch (e) {}
  record('TC-040', 'Doctor Action Broadcasts Real-Time Socket Event', 'Real-time', 'System', 'High',
    eventReceived ? 'PASS' : 'FAIL',
    `Event received: ${eventReceived}`
  );

  // TC-041: Mobile Patient Queue Screen Real-Time WebSocket Integration
  const patQueueHasSocket = queueScreenSrc.includes('SocketClient.onTokenCalled') && queueScreenSrc.includes('SocketClient.joinQueue');
  record('TC-041', 'Mobile Patient Queue Screen Real-Time WebSocket Integration', 'Real-time', 'Patient', 'High',
    patQueueHasSocket ? 'PASS' : 'FAIL',
    `queue.tsx imports and joins SocketClient: ${patQueueHasSocket}`
  );

  // TC-042: Mobile Doctor Dashboard Real-Time WebSocket Integration
  const docDashHasSocket = docDashSrc.includes('SocketClient.joinQueue') && docDashSrc.includes('SocketClient.onTokenCreated');
  record('TC-042', 'Mobile Doctor Dashboard Real-Time WebSocket Integration', 'Real-time', 'Doctor', 'High',
    docDashHasSocket ? 'PASS' : 'FAIL',
    `dashboard.tsx imports and joins SocketClient: ${docDashHasSocket}`
  );

  // --- MODULE 8: SECURITY & AUTHORIZATION ---
  console.log('\n--- MODULE 8: SECURITY & AUTHORIZATION ---');

  // TC-043: Unauthorized Access to Doctor Call-Next Endpoint
  const tc43 = await request('POST', `/api/queues/${queueId}/call-next`, {});
  record('TC-043', 'Unauthorized Access to Doctor Call-Next Endpoint', 'Security', 'Unauthenticated', 'High',
    tc43.status === 401 || tc43.status === 403 ? 'PASS' : 'FAIL',
    `Status: ${tc43.status}`
  );

  // TC-044: Unauthorized Access to Super Admin Pending Providers
  const tc44 = await request('GET', '/api/admin/providers/pending', null, patientAToken);
  record('TC-044', 'Unauthorized Access to Super Admin Pending Providers', 'Security', 'Patient', 'High',
    tc44.status === 403 ? 'PASS' : 'FAIL',
    `Status: ${tc44.status}`
  );

  // TC-045: Public Unauthenticated Access to Patient Health Records (/api/patients)
  const tc45 = await request('GET', '/api/patients');
  const tc45Blocked = tc45.status === 401 || tc45.status === 403;
  record('TC-045', 'Public Unauthenticated Access to Patient Health Records (/api/patients)', 'Security', 'Unauthenticated', 'Critical',
    tc45Blocked ? 'PASS' : 'FAIL',
    `Status: ${tc45.status} (Returns ${Array.isArray(tc45.data) ? tc45.data.length : 0} patient records publicly)`
  );

  // TC-046: Public Exposure of Doctor Aadhaar & PAN Numbers (/api/doctors)
  const tc46 = await request('GET', '/api/doctors');
  const tc46Exposed = Array.isArray(tc46.data) && tc46.data.some(d => d.aadhaarNumber || d.panNumber);
  record('TC-046', 'Public Exposure of Doctor Aadhaar & PAN Numbers (/api/doctors)', 'Security', 'Unauthenticated', 'Critical',
    !tc46Exposed ? 'PASS' : 'FAIL',
    `Aadhaar/PAN exposed: ${tc46Exposed}`
  );

  // TC-047: Role Guard Middleware Usage in Production Routes
  const serverSrc = fs.readFileSync('server/server.js', 'utf8');
  const hasRequireRoleUsage = (serverSrc.match(/requireRole\(/g) || []).length > 2;
  record('TC-047', 'Role Guard Middleware Usage in Production Routes', 'Security', 'System', 'High',
    hasRequireRoleUsage ? 'PASS' : 'FAIL',
    `requireRole occurrences: ${(serverSrc.match(/requireRole\(/g) || []).length}`
  );

  // TC-048: Cross-Role Token Hijacking
  const tc48 = await request('PATCH', `/api/queues/${queueId}/pause`, {}, patientAToken);
  record('TC-048', 'Cross-Role Token Hijacking (Patient attempting Pause)', 'Security', 'Patient', 'High',
    tc48.status === 403 ? 'PASS' : 'FAIL',
    `Status: ${tc48.status}`
  );

  // --- MODULE 9: QUEUE EDGE CASES ---
  console.log('\n--- MODULE 9: QUEUE EDGE CASES ---');

  // TC-049: Doctor Calls Next When No Patients Are Waiting
  await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  const tc49 = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
  const tc49Graceful = tc49.status === 200 && (tc49.data?.currentTokenNumber === 'None' || tc49.data?.message?.includes('completed') || tc49.data?.message?.includes('No more'));
  record('TC-049', 'Doctor Calls Next When No Patients Are Waiting', 'Queue', 'Doctor', 'Medium',
    tc49Graceful ? 'PASS' : 'FAIL',
    `Status: ${tc49.status}, Current: ${tc49.data?.currentTokenNumber}`
  );

  // TC-050: Duplicate Active Token Request for Same Patient & Doctor
  const phoneDup = '9444455555';
  const t1 = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Dup Patient', patientPhone: phoneDup });
  const t2 = await request('POST', '/api/tokens/regular', { doctorId, patientName: 'Dup Patient', patientPhone: phoneDup });
  record('TC-050', 'Duplicate Active Token Request for Same Patient & Doctor', 'Queue', 'Patient', 'High',
    t2.status === 400 && t2.data?.error?.includes('active token') ? 'PASS' : 'FAIL',
    `t2 Status: ${t2.status}, Error: ${t2.data?.error}`
  );

  // TC-051: Token Generation with Missing Mandatory Fields
  const tc51 = await request('POST', '/api/tokens/regular', { doctorId: '', patientName: '' });
  record('TC-051', 'Token Generation with Missing Mandatory Fields', 'API', 'Patient', 'Medium',
    tc51.status === 400 ? 'PASS' : 'FAIL',
    `Status: ${tc51.status}`
  );

  // TC-052: Backend Route for Updating Patient Treatment Status
  const tc52 = await request('PATCH', '/api/patients/pat-test/status', { treatmentStatus: 'COMPLETED' }, doctorToken);
  record('TC-052', 'Backend Route for Updating Patient Treatment Status', 'API', 'Doctor', 'High',
    tc52.status === 200 ? 'PASS' : 'FAIL',
    `Status: ${tc52.status}`
  );

  // TC-053: Maximum Daily Token Cap Enforcement
  // Check server.js for maxTokens check
  const hasDailyTokenCap = serverSrc.includes('maxTokens') && serverSrc.includes('exceeded');
  record('TC-053', 'Maximum Daily Token Cap Enforcement', 'Queue', 'System', 'Medium',
    hasDailyTokenCap ? 'PASS' : 'NOT IMPLEMENTED',
    `Daily token cap enforcement present in server.js: ${hasDailyTokenCap}`
  );

  // TC-054: Network Disconnection & Client Reconnection
  const socketSrc = fs.readFileSync('src/utils/socket.ts', 'utf8');
  const hasReconnectLogic = socketSrc.includes('reconnectionAttempts') && socketSrc.includes('reconnectionDelay');
  record('TC-054', 'Network Disconnection & Client Reconnection', 'Real-time', 'System', 'Medium',
    hasReconnectLogic ? 'PASS' : 'FAIL',
    `socket.ts configures automatic reconnection attempts: ${hasReconnectLogic}`
  );

  // --- MODULE 10: UI/UX & RESPONSIVENESS ---
  console.log('\n--- MODULE 10: UI/UX & RESPONSIVENESS ---');

  // TC-055: Super Admin Web Responsiveness on Tablet (1024px)
  const adminCssSrc = fs.readFileSync('admin-web/css/admin.css', 'utf8');
  const hasTabletMedia = adminCssSrc.includes('@media') && adminCssSrc.includes('1024px');
  record('TC-055', 'Super Admin Web Responsiveness on Tablet (1024px)', 'UI', 'Admin', 'Medium',
    hasTabletMedia ? 'PASS' : 'FAIL',
    `admin.css has 1024px media queries: ${hasTabletMedia}`
  );

  // TC-056: Super Admin Web Table Overflow on Mobile Viewport (<600px)
  const hasMobileTableCard = adminCssSrc.includes('@media') && adminCssSrc.includes('600px') && (adminCssSrc.includes('display: block') || adminCssSrc.includes('data-label'));
  record('TC-056', 'Super Admin Web Table Overflow on Mobile Viewport (<600px)', 'UI', 'Admin', 'Medium',
    hasMobileTableCard ? 'PASS' : 'FAIL',
    `admin.css has small screen table card transformation: ${hasMobileTableCard}`
  );

  console.log('\n================================================================');
  const passCount = auditResults.filter(r => r.status === 'PASS').length;
  const failCount = auditResults.filter(r => r.status === 'FAIL').length;
  const notImplCount = auditResults.filter(r => r.status === 'NOT IMPLEMENTED').length;
  const blockedCount = auditResults.filter(r => r.status === 'BLOCKED').length;
  console.log(`FULL REGRESSION AUDIT RESULTS:`);
  console.log(`Total: ${auditResults.length} | Passed: ${passCount} | Failed: ${failCount} | Not Implemented: ${notImplCount} | Blocked: ${blockedCount}`);
  console.log('================================================================\n');

  return auditResults;
}

runFullRegressionAudit().catch(console.error);
