/**
 * OS Process Scheduler Engine
 * 
 * This module implements the core scheduling algorithms used in Operating Systems:
 * - FCFS (First Come First Served)
 * - SJF (Shortest Job First) 
 * - Round Robin (with configurable time quantum)
 * - Priority Scheduling (lower number = higher priority)
 * 
 * Each algorithm produces a sequence of simulation steps that can be
 * played back to visualize process state transitions.
 */

// === TYPES ===

/** Possible states a process can be in during its lifecycle */
export type ProcessState = 'new' | 'ready' | 'running' | 'waiting' | 'terminated' | 'suspended';

/** Scheduling algorithm options */
export type Algorithm = 'fcfs' | 'sjf' | 'round-robin' | 'priority';

/** User-defined process input */
export interface ProcessInput {
  pid: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

/** 
 * Process Control Block (PCB) - The OS data structure for each process.
 * Contains all information the OS needs to manage the process.
 */
export interface PCB {
  pid: string;
  state: ProcessState;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  waitingTime: number;
  turnaroundTime: number;
  priority: number;
  startTime: number | null;
  completionTime: number | null;
}

/** A single step in the simulation timeline */
export interface SimulationStep {
  time: number;
  runningProcess: string | null;
  pcbs: PCB[];
  event: string; // Human-readable description of what happened
  ganttEntry?: { pid: string; start: number; end: number };
}

/** Gantt chart entry showing which process ran during a time interval */
export interface GanttEntry {
  pid: string;
  start: number;
  end: number;
}

/** Performance metrics computed after simulation completes */
export interface PerformanceMetrics {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  throughput: number;
  cpuUtilization: number;
}

// === HELPER FUNCTIONS ===

/** Deep clone an array of PCBs to avoid mutation between steps */
function clonePCBs(pcbs: PCB[]): PCB[] {
  return pcbs.map(p => ({ ...p }));
}

/** Initialize PCBs from user input */
function initPCBs(processes: ProcessInput[]): PCB[] {
  return processes.map(p => ({
    pid: p.pid,
    state: 'new' as ProcessState,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    remainingTime: p.burstTime,
    waitingTime: 0,
    turnaroundTime: 0,
    priority: p.priority,
    startTime: null,
    completionTime: null,
  }));
}

// === SCHEDULING ALGORITHMS ===

/**
 * FCFS - First Come First Served
 * 
 * The simplest scheduling algorithm. Processes are executed in the order
 * they arrive. Non-preemptive: once a process starts, it runs to completion.
 * 
 * Pros: Simple, fair (no starvation)
 * Cons: Convoy effect - short processes wait behind long ones
 */
export function simulateFCFS(processes: ProcessInput[]): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const pcbs = initPCBs(processes);
  
  // Sort by arrival time (FCFS order)
  const sorted = [...pcbs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;

  // Initial state: all processes in NEW state
  steps.push({ time: 0, runningProcess: null, pcbs: clonePCBs(pcbs), event: 'Simulation started' });

  for (const proc of sorted) {
    // Advance time to when this process arrives (if CPU is idle)
    if (time < proc.arrivalTime) {
      time = proc.arrivalTime;
    }

    // Long-term scheduler: NEW → READY
    const pcb = pcbs.find(p => p.pid === proc.pid)!;
    pcb.state = 'ready';
    steps.push({ time, runningProcess: null, pcbs: clonePCBs(pcbs), event: `${pcb.pid} moved to READY (Long-term scheduler)` });

    // Short-term scheduler: READY → RUNNING (non-preemptive, runs to completion)
    pcb.state = 'running';
    pcb.startTime = time;
    steps.push({ time, runningProcess: pcb.pid, pcbs: clonePCBs(pcbs), event: `${pcb.pid} dispatched to CPU (Short-term scheduler)` });

    // Process completes: RUNNING → TERMINATED (no preemption in FCFS)
    const endTime = time + pcb.burstTime;
    pcb.state = 'terminated';
    pcb.remainingTime = 0;
    pcb.completionTime = endTime;
    pcb.turnaroundTime = endTime - pcb.arrivalTime;
    pcb.waitingTime = pcb.turnaroundTime - pcb.burstTime;

    steps.push({ 
      time: endTime, 
      runningProcess: null, 
      pcbs: clonePCBs(pcbs), 
      event: `${pcb.pid} completed execution`,
      ganttEntry: { pid: pcb.pid, start: time, end: endTime }
    });

    time = endTime;
  }

  return steps;
}

/**
 * SJF - Shortest Job First (Non-preemptive)
 * 
 * Selects the process with the smallest burst time from the ready queue.
 * Optimal for minimizing average waiting time (provably optimal for non-preemptive).
 * 
 * Pros: Minimum average waiting time
 * Cons: Starvation possible for long processes, requires burst time prediction
 */
export function simulateSJF(processes: ProcessInput[]): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const pcbs = initPCBs(processes);
  let time = 0;
  const completed: string[] = [];

  steps.push({ time: 0, runningProcess: null, pcbs: clonePCBs(pcbs), event: 'Simulation started' });

  while (completed.length < pcbs.length) {
    // Find arrived, non-completed processes and pick shortest burst
    const available = pcbs
      .filter(p => p.arrivalTime <= time && !completed.includes(p.pid))
      .sort((a, b) => a.burstTime - b.burstTime);

    if (available.length === 0) {
      time++;
      continue;
    }

    const proc = available[0];
    proc.state = 'ready';
    steps.push({ time, runningProcess: null, pcbs: clonePCBs(pcbs), event: `${proc.pid} selected (shortest burst: ${proc.burstTime})` });

    proc.state = 'running';
    proc.startTime = time;
    steps.push({ time, runningProcess: proc.pid, pcbs: clonePCBs(pcbs), event: `${proc.pid} dispatched to CPU` });

    const endTime = time + proc.burstTime;
    proc.state = 'terminated';
    proc.remainingTime = 0;
    proc.completionTime = endTime;
    proc.turnaroundTime = endTime - proc.arrivalTime;
    proc.waitingTime = proc.turnaroundTime - proc.burstTime;
    completed.push(proc.pid);

    steps.push({ 
      time: endTime, runningProcess: null, pcbs: clonePCBs(pcbs), 
      event: `${proc.pid} completed`,
      ganttEntry: { pid: proc.pid, start: time, end: endTime }
    });

    time = endTime;
  }

  return steps;
}

/**
 * Round Robin Scheduling
 * 
 * Each process gets a fixed time slice (quantum). If not finished,
 * it's preempted and placed at the back of the ready queue.
 * This is the most common algorithm in modern time-sharing systems.
 * 
 * Pros: Fair, good response time, no starvation
 * Cons: Performance depends heavily on quantum size
 *   - Too small → excessive context switches (overhead)
 *   - Too large → degrades to FCFS
 */
export function simulateRoundRobin(processes: ProcessInput[], quantum: number = 2): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const pcbs = initPCBs(processes);
  let time = 0;
  // Ready queue maintains FIFO order
  const readyQueue: string[] = [];
  const arrived = new Set<string>();
  const completed = new Set<string>();

  steps.push({ time: 0, runningProcess: null, pcbs: clonePCBs(pcbs), event: `Simulation started (quantum = ${quantum})` });

  // Add initially arrived processes
  for (const p of pcbs.filter(p => p.arrivalTime <= time).sort((a, b) => a.arrivalTime - b.arrivalTime)) {
    readyQueue.push(p.pid);
    arrived.add(p.pid);
    p.state = 'ready';
  }

  while (completed.size < pcbs.length) {
    // Check for new arrivals
    for (const p of pcbs) {
      if (p.arrivalTime <= time && !arrived.has(p.pid)) {
        readyQueue.push(p.pid);
        arrived.add(p.pid);
        p.state = 'ready';
        steps.push({ time, runningProcess: null, pcbs: clonePCBs(pcbs), event: `${p.pid} arrived and added to READY queue` });
      }
    }

    if (readyQueue.length === 0) {
      time++;
      continue;
    }

    // Dequeue next process
    const pid = readyQueue.shift()!;
    const proc = pcbs.find(p => p.pid === pid)!;

    proc.state = 'running';
    if (proc.startTime === null) proc.startTime = time;
    steps.push({ time, runningProcess: proc.pid, pcbs: clonePCBs(pcbs), event: `${proc.pid} dispatched (remaining: ${proc.remainingTime})` });

    // Execute for min(quantum, remainingTime)
    const execTime = Math.min(quantum, proc.remainingTime);
    proc.remainingTime -= execTime;
    const endTime = time + execTime;

    // Check for arrivals during this quantum
    for (const p of pcbs) {
      if (p.arrivalTime > time && p.arrivalTime <= endTime && !arrived.has(p.pid)) {
        arrived.add(p.pid);
        readyQueue.push(p.pid);
        p.state = 'ready';
      }
    }

    if (proc.remainingTime === 0) {
      proc.state = 'terminated';
      proc.completionTime = endTime;
      proc.turnaroundTime = endTime - proc.arrivalTime;
      proc.waitingTime = proc.turnaroundTime - proc.burstTime;
      completed.add(proc.pid);
      steps.push({ 
        time: endTime, runningProcess: null, pcbs: clonePCBs(pcbs), 
        event: `${proc.pid} completed`,
        ganttEntry: { pid: proc.pid, start: time, end: endTime }
      });
    } else {
      // Preempted: back to ready queue (context switch)
      proc.state = 'ready';
      readyQueue.push(proc.pid);
      steps.push({ 
        time: endTime, runningProcess: null, pcbs: clonePCBs(pcbs), 
        event: `${proc.pid} preempted (context switch), remaining: ${proc.remainingTime}`,
        ganttEntry: { pid: proc.pid, start: time, end: endTime }
      });
    }

    // Update waiting times for processes in ready queue
    for (const waitPid of readyQueue) {
      if (waitPid !== proc.pid) {
        const wp = pcbs.find(p => p.pid === waitPid)!;
        if (wp.state !== 'terminated') {
          wp.waitingTime += execTime;
        }
      }
    }

    time = endTime;
  }

  return steps;
}

/**
 * Priority Scheduling (Non-preemptive)
 * 
 * Each process has a priority value. The process with the highest priority
 * (lowest number) is selected next. Ties broken by arrival time.
 * 
 * Pros: Important processes run first
 * Cons: Starvation of low-priority processes (can be solved with aging)
 */
export function simulatePriority(processes: ProcessInput[]): SimulationStep[] {
  const steps: SimulationStep[] = [];
  const pcbs = initPCBs(processes);
  let time = 0;
  const completed: string[] = [];

  steps.push({ time: 0, runningProcess: null, pcbs: clonePCBs(pcbs), event: 'Simulation started (Priority scheduling)' });

  while (completed.length < pcbs.length) {
    // Find arrived processes sorted by priority (lower = higher priority)
    const available = pcbs
      .filter(p => p.arrivalTime <= time && !completed.includes(p.pid))
      .sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);

    if (available.length === 0) {
      time++;
      continue;
    }

    const proc = available[0];
    proc.state = 'ready';
    steps.push({ time, runningProcess: null, pcbs: clonePCBs(pcbs), event: `${proc.pid} selected (priority: ${proc.priority})` });

    proc.state = 'running';
    proc.startTime = time;
    steps.push({ time, runningProcess: proc.pid, pcbs: clonePCBs(pcbs), event: `${proc.pid} dispatched to CPU` });

    const endTime = time + proc.burstTime;
    proc.state = 'terminated';
    proc.remainingTime = 0;
    proc.completionTime = endTime;
    proc.turnaroundTime = endTime - proc.arrivalTime;
    proc.waitingTime = proc.turnaroundTime - proc.burstTime;
    completed.push(proc.pid);

    steps.push({ 
      time: endTime, runningProcess: null, pcbs: clonePCBs(pcbs), 
      event: `${proc.pid} completed`,
      ganttEntry: { pid: proc.pid, start: time, end: endTime }
    });

    time = endTime;
  }

  return steps;
}

// === MAIN SIMULATION RUNNER ===

/**
 * Runs the selected scheduling algorithm and returns all simulation steps.
 * This is the main entry point for the simulation engine.
 */
export function runSimulation(
  processes: ProcessInput[],
  algorithm: Algorithm,
  quantum: number = 2
): SimulationStep[] {
  switch (algorithm) {
    case 'fcfs': return simulateFCFS(processes);
    case 'sjf': return simulateSJF(processes);
    case 'round-robin': return simulateRoundRobin(processes, quantum);
    case 'priority': return simulatePriority(processes);
    default: return simulateFCFS(processes);
  }
}

/**
 * Computes performance metrics from completed simulation steps.
 * Called after simulation to display dashboard statistics.
 */
export function computeMetrics(steps: SimulationStep[]): PerformanceMetrics {
  if (steps.length === 0) return { avgWaitingTime: 0, avgTurnaroundTime: 0, throughput: 0, cpuUtilization: 0 };

  const finalStep = steps[steps.length - 1];
  const pcbs = finalStep.pcbs.filter(p => p.state === 'terminated');
  
  if (pcbs.length === 0) return { avgWaitingTime: 0, avgTurnaroundTime: 0, throughput: 0, cpuUtilization: 0 };

  const totalTime = finalStep.time || 1;
  const totalBurst = pcbs.reduce((sum, p) => sum + p.burstTime, 0);

  return {
    avgWaitingTime: pcbs.reduce((sum, p) => sum + p.waitingTime, 0) / pcbs.length,
    avgTurnaroundTime: pcbs.reduce((sum, p) => sum + p.turnaroundTime, 0) / pcbs.length,
    throughput: pcbs.length / totalTime,
    cpuUtilization: (totalBurst / totalTime) * 100,
  };
}

/**
 * Extract Gantt chart entries from simulation steps.
 */
export function extractGanttEntries(steps: SimulationStep[]): GanttEntry[] {
  return steps.filter(s => s.ganttEntry).map(s => s.ganttEntry!);
}
