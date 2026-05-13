import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('solar_energy_section')
            .select('*')
            .single();

        if (error) {
            console.error('Erro ao buscar dados de solar_energy_section:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro interno:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, badge_text, title, description, steps } = body;

        let query;
        if (id) {
            query = supabase
                .from('solar_energy_section')
                .update({ badge_text, title, description, steps, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
        } else {
            // Se não houver ID, tenta atualizar o primeiro registro existente
            const { data: existingData } = await supabase.from('solar_energy_section').select('id').single();
            
            if (existingData?.id) {
                query = supabase
                    .from('solar_energy_section')
                    .update({ badge_text, title, description, steps, updated_at: new Date().toISOString() })
                    .eq('id', existingData.id)
                    .select()
                    .single();
            } else {
                // Se não houver nenhum registro, cria um novo
                query = supabase
                    .from('solar_energy_section')
                    .insert([{ badge_text, title, description, steps }])
                    .select()
                    .single();
            }
        }

        const { data, error } = await query;

        if (error) {
            console.error('Erro ao atualizar solar_energy_section:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro interno:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
