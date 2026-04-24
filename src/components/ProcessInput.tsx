/**
 * ProcessInput — Soft modern themed input panel
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Shuffle, ListPlus } from 'lucide-react';
import { ProcessInput as ProcessInputType } from '@/lib/scheduler';

interface Props {
  processes: ProcessInputType[];
  onAdd: (process: ProcessInputType) => void;
  onRemove: (pid: string) => void;
  onGenerateRandom: (count?: number) => void;
  disabled: boolean;
}

export default function ProcessInput({ processes, onAdd, onRemove, onGenerateRandom, disabled }: Props) {
  const [pid, setPid] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [burstTime, setBurstTime] = useState('');
  const [priority, setPriority] = useState('');

  const handleAdd = () => {
    if (!pid || !arrivalTime || !burstTime) return;
    if (processes.some(p => p.pid === pid)) return;
    onAdd({ pid, arrivalTime: parseInt(arrivalTime), burstTime: parseInt(burstTime), priority: parseInt(priority) || 1 });
    setPid(''); setArrivalTime(''); setBurstTime(''); setPriority('');
  };

  return (
    <div className="section">
      <div className="section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListPlus className="w-3.5 h-3.5 text-primary" />
          <span>Process Input</span>
        </div>
        <button onClick={() => onGenerateRandom(5)} disabled={disabled}
          className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-primary/80 transition disabled:opacity-40">
          <Shuffle className="w-3 h-3" /> Generate Random
        </button>
      </div>
      <div className="section-body space-y-4">
        <div className="flex gap-2">
          {[
            { placeholder: 'PID', value: pid, onChange: setPid, type: 'text', className: 'flex-1 min-w-0' },
            { placeholder: 'Arrival', value: arrivalTime, onChange: setArrivalTime, type: 'number', className: 'w-20' },
            { placeholder: 'Burst', value: burstTime, onChange: setBurstTime, type: 'number', className: 'w-20' },
            { placeholder: 'Priority', value: priority, onChange: setPriority, type: 'number', className: 'w-20' },
          ].map(input => (
            <input key={input.placeholder}
              className={`${input.className} bg-muted/40 border border-border/50 rounded-xl px-3 py-2.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all`}
              placeholder={input.placeholder} type={input.type}
              min={input.type === 'number' ? (input.placeholder === 'Burst' ? 1 : 0) : undefined}
              value={input.value} onChange={e => input.onChange(e.target.value)} disabled={disabled} />
          ))}
          <button onClick={handleAdd} disabled={disabled || !pid || !arrivalTime || !burstTime}
            className="btn-gradient text-xs font-bold py-2.5 px-6 shrink-0 disabled:opacity-40 !rounded-xl shadow-lg">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {processes.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-border/40">
            <table className="w-full text-xs font-mono table-zebra">
              <thead>
                <tr className="text-muted-foreground bg-muted/40">
                  <th className="px-3 py-2.5 text-left font-medium">PID</th>
                  <th className="px-3 py-2.5 text-left font-medium">Arrival</th>
                  <th className="px-3 py-2.5 text-left font-medium">Burst</th>
                  <th className="px-3 py-2.5 text-left font-medium">Priority</th>
                  <th className="px-3 py-2.5 w-8"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {processes.map(p => (
                    <motion.tr key={p.pid} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      className="border-b border-border/20 text-foreground">
                      <td className="px-3 py-2.5 font-semibold text-primary">{p.pid}</td>
                      <td className="px-3 py-2.5">{p.arrivalTime}</td>
                      <td className="px-3 py-2.5">{p.burstTime}</td>
                      <td className="px-3 py-2.5">{p.priority}</td>
                      <td className="px-3 py-2.5">
                        <button onClick={() => onRemove(p.pid)} disabled={disabled}
                          className="text-destructive/50 hover:text-destructive transition disabled:opacity-40">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
