import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Buscar cards ativos (se category for passada) ou todos
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const activeOnly = searchParams.get('activeOnly') === 'true';

        let query = supabase
            .from('vehicle_cards')
            .select('*')
            .order('created_at', { ascending: true });

        if (category) {
            query = query.eq('category', category);
        }

        if (activeOnly) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar vehicle_cards:', error);
        return NextResponse.json({ error: 'Erro ao buscar vehicle_cards' }, { status: 500 });
    }
}

// POST - Criar novo card
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, title, image_url, link_url, is_active } = body;

        if (!category || !title) {
            return NextResponse.json({ error: 'Categoria e título são obrigatórios' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('vehicle_cards')
            .insert([{
                category,
                title,
                image_url,
                link_url: link_url || '#',
                is_active: is_active ?? true,
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar vehicle_cards:', error);
        return NextResponse.json({ error: 'Erro ao criar vehicle_cards' }, { status: 500 });
    }
}

// PUT - Atualizar card
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, category, title, image_url, link_url, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('vehicle_cards')
            .update({
                category,
                title,
                image_url,
                link_url,
                is_active
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao atualizar vehicle_cards:', error);
        return NextResponse.json({ error: 'Erro ao atualizar vehicle_cards' }, { status: 500 });
    }
}

// DELETE - Remover card e imagem do Storage
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
        }

        // Busca o registro para pegar o caminho da imagem
        const { data: card } = await supabase
            .from('vehicle_cards')
            .select('image_url')
            .eq('id', id)
            .single();

        // Remove do Storage
        if (card?.image_url) {
            const url = new URL(card.image_url);
            const pathParts = url.pathname.split('/storage/v1/object/public/vehicle_cards/');
            if (pathParts[1]) {
                await supabase.storage.from('vehicle_cards').remove([pathParts[1]]);
            }
        }

        // Remove do banco
        const { error } = await supabase
            .from('vehicle_cards')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir vehicle_cards:', error);
        return NextResponse.json({ error: 'Erro ao excluir vehicle_cards' }, { status: 500 });
    }
}
