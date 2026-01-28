
import React, { useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import { Settings as SettingsIcon, Save, Globe, Shield, Bell, Truck } from 'lucide-react';

const Settings: React.FC = () => {
  const [config, setConfig] = useState(inventoryService.getConfig());
  const [saveStatus, setSaveStatus] = useState<null | 'success' | 'error'>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      inventoryService.updateConfig(config);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('error');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium">Configure global warehouse logic and operational thresholds.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Logic Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Threshold Controller</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Low Stock Trigger</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="number" min="1" max="100"
                  value={config.lowStockThreshold}
                  onChange={e => setConfig({...config, lowStockThreshold: parseInt(e.target.value)})}
                  className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                />
                <span className="text-xs text-slate-400 font-bold w-20">Units remaining</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Critical Stock Trigger</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="number" min="1" max="50"
                  value={config.criticalStockThreshold}
                  onChange={e => setConfig({...config, criticalStockThreshold: parseInt(e.target.value)})}
                  className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                />
                <span className="text-xs text-slate-400 font-bold w-20">Units remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Localization & Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Globe size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-900">Localization</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Warehouse Location</label>
                <input 
                  type="text" 
                  value={config.warehouseLocation}
                  onChange={e => setConfig({...config, warehouseLocation: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Currency</label>
                <select 
                  value={config.currency}
                  onChange={e => setConfig({...config, currency: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-900"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="flex items-center space-x-3 mb-8 relative z-10">
              <div className="w-10 h-10 bg-slate-800 border border-slate-700 text-blue-400 rounded-xl flex items-center justify-center">
                <Bell size={20} />
              </div>
              <h2 className="text-lg font-black text-white">Notification Engine</h2>
            </div>
            <div className="space-y-4 relative z-10">
               <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="text-sm font-bold text-slate-300">Email Alerts</span>
                  <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1">
                     <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
                  </div>
               </div>
               <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="text-sm font-bold text-slate-300">Slack Integration</span>
                  <div className="w-10 h-5 bg-slate-700 rounded-full flex items-center justify-start px-1">
                     <div className="w-3.5 h-3.5 bg-slate-500 rounded-full"></div>
                  </div>
               </div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mt-4">Automated Stock Reports will be sent daily at 08:00 Local Time</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          {saveStatus === 'success' && <span className="text-emerald-500 font-bold animate-pulse">Configuration Locked!</span>}
          <button 
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-500/30 transition-all active:scale-95"
          >
            <Save size={20} />
            <span>Update Global Config</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
