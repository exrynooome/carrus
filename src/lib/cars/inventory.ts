import * as fs from "fs/promises";
import * as path from "path";
import { Car } from "./types";
import { CARS_CONFIG, AllowedMake } from "./config";
import { buildSearchUrl } from "./urlBuilder";
import { parseSearchResults } from "./parser";
import { enrichWithDrivetrain } from "./details";
import { fetchHtml } from "./http";
import { getInventory, isInventoryStale, invalidateInventoryCache, InventoryFile } from "./inventoryRead";

const INVENTORY_PATH = path.join(process.cwd(), "data", "cars-inventory.json");
const PARTIAL_PATH = path.join(process.cwd(), "data", "cars-inventory.partial.json");

interface PartialFile {
    cars: Car[];
    completedMakes: string[];
    updatedAt: string;
}

async function loadPartial(): Promise<PartialFile | null> {
    try {
        const raw = await fs.readFile(PARTIAL_PATH, "utf-8");
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

async function savePartial(cars: Car[], completedMakes: string[]): Promise<void> {
    await fs.mkdir(path.dirname(PARTIAL_PATH), { recursive: true });
    const data: PartialFile = {
        cars,
        completedMakes,
        updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(PARTIAL_PATH, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[inventory] 💾 Прогресс сохранён (${cars.length} машин)`);
}

async function clearPartial(): Promise<void> {
    try {
        await fs.unlink(PARTIAL_PATH);
    } catch {

    }
}

let rebuilding = false;

export function triggerRebuildIfStale(): void {
    if (rebuilding) return;
    rebuilding = true;

    isInventoryStale()
        .then((stale) => {
            if (!stale) {
                rebuilding = false;
                return;
            }
            console.log("[inventory] Инвентарь устарел, запускаю фоновый пересбор...");
            rebuildInventory()
                .then(() => console.log("[inventory] Фоновый пересбор завершён"))
                .catch((e) => console.error("[inventory] Ошибка фонового пересбора:", e))
                .finally(() => { rebuilding = false; });
        })
        .catch(() => { rebuilding = false; });
}

export async function rebuildInventory(): Promise<InventoryFile> {
    const startTime = Date.now();
    console.log(`[inventory] Старт полного парсинга (${CARS_CONFIG.allowedMakes.length} марок)`);
    const partial = await loadPartial();
    const allCars: Car[] = partial?.cars ?? [];
    const seenIds = new Set<string>(allCars.map((c) => c.listingId));
    const completedMakes = new Set<string>(partial?.completedMakes ?? []);

    if (partial) {
        console.log(`[inventory] Найден прогресс: ${allCars.length} машин, готовы марки: ${[...completedMakes].join(", ")}`);
    }

    for (const make of CARS_CONFIG.allowedMakes) {
        if (completedMakes.has(make)) {
            console.log(`\n[inventory] ── ${make}: пропускаем (уже спарсено) ──`);
            continue;
        }

        console.log(`\n[inventory] ── Марка: ${make} ──`);
        const carsForMake = await scrapeAllPagesForMake(make);
        const before = allCars.length;

        for (const car of carsForMake) {
            if (!seenIds.has(car.listingId)) {
                seenIds.add(car.listingId);
                allCars.push(car);
            }
        }
        console.log(`[inventory] ${make}: добавлено ${allCars.length - before} новых`);

        completedMakes.add(make);
        await savePartial(allCars, [...completedMakes]);
    }

    const file: InventoryFile = {
        builtAt: new Date().toISOString(),
        totalCars: allCars.length,
        cars: allCars,
    };

    await saveInventory(file);
    await clearPartial();
    invalidateInventoryCache();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n[inventory] Готово: ${file.totalCars} машин за ${elapsed}с`);

    return file;
}

async function scrapeAllPagesForMake(make: AllowedMake): Promise<Car[]> {
    const result: Car[] = [];
    let consecutiveFailures = 0;

    for (let page = 1; page <= CARS_CONFIG.maxPagesPerMake; page++) {
        if (page > 1) {
            const delay = randomDelay(3000, 7000);
            console.log(`[inventory]   пауза ${(delay / 1000).toFixed(1)}с...`);
            await sleep(delay);
        }

        const url = buildSearchUrl({
            makes: [make],
            vehicleTypes: [],
            page,
        });

        console.log(`[inventory]   страница ${page}...`);

        let html: string | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                html = await fetchHtml(url);
                break;
            } catch (e) {
                const msg = (e as Error).message;
                if (attempt < 2) {
                    console.warn(`[inventory]   страница ${page} попытка ${attempt + 1} упала: ${msg.slice(0, 80)}`);
                    await sleep(randomDelay(5000, 10000) * (attempt + 1));
                } else {
                    console.warn(`[inventory]   страница ${page} окончательно упала: ${msg.slice(0, 80)}`);
                }
            }
        }

        if (!html) {
            consecutiveFailures++;
            if (consecutiveFailures >= 3) {
                console.warn(`[inventory]   3 страницы подряд упали, прекращаем парсинг марки`);
                break;
            }
            continue;
        }

        consecutiveFailures = 0;

        try {
            const cars = parseSearchResults(html);

            const enriched = await enrichWithDrivetrain(cars);
            result.push(...enriched);

            if (cars.length < CARS_CONFIG.parsingPageSize) break;
        } catch (e) {
            console.warn(`[inventory]   ошибка парсинга страницы ${page}: ${(e as Error).message}`);
        }
    }

    return result;
}

function randomDelay(minMs: number, maxMs: number): number {
    return Math.floor(Math.random() * (maxMs - minMs) + minMs);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function saveInventory(file: InventoryFile): Promise<void> {
    await fs.mkdir(path.dirname(INVENTORY_PATH), { recursive: true });
    await fs.writeFile(INVENTORY_PATH, JSON.stringify(file, null, 2), "utf-8");
}