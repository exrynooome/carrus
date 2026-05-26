export const CARS_CONFIG = {
    zip: "60606",
    maxDistance: 9999,

    // Реальное количество карточек на странице cars.com (по дефолту)
    parsingPageSize: 24,

    // Сколько карточек рендерить на странице /catalog
    uiPageSize: 12,

    baseUrl: "https://www.cars.com/shopping/results/",

    // Раз в какое время парсить
    rebuildInterval: 1 * 24 * 60 * 60 * 1000, // 7 дней

    // Сколько параллельных запросов к cars.com одновременно
    concurrency: 3,

    // Максимум страниц на одну марку (50 × 25 = до 1250 машин на марку)
    maxPagesPerMake: 50,

    // ──────────────────────────────────────────────────────────────────────

    // Разрешённые марки. Чтобы добавить новую — просто допиши строку.
    allowedMakes: [
        "volkswagen",
        "alfa_romeo",
        "mercedes_benz",
        "ford",
        "dodge",
    ] as const,

    // Фильтры по типу кузова
    bodyStyleMap: {
        passenger:  ["Sedan", "Coupe", "Hatchback", "Convertible", "Wagon"],
        crossover:  ["Crossover"],
        suv:        ["SUV"],
    } as const,

    // Фильтры по типу топлива
    fuelTypeMap: {
        electric: "Electric",
        hybrid:   "Hybrid",
    } as const,
} as const;

export type AllowedMake = typeof CARS_CONFIG.allowedMakes[number];
export type BodyStyleKey = keyof typeof CARS_CONFIG.bodyStyleMap;
export type FuelTypeKey = keyof typeof CARS_CONFIG.fuelTypeMap;
