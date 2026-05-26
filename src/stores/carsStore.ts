import { create } from "zustand";
import type { Car } from "@/src/lib/cars/types";

interface CarsState {
    cars: Car[] | null;
    fetchId: number;
    setCars: (cars: Car[]) => void;
    bumpFetchId: () => void;
}

export const useCarsStore = create<CarsState>()((set) => ({
    cars: null,
    fetchId: 0,
    setCars: (cars) => set({ cars }),
    bumpFetchId: () => set((s) => ({ fetchId: s.fetchId + 1 })),
}));