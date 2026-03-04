export const leoniSites = [
  "Mateur South",
  "Mateur North",
  "Sidi Bouali",
  "Sousse Messadine",
  "Menzel Hayet",
] as const;

export type LeoniSite = typeof leoniSites[number];

export const mockInternshipSubjects = [
  {
    id: "1",
    title: "Développement d'une plateforme de gestion de stages",
    department: "IT / Digital",
    supervisor: "Ben Nasr Mohamed Amine",
    type: "PFE" as const,
    duration: "4 mois",
    description: "Conception et développement d'une application web pour la gestion complète du cycle de vie des stages chez LEONI.",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    status: "published" as const,
    maxInterns: 2,
    site: "Sousse Messadine" as LeoniSite,
    address: "Zone Industrielle, Sousse Messadine, Sousse",
  },
  {
    id: "2",
    title: "Optimisation de la chaîne de production par IoT",
    department: "Production",
    supervisor: "Trabelsi Sami",
    type: "PFE" as const,
    duration: "6 mois",
    description: "Mise en place de capteurs IoT pour le suivi en temps réel de la production et l'optimisation des processus.",
    skills: ["IoT", "Python", "Data Analysis", "Arduino"],
    status: "published" as const,
    maxInterns: 1,
    site: "Mateur South" as LeoniSite,
    address: "Zone Industrielle, Mateur Sud, Bizerte",
  },
  {
    id: "3",
    title: "Analyse de données qualité",
    department: "Qualité",
    supervisor: "Gharbi Leila",
    type: "PFA" as const,
    duration: "2 mois",
    description: "Développement de dashboards pour l'analyse des données de qualité et la détection des anomalies.",
    skills: ["Power BI", "SQL", "Statistics", "Excel"],
    status: "published" as const,
    maxInterns: 3,
    site: "Sidi Bouali" as LeoniSite,
    address: "Zone Industrielle, Sidi Bouali, Sousse",
  },
  {
    id: "4",
    title: "Automatisation des tests de câblage",
    department: "Engineering",
    supervisor: "Hammami Khaled",
    type: "PFE" as const,
    duration: "5 mois",
    description: "Conception d'un système automatisé de test pour les faisceaux de câbles automobiles.",
    skills: ["LabVIEW", "C++", "Electrical Engineering"],
    status: "published" as const,
    maxInterns: 1,
    site: "Mateur North" as LeoniSite,
    address: "Zone Industrielle, Mateur Nord, Bizerte",
  },
  {
    id: "5",
    title: "Stage d'été - Support IT",
    department: "IT / Digital",
    supervisor: "Mejri Anis",
    type: "Summer" as const,
    duration: "1 mois",
    description: "Support technique et maintenance des systèmes informatiques de l'entreprise.",
    skills: ["Networking", "Windows Server", "Help Desk"],
    status: "published" as const,
    maxInterns: 4,
    site: "Sousse Messadine" as LeoniSite,
    address: "Zone Industrielle, Sousse Messadine, Sousse",
  },
  {
    id: "6",
    title: "Amélioration continue - Lean Manufacturing",
    department: "Production",
    supervisor: "Bouaziz Fatma",
    type: "Perfectionnement" as const,
    duration: "1 mois",
    description: "Participation aux projets d'amélioration continue et application des outils Lean.",
    skills: ["Lean", "5S", "Kaizen", "Six Sigma"],
    status: "published" as const,
    maxInterns: 2,
    site: "Menzel Hayet" as LeoniSite,
    address: "Zone Industrielle, Menzel Hayet, Monastir",
  },
  {
    id: "7",
    title: "AI Predictive Maintenance",
    department: "IT / Digital",
    supervisor: "Rim Gharsalli",
    type: "PFE" as const,
    duration: "6 mois",
    description: "Développement d'un modèle de maintenance prédictive basé sur l'IA pour les lignes de production.",
    skills: ["Python", "Machine Learning", "TensorFlow", "MLOps"],
    status: "published" as const,
    maxInterns: 2,
    site: "Sousse Messadine" as LeoniSite,
    address: "Zone Industrielle, Sousse Messadine, Sousse",
  },
  {
    id: "8",
    title: "Lean Production Optimization",
    department: "Production",
    supervisor: "Sami Trabelsi",
    type: "PFE" as const,
    duration: "5 mois",
    description: "Projet d'optimisation Lean des flux de production pour réduire les temps de cycle et les pertes.",
    skills: ["Lean", "VSM", "Kaizen", "Data Analysis"],
    status: "published" as const,
    maxInterns: 1,
    site: "Mateur South" as LeoniSite,
    address: "Zone Industrielle, Mateur Sud, Bizerte",
  },
  {
    id: "9",
    title: "Supply Chain Automation",
    department: "Logistique",
    supervisor: "Faten Kefi",
    type: "PFE" as const,
    duration: "4 mois",
    description: "Automatisation des processus logistiques et traçabilité temps réel de la supply chain.",
    skills: ["Power BI", "SQL", "RPA", "Supply Chain"],
    status: "published" as const,
    maxInterns: 1,
    site: "Mateur North" as LeoniSite,
    address: "Zone Industrielle, Mateur Nord, Bizerte",
  },
  {
    id: "10",
    title: "Internship Performance Analytics",
    department: "RH",
    supervisor: "Nadia Ben Youssef",
    type: "PFE" as const,
    duration: "4 mois",
    description: "Mise en place de tableaux de bord RH pour le suivi de la performance des stagiaires et des encadrants.",
    skills: ["Data Visualization", "Power BI", "HR Analytics"],
    status: "published" as const,
    maxInterns: 1,
    site: "Sousse Messadine" as LeoniSite,
    address: "Zone Industrielle, Sousse Messadine, Sousse",
  },
  {
    id: "11",
    title: "Cost Optimization Model",
    department: "Finance",
    supervisor: "Walid Bouzid",
    type: "PFE" as const,
    duration: "6 mois",
    description: "Modélisation et simulation des coûts de production pour identifier les leviers d'optimisation.",
    skills: ["Finance", "Excel avancé", "Modélisation", "Power BI"],
    status: "published" as const,
    maxInterns: 1,
    site: "Menzel Hayet" as LeoniSite,
    address: "Zone Industrielle, Menzel Hayet, Monastir",
  },
];

export const mockApplications = [
  { id: "1", candidateName: "Ahmed Ben Salem", email: "ahmed.bensalem@ensi.tn", phone: "+216 98 765 432", university: "ENSI", subjectId: "1", subjectTitle: "Développement d'une plateforme de gestion de stages", status: "pending" as const, appliedAt: "2026-02-15", department: "IT / Digital" },
  { id: "2", candidateName: "Fatma Trabelsi", email: "fatma.trabelsi@insat.tn", phone: "+216 55 123 456", university: "INSAT", subjectId: "2", subjectTitle: "Optimisation de la chaîne de production par IoT", status: "accepted" as const, appliedAt: "2026-02-10", department: "Production" },
  { id: "3", candidateName: "Mohamed Gharbi", email: "mohamed.gharbi@enit.tn", phone: "+216 22 456 789", university: "ENIT", subjectId: "1", subjectTitle: "Développement d'une plateforme de gestion de stages", status: "interview" as const, appliedAt: "2026-02-12", department: "IT / Digital" },
  { id: "4", candidateName: "Sarra Mejri", email: "sarra.mejri@esprit.tn", phone: "+216 99 321 654", university: "ESPRIT", subjectId: "3", subjectTitle: "Analyse de données qualité", status: "rejected" as const, appliedAt: "2026-02-08", department: "Qualité" },
  { id: "5", candidateName: "Youssef Hammami", email: "youssef.hammami@tek-up.tn", phone: "+216 50 987 654", university: "TEK-UP University", subjectId: "4", subjectTitle: "Automatisation des tests de câblage", status: "preselected" as const, appliedAt: "2026-02-14", department: "Engineering" },
  { id: "6", candidateName: "Amira Bouaziz", email: "amira.bouaziz@supcom.tn", phone: "+216 23 654 321", university: "SUP'COM", subjectId: "2", subjectTitle: "Optimisation de la chaîne de production par IoT", status: "pending" as const, appliedAt: "2026-02-18", department: "Production" },
];

export const mockInterns = [
  { id: "1", name: "Fatma Trabelsi", email: "fatma.trabelsi@insat.tn", university: "INSAT", department: "Production", supervisor: "Trabelsi Sami", subject: "Optimisation de la chaîne de production par IoT", type: "PFE" as const, startDate: "2026-02-10", endDate: "2026-06-10", matricule: "270352", progress: 35, degree: "Cycle d'Ingénieur" as const, validated: false, site: "Mateur South" as LeoniSite },
  { id: "2", name: "Smayen Abir", email: "abir.smayen@enit.tn", university: "ENIT", department: "SME", supervisor: "Ben Nasr Mohamed Amine", subject: "Développement d'une plateforme de gestion de stages", type: "PFE" as const, startDate: "2026-02-10", endDate: "2026-06-10", matricule: "270351", progress: 45, degree: "Cycle d'Ingénieur" as const, validated: false, site: "Sousse Messadine" as LeoniSite },
  { id: "3", name: "Khalil Jaziri", email: "khalil.jaziri@esprit.tn", university: "ESPRIT", department: "IT / Digital", supervisor: "Mejri Anis", subject: "Stage d'été - Support IT", type: "Summer" as const, startDate: "2026-07-01", endDate: "2026-08-01", matricule: "270353", progress: 0, degree: "Licence" as const, validated: false, site: "Sousse Messadine" as LeoniSite },
  { id: "4", name: "Ines Bouazizi", email: "ines.bouazizi@isi.tn", university: "ISI", department: "Qualité", supervisor: "Gharbi Leila", subject: "Analyse de données qualité", type: "PFA" as const, startDate: "2026-03-01", endDate: "2026-05-01", matricule: "270354", progress: 60, degree: "Master" as const, validated: false, site: "Sidi Bouali" as LeoniSite },
];

export const mockProgressUpdates = [
  { id: "1", internId: "2", week: 1, title: "Setup & Onboarding", description: "Configuration de l'environnement de développement, étude du cahier des charges, et prise en main des outils.", date: "2026-02-17", status: "validated" as const, feedback: "Excellent démarrage, continue comme ça !", rating: 4 },
  { id: "2", internId: "2", week: 2, title: "Conception de la base de données", description: "Modélisation de la base de données PostgreSQL, création des diagrammes UML, et définition des API endpoints.", date: "2026-02-24", status: "validated" as const, feedback: "Bonne modélisation, quelques ajustements nécessaires sur les relations.", rating: 3 },
  { id: "3", internId: "2", week: 3, title: "Développement Frontend - Auth", description: "Création des pages d'authentification (Login, Sign Up) avec animations et design responsive.", date: "2026-03-03", status: "needs_revision" as const, feedback: "Le design est bien, mais il faut améliorer la validation des formulaires." },
  { id: "4", internId: "1", week: 1, title: "Étude bibliographique IoT", description: "Recherche sur les capteurs IoT compatibles avec l'environnement industriel LEONI.", date: "2026-02-17", status: "validated" as const, feedback: "Bonne analyse des technologies disponibles.", rating: 4 },
  { id: "5", internId: "1", week: 2, title: "Architecture système IoT", description: "Définition de l'architecture du système de capteurs et protocoles de communication.", date: "2026-02-24", status: "approved" as const, feedback: "Architecture solide, bien documentée.", rating: 5 },
];

export const mockEvents = [
  { id: "1", title: "Team Building - Visite industrielle", description: "Visite guidée de l'usine de production et présentation des processus de câblage automobile.", date: "2026-03-15", time: "09:00", location: "Usine LEONI Sousse", type: "visit" as const, assignedInterns: ["1", "2", "3", "4"], confirmed: ["1", "2"] },
  { id: "2", title: "Formation Sécurité", description: "Formation obligatoire sur les normes de sécurité en milieu industriel.", date: "2026-03-20", time: "14:00", location: "Salle de formation B2", type: "training" as const, assignedInterns: ["1", "2", "3", "4"], confirmed: ["1", "2", "3"] },
  { id: "3", title: "Présentation mi-parcours", description: "Présentation de l'avancement des projets de stage devant le comité d'évaluation.", date: "2026-04-05", time: "10:00", location: "Amphithéâtre LEONI", type: "presentation" as const, assignedInterns: ["1", "2"], confirmed: [] },
  { id: "4", title: "Atelier Innovation", description: "Workshop collaboratif sur l'innovation dans l'industrie automobile.", date: "2026-04-15", time: "09:30", location: "Espace Innovation", type: "workshop" as const, assignedInterns: ["1", "2", "3", "4"], confirmed: ["2"] },
];

export const mockAttendance = [
  { id: "1", internId: "2", date: "2026-03-03", checkIn: "08:15", checkOut: "17:30", status: "present" as const },
  { id: "2", internId: "2", date: "2026-03-02", checkIn: "08:00", checkOut: "17:00", status: "present" as const },
  { id: "3", internId: "2", date: "2026-03-01", checkIn: "08:30", checkOut: "12:00", status: "half_day" as const },
  { id: "4", internId: "2", date: "2026-02-28", checkIn: null, checkOut: null, status: "absent" as const },
  { id: "5", internId: "1", date: "2026-03-03", checkIn: "07:45", checkOut: "17:15", status: "present" as const },
  { id: "6", internId: "1", date: "2026-03-02", checkIn: "08:10", checkOut: "17:00", status: "present" as const },
];

export const mockWorkSubmissions = [
  { id: "1", internId: "2", title: "Rapport Setup & Onboarding", description: "Documentation de la configuration de l'environnement et premiers tests.", date: "2026-02-17", status: "approved" as const, version: 1, file: "rapport_week1_v1.pdf", supervisorComment: "Très bien documenté.", rating: 4 },
  { id: "2", internId: "2", title: "Modèle BDD & UML", description: "Diagrammes UML et schéma de la base de données PostgreSQL.", date: "2026-02-24", status: "approved" as const, version: 2, file: "conception_bdd_v2.pdf", supervisorComment: "Bonne révision après corrections.", rating: 4, previousVersions: [{ version: 1, date: "2026-02-22", file: "conception_bdd_v1.pdf", comment: "Revoir les cardinalités des relations." }] },
  { id: "3", internId: "2", title: "Frontend Auth - Code & Screenshots", description: "Code source et captures d'écran des pages d'authentification.", date: "2026-03-03", status: "needs_revision" as const, version: 1, file: "auth_frontend_v1.pdf", supervisorComment: "Améliorer la validation côté client." },
];

export const mockStats = {
  totalApplications: 47,
  accepted: 12,
  pending: 23,
  rejected: 8,
  interview: 4,
  activeInterns: 15,
  totalSubjects: 24,
  departments: 6,
  completedInternships: 8,
  attendanceRate: 94,
  avgProgress: 42,
  eventParticipation: 78,
};

export const mockDegreeStats = [
  { degree: "Licence", count: 4 },
  { degree: "Cycle d'Ingénieur", count: 7 },
  { degree: "Master", count: 4 },
];

export const departments = ["IT / Digital", "Production", "Qualité", "Engineering", "RH", "Finance", "Logistique", "SME"];

export const internshipTypes = ["PFE", "PFA", "Summer", "Perfectionnement"] as const;

export type InternshipType = typeof internshipTypes[number];

export const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-warning/10 border-warning/25", text: "text-warning" },
  accepted: { bg: "bg-success/10 border-success/25", text: "text-success" },
  approved: { bg: "bg-success/10 border-success/25", text: "text-success" },
  validated: { bg: "bg-leoni-purple/10 border-leoni-purple/25", text: "text-leoni-purple" },
  internship_validated: { bg: "bg-leoni-purple/10 border-leoni-purple/25", text: "text-leoni-purple" },
  active: { bg: "bg-primary/10 border-primary/25", text: "text-primary" },

  interview: { bg: "bg-leoni-purple/10 border-leoni-purple/25", text: "text-leoni-purple" },
  pending_technical_interview: { bg: "bg-primary/10 border-primary/25", text: "text-primary" },
  preselected: { bg: "bg-primary/10 border-primary/25", text: "text-primary" },

  rejected: { bg: "bg-destructive/10 border-destructive/25", text: "text-destructive" },
  risk: { bg: "bg-destructive/10 border-destructive/25", text: "text-destructive" },
  critical: { bg: "bg-destructive/10 border-destructive/25", text: "text-destructive" },

  needs_revision: { bg: "bg-warning/10 border-warning/25", text: "text-warning" },
  draft: { bg: "bg-muted border-border", text: "text-muted-foreground" },
  published: { bg: "bg-success/10 border-success/25", text: "text-success" },
  completed: { bg: "bg-primary/10 border-primary/25", text: "text-primary" },

  archived: { bg: "bg-muted border-border", text: "text-muted-foreground" },

  present: { bg: "bg-success/10 border-success/25", text: "text-success" },
  absent: { bg: "bg-destructive/10 border-destructive/25", text: "text-destructive" },
  half_day: { bg: "bg-warning/10 border-warning/25", text: "text-warning" },

  open: { bg: "bg-success/10 border-success/25", text: "text-success" },
  closed: { bg: "bg-destructive/10 border-destructive/25", text: "text-destructive" },
};

// Evaluation criteria for weighted scoring
export const evaluationCriteria = [
  { id: "technical", label: "Technical Skills", weight: 30, description: "Quality of technical work and problem-solving" },
  { id: "communication", label: "Communication", weight: 15, description: "Written and verbal communication" },
  { id: "initiative", label: "Initiative & Autonomy", weight: 20, description: "Self-motivation and proactive contributions" },
  { id: "punctuality", label: "Punctuality & Attendance", weight: 10, description: "Regularity and time management" },
  { id: "teamwork", label: "Teamwork", weight: 15, description: "Collaboration with colleagues" },
  { id: "deliverables", label: "Deliverables Quality", weight: 10, description: "Quality of submitted documents and code" },
];

// Mock voting data for TOP 10 system
export const mockVotingInterns = mockInterns.map(i => ({
  ...i,
  totalScore: Math.floor(Math.random() * 40) + 60,
  votes: Math.floor(Math.random() * 30) + 5,
  averageRating: +(Math.random() * 2 + 3).toFixed(1),
  isTop10: false,
}));
