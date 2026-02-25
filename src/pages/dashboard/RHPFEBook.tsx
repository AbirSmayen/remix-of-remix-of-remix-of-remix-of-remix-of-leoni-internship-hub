import { BookOpen, Link2, Edit, Trash2, Plus, Eye, EyeOff, Search, X, MapPin, Share2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { departments, leoniSites } from "@/data/mockData";
import type { LeoniSite } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { usePFESubjects, useCreatePFESubject, useUpdatePFESubject, useDeletePFESubject, generateSubjectId } from "@/hooks/usePFESubjects";

const RHPFEBook = () => {
  const { data: subjects = [], isLoading } = usePFESubjects("PFE");
  const createMutation = useCreatePFESubject();
  const updateMutation = useUpdatePFESubject();
  const deleteMutation = useDeletePFESubject();

  const [publicLinkCopied, setPublicLinkCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");

  const emptyForm = { title: "", description: "", skills: [] as string[], department: "IT / Digital", maxInterns: 1, status: "open", site: "Sousse Messadine" as LeoniSite, address: "", supervisor: "", duration: "4 mois" };
  const [form, setForm] = useState(emptyForm);

  const pfeBookUrl = `${window.location.origin}/pfe-book`;

  const handleGenerateLink = () => {
    navigator.clipboard.writeText(pfeBookUrl);
    setPublicLinkCopied(true);
    toast.success("Public PFE Book link copied!");
    setTimeout(() => setPublicLinkCopied(false), 3000);
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(pfeBookUrl);
    const title = encodeURIComponent("LEONI Tunisia PFE Book 2026 — Internship Opportunities");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, "_blank");
  };

  const toggleStatus = async (id: string, current: string) => {
    await updateMutation.mutateAsync({ id, status: current === "open" ? "closed" : "open" });
    toast.success("Status updated.");
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error("Please fill all required fields."); return; }

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        title: form.title, description: form.description, skills: form.skills,
        department: form.department, max_interns: form.maxInterns, status: form.status,
        site: form.site, address: form.address, supervisor: form.supervisor, duration: form.duration,
      });
      toast.success("Subject updated.");
    } else {
      const subjectId = await generateSubjectId();
      await createMutation.mutateAsync({
        subject_id: subjectId, title: form.title, description: form.description, skills: form.skills,
        department: form.department, max_interns: form.maxInterns, status: form.status,
        site: form.site, address: form.address, supervisor: form.supervisor, duration: form.duration, type: "PFE",
      });
      toast.success(`New PFE subject created: ${subjectId}`);
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (s: any) => {
    setForm({ title: s.title, description: s.description, skills: s.skills || [], department: s.department, maxInterns: s.max_interns, status: s.status, site: s.site as LeoniSite, address: s.address || "", supervisor: s.supervisor || "", duration: s.duration || "4 mois" });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    toast.success("Subject deleted.");
  };

  const filtered = subjects.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || s.department === deptFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSite = siteFilter === "all" || s.site === siteFilter;
    return matchSearch && matchDept && matchStatus && matchSite;
  });

  return (
    <DashboardLayout role="rh">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">PFE Book Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Centralized PFE Book — All LEONI Tunisia sites.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
            <Plus className="h-4 w-4" /> New PFE Subject
          </button>
          <button onClick={handleGenerateLink} className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all">
            <Link2 className="h-4 w-4" />
            {publicLinkCopied ? "Copied!" : "Copy Link"}
          </button>
          <button onClick={handleShareLinkedIn} className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(210,80%,45%)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
            <Share2 className="h-4 w-4" /> LinkedIn
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-8 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">{editingId ? "Edit PFE Subject" : "Create New PFE Subject"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Subject Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. AI-based Quality Inspection" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Department *</label>
                <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Site *</label>
                <select value={form.site} onChange={e => setForm(f => ({ ...f, site: e.target.value as LeoniSite }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {leoniSites.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Zone Industrielle..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Supervisor</label>
                <input value={form.supervisor} onChange={e => setForm(f => ({ ...f, supervisor: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Describe the PFE subject..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Skills</label>
                <div className="flex gap-2">
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }} className="flex-1 px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Add skill" />
                  <button type="button" onClick={handleAddSkill} className="px-3 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80">Add</button>
                </div>
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.skills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {skill}
                        <button type="button" onClick={() => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Interns Needed</label>
                <input type="number" min={1} max={20} value={form.maxInterns} onChange={e => setForm(f => ({ ...f, maxInterns: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Duration</label>
                <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="4 mois" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90">{editingId ? "Update" : "Create Subject"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={siteFilter} onChange={e => setSiteFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All Sites</option>
          {leoniSites.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All Depts</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-foreground">PFE Subjects ({filtered.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Site</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Dept</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Interns</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-primary font-semibold">{s.subject_id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />{s.site}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.department}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{s.max_interns}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleStatus(s.id, s.status)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title={s.status === "open" ? "Close" : "Open"}>
                        {s.status === "open" ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => handleEdit(s)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No subjects found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RHPFEBook;
