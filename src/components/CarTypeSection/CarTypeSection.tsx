"use client";

import { useRouter } from "next/navigation";
import { CarTypeCard } from "@/src/components/CarTypeSection/internal/CarTypeCard";
import { useApplyFilters } from "@/src/stores/filtersStore";
import type { AppliedFilters } from "@/src/stores/filtersStore";
import styles from "./CarTypeSection.module.scss";

const types: { image: string; label: string; filter: AppliedFilters }[] = [
    { image: "/bgs/passengers.png", label: "Легковые",     filter: { vehicleTypes: ["passenger"],  makes: [] } },
    { image: "/bgs/crossovers.png", label: "Кроссоверы",   filter: { vehicleTypes: ["crossover"],  makes: [] } },
    { image: "/bgs/suv.png",        label: "Внедорожники", filter: { vehicleTypes: ["suv"],         makes: [] } },
    { image: "/bgs/electro.png",    label: "Электромобили", filter: { vehicleTypes: ["electric"],  makes: [] } },
    { image: "/bgs/hybrid.png",     label: "Гибриды",      filter: { vehicleTypes: ["hybrid"],     makes: [] } },
    { image: "/bgs/premium.png",    label: "Премиум-авто", filter: { vehicleTypes: [],             makes: ["mercedes_benz", "alfa_romeo"] } },
];

export function CarTypeSection() {
    const router = useRouter();
    const applyFilters = useApplyFilters();

    const handleSelect = (filter: AppliedFilters) => {
        applyFilters(filter);
        router.push("/catalog");
    };

    return (
        <div className={styles.grid}>
            {types.map((type) => (
                <CarTypeCard
                    key={type.label}
                    image={type.image}
                    label={type.label}
                    onClick={() => handleSelect(type.filter)}
                />
            ))}
        </div>
    );
}