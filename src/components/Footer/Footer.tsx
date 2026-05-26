"use client"

import { FunctionComponent } from "react";
import styles from "./Footer.module.scss"
import TextLink from "@/src/components/TextLink";

const Footer: FunctionComponent = () => {

    const navItems = [
        { label: "Carrus", href: "/"},
        { label: "Автомобили из Америки", href: "/catalog"},
        { label: "О компании", href: "/about"},
        { id: "#footer", label: "Контакты"},
        { id: "#order", label: "Заказать авто"},
    ]

    return (
        <div className={styles.footer} id="footer">
            <div className={styles.nav}>
                {navItems.map((item) => (
                    <TextLink key={item.label} href={item.href || item.id}>
                        {item.label}
                    </TextLink>
                ))}
            </div>
            <div className={styles.contacts}>
                <TextLink variant={"lg"} onClick={() => navigator.clipboard.writeText("+79935603054")}>+7 993 560 30 54</TextLink>
                <TextLink variant={"lg"} onClick={() => navigator.clipboard.writeText("info@carrus.ru")}>info@carrus.ru</TextLink>
                <TextLink variant={"lg"} onClick={() => navigator.clipboard.writeText("/")}>Telegram</TextLink>
            </div>
            <div className={styles.nav}>
                <p className={`text_16 medium gray`}>© 2026 Carrus</p>
                <TextLink color={"gray"} href={"/"}>Согласие на обработку персональных данных</TextLink>
                <TextLink color={"gray"} href={"/"}>Политика конфиденциальности</TextLink>
                <TextLink color={"gray"} href={"/"}>Юридическая информация</TextLink>
            </div>
        </div>
    )
}

export default Footer;