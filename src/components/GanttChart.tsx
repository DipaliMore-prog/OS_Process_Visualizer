/**
 * GanttChart — Clean pastel Gantt chart
 */

import { motion } from 'framer-motion';
import { GanttEntry } from '@/lib/scheduler';
import { Timer } from 'lucide-react';

interface Props { entries: GanttEntry[]; }

const COLORS = [
  { bg: 'linear-gradient(135deg, #5BA8E8, #3B8FD9)', border: '#2B7AC9', text: '#fff' },
  { bg: 'linear-gradient(135deg, #F472B6, #EC4899)', border: '#DB2777', text: '#fff' },
  { bg: 'linear-gradient(135deg, #4ADE80, #22C55E)', border: '#16A34A', text: '#fff' },
  { bg: 'linear-gradient(135deg, #FBBF24, #F59E0B)', border: '#D97706', text: '#1E293B' },
  { bg: 'linear-gradient(135deg, #C084FC, #A855F7)', border: '#9333EA', text: '#fff' },
  { bg: 'linear-gradient(135deg, #8B9CF0, #6B7DE0)', border: '#5B6BD4', text: '#fff' },
  { bg: 'linear-gradient(135deg, #FB7185, #F43F5E)', border: '#E11D48', text: '#fff' },
];

const SAMPLE_ENTRIES: GanttEntry[] = [
  { pid: 'P1', start: 0, end: 3 },
  { pid: 'P2', start: 3, end: 5 },
  { pid: 'P3', start: 5, end: 8 },
  { pid: 'P1', start: 8, end: 10 },
  { pid: 'P4', start: 10, end: 13 },
];

export default function GanttChart({ entries }: Props) {
  const isReal = entries.length > 0;
  const displayEntries = isReal ? entries : SAMPLE_ENTRIES;

  const pids = [...new Set(displayEntries.map(e => e.pid))];
  const colorMap: Record<string, typeof COLORS[0]> = {};
  pids.forEach((pid, i) => { colorMap[pid] = COLORS[i % COLORS.length]; });

  const maxTime = Math.max(...displayEntries.map(e => e.end));
  const unitWidth = Math.max(40, Math.min(72, 480 / maxTime));

  return (
    <div className={`section ${!isReal ? 'relative' : ''}`}>
      {!isReal && (
        <div className="absolute top-3 right-5 z-10">
          <span className="text-[10px] font-semibold font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-full">SAMPLE DATA</span>
        </div>
      )}
      <div className="section-header flex items-center gap-2">
        <Timer className="w-4 h-4 text-muted-foreground" /> <span className="font-semibold">Gantt Chart</span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">{displayEntries.length} blocks</span>
      </div>
      <div className={`section-body space-y-3 ${!isReal ? 'opacity-70' : ''}`}>
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex items-end gap-0 min-w-fit">
            {displayEntries.map((entry, i) => {
              const color = colorMap[entry.pid];
              const duration = entry.end - entry.start;
              const width = duration * unitWidth;
              return (
                <motion.div key={`${entry.pid}-${entry.start}-${i}`}
                  initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ width: `${width}px`, transformOrigin: 'left' }}>
                  <div className="h-14 rounded-lg flex flex-col items-center justify-center border-2 gap-0.5"
                    style={{
                      background: color.bg,
                      borderColor: color.border,
                      color: color.text,
                      textShadow: color.text === '#fff' ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                    }}>
                    <span className="text-[11px] font-mono font-extrabold leading-none">{entry.pid}</span>
                    <span className="text-[8px] font-mono font-bold leading-none opacity-80">
                      {entry.start}→{entry.end} ({duration}u)
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* Step-by-step timeline with all boundary times */}
          <div className="flex min-w-fit mt-1 border-t border-border pt-1 h-5">
            {displayEntries.map((entry, i) => {
              const width = (entry.end - entry.start) * unitWidth;
              const showStart = i === 0 || entry.start !== displayEntries[i - 1].end;
              return (
                <div key={`time-${i}`} className="flex-shrink-0 relative" style={{ width: `${width}px` }}>
                  {showStart && (
                    <span className="absolute left-0 -translate-x-1/2 text-[10px] font-mono font-bold text-foreground">{entry.start}</span>
                  )}
                  <span className="absolute right-0 translate-x-1/2 text-[10px] font-mono font-bold text-foreground">{entry.end}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          {pids.map(pid => {
            const c = colorMap[pid];
            return (
              <div key={pid} className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded border-2" style={{
                  background: c.bg,
                  borderColor: c.border,
                }} />
                <span className="text-[10px] font-mono text-muted-foreground">{pid}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
