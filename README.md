# AgriConnect - Farmer to Agriculture Expert Platform

AgriConnect is a responsive web application connecting farmers experiencing crop health issues (e.g., yellowing in banana leaves, blights, nutrient deficiencies) with specialized agricultural experts for diagnosis, appointment booking, and direct consultation chat.

## Key Features

1. **Farmer Crop Health Diagnostics**:
   - Farmers select their crop (Banana, Tomato, Rice, Maize, Citrus, etc.) and describe symptoms.
   - Built-in heuristic and AI matching engine identifies likely causes (e.g., Potassium Deficiency, Sigatoka, Fusarium Wilt).

2. **Smart Expert Suggestion**:
   - Matches farmers with verified agricultural doctors, plant pathologists, and soil chemists ranked by specialization relevance.

3. **Schedule & Appointment Booking**:
   - Farmers choose an expert, pick an available date and time slot from the expert's schedule.
   - Reviews the transparent consultation fee decided by the expert.

4. **Live Consultation Chat Room**:
   - Direct messaging between farmer and expert.
   - Farmers can ask dosage recommendations, pruning advice, and drainage questions.
   - Experts can write prescriptions and step-by-step treatment instructions.

5. **Expert Portal & Profile Management**:
   - Experts can set their own consultation fee ($ / session).
   - Experts can define and update their crop expertise and diagnostic specialties.
   - Experts can configure their weekly calendar days and active daily time slots.

6. **Quick Role Switcher**:
   - Easily toggle between **Farmer View** and **Expert View** using the top-bar button to test both sides of the platform.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
```bash
git clone <your-github-repo-url>
cd agriconnect
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production / GitHub Pages
```bash
npm run build
```
The output will be in the `dist/` directory, ready to deploy to GitHub Pages, Vercel, or Netlify.
