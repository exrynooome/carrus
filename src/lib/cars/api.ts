import { CarsFilters, CarsSearchResult } from "@/src/lib/cars/types";

export interface CarsApiResponse extends CarsSearchResult {
    ok: true;
}

interface CarsApiError {
    ok: false;
    error: string;
}

function buildQueryString(filters: Partial<CarsFilters>): string {
    const params = new URLSearchParams();

    if (filters.makes && filters.makes.length > 0) {
        params.set("makes", filters.makes.join(","));
    }
    if (filters.vehicleTypes && filters.vehicleTypes.length > 0) {
        params.set("vehicleTypes", filters.vehicleTypes.join(","));
    }
    if (filters.priceMin !== undefined) params.set("priceMin", String(filters.priceMin));
    if (filters.priceMax !== undefined) params.set("priceMax", String(filters.priceMax));
    if (filters.yearMin !== undefined) params.set("yearMin", String(filters.yearMin));
    if (filters.yearMax !== undefined) params.set("yearMax", String(filters.yearMax));
    if (filters.page !== undefined) params.set("page", String(filters.page));

    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

export async function fetchCars(filters: Partial<CarsFilters>): Promise<CarsSearchResult> {
    const url = `/api/cars${buildQueryString(filters)}`;
    const res = await fetch(url);
    const data: CarsApiResponse | CarsApiError = await res.json();

    if (!data.ok) {
        throw new Error(data.error);
    }

    return {
        cars: data.cars,
        hasMore: data.hasMore,
        totalOnPage: data.totalOnPage,
        page: data.page,
    };
}