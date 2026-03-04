import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type {
  PFESubjectMock,
  ApplicationMock,
  InternMock,
  AlumniMock,
  SupervisorRecommendation,
  ApplicationStatus,
  SummerProjectMock,
} from "@/types/internship";
import { departments } from "@/data/mockData";
import { isTechnicalDepartment } from "@/lib/departmentRules";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const getStartMonth = (startDate: string): string => {
  const d = new Date(startDate);
  const m = d.getMonth();
  return monthNames[m] ?? "January";
};

// Initial PFE subjects with requires_technical_interview
const initialSubjects: PFESubjectMock[] = [
  {
    id: "1",
    subject_id: "PFE-2026-001",
    title: "Développement d'une plateforme de gestion de stages",
    description: "Conception et développement d'une application web.",
    department: "IT / Digital",
    site: "Sousse Messadine",
    supervisor: "Ben Nasr Mohamed Amine",
    fieldOfStudy: "Computer Science",
    academicLevelRequired: "Cycle d'Ingénieur",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    max_interns: 2,
    duration: "4 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: isTechnicalDepartment("IT / Digital"),
  },
  {
    id: "2",
    subject_id: "PFE-2026-002",
    title: "Optimisation de la chaîne de production par IoT",
    description: "Mise en place de capteurs IoT pour le suivi en temps réel.",
    department: "Production",
    site: "Mateur South",
    supervisor: "Trabelsi Sami",
    fieldOfStudy: "Industrial Engineering",
    academicLevelRequired: "Master",
    skills: ["IoT", "Python", "Data Analysis"],
    max_interns: 1,
    duration: "6 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: isTechnicalDepartment("Production"),
  },
  {
    id: "3",
    subject_id: "PFE-2026-003",
    title: "Cybersecurity Monitoring System",
    description: "Conception d'un système de surveillance et détection des menaces cybersécurité.",
    department: "IT / Digital",
    site: "Sousse Messadine",
    supervisor: "Rim Gharsalli",
    fieldOfStudy: "Computer Science / Cybersecurity",
    academicLevelRequired: "Cycle d'Ingénieur",
    skills: ["Security", "SIEM", "Python", "Networking"],
    max_interns: 1,
    duration: "5 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: true,
  },
  {
    id: "4",
    subject_id: "PFE-2026-004",
    title: "AI Chatbot for Internal Support",
    description: "Développement d'un chatbot IA pour le support interne et la FAQ employés.",
    department: "IT / Digital",
    site: "Mateur North",
    supervisor: "Ben Nasr Mohamed Amine",
    fieldOfStudy: "Computer Science",
    academicLevelRequired: "Master",
    skills: ["NLP", "Python", "React", "APIs"],
    max_interns: 2,
    duration: "4 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: true,
  },
  {
    id: "5",
    subject_id: "PFE-2026-005",
    title: "Smart Quality Control",
    description: "Système de contrôle qualité intelligent par vision et données.",
    department: "Production",
    site: "Mateur South",
    supervisor: "Trabelsi Sami",
    fieldOfStudy: "Industrial Engineering",
    academicLevelRequired: "Cycle d'Ingénieur",
    skills: ["Vision", "Python", "Quality", "Data Analysis"],
    max_interns: 1,
    duration: "5 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: isTechnicalDepartment("Production"),
  },
  {
    id: "6",
    subject_id: "PFE-2026-006",
    title: "Process Optimization Tool",
    description: "Outil d'optimisation des processus de production et KPI.",
    department: "Production",
    site: "Sidi Bouali",
    supervisor: "Gharbi Leila",
    fieldOfStudy: "Industrial Engineering",
    academicLevelRequired: "Master",
    skills: ["Lean", "Power BI", "Process Mining"],
    max_interns: 1,
    duration: "4 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: false,
  },
  {
    id: "7",
    subject_id: "PFE-2026-007",
    title: "Inventory Forecasting",
    description: "Modélisation et prévision des stocks pour la supply chain.",
    department: "Logistique",
    site: "Mateur North",
    supervisor: "Faten Kefi",
    fieldOfStudy: "Supply Chain / Logistics",
    academicLevelRequired: "Master",
    skills: ["Forecasting", "Python", "SQL", "Supply Chain"],
    max_interns: 1,
    duration: "5 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: false,
  },
  {
    id: "8",
    subject_id: "PFE-2026-008",
    title: "Recruitment Analytics Platform",
    description: "Plateforme d'analytics RH pour le recrutement et la rétention.",
    department: "RH",
    site: "Sousse Messadine",
    supervisor: "Nadia Ben Youssef",
    fieldOfStudy: "HR / Data Science",
    academicLevelRequired: "Master",
    skills: ["Power BI", "HR Analytics", "Statistics"],
    max_interns: 1,
    duration: "4 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: false,
  },
  {
    id: "9",
    subject_id: "PFE-2026-009",
    title: "Budget Tracking Dashboard",
    description: "Tableau de bord de suivi budgétaire et reporting financier.",
    department: "Finance",
    site: "Menzel Hayet",
    supervisor: "Walid Bouzid",
    fieldOfStudy: "Finance / Controlling",
    academicLevelRequired: "Master",
    skills: ["Excel", "Power BI", "Finance", "VBA"],
    max_interns: 1,
    duration: "5 mois",
    status: "open",
    type: "PFE",
    requires_technical_interview: false,
  },
];

// Initial applications
const initialApplications: ApplicationMock[] = [
  {
    id: "pfe-1",
    fullName: "Ahmed Ben Salem",
    email: "ahmed.bensalem@ensi.tn",
    phone: "+216 98 765 432",
    university: "ENSI",
    academicLevel: "Cycle d'Ingénieur",
    fieldOfStudy: "Computer Science",
    projectTitle: "AI Predictive Maintenance System",
    subjectId: "PFE-2026-001",
    subjectTitle: "Développement d'une plateforme de gestion de stages",
    site: "Sousse Messadine",
    department: "IT / Digital",
    aiMatchingScore: 92,
    cvUrl: "/mock/cv/ahmed-ben-salem.pdf",
    status: "accepted",
    appliedAt: "2026-02-15",
    requiresTechnicalInterview: false,
  },
  {
    id: "pfe-2",
    fullName: "Sarra Trabelsi",
    email: "sarra.trabelsi@insat.tn",
    phone: "+216 55 123 456",
    university: "INSAT",
    academicLevel: "Cycle d'Ingénieur",
    fieldOfStudy: "Industrial Engineering",
    projectTitle: "Supply Chain Optimization Platform",
    subjectId: "PFE-2026-002",
    subjectTitle: "Optimisation de la chaîne de production par IoT",
    site: "Mateur South",
    department: "Production",
    aiMatchingScore: 88,
    cvUrl: "/mock/cv/sarra-trabelsi.pdf",
    status: "pending_technical_interview",
    appliedAt: "2026-02-10",
    requiresTechnicalInterview: true,
  },
  {
    id: "pfe-3",
    fullName: "Yasmine Kallel",
    email: "yasmine.kallel@enit.tn",
    phone: "+216 22 456 789",
    university: "ENIT",
    academicLevel: "Master",
    fieldOfStudy: "Industrial Engineering",
    projectTitle: "Smart Inventory Tracking System",
    subjectId: "PFE-2026-001",
    subjectTitle: "Développement d'une plateforme de gestion de stages",
    site: "Sidi Bouali",
    department: "Production",
    aiMatchingScore: 85,
    cvUrl: "/mock/cv/yasmine-kallel.pdf",
    status: "accepted",
    appliedAt: "2026-02-12",
    requiresTechnicalInterview: false,
  },
  {
    id: "pfe-4",
    fullName: "Mohamed Gharbi",
    email: "mohamed.gharbi@esprit.tn",
    phone: "+216 99 321 654",
    university: "ESPRIT",
    academicLevel: "Cycle d'Ingénieur",
    fieldOfStudy: "Software Engineering",
    projectTitle: "ERP Automation Tool",
    subjectId: "PFE-2026-002",
    subjectTitle: "Optimisation de la chaîne de production par IoT",
    site: "Mateur North",
    department: "IT / Digital",
    aiMatchingScore: 73,
    cvUrl: "/mock/cv/mohamed-gharbi.pdf",
    status: "pending",
    appliedAt: "2026-02-14",
    requiresTechnicalInterview: true,
  },
  {
    id: "pfe-5",
    fullName: "Amira Bouaziz",
    email: "amira.bouaziz@supcom.tn",
    phone: "+216 23 654 321",
    university: "SUP'COM",
    academicLevel: "Cycle d'Ingénieur",
    fieldOfStudy: "Embedded Systems",
    projectTitle: "Digital Twin for Wiring Harness",
    subjectId: "PFE-2026-001",
    subjectTitle: "Développement d'une plateforme de gestion de stages",
    site: "Menzel Hayet",
    department: "Engineering",
    aiMatchingScore: 64,
    cvUrl: "/mock/cv/amira-bouaziz.pdf",
    status: "rejected",
    appliedAt: "2026-02-08",
    requiresTechnicalInterview: false,
  },
];

// Initial accepted interns
const initialInterns: InternMock[] = [
  {
    id: "1",
    name: "Fatma Trabelsi",
    email: "fatma.trabelsi@insat.tn",
    university: "INSAT",
    department: "Production",
    supervisor: "Trabelsi Sami",
    subject: "Optimisation de la chaîne de production par IoT",
    type: "PFE",
    startDate: "2026-02-10",
    startMonth: getStartMonth("2026-02-10"),
    endDate: "2026-06-10",
    matricule: "270352",
    progress: 35,
    degree: "Cycle d'Ingénieur",
    site: "Mateur South",
    badgeGenerated: false,
    certificateGenerated: false,
    internshipStatus: "accepted",
    pcAuthorizations: [],
    equipmentAuthorizations: [],
    technicalInterviewStatus: "none",
    recommendedBySupervisor: false,
    source: "application",
  },
  {
    id: "2",
    name: "Smayen Abir",
    email: "abir.smayen@enit.tn",
    university: "ENIT",
    department: "SME",
    supervisor: "Ben Nasr Mohamed Amine",
    subject: "Développement d'une plateforme de gestion de stages",
    type: "PFE",
    startDate: "2026-02-10",
    startMonth: getStartMonth("2026-02-10"),
    endDate: "2026-06-10",
    matricule: "270351",
    progress: 45,
    degree: "Cycle d'Ingénieur",
    site: "Sousse Messadine",
    badgeGenerated: false,
    certificateGenerated: false,
    internshipStatus: "accepted",
    pcAuthorizations: [],
    equipmentAuthorizations: [],
    technicalInterviewStatus: "none",
    recommendedBySupervisor: false,
    source: "application",
  },
  {
    id: "3",
    name: "Ahmed Ben Salem",
    email: "ahmed.bensalem@ensi.tn",
    university: "ENSI",
    department: "IT / Digital",
    supervisor: "Ben Nasr Mohamed Amine",
    subject: "Développement d'une plateforme de gestion de stages",
    type: "PFE",
    startDate: "2026-03-01",
    startMonth: getStartMonth("2026-03-01"),
    endDate: "2026-07-01",
    matricule: "270353",
    progress: 20,
    degree: "Cycle d'Ingénieur",
    site: "Sousse Messadine",
    badgeGenerated: false,
    certificateGenerated: false,
    internshipStatus: "accepted",
    pcAuthorizations: [],
    equipmentAuthorizations: [],
    technicalInterviewStatus: "none",
    recommendedBySupervisor: false,
    source: "application",
  },
  {
    id: "4",
    name: "Yasmine Kallel",
    email: "yasmine.kallel@enit.tn",
    university: "ENIT",
    department: "Production",
    supervisor: "Gharbi Leila",
    subject: "Smart Inventory Tracking System",
    type: "PFE",
    startDate: "2026-03-15",
    startMonth: getStartMonth("2026-03-15"),
    endDate: "2026-09-15",
    matricule: "270354",
    progress: 10,
    degree: "Master",
    site: "Sidi Bouali",
    badgeGenerated: false,
    certificateGenerated: false,
    internshipStatus: "accepted",
    pcAuthorizations: [],
    equipmentAuthorizations: [],
    technicalInterviewStatus: "none",
    recommendedBySupervisor: false,
    source: "application",
  },
  // Mock interns assigned to Supervisor (Mohamed Amine Ben Nasr) for testing
  {
    id: "enc-1",
    name: "Ahmed Ben Ali",
    email: "ahmed.benali@ensi.tn",
    university: "ENSI",
    department: "IT / Digital",
    supervisor: "Mohamed Amine Ben Nasr",
    technicalSupervisor: "Mohamed Amine Ben Nasr",
    functionalSupervisor: "Mohamed Amine Ben Nasr",
    subject: "AI Predictive Maintenance",
    type: "PFE",
    startDate: "2026-02-01",
    startMonth: getStartMonth("2026-02-01"),
    endDate: "2026-07-31",
    matricule: "270355",
    progress: 55,
    degree: "Cycle d'Ingénieur",
    site: "Sousse Messadine",
    badgeGenerated: false,
    certificateGenerated: false,
    internshipStatus: "accepted",
    pcAuthorizations: [],
    equipmentAuthorizations: [],
    technicalInterviewStatus: "none",
    recommendedBySupervisor: false,
    source: "application",
  },
  {
    id: "enc-2",
    name: "Sara Trabelsi",
    email: "sara.trabelsi@insat.tn",
    university: "INSAT",
    department: "IT / Digital",
    supervisor: "Mohamed Amine Ben Nasr",
    technicalSupervisor: "Mohamed Amine Ben Nasr",
    functionalSupervisor: "Mohamed Amine Ben Nasr",
    subject: "Cybersecurity Monitoring",
    type: "Summer",
    startDate: "2026-07-01",
    startMonth: getStartMonth("2026-07-01"),
    endDate: "2026-08-31",
    matricule: "270356",
    progress: 0,
    degree: "Master",
    site: "Sousse Messadine",
    badgeGenerated: false,
    certificateGenerated: false,
    internshipStatus: "accepted",
    pcAuthorizations: [],
    equipmentAuthorizations: [],
    technicalInterviewStatus: "none",
    recommendedBySupervisor: false,
    source: "application",
  },
  {
    id: "enc-3",
    name: "Youssef Karray",
    email: "youssef.karray@enit.tn",
    university: "ENIT",
    department: "IT / Digital",
    supervisor: "Mohamed Amine Ben Nasr",
    technicalSupervisor: "Mohamed Amine Ben Nasr",
    functionalSupervisor: "Mohamed Amine Ben Nasr",
    subject: "Process Optimization",
    type: "PFA",
    startDate: "2026-03-01",
    startMonth: getStartMonth("2026-03-01"),
    endDate: "2026-05-31",
    matricule: "270357",
    progress: 40,
    degree: "Licence",
    site: "Mateur South",
    badgeGenerated: false,
    certificateGenerated: false,
    internshipStatus: "accepted",
    pcAuthorizations: [],
    equipmentAuthorizations: [],
    technicalInterviewStatus: "none",
    recommendedBySupervisor: false,
    source: "application",
  },
  {
    id: "enc-4",
    name: "Mariem Gharbi",
    email: "mariem.gharbi@esprit.tn",
    university: "ESPRIT",
    department: "IT / Digital",
    supervisor: "Mohamed Amine Ben Nasr",
    technicalSupervisor: "Mohamed Amine Ben Nasr",
    functionalSupervisor: "Mohamed Amine Ben Nasr",
    subject: "Inventory Forecasting",
    type: "PFE",
    startDate: "2026-02-15",
    startMonth: getStartMonth("2026-02-15"),
    endDate: "2026-08-15",
    matricule: "270358",
    progress: 30,
    degree: "Master",
    site: "Mateur North",
    badgeGenerated: false,
    certificateGenerated: false,
    internshipStatus: "accepted",
    pcAuthorizations: [],
    equipmentAuthorizations: [],
    technicalInterviewStatus: "none",
    recommendedBySupervisor: false,
    source: "application",
  },
];

// Initial alumni (completed interns)
const initialAlumni: AlumniMock[] = [
  {
    id: "a1",
    full_name: "Karim Mansouri",
    email: "karim.mansouri@esprit.tn",
    department: "IT / Digital",
    site: "Sousse Messadine",
    internship_type: "PFE",
    supervisor: "Ben Nasr Mohamed Amine",
    project_title: "Plateforme web gestion des stocks",
    start_date: "2025-02-01",
    end_date: "2025-07-31",
    final_evaluation_score: 17,
    presentation_score: 16,
    voting_score: 8,
    is_top10: true,
    recruitment_eligible: true,
    equipment_returned: true,
    year: 2025,
  },
  {
    id: "a2",
    full_name: "Leila Ben Ali",
    email: "leila.benali@enit.tn",
    department: "Production",
    site: "Mateur South",
    internship_type: "PFE",
    supervisor: "Trabelsi Sami",
    project_title: "Automatisation tests qualité",
    start_date: "2025-01-15",
    end_date: "2025-07-15",
    final_evaluation_score: 16,
    presentation_score: 15,
    voting_score: 7,
    is_top10: false,
    recruitment_eligible: true,
    equipment_returned: true,
    year: 2025,
  },
];

// Initial Summer Book projects (short-term internships 1–2 months)
const initialSummerProjects: SummerProjectMock[] = [
  {
    id: "sb-1",
    title: "Internal Automation Script",
    department: "IT / Digital",
    description:
      "Short-term project to automate repetitive internal reporting tasks using Python scripts and scheduled jobs.",
    requiredSkills: ["Python", "Scripting", "Git"],
    durationMonths: 1,
    estimatedInterns: 1,
    supervisorName: "Mohamed Amine Ben Nasr",
    supervisorEmail: "encadrant@leoni.com",
    createdAt: "2026-02-01",
  },
  {
    id: "sb-2",
    title: "Process Mapping Analysis",
    department: "Production",
    description:
      "On-site mapping of a selected production process, including value stream mapping and quick-win proposal.",
    requiredSkills: ["Process Mapping", "Excel", "Industrial Engineering"],
    durationMonths: 2,
    estimatedInterns: 2,
    supervisorName: "Trabelsi Sami",
    supervisorEmail: "sami.trabelsi@leoni.com",
    createdAt: "2026-02-03",
  },
  {
    id: "sb-3",
    title: "Internship Data Reporting",
    department: "RH",
    description:
      "Build dashboards summarizing internship KPIs (applications, acceptance rate, schools, follow-up).",
    requiredSkills: ["Power BI", "Data Analysis", "Excel"],
    durationMonths: 1,
    estimatedInterns: 1,
    supervisorName: "Nadia Ben Youssef",
    supervisorEmail: "nadia.benyoussef@leoni.com",
    createdAt: "2026-02-05",
  },
  {
    id: "sb-4",
    title: "Stock Monitoring Tool",
    department: "Logistique",
    description:
      "Design a lightweight tool for monitoring safety stock levels and generating alerts for critical materials.",
    requiredSkills: ["Supply Chain", "Excel", "Power BI"],
    durationMonths: 2,
    estimatedInterns: 2,
    supervisorName: "Faten Kefi",
    supervisorEmail: "faten.kefi@leoni.com",
    createdAt: "2026-02-07",
  },
];

const generateMatricule = (): string => {
  const base = 270350 + Math.floor(Math.random() * 9999);
  return String(base);
};

const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

interface MockInternshipStoreContextType {
  subjects: PFESubjectMock[];
  applications: ApplicationMock[];
  interns: InternMock[];
  alumni: AlumniMock[];
  recommendations: SupervisorRecommendation[];
  generationLogs: {
    id: string;
    internId: string;
    internName: string;
    action: "badge" | "certificate";
    generatedAt: string;
  }[];

  // Summer Book — short-term internship projects (1–2 months)
  summerProjects: SummerProjectMock[];
  addSummerProject: (
    project: Omit<SummerProjectMock, "id" | "createdAt">
  ) => SummerProjectMock;
  updateSummerProject: (
    id: string,
    updates: Partial<SummerProjectMock>
  ) => void;
  deleteSummerProject: (id: string) => void;
  getSummerProjectsForSupervisor: (
    supervisorName: string
  ) => SummerProjectMock[];

  // PFE Subjects
  addSubject: (subject: Omit<PFESubjectMock, "id">) => void;
  updateSubject: (id: string, updates: Partial<PFESubjectMock>) => void;
  deleteSubject: (id: string) => void;
  getSubjectBySubjectId: (subjectId: string) => PFESubjectMock | undefined;

  // Applications
  addApplication: (
    app: Omit<ApplicationMock, "id">,
    subject: PFESubjectMock
  ) => ApplicationMock;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  acceptApplication: (
    id: string,
    supervisors: { technicalSupervisor: string; functionalSupervisor: string }
  ) => void;
  rejectApplication: (id: string) => void;

  // Interns
  addIntern: (intern: Omit<InternMock, "id" | "matricule">) => InternMock;
  updateIntern: (id: string, updates: Partial<InternMock>) => void;
  deleteIntern: (id: string) => void;
  setBadgeGenerated: (internId: string) => void;
  setCertificateGenerated: (internId: string) => void;

  // Supervisor recommendations (max 2 per supervisor)
  addRecommendation: (
    internId: string,
    supervisorId: string,
    supervisorName: string,
    intern: Omit<InternMock, "id" | "matricule">
  ) => { success: boolean; error?: string };
  getRecommendationCount: (supervisorId: string) => number;

  // Get interns by supervisor department
  getInternsBySupervisor: (supervisorName: string, department?: string) => InternMock[];
}

const MockInternshipStoreContext =
  createContext<MockInternshipStoreContextType | null>(null);

export const MockInternshipStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [subjects, setSubjects] = useState<PFESubjectMock[]>(initialSubjects);
  const [applications, setApplications] =
    useState<ApplicationMock[]>(initialApplications);
  const [interns, setInterns] = useState<InternMock[]>(initialInterns);
  const [alumni, setAlumni] = useState<AlumniMock[]>(initialAlumni);
  const [recommendations, setRecommendations] = useState<
    SupervisorRecommendation[]
  >([]);
  const [generationLogs, setGenerationLogs] = useState<
    {
      id: string;
      internId: string;
      internName: string;
      action: "badge" | "certificate";
      generatedAt: string;
    }[]
  >([]);
  const [summerProjects, setSummerProjects] = useState<SummerProjectMock[]>(
    initialSummerProjects
  );

  const getSubjectBySubjectId = useCallback(
    (subjectId: string) => subjects.find((s) => s.subject_id === subjectId),
    [subjects]
  );

  const addSubject = useCallback(
    (subject: Omit<PFESubjectMock, "id">) => {
      const id = generateId();
      setSubjects((prev) => [{ ...subject, id }, ...prev]);
    },
    []
  );

  const updateSubject = useCallback((id: string, updates: Partial<PFESubjectMock>) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addApplication = useCallback(
    (app: Omit<ApplicationMock, "id">, subject: PFESubjectMock) => {
      const id = generateId();
      const requiresInterview = subject.requires_technical_interview;
      const status: ApplicationStatus = requiresInterview
        ? "pending_technical_interview"
        : "accepted";

      const newApp: ApplicationMock = {
        ...app,
        id,
        status,
        requiresTechnicalInterview: requiresInterview,
        subjectTitle: subject.title,
        appliedAt: new Date().toISOString().slice(0, 10),
      };

      setApplications((prev) => [newApp, ...prev]);

      if (status === "accepted") {
        const startDate = new Date().toISOString().slice(0, 10);
        const newIntern: InternMock = {
          id: generateId(),
          name: app.fullName,
          email: app.email,
          department: app.department,
          subject: subject.title,
          subjectId: subject.subject_id,
          supervisor: subject.supervisor,
          technicalSupervisor: subject.supervisor,
          functionalSupervisor: subject.supervisor,
          matricule: generateMatricule(),
          startDate,
          startMonth: getStartMonth(startDate),
          endDate: new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10),
          type: "PFE",
          university: app.university,
          degree: app.academicLevel,
          progress: 0,
          site: subject.site,
          badgeGenerated: false,
          certificateGenerated: false,
          internshipStatus: "accepted",
          pcAuthorizations: [],
          equipmentAuthorizations: [],
          technicalInterviewStatus: "none",
          recommendedBySupervisor: false,
          source: "application",
        };
        setInterns((prev) => [newIntern, ...prev]);
      }

      return newApp;
    },
    []
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          return { ...a, status };
        })
      );
    },
    []
  );

  const acceptApplication = useCallback(
    (id: string, supervisors: { technicalSupervisor: string; functionalSupervisor: string }) => {
      const app = applications.find((a) => a.id === id);
      if (!app) return;
      const subject = getSubjectBySubjectId(app.subjectId);
      if (!subject) return;

      updateApplicationStatus(id, "accepted");

      const already = interns.some((i) => i.email === app.email && i.subjectId === subject.subject_id);
      if (already) return;

      const startDate = new Date().toISOString().slice(0, 10);
      const newIntern: InternMock = {
        id: generateId(),
        name: app.fullName,
        email: app.email,
        department: app.department,
        subject: subject.title,
        subjectId: subject.subject_id,
        supervisor: supervisors.technicalSupervisor,
        technicalSupervisor: supervisors.technicalSupervisor,
        functionalSupervisor: supervisors.functionalSupervisor,
        matricule: generateMatricule(),
        startDate,
        startMonth: getStartMonth(startDate),
        endDate: new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
        type: "PFE",
        university: app.university,
        degree: app.academicLevel,
        progress: 0,
        site: subject.site,
        badgeGenerated: false,
        certificateGenerated: false,
        internshipStatus: "accepted",
        pcAuthorizations: [],
        equipmentAuthorizations: [],
        technicalInterviewStatus: app.requiresTechnicalInterview ? "passed" : "none",
        recommendedBySupervisor: false,
        source: "application",
      };

      setInterns((prev) => [newIntern, ...prev]);
    },
    [applications, getSubjectBySubjectId, interns, updateApplicationStatus]
  );

  const rejectApplication = useCallback(
    (id: string) => updateApplicationStatus(id, "rejected"),
    [updateApplicationStatus]
  );

  const addIntern = useCallback(
    (intern: Omit<InternMock, "id" | "matricule">) => {
      const id = generateId();
      const matricule = generateMatricule();
      const newIntern: InternMock = {
        ...intern,
        id,
        matricule,
        badgeGenerated: false,
        certificateGenerated: false,
        internshipStatus: "accepted",
        pcAuthorizations: intern.pcAuthorizations ?? [],
        equipmentAuthorizations: intern.equipmentAuthorizations ?? [],
        startMonth: intern.startMonth ?? getStartMonth(intern.startDate),
        technicalInterviewStatus: "none",
        recommendedBySupervisor: false,
        source: "manual",
      };
      setInterns((prev) => [newIntern, ...prev]);
      return newIntern;
    },
    []
  );

  const updateIntern = useCallback((id: string, updates: Partial<InternMock>) => {
    setInterns((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  }, []);

  const deleteIntern = useCallback((id: string) => {
    setInterns((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setBadgeGenerated = useCallback((internId: string) => {
    const now = new Date().toISOString();
    setInterns((prev) =>
      prev.map((i) => (i.id === internId ? { ...i, badgeGenerated: true } : i))
    );
    const intern = interns.find((i) => i.id === internId);
    if (intern) {
      setGenerationLogs((prev) => {
        const exists = prev.some((l) => l.internId === internId && l.action === "badge");
        if (exists) return prev;
        return [{ id: generateId(), internId, internName: intern.name, action: "badge", generatedAt: now }, ...prev];
      });
    }
  }, [interns]);

  const setCertificateGenerated = useCallback(
    (internId: string) => {
      const now = new Date().toISOString();
      setInterns((prev) =>
        prev.map((i) =>
          i.id === internId ? { ...i, certificateGenerated: true } : i
        )
      );
      const intern = interns.find((i) => i.id === internId);
      if (intern) {
        setGenerationLogs((prev) => {
          const exists = prev.some(
            (l) => l.internId === internId && l.action === "certificate"
          );
          if (exists) return prev;
          return [
            {
              id: generateId(),
              internId,
              internName: intern.name,
              action: "certificate",
              generatedAt: now,
            },
            ...prev,
          ];
        });
      }
    },
    [interns]
  );

  const getRecommendationCount = useCallback(
    (supervisorId: string) =>
      recommendations.filter((r) => r.supervisorId === supervisorId).length,
    [recommendations]
  );

  const addRecommendation = useCallback(
    (
      _internId: string,
      supervisorId: string,
      supervisorName: string,
      intern: Omit<InternMock, "id" | "matricule">
    ) => {
      const count = recommendations.filter(
        (r) => r.supervisorId === supervisorId
      ).length;
      if (count >= 2) {
        return {
          success: false,
          error: "Maximum 2 recommendations per supervisor reached.",
        };
      }

      const id = generateId();
      const matricule = generateMatricule();
      const newIntern: InternMock = {
        ...intern,
        id,
        matricule,
        badgeGenerated: false,
        certificateGenerated: false,
        internshipStatus: "accepted",
        pcAuthorizations: [],
        equipmentAuthorizations: [],
        startMonth: intern.startMonth ?? getStartMonth(intern.startDate),
        technicalInterviewStatus: "none",
        recommendedBySupervisor: true,
        source: "supervisor_recommendation",
      };

      setRecommendations((prev) => [
        ...prev,
        { internId: id, supervisorId, supervisorName, createdAt: new Date().toISOString() },
      ]);
      setInterns((prev) => [newIntern, ...prev]);

      return { success: true };
    },
    [recommendations]
  );

  const getInternsBySupervisor = useCallback(
    (supervisorName: string, department?: string) => {
      let list = interns.filter(
        (i) =>
          i.technicalSupervisor === supervisorName ||
          i.functionalSupervisor === supervisorName ||
          i.supervisor === supervisorName
      );
      if (department) {
        list = list.filter((i) => i.department === department);
      }
      return list;
    },
    [interns]
  );

  const value: MockInternshipStoreContextType = {
    subjects,
    applications,
    interns,
    alumni,
    recommendations,
    generationLogs,
    summerProjects,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectBySubjectId,
    addApplication,
    updateApplicationStatus,
    acceptApplication,
    rejectApplication,
    addIntern,
    updateIntern,
    deleteIntern,
    setBadgeGenerated,
    setCertificateGenerated,
    addRecommendation,
    getRecommendationCount,
    getInternsBySupervisor,
    addSummerProject: useCallback(
      (project: Omit<SummerProjectMock, "id" | "createdAt">) => {
        const id = generateId();
        const createdAt = new Date().toISOString().slice(0, 10);
        const full: SummerProjectMock = { ...project, id, createdAt };
        setSummerProjects((prev) => [full, ...prev]);
        return full;
      },
      []
    ),
    updateSummerProject: useCallback(
      (id: string, updates: Partial<SummerProjectMock>) => {
        setSummerProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
      },
      []
    ),
    deleteSummerProject: useCallback((id: string) => {
      setSummerProjects((prev) => prev.filter((p) => p.id !== id));
    }, []),
    getSummerProjectsForSupervisor: useCallback(
      (supervisorName: string) =>
        summerProjects.filter((p) => p.supervisorName === supervisorName),
      [summerProjects]
    ),
  };

  return (
    <MockInternshipStoreContext.Provider value={value}>
      {children}
    </MockInternshipStoreContext.Provider>
  );
};

export const useMockInternshipStore = () => {
  const ctx = useContext(MockInternshipStoreContext);
  if (!ctx) throw new Error("useMockInternshipStore must be used within MockInternshipStoreProvider");
  return ctx;
};
