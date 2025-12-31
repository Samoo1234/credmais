'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ email?: string } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const supabase = createBrowserClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    // Fechar sidebar quando a rota muda (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/leads', label: 'Leads', icon: '👥' },
        { href: '/admin/services', label: 'Serviços', icon: '🛠️' },
        { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
    ];

    return (
        <div className="admin-layout">
            {/* Botão Toggle Mobile */}
            <button
                className="admin-toggle-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Menu"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Overlay para fechar sidebar mobile */}
            <div
                className={`admin-overlay ${sidebarOpen ? 'admin-overlay-visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-visible' : ''}`}>
                <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#FC4C00',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    CRED MAIS
                </div>

                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                marginBottom: '0.5rem',
                                borderRadius: '0.5rem',
                                color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.7)',
                                background: pathname === item.href ? 'rgba(255,255,255,0.1)' : 'transparent',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                        {user?.email}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
