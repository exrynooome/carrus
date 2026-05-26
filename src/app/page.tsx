import GraySection from "@/src/components/GraySection";
import styles from "./page.module.scss"
import { CarTypeSection } from "@/src/components/CarTypeSection";
import LinksSection from "@/src/components/LinksSection";
import OrderSection from "@/src/components/OrderSection";

export default function HomePage() {

    return (
        <main>
            <section className={styles.main} id="main">
                <GraySection title={"Доставка автомобилей из Америки\n в Россию от 1 месяца"} href={"#order"} buttonText={"Оставить заявку"} />
                <CarTypeSection />
                <GraySection className={styles.textWidth} title={"Сопровождаем от подбора автомобиля\nдо доставки и передачи вам"} href={"/about"} buttonText={"Узнать подробнее"} />
                <LinksSection />
                <OrderSection />
            </section>
        </main>
    );
}