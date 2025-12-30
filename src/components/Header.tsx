'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoAzul from '@/assets/1.png';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navLinks = [
        { href: '#inicio', label: 'Início' },
        { href: '#servicos', label: 'Serviços' },
        { href: '#sobre', label: 'Sobre' },
    ];

    return (
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', paddingBottom: '1rem' }}>
                    {/* Logo */}
                    <div style={{ flexShrink: 0 }}>
                        <Link href="#inicio">
                            <Image
                                src={LogoAzul}
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
                                <Link key={link.href} href={link.href} className="nav-link">
                                    {link.label}
                                </Link>
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
