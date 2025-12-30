'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface Settings {
    whatsapp_number: string;
    contact_email: string;
    address: string;
    phone: string;
    business_hours: string;
    facebook_url: string;
    instagram_url: string;
    linkedin_url: string;
    maps_embed_url: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        whatsapp_number: '',
        contact_email: '',
        address: '',
        phone: '',
        business_hours: '',
        facebook_url: '',
        instagram_url: '',
        linkedin_url: '',
        maps_embed_url: ''
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
                business_hours: data.business_hours || '',
                facebook_url: data.facebook_url || '',
                instagram_url: data.instagram_url || '',
                linkedin_url: data.linkedin_url || '',
                maps_embed_url: data.maps_embed_url || ''
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

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Horário de Funcionamento</label>
                            <input
                                type="text"
                                value={settings.business_hours}
                                onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                                placeholder="Seg - Sex: 8h às 18h"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    🗺️ Google Maps (URL do Embed)
                                </span>
                            </label>
                            <input
                                type="url"
                                value={settings.maps_embed_url}
                                onChange={(e) => setSettings({ ...settings, maps_embed_url: e.target.value })}
                                placeholder="https://www.google.com/maps/embed?pb=..."
                                style={inputStyle}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                Para obter: Google Maps → Compartilhar → Incorporar um mapa → Copiar src do iframe
                            </p>
                        </div>

                        {/* Seção Redes Sociais */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#29577E', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #e5e7eb' }}>
                            🌐 Redes Sociais
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                    Facebook
                                </span>
                            </label>
                            <input
                                type="url"
                                value={settings.facebook_url}
                                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                                placeholder="https://facebook.com/suaempresa"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg className="w-4 h-4" fill="#E4405F" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#E4405F" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="#E4405F" strokeWidth="2" /></svg>
                                    Instagram
                                </span>
                            </label>
                            <input
                                type="url"
                                value={settings.instagram_url}
                                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                placeholder="https://instagram.com/suaempresa"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={labelStyle}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg className="w-4 h-4" fill="#0A66C2" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    LinkedIn
                                </span>
                            </label>
                            <input
                                type="url"
                                value={settings.linkedin_url}
                                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                                placeholder="https://linkedin.com/company/suaempresa"
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
