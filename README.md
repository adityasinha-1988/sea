# Student Excellence Awards (SEA) Portal

Production-ready portal for nomination intake, public wall of fame, and admin moderation/analytics.

## Project Structure

```text
sea/
├── firebase.json
├── firestore.rules
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── public/
├── src/
│   ├── App.jsx
│   ├── firebase.js
│   ├── index.css
│   ├── main.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── NominationForm.jsx
│   │   └── WallOfFame.jsx
│   └── utils/
│       ├── admin.js
│       └── fileUpload.js
└── utils/
    └── importLegacyData.js
```

## Setup

1. `npm install`
2. Configure `.env` with Vite Firebase keys:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. `npm run dev`

## Legacy Import

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
node utils/importLegacyData.js ./legacy-data.json
```
