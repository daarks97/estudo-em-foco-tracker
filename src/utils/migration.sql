
-- Create a table for revisoes (revisions)
CREATE TABLE IF NOT EXISTS public.revisoes (
  id TEXT PRIMARY KEY,
  tema_id UUID REFERENCES public.temas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('D1', 'D7', 'D30')),
  data_revisao TIMESTAMP WITH TIME ZONE NOT NULL,
  concluida BOOLEAN NOT NULL DEFAULT false,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  status_revisao TEXT CHECK (status_revisao IN ('sucesso', 'incompleta') OR status_revisao IS NULL),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS (Row Level Security) to the revisoes table
ALTER TABLE public.revisoes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see only their own revisoes
CREATE POLICY "Users can view their own revisoes" 
  ON public.revisoes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own revisoes
CREATE POLICY "Users can create their own revisoes" 
  ON public.revisoes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own revisoes
CREATE POLICY "Users can update their own revisoes" 
  ON public.revisoes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own revisoes
CREATE POLICY "Users can delete their own revisoes" 
  ON public.revisoes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index on tema_id for better performance
CREATE INDEX IF NOT EXISTS revisoes_tema_id_idx ON public.revisoes(tema_id);

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS revisoes_user_id_idx ON public.revisoes(user_id);
