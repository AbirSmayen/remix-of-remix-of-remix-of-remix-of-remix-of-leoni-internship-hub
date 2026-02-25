import { Users, FileText, CheckCircle, Star, Eye, MessageSquare, Award, ClipboardCheck } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns, mockProgressUpdates, mockWorkSubmissions, mockAttendance } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: "easeOut" as const } }),
};

// Extended mock interns for the encadrant view matching the reference
const encadrantInterns = [
  { ...mockInterns[0], name: "Yassine Mansouri", department: "Software Eng.", subject: "Plateforme gestion des stages", progress: 65, startDate: "01/02/2025", endDate: "31/07/2025", statusTag: "on_track" as const, attendance: 95, submissions: 3, lastActive: "Aujourd'hui" },
  { ...mockInterns[1], name: "Rania Chaabane", department: "Electrical Eng.", subject: "Automatisation câblage automobile", progress: 42, startDate: "15/01/2025", endDate: "15/07/2025", statusTag: "at_risk" as const, attendance: 88, submissions: 2, lastActive: "Hier" },
  { id: "5", name: "Nour Jebali", email: "nour@esprit.tn", university: "ESPRIT", department: "Software Eng.", supervisor: "Ahmed Trabelsi", subject: "Contrôle qualité IA", type: "PFE" as const, startDate: "01/11/2024", endDate: "30/04/2025", matricule: "270355", progress: 88, degree: "Cycle d'Ingénieur" as const, validated: false, site: "Sousse Messadine" as const, statusTag: "ahead" as const, attendance: 98, submissions: 5, lastActive: "Aujourd'hui" },
];

const statusTagConfig: Record<string, { label: string; color: string }> = {
  on_track: { label: "En bonne voie", color: "bg-primary/10 text-primary border-primary/20" },
  at_risk: { label: "À risque", color: "bg-warning/10 text-warning border-warning/20" },
  ahead: { label: "En avance", color: "bg-success/10 text-success border-success/20" },
};

const progressBarColor = (tag: string) => {
  if (tag === "at_risk") return "bg-warning";
  if (tag === "ahead") return "bg-success";
  return "bg-primary";
};

const EncadrantDashboard = () => {
  const [activeTab, setActiveTab] = useState<"interns" | "submissions" | "progression">("interns");
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState("");
  const [rating, setRating] = useState(5);

  const totalInterns = encadrantInterns.length;
  const pendingSubs = mockWorkSubmissions.filter(s => s.status === "needs_revision").length;
  const completedReviews = mockWorkSubmissions.filter(s => s.status === "approved").length + 6;
  const avgAttendance = Math.round(encadrantInterns.reduce((s, i) => s + i.attendance, 0) / totalInterns);
  const pendingEvals = 1;

  const kpis = [
    { label: "Mes stagiaires", value: totalInterns, icon: Users, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Soumissions en attente", value: pendingSubs, icon: FileText, iconBg: "bg-warning/10", iconColor: "text-warning" },
    { label: "Revues terminées", value: completedReviews, icon: CheckCircle, iconBg: "bg-success/10", iconColor: "text-success" },
    { label: "Taux présence moy.", value: `${avgAttendance}%`, icon: Users, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Évaluations à faire", value: pendingEvals, icon: Star, iconBg: "bg-accent/10", iconColor: "text-accent" },
  ];

  const handleValidate = () => {
    toast.success(`Stage validé pour ${selectedIntern} ! Le certificat sera généré.`);
    setShowValidateModal(false);
    setSelectedIntern("");
  };

  return (
    <DashboardLayout role="encadrant">
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span className="w-1 h-7 bg-primary rounded-full" />
            Dashboard Encadrant
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Ahmed Trabelsi • Engineering & R&D • {totalInterns} stagiaires assignés</p>
        </motion.div>

        {/* KPI Cards - 5 columns matching reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              custom={i}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="bg-card rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className={`h-10 w-10 rounded-xl ${kpi.iconBg} flex items-center justify-center mb-4`}>
                <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {[
            { key: "interns" as const, label: "Mes Stagiaires" },
            { key: "submissions" as const, label: "Soumissions" },
            { key: "progression" as const, label: "Progression" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "interns" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {encadrantInterns.map((intern, i) => {
              const tag = statusTagConfig[intern.statusTag];
              return (
                <motion.div
                  key={intern.id}
                  custom={i}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-all duration-300"
                >
                  {/* Header with avatar, name, status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground ${
                        i === 0 ? "bg-primary" : i === 1 ? "bg-warning" : "bg-success"
                      }`}>
                        {intern.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{intern.name}</h3>
                        <p className="text-xs text-muted-foreground">{intern.department}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${tag.color}`}>
                      {tag.label}
                    </span>
                  </div>

                  {/* Subject */}
                  <p className="text-sm text-muted-foreground mb-4">{intern.subject}</p>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">Avancement</span>
                      <span className="font-semibold text-foreground">{intern.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${progressBarColor(intern.statusTag)}`}
                        style={{ width: `${intern.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Présence</p>
                      <p className={`text-sm font-bold ${intern.attendance >= 90 ? "text-success" : "text-warning"}`}>{intern.attendance}%</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Soumissions</p>
                      <p className="text-sm font-bold text-foreground">{intern.submissions}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Dernier actif</p>
                      <p className="text-sm font-medium text-foreground">{intern.lastActive}</p>
                    </div>
                  </div>

                  {/* Period */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 mb-4">
                    <span>Période</span>
                    <span className="font-semibold text-foreground">{intern.startDate} → {intern.endDate}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full">
                      <Eye className="h-3.5 w-3.5" /> Profil
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full text-primary border-primary/30 hover:bg-primary/5">
                      <MessageSquare className="h-3.5 w-3.5" /> Feedback
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs w-full bg-success hover:bg-success/90 text-success-foreground" onClick={() => {
                      setSelectedIntern(intern.name);
                      setShowValidateModal(true);
                    }}>
                      <ClipboardCheck className="h-3.5 w-3.5" /> Valider
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === "submissions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-foreground">Soumissions récentes</h2>
            </div>
            <div className="divide-y">
              {mockWorkSubmissions.map((sub) => (
                <div key={sub.id} className="p-5 hover:bg-secondary/10 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{sub.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{sub.date} • v{sub.version}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={sub.status} />
                      {sub.rating && <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">★ {sub.rating}/5</span>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{sub.description}</p>
                  {sub.status === "needs_revision" && (
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.success("Soumission approuvée !")}>
                        <CheckCircle className="h-3.5 w-3.5" /> Approuver
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <MessageSquare className="h-3.5 w-3.5" /> Feedback
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "progression" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {encadrantInterns.map((intern) => (
              <div key={intern.id} className="bg-card rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {intern.name[0]}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{intern.name}</h3>
                      <p className="text-xs text-muted-foreground">{intern.subject}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground">{intern.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${progressBarColor(intern.statusTag)}`} style={{ width: `${intern.progress}%` }} />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Validation Modal */}
      <Dialog open={showValidateModal} onOpenChange={setShowValidateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la validation</DialogTitle>
            <DialogDescription>
              Vous allez valider le stage de <span className="font-semibold text-foreground">{selectedIntern}</span>. Le certificat sera généré automatiquement.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-foreground mb-2">Note finale</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      fill={s <= rating ? "hsl(var(--warning))" : "hsl(var(--secondary))"}
                      stroke={s <= rating ? "hsl(var(--warning))" : "hsl(var(--border))"} strokeWidth="1" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-muted-foreground">{rating}/5</span>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowValidateModal(false)}>Annuler</Button>
            <Button onClick={handleValidate} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
              <Award className="h-4 w-4" /> Confirmer & Générer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EncadrantDashboard;
