'use client';

import { useState } from 'react';
import { createUserAction } from './actions';

export default function UsersPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const result = await createUserAction(formData);

        if (result.error) {
            setMessage({ text: result.error, type: 'error' });
        } else {
            setMessage({ text: 'Usuário criado com sucesso!', type: 'success' });
            setEmail('');
            setPassword('');
        }

        setLoading(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        outline: 'none',
        marginBottom: '1.5rem'
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
                Gerenciar Usuários
            </h1>

            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '500px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#29577E', marginBottom: '1.5rem' }}>
                    Criar Novo Usuário
                </h3>

                <form onSubmit={handleCreateUser}>
                    {message.text && (
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                            color: message.type === 'success' ? '#065f46' : '#dc2626',
                            fontSize: '0.9rem'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="novo.usuario@exemplo.com"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Senha (mínimo 6 caracteres)</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.875rem 2rem',
                            background: loading ? '#9ca3af' : 'linear-gradient(to right, #FC4C00, #FF7033)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Criando...' : 'Criar Usuário'}
                    </button>
                </form>
            </div>
        </div>
    );
}
