import { BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { BookOpen, ClipboardList, Users, Archive } from "lucide-react";

const AdminStatistics = () => {
  const { subjects, applications, interns, alumni } = useMockInternshipStore();
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const pending = applications.filter(
    (a) => a.status === "pending" || a.status === "pending_technical_interview"
  ).length;
  const rejected = applications.filter((a) => a.status === "rejected").length;
  const deptCounts = interns.reduce<Record<string, number>>((acc, i) => {
    acc[i.department] = (acc[i.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> Statistiques — Consultation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Read-only. Vue consolidée des données.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Sujets PFE" value={subjects.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Candidatures acceptées" value={accepted} icon={<ClipboardList className="h-5 w-5" />} color="text-success" />
        <StatCard title="Stagiaires actifs" value={interns.length} icon={<Users className="h-5 w-5" />} color="text-primary" />
        <StatCard title="Historique (alumni)" value={alumni.length} icon={<Archive className="h-5 w-5" />} color="text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Candidatures par statut</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Acceptées</span>
              <span className="font-semibold text-success">{accepted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">En attente</span>
              <span className="font-semibold text-warning">{pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rejetées</span>
              <span className="font-semibold text-destructive">{rejected}</span>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Stagiaires par département</h2>
          <div className="space-y-3">
            {Object.entries(deptCounts).map(([dept, count]) => (
              <div key={dept} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{dept}</span>
                <span className="font-semibold text-foreground">{count}</span>
              </div>
            ))}
            {Object.keys(deptCounts).length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStatistics;
