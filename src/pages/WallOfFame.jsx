import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { db } from '../firebase';

const years = ['All', 'I', 'II', 'III', 'IV'];
const categories = ['All', 'Research', 'Startup', 'Internship', 'Competitive_Tech', 'Social_Outreach', 'Scholarships', 'Co_Curricular'];

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export default function WallOfFame() {
  const [items, setItems] = useState([]);
  const [yearFilter, setYearFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'nominations'), where('status', '==', 'Approved'));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setActiveIndex(0);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (yearFilter === 'All' || item.year === yearFilter) &&
          (categoryFilter === 'All' || item.category === categoryFilter)
      ),
    [items, yearFilter, categoryFilter]
  );

  const current = filtered[activeIndex] ?? null;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <select className="rounded-md border px-3 py-2" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          {years.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
        <select className="rounded-md border px-3 py-2" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        {!current && <p className="text-slate-600">No approved records found for selected filters.</p>}

        <AnimatePresence mode="wait">
          {current && (
            <motion.article
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid items-center gap-6 md:grid-cols-[180px_1fr]"
            >
              {current.photoUrl ? (
                <img src={current.photoUrl} alt={current.studentName} className="h-44 w-44 rounded-full object-cover" />
              ) : (
                <div className="flex h-44 w-44 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700">
                  {initials(current.studentName) || 'UA'}
                </div>
              )}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{current.studentName}</h2>
                <p className="text-slate-700">{current.title}</p>
                <p className="text-sm text-slate-500">
                  {current.category} • Year {current.year}
                </p>
                <p className="text-sm text-slate-500">Issued by {current.issuer}</p>
              </div>
            </motion.article>
          )}
        </AnimatePresence>

        {filtered.length > 1 && (
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="rounded bg-slate-100 px-3 py-2"
              onClick={() => setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length)}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded bg-slate-100 px-3 py-2"
              onClick={() => setActiveIndex((prev) => (prev + 1) % filtered.length)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
