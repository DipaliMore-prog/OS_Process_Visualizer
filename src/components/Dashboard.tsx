/**
 * Dashboard — Clean pastel performance dashboard
 */
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { PerformanceMetrics } from '@/lib/scheduler';
import { Clock, Activity, Gauge, Cpu, BarChart3 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props { metrics: PerformanceMetrics | null; }

const SAMPLE_METRICS = {
  avgWaitingTime: 4.25,
  avgTurnaroundTime: 8.50,
  throughput: 0.285,
  cpuUtilization: 72.5,
};

export default function Dashboard({ metrics }: Props) {
  const isReal = !!metrics;
  const m = metrics || SAMPLE_METRICS;
  const cpuUtil = m.cpuUtilization;

  const data = {
    labels: ['Avg Wait', 'Avg Turnaround', 'Throughput'],
    datasets: [{
      label: 'Value',
      data: [parseFloat(m.avgWaitingTime.toFixed(2)), parseFloat(m.avgTurnaroundTime.toFixed(2)), parseFloat(m.throughput.toFixed(3))],
      backgroundColor: ['#3B8FD9', '#22C55E', '#EC4899'],
      borderColor: ['#2B7AC9', '#16A34A', '#DB2777'],
      borderWidth: 2, borderRadius: 8, barPercentage: 0.6,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1E293B', titleFont: { family: 'JetBrains Mono', size: 11 }, bodyFont: { family: 'JetBrains Mono', size: 11 }, padding: 10, cornerRadius: 8 } },
    scales: {
      x: { ticks: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 10 } }, grid: { display: false }, border: { display: false } },
      y: { ticks: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } },
    },
  };

  const METRIC_CARDS = [
    { label: 'Avg Wait Time', value: m.avgWaitingTime.toFixed(2), unit: 'units', icon: Clock, color: '#3B8FD9', borderColor: '#2B7AC9' },
    { label: 'Avg Turnaround', value: m.avgTurnaroundTime.toFixed(2), unit: 'units', icon: Activity, color: '#22C55E', borderColor: '#16A34A' },
    { label: 'Throughput', value: m.throughput.toFixed(3), unit: 'proc/unit', icon: Gauge, color: '#EC4899', borderColor: '#DB2777' },
    { label: 'CPU Utilization', value: m.cpuUtilization.toFixed(1), unit: '%', icon: Cpu, color: '#A855F7', borderColor: '#9333EA' },
  ];

  return (
    <div className={`section ${!isReal ? 'relative' : ''}`}>
      {!isReal && (
        <div className="absolute top-3 right-5 z-10">
          <span className="text-[10px] font-semibold font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-full">SAMPLE DATA</span>
        </div>
      )}
      <div className="section-header flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-muted-foreground" /> <span className="font-semibold">Performance Dashboard</span>
      </div>
      <div className={`section-body space-y-5 ${!isReal ? 'opacity-70' : ''}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {METRIC_CARDS.map((mc, i) => {
            const Icon = mc.icon;
            return (
              <motion.div key={mc.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} className="metric-card">
                <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-xl" style={{ background: `linear-gradient(90deg, ${mc.color}, ${mc.borderColor})` }} />
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center border-2"
                    style={{ background: `linear-gradient(135deg, ${mc.color}30, ${mc.color}15)`, borderColor: mc.color }}>
                    <Icon className="w-4 h-4" style={{ color: mc.color }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{mc.unit}</span>
                </div>
                <p className="text-xl font-mono font-bold text-foreground leading-none">{mc.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-medium uppercase tracking-wide">{mc.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-5">
          <div className="flex-1 h-44 bg-muted/30 rounded-xl p-3">
            <Bar data={data} options={options} />
          </div>
          <div className="w-36 flex flex-col items-center justify-center shrink-0 bg-muted/30 rounded-xl p-3">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <defs><linearGradient id="cpuGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3B8FD9"/><stop offset="100%" stopColor="#2563EB"/></linearGradient></defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke="url(#cpuGrad)" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={`${Math.PI * 84}`}
                  initial={{ strokeDashoffset: Math.PI * 84 }}
                  animate={{ strokeDashoffset: Math.PI * 84 * (1 - cpuUtil / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-mono font-bold text-foreground leading-none">{cpuUtil.toFixed(0)}</span>
                <span className="text-[9px] font-mono text-muted-foreground">%</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-2">CPU Usage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
