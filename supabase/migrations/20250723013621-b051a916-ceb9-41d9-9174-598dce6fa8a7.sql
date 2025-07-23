-- Create documentation table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('tool_instructions', 'methodology')),
  type TEXT NOT NULL CHECK (type IN ('pdf', 'url', 'text')),
  file_url TEXT,
  external_url TEXT,
  content TEXT,
  tags TEXT[],
  language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view documents" 
ON public.documents 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Document creators can update their documents" 
ON public.documents 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Document creators can delete their documents" 
ON public.documents 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Create policies for document storage
CREATE POLICY "Anyone can view documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert initial methodology documents
INSERT INTO public.documents (title, description, category, type, external_url, content, tags, language, created_by) VALUES
('RAND Methodological Guidance for Conducting and Critically Appraising Delphi Panels', 'Manual metodológico de RAND Corporation sobre la conducción y evaluación crítica de paneles Delphi', 'methodology', 'url', 'https://www.rand.org/pubs/tools/TLA3082-1.html', 'El método Delphi es un proceso de comunicación grupal iterativo, anónimo, estructurado y una técnica de elicitación diseñada para ayudar a los responsables de políticas a tomar decisiones bajo condiciones de incertidumbre e información incompleta.', ARRAY['delphi', 'metodología', 'rand', 'consenso'], 'es', (SELECT id FROM auth.users LIMIT 1));