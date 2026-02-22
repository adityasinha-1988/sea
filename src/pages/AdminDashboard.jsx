import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query, updateDoc, doc } from 'firebase/firestore';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { BarChart, Bar, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Legend } from 'recharts';
import { db } from '../firebase';

const pieColors = ['#2563eb', '#16a34a', '#ca8a04', '#9333ea'];

export default function AdminDashboard() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'nominations'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => setRows(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const setStatus = async (id, status) => updateDoc(doc(db, 'nominations', id), { status });

  const columns = useMemo(
    () => [
      { header: 'Date', accessorFn: (row) => row.createdAt?.toDate?.()?.toLocaleDateString() ?? '-' },
      { header: 'RegNo', accessorKey: 'regNo' },
      { header: 'Category', accessorKey: 'category' },
      { header: 'Status', accessorKey: 'status' },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button className="rounded bg-green-600 px-2 py-1 text-xs text-white" onClick={() => setStatus(row.original.id, 'Approved')}>
              Approve
            </button>
            <button className="rounded bg-red-600 px-2 py-1 text-xs text-white" onClick={() => setStatus(row.original.id, 'Rejected')}>
              Reject
            </button>
          </div>
        )
      }
    ],
    []
  );

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  const barData = useMemo(() => {
    const counts = rows.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [rows]);

  const pieData = useMemo(() => {
    const counts = rows.reduce((acc, item) => {
      acc[item.year] = (acc[item.year] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [rows]);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-xl bg-white p-4 shadow">
          <h3 className="mb-4 font-semibold">Category Counts</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80 rounded-xl bg-white p-4 shadow">
          <h3 className="mb-4 font-semibold">Year Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white p-4 shadow">
        <table className="min-w-full text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border-b px-2 py-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelected(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b px-2 py-2 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl rounded-lg bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Proof Document: {selected.studentName}</h3>
            {selected.proofDocUrl ? (
              <iframe src={selected.proofDocUrl} title="proof-document" className="mt-4 h-96 w-full rounded border" />
            ) : (
              <p className="mt-4 text-sm text-slate-500">No proof doc available (legacy entry).</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
