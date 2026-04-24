/**
 * Custom React hook that manages the simulation state machine.
 * Handles play/pause/reset controls and step-by-step progression.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ProcessInput, Algorithm, SimulationStep, PCB, GanttEntry,
  PerformanceMetrics, runSimulation, computeMetrics, extractGanttEntries
} from '@/lib/scheduler';

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed';

export function useSimulation() {
  // Process input management
  const [processes, setProcesses] = useState<ProcessInput[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>('fcfs');
  const [quantum, setQuantum] = useState(2);
  
  // Simulation state
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [speed, setSpeed] = useState(1); // 0.5x to 3x
  
  // Derived state
  const [currentPCBs, setCurrentPCBs] = useState<PCB[]>([]);
  const [runningProcess, setRunningProcess] = useState<string | null>(null);
  const [ganttEntries, setGanttEntries] = useState<GanttEntry[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [currentEvent, setCurrentEvent] = useState('');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Add a new process to the input list */
  const addProcess = useCallback((process: ProcessInput) => {
    setProcesses(prev => [...prev, process]);
  }, []);

  /** Remove a process by PID */
  const removeProcess = useCallback((pid: string) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  }, []);

  /** Generate random processes for quick testing */
  const generateRandom = useCallback((count: number = 5) => {
    const randomProcesses: ProcessInput[] = Array.from({ length: count }, (_, i) => ({
      pid: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * 8),
      burstTime: Math.floor(Math.random() * 8) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
    }));
    setProcesses(randomProcesses);
  }, []);

  /** Advance simulation by one step */
  const advanceStep = useCallback(() => {
    setCurrentStepIndex(prev => {
      const nextIndex = prev + 1;
      if (nextIndex >= steps.length) {
        // Simulation complete
        setStatus('completed');
        if (timerRef.current) clearInterval(timerRef.current);
        setMetrics(computeMetrics(steps));
        return prev;
      }
      
      const step = steps[nextIndex];
      setCurrentPCBs(step.pcbs);
      setRunningProcess(step.runningProcess);
      setCurrentEvent(step.event);
      
      // Accumulate gantt entries
      if (step.ganttEntry) {
        setGanttEntries(prev => [...prev, step.ganttEntry!]);
      }
      
      return nextIndex;
    });
  }, [steps]);

  /** Start the simulation */
  const start = useCallback(() => {
    if (processes.length === 0) return;
    
    const simulationSteps = runSimulation(processes, algorithm, quantum);
    setSteps(simulationSteps);
    setCurrentStepIndex(0);
    setGanttEntries([]);
    setMetrics(null);
    
    if (simulationSteps.length > 0) {
      setCurrentPCBs(simulationSteps[0].pcbs);
      setRunningProcess(simulationSteps[0].runningProcess);
      setCurrentEvent(simulationSteps[0].event);
    }
    
    setStatus('running');
  }, [processes, algorithm, quantum]);

  /** Pause the simulation */
  const pause = useCallback(() => {
    setStatus('paused');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  /** Resume the simulation */
  const resume = useCallback(() => {
    setStatus('running');
  }, []);

  /** Reset everything */
  const reset = useCallback(() => {
    setStatus('idle');
    setSteps([]);
    setCurrentStepIndex(0);
    setCurrentPCBs([]);
    setRunningProcess(null);
    setGanttEntries([]);
    setMetrics(null);
    setCurrentEvent('');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Timer effect: auto-advance steps when running
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        advanceStep();
      }, 1000 / speed);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, speed, advanceStep]);

  return {
    // Process management
    processes, addProcess, removeProcess, generateRandom, setProcesses,
    // Algorithm selection
    algorithm, setAlgorithm, quantum, setQuantum,
    // Simulation controls
    start, pause, resume, reset, status,
    speed, setSpeed,
    // Simulation state
    currentPCBs, runningProcess, ganttEntries, metrics,
    currentEvent, currentStepIndex, steps,
  };
}
