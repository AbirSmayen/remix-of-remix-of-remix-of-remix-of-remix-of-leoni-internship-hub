import { useMemo } from "react";
import { Trophy } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMockInterns } from "@/contexts/MockInternsContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

function csvEscape(value: unknown) {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const RHVoting = () => {
  const { user } = useAuth();
  const { interns } = useMockInterns();
  const year = 2026;

  const demoBestProjects = [
    {
      id: 101,
      name: "Ahmed Ben Ali",
      project: "AI Predictive Maintenance System",
      department: "Engineering",
      supervisor: "Supervisor 1",
      score: 92,
    },
    {
      id: 102,
      name: "Sarra Trabelsi",
      project: "Supply Chain Optimization Platform",
      department: "Logistics",
      supervisor: "Supervisor 2",
      score: 88,
    },
    {
      id: 103,
      name: "Yasmine Kallel",
      project: "Smart Inventory Tracking System",
      department: "Production",
      supervisor: "Supervisor 3",
      score: 85,
    },
  ];

  const realBestProjects = useMemo(
    () => interns.filter((i) => i.isBestProject === true),
    [interns]
  );

  const bestProjects = useMemo(
    () => (realBestProjects.length > 0 ? realBestProjects : demoBestProjects),
    [realBestProjects]
  );

  const bestProjectsSorted = useMemo(
    () => [...bestProjects].sort((a: any, b: any) => Number(b.score ?? 0) - Number(a.score ?? 0)),
    [bestProjects]
  );

  const totalSelected = bestProjectsSorted.length;

  const getStatusText = (score: number) => {
    if (score >= 90) return "Outstanding";
    if (score >= 85) return "Excellent";
    return "Very Good";
  };

  const getBadge = (score: number) => {
    const status = getStatusText(score);
    if (status === "Outstanding") {
      return { label: "🥇 Outstanding", cls: "bg-warning/10 text-warning border-warning/30" };
    }
    if (status === "Excellent") {
      return { label: "🥈 Excellent", cls: "bg-muted text-foreground border-border" };
    }
    return { label: "🥉 Very Good", cls: "bg-[#cd7f32]/10 text-[#8a4b1e] border-[#cd7f32]/30" };
  };

  const handleExport = () => {
    const header = [
      "Rank",
      "Project Title",
      "Intern",
      "Department",
      "Supervisor",
      "Final Score",
      "Status",
    ];
    const rows = bestProjectsSorted.map((p: any, idx: number) => {
      const score = Number(p.score ?? 0);
      return [
        idx + 1,
        p.project ?? "",
        p.name ?? "",
        p.department ?? "",
        p.supervisor ?? "",
        score.toFixed(0),
        getStatusText(score),
      ];
    });
    downloadCsv(`best-projects-${year}.csv`, header, rows);
  };

  return (
    <DashboardLayout role={user?.role === "director" ? "director" : "rh"}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Best Projects – {year}</h1>
        <p className="text-muted-foreground text-sm mt-1">Projects selected by supervisors</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-5 mb-6">
        <p className="text-sm text-muted-foreground">Total Best Projects: {totalSelected}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{totalSelected}</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Selected projects</h2>
          <Button onClick={handleExport} className="gap-2">
            Export Best Projects
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/40">
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Rank</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Project Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Intern</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Supervisor</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Final Score</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {bestProjectsSorted.map((intern: any, idx: number) => {
                const rank = idx + 1;
                const score = Number(intern.score ?? 0);
                const badge = getBadge(score);
                return (
                  <tr key={intern.id} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-foreground">{intern.project}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">{intern.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{intern.department}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{intern.supervisor}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="min-w-[160px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-primary">{score.toFixed(0)}/100</span>
                        </div>
                        <Progress value={Math.max(0, Math.min(100, score))} className="h-1.5" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RHVoting;
