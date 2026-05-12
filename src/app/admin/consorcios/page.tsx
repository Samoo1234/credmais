'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface ConsorcioCard {
    id: string;
    category: 'carros' | 'motos' | 'imoveis';
    title: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
    created_at: string;
    installment_text: string | null;
    installment_value: string | null;
    installment_obs: string | null;
}

export default function AdminConsorcioCards() {
    const [cards, setCards] = useState<ConsorcioCard[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [showModal, setShowModal] = useState(false);
    const [editingCard, setEditingCard] = useState<ConsorcioCard | null>(null);
    const [formData, setFormData] = useState({
        category: 'carros',
        title: '',
        link_url: '#',
        is_active: true,
        installment_text: '',
        installment_value: '',
        installment_obs: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const supabase = createBrowserClient();
            const { data, error } = await supabase
                .from('consorcio_cards')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            if (data) setCards(data);
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao carregar cards');
        }
        setLoading(false);
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showMessage('error', 'Formato inválido. Use apenas imagens (JPG, PNG, WebP).');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { 
            showMessage('error', 'O arquivo é muito grande. O limite é 5MB.');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let finalImageUrl = editingCard?.image_url || '';

            // Se selecionou um novo arquivo, faz o upload
            if (selectedFile) {
                const supabase = createBrowserClient();
                const ext = selectedFile.name.split('.').pop();
                const fileName = `consorcio_${Date.now()}.${ext}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('consorcio_cards')
                    .upload(fileName, selectedFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('consorcio_cards')
                    .getPublicUrl(fileName);

                finalImageUrl = urlData.publicUrl;
            }

            if (!finalImageUrl) {
                showMessage('error', 'Você precisa selecionar uma imagem para o card.');
                setUploading(false);
                return;
            }

            const supabase = createBrowserClient();
            let err;
            if (editingCard) {
                const { error } = await supabase
                    .from('consorcio_cards')
                    .update({
                        category: formData.category,
                        title: formData.title,
                        link_url: formData.link_url,
                        is_active: formData.is_active,
                        image_url: finalImageUrl,
                        installment_text: formData.installment_text,
                        installment_value: formData.installment_value,
                        installment_obs: formData.installment_obs
                    })
                    .eq('id', editingCard.id);
                err = error;
            } else {
                const { error } = await supabase
                    .from('consorcio_cards')
                    .insert([{
                        category: formData.category,
                        title: formData.title,
                        link_url: formData.link_url,
                        is_active: formData.is_active,
                        image_url: finalImageUrl,
                        installment_text: formData.installment_text,
                        installment_value: formData.installment_value,
                        installment_obs: formData.installment_obs
                    }]);
                err = error;
            }

            if (err) throw err;

            showMessage('success', editingCard ? 'Card atualizado com sucesso!' : 'Card criado com sucesso!');
            closeModal();
            fetchCards();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao salvar o card. Tente novamente.');
        }
        setUploading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este card?')) return;

        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('consorcio_cards')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showMessage('success', 'Card excluído!');
            fetchCards();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao excluir card');
        }
    };

    const toggleActive = async (card: ConsorcioCard) => {
        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('consorcio_cards')
                .update({ is_active: !card.is_active })
                .eq('id', card.id);

            if (error) throw error;
            fetchCards();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao atualizar status');
        }
    };

    const openModal = (card?: ConsorcioCard) => {
        if (card) {
            setEditingCard(card);
            setFormData({
                category: card.category,
                title: card.title,
                link_url: card.link_url,
                is_active: card.is_active,
                installment_text: card.installment_text || '',
                installment_value: card.installment_value || '',
                installment_obs: card.installment_obs || ''
            });
            setPreviewUrl(card.image_url);
        } else {
            setEditingCard(null);
            setFormData({
                category: 'carros',
                title: '',
                link_url: '#',
                is_active: true,
                installment_text: '',
                installment_value: '',
                installment_obs: ''
            });
            setPreviewUrl(null);
        }
        setSelectedFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCard(null);
        setPreviewUrl(null);
        setSelectedFile(null);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                        🏠 Gerenciar Cards de Consórcios
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Gerencie os cards que aparecem no Mega Menu em "Consórcios".
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#FC4C00',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    + Novo Card
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <p>Carregando...</p>
                ) : cards.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>Nenhum card cadastrado.</p>
                ) : (
                    cards.map(card => (
                        <div key={card.id} style={{
                            background: 'white',
                            borderRadius: '1rem',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            border: `2px solid ${card.is_active ? 'transparent' : '#fee2e2'}`,
                            opacity: card.is_active ? 1 : 0.7
                        }}>
                            <div style={{ height: '180px', position: 'relative', background: '#f3f4f6' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={card.image_url} 
                                    alt={card.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    {card.category}
                                </div>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{card.title}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    Link: {card.link_url}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        onClick={() => toggleActive(card)}
                                        style={{ flex: 1, padding: '0.5rem', background: card.is_active ? '#fee2e2' : '#dcfce7', color: card.is_active ? '#991b1b' : '#166534', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                    >
                                        {card.is_active ? 'Desativar' : 'Ativar'}
                                    </button>
                                    <button 
                                        onClick={() => openModal(card)}
                                        style={{ flex: 1, padding: '0.5rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(card.id)}
                                        style={{ padding: '0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Excluir"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '1rem', padding: '2rem',
                        width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            {editingCard ? 'Editar Card' : 'Novo Card'}
                        </h2>

                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Categoria</label>
                                <select 
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value as 'carros' | 'motos' | 'imoveis'})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    required
                                >
                                    <option value="carros">Carros</option>
                                    <option value="motos">Motos</option>
                                    <option value="imoveis">Imóveis</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Título</label>
                                <input 
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    placeholder="Ex: SUV, Casa..."
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Link de Destino</label>
                                <input 
                                    type="text"
                                    value={formData.link_url}
                                    onChange={e => setFormData({...formData, link_url: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    placeholder="Ex: #suvs, /contato..."
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Texto Auxiliar</label>
                                    <input 
                                        type="text"
                                        value={formData.installment_text}
                                        onChange={e => setFormData({...formData, installment_text: e.target.value})}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                        placeholder="Ex: Parcelas a partir de"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Valor da Parcela</label>
                                    <input 
                                        type="text"
                                        value={formData.installment_value}
                                        onChange={e => setFormData({...formData, installment_value: e.target.value})}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                        placeholder="Ex: R$ 247,12*"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Observação Adicional</label>
                                <input 
                                    type="text"
                                    value={formData.installment_obs}
                                    onChange={e => setFormData({...formData, installment_obs: e.target.value})}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    placeholder="Ex: com Seguro de Vida em Grupo"
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                    Imagem (Proporção 5x6 recomendada)
                                </label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1rem',
                                        textAlign: 'center', cursor: 'pointer', background: '#f9fafb'
                                    }}
                                >
                                    <input 
                                        type="file" ref={fileInputRef} onChange={handleFileSelect}
                                        accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
                                    />
                                    {previewUrl ? (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={previewUrl} alt="Preview" style={{ height: '150px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                                        </div>
                                    ) : (
                                        <p style={{ color: '#6b7280', margin: 0 }}>Clique para escolher uma imagem (JPG, PNG)</p>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    style={{ padding: '0.75rem 1.5rem', background: '#f3f4f6', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    style={{ padding: '0.75rem 1.5rem', background: '#29577E', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                                >
                                    {uploading ? 'Salvando...' : 'Salvar Card'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
