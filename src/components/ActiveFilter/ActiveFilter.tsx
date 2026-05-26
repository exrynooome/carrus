"use client";

import { Button } from "@heroui/button";
import styles from "./ActiveFilter.module.scss";
import {useActiveFilters} from "@/src/hooks/useActiveFilter";
import {FilterKey, useRemoveFilter} from "@/src/stores/filtersStore";

export interface ActiveFilter {
    key: string;
    label: string;
}

interface Props {
    filters: ActiveFilter[];
    onRemove: (key: string) => void;
}

function ActiveFilters({ filters, onRemove }: Props) {
    if (filters.length === 0) return null;

    return (
        <div className={styles.wrapper}>
            {filters.map((f) => (
                <Button
                    key={f.key}
                    variant="flat"
                    color="default"
                    size="md"
                    radius="md"
                    onPress={() => onRemove(f.key)}
                    endContent={<CloseIcon />}
                >
                    {f.label}
                </Button>
            ))}
        </div>
    );
}

function CloseIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_135_716)">
                <circle cx="10.0001" cy="10.0001" r="8.33333" stroke="white" strokeWidth="1.5"/>
                <path d="M12.0834 7.91676L7.91675 12.0834M7.91673 7.91675L12.0834 12.0834" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
            <defs>
                <clipPath id="clip0_135_716">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
        </svg>

    );
}

export default function ActiveFiltersBar() {
    const chips = useActiveFilters();
    const removeFilter = useRemoveFilter();

    return (
        <ActiveFilters
            filters={chips}
            onRemove={(key) => removeFilter(key as FilterKey)}
        />
    );
}