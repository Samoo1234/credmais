'use client';

import { useEffect, useState, useCallback } from 'react';

interface Promotion {
    id: string;
    image_url: string;
    link_url: string | null;
    is_active: boolean;
}

const TIMER_DURATION = 25; // seconds

export default function PromotionPopup() {
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);

    const closePopup = useCallback(() => {
        setClosing(true);
        setTimeout(() => {
            setVisible(false);
            setClosing(false);
            sessionStorage.setItem('promotion_seen', 'true');
        }, 400);
    }, []);

    useEffect(() => {
        // Don't show if already seen in this session
        if (sessionStorage.getItem('promotion_seen')) return;

        const fetchPromotion = async () => {
            try {
                const res = await fetch('/api/promotions');
                const data = await res.json();
                if (data && data.id) {
                    setPromotion(data);
                    setVisible(true);
                }
            } catch (err) {
                console.error('Erro ao buscar promoção:', err);
            }
        };

        fetchPromotion();
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!visible || closing) return;

        setTimeLeft(TIMER_DURATION);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    closePopup();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [visible, closing, closePopup]);

    if (!visible || !promotion) return null;

    const progress = ((TIMER_DURATION - timeLeft) / TIMER_DURATION) * 100;

    const imageContent = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={promotion.image_url}
            alt="Promoção"
            className="promo-popup-image"
        />
    );

    return (
        <div className={`promo-popup-overlay ${closing ? 'promo-popup-closing' : ''}`}>
            <div className={`promo-popup-container ${closing ? 'promo-popup-container-closing' : ''}`}>
                {/* Progress bar */}
                <div className="promo-popup-progress-track">
                    <div
                        className="promo-popup-progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Timer text */}
                <div className="promo-popup-timer">
                    Fecha em {timeLeft}s
                </div>

                {/* Image - clickable if link exists */}
                {promotion.link_url ? (
                    <a
                        href={promotion.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="promo-popup-link"
                    >
                        {imageContent}
                    </a>
                ) : (
                    imageContent
                )}
            </div>
        </div>
    );
}
