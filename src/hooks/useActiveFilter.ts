import { useAppliedFilters } from "@/src/stores/filtersStore";
import { ActiveFilter } from "@/src/components/ActiveFilter/ActiveFilter";

const MAKE_LABELS: Record<string, string> = {
    volkswagen: "Volkswagen",
    alfa_romeo: "Alfa Romeo",
    mercedes_benz: "Mercedes-Benz",
    ford: "Ford",
    dodge: "Dodge",
};

const VEHICLE_TYPE_LABELS: Record<string, string> = {
    passenger: "Легковые",
    crossover: "Кроссоверы",
    suv: "Внедорожники",
    electric: "Электромобили",
    hybrid: "Гибриды",
};

export function useActiveFilters(): ActiveFilter[] {
    const filters = useAppliedFilters();
    const chips: ActiveFilter[] = [];

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        const min = filters.priceMin !== undefined ? `$${filters.priceMin.toLocaleString()}` : "";
        const max = filters.priceMax !== undefined ? `$${filters.priceMax.toLocaleString()}` : "";
        const label = min && max ? `Стоимость: ${min} – ${max}` : min ? `Стоимость: от ${min}` : `Стоимость: до ${max}`;
        chips.push({ key: "price", label });
    }

    if (filters.yearMin !== undefined || filters.yearMax !== undefined) {
        const min = filters.yearMin ?? "";
        const max = filters.yearMax ?? "";
        const label = min && max ? `Год: ${min}–${max}` : min ? `Год: от ${min}` : `Год: до ${max}`;
        chips.push({ key: "year", label });
    }

    for (const type of filters.vehicleTypes ?? []) {
        chips.push({ key: `vehicleType:${type}`, label: VEHICLE_TYPE_LABELS[type] ?? type });
    }

    for (const make of filters.makes ?? []) {
        chips.push({ key: `make:${make}`, label: `Марка: ${MAKE_LABELS[make] ?? make}` });
    }

    return chips;
}