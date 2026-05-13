'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Step {
    number: string;
    title: string;
    description: string;
    icon: string;
}

interface SolarEnergyData {
    id?: string;
    badge_text: string;
    title: string;
    description: string;
    steps: Step[];
}

export default function SolarEnergyAdmin() {
    const [data, setData] = useState<SolarEnergyData>({
        badge_text: '',
        title: '',
        description: '',
        steps: [
            { number: '1', title: '', description: '', icon: 'sun' },
            { number: '2', title: '', description: '', icon: 'house' },
            { number: '3', title: '', description: '', icon: 'refresh' }
        ]
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/solar-energy');
            if (response.ok) {
                const fetchedData = await response.json();
                if (fetchedData) {
                    setData({
                        id: fetchedData.id,
                        badge_text: fetchedData.badge_text || '',
                        title: fetchedData.title || '',
                        description: fetchedData.description || '',
                        steps: fetchedData.steps && fetchedData.steps.length > 0 ? fetchedData.steps : [
                            { number: '1', title: '', description: '', icon: 'sun' },
                            { number: '2', title: '', description: '', icon: 'house' },
                            { number: '3', title: '', description: '', icon: 'refresh' }
                        ]
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
            const response = await fetch('/api/solar-energy', {
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

    const updateStep = (index: number, field: keyof Step, value: string) => {
        setData(prev => {
            const newSteps = [...prev.steps];
            newSteps[index] = { ...newSteps[index], [field]: value };
            return { ...prev, steps: newSteps };
        });
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
                        ☀️ Editar Energia Solar
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Gerencie os textos principais e os 3 passos da seção Assinatura de Energia Solar.
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
                    <label style={labelStyle}>Rótulo / Badge Superior</label>
                    <input
                        type="text"
                        value={data.badge_text}
                        onChange={e => setData({ ...data, badge_text: e.target.value })}
                        style={inputStyle}
                        placeholder="Ex: Sustentabilidade"
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Título Principal</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={e => setData({ ...data, title: e.target.value })}
                        style={inputStyle}
                        placeholder="Ex: Assinatura de Energia Solar"
                    />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Descrição Detalhada</label>
                    <textarea
                        value={data.description}
                        onChange={e => setData({ ...data, description: e.target.value })}
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        placeholder="Escreva um texto apresentando o serviço..."
                    />
                </div>
            </div>

            <div style={sectionStyle}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                    Passo a Passo (3 Etapas Fitas)
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {data.steps.map((step, index) => (
                        <div key={index} style={{ display: 'flex', gap: '1rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#e5e7eb', width: '3rem', textAlign: 'center', lineHeight: 1 }}>
                                {step.number}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <input
                                    type="text"
                                    value={step.title}
                                    onChange={e => updateStep(index, 'title', e.target.value)}
                                    style={inputStyle}
                                    placeholder={`Título do passo ${index + 1}`}
                                />
                                <textarea
                                    value={step.description}
                                    onChange={e => updateStep(index, 'description', e.target.value)}
                                    rows={3}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                    placeholder={`Descrição do passo ${index + 1}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
