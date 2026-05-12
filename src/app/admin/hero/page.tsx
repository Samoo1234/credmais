'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface HeroMedia {
    id: string;
    media_url: string;
    media_type: 'image' | 'video';
    is_active: boolean;
    created_at: string;
}

export default function AdminHero() {
    const [mediaItems, setMediaItems] = useState<HeroMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<'image' | 'video' | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
            .from('hero_media')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            showMessage('error', 'Erro ao carregar mídias');
            console.error(error);
        } else {
            setMediaItems(data || []);
        }
        setLoading(false);
    };

    const showMessage = (type: 'success' | 'error' | 'warning', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
            showMessage('error', 'Formato inválido. Use JPG, PNG, WebP ou MP4/WebM.');
            return;
        }

        // Limit checking => ~50MB is safe for free supabase, video can be large so we put a logical hard cap just to warn.
        if (file.size > 50 * 1024 * 1024) { 
            showMessage('error', 'O arquivo ultrapassa 50MB. O Supabase gratuito pode rejeitar.');
            return;
        } else if (file.size > 15 * 1024 * 1024) {
            showMessage('warning', 'O arquivo tem mais de 15MB. Pode demorar para carregar nos celulares dos clientes.');
        } else {
            setMessage(null); // Clear previous errors or warnings if ok
        }

        setSelectedFile(file);
        setPreviewType(isVideo ? 'video' : 'image');
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile || !previewType) return;

        setUploading(true);
        try {
            const supabase = createBrowserClient();

            // Upload to Storage
            const ext = selectedFile.name.split('.').pop();
            const fileName = `hero_${Date.now()}.${ext}`;
            
            const { error: uploadError } = await supabase.storage
                .from('hero_media')
                .upload(fileName, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('hero_media')
                .getPublicUrl(fileName);

            // Create media record directly
            const { error: insertError } = await supabase
                .from('hero_media')
                .insert([{
                    media_url: urlData.publicUrl,
                    media_type: previewType,
                    is_active: true,
                }]);

            if (insertError) throw insertError;

            showMessage('success', 'Mídia enviada e ativada com sucesso!');
            setSelectedFile(null);
            setPreviewUrl(null);
            setPreviewType(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchMedia();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao fazer upload. Verifique limite de tamanho (> 50MB) ou internet.');
        }
        setUploading(false);
    };

    const toggleActive = async (id: string, currentActive: boolean) => {
        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('hero_media')
                .update({ is_active: !currentActive })
                .eq('id', id);

            if (error) throw error;

            showMessage('success', !currentActive ? 'Mídia adicionada ao carrossel!' : 'Mídia removida do carrossel!');
            fetchMedia();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao atualizar status');
        }
    };

    const deleteMedia = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta mídia definitivamente?')) return;

        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('hero_media')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showMessage('success', 'Mídia excluída!');
            fetchMedia();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Erro ao excluir mídia');
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                🎬 Gerenciar Carrossel (Hero)
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Os arquivos ativos serão exibidos como um carrossel no topo do site (seção Hero), alternando a cada 30 segundos.
            </p>

            {/* Aviso global sobre vídeos */}
            <div style={{
                background: '#eff6ff',
                borderLeft: '4px solid #3b82f6',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: '#1e3a8a'
            }}>
                <strong>Dica:</strong> Se for usar vídeo, o ideal são arquivos de 10s a 20s em MP4 (sem som) de pelo menos 1920x1080 (Full HD). 
                Arquivos menores que 15MB garantem carregamento super rápido no celular do cliente. O limite técnico do seu plano é 50MB.
            </div>

            {/* Mensagem de feedback */}
            {message && (
                <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    background: message.type === 'success' ? '#dcfce7' : (message.type === 'warning' ? '#fef08a' : '#fee2e2'),
                    color: message.type === 'success' ? '#166534' : (message.type === 'warning' ? '#854d0e' : '#991b1b'),
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
                    Enviar Nova Imagem ou Vídeo
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
                        e.currentTarget.style.borderColor = '#29577E';
                        e.currentTarget.style.background = '#f0f9ff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.background = '#f9fafb';
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🎥</span>
                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                        Clique para selecionar um arquivo
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        JPG, PNG, WebP ou MP4 — máx. 50MB (Ideal &lt; 15MB)
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
                            background: 'black',
                        }}>
                            {previewType === 'video' ? (
                                <video 
                                    src={previewUrl} 
                                    autoPlay 
                                    loop 
                                    muted 
                                    style={{ width: '100%', height: 'auto', display: 'block' }} 
                                />
                            ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Upload button */}
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: !selectedFile || uploading ? '#d1d5db' : '#29577E',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: !selectedFile || uploading ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        width: '100%'
                    }}
                >
                    {uploading ? 'Enviando (Isso pode demorar dependendo do tamanho)...' : '📤 Enviar e Adicionar ao Carrossel'}
                </button>
            </div>

            {/* Media List */}
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
                    Arquivos Enviados
                </h2>

                {loading ? (
                    <p style={{ color: '#6b7280' }}>Carregando...</p>
                ) : mediaItems.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Nenhuma mídia enviada ainda.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {mediaItems.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.75rem',
                                    borderLeft: `4px solid ${item.is_active ? '#10b981' : '#d1d5db'}`,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {/* Thumbnail / Preview small */}
                                <div style={{
                                    width: '120px',
                                    height: '70px',
                                    borderRadius: '0.5rem',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    background: '#000',
                                    position: 'relative'
                                }}>
                                    {item.media_type === 'video' ? (
                                        <video
                                            src={item.media_url}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                opacity: 0.8
                                            }}
                                        />
                                    ) : (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={item.media_url}
                                            alt="Hero BD"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                    {item.media_type === 'video' && (
                                        <div style={{ position: 'absolute', bottom: '2px', right: '4px', fontSize: '10px', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px' }}>
                                            VIDEO
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        background: item.is_active ? '#dcfce7' : '#f3f4f6',
                                        color: item.is_active ? '#166534' : '#6b7280',
                                        marginBottom: '0.35rem',
                                    }}>
                                        {item.is_active ? '✅ No Carrossel' : '⏸️ Inativo'}
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                        Enviado em: {new Date(item.created_at).toLocaleDateString('pt-BR')} 
                                    </p>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button
                                        onClick={() => toggleActive(item.id, item.is_active)}
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
                                        {item.is_active ? '✅ No Carrossel' : '▶️ Adicionar'}
                                    </button>
                                    <button
                                        onClick={() => deleteMedia(item.id)}
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
