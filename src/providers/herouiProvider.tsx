"use client";

import { HeroUIProvider } from "@heroui/system";

export function HeroProvider({ children }: { children: React.ReactNode }) {
    return <HeroUIProvider>{children}</HeroUIProvider>;
}