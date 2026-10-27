# AgriConnect: Farmer-to-Expert Agricultural Consultation Platform

An intuitive, full-featured web platform that bridges farmers facing crop health issues with verified agricultural experts for rapid diagnosis, appointment scheduling, and real-time consultation messaging.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and user experience decisions have been established based on your feedback:

- **Dual-Role Simulation**: A top-bar quick role switcher enables seamless toggle between **Farmer View** (submit problem, browse matched specialists, schedule consultation, live chat) and **Expert View** (manage specialty, crop domains, consultation fees, calendar slots, active consultations, and reply to chats).
- **Intelligent Crop & Problem Matching**: Farmers can describe their crop issue (e.g., "yellowing in banana leaves") and select their crop. The app executes symptom-to-specialty heuristic & AI matching to rank relevant agronomists, plant pathologists, and soil scientists.
- **GitHub-Ready & Zero-Friction Deployment**: Fully self-contained single-page application with persistent `localStorage` synchronization (appointments, expert profiles, issue logs, chat histories) so anyone cloning from GitHub can run or deploy instantly to GitHub Pages, Vercel, or local dev without complex database setup.
- **Visual Aesthetic**: Modern earthy green theme (`emerald-800`, `teal-900`, `amber-600` accents on warm parchment neutral canvas), clean typography, zero visual clutter, and strict anti-slop design.

---

## 1. Overview & Core Concept

### What It Does
AgriConnect gives farmers an immediate pathway to resolve crop issues by connecting directly with specialized agricultural scientists and agronomists:
1. **Report Issue**: Farmer inputs crop name (e.g., Banana, Rice, Wheat, Tomato, Cotton), symptoms (e.g., yellowing leaves, stem rot, wilt), and optional photos or severity.
2. **Smart Expert Matching**: Dynamically ranks experts whose domain expertise (Plant Pathology, Soil Chemistry, Entomology, Horticulture) aligns with the problem and crop.
3. **Appointment Scheduling**: Farmer reviews the expert's profile, bio, credentials, consultation fee (e.g., $15 / 30-min slot), and books an open time slot.
4. **Direct Messaging / Consultation Room**: Farmer and expert communicate via a real-time consultation chat with message history, quick diagnostic prompts, photo attachments, and status tracking.
5. **Expert Dashboard**: Experts can edit their profile, specify crop specializations, adjust their consultation fee, configure available weekly time slots, and respond to incoming farmer appointments.

### Target Audience & Persona
- **Farmers & Growers**: Needing quick, dependable remedies for crop diseases, pests, and soil deficiencies without bureaucratic delays.
- **Agricultural Experts & Agronomists**: Extension officers, crop doctors, university researchers, and independent consultants looking to offer paid advisory services.

---

## 2. User Experience & Visual Design

### Key User Flows

#### A. Farmer Diagnostic & Booking Flow
1. **Home / Problem Submission**:
   - Hero search banner: "What problem are you seeing in your crops today?"
   - Crop selector chips (Banana, Tomato, Rice, Maize, Citrus, Cotton, Coffee, Potato, etc.) + symptom description box (e.g., *"Yellowing and brown streaks on banana leaf edges with drooping"*).
   - Instant preliminary match engine flags likely causes (e.g., Potassium Deficiency vs. Fusarium Wilt vs. Sigatoka) and highlights **Matched Agricultural Experts**.
2. **Expert Discovery & Profile View**:
   - Clean profile cards displaying expert name, degree/title, field of expertise (e.g., Tropical Horticulture & Pathology), consultation fee per session, verified badges, rating, and available time slots.
   - Farmer clicks "Book Consultation" to inspect the expert's schedule.
3. **Appointment Booking & Confirmation**:
   - Interactive date & time slot selector matching the expert's active schedule.
   - Brief issue summary review and simulated consultation fee checkout / confirmation.
   - Instant redirection to the dedicated consultation workspace.
4. **Live Consultation Chat**:
   - Dedicated consultation thread between farmer and expert.
   - Timeline header displaying scheduled slot, crop topic, and session status (Upcoming, Active, Completed).
   - Rich messaging interface: text messages, symptom photo uploads, advisory notes, and prescription/remedy summary.

#### B. Expert Management Flow
1. **Expert Profile & Rate Setting**:
   - Set consultation fee (e.g., $20 / session), experience years, credentials (e.g., M.Sc. Agronomy, Ph.D. Plant Virology).
   - Multi-select crop proficiencies (Banana, Cereals, Solanaceous Crops, Legumes).
2. **Schedule & Availability Manager**:
   - Toggle available days (Mon–Sat) and time windows (e.g., 09:00 AM, 11:30 AM, 02:00 PM, 04:30 PM).
3. **Appointment Queue & Inbox**:
   - Tabbed view of incoming farmer cases, confirmed consultations, and past diagnoses.
   - 1-click entry into chat to provide remedies, advice, and marking consultations as resolved.

### Visual Identity & Theme
- **Color Palette**:
  - Dominant Neutral (60%): Clean crisp slate / warm ivory background (`bg-stone-50` / `bg-white`, text in `stone-900` / `stone-800`).
  - Structural Surfaces (30%): Natural slate and muted sage borders (`border-stone-200`, cards in `bg-white`, subtle stone dividers).
  - Accent Budget (10%): Deep botanical forest green (`emerald-800`, `emerald-700`) for primary CTAs, with warm harvest amber (`amber-600`) for fees and highlight notes.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` font for clean modern structure.
  - Body Prose: `Public Sans` / `DM Sans` for readable field guides and consultation messages.
  - Metrics & Currency: `font-mono tabular-nums` for consultation fees, dates, and time slots.
- **Anti-Slop Discipline**:
  - Zero static pill enclosures on metadata; clean typography with `·` dividers.
  - No decorative status pulse dots or fake telemetry indicators.
  - Strict Top Bar Contract: Brand title, single-line navigation links, and primary CTA / role toggle.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Role Switcher vs. Separate Logins
- *Chosen Approach*: Instant top-bar Role Switcher (`Farmer View` ↔ `Expert View`) with persistent account identities.
- *Why*: Enables you, your evaluators, and anyone viewing your GitHub repository to immediately test both sides of the marketplace (posting an issue as a farmer, booking, then switching to the expert to view the appointment and reply in chat) without needing two email addresses or complex authentication handoffs.

### Decision 2: LocalStorage State Machine with Realistic Pre-Seeded Specialists
- *Chosen Approach*: Browser `localStorage` reactive store seeded with 5 diverse real-world agricultural experts (Tropical Plant Pathologist, Soil & Fertilizer Agronomist, Citrus & Fruit Entomologist, Cereal Grain Specialist, Organic Pest Management Expert) and sample banana/tomato/rice case studies.
- *Why*: Meets the requirement: *"I have to upload it in github take that in mind and build"*. The project can be cloned, built with `npm run build`, and deployed to any static host (GitHub Pages, Netlify, Vercel) without needing external database provisioning. All user actions (creating appointments, updating fees, adding schedule slots, sending chat messages) persist across page reloads.

### Decision 3: Crop Symptom & Problem Matching Algorithm
- *Chosen Approach*: Multi-layered relevance engine:
  1. Primary crop match (e.g., Banana matches experts with Banana/Horticulture specialization).
  2. Symptom keyword heuristics (e.g., "yellowing", "spots", "wilt", "borer", "deficiency", "chlorosis").
  3. AI-assisted diagnosis preview (using Gemini API when available with seamless rule-based fallback) generating immediate potential conditions (e.g., Potassium Chlorosis, Banana Bunchy Top Virus, Panama Disease) and linking to the exact expert qualified for that problem.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│  [AgriConnect]     [Diagnose] [Experts] [My Bookings]     [Role: Farmer/Expert]
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┴─────────────────────────────┐
      ▼                                                          ▼
┌───────────────────────────────┐              ┌───────────────────────────────┐
│         FARMER VIEW           │              │          EXPERT VIEW          │
├───────────────────────────────┤              ├───────────────────────────────┤
│ 1. Problem Diagnostic Form    │              │ 1. Profile & Bio Editor       │
│    - Crop selection           │              │ 2. Consultation Fee ($/slot)  │
│    - Symptom description      │              │ 3. Expertise & Crop Domains   │
│    - AI preliminary insight   │              │ 4. Available Time Slots Mgmt  │
│ 2. Matched Experts Grid       │              │ 5. Incoming Consultations Hub │
│ 3. Booking Modal (Date/Time)  │              │ 6. Consultation Chat Room     │
│ 4. Consultation Chat Room     │              └───────────────┬───────────────┘
└───────────────┬───────────────┘                              │
                │                                              │
                └──────────────────────┬───────────────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │   Local Storage State Store   │
                       ├───────────────────────────────┤
                       │ • Experts (fees, slots, bio)  │
                       │ • Appointments & Statuses     │
                       │ • Chat Messages & Media Logs  │
                       │ • Active User Profile         │
                       └───────────────────────────────┘
```

### Core Entities & Data Structures
- **Expert**: `id`, `name`, `title`, `specialty`, `crops`, `fee` ($/consultation), `rating`, `reviewCount`, `experienceYears`, `bio`, `avatarUrl`, `availableDays`, `timeSlots`.
- **ProblemReport**: `id`, `crop`, `symptoms`, `imageUrl`, `severity`, `matchedExpertIds`, `suggestedDiagnosis`.
- **Appointment**: `id`, `farmerName`, `farmerPhone`, `expertId`, `crop`, `problemDescription`, `date`, `timeSlot`, `feePaid`, `status` ('confirmed' | 'active' | 'completed'), `createdAt`.
- **ChatMessage**: `id`, `appointmentId`, `sender` ('farmer' | 'expert'), `text`, `timestamp`, `imageUrl`.

### State Lifecycle
- Dynamic updates immediately propagate to both views. When a farmer schedules a slot with "Dr. Evelyn Reed", the appointment instantly appears in Dr. Reed's consultation queue, the booked slot is marked reserved, and clicking "Open Chat" opens the synchronized real-time conversation.
- Responsive design tested for both desktop widescreen (1440px) and mobile farmer field use.
