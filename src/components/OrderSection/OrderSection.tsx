"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/src/components/Input";
import Textarea from "@/src/components/Textarea";
import Checkbox from "@/src/components/Checkbox";
import TextLink from "@/src/components/TextLink";
import styles from "./OrderSection.module.scss";
import GlassButton from "@/src/components/GlassButton";

const schema = z.object({
    name:    z.string().min(1, "Введите имя"),
    phone:   z.string().min(1, "Введите телефон"),
    email:   z.string().refine(
        (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        "Некорректный email"
    ),
    message:  z.string(),
    consent: z.boolean().refine((v) => v === true),
});

type FormData = z.infer<typeof schema>;

export default function OrderSection() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", phone: "", email: "", message: "", consent: false },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch('/api/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                reset();
                return;
            }

            const json = await res.json();
            if (json.fieldErrors) {
                for (const [field, message] of Object.entries(json.fieldErrors)) {
                    setError(field as keyof FormData, { message: message as string });
                }
            } else {
                setError('root', { message: json.error ?? 'Ошибка при отправке' });
            }
        } catch {
            setError('root', { message: 'Нет соединения. Попробуйте позже.' });
        }
    };

    const consentError = !!errors.consent;

    return (
        <section id="order" className={styles.container}>
            <div className={styles.title}>
                <h1>Получите бесплатную консультацию</h1>
            </div>
            <div className={styles.row}>
                <div className={styles.gray_block}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="591" height="208" viewBox="0 0 591 208" fill="none">
                        <defs>
                            <linearGradient id="glassStroke" x1="1" y1="0" x2="0.3" y2="1">
                                <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.8"/>
                                <stop offset="30%"  stopColor="#ffffff" stopOpacity="0.15"/>
                                <stop offset="65%"  stopColor="#ffffff" stopOpacity="0.04"/>
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.28"/>
                            </linearGradient>
                            <linearGradient id="dispersion" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%"   stopColor="#7ab8ff" stopOpacity="0.45"/>
                                <stop offset="50%"  stopColor="#ffffff" stopOpacity="0.05"/>
                                <stop offset="100%" stopColor="#ff8fd0" stopOpacity="0.4"/>
                            </linearGradient>
                            <filter id="frost" x="-5%" y="-5%" width="110%" height="110%">
                                <feGaussianBlur stdDeviation="0.4"/>
                            </filter>
                            <filter id="filter0_d_102_965" x="0" y="0" width="591" height="208" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dy="8"/>
                                <feGaussianBlur stdDeviation="20"/>
                                <feComposite in2="hardAlpha" operator="out"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_102_965"/>
                                <feBlend mode="normal" in="BackgroundImageFix" in2="effect1_dropShadow_102_965" result="BackgroundImageFix"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            </filter>
                        </defs>
                        <g filter="url(#filter0_d_102_965)" fill="none"
                           stroke="url(#dispersion)" strokeWidth="1.6" strokeOpacity="0.6">
                            <path d="M143.678 124.695H161.934C150.377 147.451 130.278 160 105.154 160C68.3062 160 40 132.225 40 96.0837C40 59.7752 67.8037 32 103.982 32C129.943 32 151.55 45.3856 161.599 67.4719H143.678C134.466 53.5843 121.904 46.8915 104.484 46.8915C77.0158 46.8915 56.0792 67.9739 56.0792 95.9163C56.0792 123.022 78.0207 145.109 104.819 145.109C120.396 145.109 132.121 138.918 143.678 124.695Z"/>
                            <path d="M174.763 112.146C174.763 84.3712 195.197 63.7908 222.666 63.7908C237.908 63.7908 248.292 68.9778 257.002 80.8575V65.966H272.076V157.825H257.002V143.101C247.455 155.148 237.908 160 223.168 160C195.365 160 174.763 139.754 174.763 112.146ZM190.675 111.979C190.675 131.054 205.247 145.61 224.173 145.61C242.765 145.61 256.667 131.221 256.667 111.812C256.667 92.4026 242.597 78.1804 223.336 78.1804C205.079 78.1804 190.675 93.0719 190.675 111.979Z"/>
                            <path d="M292.131 157.825V65.966H307.205V77.6784C312.397 67.9739 319.097 64.1255 331.826 63.7908V79.017C315.914 80.1882 307.875 88.8889 307.875 105.119V157.825H292.131Z"/>
                            <path d="M344.145 157.825V65.966H359.219V77.6784C364.411 67.9739 371.111 64.1255 383.84 63.7908V79.017C367.929 80.1882 359.889 88.8889 359.889 105.119V157.825H344.145Z"/>
                            <path d="M462.318 157.825V145.443C455.284 155.65 446.909 160 433.677 160C408.888 160 395.991 144.774 395.991 115.325V65.966H411.736V113.987C411.736 135.571 419.44 145.61 435.854 145.61C453.106 145.61 461.648 134.567 461.648 111.812V65.966H477.392V157.825H462.318Z"/>
                            <path d="M490.368 130.05H505.945C507.117 140.256 512.477 145.61 521.689 145.61C529.561 145.61 535.256 139.922 535.256 132.058C535.256 123.692 529.394 120.512 518.172 116.329C500.082 109.637 493.718 102.944 493.718 90.3948C493.718 74.834 505.275 63.7908 521.354 63.7908C536.931 63.7908 548.153 74.332 548.655 89.5582H533.078C532.241 82.0288 528.054 78.1804 521.186 78.1804C514.319 78.1804 509.462 82.5307 509.462 88.7216C509.462 96.251 517.502 100.769 528.221 104.45C543.63 109.637 551 118.17 551 130.552C551 147.618 538.606 160 521.354 160C502.93 160 491.038 148.455 490.368 130.05Z"/>
                        </g>
                        <g fill="white" fillOpacity="0.04"
                           stroke="url(#glassStroke)" strokeWidth="1">
                            <path d="M143.678 124.695H161.934C150.377 147.451 130.278 160 105.154 160C68.3062 160 40 132.225 40 96.0837C40 59.7752 67.8037 32 103.982 32C129.943 32 151.55 45.3856 161.599 67.4719H143.678C134.466 53.5843 121.904 46.8915 104.484 46.8915C77.0158 46.8915 56.0792 67.9739 56.0792 95.9163C56.0792 123.022 78.0207 145.109 104.819 145.109C120.396 145.109 132.121 138.918 143.678 124.695Z"/>
                            <path d="M174.763 112.146C174.763 84.3712 195.197 63.7908 222.666 63.7908C237.908 63.7908 248.292 68.9778 257.002 80.8575V65.966H272.076V157.825H257.002V143.101C247.455 155.148 237.908 160 223.168 160C195.365 160 174.763 139.754 174.763 112.146ZM190.675 111.979C190.675 131.054 205.247 145.61 224.173 145.61C242.765 145.61 256.667 131.221 256.667 111.812C256.667 92.4026 242.597 78.1804 223.336 78.1804C205.079 78.1804 190.675 93.0719 190.675 111.979Z"/>
                            <path d="M292.131 157.825V65.966H307.205V77.6784C312.397 67.9739 319.097 64.1255 331.826 63.7908V79.017C315.914 80.1882 307.875 88.8889 307.875 105.119V157.825H292.131Z"/>
                            <path d="M344.145 157.825V65.966H359.219V77.6784C364.411 67.9739 371.111 64.1255 383.84 63.7908V79.017C367.929 80.1882 359.889 88.8889 359.889 105.119V157.825H344.145Z"/>
                            <path d="M462.318 157.825V145.443C455.284 155.65 446.909 160 433.677 160C408.888 160 395.991 144.774 395.991 115.325V65.966H411.736V113.987C411.736 135.571 419.44 145.61 435.854 145.61C453.106 145.61 461.648 134.567 461.648 111.812V65.966H477.392V157.825H462.318Z"/>
                            <path d="M490.368 130.05H505.945C507.117 140.256 512.477 145.61 521.689 145.61C529.561 145.61 535.256 139.922 535.256 132.058C535.256 123.692 529.394 120.512 518.172 116.329C500.082 109.637 493.718 102.944 493.718 90.3948C493.718 74.834 505.275 63.7908 521.354 63.7908C536.931 63.7908 548.153 74.332 548.655 89.5582H533.078C532.241 82.0288 528.054 78.1804 521.186 78.1804C514.319 78.1804 509.462 82.5307 509.462 88.7216C509.462 96.251 517.502 100.769 528.221 104.45C543.63 109.637 551 118.17 551 130.552C551 147.618 538.606 160 521.354 160C502.93 160 491.038 148.455 490.368 130.05Z"/>
                        </g>
                    </svg>
                    <GlassButton href={"/"}>Написать нам в Телеграм</GlassButton>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
                    <div className={styles.form_fields}>
                        <Input label="Имя" required error={errors.name?.message} {...register("name")} />
                        <Input label="Телефон" required error={errors.phone?.message} {...register("phone")} />
                        <Input label="Email" error={errors.email?.message} {...register("email")} />
                        <Textarea label="Сообщение" error={errors.message?.message} {...register("message")} />
                        <Checkbox
                            {...register("consent")}
                            error={errors.consent?.message}
                            label={
                                <>
                                    Я согласен с{" "}
                                    <TextLink variant="sm" color={consentError ? "red" : "gray"} href="/">
                                        политикой конфиденциальности
                                    </TextLink>
                                    {" "}и даю согласие на{" "}
                                    <TextLink variant="sm" color={consentError ? "red" : "gray"} href="/">
                                         обработку персональных данных
                                    </TextLink>
                                </>
                            }
                        />
                    </div>
                    <GlassButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                    </GlassButton>
                </form>
            </div>
        </section>
    );
}

