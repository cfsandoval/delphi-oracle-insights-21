-- Crear tabla para gestión de expertos
CREATE TABLE public.experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  expertise_area TEXT,
  institution TEXT,
  years_experience INTEGER,
  education_level TEXT,
  phone TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, email)
);

-- Habilitar RLS
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para expertos
CREATE POLICY "Users can view their own experts" 
ON public.experts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own experts" 
ON public.experts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experts" 
ON public.experts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experts" 
ON public.experts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para actualizar timestamp
CREATE TRIGGER update_experts_updated_at
BEFORE UPDATE ON public.experts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear tabla para participación de expertos en estudios
CREATE TABLE public.study_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES public.experts(id) ON DELETE CASCADE,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  response_status TEXT NOT NULL DEFAULT 'pending' CHECK (response_status IN ('pending', 'accepted', 'declined', 'completed')),
  last_response_at TIMESTAMP WITH TIME ZONE,
  rounds_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(study_id, expert_id)
);

-- Habilitar RLS
ALTER TABLE public.study_participants ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para participantes de estudio
CREATE POLICY "Users can view their study participants" 
ON public.study_participants 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.studies 
  WHERE studies.id = study_participants.study_id 
  AND studies.user_id = auth.uid()
));

CREATE POLICY "Users can create their study participants" 
ON public.study_participants 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.studies 
  WHERE studies.id = study_participants.study_id 
  AND studies.user_id = auth.uid()
));

CREATE POLICY "Users can update their study participants" 
ON public.study_participants 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.studies 
  WHERE studies.id = study_participants.study_id 
  AND studies.user_id = auth.uid()
));

CREATE POLICY "Users can delete their study participants" 
ON public.study_participants 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.studies 
  WHERE studies.id = study_participants.study_id 
  AND studies.user_id = auth.uid()
));

-- Trigger para actualizar timestamp
CREATE TRIGGER update_study_participants_updated_at
BEFORE UPDATE ON public.study_participants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();