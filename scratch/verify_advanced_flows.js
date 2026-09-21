const http = require('http');
const { io } = require('socket.io-client');

const BASE_URL = 'http://localhost:5001';

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

async function runAdvancedVerifications() {
  console.log('================================================================');
  console.log('   STARTING DUAL-CLIENT SOCKET.IO & PATIENT ↔ DOCTOR QA SUITE  ');
  console.log('================================================================\n');

  const testResults = [];
  function record(title, pass, details) {
    testResults.push({ title, pass, details });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${title} ${details ? '- ' + details : ''}`);
  }

  // Step 1: Log in Doctor and get Doctor Token & Active Queue
  const docLogin = await request('POST', '/api/auth/doctor/login', { identifier: '8864856668', isOtp: true });
  const docToken = docLogin.data?.token;
  const docId = 'doc-1789897698627';

  const qRes = await request('GET', `/api/doctors/${docId}/active-queue`, null, docToken);
  const queueId = qRes.data?.queue?._id || qRes.data?.queue?.id;
  console.log(`Using Queue ID: ${queueId}`);

  // Step 2: Establish TWO simultaneous Socket.IO clients: Doctor Client & Patient Client
  const doctorSocket = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false, auth: { token: docToken || '' } });
  const patientSocket = io(BASE_URL, { transports: ['websocket', 'polling'], reconnection: false, auth: { token: docToken || '' } });

  await new Promise(r => setTimeout(r, 1000));

  const doctorEvents = [];
  const patientEvents = [];

  doctorSocket.emit('join_queue', queueId);
  patientSocket.emit('join_queue', queueId);

  doctorSocket.onAny((event, data) => {
    doctorEvents.push({ event, data });
  });

  patientSocket.onAny((event, data) => {
    patientEvents.push({ event, data });
  });

  // Test A: Patient books -> Doctor receives queue:token_created
  const testPatientPhone = '9988776655';
  const bookRes = await request('POST', '/api/tokens/regular', {
    doctorId: docId,
    patientName: 'Realtime Test Patient',
    patientPhone: testPatientPhone,
    condition: 'Acute throat infection',
  });

  await new Promise(r => setTimeout(r, 500));
  const tokenCreatedEvent = doctorEvents.find(e => e.event === 'queue:token_created');
  const createdPass = bookRes.status === 201 && !!tokenCreatedEvent;
  record(
    'Patient books token -> Doctor receives queue:token_created in real-time',
    createdPass,
    `Token: ${bookRes.data?.token?.tokenNumber}, Event received: ${!!tokenCreatedEvent}`
  );
  const createdToken = bookRes.data?.token;

  // Test B: Duplicate Active Token Protection
  const duplicateBookRes = await request('POST', '/api/tokens/regular', {
    doctorId: docId,
    patientName: 'Realtime Test Patient',
    patientPhone: testPatientPhone,
    condition: 'Duplicate attempt',
  });
  const dupBlocked = duplicateBookRes.status === 400 && duplicateBookRes.data?.error?.includes('active token');
  record(
    'Duplicate Active Token Protection rejects second booking with HTTP 400',
    dupBlocked,
    `HTTP ${duplicateBookRes.status}: "${duplicateBookRes.data?.error}"`
  );

  // Test C: Doctor calls next -> Patient receives queue:token_called
  const callNextRes = await request('POST', `/api/queues/${queueId}/call-next`, {}, docToken);
  await new Promise(r => setTimeout(r, 500));
  const tokenCalledEvent = patientEvents.find(e => e.event === 'queue:token_called');
  record(
    'Doctor calls next -> Patient receives queue:token_called in real-time',
    callNextRes.status === 200 && !!tokenCalledEvent,
    `Called: ${callNextRes.data?.currentTokenNumber}, Patient Event Received: ${!!tokenCalledEvent}`
  );

  // Test D: Doctor serves -> Patient receives queue:token_serving
  const activeTokenId = callNextRes.data?.tokenId || createdToken?.id || createdToken?._id;
  const serveRes = await request('PATCH', `/api/queues/${queueId}/tokens/${activeTokenId}/serve`, {}, docToken);
  await new Promise(r => setTimeout(r, 500));
  const tokenServingEvent = patientEvents.find(e => e.event === 'queue:token_serving');
  record(
    'Doctor serves -> Patient receives queue:token_serving in real-time',
    serveRes.status === 200 && !!tokenServingEvent,
    `Status: ${serveRes.data?.status}, Patient Event Received: ${!!tokenServingEvent}`
  );

  // Test E: Doctor completes -> Patient receives queue:token_completed
  const completeRes = await request('PATCH', `/api/queues/${queueId}/tokens/${activeTokenId}/complete`, {}, docToken);
  await new Promise(r => setTimeout(r, 500));
  const tokenCompletedEvent = patientEvents.find(e => e.event === 'queue:token_completed');
  record(
    'Doctor completes -> Patient receives queue:token_completed in real-time',
    completeRes.status === 200 && !!tokenCompletedEvent,
    `Status: ${completeRes.data?.status}, Patient Event Received: ${!!tokenCompletedEvent}`
  );

  // Test F: Doctor skips -> Patient receives queue:token_skipped
  // Book another patient to skip
  const skipPhone = '9988776656';
  const bookForSkip = await request('POST', '/api/tokens/regular', {
    doctorId: docId,
    patientName: 'Absent Patient',
    patientPhone: skipPhone,
    condition: 'General checkup',
  });
  const skipTokenId = bookForSkip.data?.token?.id || bookForSkip.data?.token?._id;
  const skipRes = await request('PATCH', `/api/queues/${queueId}/tokens/${skipTokenId}/skip`, { reason: 'No show' }, docToken);
  await new Promise(r => setTimeout(r, 500));
  const tokenSkippedEvent = patientEvents.find(e => e.event === 'queue:token_skipped');
  record(
    'Doctor skips -> Patient receives queue:token_skipped in real-time',
    skipRes.status === 200 && !!tokenSkippedEvent && skipRes.data?.status === 'SKIPPED',
    `Status: ${skipRes.data?.status}, Patient Event Received: ${!!tokenSkippedEvent}`
  );

  // Test G: Patient cancels -> Doctor receives queue:token_cancelled
  const cancelPhone = '9988776657';
  const bookForCancel = await request('POST', '/api/tokens/regular', {
    doctorId: docId,
    patientName: 'Cancelling Patient',
    patientPhone: cancelPhone,
    condition: 'Follow-up',
  });
  const cancelTokenId = bookForCancel.data?.token?.id || bookForCancel.data?.token?._id;
  const cancelRes = await request('PATCH', `/api/queues/${queueId}/tokens/${cancelTokenId}/cancel`, { reason: 'Feeling better' });
  await new Promise(r => setTimeout(r, 500));
  const tokenCancelledEvent = doctorEvents.find(e => e.event === 'queue:token_cancelled');
  record(
    'Patient cancels -> Doctor receives queue:token_cancelled in real-time',
    cancelRes.status === 200 && !!tokenCancelledEvent && cancelRes.data?.status === 'CANCELLED',
    `Status: ${cancelRes.data?.status}, Doctor Event Received: ${!!tokenCancelledEvent}`
  );

  // Test H: Emergency Priority 0 Ordering Ahead of Regular Priority 1
  // First book a regular token
  const regularBook = await request('POST', '/api/tokens/regular', {
    doctorId: docId,
    patientName: 'Regular Patient Ahead in Time',
    patientPhone: '9988776658',
    condition: 'Mild cold',
  });
  // Then book an emergency token later in time
  const emergencyBook = await request('POST', '/api/tokens/emergency', {
    doctorId: docId,
    patientName: 'Critical Emergency Patient Booked Later',
    patientPhone: '9988776659',
    condition: 'Acute chest pain',
  });

  // Call next: Emergency MUST be called first because Priority 0 < Priority 1
  const emergencyCallRes = await request('POST', `/api/queues/${queueId}/call-next`, {}, docToken);
  const calledEmergency = emergencyCallRes.data?.token?.tokenType === 'EMERGENCY' || emergencyCallRes.data?.token?.priority === 0;
  record(
    'Emergency Priority 0 is called BEFORE Regular Priority 1 (Even if regular booked first)',
    calledEmergency,
    `Called: ${emergencyCallRes.data?.token?.tokenNumber} (${emergencyCallRes.data?.token?.tokenType}, Priority: ${emergencyCallRes.data?.token?.priority})`
  );

  // Clean up sockets
  doctorSocket.disconnect();
  patientSocket.disconnect();

  console.log('\n================================================================');
  console.log(`ADVANCED FLOW VERIFICATION RESULT: ${testResults.filter(r => r.pass).length}/${testResults.length} PASSED`);
  console.log('================================================================\n');
}

runAdvancedVerifications().catch(console.error);
