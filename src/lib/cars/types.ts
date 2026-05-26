import { z } from "zod";
import { CARS_CONFIG } from "./config";

export const CarsFiltersSchema = z.object({
    makes: z.array(z.enum(CARS_CONFIG.allowedMakes)).default([]),
    vehicleTypes: z.array(
        z.enum(["passenger", "crossover", "suv", "electric", "hybrid"])
    ).default([]),
    priceMin: z.number().int().nonnegative().optional(),
    priceMax: z.number().int().nonnegative().optional(),
    yearMin: z.number().int().min(1990).optional(),
    yearMax: z.number().int().max(new Date().getFullYear() + 1).optional(),
    page: z.number().int().positive().default(1),
});

export type CarsFilters = z.infer<typeof CarsFiltersSchema>;
export type VehicleType = CarsFilters["vehicleTypes"][number];

export interface Car {
    listingId: string;
    make: string;
    model: string;
    trim: string;
    year: number;
    price: number;
    mileage: number;
    vin: string;
    bodyStyle: string;
    fuelType: string;
    stockType: "Used" | "New" | "CPO";
    color: string | null;
    drivetrain: string | null;
    thumbnail: string;
    detailUrl: string;
}

export interface CarsSearchResult {
    cars: Car[];
    hasMore: boolean;
    totalOnPage: number;
    page: number;
}