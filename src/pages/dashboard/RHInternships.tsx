import { Briefcase, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { departments, internshipTypes } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

interface Position {
  id: string;
  title: string;
  type: string;
  department: string;
  positions: number;
  level: string;
  duration: string;
  active: boolean;
}

const levels = ["Licence", "Cycle d'Ingénieur", "Master", "Technicien Supérieur"];

const initialPositions: Position[] = [
  { id: "1", title: "Développeur Web Full-Stack", type: "PFE", department: "IT / Digital", positions: 2, level: "Cycle d'Ingénieur", duration: "4 mois", active: true },
  { id: "2", title: "Ingénieur IoT Industriel", type: "PFE", department: "Production", positions: 1, level: "Cycle d'Ingénieur", duration: "6 mois", active: true },
  { id: "3", title: "Analyste Qualité Data", type: "PFA", department: "Qualité", positions: 3, level: "Master", duration: "2 mois", active: true },
  { id: "4", title: "Support IT Estival", type: "Summer", department: "IT / Digital", positions: 4, level: "Licence", duration: "1 mois", active: false },
  { id: "5", title: "Lean Manufacturing Observer", type: "Perfectionnement", department: "Production", positions: 2, level: "Technicien Supérieur", duration: "1 mois", active: true },
];

const emptyForm = { title: "", type: "PFE", department: "IT / Digital", positions: 1, level: "Cycle d'Ingénieur", duration: "" };

const RHInternships = () => {
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.duration) { toast.error("Please fill all fields."); return; }
    if (editingId) {
      setPositions(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p));
      toast.success("Position updated.");
    } else {
      setPositions(prev => [...prev, { id: Date.now().toString(), ...form, active: true }]);
      toast.success("New position created.");
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (p: Position) => {
    setForm({ title: p.title, type: p.type, department: p.department, positions: p.positions, level: p.level, duration: p.duration });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
    toast.success("Position deleted.");
  };

  const toggleActive = (id: string) => {
    setPositions(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <DashboardLayout role="rh">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Internship Positions</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage internship positions and openings.</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> New Position
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-8 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">{editingId ? "Edit Position" : "Create Position"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Position title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Internship Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                {internshipTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Department</label>
              <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Number of Positions</label>
              <input type="number" min={1} value={form.positions} onChange={e => setForm(f => ({ ...f, positions: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Required Level</label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Duration</label>
              <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 4 mois" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex gap-2">
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">{editingId ? "Update" : "Create"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Positions</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Level</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Duration</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{p.title}</td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{p.type}</span></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.department}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{p.positions}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.level}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.duration}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.active ? "published" : "draft"} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleActive(p.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title={p.active ? "Deactivate" : "Activate"}>
                        {p.active ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="h-4 w-4 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RHInternships;
