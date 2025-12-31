'use client';
import { useState, useEffect, FormEvent } from 'react';
import { createBrowserClient } from '@/lib/supabase';

const containerStyle = { maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', width: '100%' };
const serviceOptions = [
    { value: '', label: 'Selecione um serviço' }, { value: 'consignados', label: 'Consignados' }, { value: 'energia-sustentavel', label: 'Projetos Energia Sustentável' },
    { value: 'seguros-credito', label: 'Seguros e Crédito Empresarial' }, { value: 'limpa-nome', label: 'Limpa Nome' }, { value: 'usina-solar', label: 'Financiamentos e Usina Solar' },
    { value: 'veiculos', label: 'Financiamentos de Veículos' }, { value: 'cgi', label: 'Crédito com Garantia de Imóvel Rural' }, { value: 'consorcios', label: 'Financiamentos e Consórcios' },
];

// Dados fallback
const fallbackContactInfo = [
    { icon: '📞', title: 'Telefone', value: '(00) 0000-0000' },
    { icon: '✉️', title: 'E-mail', value: 'contato@credmais.com.br' },
    { icon: '📍', title: 'Endereço', value: 'Sua cidade, Estado' },
    { icon: '🕐', title: 'Horário', value: 'Seg - Sex: 8h às 18h' },
];

interface ContactInfo {
    icon: string;
    title: string;
    value: string;
}

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
    const [sending, setSending] = useState(false);
    const [contactInfo, setContactInfo] = useState<ContactInfo[]>(fallbackContactInfo);
    const [mapsUrl, setMapsUrl] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const supabase = createBrowserClient();
                const { data } = await supabase.from('settings').select('*').single();

                if (data) {
                    const updatedInfo: ContactInfo[] = [
                        { icon: '📞', title: 'Telefone', value: data.phone || '(00) 0000-0000' },
                        { icon: '✉️', title: 'E-mail', value: data.contact_email || 'contato@credmais.com.br' },
                        { icon: '📍', title: 'Endereço', value: data.address || 'Sua cidade, Estado' },
                        { icon: '🕐', title: 'Horário', value: data.business_hours || 'Seg - Sex: 8h às 18h' },
                    ];
                    setContactInfo(updatedInfo);
                    if (data.maps_embed_url) {
                        setMapsUrl(data.maps_embed_url);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar configurações:', error);
            }
        };

        fetchSettings();
    }, []);

    const formatPhone = (v: string) => { const n = v.replace(/\D/g, '').slice(0, 11); if (n.length > 6) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`; if (n.length > 2) return `(${n.slice(0, 2)}) ${n.slice(2)}`; return n.length > 0 ? `(${n}` : ''; };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.service) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        setSending(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                setFormData({ name: '', email: '', phone: '', service: '', message: '' });
            } else {
                alert('Erro ao enviar mensagem. Tente novamente.');
            }
        } catch {
            alert('Erro ao enviar mensagem. Tente novamente.');
        }
        setSending(false);
    };

    return (
        <section id="contato" className="py-20 lg:py-28 bg-gray-50 w-full">
            <div style={containerStyle}>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '9999px', marginBottom: '1rem' }}>Contato</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#29577E] mb-4">Fale Conosco</h2>
                    <p className="text-lg lg:text-xl text-gray-500">Estamos prontos para atender você. Entre em contato e tire suas dúvidas.</p>
                </div>

                {/* Formulário */}
                <div style={{ marginBottom: '3rem' }}>
                    <form onSubmit={handleSubmit} className="bg-white p-10 lg:p-12 rounded-2xl shadow-lg">
                        <div className="mb-6"><label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Seu nome" className="w-full px-5 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#29577E] transition-all" /></div>
                        <div className="form-row mb-6">
                            <div><label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" className="w-full px-5 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#29577E] transition-all" /></div>
                            <div><label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} placeholder="(00) 00000-0000" className="w-full px-5 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#29577E] transition-all" /></div>
                        </div>
                        <div className="mb-6"><label className="block text-sm font-semibold text-gray-700 mb-2">Serviço de Interesse</label><select value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-5 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#29577E] transition-all bg-white">{serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                        <div className="mb-6"><label className="block text-sm font-semibold text-gray-700 mb-2">Mensagem</label><textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Como podemos ajudar?" rows={4} className="w-full px-5 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#29577E] transition-all resize-y min-h-28" /></div>
                        <button type="submit" disabled={sending} style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 600, borderRadius: '9999px', background: sending ? '#9ca3af' : 'linear-gradient(to right, #FC4C00, #FF7033)', color: 'white', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>{sending ? 'Enviando...' : 'Enviar Mensagem'}</button>
                    </form>
                </div>

                {/* Cards de contato 50% + Mapa 50% - Responsivo */}
                <div className="contact-grid-container">
                    {/* Cards de contato */}
                    <div className="contact-cards-grid">
                        {contactInfo.map((c, i) => (
                            <div key={i} style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} className="hover:translate-y-[-4px] hover:shadow-lg transition-all">
                                <div style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #29577E, #2a5a8c)', color: 'white', borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '1.25rem' }}>{c.icon}</div>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#29577E', marginBottom: '0.25rem' }}>{c.title}</h4>
                                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.4 }}>{c.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Mapa do Google */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        minHeight: '300px'
                    }}>
                        {mapsUrl ? (
                            <iframe
                                src={mapsUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '300px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização no Google Maps"
                            />
                        ) : (
                            <div style={{
                                height: '100%',
                                minHeight: '300px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                <span style={{ fontSize: '3rem' }}>🗺️</span>
                                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Mapa em breve</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
