import Image from "next/image";
import styles from "./BlackBgCard.module.scss";
import GlassButton from "@/src/components/GlassButton";

interface Props {
    image?: string;
    label: string;
    textButton?: string;
    href: string;

}

export function BlackBgCard({ href, image, label, textButton = "Выбрать" }: Props) {

    return (
        <div className={`${styles.card} ${image ? '' : styles.black_bg}`}>
            {image && (
                <div className={styles.image}>
                    <Image
                        src={image}
                        alt={label}
                        fill
                        sizes="100vh, 100vh"
                        className={styles.image}
                    />
                </div>
            )}
            <div className={image ? styles.image_text : styles.text}>
                <p className={`text_44 medium`}>{label}</p>
                <GlassButton href={href}>{textButton}</GlassButton>
            </div>
        </div>
    );
}