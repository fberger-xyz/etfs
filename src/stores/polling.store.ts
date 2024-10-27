import { create } from 'zustand'

export const usePollingStore = create<{
    interval: number
    results: unknown[]
    actions: {
        setInterval: (interval: number) => void
        addResult: (result: unknown) => void
        clearResults: () => void
    }
}>((set) => ({
    interval: 15 * 60 * 1000, // default polling interval in milliseconds
    results: [],
    actions: {
        setInterval: (interval) => set({ interval }),
        addResult: (result) => set((state) => ({ results: [...state.results, result] })),
        clearResults: () => set({ results: [] }),
    },
}))
