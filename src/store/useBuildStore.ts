import { create } from 'zustand';

interface HardwareItem {
  id: string;
  name: string;
  tier: number;
  baseScore: number;
  brand: string;
}

interface RamItem {
  id: string;
  size: string;
  multiplier: number;
}

interface BuildState {
  cpu: HardwareItem | null;
  gpu: HardwareItem | null;
  ram: RamItem | null;
  setCPU: (cpu: HardwareItem) => void;
  setGPU: (gpu: HardwareItem) => void;
  setRAM: (ram: RamItem) => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  cpu: null,
  gpu: null,
  ram: null,
  setCPU: (cpu) => set({ cpu }),
  setGPU: (gpu) => set({ gpu }),
  setRAM: (ram) => set({ ram }),
}));