/**
 * AnalyticsPage – Clinical Analytics feature module.
 *
 * Improvements:
 *  - Uses PageHeader shared primitive.
 *  - Uses downloadCSV and toCSV from utils lib.
 *  - Chart configs moved outside the component for stable references.
 *  - Wrapped with React.memo.
 */
import React, { memo } from 'react';
import Chart from 'react-apexcharts';
import { Download, Calendar, Brain, Heart, ChevronDown } from 'lucide-react';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { downloadCSV, toCSV } from '../../shared/lib/utils';

/* ─── Static data ─── */
const PATIENT_DATA = [
  { month: 'Jan', inward: 400, outward: 240 },
  { month: 'Feb', inward: 300, outward: 139 },
  { month: 'Mar', inward: 200, outward: 980 },
  { month: 'Apr', inward: 278, outward: 390 },
  { month: 'May', inward: 189, outward: 480 },
  { month: 'Jun', inward: 239, outward: 380 },
];

const DEMOGRAPHIC_DATA = [
  { name: 'Pediatrics', value: 400 },
  { name: 'Adults', value: 300 },
  { name: 'Geriatrics', value: 300 },
  { name: 'Emergency', value: 200 },
];

const COLORS = ['#3b82f6', '#1abc9c', '#a855f7', '#f43f5e'];

/* ─── Chart configs ─── */
const THROUGHPUT_OPTIONS: any = {
  chart: { 
    type: 'bar', 
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      borderRadius: 6,
      dataLabels: { position: 'top' }
    },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: PATIENT_DATA.map(d => d.month),
    labels: { style: { colors: '#94a3b8', fontWeight: 600, fontSize: '10px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { 
    labels: { style: { colors: '#94a3b8', fontWeight: 600, fontSize: '10px' } } 
  },
  fill: { opacity: 1 },
  colors: ['#3b82f6', '#e2e8f0'],
  legend: { 
    position: 'top', 
    horizontalAlign: 'right',
    fontSize: '10px',
    fontWeight: 700,
    fontFamily: 'Outfit',
    labels: { colors: '#64748b' }
  },
  grid: { 
    borderColor: 'rgba(148, 163, 184, 0.05)',
    strokeDashArray: 4
  }
};

const THROUGHPUT_SERIES = [
  { name: 'Admissions', data: PATIENT_DATA.map(d => d.inward) },
  { name: 'Discharges', data: PATIENT_DATA.map(d => d.outward) }
];

const RESOURCE_OPTIONS: any = {
  chart: { type: 'donut' },
  labels: DEMOGRAPHIC_DATA.map(d => d.name),
  colors: COLORS,
  legend: { 
    position: 'bottom', 
    horizontalAlign: 'center', 
    markers: { radius: 12 },
    fontSize: '10px',
    fontWeight: 700,
    labels: { colors: '#64748b' }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Capacity',
            fontSize: '10px',
            fontWeight: 800,
            color: '#64748b'
          }
        }
      }
    }
  },
  stroke: { width: 0 }
};

const RESOURCE_SERIES = DEMOGRAPHIC_DATA.map(d => d.value);

const RECOVERY_OPTIONS: any = {
  chart: { 
    toolbar: { show: false }, 
    sparkline: { enabled: false },
    animations: { enabled: true, speed: 1000 }
  },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.25,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  },
  colors: ['#3b82f6'],
  xaxis: {
    categories: PATIENT_DATA.map(d => d.month),
    labels: { style: { colors: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '10px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { show: false },
  grid: { show: true, borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 5 },
  markers: {
    size: 5,
    colors: ['#3b82f6'],
    strokeColors: '#0f172a',
    strokeWidth: 3,
    hover: { size: 7 }
  },
  tooltip: { theme: 'dark' }
};

const RECOVERY_SERIES = [{
  name: 'Success Index',
  data: PATIENT_DATA.map(d => d.inward)
}];

const MAX_ADMISSIONS = Math.max(...PATIENT_DATA.map(d => d.inward));
const MIN_ADMISSIONS = Math.min(...PATIENT_DATA.map(d => d.inward));

const AnalyticsPage: React.FC = memo(() => {
  const handleExport = () => {
    const csv = toCSV(PATIENT_DATA);
    downloadCSV(csv, 'clinical_analytics.csv');
  };

  return (
    <div className="space-y-8 bg-[var(--bg-primary)] -m-8 p-8 min-h-screen">
      <PageHeader 
        title="Clinical Analytics"
        subtitle="Deep insights into your medical practice throughput"
        actions={
          <>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest shadow-sm hover:border-sky-200 transition-all">
              <Calendar size={14} className="text-sky-500" />
              Fiscal Year 2024
              <ChevronDown size={14} />
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Download size={14} />
              Export Intel
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Flow */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Patient Throughput</h3>
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-1">Monthly velocity analysis</p>
            </div>
            <div className="flex items-center gap-4 bg-[var(--bg-tertiary)] p-2 px-3 rounded-xl border border-[var(--border-color)]">
               <div className="text-right">
                  <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">Peak</p>
                  <p className="text-xs font-black text-sky-600">{MAX_ADMISSIONS}</p>
               </div>
               <div className="w-px h-6 bg-[var(--border-color)]" />
               <div className="text-right">
                  <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">Low</p>
                  <p className="text-xs font-black text-slate-400">{MIN_ADMISSIONS}</p>
               </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <Chart 
              options={THROUGHPUT_OPTIONS}
              series={THROUGHPUT_SERIES}
              type="bar"
              height="100%"
            />
          </div>
        </div>

        {/* Dept Distribution */}
        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Resource Map</h3>
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mt-1">Occupancy by department</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 shadow-sm border border-purple-100">
              <Brain size={18} />
            </div>
          </div>
          <div className="h-[280px] w-full flex items-center">
            <Chart 
              options={RESOURCE_OPTIONS}
              series={RESOURCE_SERIES}
              type="donut"
              height="100%"
              width="100%"
            />
          </div>
        </div>

        {/* Success Analytics */}
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 text-sky-500/5 group-hover:scale-125 transition-transform duration-1000">
             <Heart size={300} />
          </div>
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Recovery Performance</h3>
              <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-1">Institutional Success Index</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-2 px-4 rounded-xl border border-white/10">
               <div className="text-right">
                  <p className="text-[8px] font-bold text-sky-400/60 uppercase">Maximum</p>
                  <p className="text-sm font-black text-white">{MAX_ADMISSIONS}</p>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase">
                 Growth: +14.2%
               </div>
            </div>
          </div>
          <div className="h-[280px] w-full relative z-10">
            <Chart 
              options={RECOVERY_OPTIONS}
              series={RECOVERY_SERIES}
              type="area"
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

AnalyticsPage.displayName = 'AnalyticsPage';
export default AnalyticsPage;
