interface UseTimedFlowOptions {
  /** Number of steps to cycle through (e.g. slides length) */
  steps: number;
  /** Delay for each step in milliseconds (default 2000) */
  delay?: number;
  /** Start automatically? (default true) */
  autoStart?: boolean;
  /** Loop when last step reached? (default false) */
  loop?: boolean;
  /** Optional callback when step changes */
  onStepChange?: (step: number) => void;
}

interface UseTimedFlowReturn {
  current: number;
  running: boolean;
  pause: () => void;
  resume: () => void;
  reset: (to?: number) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

interface UseTimedFlowProps {
  steps: number;
  delay: number; // ms
  autoStart?: boolean;
  loop?: boolean;
  onStepChange?: (current: number) => void;
}
