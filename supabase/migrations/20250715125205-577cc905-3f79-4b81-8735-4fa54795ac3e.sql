-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'expert');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create study responses table for experts
CREATE TABLE public.study_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id UUID REFERENCES public.studies(id) ON DELETE CASCADE NOT NULL,
    expert_id UUID REFERENCES public.experts(id) ON DELETE CASCADE NOT NULL,
    round_number INTEGER NOT NULL DEFAULT 1,
    responses JSONB NOT NULL DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (study_id, expert_id, round_number)
);

-- Enable RLS on study_responses
ALTER TABLE public.study_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for study_responses
CREATE POLICY "Study owners can view all responses"
ON public.study_responses
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.studies 
    WHERE studies.id = study_responses.study_id 
    AND studies.user_id = auth.uid()
));

CREATE POLICY "Experts can view their own responses"
ON public.study_responses
FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.experts 
    WHERE experts.id = study_responses.expert_id 
    AND experts.email = (SELECT email FROM auth.users WHERE id = auth.uid())
));

CREATE POLICY "Experts can insert their own responses"
ON public.study_responses
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM public.experts 
    WHERE experts.id = study_responses.expert_id 
    AND experts.email = (SELECT email FROM auth.users WHERE id = auth.uid())
));

CREATE POLICY "Experts can update their own responses"
ON public.study_responses
FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.experts 
    WHERE experts.id = study_responses.expert_id 
    AND experts.email = (SELECT email FROM auth.users WHERE id = auth.uid())
));

-- Create trigger for study_responses updated_at
CREATE TRIGGER update_study_responses_updated_at
BEFORE UPDATE ON public.study_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();