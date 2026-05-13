'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Feature {
    title: string;
    description: string;
}

interface Stat {
    number: string;
    label: string;
}

interface AboutData {
    id?: string;
    title: string;
    description: string;
    features: Feature[];
    stats: Stat[];
}

export default function AboutAdmin() {
    const [data, setData] = useState<AboutData>({
        title: '',
        description: '',
        features: [],
        stats: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/about');
            if (response.ok) {
                const fetchedData = await response.json();
                if (fetchedData) {
                    setData({
                        id: fetchedData.id,
                        title: fetchedData.title || '',
                        description: fetchedData.description || '',
                        features: fetchedData.features || [],
                        stats: fetchedData.stats || []
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            showMessage('Erro ao carregar os dados. Tente novamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch('/api/about', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Erro ao salvar');

            const savedData = await response.json();
            setData(prev => ({ ...prev, id: savedData.id }));
            showMessage('Dados salvos com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showMessage('Erro ao salvar as alterações.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    // Funções para manipular Diferenciais (Features)
    const addFeature = () => {
        setData(prev => ({
            ...prev,
            features: [...prev.features, { title: '', description: '' }]
        }));
    };

    const updateFeature = (index: number, field: keyof Feature, value: string) => {
        setData(prev => {
            const newFeatures = [...prev.features];
            newFeatures[index] = { ...newFeatures[index], [field]: value };
            return { ...prev, features: newFeatures };
        });
    };

    const removeFeature = (index: number) => {
        setData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    // Funções para manipular Estatísticas (Stats)
    const addStat = () => {
        setData(prev => ({
            ...prev,
            stats: [...prev.stats, { number: '', label: '' }]
        }));
    };

    const updateStat = (index: number, field: keyof Stat, value: string) => {
        setData(prev => {
            const newStats = [...prev.stats];
            newStats[index] = { ...newStats[index], [field]: value };
            return { ...prev, stats: newStats };
        });
    };

    const removeStat = (index: number) => {
        setData(prev => ({
            ...prev,
            stats: prev.stats.filter((_, i) => i !== index)
        }));
    };

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Carregando...</div>;
    }

    const inputStyle = {
        width: '100%', 
        padding: '0.75rem', 
        borderRadius: '0.5rem', 
        border: '1px solid #d1d5db',
        fontFamily: 'inherit',
        fontSize: '0.95rem'
    };

    const labelStyle = {
        display: 'block', 
        fontSize: '0.875rem', 
        fontWeight: 600, 
        marginBottom: '0.5rem',
        color: '#374151'
    };

    const sectionStyle = {
        background: 'white', 
        borderRadius: '1rem', 
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                        ℹ️ Editar Seção "Sobre"
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Gerencie os textos principais, diferenciais e as estatísticas que aparecem na landing page.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/admin" style={{
                        padding: '0.75rem 1.5rem',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        Voltar
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#FC4C00',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: 600,
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            opacity: isSaving ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        💾 {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                }}>
                    {message.text}
                </div>
            )}

            <div style={sectionStyle}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                    Textos Principais
                </h2>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Título Principal</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={e => setData({ ...data, title: e.target.value })}
                        style={inputStyle}
                        placeholder="Ex: Por que escolher a Cred Mais?"
                    />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Descrição Detalhada</label>
                    <textarea
                        value={data.description}
                        onChange={e => setData({ ...data, description: e.target.value })}
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        placeholder="Escreva um texto apresentando a empresa..."
                    />
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                        Diferenciais (Ícones ✓)
                    </h2>
                    <button 
                        onClick={addFeature} 
                        style={{ background: 'transparent', border: 'none', color: '#FC4C00', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        ➕ Adicionar
                    </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.features.map((feature, index) => (
                        <div key={index} style={{ display: 'flex', gap: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <input
                                    type="text"
                                    value={feature.title}
                                    onChange={e => updateFeature(index, 'title', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Título do diferencial (ex: Agilidade)"
                                />
                                <input
                                    type="text"
                                    value={feature.description}
                                    onChange={e => updateFeature(index, 'description', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Descrição curta"
                                />
                            </div>
                            <button 
                                onClick={() => removeFeature(index)} 
                                style={{ padding: '0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'fit-content' }}
                                title="Remover diferencial"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                    {data.features.length === 0 && (
                        <p style={{ color: '#6b7280', fontStyle: 'italic', margin: 0 }}>Nenhum diferencial adicionado.</p>
                    )}
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                        Estatísticas (Caixas Azuis)
                    </h2>
                    <button 
                        onClick={addStat} 
                        style={{ background: 'transparent', border: 'none', color: '#FC4C00', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        ➕ Adicionar
                    </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                    {data.stats.map((stat, index) => (
                        <div key={index} style={{ display: 'flex', gap: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', alignItems: 'center' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <input
                                    type="text"
                                    value={stat.number}
                                    onChange={e => updateStat(index, 'number', e.target.value)}
                                    style={{ ...inputStyle, fontWeight: 'bold', color: '#FC4C00' }}
                                    placeholder="Número (ex: 1000+)"
                                />
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={e => updateStat(index, 'label', e.target.value)}
                                    style={inputStyle}
                                    placeholder="Rótulo (ex: Clientes Satisfeitos)"
                                />
                            </div>
                            <button 
                                onClick={() => removeStat(index)} 
                                style={{ padding: '0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Remover estatística"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                    {data.stats.length === 0 && (
                        <p style={{ color: '#6b7280', fontStyle: 'italic', margin: 0, gridColumn: '1 / -1' }}>Nenhuma estatística adicionada.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
