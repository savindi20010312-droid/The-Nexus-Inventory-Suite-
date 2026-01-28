
import React, { useState, useRef } from 'react';
import { inventoryService } from '../services/inventoryService';
import { Download, Database, Copy, Check, FileJson, Upload, AlertTriangle } from 'lucide-react';

const DatabaseView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rawData = inventoryService.exportDatabase();

  const handleCopy = () => {
    navigator.clipboard.writeText(rawData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_registry_dump_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = inventoryService.importDatabase(content);
      if (!success) setImportError(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Registry Operations</h1>
          <p className="text-slate-500 font-medium">Read/Write access to the Nexus Tech JSON-Schema database.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-4 rounded-2xl font-bold hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
          >
            <Upload size={18} />
            <span>Import DB</span>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20"
          >
            <Download size={18} />
            <span>Export DUMP</span>
          </button>
        </div>
      </div>

      {importError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-6 rounded-3xl flex items-center space-x-4 animate-bounce">
          <AlertTriangle size={24} />
          <div className="flex flex-col">
            <span className="font-black uppercase text-xs tracking-widest">Database Corruption Error</span>
            <span className="text-sm font-medium">The uploaded JSON does not match the Nexus Tech Schema v2.0.</span>
          </div>
          <button onClick={() => setImportError(false)} className="ml-auto font-black text-lg">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-[#0F172A] rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden ring-4 ring-slate-900/10">
            <div className="bg-slate-800/40 px-10 py-5 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileJson size={20} className="text-blue-400" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">core_registry_primary.json</span>
              </div>
              <button onClick={handleCopy} className="text-slate-500 hover:text-white transition-colors">
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-10 h-[550px] overflow-auto custom-scrollbar font-mono text-xs md:text-sm">
              <pre className="text-blue-200/80 whitespace-pre-wrap leading-relaxed selection:bg-blue-500/30">
                {rawData}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 relative z-10">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 relative z-10">Health Integrity</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 relative z-10">
              Nexus Registry utilizes automatic indexing for stock health. Every unit change triggers a recalculation of the warehouse priority map.
            </p>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                <span className="text-xs font-bold text-blue-600">Strict-JSON</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync</span>
                <span className="text-xs font-bold text-emerald-500 uppercase">Live</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl group">
             <h3 className="text-lg font-black mb-4 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Security Zone</span>
             </h3>
             <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                Administrative reset will wipe the registry and reload factory-defaults. This action cannot be undone.
             </p>
             <button 
                onClick={() => { if(confirm('⚠️ WARNING: Destructive Action. Factory reset now?')) inventoryService.resetDatabase(); }}
                className="w-full py-4 bg-white/5 hover:bg-rose-500 text-slate-300 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-2xl border border-white/10 transition-all duration-300"
             >
                Factory Data Reset
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseView;
