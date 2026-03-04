import { Users, ClipboardCheck, Star } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockAttendance } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { InternMock } from "@/types/internship";

const EncadrantInterns = () => {
  const { user } = useAuth();
  const { getInternsBySupervisor, updateIntern } = useMockInternshipStore();
  const supervisorName = user?.name || "Mohamed Amine Ben Nasr";
  const department = user?.department || "IT / Digital";
  const myInterns = getInternsBySupervisor(supervisorName, department);

  const [evalModal, setEvalModal] = useState<InternMock | null>(null);
  const [score, setScore] = useState(10);
  const [comment, setComment] = useState("");

  const handleSaveEvaluation = () => {
    if (!evalModal) return;
    updateIntern(evalModal.id, {
      evaluationScore: score,
      evaluationComment: comment || undefined,
    });
    toast.success("Evaluation saved for " + evalModal.name);
    setEvalModal(null);
  };

  const handleAddToBestProjects = (intern: InternMock) => {
    updateIntern(intern.id, { recommendedBySupervisor: true });
    toast.success(intern.name + " added to Best Projects.");
  };

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" /> My Interns
        </h1>
        <p className="text-muted-foreground text-sm mt-1">View, evaluate, and recommend your assigned interns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myInterns.map((intern) => {
          const attendance = mockAttendance.filter(a => a.internId === intern.id);
          const present = attendance.filter(a => a.status === "present").length;
          const attendancePct = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;

          return (
            <div key={intern.id} className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {intern.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{intern.name}</p>
                  <p className="text-xs text-muted-foreground">{intern.university} • {intern.degree}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><p className="text-xs text-muted-foreground">Subject</p><p className="font-medium text-foreground line-clamp-2">{intern.subject}</p></div>
                <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium text-foreground">{intern.department}</p></div>
                <div><p className="text-xs text-muted-foreground">Period</p><p className="font-medium text-foreground">{intern.startDate} → {intern.endDate}</p></div>
                <div><p className="text-xs text-muted-foreground">Attendance</p><p className="font-medium text-foreground">{attendancePct}%</p></div>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary">{intern.progress ?? 0}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${intern.progress ?? 0}%` }} />
              </div>

              {intern.evaluationScore != null && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Evaluation: <span className="font-semibold text-foreground">{intern.evaluationScore}/20</span>
                  {intern.evaluationComment && <p className="mt-0.5 line-clamp-2">&quot;{intern.evaluationComment}&quot;</p>}
                </div>
              )}

              <div className="flex items-center justify-between mt-5 flex-wrap gap-2">
                <div className="text-xs text-muted-foreground">
                  Status:{" "}
                  <span className={intern.internshipStatus === "internship_validated" ? "font-semibold text-leoni-purple" : "font-semibold text-muted-foreground"}>
                    {intern.internshipStatus === "internship_validated" ? "Internship Validated" : "In progress"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {intern.internshipStatus !== "internship_validated" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-leoni-purple/10 text-leoni-purple border-leoni-purple/30 hover:bg-leoni-purple/20"
                      onClick={() => {
                        updateIntern(intern.id, { internshipStatus: "internship_validated" });
                        toast.success("Internship validated for " + intern.name);
                      }}
                    >
                      Validate completion
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      setEvalModal(intern);
                      setScore(intern.evaluationScore ?? 10);
                      setComment(intern.evaluationComment ?? "");
                    }}
                  >
                    <ClipboardCheck className="h-3.5 w-3.5" /> Evaluate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!intern.recommendedBySupervisor}
                    className="gap-1.5 text-xs text-leoni-purple border-leoni-purple/40 hover:bg-leoni-purple/10 disabled:opacity-50"
                    onClick={() => handleAddToBestProjects(intern)}
                  >
                    <Star className="h-3.5 w-3.5" /> {intern.recommendedBySupervisor ? "In Best Projects" : "Add to Best Projects"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {myInterns.length === 0 && (
        <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-foreground font-medium">No interns assigned</p>
          <p className="text-sm text-muted-foreground mt-1">Interns assigned to you will appear here.</p>
        </div>
      )}

      <Dialog open={!!evalModal} onOpenChange={(v) => !v && setEvalModal(null)}>
        <DialogContent className="max-w-md rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle>Évaluer — {evalModal?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Score (0–20)</label>
              <input
                type="number"
                min={0}
                max={20}
                value={score}
                onChange={(e) => setScore(Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Optional comment..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEvalModal(null)} className="text-sm">Cancel</Button>
              <Button onClick={handleSaveEvaluation} className="text-sm">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EncadrantInterns;
