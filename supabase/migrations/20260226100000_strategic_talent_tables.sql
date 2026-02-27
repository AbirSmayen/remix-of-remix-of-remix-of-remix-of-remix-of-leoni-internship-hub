-- Strategic Talent Management: Interns, Alumni, Presentations, Evaluations, Voting, Activity Logs
-- LEONI Tunisia Internship Lifecycle Platform

-- ========== INTERNS (active + archived alumni in one table) ==========
CREATE TABLE public.interns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES public.pfe_subjects(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  matricule TEXT,
  internship_type TEXT NOT NULL DEFAULT 'PFE' CHECK (internship_type IN ('PFE', 'PFA', 'Summer', 'Perfectionnement')),
  department TEXT NOT NULL,
  site TEXT NOT NULL,
  supervisor TEXT,
  project_title TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_presentation', 'completed_archived')),
  -- Archive / recruitment fields (filled when status = completed_archived)
  final_evaluation_score NUMERIC(4,2),
  presentation_score NUMERIC(4,2),
  voting_score NUMERIC(4,2),
  is_top10 BOOLEAN NOT NULL DEFAULT false,
  recruitment_eligible BOOLEAN NOT NULL DEFAULT false,
  equipment_returned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_interns_status ON public.interns(status);
CREATE INDEX idx_interns_department ON public.interns(department);
CREATE INDEX idx_interns_site ON public.interns(site);
CREATE INDEX idx_interns_internship_type ON public.interns(internship_type);
CREATE INDEX idx_interns_is_top10 ON public.interns(is_top10) WHERE is_top10 = true;
CREATE INDEX idx_interns_recruitment_eligible ON public.interns(recruitment_eligible) WHERE recruitment_eligible = true;

-- ========== PRESENTATIONS (final project summary + file + schedule) ==========
CREATE TABLE public.presentations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intern_id UUID NOT NULL REFERENCES public.interns(id) ON DELETE CASCADE,
  summary_url TEXT,
  presentation_file_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(intern_id)
);

-- ========== JURY EVALUATIONS (Directors + Supervisor weighted criteria) ==========
CREATE TABLE public.jury_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intern_id UUID NOT NULL REFERENCES public.interns(id) ON DELETE CASCADE,
  evaluator_email TEXT NOT NULL,
  technical_quality INTEGER NOT NULL CHECK (technical_quality >= 1 AND technical_quality <= 5),
  innovation INTEGER NOT NULL CHECK (innovation >= 1 AND innovation <= 5),
  impact INTEGER NOT NULL CHECK (impact >= 1 AND impact <= 5),
  presentation_skills INTEGER NOT NULL CHECK (presentation_skills >= 1 AND presentation_skills <= 5),
  business_value INTEGER NOT NULL CHECK (business_value >= 1 AND business_value <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(intern_id, evaluator_email)
);

-- ========== VOTES (internal TOP 10 voting, one per voter per intern) ==========
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intern_id UUID NOT NULL REFERENCES public.interns(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(intern_id, voter_id)
);

CREATE INDEX idx_votes_intern_id ON public.votes(intern_id);

-- ========== ACTIVITY LOGS (audit trail) ==========
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_email TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ========== APPLICATIONS: add tracking number for non-PFE ==========
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS tracking_number TEXT UNIQUE;

-- Generate tracking number on insert (APP-YYYY-NNNNN)
CREATE OR REPLACE FUNCTION public.generate_application_tracking_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  seq_num INTEGER;
  new_tracking TEXT;
BEGIN
  IF NEW.tracking_number IS NULL OR NEW.tracking_number = '' THEN
    year_part := to_char(now(), 'YYYY');
    SELECT count(*)::INTEGER + 1 INTO seq_num FROM public.applications WHERE created_at >= date_trunc('year', now());
    new_tracking := 'APP-' || year_part || '-' || lpad(seq_num::TEXT, 5, '0');
    NEW.tracking_number := new_tracking;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS set_application_tracking_number ON public.applications;
CREATE TRIGGER set_application_tracking_number
  BEFORE INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.generate_application_tracking_number();

-- ========== UPDATED_AT TRIGGERS ==========
CREATE TRIGGER update_interns_updated_at
  BEFORE UPDATE ON public.interns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON public.presentations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== RLS ==========
ALTER TABLE public.interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jury_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow read/write for authenticated (app uses service key or anon with policy; adjust if using Supabase Auth)
CREATE POLICY "Authenticated can manage interns"
  ON public.interns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can manage presentations"
  ON public.presentations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can manage jury_evaluations"
  ON public.jury_evaluations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can manage votes"
  ON public.votes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can read activity_logs"
  ON public.activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert activity_logs"
  ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Allow anon for local dev (Supabase anon key)
CREATE POLICY "Anon can manage interns for dev"
  ON public.interns FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can manage presentations for dev"
  ON public.presentations FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can manage jury_evaluations for dev"
  ON public.jury_evaluations FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can manage votes for dev"
  ON public.votes FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon can read insert activity_logs for dev"
  ON public.activity_logs FOR ALL TO anon USING (true) WITH CHECK (true);
