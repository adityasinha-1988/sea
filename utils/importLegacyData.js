import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs/promises';

/**
 * Optional initialization via service account JSON path in FIREBASE_SERVICE_ACCOUNT
 */
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

initializeApp(
  serviceAccountPath
    ? { credential: cert(JSON.parse(await fs.readFile(serviceAccountPath, 'utf-8'))) }
    : { credential: applicationDefault() }
);

const db = getFirestore();

export async function batchWriteLegacyData(jsonData) {
  let batch = db.batch();
  let operationCount = 0;

  for (const item of jsonData) {
    const docRef = db.collection('nominations').doc();
    batch.set(docRef, {
      studentId: item.studentId ?? 'legacy-import',
      studentName: item.studentName ?? 'Unknown Student',
      regNo: item.regNo ?? 'N/A',
      email: item.email ?? '',
      mobile: item.mobile ?? '',
      year: item.year ?? 'I',
      department: item.department ?? 'CSE',
      photoUrl: null,
      category: item.category ?? 'Co_Curricular',
      title: item.title ?? 'Legacy Achievement',
      issuer: item.issuer ?? 'Legacy Record',
      dateOfEvent: item.dateOfEvent ? new Date(item.dateOfEvent) : new Date('2000-01-01'),
      metaData: item.metaData ?? {},
      proofDocUrl: null,
      status: 'Approved',
      createdAt: new Date()
    });

    operationCount += 1;

    if (operationCount === 500) {
      await batch.commit();
      batch = db.batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
  }
}

async function run() {
  const path = process.argv[2];
  if (!path) {
    throw new Error('Usage: node utils/importLegacyData.js <legacy-data.json>');
  }

  const raw = await fs.readFile(path, 'utf-8');
  const jsonData = JSON.parse(raw);
  await batchWriteLegacyData(jsonData);
  console.log(`Imported ${jsonData.length} legacy records successfully.`);
}

if (process.argv[1].includes('importLegacyData.js')) {
  run().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
