'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface Stats {
    totalLeads: number;
    newLeads: number;
    respondedLeads: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ totalLeads: 0, newLeads: 0, respondedLeads: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const supabase = createBrowserClient();

        const { data: leads } = await supabase.from('leads').select('status');

        if (leads) {
            setStats({
                totalLeads: leads.length,
                newLeads: leads.filter(l => l.status === 'new').length,
                respondedLeads: leads.filter(l => l.status === 'responded').length,
            });
        }
        setLoading(false);
    };

    const statCards = [
        { label: 'Total de Leads', value: stats.totalLeads, color: '#29577E', icon: '👥' },
        { label: 'Novos', value: stats.newLeads, color: '#FC4C00', icon: '🆕' },
        { label: 'Respondidos', value: stats.respondedLeads, color: '#10b981', icon: '✅' },
    ];

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '2rem' }}>
                Dashboard
            </h1>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                borderLeft: `4px solid ${card.color}`
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{card.label}</p>
                                    <p style={{ fontSize: '2rem', fontWeight: 700, color: card.color }}>{card.value}</p>
                                </div>
                                <span style={{ fontSize: '2rem' }}>{card.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '2rem', background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
                    Bem-vindo ao Painel Administrativo
                </h2>
                <p style={{ color: '#6b7280' }}>
                    Aqui você pode gerenciar os leads recebidos pelo formulário de contato e configurar as informações do site como número do WhatsApp e e-mail de contato.
                </p>
            </div>
        </div>
    );
}
