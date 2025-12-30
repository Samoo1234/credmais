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
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '2rem' }}>
                Leads / Contatos
            </h1>

            {loading ? (
                <p>Carregando...</p>
            ) : leads.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '1rem', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Nenhum lead recebido ainda.</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Nome</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>E-mail</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Telefone</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Serviço</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Data</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{lead.name}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{lead.email}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{lead.phone || '-'}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{lead.service || '-'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: 'white',
                                            background: getStatusColor(lead.status)
                                        }}>
                                            {getStatusLabel(lead.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                                            style={{
                                                padding: '0.375rem 0.5rem',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '0.375rem',
                                                fontSize: '0.8rem',
                                                marginRight: '0.5rem'
                                            }}
                                        >
                                            <option value="new">Novo</option>
                                            <option value="responded">Respondido</option>
                                            <option value="archived">Arquivado</option>
                                        </select>
                                        <button
                                            onClick={() => deleteLead(lead.id)}
                                            style={{
                                                padding: '0.375rem 0.5rem',
                                                background: '#fee2e2',
                                                color: '#dc2626',
                                                border: 'none',
                                                borderRadius: '0.375rem',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
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
            )}
        </div>
    );
}
