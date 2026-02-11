import { create } from 'zustand'

interface AgentState {
    isStarted: boolean;
    setIsStarted: (value: boolean) => void
}

export const AgentStore = create<AgentState>((set) => ({
    isStarted: false,
    setIsStarted: (value) => set({ isStarted: value })
}))