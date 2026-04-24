/**
 * CPUVisualizer — Clean pastel CPU core visualization
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Props { runningProcess: string | null; currentEvent: string; }

export default function CPUVisualizer({ runningProcess, currentEvent }: Props) {
  const [contextSwitchLog, setContextSwitchLog] = useState<string[]>([]);
  const prevProcess = useRef<string | null>(null);
  const [switchCount, setSwitchCount] = useState(0);

  useEffect(() => {
    if (prevProcess.current !== null && runningProcess !== prevProcess.current && runningProcess !== null) {
      setSwitchCount(c => c + 1);
      setContextSwitchLog(prev => [`${prevProcess.current} → ${runningProcess}`, ...prev].slice(0, 5));
    }
    prevProcess.current = runningProcess;
  }, [runningProcess]);

  const isActive = !!runningProcess;

  return (
    <div className="section">
      <div className="section-header flex items-center gap-2">
        <Cpu className="w-4 h-4 text-muted-foreground" />
        <span className="font-semibold">CPU Core</span>
        {isActive && (
          <motion.div className="ml-auto flex items-center gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="w-2 h-2 rounded-full bg-[hsl(var(--state-running))]"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-[10px] font-mono font-medium text-[hsl(var(--state-running))]">EXECUTING</span>
          </motion.div>
        )}
      </div>
      <div className="section-body">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
                <rect x="8" y="8" width="112" height="112" rx="16" fill="none"
                  stroke="hsl(var(--border))" strokeWidth="2" />
                {[
                  [0, 32], [0, 52], [0, 72], [0, 92],
                  [128, 32], [128, 52], [128, 72], [128, 92],
                  [32, 0], [52, 0], [72, 0], [92, 0],
                  [32, 128], [52, 128], [72, 128], [92, 128],
                ].map(([x, y], i) => (
                  <line key={i}
                    x1={x === 0 ? 0 : x === 128 ? 128 : x} y1={y === 0 ? 0 : y === 128 ? 128 : y}
                    x2={x === 0 ? 12 : x === 128 ? 116 : x} y2={y === 0 ? 12 : y === 128 ? 116 : y}
                    stroke={isActive ? '#3B8FD9' : 'hsl(var(--border))'}
                    strokeWidth="2" strokeLinecap="round" />
                ))}
                {isActive && (
                  <motion.rect x="8" y="8" width="112" height="112" rx="16"
                    fill="none" stroke="#2563EB" strokeWidth="3"
                    strokeDasharray="60 388" strokeLinecap="round"
                    animate={{ strokeDashoffset: [0, -448] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                )}
              </svg>
              <motion.div className={`relative z-10 w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-500 ${
                isActive ? 'border-[#3B8FD9] bg-[#3B8FD9]/10' : 'border-border bg-muted/20'
              }`}>
                <Cpu className={`w-4 h-4 transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
                <AnimatePresence mode="wait">
                  {runningProcess ? (
                    <motion.div key={runningProcess} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                      className="px-2.5 py-0.5 rounded-md font-mono text-[12px] font-extrabold bg-[#3B8FD9]/20 text-foreground border-2 border-[#3B8FD9]">
                      {runningProcess}
                    </motion.div>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
                      className="text-[10px] text-muted-foreground font-mono tracking-widest">IDLE</motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest">CORE 0</span>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <div className="bg-muted/30 rounded-lg p-3 border border-border">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">Current Event</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={currentEvent} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }} className="text-xs font-mono text-foreground">
                  {currentEvent || 'Waiting for simulation…'}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Switches</span>
                <p className="text-xl font-mono font-bold text-foreground leading-none mt-1">{switchCount}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Status</span>
                <p className={`text-sm font-mono font-bold leading-none mt-1.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {isActive ? 'BUSY' : 'IDLE'}
                </p>
              </div>
            </div>

            {contextSwitchLog.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">Context Switches</span>
                </div>
                <div className="space-y-1">
                  {contextSwitchLog.map((entry, i) => (
                    <motion.div key={`${entry}-${i}`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1 - i * 0.15, y: 0 }}
                      className="text-[10px] font-mono text-muted-foreground flex items-center gap-2 bg-muted/20 rounded-md px-2.5 py-1.5 border border-border">
                      <span className="text-[9px] text-foreground font-medium">#{switchCount - i}</span>
                      <span>{entry}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
