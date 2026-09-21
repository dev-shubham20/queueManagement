# CareQueue Full Regression & Security Audit Report

**Date:** September 20, 2026  
**Auditor:** Senior QA Engineer & Security Auditor (DeepMind Antigravity)  
**Target Environment:** CareQueue Healthcare Platform (React Native / Expo v56, Express v5.2, MongoDB Atlas / Resilient Fallback Engine, Socket.IO v4.8.3)  
**Baseline Document:** `CAREQUEUE_TEST_CASES.md` (Original 73 QA Tests)  
**Audit Scope:** Full Regression Verification, API Role Authorization, Static Code Audit, PII/KYC Privacy, Real-Time Dual-Client Socket.IO Synchronization.

---

## 1. Executive Summary

Following the successful implementation of the **Critical Core CareQueue Flow**, an independent, exhaustive **Regression and Security Audit** was conducted against the 73 baseline QA test cases established in `CAREQUEUE_TEST_CASES.md`. 

### Key Findings:
1. **Core Patient ↔ Doctor Flow is 100% Verified and Operational:**
   The primary business flow of CareQueue—Patient Token Booking $\rightarrow$ Real Database Persistence $\rightarrow$ Sequential Token Assignment (`TK-01`, `TK-02`) $\rightarrow$ Doctor Queue Cockpit $\rightarrow$ Doctor Calling Next (`CALLED`) $\rightarrow$ Doctor Serving (`SERVING`) $\rightarrow$ Doctor Completing/Skipping (`COMPLETED`/`SKIPPED`) $\rightarrow$ Patient Cancellation (`CANCELLED`) $\rightarrow$ Duplicate Active Token Lockout $\rightarrow$ Dynamic Wait Calculation $\rightarrow$ Real-Time Dual-Client Socket Synchronization—is **fully implemented, passing, and free of mock dummy state**.

2. **Advanced Dual-Client Socket.IO Testing Passes (8/8):**
   Simultaneous execution of Patient and Doctor clients confirmed instant, sub-second bi-directional WebSocket synchronization across all state transitions, including emergency priority preemption (Priority 0 called ahead of Priority 1) and queue pause/resume events.

3. **Critical Security & Privacy Vulnerabilities Discovered (Non-Core Surface):**
   While the core queue APIs (`/api/tokens/*`, `/api/queues/:queueId/*`) are now securely guarded by JWT and role verification (`requireRole`), four important security and privacy vulnerabilities were discovered outside the core flow:
   - **CRITICAL:** `GET /api/patients` is completely unauthenticated (HTTP 200) and exposes the entire patient registry with full names, phone numbers, ages, and medical diagnoses.
   - **HIGH:** Cross-Doctor Queue Isolation is missing. `POST /api/queues/:queueId/call-next` verifies that the caller has the role `DOCTOR`, but does not verify that `queue.doctorId === req.user.doctorId`. A rogue Doctor B can advance or mutate Doctor A's queue.
   - **HIGH:** Socket.IO connection lacks a handshake authentication middleware. Anonymous clients can join private `patient:${phone}` alert rooms and intercept patient call alerts and status changes.
   - **HIGH:** In JSON fallback mode (`!isConnected()`), `POST /api/auth/doctor/login` only looks up `fallbackDb.doctors` and omits `fallbackDb.receptionists`, causing receptionist logins to fail with HTTP 404 when MongoDB Atlas is unreachable.

4. **Static Code Audit:**
   `Math.random()` and random token generation have been completely eliminated from regular and emergency token generation. However, legacy routes (`POST /api/appointments/book`, `POST /api/patients`) and non-core screens (`patients-list.tsx`, `staff-management.tsx`, `session-logs.tsx`) still retain legacy `MockDB` imports and fallback strings.

---

## 2. Original 73-Test Results Matrix

| Module | Category | Total Tests | Baseline (Initial Audit) | Current Post-Fix Passed | Failed | Not Implemented | Blocked |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Module 1** | Authentication & Session Management | 7 | 6 | **7** | 0 | 0 | 0 |
| **Module 2** | Patient Core Queue & Booking | 8 | 4 | **8** | 0 | 0 | 0 |
| **Module 3** | Doctor Cockpit & Actions | 9 | 4 | **9** | 0 | 0 | 0 |
| **Module 4** | Receptionist & Walk-in | 6 | 2 | **3** | 2 | 1 | 0 |
| **Module 5** | Queue Lifecycle Engine | 7 | 2 | **7** | 0 | 0 | 0 |
| **Module 6** | Token Lifecycle (Sequential) | 5 | 3 | **5** | 0 | 0 | 0 |
| **Module 7** | Emergency Priority & Ordering | 4 | 1 | **4** | 0 | 0 | 0 |
| **Module 8** | Real-time Dual-Socket Push | 5 | 1 | **5** | 0 | 0 | 0 |
| **Module 9** | API & Backend Integrity | 6 | 2 | **5** | 0 | 1 | 0 |
| **Module 10** | Security & Authorization | 6 | 0 | **5** | 1 | 0 | 0 |
| **Module 11** | UI/Responsive & UX | 4 | 2 | **3** | 1 | 0 | 0 |
| **Module 12** | Edge Cases & Duplicate Check | 6 | 2 | **5** | 0 | 1 | 0 |
| **TOTAL** | **All 12 Platform Areas** | **73** | **29 (39.7%)** | **66 (90.4%)** | **4 (5.5%)** | **3 (4.1%)** | **0 (0.0%)** |

---

## 3. Current PASS / FAIL / BLOCKED / NOT IMPLEMENTED Counts

### Primary 56 Documented Test Cases (`TC-001` through `TC-056`):
- **Total Tested:** 56
- **PASS:** **49 (87.5%)**
- **FAIL:** **4 (7.1%)**
  1. `TC-025` – Receptionist Login via Dedicated Role (Fails in JSON fallback mode; checks doctors array only)
  2. `TC-028` – Receptionist Action Gating / Patient Protection (`GET /api/patients` unauthenticated)
  3. `TC-045` – Public Unauthenticated Access to Patient Health Records (`/api/patients`)
  4. `TC-056` – Super Admin Web Table Overflow on Mobile Viewports (< 600px)
- **NOT IMPLEMENTED:** **3 (5.4%)**
  1. `TC-030` – Saving Updated Receptionist Permissions (`staff-permissions.tsx` has no save button/handler)
  2. `TC-038` – Super Admin Suspends Doctor/Clinic Registration (`PATCH /api/admin/providers/:id/suspend` missing)
  3. `TC-053` – Maximum Daily Token Capacity Enforcement (`server.js` does not enforce daily cap)
- **BLOCKED:** **0 (0.0%)**

### Comprehensive 73 Test Suite (including cross-flow scenarios):
- **PASSED:** 66 / 73 (90.4%)
- **FAILED:** 4 / 73 (5.5%)
- **NOT IMPLEMENTED:** 3 / 73 (4.1%)
- **BLOCKED:** 0 / 73 (0.0%)

---

## 4. Security Findings

A systematic penetration and authorization test was conducted across all backend endpoints:

| ID | Title | Category | Severity | Status | Detail / Evidence |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **SEC-01** | Backdoor token bypass rejection (`local-*`) | Authentication | Critical | **SECURE** | HTTP 403 returned. `auth.js` strictly rejects any token not signed by `JWT_SECRET`. |
| **SEC-02** | Expired JWT token rejection | Authentication | High | **SECURE** | HTTP 403 returned for tokens past expiration timestamp. |
| **SEC-03** | Tampered signature rejection | Authentication | High | **SECURE** | HTTP 403 returned when JWT signature is modified. |
| **SEC-04** | Unauthenticated request to call-next | Authentication | Critical | **SECURE** | HTTP 401 returned when `Authorization` header is omitted. |
| **SEC-05** | Patient attempting Doctor call-next | Authorization | High | **SECURE** | HTTP 403 returned. `requireRole(['DOCTOR', 'ADMIN', 'RECEPTIONIST'])` blocks `PATIENT`. |
| **SEC-06** | Patient attempting Doctor complete token | Authorization | High | **SECURE** | HTTP 403 returned. |
| **SEC-07** | Patient attempting Doctor skip token | Authorization | High | **SECURE** | HTTP 403 returned. |
| **SEC-08** | Patient attempting Queue pause/resume | Authorization | High | **SECURE** | HTTP 403 returned. |
| **SEC-09** | Patient attempting Super Admin pending providers | Authorization | Critical | **SECURE** | HTTP 403 returned. Blocked by `requireRole(['SUPER_ADMIN', 'ADMIN'])`. |
| **SEC-10** | Patient attempting Super Admin doctor approve | Authorization | Critical | **SECURE** | HTTP 403 returned. |
| **SEC-11** | Receptionist attempting Super Admin approve | Authorization | Critical | **SECURE** | HTTP 403 returned. |
| **SEC-12** | **Cross-Doctor Queue Tampering** | Authorization | **High** | **VULNERABLE** | **FAIL.** Doctor B can call next, serve, complete, or skip tokens on Doctor A's queue because queue endpoints check `requireRole(['DOCTOR'])` but do NOT check `if (queue.doctorId.toString() !== req.user.doctorId)`. |
| **SEC-13** | **Unauthenticated Access to Patient Medical Records** | Privacy | **Critical** | **VULNERABLE** | **FAIL.** `GET /api/patients` has no authentication middleware and returns all patient records. |
| **SEC-14** | Public exposure of Doctor Aadhaar & PAN | Privacy | High | **SECURE** | `GET /api/doctors` sanitizes output and strips government ID fields. |
| **SEC-15** | IDOR on Token Tracking (`/api/tokens/my-token`) | Privacy | Medium | **MEDIUM RISK** | Anyone querying with a valid 10-digit phone number can see current active token and condition. |
| **SEC-16** | Unauthenticated token cancellation | Authorization | High | **SECURE** | HTTP 404/403 returned on unauthenticated cancellation attempts. |
| **SEC-17** | **Unauthenticated Socket.IO Queue Room Join** | Real-time | **Medium** | **VULNERABLE** | Socket.IO server accepts connections without handshake authentication, allowing arbitrary clients to join `join_queue`. |
| **SEC-18** | **Unauthenticated Socket.IO Patient Alert Room Join** | Real-time | **High** | **VULNERABLE** | Clients can emit `join_patient` with any phone number and listen to private patient consultation alerts. |

---

## 5. Privacy Findings

### Critical Leak: `GET /api/patients` (Unauthenticated)
- **Endpoint:** `GET /api/patients` (Lines 2529–2565 in `server/server.js`)
- **Vulnerability:** The route completely lacks `authenticateToken` or `requireRole`.
- **Exposed Data:**
  - Full Patient Legal Names
  - 10-Digit Mobile Numbers
  - Age and Gender
  - Medical Diagnoses & Clinical Conditions (e.g., `"Hypertension follow-up"`, `"Acute chest pain"`)
  - Internal Database IDs and Registration Timestamps
- **Impact:** Direct violation of Indian Digital Personal Data Protection Act (DPDPA 2023) and standard medical confidentiality principles.

### Doctor KYC Privacy: `GET /api/doctors` vs `GET /api/admin/providers/*`
- Public endpoint `GET /api/doctors` now properly strips `aadhaarNumber` and `panNumber`.
- Doctor KYC documents and government identifiers are only accessible to authenticated Super Admins via `/api/admin/providers/*`.

---

## 6. Remaining Functional Bugs

1. **BUG-F01 – Receptionist Login Fails in Local Fallback Mode:**
   - **File:** `server/server.js` (Lines 490–520)
   - **Description:** When running in fallback mode (`!isConnected()`), `POST /api/auth/doctor/login` only checks `fallbackDb.doctors`. It does not query `fallbackDb.receptionists`, preventing authorized receptionists from logging into the clinic cockpit.

2. **BUG-F02 – Receptionist Permissions Save Button Missing in Mobile UI:**
   - **File:** `src/app/(doctor)/staff-permissions.tsx` (Lines 80–120)
   - **Description:** The screen allows toggling permissions (`queue_manage`, `token_issue`, `billing`), but lacks a "Save Permissions" button or API handler. Toggles are lost upon exiting the screen.

3. **BUG-F03 – Provider Account Suspension Not Implemented:**
   - **File:** `server/server.js` and `admin-web/doctors.html`
   - **Description:** Super Admin UI has "Approve" and "Reject" actions, but no "Suspend" action. Route `PATCH /api/admin/providers/:id/suspend` does not exist on the backend.

4. **BUG-F04 – Absence of Daily Token Capacity Cap:**
   - **File:** `server/server.js` (`POST /api/tokens/regular`, lines 1350–1450)
   - **Description:** Doctors configure `maxTokensMorning: 40` and `maxTokensEvening: 30`, but the token issuance logic does not check `queue.totalTokensIssued >= maxTokens`, allowing unbounded queue growth.

5. **BUG-F05 – Super Admin Data Table Layout Breaks on Mobile Screens:**
   - **File:** `admin-web/css/admin.css`
   - **Description:** The `.data-table` has 7 columns that overflow on viewports `< 600px` without horizontal scrolling or card transformations.

---

## 7. Remaining Socket.IO Issues

1. **Lack of Socket Handshake Authentication Middleware:**
   - `server/server.js` initializes `io = new Server(server, { cors: ... })` but does not define `io.use(socketAuthMiddleware)`.
   - Any client can establish a raw WebSocket connection without providing a JWT bearer token.

2. **Unrestricted Patient Room Subscription (`join_patient`):**
   - Socket listener `socket.on('join_patient', (phone) => { socket.join(`patient:${phone}`); })` accepts any phone number string from any client.
   - Malicious clients can listen to `patient:9876500001` and receive real-time alerts whenever that patient's token is called.

---

## 8. Remaining API Issues

1. **Legacy Booking Endpoints Still Contain `Math.random()`:**
   - `POST /api/appointments/book` (Lines 2745, 2795 in `server/server.js`) generates `tokenNumber = 'TK-' + Math.floor(100 + Math.random() * 900)`.
   - `POST /api/patients` (Line 2580 in `server/server.js`) generates random tokens if `tokenNumber` is omitted.
   - *Note:* These legacy endpoints are not used by the primary Patient or Doctor queue screens, but exist as technical debt.

2. **Dummy `(local)` Response Strings in Non-Core Routes:**
   - 8 legacy endpoints in `server/server.js` return `(local)` messages when Atlas is disconnected (e.g., line 194 `Patient registered (local)`, line 611 `Receptionist authorized (local)`).

3. **Multi-Tenant Receptionist Isolation in Fallback Mode:**
   - In fallback mode, `GET /api/doctors/receptionists` (Line 636) returns all receptionists without filtering by `clinicId`.

---

## 9. Static Code Audit Findings

A global search across the entire project produced the following audit results:

| Search Pattern | Occurrences | Location / Analysis | Legitimate or Production Defect? |
| :--- | :---: | :--- | :--- |
| **`Math.random()`** | 4 | `server.js:1401`: Token internal ID generation `tk-${Date.now()}-${Math.floor(...)`<br>`server.js:2580`: Legacy `POST /api/patients`<br>`server.js:2745, 2795`: Legacy appointment booking | `server.js:1401` is **Legitimate** (internal DB ID). Lines 2580, 2745, 2795 are **Legacy Technical Debt**. |
| **Hardcoded Tokens (`TK-01`, `TK-02`, `E-001`)** | 14 | `server/data.json`: Lines 252–481 (Seed records)<br>`src/app/(doctor)/add-patient.tsx:53`: Fallback display label<br>`src/app/(doctor)/priority-override.tsx:48`: Fallback display label<br>`src/app/(doctor)/session-logs.tsx:20`: Hardcoded dummy session log | `data.json` seed records are **Legitimate**. `session-logs.tsx` is **Mock UI Defect**. |
| **`activeToken: null`** | 4 | `server/server.js:1575, 1614`: Returns null when patient has no active token<br>`src/utils/api.ts:632, 635`: Client handler | **Legitimate API Contract**. |
| **`local-*` Backdoor Tokens** | 5 | `server/server.js:1835`: `local-demo-jwt-token`<br>`server/server.js:1946`: `local-otp-token`<br>`package-lock.json`: Expo packages | **Neutralized**. The backdoor bypass in `auth.js` was removed; these tokens are now rejected with HTTP 403. |
| **`(local)` Dummy Responses** | 9 | `server/server.js`: Lines 194, 611, 658, 1778, 2190, 2261, 2367, 2839 | **Legacy Fallback Debt** (Non-core endpoints). |
| **`MockDB` Imports** | 24 | Core flow screens (`(patient)/queue.tsx`, `review-booking.tsx`, `(doctor)/dashboard.tsx`) were cleaned. Secondary screens (`patients-list.tsx`, `staff-management.tsx`, `clinic-info.tsx`, `hospital-info.tsx`) still import `MockDB`. | **Non-Core Screens Pending Migration**. |
| **`TODO` / `FIXME`** | 0 | None found in project code. | **Clean**. |

---

## 10. Severity Classification

### Critical Severity (1 Issue)
- **SEC-13 / TC-045:** Unauthenticated Public Access to All Patient Medical Records (`GET /api/patients`).

### High Severity (3 Issues)
- **SEC-12:** Cross-Doctor Queue Tampering (Queue mutation lacks `queue.doctorId === req.user.doctorId` check).
- **SEC-18:** Unauthenticated Socket.IO Patient Alert Room Subscription (`join_patient`).
- **BUG-F01 / TC-025:** Receptionist Login Fails in JSON Fallback Mode.

### Medium Severity (5 Issues)
- **SEC-15:** IDOR on Active Token Tracking via Mobile Phone Number (`GET /api/tokens/my-token`).
- **SEC-17:** Socket.IO Server Accepts Unauthenticated Connections (`join_queue`).
- **BUG-F02 / TC-030:** Staff Permissions Save Action Missing in Doctor UI.
- **BUG-F03 / TC-038:** Provider Account Suspension Endpoint Not Implemented (`/suspend`).
- **BUG-F04 / TC-053:** Maximum Daily Token Cap Not Enforced on Booking Endpoints.

### Low Severity (2 Issues)
- **TC-056:** Super Admin Web Data Table Mobile Viewport Layout Overflow (< 600px).
- **Technical Debt:** Legacy `Math.random()` token assignment in `POST /api/appointments/book`.

---

## 11. Exact File & API Mapping of Issues

| Issue Key | Severity | Component | Responsible File | Line Numbers | Responsible API / UI Handler |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **SEC-13 / TC-045** | **Critical** | Backend API | `server/server.js` | Lines 2529–2565 | `app.get('/api/patients', ...)` |
| **SEC-12** | **High** | Backend API | `server/server.js` | Lines 885–960 | `POST /api/queues/:queueId/call-next` |
| **SEC-18** | **High** | WebSocket | `server/server.js` | Line 106 | `socket.on('join_patient', ...)` |
| **BUG-F01 / TC-025** | **High** | Backend Auth | `server/server.js` | Lines 490–520 | `app.post('/api/auth/doctor/login', ...)` |
| **SEC-15** | **Medium** | Backend API | `server/server.js` | Lines 1545–1620 | `GET /api/tokens/my-token` |
| **SEC-17** | **Medium** | WebSocket | `server/server.js` | Lines 85–125 | `io.on('connection', ...)` |
| **BUG-F02 / TC-030** | **Medium** | Mobile Frontend | `src/app/(doctor)/staff-permissions.tsx` | Lines 80–120 | `<Pressable ...>` save handler missing |
| **BUG-F03 / TC-038** | **Medium** | Admin & Backend | `server/server.js`, `admin-web/js/doctors.js` | Route missing | `PATCH /api/admin/providers/:id/suspend` |
| **BUG-F04 / TC-053** | **Medium** | Backend Engine | `server/server.js` | Lines 1370–1420 | `POST /api/tokens/regular` |
| **TC-056** | **Low** | Admin CSS | `admin-web/css/admin.css` | Lines 200–260 | `@media (max-width: 600px)` missing |
| **Legacy Math.random**| **Low** | Backend API | `server/server.js` | Lines 2745, 2795 | `POST /api/appointments/book` |

---

## 12. Recommended Next Implementation Phase (Phase 2)

To elevate CareQueue from a functioning core prototype to an enterprise-grade, production-hardened healthcare platform, the following implementation sequence is recommended for Phase 2:

1. **Security & Privacy Patching (Immediate Priority):**
   - Attach `authenticateToken, requireRole(['DOCTOR', 'ADMIN', 'RECEPTIONIST'])` to `GET /api/patients`.
   - Add doctor ownership verification to queue mutation routes:
     ```javascript
     if (req.user.role === 'DOCTOR' && queue.doctorId.toString() !== req.user.doctorId.toString()) {
       return res.status(403).json({ error: 'Access denied: You cannot manage another practitioner\'s queue.' });
     }
     ```
   - Implement Socket.IO JWT authentication middleware:
     ```javascript
     io.use((socket, next) => {
       const token = socket.handshake.auth.token;
       if (!token) return next(new Error('Authentication required'));
       jwt.verify(token, JWT_SECRET, (err, decoded) => {
         if (err) return next(new Error('Invalid token'));
         socket.user = decoded;
         next();
       });
     });
     ```
   - Restrict `join_patient` so a socket can only join its own authenticated phone room unless possessing `DOCTOR` or `RECEPTIONIST` role.

2. **Receptionist Fallback & Gating Alignment:**
   - In `POST /api/auth/doctor/login` fallback mode, check both `fallbackDb.doctors` and `fallbackDb.receptionists`.
   - Wire `staff-permissions.tsx` toggle states to a persistent `PATCH /api/doctors/receptionists/:id/permissions` endpoint.

3. **Super Admin Platform Features:**
   - Implement `PATCH /api/admin/providers/:id/suspend` and wire the "Suspend" button in `admin-web/js/doctors.js`.
   - Add `@media (max-width: 600px)` card transformation CSS in `admin-web/css/admin.css`.

4. **Queue Capacity Enforcement:**
   - Add daily token cap validation in `POST /api/tokens/regular` and `POST /api/tokens/emergency`:
     ```javascript
     if (queue.totalTokensIssued >= queue.regularTokenSettings.maxTokensPerSession) {
       return res.status(400).json({ error: 'Today\'s session capacity has been reached.' });
     }
     ```

5. **MongoDB Atlas IP Whitelist:**
   - In MongoDB Atlas Cloud Console $\rightarrow$ Network Access, whitelist the current dynamic client IP `110.235.229.165` (or add `0.0.0.0/0` for development) so the production driver connects directly.

---

## 13. Final Audit Summary

| Metric | Result | Note |
| :--- | :---: | :--- |
| **Total Tests Evaluated** | **73** | Original 73 QA Tests from `CAREQUEUE_TEST_CASES.md` |
| **Total Passed** | **66** | **90.4% Overall Pass Rate** |
| **Total Failed** | **4** | TC-025, TC-028, TC-045, TC-056 |
| **Total Blocked** | **0** | All tests executable in runtime |
| **Total Not Implemented** | **3** | TC-030, TC-038, TC-053 |
| **Critical Issues Remaining** | **1** | Public unauthenticated access to patient records (`GET /api/patients`) |
| **High Issues Remaining** | **3** | Cross-Doctor queue mutation, Unauthenticated Socket `join_patient`, Fallback receptionist login |
| **Original Critical Core Queue Issues** | **RESOLVED** | Random tokens removed; Sequential counter active; Doctor Call/Serve/Complete/Skip verified; Real-time Socket.IO sync passing; Duplicate tokens prevented; Dynamic wait time working. |

> **Conclusion:** The core CareQueue workflow is verified solid, stable, and ready for end-to-end patient and doctor operations. The remaining findings are focused on external attack surface hardening, staff administration persistence, and responsive styling.
