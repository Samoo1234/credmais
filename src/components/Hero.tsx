'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface HeroMedia {
    media_url: string;
    media_type: 'image' | 'video';
}



export default function Hero() {
    const [mediaList, setMediaList] = useState<HeroMedia[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch('/api/hero');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setMediaList(data);
                } else if (data && data.media_url) {
                    setMediaList([data]);
                }
            } catch (err) {
                console.error('Erro ao buscar hero media:', err);
            }
        };

        fetchMedia();
    }, []);

    // Effect to cycle through media every 5 seconds
    useEffect(() => {
        if (mediaList.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [mediaList.length]);

    const currentMedia = mediaList[currentIndex] || null;

    const defaultMediaUrl = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=80";

    return (
        <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-[#0f2438] overflow-hidden pt-20 w-full">
            {/* Background HD Media */}
            <div className="absolute inset-0 z-0">
                {currentMedia?.media_type === 'video' ? (
                    <video
                        key={currentMedia.media_url} // Força recarregar quando trocar
                        src={currentMedia.media_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="object-cover w-full h-full transform-gpu will-change-transform transition-opacity duration-1000"
                        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                    />
                ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                        key={currentMedia?.media_url || 'default'}
                        src={currentMedia?.media_url || defaultMediaUrl}
                        alt="Background Corporativo"
                        className={`object-cover w-full h-full transition-opacity duration-1000 ${!currentMedia ? 'animate-pulse' : ''}`}
                    />
                )}
                {/* Removidas as camadas escuras para manter o vídeo 100% claro */}
            </div>

            {/* Formas geométricas removidas a pedido do usuário para focar no vídeo */}





            {/* Carousel Navigation */}
            {mediaList.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button 
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)}
                        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all border border-white/10"
                        aria-label="Mídia anterior"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    {/* Right Arrow */}
                    <button 
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % mediaList.length)}
                        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all border border-white/10"
                        aria-label="Próxima mídia"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    {/* Dots indicator */}
                    <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
                        {mediaList.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    idx === currentIndex ? 'bg-[#FC4C00] w-8' : 'bg-white/50 hover:bg-white/80 w-2.5'
                                }`}
                                aria-label={`Ir para o slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
