/**
 * Complete CareQueue Mobile API & Socket.IO Test Suite against Render
 * Target: https://queuemanagement-api.onrender.com
 */
const { io } = require('socket.io-client');

const PROD_URL = 'https://queuemanagement-api.onrender.com';

async function runMobileProdSuite() {
  console.log('================================================================');
  console.log('  CAREQUEUE FULL END-TO-END MOBILE CLIENT -> RENDER TEST SUITE  ');
  console.log('  Live Production Host:', PROD_URL);
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // 1. Fetch System Stats
  try {
    const res = await fetch(`${PROD_URL}/api/stats`);
    const data = await res.json();
    assert(res.status === 200 && typeof data.totalDoctors === 'number', 'TEST 01: Fetch system stats (GET /api/stats)');
  } catch (err) {
    assert(false, `TEST 01 Error: ${err.message}`);
  }

  // 2. Fetch Doctors List
  let doctorId = null;
  let doctorPhone = null;
  try {
    const res = await fetch(`${PROD_URL}/api/doctors`);
    const data = await res.json();
    const doctors = Array.isArray(data) ? data : (data.doctors || []);
    assert(res.status === 200 && doctors.length > 0, `TEST 02: Fetch approved doctors list (Found: ${doctors.length})`);
    if (doctors.length > 0) {
      doctorId = doctors[0].id || doctors[0]._id;
      doctorPhone = doctors[0].phone;
    }
  } catch (err) {
    assert(false, `TEST 02 Error: ${err.message}`);
  }

  // 3. Register New Patient Record on Production
  const testPatientPhone = '987' + Math.floor(1000000 + Math.random() * 9000000);
  let patientToken = null;
  try {
    const regRes = await fetch(`${PROD_URL}/api/auth/patient/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Mobile E2E Patient',
        phone: testPatientPhone,
        age: 32,
        gender: 'FEMALE',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && !!regData.token, 'TEST 03: Register patient (POST /api/auth/patient/register)');
    patientToken = regData.token;
  } catch (err) {
    assert(false, `TEST 03 Error: ${err.message}`);
  }

  // 4. Patient OTP Login
  try {
    const loginRes = await fetch(`${PROD_URL}/api/auth/patient/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPatientPhone }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && !!loginData.token, 'TEST 04: Patient login via phone (POST /api/auth/patient/login)');
    if (loginData.token) patientToken = loginData.token;
  } catch (err) {
    assert(false, `TEST 04 Error: ${err.message}`);
  }

  // 5. Doctor / Practitioner Login
  let doctorToken = null;
  try {
    const docRes = await fetch(`${PROD_URL}/api/auth/doctor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: doctorPhone || '8864856668' }),
    });
    const docData = await docRes.json();
    assert(docRes.status === 200 && !!docData.token, 'TEST 05: Doctor login via practitioner phone OTP (POST /api/auth/doctor/login)');
    doctorToken = docData.token;
  } catch (err) {
    assert(false, `TEST 05 Error: ${err.message}`);
  }

  // 6. Get Doctor Active Queue
  let queueMongoId = null;
  if (doctorId && doctorToken) {
    try {
      const qRes = await fetch(`${PROD_URL}/api/doctors/${doctorId}/active-queue`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      const qData = await qRes.json();
      assert(qRes.status === 200 && !!qData.queue, `TEST 06: Get Doctor Active Queue (Queue Mongo ID: ${qData.queue?._id})`);
      queueMongoId = qData.queue?._id;
    } catch (err) {
      assert(false, `TEST 06 Error: ${err.message}`);
    }
  }

  // 7. Socket.IO Real-Time Stream Connection with JWT Authentication
  await new Promise((resolve) => {
    if (!patientToken) {
      assert(false, 'TEST 07: Socket.IO connection skipped (No patient token)');
      return resolve();
    }

    const socket = io(PROD_URL, {
      transports: ['websocket', 'polling'],
      auth: { token: patientToken },
      timeout: 10000,
    });

    socket.on('connect', () => {
      assert(true, 'TEST 07: Socket.IO connects with JWT auth to Render WebSocket stream');
      if (queueMongoId) {
        socket.emit('join_queue', queueMongoId);
      }
      setTimeout(() => {
        socket.disconnect();
        resolve();
      }, 1000);
    });

    socket.on('connect_error', (err) => {
      assert(false, `TEST 07 Error: Socket connection error - ${err.message}`);
      socket.disconnect();
      resolve();
    });
  });

  // 8. Book Regular Token (TK-XX) on Production
  let bookedToken = null;
  if (doctorId && patientToken) {
    try {
      const tokRes = await fetch(`${PROD_URL}/api/tokens/regular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${patientToken}`,
        },
        body: JSON.stringify({
          doctorId,
          patientName: 'Mobile E2E Patient',
          patientPhone: testPatientPhone,
          condition: 'Fever & Cough',
        }),
      });
      const tokData = await tokRes.json();
      assert(tokRes.status === 201 && !!tokData.token, `TEST 08: Book Regular Token (Token Number: ${tokData.token?.tokenNumber})`);
      bookedToken = tokData.token;
    } catch (err) {
      assert(false, `TEST 08 Error: ${err.message}`);
    }
  }

  // 9. Get My Active Token
  if (testPatientPhone && patientToken) {
    try {
      const myTokRes = await fetch(`${PROD_URL}/api/tokens/my-token?phone=${testPatientPhone}`, {
        headers: { Authorization: `Bearer ${patientToken}` },
      });
      const myTokData = await myTokRes.json();
      assert(myTokRes.status === 200 && !!myTokData.activeToken, `TEST 09: Track active token (Found: ${myTokData.activeToken?.tokenNumber})`);
    } catch (err) {
      assert(false, `TEST 09 Error: ${err.message}`);
    }
  }

  // 10. Receptionist / Doctor Scoped Patient Search
  if (doctorToken && testPatientPhone) {
    try {
      const searchRes = await fetch(`${PROD_URL}/api/patients/search?phone=${testPatientPhone}`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      const searchData = await searchRes.json();
      assert(searchRes.status === 200 && !!searchData.patient, `TEST 10: Receptionist Search Patient by Phone (Found: ${searchData.patient?.name})`);
    } catch (err) {
      assert(false, `TEST 10 Error: ${err.message}`);
    }
  }

  // 11. Call Next Token (Doctor / Receptionist)
  if (queueMongoId && doctorToken) {
    try {
      const callRes = await fetch(`${PROD_URL}/api/queues/${queueMongoId}/call-next`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      const callData = await callRes.json();
      assert(callRes.status === 200 && (callData.token || callData.queue), 'TEST 11: Doctor calls next token (Status -> CALLED)');
    } catch (err) {
      assert(false, `TEST 11 Error: ${err.message}`);
    }
  }

  // 12. Complete Consultation
  const tokenMongoId = bookedToken?._id || bookedToken?.id;
  if (queueMongoId && tokenMongoId && doctorToken) {
    try {
      const compRes = await fetch(`${PROD_URL}/api/queues/${queueMongoId}/tokens/${tokenMongoId}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      const compData = await compRes.json();
      assert(compRes.status === 200, 'TEST 12: Doctor completes consultation (Status -> COMPLETED)');
    } catch (err) {
      assert(false, `TEST 12 Error: ${err.message}`);
    }
  }

  console.log('\n================================================================');
  console.log(`  E2E TEST SUMMARY: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('================================================================\n');
}

runMobileProdSuite().catch(console.error);
