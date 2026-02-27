-- Seed data for full evaluation flow testing
-- Supervisors, directors, completed interns, and votes

-- 1) Supervisors (logged via activity_logs for traceability)
INSERT INTO public.activity_logs (entity_type, entity_id, action, actor_email, metadata)
VALUES
  ('supervisor', 'supervisor1@leoni.com', 'seed_create', 'system@seed', '{"role":"encadrant","name":"Supervisor One"}'),
  ('supervisor', 'supervisor2@leoni.com', 'seed_create', 'system@seed', '{"role":"encadrant","name":"Supervisor Two"}'),
  ('supervisor', 'supervisor3@leoni.com', 'seed_create', 'system@seed', '{"role":"encadrant","name":"Supervisor Three"}')
ON CONFLICT DO NOTHING;

-- 2) Directors (logged via activity_logs)
INSERT INTO public.activity_logs (entity_type, entity_id, action, actor_email, metadata)
VALUES
  ('director', 'director1@leoni.com', 'seed_create', 'system@seed', '{"role":"director","name":"Director One"}'),
  ('director', 'director2@leoni.com', 'seed_create', 'system@seed', '{"role":"director","name":"Director Two"}')
ON CONFLICT DO NOTHING;

-- 3) Completed interns (current year 2026)
-- Predefined UUIDs for deterministic links
WITH seed_interns AS (
  SELECT *
  FROM (VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, 'Ahmed Ben Salah',      'ahmed.bensalah@uni.tn',     'IT / Digital', 'PFE',            'supervisor1@leoni.com', 'Platforme de gestion des stages – V1',  98.0, '2026-06-30'),
    ('11111111-1111-1111-1111-111111111112'::uuid, 'Sarra Trabelsi',       'sarra.trabelsi@uni.tn',     'Production',   'PFE',            'supervisor1@leoni.com', 'Optimisation de la chaîne de production IoT', 96.0, '2026-06-28'),
    ('11111111-1111-1111-1111-111111111113'::uuid, 'Khalil Jaziri',        'khalil.jaziri@uni.tn',      'Qualité',      'PFA',            'supervisor1@leoni.com', 'Analyse avancée des données qualité',  90.0, '2026-06-25'),
    ('11111111-1111-1111-1111-111111111114'::uuid, 'Ines Gharbi',          'ines.gharbi@uni.tn',        'Engineering',  'Summer',         'supervisor1@leoni.com', 'Automatisation des tests de câblage',  82.0, '2026-06-20'),
    ('11111111-1111-1111-1111-111111111115'::uuid, 'Mehdi Bouaziz',        'mehdi.bouaziz@uni.tn',      'IT / Digital', 'Perfectionnement','supervisor1@leoni.com', 'Dashboards BI pour suivi de performance', 78.0, '2026-06-18'),

    ('22222222-2222-2222-2222-222222222221'::uuid, 'Rania Chaabane',       'rania.chaabane@uni.tn',     'Production',   'PFE',            'supervisor2@leoni.com', 'Lean manufacturing sur ligne de montage', 95.0, '2026-06-29'),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'Yassine Mansouri',     'yassine.mansouri@uni.tn',   'IT / Digital', 'PFE',            'supervisor2@leoni.com', 'Plateforme qualité temps réel',        93.0, '2026-06-27'),
    ('22222222-2222-2222-2222-222222222223'::uuid, 'Meriem Krichen',       'meriem.krichen@uni.tn',     'Qualité',      'PFA',            'supervisor2@leoni.com', 'Suivi statistiques des rebuts',        87.0, '2026-06-24'),
    ('22222222-2222-2222-2222-222222222224'::uuid, 'Oussama Mejri',        'oussama.mejri@uni.tn',      'Engineering',  'Perfectionnement','supervisor2@leoni.com', 'Standardisation bancs de test',        80.0, '2026-06-19'),
    ('22222222-2222-2222-2222-222222222225'::uuid, 'Amira Dabbebi',        'amira.dabbebi@uni.tn',      'IT / Digital', 'Summer',         'supervisor2@leoni.com', 'Support IT & automatisation tickets',  72.0, '2026-06-17'),

    ('33333333-3333-3333-3333-333333333331'::uuid, 'Fares Hamrouni',       'fares.hamrouni@uni.tn',     'Production',   'PFE',            'supervisor3@leoni.com', 'Simulation flux logistiques',          92.0, '2026-06-26'),
    ('33333333-3333-3333-3333-333333333332'::uuid, 'Nour Jebali',          'nour.jebali@uni.tn',        'Engineering',  'PFE',            'supervisor3@leoni.com', 'Contrôle qualité par vision',         89.0, '2026-06-23'),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'Seif Khelifi',         'seif.khelifi@uni.tn',       'IT / Digital', 'Perfectionnement','supervisor3@leoni.com', 'CI/CD pour outils internes',          85.0, '2026-06-21'),
    ('33333333-3333-3333-3333-333333333334'::uuid, 'Hiba Ben Jemaa',       'hiba.benjemaa@uni.tn',      'Qualité',      'PFA',            'supervisor3@leoni.com', 'Cartographie des causes défauts',     77.0, '2026-06-16'),
    ('33333333-3333-3333-3333-333333333335'::uuid, 'Ali Chaouch',          'ali.chaouch@uni.tn',        'Production',   'Summer',         'supervisor3@leoni.com', 'Stage opératoire amélioration continue', 70.0, '2026-06-15')
  ) AS t(id, full_name, email, department, internship_type, supervisor, project_title, final_score, end_date)
)
INSERT INTO public.interns (
  id,
  application_id,
  subject_id,
  full_name,
  email,
  matricule,
  internship_type,
  department,
  site,
  supervisor,
  project_title,
  start_date,
  end_date,
  status,
  final_evaluation_score,
  presentation_score,
  voting_score,
  is_top10,
  recruitment_eligible,
  equipment_returned
)
SELECT
  s.id,
  NULL,
  NULL,
  s.full_name,
  s.email,
  NULL,
  s.internship_type,
  s.department,
  'Sousse Messadine',
  s.supervisor,
  s.project_title,
  '2026-02-01',
  s.end_date::date,
  'completed_archived',
  s.final_score,
  NULL,
  NULL,
  FALSE,
  FALSE,
  FALSE
FROM seed_interns s
ON CONFLICT (id) DO NOTHING;

-- 4) Directors votes on at least 10 interns each
-- director1 votes
INSERT INTO public.votes (intern_id, voter_id, score, is_anonymous)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'director1@leoni.com', 5, FALSE),
  ('11111111-1111-1111-1111-111111111112', 'director1@leoni.com', 5, FALSE),
  ('11111111-1111-1111-1111-111111111113', 'director1@leoni.com', 4, FALSE),
  ('11111111-1111-1111-1111-111111111114', 'director1@leoni.com', 4, FALSE),
  ('11111111-1111-1111-1111-111111111115', 'director1@leoni.com', 3, FALSE),
  ('22222222-2222-2222-2222-222222222221', 'director1@leoni.com', 5, FALSE),
  ('22222222-2222-2222-2222-222222222222', 'director1@leoni.com', 4, FALSE),
  ('22222222-2222-2222-2222-222222222223', 'director1@leoni.com', 3, FALSE),
  ('33333333-3333-3333-3333-333333333331', 'director1@leoni.com', 4, FALSE),
  ('33333333-3333-3333-3333-333333333332', 'director1@leoni.com', 3, FALSE)
ON CONFLICT (intern_id, voter_id) DO NOTHING;

-- director2 votes
INSERT INTO public.votes (intern_id, voter_id, score, is_anonymous)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'director2@leoni.com', 5, FALSE),
  ('11111111-1111-1111-1111-111111111112', 'director2@leoni.com', 4, FALSE),
  ('11111111-1111-1111-1111-111111111113', 'director2@leoni.com', 4, FALSE),
  ('22222222-2222-2222-2222-222222222221', 'director2@leoni.com', 5, FALSE),
  ('22222222-2222-2222-2222-222222222222', 'director2@leoni.com', 5, FALSE),
  ('22222222-2222-2222-2222-222222222223', 'director2@leoni.com', 3, FALSE),
  ('33333333-3333-3333-3333-333333333331', 'director2@leoni.com', 4, FALSE),
  ('33333333-3333-3333-3333-333333333332', 'director2@leoni.com', 4, FALSE),
  ('33333333-3333-3333-3333-333333333333', 'director2@leoni.com', 3, FALSE),
  ('33333333-3333-3333-3333-333333333334', 'director2@leoni.com', 2, FALSE)
ON CONFLICT (intern_id, voter_id) DO NOTHING;

-- 5) Pre-mark 2 highest scoring interns as TOP 10 and recruitment eligible
UPDATE public.interns
SET is_top10 = TRUE,
    recruitment_eligible = TRUE
WHERE id IN (
  '11111111-1111-1111-1111-111111111111', -- 98.0
  '11111111-1111-1111-1111-111111111112'  -- 96.0
);

