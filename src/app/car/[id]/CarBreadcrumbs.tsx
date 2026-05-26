"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import styles from "./page.module.scss";

interface Props {
    id: string;
    make: string;
    model: string;
}

export function CarBreadcrumbs({ id, make, model }: Props) {
    return (
        <div className={styles.breadcrumbs}>
            <Breadcrumbs itemClasses={{ separator: "rotate-180" }} size="md">
                <BreadcrumbItem href="/" size="md">Главная</BreadcrumbItem>
                <BreadcrumbItem href="/catalog" size="md">Америка</BreadcrumbItem>
                <BreadcrumbItem href={`/car/${id}`} color="primary" size="md">
                    {make} {model}
                </BreadcrumbItem>
            </Breadcrumbs>
        </div>
    );
}
