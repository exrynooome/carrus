import { CARS_CONFIG } from "./config";
import { CarsFilters } from "./types";

export function buildSearchUrl(filters: CarsFilters): string {
    const url = new URL(CARS_CONFIG.baseUrl);
    const params = url.searchParams;

    params.set("zip", CARS_CONFIG.zip);
    params.set("maximum_distance", String(CARS_CONFIG.maxDistance));
    params.set("sort", "best_match_desc");
    params.set("page", String(filters.page));

    for (const make of filters.makes) {
        params.append("makes[]", make);
    }

    const bodyStyles: string[] = [];
    const fuelTypes: string[] = [];

    for (const type of filters.vehicleTypes) {
        if (type === "electric" || type === "hybrid") {
            fuelTypes.push(CARS_CONFIG.fuelTypeMap[type]);
        } else {
            bodyStyles.push(...CARS_CONFIG.bodyStyleMap[type]);
        }
    }

    for (const style of bodyStyles) {
        params.append("body_style_slugs[]", style.toLowerCase());
    }
    for (const fuel of fuelTypes) {
        params.append("fuel_slugs[]", fuel.toLowerCase());
    }

    if (filters.priceMin !== undefined) params.set("list_price_min", String(filters.priceMin));
    if (filters.priceMax !== undefined) params.set("list_price_max", String(filters.priceMax));

    if (filters.yearMin !== undefined) params.set("year_min", String(filters.yearMin));
    if (filters.yearMax !== undefined) params.set("year_max", String(filters.yearMax));

    return url.toString();
}