/**
 * PCBTable — Shows sample data before simulation, real data after
 */
import { motion } from 'framer-motion';
import { PCB } from '@/lib/scheduler';
import { Table } from 'lucide-react';

interface Props { pcbs: PCB[]; }

function getStateClass(state: string): string {
  const map: Record<string, string> = {
    new: 'state-new', ready: 'state-ready', running: 'state-running',
    waiting: 'state-waiting', terminated: 'state-terminated', suspended: 'state-suspended',
  };
  return map[state] || '';
}

const SAMPLE_PCBS: PCB[] = [
  { pid: 'P1', state: 'terminated', arrivalTime: 0, burstTime: 5, remainingTime: 0, waitingTime: 3, turnaroundTime: 8, priority: 1 },
  { pid: 'P2', state: 'running', arrivalTime: 1, burstTime: 3, remainingTime: 1, waitingTime: 4, turnaroundTime: 0, priority: 2 },
  { pid: 'P3', state: 'ready', arrivalTime: 2, burstTime: 6, remainingTime: 6, waitingTime: 2, turnaroundTime: 0, priority: 3 },
  { pid: 'P4', state: 'waiting', arrivalTime: 3, burstTime: 4, remainingTime: 4, waitingTime: 1, turnaroundTime: 0, priority: 1 },
] as PCB[];

export default function PCBTable({ pcbs }: Props) {
  const isReal = pcbs.length > 0;
  const displayPcbs = isReal ? pcbs : SAMPLE_PCBS;

  return (
    <div className={`section ${!isReal ? 'relative' : ''}`}>
      {!isReal && (
        <div className="absolute top-3 right-5 z-10">
          <span className="text-[10px] font-bold font-mono text-primary/60 bg-primary/10 px-2.5 py-1 rounded-full">SAMPLE DATA</span>
        </div>
      )}
      <div className="section-header flex items-center gap-2">
        <Table className="w-4 h-4 text-primary" /> <span className="font-bold">Process Control Block (PCB)</span>
      </div>
      <div className={`section-body ${!isReal ? 'opacity-70' : ''}`}>
        <div className="overflow-x-auto rounded-xl border border-border/30">
          <table className="w-full text-xs font-mono table-zebra">
            <thead>
              <tr className="text-muted-foreground bg-muted/30">
                <th className="px-3 py-2.5 text-left font-bold">PID</th>
                <th className="px-3 py-2.5 text-left font-bold">State</th>
                <th className="px-3 py-2.5 text-right font-bold">AT</th>
                <th className="px-3 py-2.5 text-right font-bold">BT</th>
                <th className="px-3 py-2.5 text-right font-bold">Rem</th>
                <th className="px-3 py-2.5 text-right font-bold">WT</th>
                <th className="px-3 py-2.5 text-right font-bold">TAT</th>
              </tr>
            </thead>
            <tbody>
              {displayPcbs.map(pcb => (
                <motion.tr key={pcb.pid} layout className="border-b border-border/20 text-foreground hover:bg-primary/[0.02] transition-colors">
                  <td className="px-3 py-2.5 font-bold text-primary">{pcb.pid}</td>
                  <td className="px-3 py-2.5"><span className={`state-chip ${getStateClass(pcb.state)}`}>{pcb.state.toUpperCase()}</span></td>
                  <td className="px-3 py-2.5 text-right font-semibold">{pcb.arrivalTime}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{pcb.burstTime}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{pcb.remainingTime}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{pcb.waitingTime}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{pcb.turnaroundTime}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
