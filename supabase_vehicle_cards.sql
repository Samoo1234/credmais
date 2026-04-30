-- Criar tabela vehicle_cards
CREATE TABLE public.vehicle_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('automoveis', 'motocicletas')),
    title TEXT NOT NULL,
    image_url TEXT,
    link_url TEXT NOT NULL DEFAULT '#',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (opcional, mas recomendado)
ALTER TABLE public.vehicle_cards ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (todos podem ver os cards ativos no site)
CREATE POLICY "Cards visíveis publicamente" 
ON public.vehicle_cards FOR SELECT 
USING (true);

-- Política para gerenciamento (insira suas regras de auth caso necessário)
CREATE POLICY "Gerenciamento total de cards" 
ON public.vehicle_cards FOR ALL 
USING (true) WITH CHECK (true);

-- Criar bucket para imagens dos cards se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle_cards', 'vehicle_cards', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas do Storage
CREATE POLICY "Imagens públicas dos cards" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'vehicle_cards');

CREATE POLICY "Upload de imagens dos cards" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'vehicle_cards');

CREATE POLICY "Deletar imagens dos cards" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'vehicle_cards');

CREATE POLICY "Atualizar imagens dos cards" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'vehicle_cards');
