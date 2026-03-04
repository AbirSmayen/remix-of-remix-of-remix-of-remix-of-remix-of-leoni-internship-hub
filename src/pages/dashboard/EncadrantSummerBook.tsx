import { useState, useMemo } from "react";
import { BookOpen, Filter, MapPin, Plus, Tag, Users, Clock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { useAuth } from "@/contexts/AuthContext";
import { departments } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const EncadrantSummerBook = () => {
  const { user } = useAuth();
  const supervisorName = user?.name || "";

  const {
    summerProjects,
    addSummerProject,
    updateSummerProject,
    deleteSummerProject,
  } = useMockInternshipStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [skillInput, setSkillInput] = useState("");

  const emptyForm = {
    title: "",
    department: user?.department || "IT / Digital",
    description: "",
    requiredSkills: [] as string[],
    durationMonths: 1 as 1 | 2,
    estimatedInterns: 1,
  };
  const [form, setForm] = useState(emptyForm);

  const myProjects = useMemo(
    () => summerProjects.filter((p) => p.supervisorName === supervisorName),
    [summerProjects, supervisorName]
  );

  const filtered = myProjects.filter((p) => {
    const matchDept = deptFilter === "all" || p.department === deptFilter;
    const matchDuration =
      durationFilter === "all" ||
      (durationFilter === "1" && p.durationMonths === 1) ||
      (durationFilter === "2" && p.durationMonths === 2);
    return matchDept && matchDuration;
  });

  const handleOpenForm = (projectId?: string) => {
    if (!supervisorName) {
      toast.error("You must be logged in as a supervisor.");
      return;
    }
    if (projectId) {
      const proj = summerProjects.find((p) => p.id === projectId);
      if (!proj) return;
      if (proj.supervisorName !== supervisorName) {
        toast.error("You can only edit your own Summer Book projects.");
        return;
      }
      setForm({
        title: proj.title,
        department: proj.department,
        description: proj.description,
        requiredSkills: proj.requiredSkills,
        durationMonths: proj.durationMonths,
        estimatedInterns: proj.estimatedInterns,
      });
      setEditingId(proj.id);
    } else {
      setForm(emptyForm);
      setEditingId(null);
    }
    setSkillInput("");
    setShowForm(true);
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.requiredSkills.includes(trimmed)) {
      setForm((f) => ({ ...f, requiredSkills: [...f.requiredSkills, trimmed] }));
      setSkillInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.department || !form.description) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (!form.requiredSkills.length) {
      toast.error("Please add at least one required skill.");
      return;
    }

    if (editingId) {
      updateSummerProject(editingId, {
        title: form.title,
        department: form.department,
        description: form.description,
        requiredSkills: form.requiredSkills,
        durationMonths: form.durationMonths,
        estimatedInterns: form.estimatedInterns,
      });
      toast.success("Summer project updated.");
    } else {
      addSummerProject({
        title: form.title,
        department: form.department,
        description: form.description,
        requiredSkills: form.requiredSkills,
        durationMonths: form.durationMonths,
        estimatedInterns: form.estimatedInterns,
        supervisorName,
        supervisorEmail: user?.email,
      });
      toast.success("New summer project added to Summer Book.");
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const proj = summerProjects.find((p) => p.id === id);
    if (!proj || proj.supervisorName !== supervisorName) {
      toast.error("You can only delete your own Summer Book projects.");
      return;
    }
    deleteSummerProject(id);
    toast.success("Summer project deleted.");
  };

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Summer Book
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Short-Term Internship Projects (1–2 Months) created and managed by supervisors.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold border border-emerald-200">
            <Clock className="h-3 w-3" />
            Short-Term
          </span>
          <Button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 rounded-xl shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New summer project
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-xs"
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-xs"
        >
          <option value="all">All durations</option>
          <option value="1">1 Month</option>
          <option value="2">2 Months</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-card rounded-xl border shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Short-Term
                  </p>
                  <h3 className="text-base font-semibold text-foreground">
                    {p.title}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    <MapPin className="h-3 w-3" />
                    {p.department}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      p.durationMonths === 1
                        ? "bg-sky-50 text-sky-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {p.durationMonths === 1 ? "1 Month" : "2 Months"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-[11px] bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground"
                  >
                    <Tag className="h-3 w-3" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <div className="space-y-0.5">
                <p>
                  Supervisor:{" "}
                  <span className="font-medium text-foreground">
                    {p.supervisorName}
                  </span>
                </p>
                <p>
                  Planned interns:{" "}
                  <span className="font-medium text-foreground">
                    {p.estimatedInterns}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p>Created on {p.createdAt}</p>
                {p.supervisorName === supervisorName && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenForm(p.id)}
                      className="text-xs font-semibold px-3 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs font-semibold px-3 py-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">
            No summer projects yet. Use &quot;New summer project&quot; to
            create one.
          </p>
        </div>
      )}

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit summer project" : "New summer project"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Project title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Internal Automation Script"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Department *
                </label>
                <select
                  value={form.department}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, department: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Describe the short-term internship mission..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Required skills *
                </label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Add a skill and press Enter"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddSkill}
                  >
                    Add
                  </Button>
                </div>
                {form.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              requiredSkills: f.requiredSkills.filter(
                                (s) => s !== skill
                              ),
                            }))
                          }
                          className="text-primary/60 hover:text-primary"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Duration *
                  </label>
                  <select
                    value={form.durationMonths}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        durationMonths:
                          e.target.value === "2" ? (2 as 2) : (1 as 1),
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="1">1 Month</option>
                    <option value="2">2 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Estimated interns
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.estimatedInterns}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        estimatedInterns: Math.max(
                          1,
                          Math.min(10, Number(e.target.value) || 1)
                        ),
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground pt-2">
              <div className="space-y-0.5">
                <p>
                  Created by:{" "}
                  <span className="font-medium text-foreground">
                    {supervisorName || "—"}
                  </span>
                </p>
                <p>
                  Role: <span className="font-medium">Supervisor</span>
                </p>
              </div>
              <div>
                <p>
                  Note: This feature is frontend-only and used for planning
                  short-term internship projects.
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-3 justify-end">
              <Button type="submit" className="px-6">
                {editingId ? "Update project" : "Create project"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EncadrantSummerBook;

