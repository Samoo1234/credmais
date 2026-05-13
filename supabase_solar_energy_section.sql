-- Criação da tabela solar_energy_section
CREATE TABLE IF NOT EXISTS public.solar_energy_section (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    badge_text TEXT NOT NULL DEFAULT 'Sustentabilidade',
    title TEXT NOT NULL DEFAULT 'Assinatura de Energia Solar',
    description TEXT NOT NULL DEFAULT 'Siga estes três passos simples para começar a economizar na sua conta de luz utilizando energia limpa.',
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.solar_energy_section ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
-- Todos podem ler a seção
CREATE POLICY "solar_energy_section_read_all"
    ON public.solar_energy_section FOR SELECT
    USING (true);

-- Apenas usuários autenticados podem atualizar
CREATE POLICY "solar_energy_section_update_auth"
    ON public.solar_energy_section FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "solar_energy_section_insert_auth"
    ON public.solar_energy_section FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Inserir dados iniciais caso a tabela esteja vazia
INSERT INTO public.solar_energy_section (id, badge_text, title, description, steps)
SELECT 
    gen_random_uuid(),
    'Sustentabilidade',
    'Assinatura de Energia Solar',
    'Siga estes três passos simples para começar a economizar na sua conta de luz utilizando energia limpa.',
    '[
        {
            "number": "1",
            "title": "Geramos energia limpa",
            "description": "As usinas solares são instaladas em locais onde o sol é forte e abundante. Nelas, centenas de placas fotovoltaicas captam a luz e a transformam em energia elétrica.",
            "icon": "sun"
        },
        {
            "number": "2",
            "title": "Você faz sua assinatura",
            "description": "Ao assinar o Crédito de Energia da Enova, você contrata uma cota de uma dessas usinas e a energia gerada por ela é direcionada para o seu imóvel.",
            "icon": "house"
        },
        {
            "number": "3",
            "title": "Utilize a sua energia",
            "description": "Tudo pronto para utilizar a sua energia! Mas, caso o volume não seja utilizado totalmente, o mesmo fica acumulado para o próximo mês. Essa é a sua recompensa por utilizar energia limpa!",
            "icon": "refresh"
        }
    ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.solar_energy_section LIMIT 1);
