'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface Promotion {
    id: string;
    image_url: string;
    link_url: string | null;
    is_active: boolean;
    created_at: string;
}

export default function AdminPromotions() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            showMessage('error', 'Erro ao carregar promoções');
            console.error(error);
        } else {
            setPromotions(data || []);
        }
        setLoading(false);
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showMessage('error', 'Formato inválido. Use JPG, PNG ou WebP.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showMessage('error', 'Imagem muito grande. Máximo 10MB.');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const supabase = createBrowserClient();

            // Upload to Storage
            const fileName = `promo_${Date.now()}_${selectedFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('promotions')
                .upload(fileName, selectedFile);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('promotions')
                .getPublicUrl(fileName);

            // Create promotion record directly
            const { error: insertError } = await supabase
                .from('promotions')
                .insert([{
                    image_url: urlData.publicUrl,
                    link_url: linkUrl || null,
                    is_active: true,
                }]);

            if (insertError) throw insertError;

            showMessage('success', 'Promoção criada com sucesso!');
            setSelectedFile(null);
            setPreviewUrl(null);
            setLinkUrl('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchPromotions();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao fazer upload');
        }
        setUploading(false);
    };

    const toggleActive = async (id: string, currentActive: boolean) => {
        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('promotions')
                .update({ is_active: !currentActive })
                .eq('id', id);

            if (error) throw error;

            showMessage('success', !currentActive ? 'Promoção ativada!' : 'Promoção desativada!');
            fetchPromotions();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao atualizar promoção');
        }
    };

    const deletePromotion = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta promoção?')) return;

        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('promotions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showMessage('success', 'Promoção excluída!');
            fetchPromotions();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao excluir promoção');
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem' }}>
                📢 Gerenciar Promoções
            </h1>

            {/* Mensagem de feedback */}
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

            {/* Upload Section */}
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem',
            }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
                    Nova Promoção
                </h2>

                {/* Drop zone */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: '2px dashed #d1d5db',
                        borderRadius: '0.75rem',
                        padding: '2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#f9fafb',
                        transition: 'all 0.2s',
                        marginBottom: '1rem',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#FC4C00';
                        e.currentTarget.style.background = '#fff7ed';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.background = '#f9fafb';
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🖼️</span>
                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                        Clique para selecionar uma imagem
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        JPG, PNG ou WebP — máx. 10MB
                    </p>
                </div>

                {/* Preview */}
                {previewUrl && (
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Preview:
                        </p>
                        <div style={{
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb',
                            maxWidth: '400px',
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </div>
                )}

                {/* Link field */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#374151', fontWeight: 500, marginBottom: '0.35rem' }}>
                        Link ao clicar (opcional)
                    </label>
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://wa.me/5511999999999"
                        style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>

                {/* Upload button */}
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: !selectedFile || uploading ? '#d1d5db' : 'linear-gradient(to right, #FC4C00, #FF7033)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: !selectedFile || uploading ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                    }}
                >
                    {uploading ? 'Enviando...' : '📤 Publicar Promoção'}
                </button>
            </div>

            {/* Promotions List */}
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
                    Promoções Cadastradas
                </h2>

                {loading ? (
                    <p style={{ color: '#6b7280' }}>Carregando...</p>
                ) : promotions.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Nenhuma promoção cadastrada ainda.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {promotions.map((promo) => (
                            <div
                                key={promo.id}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.75rem',
                                    borderLeft: `4px solid ${promo.is_active ? '#10b981' : '#d1d5db'}`,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {/* Thumbnail */}
                                <div style={{
                                    width: '100px',
                                    height: '70px',
                                    borderRadius: '0.5rem',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    background: '#f3f4f6',
                                }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={promo.image_url}
                                        alt="Promoção"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        background: promo.is_active ? '#dcfce7' : '#f3f4f6',
                                        color: promo.is_active ? '#166534' : '#6b7280',
                                        marginBottom: '0.35rem',
                                    }}>
                                        {promo.is_active ? '✅ Ativa' : '⏸️ Inativa'}
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                        {new Date(promo.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                    {promo.link_url && (
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', wordBreak: 'break-all' }}>
                                            🔗 {promo.link_url}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button
                                        onClick={() => toggleActive(promo.id, promo.is_active)}
                                        style={{
                                            padding: '0.5rem 0.85rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            background: 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {promo.is_active ? '⏸️ Desativar' : '▶️ Ativar'}
                                    </button>
                                    <button
                                        onClick={() => deletePromotion(promo.id)}
                                        style={{
                                            padding: '0.5rem 0.85rem',
                                            border: '1px solid #fca5a5',
                                            borderRadius: '0.5rem',
                                            background: '#fef2f2',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        🗑️ Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
