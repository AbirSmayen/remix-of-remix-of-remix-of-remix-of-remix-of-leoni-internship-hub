import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MockInternsProvider } from "@/contexts/MockInternsContext";
import { MockInternshipStoreProvider } from "@/contexts/MockInternshipStore";
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
import RHSummerBook from "./pages/dashboard/RHSummerBook";
import RHInternships from "./pages/dashboard/RHInternships";
import RHApplications from "./pages/dashboard/RHApplications";
import RHShortTermApplications from "./pages/dashboard/RHShortTermApplications";
import RHInterns from "./pages/dashboard/RHInterns";
import RHEvents from "./pages/dashboard/RHEvents";
import RHStatistics from "./pages/dashboard/RHStatistics";
import RHProfile from "./pages/dashboard/RHProfile";
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
import EncadrantSummerBook from "./pages/dashboard/EncadrantSummerBook";

import NonPFEApplication from "./pages/NonPFEApplication";
import BadgePreview from "./pages/BadgePreview";

// Admin (Direction Générale) pages — read-only
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminPFEBook from "./pages/dashboard/AdminPFEBook";
import AdminSummerBook from "./pages/dashboard/AdminSummerBook";
import AdminCandidatures from "./pages/dashboard/AdminCandidatures";
import AdminInterns from "./pages/dashboard/AdminInterns";
import AdminAlumni from "./pages/dashboard/AdminAlumni";
import AdminStatistics from "./pages/dashboard/AdminStatistics";
import AdminProfile from "./pages/dashboard/AdminProfile";

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
            <MockInternshipStoreProvider>
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
            <Route path="/dashboard/rh/summer-book" element={<ProtectedRoute allowedRoles={["rh"]}><RHSummerBook /></ProtectedRoute>} />
            <Route path="/dashboard/rh/internships" element={<ProtectedRoute allowedRoles={["rh"]}><RHInternships /></ProtectedRoute>} />
            <Route path="/dashboard/rh/short-term-applications" element={<ProtectedRoute allowedRoles={["rh"]}><RHShortTermApplications /></ProtectedRoute>} />
            <Route path="/dashboard/rh/interns" element={<ProtectedRoute allowedRoles={["rh"]}><RHInterns /></ProtectedRoute>} />
            <Route path="/dashboard/rh/events" element={<ProtectedRoute allowedRoles={["rh"]}><RHEvents /></ProtectedRoute>} />
            <Route path="/dashboard/rh/statistics" element={<ProtectedRoute allowedRoles={["rh"]}><RHStatistics /></ProtectedRoute>} />
            <Route path="/dashboard/rh/profile" element={<ProtectedRoute allowedRoles={["rh"]}><RHProfile /></ProtectedRoute>} />
            <Route path="/dashboard/rh/validation" element={<ProtectedRoute allowedRoles={["rh"]}><RHValidation /></ProtectedRoute>} />
            <Route path="/dashboard/rh/equipment" element={<ProtectedRoute allowedRoles={["rh"]}><RHEquipment /></ProtectedRoute>} />
            <Route path="/dashboard/rh/badge-preview" element={<ProtectedRoute allowedRoles={["rh"]}><BadgePreview /></ProtectedRoute>} />
            <Route path="/dashboard/rh/voting" element={<ProtectedRoute allowedRoles={["rh"]}><RHVoting /></ProtectedRoute>} />
            <Route path="/dashboard/rh/alumni" element={<ProtectedRoute allowedRoles={["rh"]}><RHAlumni /></ProtectedRoute>} />
            <Route path="/dashboard/rh/candidatures" element={<ProtectedRoute allowedRoles={["rh"]}><RHApplications /></ProtectedRoute>} />
            <Route path="/dashboard/rh/recruitment" element={<ProtectedRoute allowedRoles={["rh"]}><RHRecruitmentDashboard /></ProtectedRoute>} />

            {/* Encadrant Dashboard */}
            <Route path="/dashboard/encadrant" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/interns" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantInterns /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/summer-book" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantSummerBook /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/submissions" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantSubmissions /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/progress" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantProgress /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/evaluations" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantEvaluations /></ProtectedRoute>} />
            <Route path="/dashboard/director/voting" element={<ProtectedRoute allowedRoles={["director"]}><DirectorVotingPage /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/certificates" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantCertificates /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/settings" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantSettings /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/profile" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantProfile /></ProtectedRoute>} />
            <Route path="/dashboard/encadrant/authorizations" element={<ProtectedRoute allowedRoles={["encadrant"]}><EncadrantAuthorizations /></ProtectedRoute>} />

            {/* Admin (Direction Générale) — read-only */}
            <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/admin/pfe-book" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPFEBook /></ProtectedRoute>} />
            <Route path="/dashboard/admin/summer-book" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSummerBook /></ProtectedRoute>} />
            <Route path="/dashboard/admin/candidatures" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCandidatures /></ProtectedRoute>} />
            <Route path="/dashboard/admin/interns" element={<ProtectedRoute allowedRoles={["admin"]}><AdminInterns /></ProtectedRoute>} />
            <Route path="/dashboard/admin/alumni" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAlumni /></ProtectedRoute>} />
            <Route path="/dashboard/admin/statistics" element={<ProtectedRoute allowedRoles={["admin"]}><AdminStatistics /></ProtectedRoute>} />
            <Route path="/dashboard/admin/profile" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProfile /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            </MockInternshipStoreProvider>
            </MockInternsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
