import React, { FunctionComponent } from "react";
import styles from "./GlassButton.module.scss";

type Props = {
    variant?: "light" | "dark";
    href?: string;
    onClick?: React.MouseEventHandler;
    children?: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const GlassButton: FunctionComponent<Props> = ({
                                              onClick,
                                              href,
                                              children,
                                              variant = "light",
                                              type = "button",
                                              ...props
                                          }) => {
    const className = `${styles.button} ${styles[variant]}`;

    return (
        <div className={styles.wrapper}>
            {href ? (
                <a
                    className={className}
                    onClick={onClick}
                    href={href}
                    {...props}
                >
                    <p className={`text_16 medium ${styles.text}`}>{children}</p>
                </a>
            ) : (
                <button
                    className={className}
                    onClick={onClick}
                    type={type}
                    {...props}
                >
                    <p className={`text_16 medium ${styles.text}`}>{children}</p>
                </button>
            )}
        </div>
    );
};

export default GlassButton;