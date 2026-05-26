import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CarsFilters } from "@/src/lib/cars/types";

export type AppliedFilters = Omit<Partial<CarsFilters>, "page">;

export type FilterKey =
    | "price"
    | "year"
    | `make:${string}`
    | `vehicleType:${string}`;

interface FiltersState {
    filters: AppliedFilters;
    applyFilters: (filters: AppliedFilters) => void;
    removeFilter: (key: FilterKey) => void;
    resetFilters: () => void;
}

const INITIAL_FILTERS: AppliedFilters = {
    makes: [],
    vehicleTypes: [],
};

export const useFiltersStore = create<FiltersState>()(
    persist(
        (set) => ({
            filters: INITIAL_FILTERS,

            applyFilters: (filters) => set({ filters }),

            removeFilter: (key) =>
                set((state) => {
                    const f = { ...state.filters };
                    if (key === "price") {
                        delete f.priceMin;
                        delete f.priceMax;
                    } else if (key === "year") {
                        delete f.yearMin;
                        delete f.yearMax;
                    } else if (key.startsWith("make:")) {
                        const make = key.slice(5);
                        f.makes = (f.makes ?? []).filter((m) => m !== make);
                    } else if (key.startsWith("vehicleType:")) {
                        const type = key.slice(12);
                        f.vehicleTypes = (f.vehicleTypes ?? []).filter((t) => t !== type);
                    }
                    return { filters: f };
                }),

            resetFilters: () => set({ filters: INITIAL_FILTERS }),
        }),
        { name: "cars-filters", version: 1 }
    )
);

export const useAppliedFilters = () => useFiltersStore((s) => s.filters);
export const useApplyFilters = () => useFiltersStore((s) => s.applyFilters);
export const useRemoveFilter = () => useFiltersStore((s) => s.removeFilter);
export const useResetFilters = () => useFiltersStore((s) => s.resetFilters);