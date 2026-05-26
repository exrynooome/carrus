"use client"

import { forwardRef, ReactNode, TextareaHTMLAttributes, useState } from "react";
import styles from "./Textarea.module.scss";

type TextareaProps = {
    label: ReactNode;
    error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    label,
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
    ].filter(Boolean).join(" ");

    return (
        <div className={rootClass}>
            <div className={styles.textareaWrap}>
                <p className={`text_16 medium ${styles.label}`}>{label}</p>

                <fieldset className={styles.fieldset} aria-hidden="true">
                    <legend className={styles.legend}>
                        <span>{label}</span>
                    </legend>
                </fieldset>

                <textarea
                    ref={ref}
                    className={`text_16 medium ${styles.textarea}`}
                    onFocus={(e) => { setFocused(true); onFocus?.(e); }}
                    onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
                    {...rest}
                />
            </div>

            {error && <div className={styles.help}>{error}</div>}
        </div>
    );
});

Textarea.displayName = "Textarea";

export default Textarea;
