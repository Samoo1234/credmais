'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    status: string;
    created_at: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedLead, setExpandedLead] = useState<string | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        const supabase = createBrowserClient();
        const { data } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setLeads(data);
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string) => {
        const supabase = createBrowserClient();
        await supabase.from('leads').update({ status }).eq('id', id);
        fetchLeads();
    };

    const deleteLead = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este lead?')) return;
        const supabase = createBrowserClient();
        await supabase.from('leads').delete().eq('id', id);
        fetchLeads();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return '#FC4C00';
            case 'responded': return '#10b981';
            case 'archived': return '#6b7280';
            default: return '#29577E';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Novo';
            case 'responded': return 'Respondido';
            case 'archived': return 'Arquivado';
            default: return status;
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem' }}>
                Leads / Contatos
            </h1>

            {loading ? (
                <p>Carregando...</p>
            ) : leads.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>Nenhum lead recebido ainda.</p>
                </div>
            ) : (
                <>
                    {/* Versão Desktop - Tabela */}
                    <div className="leads-table-desktop" style={{
                        background: 'white',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'none'
                    }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Nome</th>
                                        <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>E-mail</th>
                                        <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Telefone</th>
                                        <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Serviço</th>
                                        <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Status</th>
                                        <th style={{ padding: '0.875rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Data</th>
                                        <th style={{ padding: '0.875rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => (
                                        <tr key={lead.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '0.875rem', fontSize: '0.85rem' }}>{lead.name}</td>
                                            <td style={{ padding: '0.875rem', fontSize: '0.85rem' }}>{lead.email}</td>
                                            <td style={{ padding: '0.875rem', fontSize: '0.85rem' }}>{lead.phone || '-'}</td>
                                            <td style={{ padding: '0.875rem', fontSize: '0.85rem' }}>{lead.service || '-'}</td>
                                            <td style={{ padding: '0.875rem' }}>
                                                <span style={{
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    color: 'white',
                                                    background: getStatusColor(lead.status)
                                                }}>
                                                    {getStatusLabel(lead.status)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.875rem', fontSize: '0.8rem', color: '#6b7280' }}>
                                                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td style={{ padding: '0.875rem', textAlign: 'center' }}>
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                    style={{
                                                        padding: '0.3rem 0.4rem',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '0.375rem',
                                                        fontSize: '0.75rem',
                                                        marginRight: '0.4rem'
                                                    }}
                                                >
                                                    <option value="new">Novo</option>
                                                    <option value="responded">Respondido</option>
                                                    <option value="archived">Arquivado</option>
                                                </select>
                                                <button
                                                    onClick={() => deleteLead(lead.id)}
                                                    style={{
                                                        padding: '0.3rem 0.4rem',
                                                        background: '#fee2e2',
                                                        color: '#dc2626',
                                                        border: 'none',
                                                        borderRadius: '0.375rem',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Versão Mobile - Cards */}
                    <div className="leads-cards-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {leads.map((lead) => (
                            <div
                                key={lead.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '0.75rem',
                                    padding: '1rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    borderLeft: `4px solid ${getStatusColor(lead.status)}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>
                                            {lead.name}
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        color: 'white',
                                        background: getStatusColor(lead.status)
                                    }}>
                                        {getStatusLabel(lead.status)}
                                    </span>
                                </div>

                                <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem' }}>
                                    <p style={{ marginBottom: '0.25rem' }}>📧 {lead.email}</p>
                                    {lead.phone && <p style={{ marginBottom: '0.25rem' }}>📱 {lead.phone}</p>}
                                    {lead.service && <p>🏷️ {lead.service}</p>}
                                </div>

                                {lead.message && (
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                                    >
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>
                                            {expandedLead === lead.id
                                                ? lead.message
                                                : lead.message.substring(0, 50) + (lead.message.length > 50 ? '...' : '')}
                                        </p>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                    <select
                                        value={lead.status}
                                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                                        style={{
                                            flex: 1,
                                            minWidth: '120px',
                                            padding: '0.5rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.8rem',
                                            background: 'white'
                                        }}
                                    >
                                        <option value="new">Novo</option>
                                        <option value="responded">Respondido</option>
                                        <option value="archived">Arquivado</option>
                                    </select>
                                    <button
                                        onClick={() => deleteLead(lead.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            border: 'none',
                                            borderRadius: '0.375rem',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <style jsx>{`
                @media (min-width: 768px) {
                    .leads-table-desktop {
                        display: block !important;
                    }
                    .leads-cards-mobile {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
