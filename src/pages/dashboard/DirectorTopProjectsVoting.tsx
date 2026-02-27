import { useMemo } from "react";
import { Trophy, Star, Users, BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useAlumni } from "@/hooks/useInterns";
import { useVotes, useCastVote } from "@/hooks/useVotes";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const DirectorTopProjectsVoting = () => {
  const { user } = useAuth();
  const { data: alumni = [], isLoading } = useAlumni();
  const { data: votes = [] } = useVotes();
  const castVote = useCastVote();

  const year = new Date().getFullYear();

  const bestProjects = useMemo(() => {
    const currentYearAlumni = alumni.filter((a) => {
      if (!a.end_date || a.final_evaluation_score == null) return false;
      const d = new Date(a.end_date as string);
      return d.getFullYear() === year;
    });
    return [...currentYearAlumni].sort(
      (a, b) => (Number(b.final_evaluation_score ?? 0) - Number(a.final_evaluation_score ?? 0))
    );
  }, [alumni, year]);

  const myVotesByIntern: Record<string, number> = useMemo(() => {
    if (!user?.email) return {};
    const map: Record<string, number> = {};
    (votes as { intern_id: string; voter_id: string; score: number }[]).forEach((v) => {
      if (v.voter_id === user.email) {
        map[v.intern_id] = v.score;
      }
    });
    return map;
  }, [votes, user?.email]);

  const handleVote = async (internId: string, score: number) => {
    if (!user?.email) {
      toast.error("You must be authenticated as a director to vote.");
      return;
    }
    try {
      await castVote.mutateAsync({
        intern_id: internId,
        voter_id: user.email,
        score,
        is_anonymous: false,
      } as any);
      toast.success("Vote recorded.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to record vote.");
    }
  };

  return (
    <DashboardLayout role="director">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-6 w-6 text-warning" /> Top Projects Voting
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review the best projects of the year and assign a 1–5 score to each. Your votes drive the automatic TOP 10.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : bestProjects.length === 0 ? (
        <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
          <p className="text-foreground font-medium">No completed internships for the current year.</p>
          <p className="text-sm text-muted-foreground mt-1">Once projects are archived with a final score, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border p-5 shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary text-warning">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{bestProjects.length}</p>
                <p className="text-xs text-muted-foreground">Best projects in shortlist</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-5 shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Array.from(new Set((votes as { voter_id: string }[]).map((v) => v.voter_id))).length}
                </p>
                <p className="text-xs text-muted-foreground">Directors participated</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-5 shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary text-success">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{(votes as { id: string }[]).length}</p>
                <p className="text-xs text-muted-foreground">Total votes cast</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning" /> Best Projects of {year}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Final supervisor scores are fixed. You can only submit your voting score (1–5) per project.
                </p>
              </div>
            </div>
            <div className="divide-y">
              {bestProjects.map((intern, idx) => {
                const rank = idx + 1;
                const score = Number(intern.final_evaluation_score ?? 0);
                const myScore = myVotesByIntern[intern.id] ?? 0;
                const initials = intern.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2);
                const pct = Math.max(0, Math.min(100, score));
                return (
                  <div key={intern.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 text-center">
                        <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{intern.project_title ?? "—"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {intern.full_name} • {intern.department} • {intern.internship_type}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Supervisor: {intern.supervisor ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch md:items-end gap-2 w-full md:w-64">
                      <div className="w-full">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-muted-foreground">Final score</span>
                          <span className="font-semibold text-foreground">{score.toFixed(1)}/100</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">Your vote:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => handleVote(intern.id, n)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  n <= myScore ? "text-warning fill-warning" : "text-muted-foreground/40"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DirectorTopProjectsVoting;

