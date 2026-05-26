'use client';

import Link from 'next/link';
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import styles from "./NavItem.module.scss";
import { useActiveSection } from "./useActiveSection";

interface Props {
    id?: string;
    href?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}

const NavItem: FunctionComponent<Props> = ({
                                               children,
                                               id = '',
                                               onClick,
                                               href = '/'
                                           }) => {
    const activeId = useActiveSection();
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick) onClick();

        if (!id) return;

        const elementId = id.startsWith('#') ? id.slice(1) : id;
        const targetElement = document.getElementById(elementId);

        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            router.push(`${href}${id}`, { scroll: false });
        }
    };

    return (
        <div className={styles.container}>
            <Link
                href={`${href}${id}`}
                className={`text_14 medium ${activeId === id ? styles.active : ''} ${styles.item}`}
                onClick={handleClick}
            >
                {children}
            </Link>
        </div>
    );
};

export default NavItem;