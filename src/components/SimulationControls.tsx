/**
 * SimulationControls Component
 * 
 * Now integrated into the header bar in Home.tsx.
 * This file is kept for backward compatibility but the controls
 * are rendered inline in the header.
 */
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Algorithm } from '@/lib/scheduler';
import { SimulationStatus } from '@/hooks/useSimulation';

interface Props {
  status: SimulationStatus;
  algorithm: Algorithm;
  quantum: number;
  speed: number;
  onAlgorithmChange: (alg: Algorithm) => void;
  onQuantumChange: (q: number) => void;
  onSpeedChange: (s: number) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  hasProcesses: boolean;
}

const ALGORITHMS: { value: Algorithm; label: string }[] = [
  { value: 'fcfs', label: 'FCFS' },
  { value: 'sjf', label: 'SJF' },
  { value: 'round-robin', label: 'Round Robin' },
  { value: 'priority', label: 'Priority' },
];

export default function SimulationControls({
  status, algorithm, quantum, speed,
  onAlgorithmChange, onQuantumChange, onSpeedChange,
  onStart, onPause, onResume, onReset, hasProcesses,
}: Props) {
  return null; // Controls are now in the header
}
