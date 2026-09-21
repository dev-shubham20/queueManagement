/**
 * Remote API & Socket.IO Production Verification Suite
 * Target: https://queuemanagement-api.onrender.com
 */
const { io } = require('socket.io-client');

const PROD_URL = 'https://queuemanagement-api.onrender.com';

async function runProdVerification() {
  console.log('====================================================');
  console.log('  CAREQUEUE PRODUCTION API & SOCKET.IO VERIFICATION ');
  console.log('  Target:', PROD_URL);
  console.log('====================================================\n');

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

  // 1. Check API Stats
  try {
    const res = await fetch(`${PROD_URL}/api/stats`);
    const data = await res.json();
    assert(res.status === 200 && typeof data.totalDoctors === 'number', '1. GET /api/stats returns 200 with clinic statistics');
  } catch (err) {
    assert(false, `1. GET /api/stats error: ${err.message}`);
  }

  // 2. Check Doctor Listing
  let doctorId = null;
  let doctorPhone = null;
  try {
    const res = await fetch(`${PROD_URL}/api/doctors`);
    const data = await res.json();
    const doctorsList = Array.isArray(data) ? data : (data.doctors || []);
    assert(res.status === 200 && Array.isArray(doctorsList) && doctorsList.length > 0, `2. GET /api/doctors returns ${doctorsList.length} approved doctor(s)`);
    if (doctorsList.length > 0) {
      doctorId = doctorsList[0].id || doctorsList[0]._id;
      doctorPhone = doctorsList[0].phone;
    }
  } catch (err) {
    assert(false, `2. GET /api/doctors error: ${err.message}`);
  }

  // 3. Register / Authenticate Test Patient on Production
  const testPhone = '999' + Math.floor(1000000 + Math.random() * 9000000);
  let patientToken = null;
  try {
    const regRes = await fetch(`${PROD_URL}/api/auth/patient/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Prod Test Patient',
        phone: testPhone,
        age: 28,
        gender: 'MALE',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && !!regData.token, '3. POST /api/auth/patient/register creates authentic patient record');
    patientToken = regData.token;
  } catch (err) {
    assert(false, `3. Patient registration error: ${err.message}`);
  }

  // 4. Test Patient OTP Login Flow
  try {
    const loginRes = await fetch(`${PROD_URL}/api/auth/patient/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && !!loginData.token, '4. POST /api/auth/patient/login authenticates registered patient');
    if (loginData.token) patientToken = loginData.token;
  } catch (err) {
    assert(false, `4. Patient login error: ${err.message}`);
  }

  // 5. Test Doctor Login with Doctor Phone OTP / Password Mode
  let doctorToken = null;
  try {
    const docLoginRes = await fetch(`${PROD_URL}/api/auth/doctor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: doctorPhone || '8864856668',
      }),
    });
    const docData = await docLoginRes.json();
    if (docLoginRes.status === 200 && docData.token) {
      assert(true, '5. POST /api/auth/doctor/login authenticates doctor account on production');
      doctorToken = docData.token;
    } else {
      assert(false, `5. Doctor login returned status ${docLoginRes.status}: ${JSON.stringify(docData)}`);
    }
  } catch (err) {
    assert(false, `5. Doctor login error: ${err.message}`);
  }

  // 6. Test Doctor Active Queue
  let queueId = null;
  if (doctorId) {
    try {
      const qRes = await fetch(`${PROD_URL}/api/queues/doctor/${doctorId}/active`, {
        headers: doctorToken ? { Authorization: `Bearer ${doctorToken}` } : {},
      });
      const qData = await qRes.json();
      assert(qRes.status === 200 && !!qData.queue, `6. GET /api/queues/doctor/:id/active retrieves active queue (${qData.queue?.id || qData.queue?._id})`);
      queueId = qData.queue?.id || qData.queue?._id || `queue-${doctorId}`;
    } catch (err) {
      assert(false, `6. Active queue error: ${err.message}`);
    }
  }

  // 7. Test Socket.IO Real-Time Connection with JWT
  await new Promise((resolve) => {
    if (!patientToken) {
      assert(false, '7. Skipped Socket.IO (No auth token)');
      return resolve();
    }

    const socket = io(PROD_URL, {
      transports: ['websocket', 'polling'],
      auth: { token: patientToken },
      timeout: 10000,
    });

    socket.on('connect', () => {
      assert(true, '7. Socket.IO successfully connects to Render production with JWT');
      if (queueId) {
        socket.emit('join_queue', queueId);
      }
      setTimeout(() => {
        socket.disconnect();
        resolve();
      }, 1000);
    });

    socket.on('connect_error', (err) => {
      assert(false, `7. Socket.IO connection error: ${err.message}`);
      socket.disconnect();
      resolve();
    });
  });

  // 8. Test Regular Token Creation on Production
  let createdTokenId = null;
  if (patientToken && doctorId) {
    try {
      const tokRes = await fetch(`${PROD_URL}/api/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${patientToken}`,
        },
        body: JSON.stringify({
          doctorId: doctorId,
          patientName: 'Prod Test Patient',
          patientPhone: testPhone,
          condition: 'General Health Check',
        }),
      });
      const tokData = await tokRes.json();
      assert(tokRes.status === 201 && !!tokData.token, `8. POST /api/tokens issues regular token (${tokData.token?.tokenNumber || 'TK-XX'})`);
      createdTokenId = tokData.token?._id || tokData.token?.id;
    } catch (err) {
      assert(false, `8. Token creation error: ${err.message}`);
    }
  }

  // 9. Test Receptionist Patient Search via Production
  if (doctorToken) {
    try {
      const searchRes = await fetch(`${PROD_URL}/api/patients/search?phone=${testPhone}`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });
      const searchData = await searchRes.json();
      assert(searchRes.status === 200 && !!searchData.patient, '9. GET /api/patients/search finds patient record on production');
    } catch (err) {
      assert(false, `9. Search error: ${err.message}`);
    }
  }

  // 10. Test Token Cancellation on Production
  if (createdTokenId && patientToken) {
    try {
      const cancelRes = await fetch(`${PROD_URL}/api/tokens/${createdTokenId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${patientToken}`,
        },
        body: JSON.stringify({ reason: 'Verification cleanup' }),
      });
      assert(cancelRes.status === 200, '10. PATCH /api/tokens/:id/cancel cancels token cleanly on production');
    } catch (err) {
      assert(false, `10. Token cancel error: ${err.message}`);
    }
  }

  console.log('\n====================================================');
  console.log(`  VERIFICATION RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('====================================================\n');
}

runProdVerification().catch(console.error);
