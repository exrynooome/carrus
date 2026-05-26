import { Car } from "./types";

interface RawVehicleDetails {
    listingId: string;
    make: string;
    model: string;
    trim: string;
    year: string;
    price: string;
    mileage: string;
    vin: string;
    bodyStyle: string;
    fuelType: string;
    stockType: string;
    cpoIndicator: boolean;
    primaryThumbnail: string;
}

export function parseSearchResults(html: string): Car[] {
    const cars: Car[] = [];

    const cardPattern = /<fuse-card\s[^>]*data-vehicle-details="([^"]+)"[\s\S]*?<\/fuse-card>/g;

    let match: RegExpExecArray | null;
    while ((match = cardPattern.exec(html)) !== null) {
        const [fullCard, encodedJson] = match;

        try {
            const json = decodeHtmlEntities(encodedJson);
            const raw = JSON.parse(json) as RawVehicleDetails;
            const color = extractColorFromCard(fullCard, raw.year);

            cars.push({
                listingId: raw.listingId,
                make: raw.make,
                model: raw.model,
                trim: raw.trim,
                year: parseInt(raw.year, 10),
                price: parseInt(raw.price, 10) || 0,
                mileage: parseInt(raw.mileage, 10) || 0,
                vin: raw.vin,
                bodyStyle: raw.bodyStyle,
                fuelType: raw.fuelType,
                stockType: raw.cpoIndicator ? "CPO" : (raw.stockType as Car["stockType"]),
                color,
                drivetrain: null,
                thumbnail: raw.primaryThumbnail,
                detailUrl: `https://www.cars.com/vehicledetail/${raw.listingId}/`,
            });
        } catch (e) {
            console.warn("Не удалось распарсить карточку:", (e as Error).message);
        }
    }

    return cars;
}

function decodeHtmlEntities(str: string): string {
    return str
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'");
}

function extractColorFromCard(cardHtml: string, year: string): string | null {
    const imgMatch = cardHtml.match(/<img[^>]*\salt="([^"]+)"/);
    if (!imgMatch) return null;

    const alt = imgMatch[1];
    const yearIdx = alt.indexOf(year);
    if (yearIdx <= 0) return null;

    return alt.slice(0, yearIdx).trim() || null;
}