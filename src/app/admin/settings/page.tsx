'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface Settings {
    whatsapp_number: string;
    contact_email: string;
    address: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        whatsapp_number: '',
        contact_email: '',
        address: ''
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
                address: data.address || ''
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
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px' }}>
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

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Número do WhatsApp</label>
                            <input
                                type="text"
                                value={settings.whatsapp_number}
                                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                placeholder="5511999999999 (código do país + DDD + número)"
                                style={inputStyle}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                Formato: código do país + DDD + número (ex: 5511999999999)
                            </p>
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

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={labelStyle}>Endereço</label>
                            <textarea
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                placeholder="Rua, número, bairro, cidade - UF"
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
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
