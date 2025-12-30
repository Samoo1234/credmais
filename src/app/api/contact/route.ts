import { createClient as createServerClient } from '@/lib/supabase/server';
import { sendLeadNotification } from '@/lib/resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, service, message } = body;

        // Validação básica
        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e e-mail são obrigatórios' },
                { status: 400 }
            );
        }

        const supabase = await createServerClient();

        // Salvar lead no banco
        const { data, error } = await supabase
            .from('leads')
            .insert([{ name, email, phone, service, message }])
            .select()
            .single();

        if (error) {
            console.error('Erro ao salvar lead:', error);
            return NextResponse.json(
                { error: 'Erro ao salvar contato' },
                { status: 500 }
            );
        }

        // Enviar e-mail de notificação
        await sendLeadNotification({ name, email, phone, service, message });

        return NextResponse.json(
            { message: 'Contato recebido com sucesso!', data },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erro na API de contato:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
