/**
 * Home Page — Clean pastel academic design
 */
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Play, Pause, RotateCcw, SkipForward, Menu, X,
  Code2, Palette, Zap, Terminal, MonitorSmartphone, BarChart3,
  ArrowRight, BookOpen
} from 'lucide-react';
import ProcessInputPanel from '@/components/ProcessInput';
import StateVisualizer from '@/components/StateVisualizer';
import PCBTable from '@/components/PCBTable';
import CPUVisualizer from '@/components/CPUVisualizer';
import GanttChart from '@/components/GanttChart';
import Dashboard from '@/components/Dashboard';

import { useSimulation } from '@/hooks/useSimulation';
import { Algorithm } from '@/lib/scheduler';
import heroIllustration from '@/assets/hero-illustration.png';

const ALGORITHMS: { value: Algorithm; label: string; desc: string }[] = [
  { value: 'fcfs', label: 'FCFS', desc: 'First Come First Served' },
  { value: 'sjf', label: 'SJF', desc: 'Shortest Job First' },
  { value: 'round-robin', label: 'Round Robin', desc: 'Time Quantum Based' },
  { value: 'priority', label: 'Priority', desc: 'Priority Based' },
];

const NAV_LINKS = ['Home', 'Simulator', 'About', 'Technologies', 'Contact'];

const TECHNOLOGIES = [
  { icon: Code2, title: 'React', desc: 'Component-based UI library for building interactive interfaces', category: 'Frontend' },
  { icon: Palette, title: 'TailwindCSS', desc: 'Utility-first CSS framework for rapid, consistent styling', category: 'Frontend' },
  { icon: Zap, title: 'Framer Motion', desc: 'Production-ready animations for smooth state transitions', category: 'Frontend' },
  { icon: BarChart3, title: 'Chart.js', desc: 'Beautiful, responsive charts for performance visualization', category: 'Visualization' },
  { icon: Terminal, title: 'TypeScript', desc: 'Type-safe development for reliable scheduling logic', category: 'Development' },
  { icon: MonitorSmartphone, title: 'Vite', desc: 'Next-gen build tool for lightning-fast development', category: 'Development' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  })
};

export default function Home() {
  const sim = useSimulation();
  const isSimulating = sim.status !== 'idle';
  const simulatorRef = useRef<HTMLDivElement>(null);
  const stateVisualizerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartSimulation = () => {
    sim.start();
    setTimeout(() => {
      stateVisualizerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'Home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary shadow-md">
                <Cpu className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="text-base font-extrabold text-foreground tracking-tight">OS Scheduler</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <button key={link} onClick={() => scrollToSection(link)}
                  className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors duration-200">
                  {link}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={scrollToSimulator} className="btn-gradient text-xs py-2 px-5 hidden sm:inline-flex">
                <Play className="w-3.5 h-3.5" /> Start Simulation
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden pb-4 space-y-1">
              {NAV_LINKS.map(link => (
                <button key={link} onClick={() => scrollToSection(link)}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition">
                  {link}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F8FAFC, #FDF2F8)' }}>
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                Interactive Learning Tool
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
                Operating System<br />
                <span className="text-primary">Process Scheduler</span>
                <br />Visualizer
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md">
                An interactive web tool that helps students understand process state transitions and CPU scheduling algorithms visually.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={scrollToSimulator} className="btn-gradient">
                  <Play className="w-4 h-4" /> Start Simulation
                </button>
                <button onClick={() => scrollToSection('About')} className="btn-outline-soft">
                  <BookOpen className="w-4 h-4" /> Explore Features
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex items-center justify-center"
            >
              <img src={heroIllustration} alt="CPU Scheduling Illustration" className="relative w-full max-w-md" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── About Section ─── */}
      <section id="about" className="py-20" style={{ background: '#F1F5F9' }}>
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">About This Project</h2>
            <div className="w-16 h-1.5 rounded-full mx-auto bg-primary" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'CPU Scheduling', desc: 'Visualize how FCFS, SJF, Round Robin, and Priority algorithms schedule processes on the CPU.' },
              { icon: ArrowRight, title: 'State Transitions', desc: 'Watch processes move through New, Ready, Running, Waiting, and Terminated states in real-time.' },
              { icon: BarChart3, title: 'Performance Metrics', desc: 'Compare average waiting time, turnaround time, CPU utilization, and throughput across algorithms.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="soft-card p-8 text-center">
                <div className="w-14 h-14 rounded-xl mx-auto mb-5 flex items-center justify-center bg-primary/20 border-2 border-primary/30">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Technologies Section ─── */}
      <section id="technologies" className="py-20">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Technologies Used</h2>
            <div className="w-16 h-1.5 rounded-full mx-auto bg-secondary" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECHNOLOGIES.map((tech, i) => (
              <motion.div key={tech.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="soft-card p-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center bg-primary/15 border-2 border-primary/25">
                  <tech.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">{tech.title}</h3>
                    <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{tech.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Simulator Section ─── */}
      <section id="simulator" ref={simulatorRef} className="py-20" style={{ background: '#F1F5F9' }}>
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Interactive Simulator</h2>
            <div className="w-16 h-1.5 rounded-full mx-auto mb-4 bg-primary" />
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">Add processes, choose an algorithm, and watch the scheduling simulation unfold step by step.</p>
          </motion.div>

          {/* Simulator Controls Bar */}
          <div className="soft-card p-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                {ALGORITHMS.map(a => (
                  <button key={a.value} onClick={() => !isSimulating && sim.setAlgorithm(a.value)} disabled={isSimulating}
                    className={`px-4 py-2 rounded-md text-xs font-extrabold transition-all duration-200 ${
                      sim.algorithm === a.value
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    } disabled:opacity-50`}>
                    {a.label}
                  </button>
                ))}
              </div>

              {sim.algorithm === 'round-robin' && (
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <span className="text-[10px] font-medium text-muted-foreground">Quantum:</span>
                  <input type="number" min={1} max={10} value={sim.quantum}
                    onChange={e => sim.setQuantum(parseInt(e.target.value) || 2)}
                    disabled={isSimulating}
                    className="w-12 bg-transparent text-sm font-mono text-foreground text-center outline-none" />
                </div>
              )}

              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <span className="text-[10px] font-medium text-muted-foreground">Speed:</span>
                <span className="text-xs font-mono font-medium text-foreground">{sim.speed}×</span>
                <input type="range" min={0.5} max={3} step={0.5} value={sim.speed}
                  onChange={e => sim.setSpeed(parseFloat(e.target.value))}
                  className="w-16 accent-primary h-1" />
              </div>

              <div className="flex-1" />

              <div className="flex items-center gap-2">
                {sim.status === 'idle' && (
                  <button onClick={handleStartSimulation} disabled={sim.processes.length === 0}
                    className="btn-gradient text-xs font-extrabold py-2.5 px-6 disabled:opacity-40">
                    <Play className="w-4 h-4" /> Start
                  </button>
                )}
                {sim.status === 'running' && (
                  <button onClick={sim.pause}
                    className="inline-flex items-center gap-1.5 bg-muted text-foreground rounded-lg px-5 py-2 text-xs font-medium hover:bg-muted/80 transition">
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </button>
                )}
                {sim.status === 'paused' && (
                  <button onClick={sim.resume} className="btn-gradient text-xs py-2 px-5">
                    <SkipForward className="w-3.5 h-3.5" /> Resume
                  </button>
                )}
                {sim.status !== 'idle' && (
                  <button onClick={sim.reset}
                    className="inline-flex items-center gap-1.5 border border-border text-muted-foreground rounded-lg px-4 py-2 text-xs font-medium hover:text-foreground hover:border-foreground/30 transition">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                )}

                <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5">
                  <div className={`w-2 h-2 rounded-full ${
                    sim.status === 'running' ? 'bg-[hsl(var(--state-running))] animate-pulse' :
                    sim.status === 'paused' ? 'bg-[hsl(var(--state-waiting))]' :
                    sim.status === 'completed' ? 'bg-primary' :
                    'bg-muted-foreground/30'
                  }`} />
                  <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase">{sim.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simulator Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="space-y-6">
              <ProcessInputPanel processes={sim.processes} onAdd={sim.addProcess} onRemove={sim.removeProcess}
                onGenerateRandom={sim.generateRandom} disabled={isSimulating} />
              <div ref={stateVisualizerRef}>
                <StateVisualizer pcbs={sim.currentPCBs} />
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-6">
              <CPUVisualizer runningProcess={sim.runningProcess} currentEvent={sim.currentEvent} />
              <PCBTable pcbs={sim.currentPCBs} />
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <GanttChart entries={sim.ganttEntries} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <Dashboard metrics={sim.metrics} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Contact Section ─── */}
      <section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="soft-card p-10 lg:p-14 text-center" style={{ background: 'linear-gradient(135deg, #F8FAFC, #FDF2F8)' }}>
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Ready to Explore?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start experimenting with different scheduling algorithms and see how they affect process management.
            </p>
            <button onClick={scrollToSimulator} className="btn-gradient text-base py-3 px-8">
              <Play className="w-5 h-5" /> Launch Simulator
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary">
              <Cpu className="w-3.5 h-3.5 text-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">OS Process Scheduler Visualizer</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for educational purposes · Operating Systems Course Project
          </p>
        </div>
      </footer>
    </div>
  );
}
