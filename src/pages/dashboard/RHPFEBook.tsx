import { BookOpen, Link2, Edit, Trash2, Plus, Eye, EyeOff, Search, X, MapPin } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockInternshipSubjects, departments, leoniSites } from "@/data/mockData";
import type { LeoniSite } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

interface PFESubject {
  id: string;
  title: string;
  description: string;
  skills: string[];
  department: string;
  maxInterns: number;
  status: "open" | "closed";
  site: LeoniSite;
  address: string;
}

const emptyForm: Omit<PFESubject, "id"> = {
  title: "",
  description: "",
  skills: [],
  department: "IT / Digital",
  maxInterns: 1,
  status: "open",
  site: "Sousse Messadine",
  address: "",
};

const RHPFEBook = () => {
  const [subjects, setSubjects] = useState<PFESubject[]>(
    mockInternshipSubjects.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      skills: s.skills,
      department: s.department,
      maxInterns: s.maxInterns,
      status: s.status === "published" ? "open" as const : "closed" as const,
      site: s.site,
      address: s.address,
    }))
  );
  const [publicLinkCopied, setPublicLinkCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");

  const handleGenerateLink = () => {
    navigator.clipboard.writeText("https://leoni.tn/pfe-book/2026");
    setPublicLinkCopied(true);
    toast.success("Public PFE Book link copied to clipboard!");
    setTimeout(() => setPublicLinkCopied(false), 3000);
  };

  const toggleStatus = (id: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "open" ? "closed" as const : "open" as const } : s));
    toast.success("Subject status updated.");
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error("Please fill all required fields."); return; }
    if (editingId) {
      setSubjects(prev => prev.map(s => s.id === editingId ? { ...s, ...form } : s));
      toast.success("Subject updated successfully.");
    } else {
      setSubjects(prev => [...prev, { id: Date.now().toString(), ...form }]);
      toast.success("New PFE subject created.");
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (s: PFESubject) => {
    setForm({ title: s.title, description: s.description, skills: s.skills, department: s.department, maxInterns: s.maxInterns, status: s.status, site: s.site, address: s.address });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
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
        <div className="flex items-center gap-3">
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
            <Plus className="h-4 w-4" /> New PFE Subject
          </button>
          <button onClick={handleGenerateLink} className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all">
            <Link2 className="h-4 w-4" />
            {publicLinkCopied ? "Link Copied!" : "Public Link"}
          </button>
        </div>
      </div>

      {/* Create / Edit Form */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Site Location *</label>
                <select value={form.site} onChange={e => setForm(f => ({ ...f, site: e.target.value as LeoniSite }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {leoniSites.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Zone Industrielle..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Describe the PFE subject..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Required Skills</label>
                <div className="flex gap-2">
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }} className="flex-1 px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Add a skill and press Enter" />
                  <button type="button" onClick={handleAddSkill} className="px-3 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all">Add</button>
                </div>
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.skills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Number of Interns</label>
                <input type="number" min={1} max={20} value={form.maxInterns} onChange={e => setForm(f => ({ ...f, maxInterns: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">{editingId ? "Update Subject" : "Create Subject"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <select value={siteFilter} onChange={e => setSiteFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All Sites</option>
          {leoniSites.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All Departments</option>
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
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Site</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Skills</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Interns</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {s.site}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {s.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="text-[11px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium">{skill}</span>
                      ))}
                      {s.skills.length > 3 && <span className="text-[11px] text-muted-foreground">+{s.skills.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{s.maxInterns}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleStatus(s.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title={s.status === "open" ? "Close" : "Open"}>
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
        {filtered.length === 0 && (
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
