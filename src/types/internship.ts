/**
 * Types for internship management — frontend mock data
 */

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "pending_technical_interview";

export type InternshipStatus =
  | "accepted"
  | "active"
  | "internship_validated";

export type PCAuthorization = {
  pcName: string;
  pcId: string;
};

export type EquipmentAuthorization = {
  equipmentName: string;
  equipmentId?: string;
};

export interface PFESubjectMock {
  id: string;
  subject_id: string;
  title: string;
  description: string;
  department: string;
  site: string;
  address?: string;
  supervisor: string;
  fieldOfStudy: string;
  academicLevelRequired: string;
  skills: string[];
  max_interns: number;
  duration: string;
  status: "open" | "closed";
  type: "PFE";
  requires_technical_interview: boolean;
  created_at?: string;
}

export interface ApplicationMock {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  academicLevel: string;
  fieldOfStudy: string;
  projectTitle: string;
  subjectId: string;
  subjectTitle: string;
  site: string;
  department: string;
  status: ApplicationStatus;
  aiMatchingScore?: number;
  cvUrl?: string;
  appliedAt: string;
  requiresTechnicalInterview?: boolean;
}

export interface SummerProjectMock {
  id: string;
  title: string;
  department: string;
  description: string;
  requiredSkills: string[];
  durationMonths: 1 | 2;
  estimatedInterns: number;
  supervisorName: string;
  supervisorEmail?: string;
  createdAt: string;
}

export interface InternMock {
  id: string;
  name: string;
  cin?: string;
  email: string;
  department: string;
  site?: string;
  subject: string;
  subjectId?: string;
  supervisor: string;
  technicalSupervisor?: string;
  functionalSupervisor?: string;
  matricule: string;
  startDate: string;
  startMonth?: string;
  endDate: string;
  type: "PFE" | "PFA" | "Summer" | "Perfectionnement";
  university?: string;
  degree?: string;
  progress?: number;
  pcAuthorizations?: PCAuthorization[];
  equipmentAuthorizations?: EquipmentAuthorization[];
  internshipStatus?: InternshipStatus;
  badgeGenerated?: boolean;
  certificateGenerated?: boolean;
  technicalInterviewStatus?: "none" | "passed" | "pending" | "failed";
  recommendedBySupervisor?: boolean;
  source?: "application" | "manual" | "supervisor_recommendation";
  evaluationScore?: number;
  evaluationComment?: string;
}

export interface AlumniMock {
  id: string;
  full_name: string;
  email: string;
  department: string;
  site: string;
  internship_type: string;
  supervisor: string | null;
  project_title: string | null;
  start_date: string | null;
  end_date: string | null;
  final_evaluation_score: number | null;
  presentation_score: number | null;
  voting_score: number | null;
  is_top10: boolean;
  recruitment_eligible: boolean;
  equipment_returned: boolean;
  year: number;
}

export interface SupervisorRecommendation {
  internId: string;
  supervisorId: string;
  supervisorName: string;
  createdAt: string;
}
