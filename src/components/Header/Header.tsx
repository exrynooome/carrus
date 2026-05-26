import { FunctionComponent } from "react";
import styles from "./Header.module.scss"
import NavItem from "@/src/components/Header/internal/NavItem";

const Header: FunctionComponent = () => {

    const navItems = [
        { label: "Carrus", href: "/"},
        { label: "Автомобили из Америки", href: "/catalog"},
        { label: "О компании", href: "/about"},
        { id: "#footer", label: "Контакты"},
        { id: "#order", label: "Заказать авто", href: "/"},
    ]

    return (
        <div className={styles.header}>
            <div className={styles.items}>
                {navItems.map((item) => (
                    <NavItem key={item.label} href={item.href} id={item.id}>
                        {item.label}
                    </NavItem>
                ))}
            </div>
        </div>
    )
}

export default Header;