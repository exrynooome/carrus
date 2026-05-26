import * as fs from "fs/promises";
import * as path from "path";
import { Car } from "./types";
import { CARS_CONFIG } from "./config";

const INVENTORY_PATH = path.join(process.cwd(), "data", "cars-inventory.json");

export interface InventoryFile {
    builtAt: string;
    totalCars: number;
    cars: Car[];
}

let inventoryCache: InventoryFile | null = null;

export async function getInventory(): Promise<InventoryFile | null> {
    if (inventoryCache) return inventoryCache;

    try {
        const raw = await fs.readFile(INVENTORY_PATH, "utf-8");
        inventoryCache = JSON.parse(raw) as InventoryFile;
        return inventoryCache;
    } catch {
        return null;
    }
}

export async function isInventoryStale(): Promise<boolean> {
    const inv = await getInventory();
    if (!inv) return true;
    const age = Date.now() - new Date(inv.builtAt).getTime();
    return age > CARS_CONFIG.rebuildInterval;
}

export function invalidateInventoryCache(): void {
    inventoryCache = null;
}