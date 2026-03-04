import { BookOpen, MapPin } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";

const AdminPFEBook = () => {
  const { subjects } = useMockInternshipStore();

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">PFE Book — Consultation</h1>
        <p className="text-muted-foreground text-sm mt-1">Read-only. Liste des sujets PFE publiés.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Titre</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Site</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Département</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Entretien technique</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-primary font-semibold">{s.subject_id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />{s.site}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.department}</td>
                  <td className="px-6 py-4">
                    {s.requires_technical_interview ? (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Oui</span>
                    ) : (
                      <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">Non</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {subjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Aucun sujet PFE</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPFEBook;
