import Image from "next/image";
import styles from "./CarTypeCard.module.scss";
import GlassButton from "@/src/components/GlassButton";

interface Props {
    image: string;
    label: string;
    textButton?: string;
    onClick: () => void;
}

export function CarTypeCard({ onClick, image, label, textButton = "Выбрать" }: Props) {

    return (
        <div className={styles.card}>
            <div className={styles.image}>
                <Image
                    src={image}
                    alt={label}
                    fill
                    sizes="100vh, 100vh"
                    className={styles.image}
                />
            </div>
            <div className={styles.text}>
                <p className={`text_44 medium`}>{label}</p>
                    <GlassButton onClick={onClick}>{textButton}</GlassButton>
            </div>
        </div>
    );
}