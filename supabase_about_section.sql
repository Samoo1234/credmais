-- Criação da tabela about_section
CREATE TABLE IF NOT EXISTS public.about_section (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    stats JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de RLS (Row Level Security)
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública
CREATE POLICY "Enable read access for all users" ON public.about_section
    FOR SELECT USING (true);

-- Política de inserção e atualização (simplificada para administradores)
CREATE POLICY "Enable insert for authenticated users only" ON public.about_section
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Enable update for authenticated users only" ON public.about_section
    FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Inserir dados iniciais caso a tabela esteja vazia
INSERT INTO public.about_section (title, description, features, stats)
SELECT 
    'Por que escolher a Cred Mais?',
    'Somos especialistas em soluções financeiras, oferecendo as melhores condições do mercado para você realizar seus sonhos. Nossa equipe está preparada para encontrar a melhor opção para o seu perfil.',
    '[
        {"title": "Atendimento Personalizado", "description": "Cada cliente é único e merece atenção especial"},
        {"title": "Melhores Taxas", "description": "Trabalhamos com as melhores taxas do mercado"},
        {"title": "Agilidade", "description": "Processo rápido e descomplicado"},
        {"title": "Segurança", "description": "Seus dados protegidos com total transparência"}
    ]'::jsonb,
    '[
        {"number": "1000+", "label": "Clientes Satisfeitos"},
        {"number": "R$50M+", "label": "Em Crédito Liberado"},
        {"number": "10+", "label": "Parceiros"},
        {"number": "98%", "label": "Taxa de Aprovação"}
    ]'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM public.about_section
);
