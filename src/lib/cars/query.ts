import { Car, CarsFilters, CarsSearchResult } from "./types";
import { CARS_CONFIG } from "./config";
import { getInventory } from "./inventoryRead";

export async function queryInventory(filters: CarsFilters): Promise<CarsSearchResult> {
    const inventory = await getInventory();

    if (!inventory) {
        return { cars: [], hasMore: false, totalOnPage: 0, page: filters.page };
    }

    const filtered = inventory.cars.filter((car) => matchesFilters(car, filters));

    const start = (filters.page - 1) * CARS_CONFIG.uiPageSize;
    const end = start + CARS_CONFIG.uiPageSize;
    const pageCars = filtered.slice(start, end);

    return {
        cars: pageCars,
        hasMore: end < filtered.length,
        totalOnPage: pageCars.length,
        page: filters.page,
    };
}

function matchesFilters(car: Car, filters: CarsFilters): boolean {
    if (filters.makes.length > 0) {
        const carMakeSlug = normalizeMake(car.make);
        if (!filters.makes.includes(carMakeSlug as never)) return false;
    }

    if (filters.vehicleTypes.length > 0) {
        const matchesType = filters.vehicleTypes.some((type) => {
            if (type === "electric") return car.fuelType === "Electric";
            if (type === "hybrid") return car.fuelType === "Hybrid";
            const styles = CARS_CONFIG.bodyStyleMap[type] as readonly string[];
            return styles.includes(car.bodyStyle);
        });
        if (!matchesType) return false;
    }

    if (filters.priceMin !== undefined && car.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && car.price > filters.priceMax) return false;

    if (filters.yearMin !== undefined && car.year < filters.yearMin) return false;
    if (filters.yearMax !== undefined && car.year > filters.yearMax) return false;

    return true;
}

function normalizeMake(make: string): string {
    return make.toLowerCase().replace(/[\s-]+/g, "_");
}