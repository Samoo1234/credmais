'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface Settings {
    whatsapp_number: string;
    contact_email: string;
    address: string;
    phone: string;
    business_hours: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        whatsapp_number: '',
        contact_email: '',
        address: '',
        phone: '',
        business_hours: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const supabase = createBrowserClient();
        const { data } = await supabase.from('settings').select('*').single();

        if (data) {
            setSettings({
                whatsapp_number: data.whatsapp_number || '',
                contact_email: data.contact_email || '',
                address: data.address || '',
                phone: data.phone || '',
                business_hours: data.business_hours || ''
            });
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setMessage('Configurações salvas com sucesso!');
            } else {
                setMessage('Erro ao salvar configurações.');
            }
        } catch {
            setMessage('Erro ao salvar configurações.');
        }
        setSaving(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '0.5rem'
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '2rem' }}>
                Configurações
            </h1>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '700px' }}>
                    <form onSubmit={handleSave}>
                        {message && (
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1.5rem',
                                background: message.includes('sucesso') ? '#d1fae5' : '#fee2e2',
                                color: message.includes('sucesso') ? '#065f46' : '#dc2626',
                                fontSize: '0.9rem'
                            }}>
                                {message}
                            </div>
                        )}

                        {/* Seção WhatsApp e Contato */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#29577E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #e5e7eb' }}>
                            📱 Contato Principal
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Número do WhatsApp</label>
                                <input
                                    type="text"
                                    value={settings.whatsapp_number}
                                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                    placeholder="5511999999999"
                                    style={inputStyle}
                                />
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                    Formato: código + DDD + número
                                </p>
                            </div>
                            <div>
                                <label style={labelStyle}>Telefone Fixo</label>
                                <input
                                    type="text"
                                    value={settings.phone}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    placeholder="(00) 0000-0000"
                                    style={inputStyle}
                                />
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                    Exibido nos cards de contato
                                </p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>E-mail de Contato</label>
                            <input
                                type="email"
                                value={settings.contact_email}
                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                placeholder="contato@empresa.com"
                                style={inputStyle}
                            />
                        </div>

                        {/* Seção Endereço e Horário */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#29577E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #e5e7eb' }}>
                            🏢 Localização e Horário
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Endereço</label>
                            <textarea
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                placeholder="Rua, número, bairro, cidade - UF"
                                rows={2}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={labelStyle}>Horário de Funcionamento</label>
                            <input
                                type="text"
                                value={settings.business_hours}
                                onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                                placeholder="Seg - Sex: 8h às 18h"
                                style={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '0.875rem 2rem',
                                background: saving ? '#9ca3af' : 'linear-gradient(to right, #FC4C00, #FF7033)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: saving ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {saving ? 'Salvando...' : 'Salvar Configurações'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
