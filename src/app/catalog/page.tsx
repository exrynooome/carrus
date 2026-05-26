"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FiltersForm from "@/src/components/FiltersForm/";
import CarsGrid from "@/src/components/CarsGrid";
import Container from "@/src/components/Container";
import styles from './page.module.scss'
import ActiveFiltersBar from "@/src/components/ActiveFilter";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

export const dynamic = 'force-dynamic';

export default function Page() {
    const router = useRouter();
    const breadcrumbsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const anchor = breadcrumbsRef.current?.querySelector<HTMLAnchorElement>('a[href="/"]');
        if (!anchor) return;
        const handler = (e: MouseEvent) => {
            e.preventDefault();
            router.push('/');
        };
        anchor.addEventListener('click', handler);
        return () => anchor.removeEventListener('click', handler);
    }, [router]);

    return (
        <main>
            <Container>
                <div ref={breadcrumbsRef} className={styles.breadcrumbs}>
                    <Breadcrumbs
                        itemClasses={{
                            separator: "rotate-180",
                        }}
                        size={"md"}
                    >
                        <BreadcrumbItem
                            href="/"
                            size={"md"}
                        >
                            Главная
                        </BreadcrumbItem>
                        <BreadcrumbItem href={"/catalog"} color={"primary"} size={"md"}>
                            Автомобили из Америки
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <div className={styles.row}>
                    <FiltersForm />
                    <div className={styles.column}>
                        <div className={styles.text}>
                            <h2>Автомобили из Америки</h2>
                            <ActiveFiltersBar />
                        </div>
                        <CarsGrid />
                    </div>
                </div>
            </Container>
        </main>
    );
}