import { ClipboardList } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { StatusPill } from "@/components/rh/applications/ApplicationComponents";

const AdminCandidatures = () => {
  const { applications } = useMockInternshipStore();
  const statusMap: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    pending_technical_interview: "Technical Interview",
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> PFE Candidatures — Consultation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Read-only. Toutes les candidatures PFE.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Candidat</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Université</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Niveau</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Spécialité</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Sujet</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">{a.fullName}</p>
                    <p className="text-xs text-muted-foreground">{a.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{a.university}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{a.academicLevel}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{a.fieldOfStudy}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{a.projectTitle}</td>
                  <td className="px-6 py-4">
                    <StatusPill status={statusMap[a.status] || a.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{a.appliedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {applications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Aucune candidature</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminCandidatures;
