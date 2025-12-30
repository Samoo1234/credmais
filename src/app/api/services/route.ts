import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Listar todos os serviços
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 });
    }
}

// POST - Criar novo serviço
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, icon, order_index, active } = body;

        const { data, error } = await supabase
            .from('services')
            .insert([{
                title,
                description,
                icon,
                order_index: order_index || 0,
                active: active !== undefined ? active : true
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 });
    }
}

// PUT - Atualizar serviço existente
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, description, icon, order_index, active } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('services')
            .update({
                title,
                description,
                icon,
                order_index,
                active,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        return NextResponse.json({ error: 'Erro ao atualizar serviço' }, { status: 500 });
    }
}

// DELETE - Remover serviço
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
        }

        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        return NextResponse.json({ error: 'Erro ao excluir serviço' }, { status: 500 });
    }
}
