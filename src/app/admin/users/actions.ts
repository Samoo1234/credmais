'use server';

import { createClient } from '@supabase/supabase-js';

// Função auxiliar para inicializar o cliente Supabase de administração
// Importante: Nunca use isso no cliente, pois o service_role bypassa o RLS
const createAdminClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};

export async function createUserAction(formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return { error: 'E-mail e senha são obrigatórios.' };
        }

        if (password.length < 6) {
            return { error: 'A senha deve ter pelo menos 6 caracteres.' };
        }

        const supabaseAdmin = createAdminClient();

        // Cria o usuário via Admin API
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true, // Auto-confirmar o e-mail se necessário
        });

        if (error) {
            console.error('Erro ao criar usuário:', error);
            return { error: error.message };
        }

        return { success: true, user: data.user };
    } catch (err: any) {
        console.error('Erro interno ao criar usuário:', err);
        return { error: 'Erro interno ao processar a solicitação.' };
    }
}
