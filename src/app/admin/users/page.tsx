'use client';

import { useState, useEffect } from 'react';
import { createUserAction, listUsersAction } from './actions';

export default function UsersPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        const result = await listUsersAction();
        if (result.success && result.users) {
            setUsers(result.users);
        }
        setLoadingUsers(false);
    };

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
            fetchUsers(); // Atualiza a lista após criar
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

            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '700px', marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#29577E', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Usuários Cadastrados
                    <span style={{ fontSize: '0.875rem', background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '999px', color: '#4b5563' }}>
                        Total: {users.length}
                    </span>
                </h3>

                {loadingUsers ? (
                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>Carregando lista de usuários...</p>
                ) : users.length === 0 ? (
                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>Nenhum usuário encontrado.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {users.map((user) => (
                            <div key={user.id} style={{ 
                                padding: '1rem', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '0.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 500, color: '#1f2937' }}>{user.email}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                        Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        background: '#d1fae5', 
                                        color: '#065f46',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        fontWeight: 500
                                    }}>
                                        Ativo
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
