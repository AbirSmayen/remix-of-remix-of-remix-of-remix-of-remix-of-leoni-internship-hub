
-- PFE Subjects table
CREATE TABLE public.pfe_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id TEXT NOT NULL UNIQUE, -- e.g. PFE-2026-001
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  department TEXT NOT NULL,
  site TEXT NOT NULL,
  address TEXT,
  supervisor TEXT,
  duration TEXT DEFAULT '4 mois',
  skills TEXT[] DEFAULT '{}',
  max_interns INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  type TEXT NOT NULL DEFAULT 'PFE' CHECK (type IN ('PFE', 'PFA', 'Summer', 'Perfectionnement')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Auto-generate subject_id sequence
CREATE SEQUENCE public.pfe_subject_seq START 1;

-- Applications table (for both PFE and Non-PFE)
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.pfe_subjects(id) ON DELETE SET NULL,
  application_type TEXT NOT NULL DEFAULT 'PFE' CHECK (application_type IN ('PFE', 'PFA', 'Summer', 'Perfectionnement')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  university TEXT NOT NULL,
  academic_level TEXT,
  field_of_study TEXT,
  preferred_department TEXT,
  preferred_site TEXT,
  preferred_start_date DATE,
  cv_url TEXT,
  motivation_letter_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preselected', 'interview', 'accepted', 'rejected')),
  agreed_terms BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pfe_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- PFE subjects: publicly readable (for PFE Book), only authenticated users can modify
CREATE POLICY "PFE subjects are publicly readable"
  ON public.pfe_subjects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert PFE subjects"
  ON public.pfe_subjects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update PFE subjects"
  ON public.pfe_subjects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete PFE subjects"
  ON public.pfe_subjects FOR DELETE
  TO authenticated
  USING (true);

-- Applications: anyone can insert (public applicants), only authenticated can read/update
CREATE POLICY "Anyone can submit applications"
  ON public.applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_pfe_subjects_updated_at
  BEFORE UPDATE ON public.pfe_subjects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for application documents
INSERT INTO storage.buckets (id, name, public) VALUES ('application-documents', 'application-documents', true);

-- Storage policies: anyone can upload, authenticated can read all
CREATE POLICY "Anyone can upload application documents"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'application-documents');

CREATE POLICY "Anyone can read application documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'application-documents');

-- Seed initial PFE subjects from existing mock data
INSERT INTO public.pfe_subjects (subject_id, title, description, department, site, address, supervisor, duration, skills, max_interns, status, type) VALUES
  ('PFE-2026-001', 'Développement d''une plateforme de gestion de stages', 'Conception et développement d''une application web pour la gestion complète du cycle de vie des stages chez LEONI.', 'IT / Digital', 'Sousse Messadine', 'Zone Industrielle, Sousse Messadine, Sousse', 'Ben Nasr Mohamed Amine', '4 mois', ARRAY['React', 'Node.js', 'PostgreSQL', 'TypeScript'], 2, 'open', 'PFE'),
  ('PFE-2026-002', 'Optimisation de la chaîne de production par IoT', 'Mise en place de capteurs IoT pour le suivi en temps réel de la production et l''optimisation des processus.', 'Production', 'Mateur South', 'Zone Industrielle, Mateur Sud, Bizerte', 'Trabelsi Sami', '6 mois', ARRAY['IoT', 'Python', 'Data Analysis', 'Arduino'], 1, 'open', 'PFE'),
  ('PFE-2026-003', 'Automatisation des tests de câblage', 'Conception d''un système automatisé de test pour les faisceaux de câbles automobiles.', 'Engineering', 'Mateur North', 'Zone Industrielle, Mateur Nord, Bizerte', 'Hammami Khaled', '5 mois', ARRAY['LabVIEW', 'C++', 'Electrical Engineering'], 1, 'open', 'PFE');
