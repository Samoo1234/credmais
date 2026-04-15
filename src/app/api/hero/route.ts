import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Buscar mídia hero ativa
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('hero_media')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar hero_media:', error);
        return NextResponse.json({ error: 'Erro ao buscar hero_media' }, { status: 500 });
    }
}

// POST - Criar novo hero_media
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { media_url, media_type, is_active } = body;

        if (!media_url || !media_type) {
            return NextResponse.json({ error: 'URL da mídia e tipo são obrigatórios' }, { status: 400 });
        }

        // Se ativando esta mídia, desativa todas as outras
        if (is_active) {
            await supabase
                .from('hero_media')
                .update({ is_active: false })
                .eq('is_active', true);
        }

        const { data, error } = await supabase
            .from('hero_media')
            .insert([{
                media_url,
                media_type,
                is_active: is_active ?? false,
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar hero_media:', error);
        return NextResponse.json({ error: 'Erro ao criar hero_media' }, { status: 500 });
    }
}

// PUT - Atualizar hero_media
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
        }

        // Se ativando esta, desativa todas as outras
        if (is_active) {
            await supabase
                .from('hero_media')
                .update({ is_active: false })
                .neq('id', id);
        }

        const { data, error } = await supabase
            .from('hero_media')
            .update({ is_active })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao atualizar hero_media:', error);
        return NextResponse.json({ error: 'Erro ao atualizar hero_media' }, { status: 500 });
    }
}

// DELETE - Remover hero_media e arquivo do Storage
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
        }

        // Busca o registro para pegar o caminho da mídia
        const { data: heroMedia } = await supabase
            .from('hero_media')
            .select('media_url')
            .eq('id', id)
            .single();

        // Remove do Storage
        if (heroMedia?.media_url) {
            const url = new URL(heroMedia.media_url);
            const pathParts = url.pathname.split('/storage/v1/object/public/hero_media/');
            if (pathParts[1]) {
                await supabase.storage.from('hero_media').remove([pathParts[1]]);
            }
        }

        // Remove do banco
        const { error } = await supabase
            .from('hero_media')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir hero_media:', error);
        return NextResponse.json({ error: 'Erro ao excluir hero_media' }, { status: 500 });
    }
}
