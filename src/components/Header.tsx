'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/logo credmais.png';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navLinks = [
        { href: '#inicio', label: 'Início' },
        { href: '#automoveis', label: 'Automóveis' },
        { href: '#motocicletas', label: 'Motocicletas' },
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
                backgroundColor: isHovered || isMenuOpen ? 'rgba(255,255,255,0.95)' : 'transparent', 
                backdropFilter: isHovered || isMenuOpen ? 'blur(4px)' : 'none', 
                boxShadow: isHovered || isMenuOpen ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.3s ease-in-out'
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
                                    }}
                                    onMouseLeave={() => {
                                        if (link.label === 'Automóveis' || link.label === 'Motocicletas') setActiveDropdown(null);
                                    }}
                                >
                                    <div style={{ padding: '1.5rem 0', cursor: 'pointer' }}>
                                        <Link href={link.href} className="nav-link">
                                            {link.label}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            <Link href="#contato" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem', fontWeight: 600, borderRadius: '9999px', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', textDecoration: 'none' }}>
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
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
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
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Explorar Automóveis</h3>
                            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Escolha a melhor solução para o seu veículo</p>
                        </div>
                        <Link href="#todos-automoveis" style={{ color: '#FC4C00', fontWeight: 600, textDecoration: 'none' }}>
                            Ver tudo &rarr;
                        </Link>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {/* Placeholder Cards */}
                        <div style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '1rem', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.backgroundColor = '#fffaf5'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.transform = 'translateY(0)'}}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚗</span>
                            <span style={{ fontWeight: 500, color: '#4b5563' }}>Espaço para Card 1</span>
                        </div>
                        <div style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '1rem', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.backgroundColor = '#fffaf5'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.transform = 'translateY(0)'}}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚘</span>
                            <span style={{ fontWeight: 500, color: '#4b5563' }}>Espaço para Card 2</span>
                        </div>
                        <div style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '1rem', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.backgroundColor = '#fffaf5'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.transform = 'translateY(0)'}}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</span>
                            <span style={{ fontWeight: 500, color: '#4b5563' }}>Espaço para Card 3</span>
                        </div>
                        <div style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '1rem', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.backgroundColor = '#fffaf5'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.transform = 'translateY(0)'}}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</span>
                            <span style={{ fontWeight: 500, color: '#4b5563' }}>Espaço para Card 4</span>
                        </div>
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
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Explorar Motocicletas</h3>
                            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Encontre a moto ideal para seu estilo de vida</p>
                        </div>
                        <Link href="#todas-motos" style={{ color: '#FC4C00', fontWeight: 600, textDecoration: 'none' }}>
                            Ver tudo &rarr;
                        </Link>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {/* Placeholder Cards para Motos */}
                        <div style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '1rem', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.backgroundColor = '#fffaf5'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.transform = 'translateY(0)'}}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏍️</span>
                            <span style={{ fontWeight: 500, color: '#4b5563' }}>Card Moto 1</span>
                        </div>
                        <div style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '1rem', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.backgroundColor = '#fffaf5'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.transform = 'translateY(0)'}}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛵</span>
                            <span style={{ fontWeight: 500, color: '#4b5563' }}>Card Moto 2</span>
                        </div>
                        <div style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '1rem', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.backgroundColor = '#fffaf5'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.transform = 'translateY(0)'}}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚡</span>
                            <span style={{ fontWeight: 500, color: '#4b5563' }}>Card Moto 3</span>
                        </div>
                        <div style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '1rem', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => {e.currentTarget.style.borderColor = '#FC4C00'; e.currentTarget.style.backgroundColor = '#fffaf5'; e.currentTarget.style.transform = 'translateY(-4px)'}} onMouseOut={(e) => {e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.transform = 'translateY(0)'}}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</span>
                            <span style={{ fontWeight: 500, color: '#4b5563' }}>Card Moto 4</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobile && isMenuOpen && (
                <div style={{ backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingTop: '1rem', paddingBottom: '1rem' }}>
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} style={{ display: 'block', padding: '0.75rem 0', fontSize: '1.125rem', fontWeight: 500, color: '#374151', borderBottom: '1px solid #e5e7eb', textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                        <Link href="#contato" style={{ display: 'block', padding: '0.75rem 0', fontSize: '1.125rem', fontWeight: 500, color: '#FC4C00', textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
                            Fale Conosco
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
