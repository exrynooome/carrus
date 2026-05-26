import React, { FunctionComponent } from "react";
import styles from "./Container.module.scss";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    children?: React.ReactNode;
}

const Container: FunctionComponent<Props> = ({ children, className }) => {
    return (
        <div className={`${styles.container} ${className}`}>
            {children}
        </div>
    );
};

export default Container;