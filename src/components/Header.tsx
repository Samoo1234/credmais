'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/logo credmais.png';
import { createBrowserClient } from '@/lib/supabase';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
    const [vehicleCards, setVehicleCards] = useState<any[]>([]);
    const [consorcioCards, setConsorcioCards] = useState<any[]>([]);
    const [whatsappNumber, setWhatsappNumber] = useState<string>('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const supabase = createBrowserClient();
                const { data } = await supabase.from('settings').select('whatsapp_number').single();
                if (data?.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
            } catch (err) {
                console.error('Erro ao buscar settings:', err);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await fetch('/api/vehicle-cards?activeOnly=true');
                const data = await res.json();
                if (Array.isArray(data)) setVehicleCards(data);
            } catch (err) {
                console.error('Erro ao buscar vehicle cards:', err);
            }
        };
        fetchCards();
    }, []);

    useEffect(() => {
        const fetchConsorcios = async () => {
            try {
                const supabase = createBrowserClient();
                const { data } = await supabase
                    .from('consorcio_cards')
                    .select('*')
                    .eq('is_active', true);
                if (data) setConsorcioCards(data);
            } catch (err) {
                console.error('Erro ao buscar consorcio cards:', err);
            }
        };
        fetchConsorcios();
    }, []);

    const automoveisCards = vehicleCards.filter(c => c.category === 'automoveis');
    const motocicletasCards = vehicleCards.filter(c => c.category === 'motocicletas');

    const navLinks = [
        { href: '#inicio', label: 'Início' },
        { href: '#automoveis', label: 'Automóveis' },
        { href: '#motocicletas', label: 'Motocicletas' },
        { href: '#consorcios', label: 'Consórcios' },
        { href: '#servicos', label: 'Soluções Financeiras' },
        { href: '#energia-solar', label: 'Assinatura Energia Solar' },
        { href: '#sobre', label: 'Sobre' },
    ];

    return (
        <header 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 50, 
                backgroundColor: isScrolled || isHovered || isMenuOpen ? 'rgba(255, 255, 255, 0.95)' : 'transparent', 
                backdropFilter: isScrolled || isHovered || isMenuOpen ? 'blur(10px)' : 'none', 
                boxShadow: isScrolled || isHovered || isMenuOpen ? '0 4px 20px -2px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                paddingTop: isScrolled ? '0' : '0.5rem',
                paddingBottom: isScrolled ? '0' : '0.5rem'
            }}
        >
            <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '2rem' : '4rem', paddingTop: '1rem', paddingBottom: '1rem' }}>
                    {/* Logo */}
                    <div style={{ flexShrink: 0 }}>
                        <Link href="#inicio">
                            <Image
                                src={Logo}
                                alt="Cred Mais Logo"
                                style={{ height: '5rem', width: 'auto' }}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation - hidden on mobile */}
                    {!isMobile && (
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            {navLinks.map((link) => (
                                <div 
                                    key={link.href}
                                    style={{ position: 'relative' }}
                                    onMouseEnter={() => {
                                        if (link.label === 'Automóveis') setActiveDropdown('automoveis');
                                        if (link.label === 'Motocicletas') setActiveDropdown('motocicletas');
                                        if (link.label === 'Consórcios') setActiveDropdown('consorcios');
                                    }}
                                    onMouseLeave={() => {
                                        if (link.label === 'Automóveis' || link.label === 'Motocicletas' || link.label === 'Consórcios') setActiveDropdown(null);
                                    }}
                                >
                                    <div style={{ padding: '1.5rem 0', cursor: 'pointer', textAlign: 'center', lineHeight: '1.2' }}>
                                        <Link href={link.href} className="nav-link" style={{ display: 'inline-block' }}>
                                            {link.label}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            <Link href="#contato" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem 1.5rem', fontSize: '0.95rem', fontWeight: 600, borderRadius: '9999px', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 14px 0 rgba(252, 76, 0, 0.3)', transition: 'all 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(252, 76, 0, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(252, 76, 0, 0.3)'; }}>
                                Fale Conosco
                            </Link>
                        </nav>
                    )}

                    {/* Mobile Menu Button - visible only on mobile */}
                    {isMobile && (
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <span style={{ width: '1.75rem', height: '2px', backgroundColor: '#29577E', borderRadius: '2px', transition: 'all 0.3s', transform: isMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
                            <span style={{ width: '1.75rem', height: '2px', backgroundColor: '#29577E', borderRadius: '2px', transition: 'all 0.3s', opacity: isMenuOpen ? 0 : 1 }} />
                            <span style={{ width: '1.75rem', height: '2px', backgroundColor: '#29577E', borderRadius: '2px', transition: 'all 0.3s', transform: isMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
                        </button>
                    )}
                </div>
            </div>

            {/* Mega Menu Full Width (Cortina) */}
            <div 
                style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    backgroundColor: 'rgba(41, 87, 126, 0.85)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    opacity: activeDropdown ? 1 : 0,
                    visibility: activeDropdown ? 'visible' : 'hidden',
                    transform: activeDropdown ? 'translateY(0)' : 'translateY(-15px)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: -1,
                    pointerEvents: activeDropdown ? 'auto' : 'none'
                }}
                onMouseEnter={() => activeDropdown && setActiveDropdown(activeDropdown)}
                onMouseLeave={() => setActiveDropdown(null)}
            >
                {/* Conteúdo do Mega Menu - Automóveis */}
                <div style={{ 
                    maxWidth: '1280px', 
                    margin: '0 auto', 
                    padding: '2.5rem 1.5rem 3.5rem 1.5rem',
                    display: activeDropdown === 'automoveis' ? 'block' : 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: 0 }}>Explorar Automóveis</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Escolha a melhor solução para o seu veículo</p>
                        </div>
                        <Link href="#todos-automoveis" style={{ color: '#FC4C00', fontWeight: 600, textDecoration: 'none' }}>
                            Ver tudo &rarr;
                        </Link>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {automoveisCards.length > 0 ? automoveisCards.map(card => {
                            const message = `Olá! Tenho interesse no veículo: ${card.title}`;
                            const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : '#';
                            
                            return (
                                <div key={card.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', height: '100%' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'}}>
                                    <Link href={card.link_url} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        <div style={{ height: '180px', position: 'relative', background: '#f3f4f6' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={card.image_url} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </Link>
                                    <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'white', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                        <Link href={card.link_url} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '1.1rem' }}>{card.title}</span>
                                        </Link>
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', backgroundColor: '#25D366', color: 'white', fontWeight: 600, borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.2s', fontSize: '0.9rem' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1fad53'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25D366'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.2rem', height: '1.2rem' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                            Tenho Interesse
                                        </a>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', padding: '2rem 0' }}>
                                Nenhum card de automóvel disponível no momento.
                            </div>
                        )}
                    </div>
                </div>

                {/* Conteúdo do Mega Menu - Motocicletas */}
                <div style={{ 
                    maxWidth: '1280px', 
                    margin: '0 auto', 
                    padding: '2.5rem 1.5rem 3.5rem 1.5rem',
                    display: activeDropdown === 'motocicletas' ? 'block' : 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: 0 }}>Explorar Motocicletas</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Encontre a moto ideal para seu estilo de vida</p>
                        </div>
                        <Link href="#todas-motos" style={{ color: '#FC4C00', fontWeight: 600, textDecoration: 'none' }}>
                            Ver tudo &rarr;
                        </Link>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {motocicletasCards.length > 0 ? motocicletasCards.map(card => {
                            const message = `Olá! Tenho interesse na motocicleta: ${card.title}`;
                            const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : '#';
                            
                            return (
                                <div key={card.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', height: '100%' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'}}>
                                    <Link href={card.link_url} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        <div style={{ height: '180px', position: 'relative', background: '#f3f4f6' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={card.image_url} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </Link>
                                    <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'white', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                        <Link href={card.link_url} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '1.1rem' }}>{card.title}</span>
                                        </Link>
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', backgroundColor: '#25D366', color: 'white', fontWeight: 600, borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.2s', fontSize: '0.9rem' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1fad53'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25D366'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.2rem', height: '1.2rem' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                            Tenho Interesse
                                        </a>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', padding: '2rem 0' }}>
                                Nenhum card de motocicleta disponível no momento.
                            </div>
                        )}
                    </div>
                </div>

                {/* Conteúdo do Mega Menu - Consórcios */}
                <div style={{ 
                    maxWidth: '1280px', 
                    margin: '0 auto', 
                    padding: '2.5rem 1.5rem 3.5rem 1.5rem',
                    display: activeDropdown === 'consorcios' ? 'block' : 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: 0 }}>Explorar Consórcios</h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>Planeje seu futuro com as melhores opções</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
                        {['carros', 'motos', 'imoveis'].map((category) => {
                            const categoryCards = consorcioCards.filter(c => c.category === category);
                            if (categoryCards.length === 0) return null;
                            
                            return (
                                <div key={category}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem', textTransform: 'capitalize', textAlign: 'center' }}>
                                        {category === 'imoveis' ? 'Imóveis' : category}
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                                        {categoryCards.map(card => {
                                            const message = `Olá! Tenho interesse no consórcio de ${category}: ${card.title}`;
                                            const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : '#';
                                            
                                            return (
                                                <div key={card.id} style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', height: '100%', padding: '1.5rem 1rem 1rem 1rem', alignItems: 'center' }} onMouseOver={(e) => {e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'}}>
                                                    <Link href={card.link_url} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                                        {/* Título no topo */}
                                                        <h3 style={{ fontWeight: 800, color: '#111827', fontSize: '1.15rem', marginBottom: '1rem', textAlign: 'center', textTransform: 'uppercase' }}>{card.title}</h3>
                                                        
                                                        {/* Imagem no meio */}
                                                        <div style={{ height: '130px', width: '100%', position: 'relative', marginBottom: '1.5rem' }}>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={card.image_url} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        </div>

                                                        {/* Box de Parcelas com borda laranja redonda */}
                                                        {(card.installment_text || card.installment_value || card.installment_obs) && (
                                                            <div style={{ border: '2px solid #FC4C00', borderRadius: '2rem', padding: '0.75rem 1rem', width: '100%', textAlign: 'center', marginBottom: '1.5rem', backgroundColor: 'transparent' }}>
                                                                {card.installment_text && <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: 0 }}>{card.installment_text}</p>}
                                                                {card.installment_value && <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FC4C00', margin: '0.15rem 0' }}>{card.installment_value}</p>}
                                                                {card.installment_obs && <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{card.installment_obs}</p>}
                                                            </div>
                                                        )}
                                                    </Link>
                                                    
                                                    {/* Botão Whatsapp no rodapé */}
                                                    <div style={{ width: '100%', marginTop: 'auto' }}>
                                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: '#25D366', color: 'white', fontWeight: 700, borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1fad53'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25D366'}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.2rem', height: '1.2rem' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                            Tenho Interesse
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {consorcioCards.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem 0' }}>
                            Nenhum card de consórcio disponível no momento.
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {/* Mobile Menu */}
            {isMobile && isMenuOpen && (
                <div style={{ backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxHeight: '80vh', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '1rem', paddingBottom: '1rem' }}>
                        {navLinks.map((link) => {
                            const isAccordionItem = ['Automóveis', 'Motocicletas', 'Consórcios'].includes(link.label);
                            const accordionKey = link.label === 'Automóveis' ? 'automoveis' : link.label === 'Motocicletas' ? 'motocicletas' : link.label === 'Consórcios' ? 'consorcios' : '';
                            const isOpen = mobileAccordion === accordionKey;

                            if (!isAccordionItem) {
                                return (
                                    <Link key={link.href} href={link.href} style={{ display: 'block', padding: '0.75rem 0', fontSize: '1.125rem', fontWeight: 500, color: '#374151', borderBottom: '1px solid #e5e7eb', textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                                        {link.label}
                                    </Link>
                                );
                            }

                            // Accordion item
                            const cards = accordionKey === 'automoveis' ? automoveisCards : accordionKey === 'motocicletas' ? motocicletasCards : consorcioCards;

                            return (
                                <div key={link.href}>
                                    <button
                                        onClick={() => setMobileAccordion(isOpen ? null : accordionKey)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                            padding: '0.75rem 0', fontSize: '1.125rem', fontWeight: 500, color: isOpen ? '#FC4C00' : '#374151',
                                            borderBottom: '1px solid #e5e7eb', textDecoration: 'none', background: 'none', border: 'none',
                                            borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: '#e5e7eb',
                                            cursor: 'pointer', textAlign: 'left'
                                        }}
                                    >
                                        {link.label}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                            style={{ width: '1.25rem', height: '1.25rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Accordion Panel */}
                                    <div style={{
                                        maxHeight: isOpen ? '600px' : '0',
                                        overflow: 'hidden',
                                        transition: 'max-height 0.4s ease',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: isOpen ? '0.75rem' : '0',
                                        marginBottom: isOpen ? '0.5rem' : '0'
                                    }}>
                                        <div style={{ padding: '1rem' }}>
                                            {accordionKey !== 'consorcios' ? (
                                                /* Automóveis / Motocicletas cards */
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                                    {cards.length > 0 ? cards.map(card => {
                                                        const message = `Olá! Tenho interesse ${accordionKey === 'automoveis' ? 'no veículo' : 'na motocicleta'}: ${card.title}`;
                                                        const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : '#';
                                                        return (
                                                            <div key={card.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                                                <Link href={card.link_url} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                    <div style={{ height: '100px', position: 'relative', background: '#f3f4f6' }}>
                                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                        <img src={card.image_url} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    </div>
                                                                    <div style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                                        <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.85rem' }}>{card.title}</span>
                                                                    </div>
                                                                </Link>
                                                                <div style={{ padding: '0 0.5rem 0.5rem' }}>
                                                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', width: '100%', padding: '0.4rem', backgroundColor: '#25D366', color: 'white', fontWeight: 600, borderRadius: '0.375rem', textDecoration: 'none', fontSize: '0.75rem' }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '0.9rem', height: '0.9rem' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                                        Interesse
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        );
                                                    }) : (
                                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', padding: '1rem 0', fontSize: '0.9rem' }}>
                                                            Nenhum card disponível no momento.
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                /* Consórcios cards grouped by category */
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    {['carros', 'motos', 'imoveis'].map((category) => {
                                                        const categoryCards = consorcioCards.filter(c => c.category === category);
                                                        if (categoryCards.length === 0) return null;
                                                        return (
                                                            <div key={category}>
                                                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#29577E', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                                                                    {category === 'imoveis' ? 'Imóveis' : category}
                                                                </h4>
                                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                                                    {categoryCards.map(card => {
                                                                        const message = `Olá! Tenho interesse no consórcio de ${category}: ${card.title}`;
                                                                        const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : '#';
                                                                        return (
                                                                            <div key={card.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb', padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                                <Link href={card.link_url} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                                                                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.8rem', textAlign: 'center', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{card.title}</span>
                                                                                    <div style={{ height: '70px', width: '100%', position: 'relative', marginBottom: '0.5rem' }}>
                                                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                                        <img src={card.image_url} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                                                    </div>
                                                                                    {(card.installment_text || card.installment_value || card.installment_obs) && (
                                                                                        <div style={{ border: '2px solid #FC4C00', borderRadius: '1.5rem', padding: '0.4rem 0.6rem', width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}>
                                                                                            {card.installment_text && <p style={{ fontSize: '0.7rem', color: '#4b5563', margin: 0 }}>{card.installment_text}</p>}
                                                                                            {card.installment_value && <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FC4C00', margin: '0.1rem 0' }}>{card.installment_value}</p>}
                                                                                            {card.installment_obs && <p style={{ fontSize: '0.65rem', color: '#6b7280', margin: 0 }}>{card.installment_obs}</p>}
                                                                                        </div>
                                                                                    )}
                                                                                </Link>
                                                                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', width: '100%', padding: '0.4rem', backgroundColor: '#25D366', color: 'white', fontWeight: 600, borderRadius: '0.375rem', textDecoration: 'none', fontSize: '0.75rem', marginTop: 'auto' }}>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '0.9rem', height: '0.9rem' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                                                    Interesse
                                                                                </a>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {consorcioCards.length === 0 && (
                                                        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '1rem 0', fontSize: '0.9rem' }}>
                                                            Nenhum consórcio disponível no momento.
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <Link href="#contato" style={{ display: 'block', padding: '0.75rem 0', fontSize: '1.125rem', fontWeight: 500, color: '#FC4C00', textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                            Fale Conosco
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
