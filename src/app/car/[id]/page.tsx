import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/src/components/Container";
import { getInventory } from "@/src/lib/cars/inventoryRead";
import { CarBreadcrumbs } from "./CarBreadcrumbs";
import styles from "./page.module.scss";
import GraySection from "@/src/components/GraySection";

const STOCK_LABELS: Record<string, string> = {
    Used: "С пробегом",
    New:  "Новый",
    CPO:  "Сертифицированный",
};

const FUEL_LABELS: Record<string, string> = {
    Gasoline: "Бензин",
    Diesel:   "Дизель",
    Electric: "Электро",
    Hybrid:   "Гибрид",
};

const DRIVETRAIN: Record<string, string> = {
    RWD: "Задний",
    AWD:   "Полный",
    FWD: "Передний",
    "4WD": "Полный",
};

interface Props {
    params: Promise<{ id: string }>;
}

function Check() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 13.4L9.71429 17L19 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default async function CarPage({ params }: Props) {
    const { id } = await params;
    const inventory = await getInventory();
    const car = inventory?.cars.find((c) => c.listingId === id);

    if (!car) notFound();

    const fmtPrice   = (n: number) => `$${n.toLocaleString("en-US")}`;
    const fmtMileage = (n: number) => `${n.toLocaleString("ru-RU")} км`;

    const specs: { label: string; value: string | null | undefined }[] = [
        { label: "Состояние",   value: STOCK_LABELS[car.stockType] ?? car.stockType },
        { label: "Привод",      value: car.drivetrain == null ? "-" : DRIVETRAIN[car.drivetrain] },
        { label: "Пробег",      value: fmtMileage(car.mileage) },
        { label: "WIN номер",   value: car.vin },
        { label: "Год выпуска",         value: String(car.year) },
        { label: "Цвет кузова",        value: car.color },
        { label: "Тип авто",       value: car.bodyStyle },
        { label: "Тип топлива", value: FUEL_LABELS[car.fuelType] ?? car.fuelType },
        { label: "Марка авто", value: car.make },
    ];

    const advantages: { label: string }[] = [
        { label: "Официальный договор и гарантия" },
        { label: "Прозрачный расчет всех расходов" },
        { label: "Персональный менеджер 24/7" },
        { label: "Доставка под ключ от 1 месяца" },
    ]

    return (
        <main>
            <Container>
                <div className={styles.page}>
                    <CarBreadcrumbs id={id} make={car.make} model={car.model} />

                    <div className={styles.content}>
                        <div className={styles.left_block}>
                            <div className={styles.image}>
                                <Image
                                    src={car.thumbnail}
                                    className={styles.image}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    sizes="930px, 100%"
                                />
                            </div>
                            <GraySection href={"#order"} variant={"sm"} buttonText={"Получить консультацию"} title={`от ${fmtPrice(car.price)}`} />
                        </div>

                        <div className={styles.info}>
                            <h2>{car.make} {car.model}</h2>
                            <div className={styles.columns}>
                                <div className={styles.specs}>
                                    <p className={`text_24 medium`}>Характеристики</p>
                                    {specs.filter((s) => s.value).map((s) => (
                                        <div key={s.label} className={styles.specRow}>
                                            <h4 className={styles.specLabel}>{s.label}</h4>
                                            <h4>{s.value}</h4>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.specs}>
                                    <p className={`text_24 medium`}>Преимущества</p>
                                    {advantages.map((advantage) => (
                                        <div key={advantage.label} className={styles.advantage}>
                                            <Check />
                                            <h4 className={styles.advantage}>{advantage.label}</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}
