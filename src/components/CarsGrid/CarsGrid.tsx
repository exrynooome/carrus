"use client";
import { useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { useCars } from "@/src/hooks/useCars";
import { useAppliedFilters } from "@/src/stores/filtersStore";
import { useCarsStore } from "@/src/stores/carsStore";
import CarCard from "../CarCard/";
import styles from "./CarsGrid.module.scss";
import GlassButton from "@/src/components/GlassButton";

export function CarsGrid() {
    const filters = useAppliedFilters();
    const cachedCars = useCarsStore((s) => s.cars);
    const setCars = useCarsStore((s) => s.setCars);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        isError,
        error,
    } = useCars(filters);

    const freshCars = data?.pages.flatMap((p) => p.cars) ?? null;
    const cars = freshCars ?? cachedCars ?? [];
    const showSpinner = isPending && cachedCars === null;

    useEffect(() => {
        if (!data) return;
        const cars = data.pages.flatMap((p) => p.cars);
        if (cars.length > 0) setCars(cars);
    }, [data, setCars]);

    if (showSpinner) {
        return (
            <div className={styles.center}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (isError && cachedCars === null) {
        return (
            <div className={styles.center}>
                <p className={styles.errorTitle}>Не удалось загрузить машины</p>
                <p className={styles.errorMessage}>{error.message}</p>
            </div>
        );
    }

    if (cars.length === 0) {
        return (
            <div className={styles.center}>
                <p className={styles.emptyTitle}>Ничего не найдено</p>
                <p className={styles.emptyMessage}>
                    Попробуйте изменить или сбросить фильтры
                </p>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.grid}>
                {cars.map((car) => (
                    <CarCard key={car.listingId} car={car} />
                ))}
            </div>

            {hasNextPage && freshCars && (
                <div className={styles.loadMoreWrapper}>
                    <GlassButton onClick={() => fetchNextPage()}>
                        {isFetchingNextPage ? "Загрузка..." : "Показать ещё"}
                    </GlassButton>
                </div>
            )}
        </div>
    );
}