import { Users, FileText } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { useState } from "react";
import InternshipCertificate from "@/components/certificates/InternshipCertificate";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminInterns = () => {
  const { interns } = useMockInternshipStore();
  const [certificateModal, setCertificateModal] = useState<typeof interns[0] | null>(null);

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> Stagiaires acceptés — Consultation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Read-only. Liste de tous les stagiaires acceptés.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Nom</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Matricule</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Département</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Sujet</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Superviseurs</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Badge</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Certificat</th>
              </tr>
            </thead>
            <tbody>
              {interns.map((i) => (
                <tr key={i.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{i.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-primary">{i.matricule}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{i.department}</td>
                  <td className="px-6 py-4 text-sm text-foreground line-clamp-2">{i.subject}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="space-y-1">
                      <div><span className="text-xs text-muted-foreground">Tech:</span> {i.technicalSupervisor || "—"}</div>
                      <div><span className="text-xs text-muted-foreground">Func:</span> {i.functionalSupervisor || "—"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {i.internshipStatus === "internship_validated" ? (
                      <span className="text-xs font-medium text-leoni-purple bg-leoni-purple/10 px-2 py-1 rounded-full">Validé</span>
                    ) : (
                      <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">Accepté</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {i.badgeGenerated ? (
                      <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">Généré</span>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {i.certificateGenerated ? (
                      <button
                        onClick={() => setCertificateModal(i)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-leoni-purple/10 text-leoni-purple px-2 py-1 rounded-lg hover:bg-leoni-purple/20 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" /> View
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {interns.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Aucun stagiaire</p>
          </div>
        )}
      </div>

      <Dialog open={!!certificateModal} onOpenChange={() => setCertificateModal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate — {certificateModal?.name}</DialogTitle>
          </DialogHeader>
          {certificateModal && (
            <div className="py-4 max-w-full overflow-hidden">
              <InternshipCertificate intern={certificateModal} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminInterns;
