'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    order_index: number;
    active: boolean;
}

const iconOptions = [
    { value: 'credit-card', label: 'Cartão de Crédito', emoji: '💳' },
    { value: 'sun', label: 'Sol (Energia Solar)', emoji: '☀️' },
    { value: 'shield', label: 'Escudo (Seguro)', emoji: '🛡️' },
    { value: 'check', label: 'Verificado', emoji: '✅' },
    { value: 'bolt', label: 'Raio (Energia)', emoji: '⚡' },
    { value: 'car', label: 'Carro', emoji: '🚗' },
    { value: 'home', label: 'Casa', emoji: '🏠' },
    { value: 'dollar', label: 'Dinheiro', emoji: '💰' },
];

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const supabase = createBrowserClient();
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('order_index', { ascending: true });
                
            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!editingService) return;
        setSaving(true);
        setMessage('');

        try {
            const supabase = createBrowserClient();
            let error;
            
            if (editingService.id) {
                const { error: updateError } = await supabase
                    .from('services')
                    .update({
                        title: editingService.title,
                        description: editingService.description,
                        icon: editingService.icon,
                        order_index: editingService.order_index,
                        active: editingService.active,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingService.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('services')
                    .insert([{
                        title: editingService.title,
                        description: editingService.description,
                        icon: editingService.icon,
                        order_index: editingService.order_index || 0,
                        active: editingService.active !== undefined ? editingService.active : true
                    }]);
                error = insertError;
            }

            if (!error) {
                setMessage('Serviço salvo com sucesso!');
                setShowModal(false);
                setEditingService(null);
                fetchServices();
            } else {
                setMessage('Erro ao salvar serviço.');
                console.error(error);
            }
        } catch (e) {
            setMessage('Erro ao salvar serviço.');
            console.error(e);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);
                
            if (!error) {
                setMessage('Serviço excluído com sucesso!');
                fetchServices();
            } else {
                setMessage('Erro ao excluir serviço.');
                console.error(error);
            }
        } catch (e) {
            setMessage('Erro ao excluir serviço.');
            console.error(e);
        }
    };

    const openNewModal = () => {
        setEditingService({
            id: '',
            title: '',
            description: '',
            icon: 'credit-card',
            order_index: services.length + 1,
            active: true
        });
        setShowModal(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService({ ...service });
        setShowModal(true);
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>
                        Serviços
                    </h1>
                    <button
                        onClick={openNewModal}
                        style={{
                            padding: '0.625rem 1.25rem',
                            background: 'linear-gradient(to right, #FC4C00, #FF7033)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        + Novo Serviço
                    </button>
                </div>
            </div>

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

            {loading ? (
                <p>Carregando...</p>
            ) : services.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Nenhum serviço cadastrado ainda.</p>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                        Execute o script SQL no Supabase para criar a tabela e inserir os dados iniciais.
                    </p>
                </div>
            ) : (
                <div className="admin-services-grid">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.25rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                opacity: service.active ? 1 : 0.6,
                                borderLeft: `4px solid ${service.active ? '#29577E' : '#9ca3af'}`
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '1.75rem' }}>
                                    {iconOptions.find(i => i.value === service.icon)?.emoji || '📦'}
                                </span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '9999px',
                                    background: service.active ? '#d1fae5' : '#fee2e2',
                                    color: service.active ? '#065f46' : '#dc2626'
                                }}>
                                    {service.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.4rem' }}>
                                {service.title}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem', lineHeight: 1.4 }}>
                                {service.description.substring(0, 80)}{service.description.length > 80 ? '...' : ''}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => openEditModal(service)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        background: '#29577E',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Edição */}
            {showModal && editingService && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="admin-modal-content" style={{
                        background: 'white',
                        borderRadius: '1rem',
                        padding: '1.5rem'
                    }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1f2937', marginBottom: '1.25rem' }}>
                            {editingService.id ? 'Editar Serviço' : 'Novo Serviço'}
                        </h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Título</label>
                            <input
                                type="text"
                                value={editingService.title}
                                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                                placeholder="Nome do serviço"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Descrição</label>
                            <textarea
                                value={editingService.description}
                                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                placeholder="Descrição do serviço"
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Ícone</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                                {iconOptions.map((icon) => (
                                    <button
                                        key={icon.value}
                                        type="button"
                                        onClick={() => setEditingService({ ...editingService, icon: icon.value })}
                                        style={{
                                            padding: '0.5rem',
                                            border: `2px solid ${editingService.icon === icon.value ? '#29577E' : '#e5e7eb'}`,
                                            borderRadius: '0.5rem',
                                            background: editingService.icon === icon.value ? '#eef5ff' : 'white',
                                            cursor: 'pointer',
                                            fontSize: '1.25rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.15rem'
                                        }}
                                        title={icon.label}
                                    >
                                        {icon.emoji}
                                        <span style={{ fontSize: '0.55rem', color: '#6b7280' }}>{icon.label.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Ordem</label>
                            <input
                                type="number"
                                value={editingService.order_index}
                                onChange={(e) => setEditingService({ ...editingService, order_index: parseInt(e.target.value) || 0 })}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={editingService.active}
                                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                                    style={{ width: '1.15rem', height: '1.15rem' }}
                                />
                                <span style={{ fontSize: '0.9rem', color: '#374151' }}>Serviço ativo</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => { setShowModal(false); setEditingService(null); }}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !editingService.title || !editingService.description}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: saving ? '#9ca3af' : 'linear-gradient(to right, #FC4C00, #FF7033)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    cursor: saving ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
