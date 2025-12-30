import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Buscar configurações
export async function GET() {
    try {
        const supabase = await createServerClient();

        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Erro ao buscar configurações:', error);
            return NextResponse.json(
                { error: 'Erro ao buscar configurações' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: data || {} });
    } catch (error) {
        console.error('Erro na API de settings:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// Atualizar configurações
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const supabase = await createServerClient();

        // Verificar se o usuário está autenticado
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        // Verificar se já existe uma configuração
        const { data: existing } = await supabase
            .from('settings')
            .select('id')
            .single();

        let result;
        if (existing) {
            // Atualizar
            result = await supabase
                .from('settings')
                .update({ ...body, updated_at: new Date().toISOString() })
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Criar
            result = await supabase
                .from('settings')
                .insert([body])
                .select()
                .single();
        }

        if (result.error) {
            console.error('Erro ao salvar configurações:', result.error);
            return NextResponse.json(
                { error: 'Erro ao salvar configurações' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: result.data });
    } catch (error) {
        console.error('Erro na API de settings:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
