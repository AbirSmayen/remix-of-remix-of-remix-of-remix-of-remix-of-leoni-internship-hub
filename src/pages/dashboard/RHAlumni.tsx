import { useState, useMemo } from "react";
import {
  Archive,
  Download,
  Filter,
  Search,
  Trophy,
  UserCheck,
  Building2,
  MapPin,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAlumni, useUpdateIntern } from "@/hooks/useInterns";
import { departments, leoniSites } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Intern } from "@/hooks/useInterns";

const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—");

function exportShortlist(alumni: Intern[]) {
  const headers = [
    "Full Name",
    "Internship Type",
    "Department",
    "Site",
    "Supervisor",
    "Project Title",
    "Final Eval",
    "Presentation",
    "Voting",
    "TOP 10",
    "Recruitment Eligible",
    "Equipment Returned",
    "Period",
  ];
  const rows = alumni.map((a) => [
    a.full_name,
    a.internship_type,
    a.department,
    a.site,
    a.supervisor ?? "",
    a.project_title ?? "",
    a.final_evaluation_score ?? "",
    a.presentation_score ?? "",
    a.voting_score ?? "",
    a.is_top10 ? "Yes" : "No",
    a.recruitment_eligible ? "Yes" : "No",
    a.equipment_returned ? "Yes" : "No",
    `${formatDate(a.start_date)} – ${formatDate(a.end_date)}`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LEONI-Alumni-Shortlist-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const RHAlumni = () => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [top10Only, setTop10Only] = useState(false);
  const [recruitmentOnly, setRecruitmentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "name" | "end_date">("score");
  const [showFilters, setShowFilters] = useState(true);

  const { data: alumni = [], isLoading } = useAlumni({
    department: deptFilter === "all" ? undefined : deptFilter,
    site: siteFilter === "all" ? undefined : siteFilter,
    isTop10: top10Only || undefined,
    recruitmentEligible: recruitmentOnly || undefined,
  });
  const updateIntern = useUpdateIntern();

  const filtered = useMemo(() => {
    let list = [...alumni];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          (a.project_title ?? "").toLowerCase().includes(q) ||
          (a.supervisor ?? "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "score")
      list.sort((a, b) => (b.final_evaluation_score ?? 0) - (a.final_evaluation_score ?? 0));
    else if (sortBy === "name") list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    else if (sortBy === "end_date") list.sort((a, b) => (b.end_date ?? "").localeCompare(a.end_date ?? ""));
    return list;
  }, [alumni, search, sortBy]);

  const handleExport = () => {
    exportShortlist(filtered);
    toast.success("Shortlist exported.");
  };

  const toggleRecruitmentEligible = async (id: string, current: boolean) => {
    await updateIntern.mutateAsync({ id, recruitment_eligible: !current });
    toast.success(current ? "Removed from recruitment eligible." : "Marked as Recruitment Eligible.");
  };

  return (
    <DashboardLayout role="rh">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Archive className="h-6 w-6 text-primary" /> Internship Alumni Archive
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Historical database of completed interns — filter, sort, and build recruitment shortlists.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <Filter className="h-4 w-4" /> {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Button onClick={handleExport} className="gap-2" disabled={filtered.length === 0}>
            <FileSpreadsheet className="h-4 w-4" /> Export Shortlist
          </Button>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card rounded-xl border shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, project, supervisor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Sites</option>
              {leoniSites.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "name" | "end_date")}
              className="px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="score">Sort by performance score</option>
              <option value="name">Sort by name</option>
              <option value="end_date">Sort by end date</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={top10Only}
                onChange={(e) => setTop10Only(e.target.checked)}
                className="rounded border-primary"
              />
              <span className="text-sm flex items-center gap-1"><Trophy className="h-4 w-4 text-warning" /> TOP 10 only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recruitmentOnly}
                onChange={(e) => setRecruitmentOnly(e.target.checked)}
                className="rounded border-primary"
              />
              <span className="text-sm flex items-center gap-1"><UserCheck className="h-4 w-4 text-success" /> Recruitment eligible</span>
            </label>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-2xl font-bold text-foreground">{alumni.length}</p>
          <p className="text-sm text-muted-foreground">Total alumni</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-2xl font-bold text-warning">{alumni.filter((a) => a.is_top10).length}</p>
          <p className="text-sm text-muted-foreground">TOP 10</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-2xl font-bold text-success">{alumni.filter((a) => a.recruitment_eligible).length}</p>
          <p className="text-sm text-muted-foreground">Recruitment eligible</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-2xl font-bold text-primary">{filtered.length}</p>
          <p className="text-sm text-muted-foreground">In current view</p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
          <Archive className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-foreground font-medium">No alumni match your filters</p>
          <p className="text-sm text-muted-foreground mt-1">Complete internships and archive them to see alumni here.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Type / Dept / Site</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Supervisor / Project</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Scores</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Period</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((a, idx) => (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b last:border-0 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{a.full_name}</p>
                        <p className="text-xs text-muted-foreground">{a.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="mb-1">{a.internship_type}</Badge>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> {a.department}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.site}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground">{a.supervisor ?? "—"}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{a.project_title ?? "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">Eval: <strong>{a.final_evaluation_score ?? "—"}</strong></p>
                        <p className="text-xs text-muted-foreground">Pres: {a.presentation_score ?? "—"} · Vote: {a.voting_score ?? "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        {a.is_top10 && <Badge className="bg-warning/20 text-warning border-warning/30 mb-1 gap-1"><Trophy className="h-3 w-3" /> TOP 10</Badge>}
                        {a.recruitment_eligible && <Badge className="bg-success/20 text-success border-success/30 gap-1"><UserCheck className="h-3 w-3" /> Eligible</Badge>}
                        {a.equipment_returned && <p className="text-xs text-muted-foreground mt-1">Equipment returned</p>}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(a.start_date)} – {formatDate(a.end_date)}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant={a.recruitment_eligible ? "secondary" : "default"}
                          onClick={() => toggleRecruitmentEligible(a.id, a.recruitment_eligible)}
                        >
                          {a.recruitment_eligible ? "Remove" : "Mark eligible"}
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RHAlumni;
