
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import DatabaseView from './components/DatabaseView';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/database" element={<DatabaseView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 space-y-4">
              <div className="w-24 h-24 bg-white rounded-3xl border border-slate-200 flex items-center justify-center shadow-sm">
                <span className="text-4xl">📉</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-900 italic">Predictive Analytics</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">AI-Driven Forecasting Coming Soon</p>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
