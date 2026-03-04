import { Archive } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const AdminAlumni = () => {
  const { alumni } = useMockInternshipStore();
  const byYear = alumni.reduce<Record<number, typeof alumni>>((acc, a) => {
    if (!acc[a.year]) acc[a.year] = [];
    acc[a.year].push(a);
    return acc;
  }, {});
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Archive className="h-6 w-6 text-primary" /> Historique des stagiaires — Consultation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Read-only. Archives des stages terminés par année.</p>
      </div>

      {years.length === 0 ? (
        <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
          <Archive className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium text-foreground">Aucun historique</p>
        </div>
      ) : (
        <div className="space-y-6">
          {years.map((year) => (
            <div key={year} className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-3 bg-secondary/50 border-b">
                <h2 className="font-semibold text-foreground">{year} — {byYear[year].length} stagiaire(s)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-secondary/30">
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Nom</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Département / Site</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Projet</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Période</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byYear[year].map((a) => (
                      <tr key={a.id} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-foreground">{a.full_name}</p>
                          <p className="text-xs text-muted-foreground">{a.email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{a.department} / {a.site}</td>
                        <td className="px-6 py-4 text-sm text-foreground line-clamp-2">{a.project_title ?? "—"}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(a.start_date)} – {formatDate(a.end_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminAlumni;
