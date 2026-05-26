"use client";

import Link from "next/link";
import Image from "next/image";
import { Car } from "@/src/lib/cars/client";
import styles from "./CarCard.module.scss";

interface Props {
    car: Car;
}

export function CarCard({ car }: Props) {
    const fmtPrice = (n: number) => `$${n.toLocaleString("en-US")}`;

    return (
        <Link href={`/car/${car.listingId}`} className={styles.card}>
            <div className={styles.image}>
                <Image
                    src={car.thumbnail}
                    alt={`${car.make} ${car.model}`}
                    fill
                    sizes="100vh, 100vh"
                    className={styles.image}
                    loading="eager"
                />
            </div>
            <div className={styles.text}>
                <p className={`text_20 sbold ${styles.title}`}>от {fmtPrice(car.price)}</p>
                <p>{car.make} {car.model}</p>
                <p className={styles.year}>{car.year}</p>
            </div>
        </Link>
    );
}