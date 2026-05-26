import { NextRequest, NextResponse } from "next/server";
import { queryInventory, CarsFiltersSchema } from "@/src/lib/cars";
import { triggerRebuildIfStale } from "@/src/lib/cars/inventory";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;

    const raw = {
        makes: params.get("makes")?.split(",").filter(Boolean) ?? [],
        vehicleTypes: params.get("vehicleTypes")?.split(",").filter(Boolean) ?? [],
        priceMin: parseOptionalNumber(params.get("priceMin")),
        priceMax: parseOptionalNumber(params.get("priceMax")),
        yearMin: parseOptionalNumber(params.get("yearMin")),
        yearMax: parseOptionalNumber(params.get("yearMax")),
        page: parseOptionalNumber(params.get("page")) ?? 1,
    };

    const parsed = CarsFiltersSchema.safeParse(raw);
    if (!parsed.success) {
        return NextResponse.json(
            {
                ok: false,
                error: "Неверные параметры запроса",
                details: parsed.error.flatten(),
            },
            { status: 400 }
        );
    }

    try {
        const result = await queryInventory(parsed.data);
        triggerRebuildIfStale();
        return NextResponse.json({ ok: true, ...result });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Внутренняя ошибка";
        console.error("[api/cars]", err);
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

function parseOptionalNumber(value: string | null): number | undefined {
    if (!value) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
}