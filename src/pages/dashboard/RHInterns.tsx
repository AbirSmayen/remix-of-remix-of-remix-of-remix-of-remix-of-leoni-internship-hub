import { Users, Search, Eye, Trash2, CreditCard, ThumbsUp, Plus, FileText, UserPlus, Download, Printer, X } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { useState } from "react";
import { toast } from "sonner";
import LeoniBadge from "@/components/badge/LeoniBadge";
import { departments, leoniSites } from "@/data/mockData";
import InternshipCertificate from "@/components/certificates/InternshipCertificate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const getStartMonth = (startDate: string): string => {
  const d = new Date(startDate);
  const m = d.getMonth();
  return monthNames[m] ?? "January";
};

const RHInterns = () => {
  const { interns, setBadgeGenerated, setCertificateGenerated, deleteIntern, addIntern, updateIntern } = useMockInternshipStore();
  const [search, setSearch] = useState("");
  const [startMonthFilter, setStartMonthFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [badgeModal, setBadgeModal] = useState<{ id: string; name: string; matricule: string; department: string; supervisor: string; startDate: string; endDate: string } | null>(null);
  const [detailsModal, setDetailsModal] = useState<typeof interns[0] | null>(null);
  const [supervisorEdit, setSupervisorEdit] = useState({ technicalSupervisor: "", functionalSupervisor: "" });
  const [certificateModal, setCertificateModal] = useState<typeof interns[0] | null>(null);
  const [showAddIntern, setShowAddIntern] = useState(false);
  const [assignSupervisorModal, setAssignSupervisorModal] = useState<typeof interns[0] | null>(null);
  const [assignSupervisorEdit, setAssignSupervisorEdit] = useState({ technicalSupervisor: "", functionalSupervisor: "" });
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    department: "IT / Digital",
    site: leoniSites[0],
    subject: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    recommended: false,
    technicalSupervisor: "",
    functionalSupervisor: "",
  });

  const filtered = interns.filter((i) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      i.name.toLowerCase().includes(q) ||
      i.department.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q);

    const startMonth = i.startMonth || getStartMonth(i.startDate);
    const matchesMonth = startMonthFilter === "all" || startMonth === startMonthFilter;
    const matchesDept = departmentFilter === "all" || i.department === departmentFilter;
    const matchesSite = siteFilter === "all" || (i.site || "") === siteFilter;

    return matchesSearch && matchesMonth && matchesDept && matchesSite;
  });

  const handleGenerateBadge = (intern: typeof interns[0]) => {
    setBadgeGenerated(intern.id);
    setBadgeModal({
      id: intern.id,
      name: intern.name,
      matricule: intern.matricule,
      department: intern.department,
      supervisor: intern.supervisor,
      startDate: intern.startDate,
      endDate: intern.endDate,
    });
    toast.success("Badge generated for " + intern.name);
  };

  const handleGenerateCertificate = (intern: typeof interns[0]) => {
    if (intern.internshipStatus !== "internship_validated") {
      toast.error("Certificate can be generated only after supervisor validates internship completion.");
      return;
    }
    setCertificateGenerated(intern.id);
    setCertificateModal(intern);
    toast.success("Certificate generated for " + intern.name);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete intern ${name}?`)) {
      deleteIntern(id);
      toast.success("Intern deleted.");
      setDetailsModal(null);
    }
  };

  const handleAddIntern = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addForm.name ||
      !addForm.email ||
      !addForm.department ||
      !addForm.site ||
      !addForm.subject ||
      !addForm.startDate ||
      !addForm.endDate ||
      !addForm.technicalSupervisor.trim() ||
      !addForm.functionalSupervisor.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    addIntern({
      name: addForm.name,
      email: addForm.email,
      department: addForm.department,
      site: addForm.site,
      subject: addForm.subject,
      supervisor: addForm.technicalSupervisor.trim(),
      technicalSupervisor: addForm.technicalSupervisor.trim(),
      functionalSupervisor: addForm.functionalSupervisor.trim(),
      startDate: addForm.startDate,
      startMonth: getStartMonth(addForm.startDate),
      endDate: addForm.endDate,
      type: "PFE",
      recommendedBySupervisor: addForm.recommended,
      source: "manual",
    });

    toast.success("Intern added to Accepted interns list.");
    setShowAddIntern(false);
    setAddForm((f) => ({
      ...f,
      name: "",
      email: "",
      subject: "",
      recommended: false,
      technicalSupervisor: "",
      functionalSupervisor: "",
    }));
  };

  return (
    <DashboardLayout role="rh">
      {/* Page header: left = title + filters + search, right = Add Intern */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" /> Interns
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Accepted interns — filter by start month for onboarding badge generation.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => setShowAddIntern(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Intern
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search interns..."
            />
          </div>
          <select
            value={startMonthFilter}
            onChange={(e) => setStartMonthFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Start Month (All)</option>
            {monthNames.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Department (All)</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">Sites (All)</option>
            {leoniSites.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Subject</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Badge</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Supervisor</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Certificate</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((intern) => (
                <tr key={intern.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">{intern.name}</p>
                    <p className="text-xs text-muted-foreground">{intern.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{intern.department}</td>
                  <td className="px-6 py-4 text-sm text-foreground line-clamp-2 max-w-[200px]">{intern.subject}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {intern.type || "PFE"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {intern.internshipStatus === "internship_validated" ? (
                      <span className="text-xs font-medium text-leoni-purple bg-leoni-purple/10 px-2 py-1 rounded-full">
                        Validated
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                        Accepted
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {intern.badgeGenerated ? (
                      <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">Generated</span>
                    ) : (
                      <button
                        onClick={() => handleGenerateBadge(intern)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <CreditCard className="h-3.5 w-3.5" /> Generate
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              setAssignSupervisorModal(intern);
                              setAssignSupervisorEdit({
                                technicalSupervisor: intern.technicalSupervisor || intern.supervisor || "",
                                functionalSupervisor: intern.functionalSupervisor || "",
                              });
                            }}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                          >
                            <UserPlus className="h-3.5 w-3.5" /> Assign
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Assign Technical & Functional Supervisors</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td className="px-6 py-4">
                    {intern.certificateGenerated ? (
                      <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">Generated</span>
                    ) : intern.internshipStatus !== "internship_validated" ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold bg-secondary text-muted-foreground cursor-not-allowed">
                              <FileText className="h-3.5 w-3.5" /> Generate
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Awaiting supervisor validation</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <button
                        onClick={() => handleGenerateCertificate(intern)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold bg-leoni-purple/10 text-leoni-purple hover:bg-leoni-purple/20 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" /> Generate
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setDetailsModal(intern);
                          setSupervisorEdit({
                            technicalSupervisor: intern.technicalSupervisor || intern.supervisor || "",
                            functionalSupervisor: intern.functionalSupervisor || "",
                          });
                        }}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(intern.id, intern.name)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No interns found</p>
          </div>
        )}
      </div>

      {/* Badge preview modal */}
      <Dialog open={!!badgeModal} onOpenChange={() => setBadgeModal(null)}>
        <DialogContent className="max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Badge — {badgeModal?.name}</DialogTitle>
          </DialogHeader>
          {badgeModal && (
            <div className="py-4">
              <LeoniBadge
                matricule={badgeModal.matricule}
                name={badgeModal.name}
                department={badgeModal.department}
                supervisor={badgeModal.supervisor}
                startDate={badgeModal.startDate}
                endDate={badgeModal.endDate}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate preview modal */}
      <Dialog open={!!certificateModal} onOpenChange={() => setCertificateModal(null)}>
        <DialogContent className="max-w-[850px] w-full p-0 border-none bg-transparent">
          {certificateModal && (
            <div className="mx-auto w-full max-w-[850px] rounded-2xl bg-card shadow-2xl border border-border/80 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Sticky header with controls */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b bg-background/95 backdrop-blur">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Attestation de Stage
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {certificateModal.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!certificateModal) return;
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Télécharger</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!certificateModal) return;
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Imprimer</span>
                  </button>
                  <button
                    onClick={() => setCertificateModal(null)}
                    className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable content area with scaled certificate */}
              <div className="flex-1 overflow-y-auto bg-muted/40 px-2 sm:px-4 pb-4">
                <div className="flex justify-center items-start pt-4">
                  <div className="origin-top scale-[0.75]">
                    <div className="w-[794px]">
                      <InternshipCertificate intern={certificateModal} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Intern modal */}
      <Dialog open={showAddIntern} onOpenChange={setShowAddIntern}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Intern</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddIntern} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                <input
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Nom et prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Department *</label>
                <select
                  value={addForm.department}
                  onChange={(e) => setAddForm((f) => ({ ...f, department: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Site *</label>
                <select
                  value={addForm.site}
                  onChange={(e) => setAddForm((f) => ({ ...f, site: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {leoniSites.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Subject *</label>
                <input
                  value={addForm.subject}
                  onChange={(e) => setAddForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Subject title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Technical Supervisor *</label>
                <input
                  value={addForm.technicalSupervisor}
                  onChange={(e) => setAddForm((f) => ({ ...f, technicalSupervisor: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Functional / Business Supervisor *</label>
                <input
                  value={addForm.functionalSupervisor}
                  onChange={(e) => setAddForm((f) => ({ ...f, functionalSupervisor: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Start Date *</label>
                <input
                  type="date"
                  value={addForm.startDate}
                  onChange={(e) => setAddForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">End Date *</label>
                <input
                  type="date"
                  value={addForm.endDate}
                  onChange={(e) => setAddForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={addForm.recommended}
                onChange={(e) => setAddForm((f) => ({ ...f, recommended: e.target.checked }))}
                className="mt-1 rounded border-border"
              />
              <span className="text-sm text-muted-foreground">
                Mark as <span className="font-medium text-foreground">Recommended</span> (added by RH, eligible for badge generation).
              </span>
            </label>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddIntern(false)}
                className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details modal */}
      <Dialog open={!!detailsModal} onOpenChange={() => setDetailsModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Intern Details — {detailsModal?.name}</DialogTitle>
          </DialogHeader>
          {detailsModal && (
            <div className="space-y-3 py-4 text-sm">
              <div><span className="font-medium text-muted-foreground">Email:</span> {detailsModal.email}</div>
              <div><span className="font-medium text-muted-foreground">Matricule:</span> {detailsModal.matricule}</div>
              <div><span className="font-medium text-muted-foreground">Department:</span> {detailsModal.department}</div>
              <div><span className="font-medium text-muted-foreground">Subject:</span> {detailsModal.subject}</div>
              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Supervisors</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Technical Supervisor *</label>
                    <input
                      value={supervisorEdit.technicalSupervisor}
                      onChange={(e) => setSupervisorEdit((s) => ({ ...s, technicalSupervisor: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Functional / Business Supervisor *</label>
                    <input
                      value={supervisorEdit.functionalSupervisor}
                      onChange={(e) => setSupervisorEdit((s) => ({ ...s, functionalSupervisor: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Name"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      const tech = supervisorEdit.technicalSupervisor.trim();
                      const func = supervisorEdit.functionalSupervisor.trim();
                      if (!tech || !func) {
                        toast.error("Both supervisors are required.");
                        return;
                      }
                      updateIntern(detailsModal.id, {
                        technicalSupervisor: tech,
                        functionalSupervisor: func,
                        supervisor: tech,
                      });
                      toast.success("Supervisors assigned.");
                    }}
                    className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80"
                  >
                    Save supervisors
                  </button>
                </div>
              </div>
              <div><span className="font-medium text-muted-foreground">Period:</span> {detailsModal.startDate} → {detailsModal.endDate}</div>
              {detailsModal.recommendedBySupervisor && (
                <div className="flex items-center gap-1 text-primary font-medium">
                  <ThumbsUp className="h-4 w-4" /> Recommended by Supervisor
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => { handleGenerateBadge(detailsModal); }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Generate Badge
                </button>
                <button
                  onClick={() => handleDelete(detailsModal.id, detailsModal.name)}
                  className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Supervisor modal */}
      <Dialog open={!!assignSupervisorModal} onOpenChange={(v) => !v && setAssignSupervisorModal(null)}>
        <DialogContent className="max-w-md rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle>Assign Supervisors — {assignSupervisorModal?.name}</DialogTitle>
          </DialogHeader>
          {assignSupervisorModal && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Technical Supervisor *</label>
                  <input
                    value={assignSupervisorEdit.technicalSupervisor}
                    onChange={(e) => setAssignSupervisorEdit((s) => ({ ...s, technicalSupervisor: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Functional / Business Supervisor *</label>
                  <input
                    value={assignSupervisorEdit.functionalSupervisor}
                    onChange={(e) => setAssignSupervisorEdit((s) => ({ ...s, functionalSupervisor: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const tech = assignSupervisorEdit.technicalSupervisor.trim();
                    const func = assignSupervisorEdit.functionalSupervisor.trim();
                    if (!tech || !func) {
                      toast.error("Both supervisors are required.");
                      return;
                    }
                    updateIntern(assignSupervisorModal.id, {
                      technicalSupervisor: tech,
                      functionalSupervisor: func,
                      supervisor: tech,
                    });
                    toast.success("Supervisors assigned.");
                    setAssignSupervisorModal(null);
                  }}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90"
                >
                  Save
                </button>
                <button
                  onClick={() => setAssignSupervisorModal(null)}
                  className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RHInterns;
