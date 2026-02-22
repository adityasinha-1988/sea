import { useState } from 'react';
import WallOfFame from './pages/WallOfFame';
import NominationForm from './pages/NominationForm';
import AdminDashboard from './pages/AdminDashboard';

const tabs = ['Wall of Fame', 'Nominate', 'Admin'];

export default function App() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-slate-900">Student Excellence Awards Portal</h1>
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'Wall of Fame' && <WallOfFame />}
        {activeTab === 'Nominate' && <NominationForm />}
        {activeTab === 'Admin' && <AdminDashboard />}
      </main>
    </div>
  );
}
