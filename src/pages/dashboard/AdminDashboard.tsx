import { LayoutDashboard, BookOpen, ClipboardList, Users, Archive, BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";

const AdminDashboard = () => {
  const { subjects, applications, interns, alumni, generationLogs } = useMockInternshipStore();
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const pending = applications.filter(
    (a) => a.status === "pending" || a.status === "pending_technical_interview"
  ).length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" /> Direction Générale — Vue d&apos;ensemble
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Read-only dashboard. Toutes les données sont consultables uniquement.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Sujets PFE" value={subjects.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Candidatures acceptées" value={accepted} icon={<ClipboardList className="h-5 w-5" />} color="text-success" />
        <StatCard title="Stagiaires actifs" value={interns.length} icon={<Users className="h-5 w-5" />} color="text-primary" />
        <StatCard title="Historique stagiaires" value={alumni.length} icon={<Archive className="h-5 w-5" />} color="text-muted-foreground" />
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" /> Statistiques globales
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold text-foreground">{applications.length}</p>
            <p className="text-sm text-muted-foreground">Total candidatures</p>
          </div>
          <div className="p-4 rounded-lg bg-success/10">
            <p className="text-2xl font-bold text-success">{accepted}</p>
            <p className="text-sm text-muted-foreground">Acceptées</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10">
            <p className="text-2xl font-bold text-warning">{pending}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </div>
          <div className="p-4 rounded-lg bg-destructive/10">
            <p className="text-2xl font-bold text-destructive">{rejected}</p>
            <p className="text-sm text-muted-foreground">Rejetées</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm mt-8 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-foreground">Badge & Certificate generation logs</h2>
          <p className="text-sm text-muted-foreground">Read-only audit trail of RH generation actions (mock).</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">When</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Action</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Intern</th>
              </tr>
            </thead>
            <tbody>
              {generationLogs.slice(0, 10).map((l) => (
                <tr key={l.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(l.generatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      l.action === "badge" ? "bg-primary/10 text-primary" : "bg-leoni-purple/10 text-leoni-purple"
                    }`}>
                      {l.action === "badge" ? "Badge generated" : "Certificate generated"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{l.internName}</td>
                </tr>
              ))}
              {generationLogs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No generation logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
