import { Car } from "./types";
import { fetchHtml } from "./http";

const CONCURRENCY = 3;

export async function enrichWithDrivetrain(cars: Car[]): Promise<Car[]> {
    const enriched: Car[] = [];

    for (let i = 0; i < cars.length; i += CONCURRENCY) {
        if (i > 0) {
            await new Promise((r) => setTimeout(r, 1500 + Math.random() * 2000));
        }

        const batch = cars.slice(i, i + CONCURRENCY);
        const results = await Promise.all(
            batch.map(async (car) => {
                try {
                    const html = await fetchWithRetry(car.detailUrl, 2);
                    return { ...car, drivetrain: extractDrivetrain(html) };
                } catch (e) {
                    console.warn(`Привод для ${car.listingId}: ${(e as Error).message}`);
                    return car;
                }
            })
        );
        enriched.push(...results);
    }

    return enriched;
}

async function fetchWithRetry(url: string, retries: number): Promise<string> {
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fetchHtml(url);
        } catch (e) {
            lastError = e as Error;
            if (attempt < retries) {
                await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
            }
        }
    }
    throw lastError!;
}

function extractDrivetrain(html: string): string | null {
    const powerTrainMatch = html.match(
        /power-train[\s\S]{0,200}?(All-wheel|Front-wheel|Rear-wheel|Four-wheel)\s+Drive/i
    );
    if (powerTrainMatch) {
        return normalizeDrivetrain(powerTrainMatch[1] + "-wheel");
    }

    const jsonMatch = html.match(/"drivetrain"\s*:\s*"([^"]+)"/i);
    if (jsonMatch) {
        return normalizeDrivetrain(jsonMatch[1]);
    }

    return null;
}

function normalizeDrivetrain(raw: string): string {
    const v = raw.toLowerCase().trim();
    if (v.includes("all") || v === "awd") return "AWD";
    if (v.includes("front") || v === "fwd") return "FWD";
    if (v.includes("rear") || v === "rwd") return "RWD";
    if (v.includes("four") || v === "4wd") return "4WD";
    return raw;
}