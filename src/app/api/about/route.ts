import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Buscar dados da seção About
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('about_section')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

        if (error) {
            // Se não houver dados, retorna vazio em vez de estourar erro 500
            if (error.code === 'PGRST116') {
                 return NextResponse.json(null);
            }
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao buscar about_section:', error);
        return NextResponse.json({ error: 'Erro ao buscar about_section' }, { status: 500 });
    }
}

// PUT - Atualizar dados da seção About
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, description, features, stats } = body;

        if (!title || !description) {
            return NextResponse.json({ error: 'Título e descrição são obrigatórios' }, { status: 400 });
        }

        let query;

        if (id) {
            // Atualizar existente
            query = supabase
                .from('about_section')
                .update({ 
                    title, 
                    description, 
                    features: features || [], 
                    stats: stats || [],
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);
        } else {
            // Criar novo caso não exista
            query = supabase
                .from('about_section')
                .insert([{ 
                    title, 
                    description, 
                    features: features || [], 
                    stats: stats || [] 
                }]);
        }

        const { data, error } = await query.select().single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao atualizar about_section:', error);
        return NextResponse.json({ error: 'Erro ao atualizar about_section' }, { status: 500 });
    }
}
