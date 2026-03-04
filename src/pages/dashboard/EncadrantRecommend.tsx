import { ThumbsUp, Plus, User, Building2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { departments } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

const EncadrantRecommend = () => {
  const { user } = useAuth();
  const {
    addRecommendation,
    getRecommendationCount,
    getInternsBySupervisor,
  } = useMockInternshipStore();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    subject: "",
    startDate: "",
    endDate: "",
  });

  const supervisorId = user?.id || "u2";
  const supervisorName = user?.name || "Mohamed Amine Ben Nasr";
  const supervisorDept = user?.department || "IT / Digital";

  const count = getRecommendationCount(supervisorId);
  const canRecommend = count < 2;
  const myInterns = getInternsBySupervisor(supervisorName, supervisorDept);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.department || !form.subject || !form.startDate || !form.endDate) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    const result = addRecommendation(
      "",
      supervisorId,
      supervisorName,
      {
        name: form.name,
        email: form.email,
        department: form.department,
        subject: form.subject,
        supervisor: supervisorName,
        startDate: form.startDate,
        endDate: form.endDate,
        type: "PFE",
      }
    );
    if (result.success) {
      toast.success("Stagiaire recommandé et ajouté à la liste des acceptés.");
      setForm({ name: "", email: "", department: "", subject: "", startDate: "", endDate: "" });
      setShowForm(false);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ThumbsUp className="h-6 w-6 text-primary" /> Recommend Intern
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Recommandez un stagiaire pour qu&apos;il soit ajouté à la liste des acceptés. Maximum 2 recommandations par encadrant.
        </p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-foreground">
            Vos recommandations: <span className="font-bold text-primary">{count}</span> / 2
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!canRecommend}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              canRecommend
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4" /> Add Intern Recommendation
          </button>
        </div>
        {!canRecommend && (
          <p className="text-xs text-muted-foreground">Vous avez atteint la limite de 2 recommandations.</p>
        )}
      </div>

      {showForm && canRecommend && (
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">Nouveau stagiaire recommandé</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Nom et prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Département *</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Sélectionner</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Sujet PFE *</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Titre du sujet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Début de stage *</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Fin de stage *</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90"
              >
                Recommander
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-foreground">Vos stagiaires recommandés</h2>
          <p className="text-sm text-muted-foreground">Les stagiaires que vous avez recommandés apparaissent dans la liste des acceptés avec le badge &quot;Recommended by Supervisor&quot;.</p>
        </div>
        <div className="p-6">
          {myInterns.filter((i) => i.recommendedBySupervisor).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune recommandation pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myInterns
                .filter((i) => i.recommendedBySupervisor)
                .map((intern) => (
                  <div
                    key={intern.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-secondary/30"
                  >
                    <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {intern.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{intern.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {intern.department} • {intern.subject}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Recommended by Supervisor
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EncadrantRecommend;
