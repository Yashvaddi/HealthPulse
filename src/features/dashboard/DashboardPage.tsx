/**
 * DashboardPage – Overview feature module.
 *
 * Improvements:
 *  - Uses StatCard shared primitive (memoised, no duplication)
 *  - Uses PageHeader shared primitive
 *  - Chart config objects moved outside the component (stable references, no re-creation on render)
 *  - Data arrays defined at module level (not inside the function body)
 *  - Wrapped with React.memo
 */
import React, { memo } from 'react';
import {
  Users,
  Clock,
  Calendar,
  Video,
  UserPlus,
  MoreVertical,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  Bell,
} from 'lucide-react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { requestNotificationPermission, sendLocalNotification } from '../../shared/services/notifications';
import { useStore } from '../../shared/store/useStore';
import { StatCard } from '../../shared/components/ui/StatCard';
import { PageHeader } from '../../shared/components/ui/PageHeader';

/* ─── Static data (defined outside component – stable references) ─── */
const APPOINTMENT_DATA = [
  { time: '08:00', patients: 30 },
  { time: '10:00', patients: 45 },
  { time: '12:00', patients: 25 },
  { time: '14:00', patients: 60 },
  { time: '16:00', patients: 40 },
  { time: '18:00', patients: 50 },
];

const PIE_DATA = [
  { name: 'Old Patient', value: 45, color: '#3b82f6' },
  { name: 'Online Consultancy', value: 18, color: '#1abc9c' },
  { name: 'New Patient', value: 37, color: '#f43f5e' },
];

const TOP_STATS = [
  { label: 'Appointments', value: '48', icon: Calendar, colorClass: 'bg-blue-500', shadowClass: 'shadow-blue-500/20' },
  { label: 'Online Consultancy', value: '18', icon: Video, colorClass: 'bg-emerald-400', shadowClass: 'shadow-emerald-400/20' },
  { label: 'Pendings', value: '20', icon: UserPlus, colorClass: 'bg-purple-500', shadowClass: 'shadow-purple-500/20' },
  { label: 'Request', value: '12', icon: Clock, colorClass: 'bg-sky-400', shadowClass: 'shadow-sky-400/20' },
];

const TODAY_APPOINTMENTS = [
  { name: 'M.J Kumar', type: 'Health Checkup', time: 'Ongoing', status: 'active' },
  { name: 'Rishi Kiran', type: 'Heavy Cold', time: '12:30 PM', status: 'pending' },
];

const APPOINTMENT_REQUESTS = [
  { name: 'Venkatesh', date: '19 Jan', time: '01:00PM' },
  { name: 'Rishi Kiran', date: '14 Jan', time: '02:00PM' },
  { name: 'Chinna Vel', date: '15 Jan', time: '12:00PM' },
];

const TIMELINE_ITEMS = [
  { time: '11:30AM', label: 'Clinic Consulting', avatars: 3 },
  { time: '02:30PM', label: 'Online Consulting', avatars: 2 },
  { time: '05:30PM', label: 'Meeting - Dr.Sam', avatars: 1 },
];

/* ─── Chart configs (stable – no re-creation per render) ─── */
const PATIENT_ANALYSIS_OPTIONS: any = {
  chart: {
    id: 'patient-analysis',
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 },
  },
  stroke: { curve: 'smooth', width: 2, lineCap: 'round' },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.02, stops: [0, 90, 100] },
  },
  colors: ['#3b82f6'],
  xaxis: {
    categories: APPOINTMENT_DATA.map((d) => d.time),
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { show: false },
  grid: { show: true, borderColor: 'rgba(148,163,184,0.05)', strokeDashArray: 4, position: 'back' },
  markers: { size: 4, colors: ['#3b82f6'], strokeColors: '#fff', strokeWidth: 2, hover: { size: 6 } },
  tooltip: { theme: 'light', x: { show: false } },
};

const PATIENT_ANALYSIS_SERIES = [{ name: 'Patients', data: APPOINTMENT_DATA.map((d) => d.patients) }];

const TODAY_DONUT_OPTIONS: any = {
  chart: { type: 'donut' },
  labels: PIE_DATA.map((d) => d.name),
  colors: PIE_DATA.map((d) => d.color),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '80%',
        labels: {
          show: true,
          total: { show: true, label: 'Daily', fontSize: '10px', fontWeight: 800, color: '#64748b' },
        },
      },
    },
  },
  stroke: { width: 0 },
};

const TODAY_DONUT_SERIES = PIE_DATA.map((d) => d.value);

const MAX_PATIENTS = Math.max(...APPOINTMENT_DATA.map((d) => d.patients));
const MIN_PATIENTS = Math.min(...APPOINTMENT_DATA.map((d) => d.patients));

/* ─── Component ─── */
const DashboardPage: React.FC = memo(() => {
  const { addNotification } = useStore();

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      sendLocalNotification('HealthPulse Test', 'Your real-time notification system is active! 🩺');
      addNotification({
        title: 'System Check',
        message: 'Local notification test triggered successfully.',
        type: 'update',
      });
    } else {
      alert('Notification permission denied.');
    }
  };

  return (
    <div className="space-y-8 bg-[var(--bg-primary)] -m-8 p-8 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Welcome Dr. Henry"
        subtitle="Have a productive clinical day ahead"
        actions={
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTestNotification}
              className="flex items-center gap-2 bg-indigo-600 text-white p-2.5 px-5 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-xs font-bold"
            >
              <Bell size={16} />
              <span>Test Notification</span>
            </motion.button>
            <div className="flex items-center gap-3 bg-[var(--bg-secondary)] p-2.5 px-5 rounded-xl shadow-sm border border-[var(--border-color)] cursor-pointer hover:border-sky-200 transition-all">
              <Calendar size={16} className="text-sky-500" />
              <span className="text-xs font-bold text-[var(--text-secondary)]">15 January 2024</span>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TOP_STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.1} />
        ))}
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <SectionHeader title="Todays Appointment" action="See all" />
          <div className="space-y-4">
            {TODAY_APPOINTMENTS.map((app, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all border border-transparent hover:border-[var(--border-color)] group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] overflow-hidden border-2 border-transparent group-hover:border-sky-500 transition-all">
                  <img src={`https://i.pravatar.cc/150?u=${app.name}`} alt={app.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[var(--text-primary)]">{app.name}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{app.type}</p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-bold ${app.status === 'active' ? 'bg-sky-50 text-sky-600' : 'text-[var(--text-secondary)] bg-[var(--bg-tertiary)]'}`}>
                  {app.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Patient Details</h3>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
              <MoreVertical size={16} className="text-[var(--text-secondary)]" />
            </button>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)] overflow-hidden ring-4 ring-sky-500/10">
              <img src="https://i.pravatar.cc/150?u=kumar" alt="Kumar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">M.J Kumar</p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Heavy Cold</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight">Sex: M</p>
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight">Age: 32</p>
            </div>
          </div>
          <div className="flex gap-2 mb-6">
            <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg border border-amber-100/50">Running Now</span>
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100/50">Cough</span>
          </div>
          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Last Prescription</p>
            <button className="text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:underline">See more</button>
          </div>
        </div>

        {/* Appointment Timeline */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6">Appointment Timeline</h3>
          <div className="space-y-6">
            {TIMELINE_ITEMS.map((item, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== TIMELINE_ITEMS.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-[-24px] w-px border-l-2 border-dashed border-[var(--border-color)]" />
                )}
                <div className="w-4 h-4 rounded-full border-2 border-sky-500 bg-[var(--bg-secondary)] z-10 shadow-sm" />
                <div className="flex-1 -mt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-[var(--text-primary)] leading-none">
                      {item.time} | <span className="text-[var(--text-secondary)] font-medium">{item.label}</span>
                    </p>
                    <div className="flex -space-x-2">
                      {[...Array(item.avatars)].map((_, j) => (
                        <div key={j} className="w-5 h-5 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--bg-tertiary)] overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/150?u=${i}${j}`} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Appointment Requests */}
        <div className="xl:col-span-2 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <SectionHeader title="Appointment Request" action="See all" />
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border-color)]">
                  <th className="pb-4 font-black">Name</th>
                  <th className="pb-4 font-black">Date</th>
                  <th className="pb-4 font-black">Time</th>
                  <th className="pb-4 font-black text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {APPOINTMENT_REQUESTS.map((req, i) => (
                  <tr key={i} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] overflow-hidden border border-[var(--border-color)]">
                          <img src={`https://i.pravatar.cc/150?u=${req.name}`} alt="" />
                        </div>
                        <span className="font-bold text-[var(--text-primary)]">{req.name}</span>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-[var(--text-secondary)] opacity-70">{req.date}</td>
                    <td className="py-4 font-bold text-[var(--text-secondary)] opacity-70">{req.time}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                          <Check size={14} />
                        </button>
                        <button className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today Donut */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-8">
            <ChevronRight size={16} className="text-[var(--text-secondary)] rotate-180 cursor-pointer hover:text-sky-500" />
            <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Today Stats</h3>
            <ChevronRight size={16} className="text-[var(--text-secondary)] cursor-pointer hover:text-sky-500" />
          </div>
          <div className="h-44 w-full">
            <Chart options={TODAY_DONUT_OPTIONS} series={TODAY_DONUT_SERIES} type="donut" height="100%" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 w-full">
            {PIE_DATA.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-[var(--border-color)] pb-1.5 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-[var(--text-secondary)]">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-[var(--text-primary)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Analysis */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Patient Analysis</h3>
            <div className="flex items-center gap-4 bg-[var(--bg-tertiary)] p-2 rounded-xl border border-[var(--border-color)]">
              <div className="text-right">
                <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">Max</p>
                <p className="text-xs font-black text-sky-600">{MAX_PATIENTS}</p>
              </div>
              <div className="w-px h-6 bg-[var(--border-color)]" />
              <div className="text-right">
                <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">Min</p>
                <p className="text-xs font-black text-rose-500">{MIN_PATIENTS}</p>
              </div>
            </div>
          </div>
          <div className="h-44 w-full">
            <Chart options={PATIENT_ANALYSIS_OPTIONS} series={PATIENT_ANALYSIS_SERIES} type="area" height="100%" />
          </div>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-xs font-black text-[var(--text-primary)]">48 Total</p>
                <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">+12% vs last week</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-[var(--text-primary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full border border-[var(--border-color)]">
              15 Jan 2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardPage.displayName = 'DashboardPage';
export default DashboardPage;

/* ─── Internal helper ─── */
const SectionHeader: React.FC<{ title: string; action?: string }> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
    {action && (
      <button className="text-[10px] font-bold text-sky-500 uppercase tracking-widest hover:underline">{action}</button>
    )}
  </div>
);
