"use client"

import { forwardRef, InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.scss";

type CheckboxProps = {
    label: React.ReactNode;
    error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, ...rest }, ref) => (
        <div className={styles.root}>
            <label className={styles.label}>
                <input ref={ref} type="checkbox" className={styles.input} {...rest} />
                <span className={`${styles.box} ${error ? styles.error : ''}`} />
                <span className={`text_16 medium ${styles.text}`}>{label}</span>
            </label>
        </div>
    )
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
