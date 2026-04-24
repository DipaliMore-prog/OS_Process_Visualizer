/**
 * StateVisualizer — Clean pastel process state diagram
 */
import { motion, AnimatePresence } from 'framer-motion';
import { PCB, ProcessState } from '@/lib/scheduler';
import { GitBranch } from 'lucide-react';

interface Props { pcbs: PCB[]; }

const STATE_CONFIG: { state: ProcessState; label: string }[] = [
  { state: 'new', label: 'NEW' },
  { state: 'ready', label: 'READY' },
  { state: 'running', label: 'RUNNING' },
  { state: 'waiting', label: 'WAITING' },
  { state: 'terminated', label: 'TERMINATED' },
];

const STATE_COLORS: Record<ProcessState, { bg: string; border: string; text: string }> = {
  new:        { bg: 'linear-gradient(135deg, #8B9CF0, #6B7DE0)', border: '#5B6BD4', text: '#fff' },
  ready:      { bg: 'linear-gradient(135deg, #5BA8E8, #3B8FD9)', border: '#2B7AC9', text: '#fff' },
  running:    { bg: 'linear-gradient(135deg, #4ADE80, #22C55E)', border: '#16A34A', text: '#fff' },
  waiting:    { bg: 'linear-gradient(135deg, #FBBF24, #F59E0B)', border: '#D97706', text: '#1E293B' },
  terminated: { bg: 'linear-gradient(135deg, #F472B6, #EC4899)', border: '#DB2777', text: '#fff' },
  suspended:  { bg: 'linear-gradient(135deg, #C084FC, #A855F7)', border: '#9333EA', text: '#fff' },
};

function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center shrink-0 w-8">
      <svg width="32" height="16" viewBox="0 0 32 16">
        <line x1="0" y1="8" x2="22" y2="8"
          stroke={active ? "#96C8F0" : "hsl(var(--border))"}
          strokeWidth="2" />
        <polygon points="20,3 32,8 20,13"
          fill={active ? "#96C8F0" : "hsl(var(--border))"} />
        {active && (
          <motion.circle cx="0" cy="8" r="2.5" fill="#96C8F0"
            animate={{ cx: [0, 22], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
        )}
      </svg>
    </div>
  );
}

export default function StateVisualizer({ pcbs }: Props) {
  const statesWithProcesses = new Set(pcbs.map(p => p.state));

  return (
    <div className="section">
      <div className="section-header flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-muted-foreground" />
        <span className="font-semibold">Process State Diagram</span>
      </div>
      <div className="section-body py-6">
        <div className="flex items-center justify-between gap-0">
          {STATE_CONFIG.map((config, index) => {
            const processesInState = pcbs.filter(p => p.state === config.state);
            const isActive = processesInState.length > 0;
            const colors = STATE_COLORS[config.state];
            const nextState = STATE_CONFIG[index + 1]?.state;
            const transitionActive = isActive && nextState && statesWithProcesses.has(nextState);

            return (
              <div key={config.state} className="flex items-center flex-1 min-w-0">
                <div className="relative w-full">
                  <div className="relative rounded-xl transition-all duration-500 overflow-hidden border-2"
                    style={{
                      borderColor: isActive ? colors.border : 'hsl(var(--border))',
                      boxShadow: isActive ? `0 4px 16px ${colors.border}40` : 'none',
                    }}>
                    <div className="px-2 py-2.5 flex items-center justify-center gap-1.5"
                      style={{
                        background: isActive ? colors.bg : 'hsl(var(--muted) / 0.5)',
                        borderBottom: `2px solid ${isActive ? colors.border : 'hsl(var(--border))'}`,
                      }}>
                      <span className="text-[10px] font-extrabold tracking-[0.08em] font-mono"
                        style={{ color: isActive ? colors.text : '#64748B' }}>
                        {config.label}
                      </span>
                      {isActive && (
                        <motion.span className="text-[9px] font-mono font-semibold text-muted-foreground"
                          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                          [{processesInState.length}]
                        </motion.span>
                      )}
                    </div>
                    <div className="min-h-[52px] p-2 flex flex-wrap gap-1.5 justify-center items-start bg-card/50">
                      <AnimatePresence mode="popLayout">
                        {processesInState.map(p => (
                          <motion.div key={p.pid} layoutId={`state-${p.pid}`}
                            initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className="px-2.5 py-1 rounded-full font-mono text-[10px] font-extrabold border-2"
                            style={{ borderColor: colors.border, color: colors.text, background: colors.bg }}>
                            {p.pid}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {processesInState.length === 0 && (
                        <span className="text-[10px] text-muted-foreground/40 font-mono italic self-center">—</span>
                      )}
                    </div>
                  </div>
                </div>
                {index < STATE_CONFIG.length - 1 && <FlowArrow active={!!transitionActive} />}
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-center gap-4 flex-wrap">
          {STATE_CONFIG.map(config => {
            const colors = STATE_COLORS[config.state];
            return (
              <div key={config.state} className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border-2" style={{
                  background: colors.bg,
                  borderColor: colors.border,
                }} />
                <span className="text-[10px] font-mono text-muted-foreground">{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
