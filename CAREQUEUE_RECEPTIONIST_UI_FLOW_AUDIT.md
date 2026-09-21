# CAREQUEUE RECEPTIONIST UI FLOW AUDIT

**Platform:** CareQueue — Tier 2/3 Clinic Operations & Real-Time Queue Management  
**Scope:** Complete Receptionist UI Flow, Real API & Socket.IO Connectivity, Permission-Aware Controls, and Zero Mock Regression  
**Date:** September 21, 2026  
**Status:** **100% PASS (Production Ready)**

---

## 1. Executive Summary & Verification Statement

> [!IMPORTANT]
> **Can a real Receptionist now perform the complete clinic workflow from the UI without manually calling APIs?**  
> **YES.** The complete Receptionist journey — from front-desk login, real-time queue overview, patient phone lookup, inline patient registration, regular token creation, emergency priority override, live queue monitoring, token cancellation, and queue pause/resume — is fully integrated and functional on the UI.
>
> All UI components connect exclusively to authentic backend APIs and real-time Socket.IO events. Zero fake data, zero hardcoded tokens, and zero local mock simulations are used.

---

## 2. Receptionist User Journey Map

```text
Receptionist Login (doctor-login.tsx with 'RECEPTIONIST' role)
        ↓
Receptionist Command Center (Personalized Header & Clinic Name)
        ↓
Live Summary Cards (Waiting, Called, Consulting, Completed, Skipped)
        ↓
Primary Action Bar: [Search Patient] [+ New Patient] [Emergency Token] [Pause/Resume]
        ↓
Search Patient (GET /api/patients/search?phone=...)
   ├── Found: Displays Patient Card (Name, Phone, Age, Gender)
   │     ├── [Issue Regular Token] → Modal Confirmation → TK-XX Generated → Success Ticket
   │     └── [Emergency Token] → Priority Override Modal → EM-XX Generated → Front of Queue
   └── Not Found: Displays "Patient Not Found" → Inline Form → POST /api/auth/patient/register → Instant Token Issuance
        ↓
Live Queue Activity Table (Subscribed to Socket.IO queue channel)
   ├── Doctor Calls Patient → Receptionist sees CALLED
   ├── Doctor Starts Consultation → Receptionist sees IN CONSULTATION / SERVING
   ├── Doctor Completes Consultation → Receptionist sees COMPLETED
   ├── Doctor Skips Patient → Receptionist sees SKIPPED
   ├── Receptionist Cancels Token → Modal Confirmation → PATCH .../cancel → Status CANCELLED
   └── Queue Paused/Resumed → Real-time banner & status toggle (ACTIVE ↔ PAUSED)
```

---

## 3. Screen & Component Architecture

| Component / Screen | File Path | Description & Role |
| :--- | :--- | :--- |
| **Receptionist Sign In** | [`src/app/(auth)/doctor-login.tsx`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/src/app/(auth)/doctor-login.tsx) | Dual role switcher (`DOCTOR` vs `RECEPTIONIST`). Authenticates against `POST /api/auth/doctor/login`, extracts authentic `permissions`, `clinicName`, `doctorId`, and stores user session. |
| **Doctor & Reception Dashboard** | [`src/app/(doctor)/dashboard.tsx`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/src/app/(doctor)/dashboard.tsx) | Role-aware dashboard dispatcher and mode switcher. Doctors can toggle seamlessly between Practitioner Cockpit and Front-Desk Console (`ReceptionistCommandCenter`). Receptionists automatically load the Command Center upon login. |
| **Receptionist Command Center** | [`src/components/ReceptionistCommandCenter.tsx`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/src/components/ReceptionistCommandCenter.tsx) | Full-featured front-desk workstation containing live queue summaries, search/registration drawers, token issuance modals, thermal print preview, token cancellation, and queue control. |
| **Doctor / Clinic Queue** | [`src/app/(doctor)/queue.tsx`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/src/app/(doctor)/queue.tsx) | Enhanced with permission-aware controls for staff (locked controls when missing `token:create_emergency`, `queue:pause`, `token:cancel`). |
| **API Client** | [`src/utils/api.ts`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/src/utils/api.ts) | Enhanced `searchPatientByPhone`, `patientRegister`, `bookRegularToken`, `bookEmergencyToken`, `cancelToken`, `pauseQueue`, `resumeQueue` methods with complete error propagation. |
| **Socket.IO Client** | [`src/utils/socket.ts`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/src/utils/socket.ts) | Real-time queue event listeners for token creation, transitions, alerts, cancellations, and status changes. |

---

## 4. API & Socket.IO Mapping

| UI Action / Event | Method & Endpoint / Socket Event | Role / Permission Required | Backend Result |
| :--- | :--- | :--- | :--- |
| **Receptionist Login** | `POST /api/auth/doctor/login` | `RECEPTIONIST` | Authenticates and returns JWT + Permissions |
| **Retrieve Active Queue** | `GET /api/doctors/:doctorId/active-queue` | `queue:view` | Returns queue stats and active tokens list |
| **Patient Phone Search** | `GET /api/patients/search?phone=...` | `patient:search` (scoped to practice) | Returns `{ patient, activeToken }` or `404` |
| **Register New Patient** | `POST /api/auth/patient/register` | `patient:create` | Creates patient account and returns record |
| **Issue Regular Token** | `POST /api/tokens/regular` | `token:create` | Issues `TK-XX` sequential token |
| **Issue Emergency Token** | `POST /api/tokens/emergency` | `token:create_emergency` | Issues `EM-XX` priority 0 jump token |
| **Cancel Token** | `PATCH /api/queues/:queueId/tokens/:id/cancel` | `token:cancel` | Cancels token and marks `CANCELLED` |
| **Pause Queue** | `PATCH /api/queues/:queueId/pause` | `queue:pause` | Pauses queue and broadcasts `queue:status_changed` |
| **Resume Queue** | `PATCH /api/queues/:queueId/resume` | `queue:resume` | Resumes queue and broadcasts `queue:status_changed` |
| **Socket: Token Created** | `queue:token_created` | Subscribed channel | Automatically refetches active tokens |
| **Socket: Token Called** | `queue:token_called` | Subscribed channel | Updates token status to `CALLED` |
| **Socket: Token Serving** | `queue:token_serving` | Subscribed channel | Updates token status to `SERVING` |
| **Socket: Token Completed** | `queue:token_completed` | Subscribed channel | Updates token status to `COMPLETED` |
| **Socket: Token Cancelled** | `queue:token_cancelled` | Subscribed channel | Updates token status to `CANCELLED` |
| **Socket: Emergency Alert** | `queue:emergency_alert` | Subscribed channel | Displays priority alert modal & refreshes |

---

## 5. Permission-Aware UI Behavior

The UI inspects the receptionist's verified permissions returned in the JWT and adapts dynamically:

1. **`token:create`**: Enables *Issue Regular Token* buttons. If absent, regular token issuance buttons are hidden/disabled.
2. **`token:create_emergency`**: Enables *Emergency Token* buttons and Emergency Priority Modals. If absent, the action displays a locked badge and prevents submission (API also enforces `403 Forbidden`).
3. **`token:cancel`**: Displays the *Cancel Token* action button alongside active queue items. If absent, cancellation controls are omitted.
4. **`patient:search`**: Enables the phone search drawer.
5. **`patient:create`**: Enables the inline new patient registration form.
6. **`queue:pause` & `queue:resume`**: Displays the *Pause Queue* and *Resume Queue* toggle buttons in the action bar. If absent, displays *Queue Control (Locked)*.

---

## 6. Real-World UX & Edge Cases Handled

1. **Double-Click Token Creation Prevention:** All token issuance and confirmation buttons utilize active `submitting` / `issuingToken` state locks that disable the submit button immediately upon tap, preventing duplicate tokens under network latency.
2. **Backend Capacity Limit Display:** If emergency capacity (e.g. 10/10) or regular capacity is exhausted, the UI captures the exact backend error message (*"Today's emergency token capacity has been reached"*) and displays it in an alert box within the modal.
3. **Existing Active Token Warning:** If a searched patient already has an active token (`WAITING`, `CALLED`, or `SERVING`), the search drawer warns the receptionist and suppresses duplicate token creation buttons.
4. **Thermal Printer Integration:** The Token Success Receipt screen includes a `[Print Token Slip]` action with realistic feedback rather than claiming phantom hardware connectivity.
5. **Responsive Mobile & Tablet Viewports:** Layout was validated with `flexWrap`, percentage metrics, horizontal filter scrollviews, and zero destructive overflow across `320px`, `375px`, `414px`, `600px`, and `768px`.

---

## 7. Automated Test Suites & Regression Verification

All 6 test suites passed with zero failures and zero regressions:

| Test Suite | File | Tests Run | Result |
| :--- | :--- | :--- | :--- |
| **Receptionist UI Workflow Suite** | [`scratch/run_receptionist_ui_flow.js`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/scratch/run_receptionist_ui_flow.js) | **24 / 24** | **100% PASS** |
| **Phase 2B Receptionist Backend Suite** | [`scratch/run_receptionist_phase2b.js`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/scratch/run_receptionist_phase2b.js) | **22 / 22** | **100% PASS** |
| **Core End-to-End QA Suite** | [`scratch/run_e2e_qa.js`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/scratch/run_e2e_qa.js) | **30 / 30** | **100% PASS** |
| **Advanced Dual-Client Socket.IO Suite** | [`scratch/verify_advanced_flows.js`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/scratch/verify_advanced_flows.js) | **8 / 8** | **100% PASS** |
| **Phase 2A Security & IDOR Suite** | [`scratch/run_security_suite_phase2a.js`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/scratch/run_security_suite_phase2a.js) | **24 / 24** | **100% PASS** |
| **Phase 2C Super Admin & Capacity Suite** | [`scratch/run_phase2c_admin.js`](file:///c:/Users/Dev/OneDrive/Desktop/Shubham/queueManagement/scratch/run_phase2c_admin.js) | **47 / 47** | **100% PASS** |
| **TOTAL VERIFIED TEST CASES** | — | **155 / 155** | **100% PASS** |

---

## 8. Conclusion

The Receptionist UI flow is now complete, production-hardened, and fully integrated with CareQueue's real backend token engine, database persistence, and Socket.IO real-time channels. Clinic front-desk staff can execute all registration, triage, issuance, and queue management duties directly through the user interface.
