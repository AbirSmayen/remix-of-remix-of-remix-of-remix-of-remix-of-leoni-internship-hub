import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MockInternsProvider } from "@/contexts/MockInternsContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
// ... keep existing code (all imports)
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import PFEBook from "./pages/PFEBook";
import PFESubjectPage from "./pages/PFESubjectPage";
import ApplicationForm from "./pages/ApplicationForm";
import NotFound from "./pages/NotFound";

// RH pages
import RHDashboard from "./pages/dashboard/RHDashboard";
import RHPFEBook from "./pages/dashboard/RHPFEBook";
import RHInternships from "./pages/dashboard/RHInternships";
import RHApplications from "./pages/dashboard/RHApplications";
import RHShortTermApplications from "./pages/dashboard/RHShortTermApplications";
import RHInterns from "./pages/dashboard/RHInterns";
import RHEvents from "./pages/dashboard/RHEvents";
import RHStatistics from "./pages/dashboard/RHStatistics";
import RHSettings from "./pages/dashboard/RHSettings";
import RHValidation from "./pages/dashboard/RHValidation";
import RHEquipment from "./pages/dashboard/RHEquipment";
import RHVoting from "./pages/dashboard/RHVoting";
import RHAlumni from "./pages/dashboard/RHAlumni";
import RHRecruitmentDashboard from "./pages/dashboard/RHRecruitmentDashboard";
import DirectorVotingPage from "./pages/dashboard/DirectorVotingPage";

// Encadrant pages
import EncadrantDashboard from "./pages/dashboard/EncadrantDashboard";
import EncadrantInterns from "./pages/dashboard/EncadrantInterns";
import EncadrantSubmissions from "./pages/dashboard/EncadrantSubmissions";
import EncadrantProgress from "./pages/dashboard/EncadrantProgress";
import EncadrantEvaluations from "./pages/dashboard/EncadrantEvaluations";
import EncadrantCertificates from "./pages/dashboard/EncadrantCertificates";
import EncadrantSettings from "./pages/dashboard/EncadrantSettings";
import EncadrantProfile from "./pages/dashboard/EncadrantProfile";
import EncadrantAuthorizations from "./pages/dashboard/EncadrantAuthorizations";

// Stagiaire pages
import StagiaireDashboard from "./pages/dashboard/StagiaireDashboard";
import StagiaireInternship from "./pages/dashboard/StagiaireInternship";
import StagiaireSubmissions from "./pages/dashboard/StagiaireSubmissions";
import StagiaireProgress from "./pages/dashboard/StagiaireProgress";
import StagiaireFeedback from "./pages/dashboard/StagiaireFeedback";
import StagiaireEvents from "./pages/dashboard/StagiaireEvents";
import StagiaireBadge from "./pages/dashboard/StagiaireBadge";
import StagiaireCertificate from "./pages/dashboard/StagiaireCertificate";
import StagiairePresentation from "./pages/dashboard/StagiairePresentation";
import StagiaireSettings from "./pages/dashboard/StagiaireSettings";
import StagiaireProfile from "./pages/dashboard/StagiaireProfile";
import NonPFEApplication from "./pages/NonPFEApplication";
import BadgePreview from "./pages/BadgePreview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <MockInternsProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pfe-book" element={<PFEBook />} />
            <Route path="/pfe-book/:subjectId" element={<PFESubjectPage />} />
            <Route path="/apply/:subjectId" element={<ApplicationForm />} />
            <Route path="/apply/non-pfe" element={<NonPFEApplication />} />

            {/* RH Dashboard */}
            <Route path="/dashboard/rh" element={<ProtectedRoute allowedRoles={["rh"]}><RHDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/rh/pfe-book" element={<ProtectedRoute allowedRoles={["rh"]}><RHPFEBook /></ProtectedRoute>} />
            <Route path="/dashboard/rh/internships" element={<ProtectedRoute allowedRoles={["rh"]}><RHInternships /></ProtectedRoute>} />
            <Route path="/dashboard/rh/applications" element={<ProtectedRoute allowedRoles={["rh"]}><RHApplications /></ProtectedRoute>} />
            <Route path="/dashboard/rh/short-term-applications" element={<ProtectedRoute allowedRoles={["rh"]}><RHShortTermApplications /></ProtectedRoute>} />
            <Route path="/dashboard/rh/interns" element={<ProtectedRoute allowedRoles={["rh"]}><RHInterns /></ProtectedRoute>} />
            <Route path="/dashboard/rh/events" element={<ProtectedRoute allowedRoles={["rh"]}><RHEvents /></ProtectedRoute>} />
            <Route path="/dashboard/rh/statistics" element={<ProtectedRoute allowedRoles={["rh"]}><RHStatistics /></ProtectedRoute>} />
            <Route path="/dashboard/rh/settings" element={<ProtectedRoute allowedRoles={["rh"]}><RHSettings /></ProtectedRoute>} />
            <Route path="/dashboard/rh/validation" element={<ProtectedRoute allowedRoles={["rh"]}><RHValidation /></ProtectedRoute>} />
            <Route path="/dashboard/rh/equipment" element={<ProtectedRoute allowedRoles={["rh"]}><RHEquipment /></ProtectedRoute>} />
            <Route path="/dashboard/rh/badge-preview" element={<ProtectedRoute allowedRoles={["rh"]}><BadgePreview /></ProtectedRoute>} />
            <Route path="/dashboard/rh/voting" element={<ProtectedRoute allowedRoles={["rh"]}><RHVoting /></ProtectedRoute>} />
            <Route path="/dashboard/rh/alumni" element={<ProtectedRoute allowedRoles={["rh"]}><RHAlumni /></ProtectedRoute>} />
            <Route path="/dashboard/rh/recruitment" element={<ProtectedRoute allowedRoles={["rh"]}><RHRecruitmentDashboard /></ProtectedRoute>} />

            {/* Encadrant Dashboard */}
            <Route path="/dashboard/encadrant" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/interns" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantInterns /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/submissions" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantSubmissions /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/progress" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantProgress /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/evaluations" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantEvaluations /></ProtectedRoute>} />
            <Route path="/dashboard/director/voting" element={<ProtectedRoute allowedRoles={["director"]}><DirectorVotingPage /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/certificates" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantCertificates /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/settings" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantSettings /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/profile" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantProfile /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/authorizations" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantAuthorizations /></ProtectedRoute>} />

            {/* Stagiaire Dashboard */}
            <Route path="/dashboard/stagiaire" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/internship" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireInternship /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/submissions" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireSubmissions /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/progress" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireProgress /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/feedback" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireFeedback /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/events" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireEvents /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/badge" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireBadge /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/certificate" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireCertificate /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/presentation" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiairePresentation /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/settings" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireSettings /></ProtectedRoute>} />
            <Route path="/dashboard/stagiaire/profile" element={<ProtectedRoute allowedRoles={["stagiaire"]}><StagiaireProfile /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            </MockInternsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
