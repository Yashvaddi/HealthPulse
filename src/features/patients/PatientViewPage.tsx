/**
 * PatientViewPage – detailed patient record view.
 *
 * Improvements:
 *  - Uses Badge and statusToVariant primitives.
 *  - ResponsiveContainer and chart config moved to module level where possible.
 *  - Wrapped with React.memo.
 *  - Dark mode aware.
 */
import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../shared/store/useStore';
import { 
  ArrowLeft, 
  Activity, 
  HeartPulse, 
  Calendar, 
  User, 
  Shield, 
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge, statusToVariant } from '../../shared/components/ui/Badge';

const VITAL_DATA = [
  { time: '08:00', heartRate: 72, temp: 36.6 },
  { time: '10:00', heartRate: 75, temp: 36.8 },
  { time: '12:00', heartRate: 82, temp: 37.1 },
  { time: '14:00', heartRate: 78, temp: 37.0 },
  { time: '16:00', heartRate: 74, temp: 36.7 },
  { time: '18:00', heartRate: 71, temp: 36.5 },
];

const PatientViewPage: React.FC = memo(() => {
  const { id } = useParams<{ id: string }>();
  const { patients } = useStore();
  const navigate = useNavigate();
  
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500">
          <Shield size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-sm font-medium">The clinical record you are looking for might have been moved or deleted.</p>
        <button 
          onClick={() => navigate('/patients')}
          className="mt-8 px-8 py-3 bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[var(--bg-primary)] -m-8 p-8 min-h-screen text-[var(--text-primary)]">
      <button 
        onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-sky-500 transition-colors font-bold text-[10px] uppercase tracking-widest group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Registry
      </button>

      {/* Hero Profile Card */}
      <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-sky-50/10 -z-10" />
        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-[var(--bg-tertiary)] border-4 border-[var(--bg-secondary)] shadow-xl ring-8 ring-sky-500/5">
              {patient.image ? (
                <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-[var(--bg-secondary)] shadow-lg flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{patient.name}</h1>
              <Badge label={patient.status} variant={statusToVariant(patient.status)} />
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              <div className="flex items-center gap-2">
                <HeartPulse size={16} className="text-sky-500" />
                <span className="text-xs text-[var(--text-secondary)] font-bold">{patient.diagnosis}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--text-secondary)]" />
                <span className="text-xs text-[var(--text-secondary)] font-bold">Last Visit: {patient.lastVisit}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[var(--text-secondary)]" />
                <span className="text-xs text-[var(--text-secondary)] font-bold">ID: {patient.id}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
             <button className="px-6 h-11 bg-sky-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-95">
                Update Record
             </button>
             <button className="w-11 h-11 flex items-center justify-center bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-sky-500/30 transition-all active:scale-95">
                <FileText size={18} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals Graph */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-sm font-bold text-[var(--text-primary)]">Vitals History</h3>
                 <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">Real-time health telemetry</p>
              </div>
              <div className="flex gap-2 bg-[var(--bg-tertiary)] p-1 rounded-lg">
                 <button className="px-4 py-1.5 bg-[var(--bg-secondary)] shadow-sm rounded-md text-[10px] font-bold text-sky-600 uppercase tracking-widest">24 Hours</button>
                 <button className="px-4 py-1.5 rounded-md text-[10px] font-bold text-[var(--text-secondary)] hover:text-sky-500 uppercase tracking-widest transition-colors">7 Days</button>
              </div>
           </div>
           
           <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={VITAL_DATA}>
                    <defs>
                       <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHR)" dot={{ r: 4, fill: '#3b82f6', stroke: '#fff' }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-6">
           <div className="bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-sky-500/10 group-hover:scale-125 transition-transform duration-1000">
                 <TrendingUp size={100} />
              </div>
              <div className="relative z-10">
                 <p className="text-sky-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Health Index</p>
                 <h3 className="text-3xl font-bold tracking-tight mb-3">92.4%</h3>
                 <p className="text-slate-400 text-[11px] font-medium leading-relaxed">Patient is showing positive recovery signals. Metabolic rate is stabilizing.</p>
              </div>
           </div>

           <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Clock size={16} className="text-sky-500" />
                 Medical Timeline
              </h4>
              <div className="space-y-6">
                 {[
                   { event: 'Morning vitals check', time: '08:45 AM', type: 'Checkup' },
                   { event: 'Medication administered', time: '10:15 AM', type: 'Medication' },
                   { event: 'Physiotherapy session', time: '02:00 PM', type: 'Treatment' },
                 ].map((item, i) => (
                    <div key={i} className="flex gap-4 relative">
                       {i !== 2 && <div className="absolute left-[7px] top-4 bottom-[-24px] w-px border-l-2 border-dashed border-[var(--border-color)]" />}
                       <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-[var(--bg-secondary)] shadow-sm shrink-0 z-10" />
                       <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">{item.event}</p>
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">{item.time} • {item.type}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
});

PatientViewPage.displayName = 'PatientViewPage';
export default PatientViewPage;
