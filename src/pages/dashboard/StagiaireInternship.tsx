import { GraduationCap, Calendar, User, MapPin } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns } from "@/data/mockData";

const intern = mockInterns[1];

const StagiaireInternship = () => {
  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Internship</h1>
        <p className="text-muted-foreground text-sm mt-1">Details about your current internship placement.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">{intern.type}</span>
            <h2 className="text-xl font-bold text-foreground mt-3">{intern.subject}</h2>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">Matricule: {intern.matricule}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3"><User className="h-5 w-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Supervisor</p><p className="font-medium text-foreground">{intern.supervisor}</p></div></div>
          <div className="flex items-center gap-3"><GraduationCap className="h-5 w-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium text-foreground">{intern.department}</p></div></div>
          <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Period</p><p className="font-medium text-foreground">{intern.startDate} → {intern.endDate}</p></div></div>
          <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">University</p><p className="font-medium text-foreground">{intern.university}</p></div></div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold text-primary">{intern.progress}%</span>
          </div>
          <div className="w-full h-4 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${intern.progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-primary">3</p>
          <p className="text-sm text-muted-foreground mt-1">Submissions</p>
        </div>
        <div className="bg-card rounded-xl border shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-success">2</p>
          <p className="text-sm text-muted-foreground mt-1">Approved</p>
        </div>
        <div className="bg-card rounded-xl border shadow-sm p-5 text-center">
          <p className="text-2xl font-bold text-warning">1</p>
          <p className="text-sm text-muted-foreground mt-1">Needs Revision</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StagiaireInternship;
