'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoCliente from '@/assets/sem fundo.png';
import EngrImage from '@/assets/engr.png';

interface HeroMedia {
    media_url: string;
    media_type: 'image' | 'video';
}

const containerStyle = {
    maxWidth: '1280px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    width: '100%',
};

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

    // Effect to cycle through media every 30 seconds
    useEffect(() => {
        if (mediaList.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaList.length);
        }, 30000);

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

            {/* Floating Hexagon - Logo Placeholder */}
            <div className="absolute right-[10%] top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center">
                <div
                    className="relative w-[350px] xl:w-[400px] aspect-square animate-float"
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        background: 'linear-gradient(135deg, rgba(232,168,60,0.15) 0%, rgba(42,90,140,0.25) 100%)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {/* Hexagon Border */}
                    <div
                        className="absolute inset-[3px]"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            background: 'linear-gradient(135deg, #29577E 0%, #0f2438 100%)',
                        }}
                    />
                    {/* Inner Hexagon with gradient border effect */}
                    <div
                        className="absolute inset-[6px] flex items-center justify-center"
                        style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            background: 'linear-gradient(135deg, rgba(232,168,60,0.1) 0%, rgba(42,90,140,0.2) 100%)',
                        }}
                    >
                        {/* Logo do Cliente */}
                        <div className="flex items-center justify-center w-full h-full p-8">
                            <Image
                                src={LogoCliente}
                                alt="Logo do Cliente"
                                className="w-auto h-auto max-w-[220px] xl:max-w-[280px] object-contain drop-shadow-lg"
                                priority
                            />
                        </div>
                    </div>
                </div>
                {/* Decorative glow */}
                <div
                    className="absolute w-[280px] h-[280px] bg-[#FC4C00]/20 rounded-full blur-3xl animate-pulse"
                    style={{ zIndex: -1 }}
                />
            </div>

            {/* Content - Centralizado */}
            <div style={containerStyle} className="relative z-10">
                <div className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0 lg:max-w-xl p-6 rounded-2xl bg-black/10 backdrop-blur-sm border border-white/10 lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:p-0">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                        Soluções Financeiras<br />
                        <span className="text-[#FC4C00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Para Realizar Seus Sonhos</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-zinc-100 font-semibold mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        Oferecemos as melhores opções de crédito e financiamento para você e sua empresa.
                        Conte com a Cred Mais para transformar seus projetos em realidade.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link
                            href="#servicos"
                            style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', fontWeight: 600, borderRadius: '9999px', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', boxShadow: '0 4px 15px rgba(232,168,60,0.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            Nossos Serviços
                        </Link>
                        <Link
                            href="#contato"
                            style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', fontWeight: 600, borderRadius: '9999px', border: '2px solid white', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            Solicitar Proposta
                        </Link>
                    </div>
                </div>
            </div>

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
