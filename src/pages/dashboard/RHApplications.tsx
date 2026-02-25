import { ClipboardList, Search, Eye, CheckCircle, XCircle, MessageSquare, Download, FileText } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { useState } from "react";
import { toast } from "sonner";
import { useApplications, useUpdateApplicationStatus } from "@/hooks/usePFESubjects";
import { departments, leoniSites } from "@/data/mockData";
import { Skeleton } from "@/components/ui/skeleton";

const RHApplications = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: applications = [], isLoading } = useApplications();
  const updateStatus = useUpdateApplicationStatus();

  const filtered = applications.filter((a: any) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (typeFilter !== "all" && a.application_type !== typeFilter) return false;
    if (siteFilter !== "all" && (a.preferred_site !== siteFilter && a.pfe_subjects?.site !== siteFilter)) return false;
    if (deptFilter !== "all" && (a.preferred_department !== deptFilter && a.pfe_subjects?.department !== deptFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.full_name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleStatusChange = async (id: string, name: string, status: string) => {
    await updateStatus.mutateAsync({ id, status });
    toast.success(`${name} marked as ${status}.`);
  };

  return (
    <DashboardLayout role="rh">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Applications Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage all internship applications.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search candidates..." />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">All Status</option>
            {["pending", "preselected", "interview", "accepted", "rejected"].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">All Types</option>
            {["PFE", "PFA", "Summer", "Perfectionnement"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={siteFilter} onChange={e => setSiteFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">All Sites</option>
            {leoniSites.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">All Depts</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Candidate</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Subject / Dept</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">University</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">CV</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="px-6 py-8"><Skeleton className="h-8 w-full" /></td></tr>
              ) : filtered.map((app: any) => (
                <tr key={app.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{app.full_name}</p>
                    <p className="text-xs text-muted-foreground">{app.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{app.application_type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {app.pfe_subjects ? (
                      <div>
                        <p className="text-xs font-mono text-primary">{app.pfe_subjects.subject_id}</p>
                        <p className="text-xs truncate max-w-[150px]">{app.pfe_subjects.title}</p>
                      </div>
                    ) : (
                      <span>{app.preferred_department || "—"}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{app.university}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4">
                    {app.cv_url ? (
                      <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        <Download className="h-3.5 w-3.5" /> CV
                      </a>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                    {app.motivation_letter_url && (
                      <a href={app.motivation_letter_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline ml-2">
                        <FileText className="h-3.5 w-3.5" /> Letter
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleStatusChange(app.id, app.full_name, "accepted")} className="p-1.5 rounded-lg hover:bg-success/10 transition-colors" title="Accept">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </button>
                      <button onClick={() => handleStatusChange(app.id, app.full_name, "rejected")} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" title="Reject">
                        <XCircle className="h-4 w-4 text-destructive" />
                      </button>
                      <button onClick={() => handleStatusChange(app.id, app.full_name, "interview")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Interview">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">No applications found.</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RHApplications;
