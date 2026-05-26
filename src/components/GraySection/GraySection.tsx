import React, { FunctionComponent } from "react";
import styles from './GraySection.module.scss'
import GlassButton from "@/src/components/GlassButton";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &  {
    icon?: React.ReactNode;
    title: string;
    href: string;
    buttonText: string;
    variant?: "lg" | "sm";
}

const GraySection: FunctionComponent<Props> = ({
                                                     icon = null,
                                                     title,
                                                     href,
                                                     buttonText,
                                                     variant = "lg",
                                                     className,
                                                 }) => {



    return (
        <section className={`${styles.container} ${styles[variant]}`}>
            <div className={`${styles.text} ${className}`}>
                {icon && (icon)}
                <p className={styles[variant]}>{title}</p>
            </div>
            <GlassButton href={href}>{buttonText}</GlassButton>
        </section>
    )
}

export default GraySection;