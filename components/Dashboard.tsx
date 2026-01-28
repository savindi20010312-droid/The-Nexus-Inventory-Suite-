
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { inventoryService } from '../services/inventoryService';
import { Package, TrendingUp, AlertTriangle, XCircle, RefreshCcw } from 'lucide-react';

const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed'];
const STATUS_COLORS = {
  'In Stock': '#10b981',
  'Low Stock': '#f59e0b',
  'Out of Stock': '#ef4444',
  'Discontinued': '#94a3b8'
};

const Dashboard: React.FC = () => {
  const stats = useMemo(() => inventoryService.getDashboardStats(), []);

  const cards = [
    { title: 'Total Inventory', value: stats.totalItems, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Stock Valuation', value: `$${stats.totalValue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Attention Required', value: stats.lowStockCount, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Stockouts', value: stats.outOfStockCount, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nexus Analytics</h1>
          <p className="text-slate-500 font-medium">Monitoring global warehouse health and fulfillment capacity.</p>
        </div>
        <button 
          onClick={() => inventoryService.resetDatabase()}
          className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-semibold"
        >
          <RefreshCcw size={16} />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={card.color} size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Live</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{card.title}</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">Category Mix</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-lg text-slate-500">Inventory Distribution</span>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">Stock Level Health</h3>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Critical</span>
              </div>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
