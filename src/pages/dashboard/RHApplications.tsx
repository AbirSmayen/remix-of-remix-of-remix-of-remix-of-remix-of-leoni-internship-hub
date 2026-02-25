import { ClipboardList, Search, Filter, Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockApplications } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

const RHApplications = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockApplications.filter(a => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search && !a.candidateName.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAction = (name: string, action: string) => {
    toast.success(`${name} marked as ${action}.`);
  };

  return (
    <DashboardLayout role="rh">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Applications Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage internship applications.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search candidates..." />
        </div>
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
          {["all", "pending", "preselected", "interview", "accepted", "rejected"].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filter === s ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Candidate</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">University</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Subject</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{app.candidateName}</p>
                    <p className="text-xs text-muted-foreground">{app.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{app.university}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{app.subjectTitle}</td>
                  <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleAction(app.candidateName, "accepted")} className="p-1.5 rounded-lg hover:bg-success/10 transition-colors" title="Accept">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </button>
                      <button onClick={() => handleAction(app.candidateName, "rejected")} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" title="Reject">
                        <XCircle className="h-4 w-4 text-destructive" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Interview">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">No applications found.</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RHApplications;
