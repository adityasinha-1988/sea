# Student Excellence Awards (SEA) Portal

Production-ready portal for nomination intake, public wall of fame, and admin moderation/analytics.

## Aapke liye easiest (No-install / Online only)

Agar aapko coding ya install nahi aata, to aapko local machine par kuch run nahi karna:

1. Is project ko GitHub par upload karo.
2. Firebase project banao (Auth + Firestore + Storage + Hosting enable karo).
3. GitHub repo ke **Settings -> Secrets and variables -> Actions** me ye secrets add karo:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_SERVICE_ACCOUNT` (Firebase service account JSON ka pura content)
4. Repo ki default branch `main` rakho.
5. `main` par push hote hi GitHub Action app ko build + deploy kar dega.
6. Aapko final Firebase Hosting URL milega — users wahi URL open karke portal use karenge.

Is workflow me aapko **local install**, **npm**, **terminal**, kuch bhi manually chalane ki zarurat nahi.

---

## Project Structure

```text
sea/
├── .env.example
├── .github/
│   └── workflows/
│       └── deploy-hosting.yml
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

## Developer Setup (optional)

Agar aap developer ho tab:

1. `npm install`
2. `.env.example` copy karke `.env` banao
3. `npm run dev`

## Legacy Import

Server-side migration script:

```bash
node utils/importLegacyData.js ./legacy-data.json
```

Agar service account file path se run karna ho:

```bash
export FIREBASE_SERVICE_ACCOUNT=/path/to/service-account.json
node utils/importLegacyData.js ./legacy-data.json
```
