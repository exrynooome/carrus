"use client"

import {forwardRef, InputHTMLAttributes, ReactNode, useState} from "react";
import styles from "./Input.module.scss";

type InputProps = {
    label: ReactNode;
    required?: boolean;
    error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "required">;

const Input = forwardRef<HTMLInputElement, InputProps>(({
                                                    label,
                                                    required = false,
                                                    error,
                                                    onFocus,
                                                    onBlur,
                                                    ...rest
                                                }, ref) => {
        const [focused, setFocused] = useState(false);

        const rootClass = [
            styles.root,
            focused && styles.focused,
            error && styles.error,
        ]
            .filter(Boolean)
            .join(" ");

        const labelContent = (
            <>
                {label}
                {required && <span className={styles.required}> *</span>}
            </>
        );

        return (
    <div className={rootClass}>
        <div className={styles.inputWrap}>
            <p className={`text_16 medium ${styles.label}`}>
                {labelContent}
            </p>

            <fieldset className={styles.fieldset} aria-hidden="true">
                <legend className={styles.legend}>
                    <span>{labelContent}</span>
                </legend>
            </fieldset>

            <input
                ref={ref}
                className={`text_16 medium ${styles.input}`}
                onFocus={(e) => {
                    setFocused(true);
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    setFocused(false);
                    onBlur?.(e);
                }}
                {...rest}
            />
        </div>

        {error && (
            <p className={`text_14 medium ${styles.error}`}>{error}</p>
        )}

    </div>
)});

Input.displayName = "Input";

export default Input;
