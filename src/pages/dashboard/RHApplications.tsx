import { ClipboardList, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { CvButton, FilterSelect, StatusPill } from "@/components/rh/applications/ApplicationComponents";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type TabKey = "all" | "accepted" | "pending" | "rejected";

const RHApplications = () => {
  const { applications, acceptApplication, rejectApplication } = useMockInternshipStore();
  const [tab, setTab] = useState<TabKey>("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [accepting, setAccepting] = useState<{ id: string; name: string } | null>(null);
  const [supervisors, setSupervisors] = useState({ technicalSupervisor: "", functionalSupervisor: "" });

  const pending = applications.filter(
    (a) => a.status === "pending" || a.status === "pending_technical_interview"
  );
  const accepted = applications.filter((a) => a.status === "accepted");
  const rejected = applications.filter((a) => a.status === "rejected");

  const tabData: Record<TabKey, typeof applications> = {
    all: applications,
    pending,
    accepted,
    rejected,
  };

  const siteOptions = ["Mateur South", "Mateur North", "Sousse Messadine", "Menzel Hayet", "Sidi Bouali"];
  const departmentOptions = ["IT / Digital", "Production", "Qualité", "Engineering", "SME", "Logistics"];

  const filtered = tabData[tab].filter((a) => {
    if (siteFilter !== "all" && a.site !== siteFilter) return false;
    if (departmentFilter !== "all" && a.department !== departmentFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.fullName.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <DashboardLayout role="rh">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> PFE Candidatures
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage PFE candidatures.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Total: <span className="font-semibold text-foreground">{applications.length}</span> candidatures
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search..."
            />
          </div>
          <FilterSelect value={departmentFilter} onChange={setDepartmentFilter} placeholder="All Departments" options={departmentOptions} />
          <div className="inline-flex items-center gap-1 rounded-full bg-card border px-1 py-1">
            {[
              { key: "all" as TabKey, label: "All" },
              { key: "accepted" as TabKey, label: "Accepted" },
              { key: "pending" as TabKey, label: "Pending" },
              { key: "rejected" as TabKey, label: "Rejected" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tab === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <FilterSelect value={siteFilter} onChange={setSiteFilter} placeholder="All Sites" options={siteOptions} />
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Candidate</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">University</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Academic Level</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Field of Study</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Applied Project</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Site</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">AI Score</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                {tab === "pending" && <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>}
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">CV</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">{app.fullName}</p>
                    <div className="mt-1 space-y-0.5">
                      <p className="text-xs text-muted-foreground">📧 {app.email}</p>
                      <p className="text-xs text-muted-foreground">📱 {app.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{app.university}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{app.academicLevel}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{app.fieldOfStudy}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground font-medium">{app.projectTitle}</p>
                    {app.requiresTechnicalInterview && (
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Technical interview required
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{app.site}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{app.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-primary">{app.aiMatchingScore ?? "—"}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill
                      status={
                        app.status === "pending_technical_interview"
                          ? "pending_technical_interview"
                          : app.status === "accepted"
                          ? "Accepted"
                          : app.status === "rejected"
                          ? "Rejected"
                          : "Pending"
                      }
                    />
                  </td>
                  {tab === "pending" && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setAccepting({ id: app.id, name: app.fullName });
                            setSupervisors({ technicalSupervisor: "", functionalSupervisor: "" });
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-success/10 text-success hover:bg-success/20 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            rejectApplication(app.id);
                            toast.success("Candidature rejetée.");
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <CvButton href={app.cvUrl || "#"} label="View CV" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">No candidatures in this section.</div>
        )}
      </div>

      <Dialog open={!!accepting} onOpenChange={(v) => !v && setAccepting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign supervisors — {accepting?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Before accepting, RH must assign both supervisors. You can adjust later from the intern details page.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Technical Supervisor *</label>
                <input
                  value={supervisors.technicalSupervisor}
                  onChange={(e) => setSupervisors((s) => ({ ...s, technicalSupervisor: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Functional / Business Supervisor *</label>
                <input
                  value={supervisors.functionalSupervisor}
                  onChange={(e) => setSupervisors((s) => ({ ...s, functionalSupervisor: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Name"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (!accepting) return;
                  if (!supervisors.technicalSupervisor.trim() || !supervisors.functionalSupervisor.trim()) {
                    toast.error("Both supervisors are required.");
                    return;
                  }
                  acceptApplication(accepting.id, {
                    technicalSupervisor: supervisors.technicalSupervisor.trim(),
                    functionalSupervisor: supervisors.functionalSupervisor.trim(),
                  });
                  toast.success("Candidature acceptée et supervisors assignés.");
                  setAccepting(null);
                }}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90"
              >
                Accept & Assign
              </button>
              <button
                onClick={() => setAccepting(null)}
                className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RHApplications;
