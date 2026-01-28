
import React from 'react';
import { LayoutDashboard, Box, Settings, Bell, Search, User, Database } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const config = inventoryService.getConfig();

  const navItems = [
    { name: 'Analytics', icon: LayoutDashboard, path: '/' },
    { name: 'Stock Registry', icon: Box, path: '/inventory' },
    { name: 'Data Center', icon: Database, path: '/database' },
    { name: 'System Config', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] text-white flex flex-col shadow-2xl">
        <div className="p-10 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl shadow-blue-500/30 -rotate-3">N</div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none italic">NEXUS</span>
            <span className="text-[10px] text-blue-400 font-black tracking-[0.2em] uppercase mt-2">Warehouse v2.1</span>
          </div>
        </div>
        
        <nav className="flex-1 px-6 py-8 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-4 px-6 py-5 rounded-[2rem] transition-all duration-300 group ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <item.icon size={22} className={location.pathname === item.path ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'} />
              <span className="font-black text-sm uppercase tracking-wider">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 mx-4 mb-8 bg-slate-800/30 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-blue-500/30 flex items-center justify-center shadow-inner overflow-hidden">
               <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg uppercase italic">
                  {config.adminName.charAt(0)}
               </div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-black text-white italic truncate w-32">{config.adminName}</p>
              <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest">{config.warehouseLocation.split(' ')[0]}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-12 sticky top-0 z-20">
          <div className="flex items-center bg-slate-50 rounded-[2rem] px-6 py-4 w-[450px] border border-slate-100 group focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-500/20 transition-all duration-500">
            <Search size={20} className="text-slate-300 mr-4 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search assets, SKU codes, or batch IDs..." 
              className="bg-transparent border-none outline-none text-sm w-full font-bold text-slate-600 placeholder:text-slate-300"
            />
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Network Secure</span>
            </div>
            <button className="relative group p-1">
               <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></div>
               <Bell size={24} className="text-slate-400 group-hover:text-slate-900 transition-all" />
            </button>
            <div className="h-10 w-px bg-slate-200"></div>
            <button className="text-xs font-black text-blue-600 hover:text-white px-6 py-3 border-2 border-blue-600/10 hover:bg-blue-600 rounded-2xl transition-all uppercase tracking-widest active:scale-95">
              Live Export
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
