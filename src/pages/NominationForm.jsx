import { useMemo, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { compressImage, uploadFile } from '../utils/fileUpload';

const CATEGORY_FIELDS = {
  Research: ['journalName', 'impactFactor'],
  Startup: ['startupName', 'fundingAmount'],
  Internship: ['company', 'stipend'],
  Competitive_Tech: ['eventName', 'rank'],
  Social_Outreach: ['organization', 'beneficiariesReached'],
  Scholarships: ['scholarshipName', 'amount'],
  Co_Curricular: ['activity', 'position']
};

const emptyForm = {
  studentName: '',
  regNo: '',
  email: '',
  mobile: '',
  year: 'I',
  department: 'CSE',
  category: 'Research',
  title: '',
  issuer: '',
  dateOfEvent: ''
};

export default function NominationForm() {
  const [form, setForm] = useState(emptyForm);
  const [metaData, setMetaData] = useState({});
  const [photo, setPhoto] = useState(null);
  const [proofDoc, setProofDoc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const categorySpecificFields = useMemo(() => CATEGORY_FIELDS[form.category] ?? [], [form.category]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!/^[a-zA-Z0-9]+$/.test(form.regNo)) {
      setMessage('Registration number must be alphanumeric.');
      return;
    }

    if (!proofDoc) {
      setMessage('Proof upload is required for new entries.');
      return;
    }

    try {
      setSaving(true);
      const uid = auth.currentUser?.uid ?? 'anonymous';
      let photoUrl = null;
      if (photo) {
        const compressed = await compressImage(photo);
        photoUrl = await uploadFile(compressed, `photos/${uid}/${Date.now()}-${photo.name}`);
      }

      const proofDocUrl = await uploadFile(proofDoc, `proofs/${uid}/${Date.now()}-${proofDoc.name}`);

      await addDoc(collection(db, 'nominations'), {
        studentId: uid,
        studentName: form.studentName,
        regNo: form.regNo,
        email: form.email,
        mobile: form.mobile,
        year: form.year,
        department: form.department,
        photoUrl,
        category: form.category,
        title: form.title,
        issuer: form.issuer,
        dateOfEvent: new Date(form.dateOfEvent),
        metaData,
        proofDocUrl,
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      setForm(emptyForm);
      setMetaData({});
      setPhoto(null);
      setProofDoc(null);
      setMessage('Nomination submitted successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to submit nomination.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4 rounded-xl bg-white p-6 shadow" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold">Unified Nomination Form</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(form).map(([key, value]) => {
          if (key === 'category') {
            return (
              <label key={key} className="space-y-1">
                <span className="text-sm font-medium">Category</span>
                <select className="w-full rounded border px-3 py-2" value={value} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
                  {Object.keys(CATEGORY_FIELDS).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            );
          }
          if (key === 'year') {
            return (
              <label key={key} className="space-y-1">
                <span className="text-sm font-medium">Year</span>
                <select className="w-full rounded border px-3 py-2" value={value} onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}>
                  {['I', 'II', 'III', 'IV'].map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </label>
            );
          }
          if (key === 'department') {
            return (
              <label key={key} className="space-y-1">
                <span className="text-sm font-medium">Department</span>
                <select className="w-full rounded border px-3 py-2" value={value} onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}>
                  {['CSE', 'AI/ML'].map((department) => (
                    <option key={department}>{department}</option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label key={key} className="space-y-1">
              <span className="text-sm font-medium">{key}</span>
              <input
                required
                type={key === 'dateOfEvent' ? 'date' : key === 'email' ? 'email' : 'text'}
                className="w-full rounded border px-3 py-2"
                value={value}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </label>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categorySpecificFields.map((field) => (
          <label key={field} className="space-y-1">
            <span className="text-sm font-medium">{field}</span>
            <input
              className="w-full rounded border px-3 py-2"
              value={metaData[field] ?? ''}
              onChange={(e) => setMetaData((prev) => ({ ...prev, [field]: e.target.value }))}
            />
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">Profile Photo (auto-compressed to 600x600 @ 80%)</span>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Proof Document (required)</span>
          <input required type="file" onChange={(e) => setProofDoc(e.target.files?.[0] ?? null)} />
        </label>
      </div>

      {message && <p className="text-sm text-slate-700">{message}</p>}
      <button disabled={saving} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50" type="submit">
        {saving ? 'Submitting...' : 'Submit Nomination'}
      </button>
    </form>
  );
}
