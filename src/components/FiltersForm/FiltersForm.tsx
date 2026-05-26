"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Checkbox } from "@heroui/checkbox";
import { Slider } from "@heroui/slider";
import { Input } from "@heroui/input";

import { CARS_CONFIG } from "@/src/lib/cars/client";
import { useAppliedFilters, useApplyFilters } from "@/src/stores/filtersStore";
import { useDebounce } from "@/src/hooks/useDebounce";
import styles from "./FiltersForm.module.scss";

const PRICE_MIN = 0;
const PRICE_MAX = 200_000;
const PRICE_STEP = 500;

const YEAR_MIN = 2010;
const YEAR_MAX = new Date().getFullYear() + 1;

const FormSchema = z.object({
    makes: z.array(z.enum(CARS_CONFIG.allowedMakes)),
    vehicleTypes: z.array(z.enum(["passenger", "crossover", "suv", "electric", "hybrid"])),
    priceRange: z.tuple([z.number(), z.number()]),
    yearRange: z.tuple([z.number(), z.number()]),
});

type FormValues = z.infer<typeof FormSchema>;

const MAKE_LABELS: Record<string, string> = {
    volkswagen:     "Volkswagen",
    alfa_romeo:     "Alfa Romeo",
    mercedes_benz:  "Mercedes-Benz",
    ford:           "Ford",
    dodge:          "Dodge",
};

const VEHICLE_TYPE_LABELS: Record<string, string> = {
    passenger:  "Легковые",
    crossover:  "Кроссоверы",
    suv:        "Внедорожники",
    electric:   "Электромобили",
    hybrid:     "Гибриды",
};

export function FiltersForm() {
    const applied = useAppliedFilters();
    const applyFilters = useApplyFilters();

    const { control, watch, reset } = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            makes: applied.makes ?? [],
            vehicleTypes: applied.vehicleTypes ?? [],
            priceRange: [applied.priceMin ?? PRICE_MIN, applied.priceMax ?? PRICE_MAX],
            yearRange: [applied.yearMin ?? YEAR_MIN, applied.yearMax ?? YEAR_MAX],
        },
    });

    const values = watch();
    const debounced = useDebounce(values, 400);
    const appliedRef = useRef(applied);
    appliedRef.current = applied;

    useEffect(() => {
        const next = {
            makes: debounced.makes,
            vehicleTypes: debounced.vehicleTypes,
            priceMin: debounced.priceRange[0] > PRICE_MIN ? debounced.priceRange[0] : undefined,
            priceMax: debounced.priceRange[1] < PRICE_MAX ? debounced.priceRange[1] : undefined,
            yearMin:  debounced.yearRange[0] > YEAR_MIN ? debounced.yearRange[0] : undefined,
            yearMax:  debounced.yearRange[1] < YEAR_MAX ? debounced.yearRange[1] : undefined,
        };
        if (JSON.stringify(next) !== JSON.stringify(appliedRef.current)) {
            applyFilters(next);
        }
    }, [debounced, applyFilters]);

    useEffect(() => {
        reset({
            makes: applied.makes ?? [],
            vehicleTypes: applied.vehicleTypes ?? [],
            priceRange: [applied.priceMin ?? PRICE_MIN, applied.priceMax ?? PRICE_MAX],
            yearRange: [applied.yearMin ?? YEAR_MIN, applied.yearMax ?? YEAR_MAX],
        });
    }, [applied]);

    return (
        <div className={styles.form}>
            <section className={styles.section}>
                <h4 className={styles.sectionTitle}>Стоимость авто</h4>
                <Controller
                    name="priceRange"
                    control={control}
                    render={({ field }) => (
                        <div className={styles.ranges}>
                            <div className={styles.rangeInputs}>
                                <Input
                                    label={"От"}
                                    placeholder={PRICE_MIN || "$6500"}
                                    variant={"bordered"}
                                    size={"lg"}
                                    radius={"md"}
                                    value={`$${String(field.value[0])}`}
                                    onValueChange={(v) =>
                                        field.onChange([Number(v) || PRICE_MIN, field.value[1]])
                                    }
                                />
                                <Input
                                    label={"До"}
                                    placeholder={PRICE_MIN || "$200000"}
                                    variant={"bordered"}
                                    size={"lg"}
                                    radius={"md"}
                                    value={`$${String(field.value[1])}`}
                                    onValueChange={(v) =>
                                        field.onChange([field.value[0], Number(v) || PRICE_MAX])
                                    }
                                />
                            </div>
                            <Slider
                                aria-label="Диапазон цены"
                                minValue={PRICE_MIN}
                                maxValue={PRICE_MAX}
                                color={"primary"}
                                size={"sm"}
                                step={PRICE_STEP}
                                value={field.value}
                                onChange={(v) =>
                                    field.onChange(Array.isArray(v) ? (v as [number, number]) : [v, v])
                                }
                            />
                        </div>
                    )}
                />
            </section>

            <section className={styles.section}>
                <h4 className={styles.sectionTitle}>Год выпуска</h4>
                <Controller
                    name="yearRange"
                    control={control}
                    render={({ field }) => (
                        <div className={styles.ranges}>
                            <div className={styles.rangeInputs}>
                                <Input
                                    label={"От"}
                                    placeholder={"2021"}
                                    variant={"bordered"}
                                    size={"lg"}
                                    radius={"md"}
                                    value={String(field.value[0])}
                                    onValueChange={(v) =>
                                        field.onChange([Number(v) || YEAR_MIN, field.value[1]])
                                    }
                                />
                                <Input
                                    label={"До"}
                                    placeholder={"2024"}
                                    variant={"bordered"}
                                    size={"lg"}
                                    radius={"md"}
                                    value={String(field.value[1])}
                                    onValueChange={(v) =>
                                        field.onChange([field.value[0], Number(v) || YEAR_MAX])
                                    }
                                />
                            </div>
                            <Slider
                                aria-label="Диапазон года"
                                minValue={YEAR_MIN}
                                maxValue={YEAR_MAX}
                                step={1}
                                color={"primary"}
                                size={"sm"}
                                value={field.value}
                                onChange={(v) =>
                                    field.onChange(Array.isArray(v) ? (v as [number, number]) : [v, v])
                                }
                            />
                        </div>
                    )}
                />
            </section>

            <section className={styles.sectionCheckbox}>
                <h4>Тип авто</h4>
                <Controller
                    name="vehicleTypes"
                    control={control}
                    render={({ field }) => (
                        <div className={styles.checkboxList}>
                            {Object.entries(VEHICLE_TYPE_LABELS).map(([key, label]) => (
                                <Checkbox
                                    key={key}
                                    isSelected={field.value.includes(key as never)}
                                    onValueChange={(checked) => {
                                        if (checked) {
                                            field.onChange([...field.value, key]);
                                        } else {
                                            field.onChange(field.value.filter((v) => v !== key));
                                        }
                                    }}
                                >
                                    {label}
                                </Checkbox>
                            ))}
                        </div>
                    )}
                />
            </section>

            <section className={styles.sectionCheckbox}>
                <h4>Марка авто</h4>
                <Controller
                    name="makes"
                    control={control}
                    render={({ field }) => (
                        <div className={styles.checkboxList}>
                            {CARS_CONFIG.allowedMakes.map((make) => (
                                <Checkbox
                                    key={make}
                                    isSelected={field.value.includes(make as never)}
                                    onValueChange={(checked) => {
                                        if (checked) {
                                            field.onChange([...field.value, make]);
                                        } else {
                                            field.onChange(field.value.filter((v) => v !== make));
                                        }
                                    }}
                                >
                                    {MAKE_LABELS[make] ?? make}
                                </Checkbox>
                            ))}
                        </div>
                    )}
                />
            </section>
        </div>
    );
}