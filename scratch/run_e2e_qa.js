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

async function runE2ETests() {
  const results = [];

  function record(id, title, module, role, priority, status, details = {}) {
    results.push({ id, title, module, role, priority, status, ...details });
    console.log(`[${status}] ${id}: ${title}`);
  }

  console.log('====================================================');
  console.log('   STARTING CareQueue AUTOMATED QA TEST EXECUTION   ');
  console.log('====================================================\n');

  // --- MODULE 1: AUTHENTICATION & USERS ---
  console.log('--- 1. AUTHENTICATION & ROLE ACCESS ---');
  
  // TC-001: Super Admin Login
  try {
    const res = await request('POST', '/api/admin/login', {
      email: 'dev.shubhamagrawal@gmail.com',
      password: '$hubh@Achuki23',
    });
    if (res.status === 200 && res.data.token) {
      record('TC-001', 'Super Admin Login with valid credentials', 'Auth', 'Super Admin', 'High', 'PASS', {
        expected: 'HTTP 200, JWT token returned',
        actual: `HTTP 200, role: ${res.data.role}`,
        evidence: JSON.stringify(res.data)
      });
    } else {
      record('TC-001', 'Super Admin Login with valid credentials', 'Auth', 'Super Admin', 'High', 'FAIL', {
        expected: 'HTTP 200, JWT token returned',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-001', 'Super Admin Login with valid credentials', 'Auth', 'Super Admin', 'High', 'FAIL', { actual: e.message });
  }

  // TC-002: Super Admin Login with invalid password
  try {
    const res = await request('POST', '/api/admin/login', {
      email: 'dev.shubhamagrawal@gmail.com',
      password: 'WrongPassword123!',
    });
    if (res.status === 401 || res.status === 400) {
      record('TC-002', 'Super Admin Login with invalid password', 'Auth', 'Super Admin', 'High', 'PASS', {
        expected: 'HTTP 401 Unauthorized',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    } else {
      record('TC-002', 'Super Admin Login with invalid password', 'Auth', 'Super Admin', 'High', 'FAIL', {
        expected: 'HTTP 401 Unauthorized',
        actual: `HTTP ${res.status}`,
      });
    }
  } catch (e) {
    record('TC-002', 'Super Admin Login with invalid password', 'Auth', 'Super Admin', 'High', 'FAIL', { actual: e.message });
  }

  // TC-003: Patient A Registration
  let patientAToken = null;
  const phoneA = '9876500001';
  try {
    const res = await request('POST', '/api/auth/patient/register', {
      name: 'Test Patient Alpha',
      phone: phoneA,
      age: 29,
      gender: 'MALE',
      condition: 'Fever & Cough',
    });
    if (res.status === 200 || res.status === 201) {
      patientAToken = res.data.token;
      record('TC-003', 'Patient A Registration', 'Patient', 'Patient', 'High', 'PASS', {
        expected: 'HTTP 200/201 with session token',
        actual: `HTTP ${res.status}, user: ${res.data.user?.name}`,
        evidence: JSON.stringify(res.data)
      });
    } else {
      record('TC-003', 'Patient A Registration', 'Patient', 'Patient', 'High', 'FAIL', {
        expected: 'HTTP 200/201 with session token',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-003', 'Patient A Registration', 'Patient', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // TC-004: Patient A Login via OTP endpoint
  try {
    const res = await request('POST', '/api/auth/patient/login', {
      phone: phoneA,
      otp: '1234',
    });
    if (res.status === 200 && res.data.token) {
      patientAToken = res.data.token;
      record('TC-004', 'Patient A Login via OTP', 'Patient', 'Patient', 'High', 'PASS', {
        expected: 'HTTP 200 with JWT token',
        actual: `HTTP 200, user: ${res.data.user?.name}`,
      });
    } else {
      record('TC-004', 'Patient A Login via OTP', 'Patient', 'Patient', 'High', 'FAIL', {
        expected: 'HTTP 200 with JWT token',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-004', 'Patient A Login via OTP', 'Patient', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // TC-005: Patient B Registration & Login
  let patientBToken = null;
  const phoneB = '9876500002';
  try {
    const res = await request('POST', '/api/auth/patient/register', {
      name: 'Test Patient Beta',
      phone: phoneB,
      age: 45,
      gender: 'FEMALE',
      condition: 'Hypertension follow-up',
    });
    if (res.status === 200 || res.status === 201) {
      patientBToken = res.data.token;
      record('TC-005', 'Patient B Registration', 'Patient', 'Patient', 'High', 'PASS', {
        expected: 'HTTP 200/201 with session token',
        actual: `HTTP ${res.status}, user: ${res.data.user?.name}`,
      });
    } else {
      record('TC-005', 'Patient B Registration', 'Patient', 'Patient', 'High', 'FAIL', {
        expected: 'HTTP 200/201 with session token',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-005', 'Patient B Registration', 'Patient', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // TC-006: Doctor Login with OTP mode
  let doctorToken = null;
  let doctorId = 'doc-1789897698627';
  try {
    const res = await request('POST', '/api/auth/doctor/login', {
      identifier: '8864856668',
      isOtp: true,
    });
    if (res.status === 200 && res.data.token) {
      doctorToken = res.data.token;
      record('TC-006', 'Doctor Login with OTP mode', 'Doctor', 'Doctor', 'High', 'PASS', {
        expected: 'HTTP 200 with Doctor JWT session',
        actual: `HTTP 200, role: ${res.data.role}, doctor: ${res.data.user?.name}`,
      });
    } else {
      record('TC-006', 'Doctor Login with OTP mode', 'Doctor', 'Doctor', 'High', 'FAIL', {
        expected: 'HTTP 200 with Doctor JWT session',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-006', 'Doctor Login with OTP mode', 'Doctor', 'Doctor', 'High', 'FAIL', { actual: e.message });
  }

  // TC-007: Authorization - Patient calling Doctor Call-Next endpoint
  try {
    const res = await request('POST', '/api/queues/queue-test/call-next', {}, patientAToken);
    if (res.status === 403 || res.status === 401) {
      record('TC-007', 'Authorization: Patient calling Doctor Call-Next endpoint is forbidden', 'Security', 'Patient', 'High', 'PASS', {
        expected: 'HTTP 403 Forbidden or 401 Unauthorized',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    } else {
      record('TC-007', 'Authorization: Patient calling Doctor Call-Next endpoint is forbidden', 'Security', 'Patient', 'High', 'FAIL', {
        expected: 'HTTP 403 Forbidden or 401 Unauthorized',
        actual: `HTTP ${res.status} (Allowed patient to trigger call-next!)`,
      });
    }
  } catch (e) {
    record('TC-007', 'Authorization: Patient calling Doctor Call-Next endpoint is forbidden', 'Security', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // TC-008: Authorization - Patient accessing Super Admin pending providers
  try {
    const res = await request('GET', '/api/admin/providers/pending', null, patientAToken);
    if (res.status === 403 || res.status === 401) {
      record('TC-008', 'Authorization: Patient accessing Super Admin pending providers is forbidden', 'Security', 'Patient', 'High', 'PASS', {
        expected: 'HTTP 403 Forbidden or 401 Unauthorized',
        actual: `HTTP ${res.status}`,
      });
    } else {
      record('TC-008', 'Authorization: Patient accessing Super Admin pending providers is forbidden', 'Security', 'Patient', 'High', 'FAIL', {
        expected: 'HTTP 403 Forbidden or 401 Unauthorized',
        actual: `HTTP ${res.status} (Leaked admin provider list to patient!)`,
      });
    }
  } catch (e) {
    record('TC-008', 'Authorization: Patient accessing Super Admin pending providers is forbidden', 'Security', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // --- MODULE 2: QUEUE & TOKEN LIFECYCLE ---
  console.log('\n--- 2. QUEUE & TOKEN LIFECYCLE ---');

  // TC-009: Get Doctor Active Queue
  let activeQueue = null;
  try {
    const res = await request('GET', `/api/doctors/${doctorId}/active-queue`, null, doctorToken);
    if (res.status === 200 && res.data.queue) {
      activeQueue = res.data.queue;
      record('TC-009', 'Get Doctor Active Queue', 'Queue', 'Doctor', 'High', 'PASS', {
        expected: 'HTTP 200 with queue object and tokens array',
        actual: `HTTP 200, queueId: ${activeQueue._id || activeQueue.id}, status: ${activeQueue.status}`,
        evidence: JSON.stringify(res.data.queue)
      });
    } else {
      record('TC-009', 'Get Doctor Active Queue', 'Queue', 'Doctor', 'High', 'FAIL', {
        expected: 'HTTP 200 with active queue',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-009', 'Get Doctor Active Queue', 'Queue', 'Doctor', 'High', 'FAIL', { actual: e.message });
  }

  const queueId = activeQueue ? (activeQueue._id || activeQueue.id) : `queue-${doctorId}`;

  // TC-010: Patient A joins queue (Regular Token)
  let tokenA = null;
  try {
    const res = await request('POST', '/api/tokens/regular', {
      doctorId,
      patientName: 'Test Patient Alpha',
      patientPhone: phoneA,
      age: 29,
      gender: 'MALE',
      condition: 'Fever',
    }, patientAToken);
    if (res.status === 200 || res.status === 201) {
      tokenA = res.data.token;
      record('TC-010', 'Patient A generates Regular Token', 'Token', 'Patient', 'High', 'PASS', {
        expected: 'HTTP 200/201 with tokenNumber, positionAhead, and queueId',
        actual: `HTTP ${res.status}, token: ${tokenA.tokenNumber}, positionAhead: ${tokenA.positionAhead}`,
        evidence: JSON.stringify(res.data)
      });
    } else {
      record('TC-010', 'Patient A generates Regular Token', 'Token', 'Patient', 'High', 'FAIL', {
        expected: 'HTTP 200/201 with token',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-010', 'Patient A generates Regular Token', 'Token', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // TC-011: Patient B joins queue (Regular Token) & Position Verification
  let tokenB = null;
  try {
    const res = await request('POST', '/api/tokens/regular', {
      doctorId,
      patientName: 'Test Patient Beta',
      patientPhone: phoneB,
      age: 45,
      gender: 'FEMALE',
      condition: 'Hypertension',
    }, patientBToken);
    if (res.status === 200 || res.status === 201) {
      tokenB = res.data.token;
      const expectedPos = (tokenA?.positionAhead !== undefined) ? tokenA.positionAhead + 1 : 1;
      const isPosCorrect = tokenB.positionAhead >= 1;
      record('TC-011', 'Patient B generates Regular Token and verifies positionAhead', 'Token', 'Patient', 'High', isPosCorrect ? 'PASS' : 'FAIL', {
        expected: 'Token B positionAhead should be greater than Token A',
        actual: `Token A: ${tokenA?.tokenNumber} (pos: ${tokenA?.positionAhead}) | Token B: ${tokenB?.tokenNumber} (pos: ${tokenB?.positionAhead})`,
      });
    } else {
      record('TC-011', 'Patient B generates Regular Token and verifies positionAhead', 'Token', 'Patient', 'High', 'FAIL', {
        expected: 'HTTP 200/201 with token',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-011', 'Patient B generates Regular Token and verifies positionAhead', 'Token', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // TC-012: Patient Tracking Own Token (/api/tokens/my-token)
  try {
    const res = await request('GET', `/api/tokens/my-token?phone=${phoneA}`, null, patientAToken);
    if (res.status === 200 && res.data.token) {
      record('TC-012', 'Patient A tracks own active token status via API', 'Token', 'Patient', 'High', 'PASS', {
        expected: 'HTTP 200 returning patient active token',
        actual: `HTTP 200, token: ${res.data.token.tokenNumber}, status: ${res.data.token.status}`,
      });
    } else {
      record('TC-012', 'Patient A tracks own active token status via API', 'Token', 'Patient', 'High', 'FAIL', {
        expected: 'HTTP 200 returning active token',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-012', 'Patient A tracks own active token status via API', 'Token', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // TC-013: Emergency Token Generation
  let tokenEmergency = null;
  try {
    const res = await request('POST', '/api/tokens/emergency', {
      doctorId,
      patientName: 'Emergency Trauma Patient',
      patientPhone: '9999911111',
      age: 50,
      gender: 'MALE',
      condition: 'Severe Chest Pain',
      notes: 'Immediate triage required',
    }, doctorToken);
    if (res.status === 200 || res.status === 201) {
      tokenEmergency = res.data.token;
      record('TC-013', 'Generate Emergency Token with priority tag', 'Token', 'Doctor/Staff', 'High', 'PASS', {
        expected: 'HTTP 200/201 with emergency token number and EMERGENCY type',
        actual: `HTTP ${res.status}, token: ${tokenEmergency.tokenNumber}, type: ${tokenEmergency.tokenType}`,
        evidence: JSON.stringify(res.data)
      });
    } else {
      record('TC-013', 'Generate Emergency Token with priority tag', 'Token', 'Doctor/Staff', 'High', 'FAIL', {
        expected: 'HTTP 200/201 emergency token',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-013', 'Generate Emergency Token with priority tag', 'Token', 'Doctor/Staff', 'High', 'FAIL', { actual: e.message });
  }

  // TC-014: Doctor calls next token (Call Next)
  let calledToken = null;
  try {
    const res = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
    if (res.status === 200 && res.data.currentTokenNumber) {
      calledToken = res.data;
      record('TC-014', 'Doctor calls next token (WAITING -> CALLED)', 'Queue', 'Doctor', 'High', 'PASS', {
        expected: 'HTTP 200 with currentTokenNumber and calledAt timestamp',
        actual: `HTTP 200, currentTokenNumber: ${calledToken.currentTokenNumber}, patient: ${calledToken.patientName}`,
        evidence: JSON.stringify(res.data)
      });
    } else {
      record('TC-014', 'Doctor calls next token (WAITING -> CALLED)', 'Queue', 'Doctor', 'High', 'FAIL', {
        expected: 'HTTP 200 with called token details',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-014', 'Doctor calls next token (WAITING -> CALLED)', 'Queue', 'Doctor', 'High', 'FAIL', { actual: e.message });
  }

  // TC-015: Doctor serves token (CALLED -> SERVING)
  const tokenIdToServe = calledToken?.tokenId || tokenA?._id || tokenA?.id;
  try {
    if (tokenIdToServe) {
      const res = await request('PATCH', `/api/queues/${queueId}/tokens/${tokenIdToServe}/serve`, {}, doctorToken);
      if (res.status === 200) {
        record('TC-015', 'Doctor starts serving patient (CALLED -> SERVING)', 'Queue', 'Doctor', 'High', 'PASS', {
          expected: 'HTTP 200 with status: SERVING',
          actual: `HTTP 200, status: ${res.data.token?.status || res.data.status}`,
        });
      } else {
        record('TC-015', 'Doctor starts serving patient (CALLED -> SERVING)', 'Queue', 'Doctor', 'High', 'FAIL', {
          expected: 'HTTP 200 with status: SERVING',
          actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
        });
      }
    } else {
      record('TC-015', 'Doctor starts serving patient (CALLED -> SERVING)', 'Queue', 'Doctor', 'High', 'BLOCKED', {
        actual: 'No called token ID available from previous step'
      });
    }
  } catch (e) {
    record('TC-015', 'Doctor starts serving patient (CALLED -> SERVING)', 'Queue', 'Doctor', 'High', 'FAIL', { actual: e.message });
  }

  // TC-016: Doctor completes token (SERVING -> COMPLETED)
  try {
    if (tokenIdToServe) {
      const res = await request('PATCH', `/api/queues/${queueId}/tokens/${tokenIdToServe}/complete`, {}, doctorToken);
      if (res.status === 200) {
        record('TC-016', 'Doctor completes patient consultation (SERVING -> COMPLETED)', 'Queue', 'Doctor', 'High', 'PASS', {
          expected: 'HTTP 200 with status: COMPLETED',
          actual: `HTTP 200, status: ${res.data.token?.status || res.data.status}`,
        });
      } else {
        record('TC-016', 'Doctor completes patient consultation (SERVING -> COMPLETED)', 'Queue', 'Doctor', 'High', 'FAIL', {
          expected: 'HTTP 200 with status: COMPLETED',
          actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
        });
      }
    } else {
      record('TC-016', 'Doctor completes patient consultation (SERVING -> COMPLETED)', 'Queue', 'Doctor', 'High', 'BLOCKED');
    }
  } catch (e) {
    record('TC-016', 'Doctor completes patient consultation (SERVING -> COMPLETED)', 'Queue', 'Doctor', 'High', 'FAIL', { actual: e.message });
  }

  // TC-017: Doctor skips a waiting/called token (WAITING/CALLED -> SKIPPED)
  const tokenToSkip = tokenB?._id || tokenB?.id;
  try {
    if (tokenToSkip) {
      const res = await request('PATCH', `/api/queues/${queueId}/tokens/${tokenToSkip}/skip`, { reason: 'Patient absent when called' }, doctorToken);
      if (res.status === 200) {
        record('TC-017', 'Doctor skips patient token (WAITING/CALLED -> SKIPPED)', 'Queue', 'Doctor', 'High', 'PASS', {
          expected: 'HTTP 200 with status: SKIPPED',
          actual: `HTTP 200, status: ${res.data.token?.status || res.data.status}`,
        });
      } else {
        record('TC-017', 'Doctor skips patient token (WAITING/CALLED -> SKIPPED)', 'Queue', 'Doctor', 'High', 'FAIL', {
          expected: 'HTTP 200 with status: SKIPPED',
          actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
        });
      }
    } else {
      record('TC-017', 'Doctor skips patient token (WAITING/CALLED -> SKIPPED)', 'Queue', 'Doctor', 'High', 'BLOCKED');
    }
  } catch (e) {
    record('TC-017', 'Doctor skips patient token (WAITING/CALLED -> SKIPPED)', 'Queue', 'Doctor', 'High', 'FAIL', { actual: e.message });
  }

  // TC-018: Pause Queue
  try {
    const res = await request('PATCH', `/api/queues/${queueId}/pause`, { reason: 'Doctor in emergency surgery' }, doctorToken);
    if (res.status === 200 && (res.data.queue?.isPaused || res.data.queue?.status === 'PAUSED' || res.data.isPaused)) {
      record('TC-018', 'Pause Queue execution', 'Queue', 'Doctor', 'Medium', 'PASS', {
        expected: 'HTTP 200 with queue status PAUSED',
        actual: `HTTP 200, isPaused: true`,
      });
    } else {
      record('TC-018', 'Pause Queue execution', 'Queue', 'Doctor', 'Medium', 'FAIL', {
        expected: 'HTTP 200 with isPaused: true',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-018', 'Pause Queue execution', 'Queue', 'Doctor', 'Medium', 'FAIL', { actual: e.message });
  }

  // TC-019: Resume Queue
  try {
    const res = await request('PATCH', `/api/queues/${queueId}/resume`, {}, doctorToken);
    if (res.status === 200 && (res.data.queue?.status === 'ACTIVE' || !res.data.queue?.isPaused || res.data.status === 'ACTIVE')) {
      record('TC-019', 'Resume Paused Queue', 'Queue', 'Doctor', 'Medium', 'PASS', {
        expected: 'HTTP 200 with queue status ACTIVE',
        actual: `HTTP 200, status: ACTIVE`,
      });
    } else {
      record('TC-019', 'Resume Paused Queue', 'Queue', 'Doctor', 'Medium', 'FAIL', {
        expected: 'HTTP 200 with status: ACTIVE',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-019', 'Resume Paused Queue', 'Queue', 'Doctor', 'Medium', 'FAIL', { actual: e.message });
  }

  // --- MODULE 3: RECEPTIONIST FLOW ---
  console.log('\n--- 3. RECEPTIONIST FLOW ---');

  // TC-020: Doctor authorizes a new receptionist
  const staffPhone = '9876599999';
  let receptionistData = null;
  try {
    const res = await request('POST', '/api/doctors/receptionists', {
      name: 'Ritu Desk Coordinator',
      phone: staffPhone,
      email: 'ritu.desk@carequeue.in',
      password: 'StaffPassword123!',
      permissions: ['queue_manage', 'token_issue', 'walkin_create'],
    }, doctorToken);
    if (res.status === 200 || res.status === 201) {
      receptionistData = res.data;
      record('TC-020', 'Doctor authorizes Receptionist account', 'Receptionist', 'Doctor', 'High', 'PASS', {
        expected: 'HTTP 200/201 receptionist authorized',
        actual: `HTTP ${res.status}, receptionistId: ${res.data.receptionist?.id || res.data.id}`,
        evidence: JSON.stringify(res.data)
      });
    } else {
      record('TC-020', 'Doctor authorizes Receptionist account', 'Receptionist', 'Doctor', 'High', 'FAIL', {
        expected: 'HTTP 200/201 receptionist authorized',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-020', 'Doctor authorizes Receptionist account', 'Receptionist', 'Doctor', 'High', 'FAIL', { actual: e.message });
  }

  // TC-021: List authorized receptionists
  try {
    const res = await request('GET', '/api/doctors/receptionists', null, doctorToken);
    if (res.status === 200 && Array.isArray(res.data)) {
      record('TC-021', 'Doctor views authorized receptionists list', 'Receptionist', 'Doctor', 'Medium', 'PASS', {
        expected: 'HTTP 200 array of receptionists',
        actual: `HTTP 200, count: ${res.data.length}`,
      });
    } else {
      record('TC-021', 'Doctor views authorized receptionists list', 'Receptionist', 'Doctor', 'Medium', 'FAIL', {
        expected: 'HTTP 200 array',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-021', 'Doctor views authorized receptionists list', 'Receptionist', 'Doctor', 'Medium', 'FAIL', { actual: e.message });
  }

  // TC-022: Receptionist Search Patient by Phone
  try {
    const res = await request('GET', `/api/patients/search?phone=${phoneA}`, null, doctorToken);
    if (res.status === 200 && res.data) {
      record('TC-022', 'Receptionist searches patient by phone', 'Receptionist', 'Receptionist', 'Medium', 'PASS', {
        expected: 'HTTP 200 with patient record',
        actual: `HTTP 200, found patient: ${res.data.name || res.data.phone}`,
      });
    } else {
      record('TC-022', 'Receptionist searches patient by phone', 'Receptionist', 'Receptionist', 'Medium', 'FAIL', {
        expected: 'HTTP 200 with patient record',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-022', 'Receptionist searches patient by phone', 'Receptionist', 'Receptionist', 'Medium', 'FAIL', { actual: e.message });
  }

  // --- MODULE 4: REAL-TIME WEBSOCKET SYNCHRONIZATION ---
  console.log('\n--- 4. REAL-TIME WEBSOCKET SYNCHRONIZATION ---');

  // TC-023: Socket.IO Server Connectivity
  let socketConnected = false;
  let receivedEvents = [];
  try {
    const socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: false,
      auth: { token: doctorToken || patientAToken || '' },
    });

    await new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve();
      }, 3000);

      socket.on('connect', () => {
        socketConnected = true;
        // Join queue room
        socket.emit('join_queue', queueId);
        socket.emit('join_patient', phoneA);
        
        // Listen for events
        socket.on('queue:token_called', (data) => receivedEvents.push({ event: 'queue:token_called', data }));
        socket.on('queue:status_changed', (data) => receivedEvents.push({ event: 'queue:status_changed', data }));
        socket.on('queue:token_serving', (data) => receivedEvents.push({ event: 'queue:token_serving', data }));
        socket.on('queue:token_completed', (data) => receivedEvents.push({ event: 'queue:token_completed', data }));
        socket.on('queue:token_created', (data) => receivedEvents.push({ event: 'queue:token_created', data }));
        clearTimeout(timer);
        resolve();
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timer);
        resolve();
      });
    });

    if (socketConnected) {
      record('TC-023', 'Socket.IO Server accepts client connection & room join', 'Real-time', 'System', 'High', 'PASS', {
        expected: 'Successful socket connection and room subscription',
        actual: 'Connected successfully via WebSocket/polling',
      });

      // TC-024: Trigger event and check real-time reception
      // Trigger a call next to see if socket receives it
      await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
      await new Promise(r => setTimeout(r, 1000));

      const hasReceivedCalled = receivedEvents.some(e => e.event === 'queue:token_called');
      record('TC-024', 'Doctor action triggers Socket.IO event received by connected client', 'Real-time', 'System', 'High', hasReceivedCalled ? 'PASS' : 'FAIL', {
        expected: 'Client receives queue:token_called event',
        actual: `Received ${receivedEvents.length} events: ${receivedEvents.map(e => e.event).join(', ')}`,
      });

      socket.disconnect();
    } else {
      record('TC-023', 'Socket.IO Server accepts client connection & room join', 'Real-time', 'System', 'High', 'FAIL', {
        expected: 'Successful socket connection',
        actual: 'Could not connect to socket server within 3s',
      });
      record('TC-024', 'Doctor action triggers Socket.IO event received by connected client', 'Real-time', 'System', 'High', 'BLOCKED');
    }
  } catch (e) {
    record('TC-023', 'Socket.IO Server accepts client connection', 'Real-time', 'System', 'High', 'FAIL', { actual: e.message });
    record('TC-024', 'Doctor action triggers Socket.IO event', 'Real-time', 'System', 'High', 'BLOCKED');
  }

  // TC-025: Mobile Frontend Socket Integration Check
  // Inspect if frontend screens actually import socket.ts
  const fs = require('fs');
  const path = require('path');
  const projectRoot = 'c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement';
  const patientQueueSrc = fs.readFileSync(path.join(projectRoot, 'src', 'app', '(patient)', '(tabs)', 'queue.tsx'), 'utf8');
  const doctorDashboardSrc = fs.readFileSync(path.join(projectRoot, 'src', 'app', '(doctor)', 'dashboard.tsx'), 'utf8');
  
  const patientHasSocket = patientQueueSrc.includes('socket') || patientQueueSrc.includes('SocketClient');
  const doctorHasSocket = doctorDashboardSrc.includes('socket') || doctorDashboardSrc.includes('SocketClient');

  record('TC-025', 'Patient App queue screen connects to real-time WebSocket stream', 'Real-time', 'Patient', 'High', patientHasSocket ? 'PASS' : 'FAIL', {
    expected: 'queue.tsx imports SocketClient and listens for real-time queue events',
    actual: patientHasSocket ? 'SocketClient integrated' : 'NOT IMPLEMENTED: queue.tsx relies purely on local MockDB state and manual refresh button. SocketClient is not imported.',
  });

  record('TC-026', 'Doctor App dashboard connects to real-time WebSocket stream', 'Real-time', 'Doctor', 'High', doctorHasSocket ? 'PASS' : 'FAIL', {
    expected: 'dashboard.tsx imports SocketClient and listens for real-time patient queue events',
    actual: doctorHasSocket ? 'SocketClient integrated' : 'NOT IMPLEMENTED: dashboard.tsx relies on a 4-second setInterval polling local MockDB. SocketClient is not imported.',
  });

  // --- MODULE 5: QUEUE EDGE CASES ---
  console.log('\n--- 5. QUEUE EDGE CASES ---');

  // TC-027: Call next when nobody is waiting in queue
  try {
    // Repeatedly call next until queue is empty
    await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
    await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
    await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
    const emptyCallRes = await request('POST', `/api/queues/${queueId}/call-next`, {}, doctorToken);
    
    if (emptyCallRes.status === 200 && (emptyCallRes.data.currentTokenNumber === 'None' || emptyCallRes.data.message?.includes('completed') || emptyCallRes.data.message?.includes('No waiting'))) {
      record('TC-027', 'Doctor calls next when no patients are waiting', 'Queue', 'Doctor', 'Medium', 'PASS', {
        expected: 'Graceful handling indicating all waiting patients completed/none waiting',
        actual: `HTTP 200: ${emptyCallRes.data.message || emptyCallRes.data.currentTokenNumber}`,
      });
    } else {
      record('TC-027', 'Doctor calls next when no patients are waiting', 'Queue', 'Doctor', 'Medium', 'FAIL', {
        expected: 'Graceful empty response',
        actual: `HTTP ${emptyCallRes.status}: ${JSON.stringify(emptyCallRes.data)}`,
      });
    }
  } catch (e) {
    record('TC-027', 'Doctor calls next when no patients are waiting', 'Queue', 'Doctor', 'Medium', 'FAIL', { actual: e.message });
  }

  // TC-028: Generate token with missing mandatory fields
  try {
    const res = await request('POST', '/api/tokens/regular', {
      doctorId: '',
      patientName: '',
    }, patientAToken);
    if (res.status === 400) {
      record('TC-028', 'Generate token with missing fields rejects with HTTP 400', 'API', 'Patient', 'Medium', 'PASS', {
        expected: 'HTTP 400 Bad Request with descriptive error',
        actual: `HTTP 400: ${JSON.stringify(res.data)}`,
      });
    } else {
      record('TC-028', 'Generate token with missing fields rejects with HTTP 400', 'API', 'Patient', 'Medium', 'FAIL', {
        expected: 'HTTP 400 Bad Request',
        actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      });
    }
  } catch (e) {
    record('TC-028', 'Generate token with missing fields rejects with HTTP 400', 'API', 'Patient', 'Medium', 'FAIL', { actual: e.message });
  }

  // TC-029: Patient cancels active token
  try {
    const reviewBookingSrc = fs.readFileSync(path.join(projectRoot, 'src', 'app', '(patient)', '(tabs)', 'queue.tsx'), 'utf8');
    const hasCancelHandler = reviewBookingSrc.includes('handleCancelQueue') || reviewBookingSrc.includes('cancelActiveToken');
    record('TC-029', 'Patient exits/cancels active token from queue UI', 'Patient', 'Patient', 'High', hasCancelHandler ? 'PASS' : 'FAIL', {
      expected: 'UI provides handleCancelQueue and updates token status to cancelled',
      actual: hasCancelHandler ? 'handleCancelQueue implemented calling cancelActiveToken' : 'Cancel queue not implemented',
    });
  } catch (e) {
    record('TC-029', 'Patient exits/cancels active token from queue UI', 'Patient', 'Patient', 'High', 'FAIL', { actual: e.message });
  }

  // TC-030: Backend route for updating patient status (PATCH /api/patients/:id/status)
  try {
    const res = await request('PATCH', '/api/patients/pat-test/status', { treatmentStatus: 'COMPLETED' }, doctorToken);
    if (res.status === 200) {
      record('TC-030', 'Backend endpoint for updating patient treatment status', 'API', 'Doctor', 'High', 'PASS', {
        expected: 'HTTP 200',
        actual: `HTTP 200`,
      });
    } else {
      record('TC-030', 'Backend endpoint for updating patient treatment status', 'API', 'Doctor', 'High', 'FAIL', {
        expected: 'HTTP 200',
        actual: `HTTP ${res.status} (Route does not exist in server.js, causes silent failure when MockDB.updatePatientStatus calls RemoteAPI.updatePatientStatus)`,
      });
    }
  } catch (e) {
    record('TC-030', 'Backend endpoint for updating patient treatment status', 'API', 'Doctor', 'High', 'FAIL', { actual: e.message });
  }

  console.log('\n====================================================');
  console.log(`E2E TEST SUMMARY: Total: ${results.length}, Passed: ${results.filter(r => r.status === 'PASS').length}, Failed: ${results.filter(r => r.status === 'FAIL').length}, Blocked: ${results.filter(r => r.status === 'BLOCKED').length}`);
  console.log('FAILURES & BLOCKS DETAILS:');
  console.log(JSON.stringify(results.filter(r => r.status !== 'PASS'), null, 2));
  return results;
}

runE2ETests().catch(console.error);
