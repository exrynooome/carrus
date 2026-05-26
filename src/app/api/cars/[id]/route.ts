import { NextRequest, NextResponse } from "next/server";
import { getInventory } from "@/src/lib/cars/inventoryRead";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const inventory = await getInventory();

    if (!inventory) {
        return NextResponse.json({ error: "Inventory unavailable" }, { status: 503 });
    }

    const car = inventory.cars.find((c) => c.listingId === id);

    if (!car) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(car);
}
