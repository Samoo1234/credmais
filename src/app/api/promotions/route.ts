import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Buscar promoção ativa (público)
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar promoção:', error);
        return NextResponse.json({ error: 'Erro ao buscar promoção' }, { status: 500 });
    }
}

// POST - Criar nova promoção (upload da imagem é feito pelo client direto no Storage)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image_url, link_url, is_active } = body;

        if (!image_url) {
            return NextResponse.json({ error: 'URL da imagem é obrigatória' }, { status: 400 });
        }

        // Se ativando esta promoção, desativa todas as outras
        if (is_active) {
            await supabase
                .from('promotions')
                .update({ is_active: false })
                .eq('is_active', true);
        }

        const { data, error } = await supabase
            .from('promotions')
            .insert([{
                image_url,
                link_url: link_url || null,
                is_active: is_active ?? false,
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar promoção:', error);
        return NextResponse.json({ error: 'Erro ao criar promoção' }, { status: 500 });
    }
}

// PUT - Atualizar promoção
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, image_url, link_url, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
        }

        // Se ativando esta promoção, desativa todas as outras
        if (is_active) {
            await supabase
                .from('promotions')
                .update({ is_active: false })
                .neq('id', id);
        }

        const updateData: Record<string, unknown> = {};
        if (image_url !== undefined) updateData.image_url = image_url;
        if (link_url !== undefined) updateData.link_url = link_url;
        if (is_active !== undefined) updateData.is_active = is_active;

        const { data, error } = await supabase
            .from('promotions')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao atualizar promoção:', error);
        return NextResponse.json({ error: 'Erro ao atualizar promoção' }, { status: 500 });
    }
}

// DELETE - Remover promoção e arquivo do Storage
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
        }

        // Busca a promoção para pegar o caminho da imagem
        const { data: promotion } = await supabase
            .from('promotions')
            .select('image_url')
            .eq('id', id)
            .single();

        // Remove a imagem do Storage
        if (promotion?.image_url) {
            const url = new URL(promotion.image_url);
            const pathParts = url.pathname.split('/storage/v1/object/public/promotions/');
            if (pathParts[1]) {
                await supabase.storage.from('promotions').remove([pathParts[1]]);
            }
        }

        // Remove o registro do banco
        const { error } = await supabase
            .from('promotions')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir promoção:', error);
        return NextResponse.json({ error: 'Erro ao excluir promoção' }, { status: 500 });
    }
}
