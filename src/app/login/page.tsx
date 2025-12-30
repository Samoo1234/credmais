'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('E-mail ou senha incorretos');
            setLoading(false);
            return;
        }

        router.push('/admin');
        router.refresh();
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #29577E 0%, #0f2438 100%)',
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#29577E',
                    textAlign: 'center',
                    marginBottom: '0.5rem'
                }}>
                    Painel Administrativo
                </h1>
                <p style={{
                    color: '#6b7280',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    Faça login para acessar
                </p>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            background: loading ? '#9ca3af' : 'linear-gradient(to right, #FC4C00, #FF7033)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
