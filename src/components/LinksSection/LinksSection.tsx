import styles from "./LinksSection.module.scss";
import {BlackBgCard} from "@/src/components/LinksSection/internal/BlackBgCard";

const cards: { image?: string; label: string; href: string; textButton: string }[] = [
    { image: "/bgs/order-auto.png", label: "Заказать авто", href: "#order", textButton: "Заказать" },
    { label: "Получите консультацию\nпо доставке автомобиля", href: "#order", textButton: "Получить консультацию" },
    { label: "Реальные отзывы\nот наших клиентов", href: "/", textButton: "Перейти" },
    { label: "Контакты", href: "#footer", textButton: "Перейти" },
];

export function LinksSection() {


    return (
        <div className={styles.grid}>
            {cards.map((card) => (
                <BlackBgCard key={card.label} image={card.image} label={card.label} href={card.href} textButton={card.textButton} />
            ))}
        </div>
    );
}