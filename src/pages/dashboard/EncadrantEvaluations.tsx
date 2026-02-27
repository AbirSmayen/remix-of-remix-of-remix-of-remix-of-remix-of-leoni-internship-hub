import { useMemo, useState } from "react";
import { Award, Lock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMockInterns } from "@/contexts/MockInternsContext";
import { Progress } from "@/components/ui/progress";

const CRITERIA = [
  { id: "technical" as const, label: "Technical", description: "Technical skills and problem-solving" },
  { id: "softSkills" as const, label: "Soft Skills", description: "Communication and teamwork" },
  { id: "innovation" as const, label: "Innovation", description: "Creativity and ideas" },
  { id: "autonomy" as const, label: "Autonomy", description: "Independence and ownership" },
  { id: "performance" as const, label: "Performance", description: "Overall performance" },
];

type EvalKey = (typeof CRITERIA)[number]["id"];

const EncadrantEvaluations = () => {
  const { user } = useAuth();
  const { interns, setInterns } = useMockInterns();

  const loggedSupervisor = {
    name: "Supervisor 1",
    department: "Engineering",
  };
  const myInterns = interns.filter(
    (intern) =>
      intern.supervisor === loggedSupervisor.name &&
      intern.department === loggedSupervisor.department
  );

  const [selectedInternId, setSelectedInternId] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<Record<EvalKey, number>>({
    technical: 0,
    softSkills: 0,
    innovation: 0,
    autonomy: 0,
    performance: 0,
  });
  const [comments, setComments] = useState<string>("");
  const totalScore = useMemo(
    () => Object.values(evaluation).reduce((sum, val) => sum + val, 0),
    [evaluation]
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedIntern = selectedInternId
    ? myInterns.find((i) => i.id === selectedInternId) ?? null
    : null;
  const isLocked = !!selectedIntern?.locked;

  const openEvaluation = (id: number) => {
    const intern = myInterns.find((i) => i.id === id);
    setSelectedInternId(id);
    setComments("");
    const preset = intern?.score != null ? Math.round(intern.score / 5) : 0;
    setEvaluation({
      technical: preset,
      softSkills: preset,
      innovation: preset,
      autonomy: preset,
      performance: preset,
    });
    setDialogOpen(true);
  };

  const handleLock = (internId: number) => {
    setInterns((prev) =>
      prev.map((intern) =>
        intern.id === internId ? { ...intern, score: totalScore, locked: true } : intern
      )
    );
  };

  const handleValidateAndLock = () => {
    if (!selectedIntern) return;
    if (totalScore < 0 || totalScore > 100) return;
    handleLock(selectedIntern.id);
    setDialogOpen(false);
  };

  const handleAddToBest = (id: number) => {
    setInterns((prev) =>
      prev.map((intern) =>
        intern.id === id ? { ...intern, isBestProject: true } : intern
      )
    );
  };

  return (
    <DashboardLayout role={user?.role === "director" ? "director" : "encadrant"}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Supervisor Evaluation</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Evaluate your assigned interns. Once locked, the score can’t be edited.
        </p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">My interns</h2>
          <p className="text-[11px] text-muted-foreground">
            5 criteria (0–20 each). Total score auto-calculates (0–100).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/40">
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Intern Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Project</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Internship Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Score</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {myInterns.map((intern) => {
                const notEvaluated = intern.score == null;
                return (
                  <tr
                    key={intern.id}
                    className={`border-b last:border-0 hover:bg-secondary/20 transition-colors ${
                      intern.locked ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{intern.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <p className="text-xs text-foreground line-clamp-2">{intern.project}</p>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs text-muted-foreground">{intern.department}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {intern.internshipType}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {intern.score != null ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-primary">
                            {intern.score.toFixed(1)}/100
                          </span>
                          <Progress
                            value={intern.score}
                            className="h-1.5"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not Evaluated</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-2">
                        {notEvaluated ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-secondary text-muted-foreground">
                            Not Evaluated
                          </span>
                        ) : intern.locked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-success/10 text-success border border-success/30">
                            <Lock className="h-3 w-3" /> Evaluation Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-secondary text-muted-foreground">
                            In progress
                          </span>
                        )}

                        {intern.isBestProject && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/30">
                            Added to Best Projects
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-2 items-start">
                        <button
                          type="button"
                          onClick={() => openEvaluation(intern.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
                        >
                          {intern.locked ? "View" : "Evaluate"}
                        </button>

                        {intern.locked && (
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={intern.isBestProject}
                            onClick={() => handleAddToBest(intern.id)}
                            type="button"
                          >
                            Add to Best Projects
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {dialogOpen && selectedIntern && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4"
          onClick={() => setDialogOpen(false)}
        >
          <div
            className="bg-white w-full max-w-[600px] max-h-[85vh] overflow-y-auto rounded-xl shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Evaluation</p>
                <h2 className="text-lg font-semibold text-foreground truncate">
                  {selectedIntern.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {selectedIntern.project} • {selectedIntern.department} • {selectedIntern.internshipType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="h-9 w-9 rounded-lg border bg-white text-foreground hover:bg-slate-50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Total Score</span>
                <span className="font-bold text-primary">{totalScore}/100</span>
              </div>
              <Progress value={Math.max(0, Math.min(100, totalScore))} className="h-2" />
            </div>

            <div className="space-y-3">
              {CRITERIA.map((criteria) => (
                <div key={criteria.id} className="rounded-lg border bg-slate-50 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{criteria.label}</p>
                      <p className="text-xs text-muted-foreground">{criteria.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{evaluation[criteria.id]}/20</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    disabled={isLocked}
                    value={evaluation[criteria.id]}
                    onChange={(e) =>
                      setEvaluation((prev) => ({
                        ...prev,
                        [criteria.id]: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Comment
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Write a short comment..."
                disabled={isLocked}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={handleValidateAndLock}
                disabled={isLocked}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Award className="h-4 w-4" /> Validate &amp; Lock
              </button>
              {isLocked && (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-success/10 text-success border border-success/30">
                  <Lock className="h-3.5 w-3.5" /> Locked
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EncadrantEvaluations;
