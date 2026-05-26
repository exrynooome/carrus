import React, { FunctionComponent } from "react";
import styles from "./TextLink.module.scss";
import Link from "next/link";

type Props = {
    variant?: "sm" | "lg";
    color?: "base" | "gray" | "red";
    href?: string;
    onClick?: React.MouseEventHandler;
    children?: React.ReactNode;
    className?: string;
}

const TextLink: FunctionComponent<Props> = ({
                                                   onClick,
                                                   href,
                                                   children,
                                                   variant = "sm",
                                                   color = "base",
                                                   ...props
                                               }) => {
    const className = `${styles.button} ${styles[variant]}`;

    return (
        <span className={styles.wrapper}>
            {href ? (
                <Link
                    className={className}
                    onClick={onClick}
                    href={href}
                    {...props}
                >
                    <span className={`${styles.text} ${styles[variant]} ${styles[color]}`}>{children}</span>
                </Link>
            ) : (
                <button
                    className={className}
                    onClick={onClick}
                    type="button"
                    {...props}
                >
                    <span className={`${styles.text} ${styles[variant]} ${styles[color]}`}>{children}</span>
                </button>
            )}
        </span>
    );
};

export default TextLink;