import { useMemo } from "react";
import { Trophy, Star, Medal } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMockInterns } from "@/contexts/MockInternsContext";
import { Progress } from "@/components/ui/progress";

const DirectorVotingPage = () => {
  const { user } = useAuth();
  const { interns, castVote } = useMockInterns();

  const directorId = user?.email ?? "director@demo.tn";

  const bestProjects = useMemo(() => interns.filter((i) => i.isBestProject === true), [interns]);
  const votedCount = useMemo(
    () => bestProjects.filter((p) => p.votes.some((v) => v.directorId === directorId)).length,
    [bestProjects, directorId]
  );
  const myTotalPoints = useMemo(
    () =>
      bestProjects.reduce((sum, p) => {
        const mine = p.votes.find((v) => v.directorId === directorId);
        return sum + (mine?.value ?? 0);
      }, 0),
    [bestProjects, directorId]
  );

  return (
    <DashboardLayout role="director">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-6 w-6 text-warning" /> Directors Voting (Demo)
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Assign a 1–5 star vote per shortlisted project. Votes are stored in shared frontend state only.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border p-5 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary text-warning">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{bestProjects.length}</p>
            <p className="text-xs text-muted-foreground">Projects in shortlist</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary text-primary">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {votedCount}/{bestProjects.length}
            </p>
            <p className="text-xs text-muted-foreground">Projects you voted on</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary text-success">
            <Medal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {myTotalPoints}
            </p>
            <p className="text-xs text-muted-foreground">Total vote points</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" /> Best Projects – Directors Voting
            </h2>
            <p className="text-sm text-muted-foreground">
              Each director can give one vote per project, from 1 to 5 stars. Scores are stored in-memory only.
            </p>
          </div>
          {user?.email && (
            <p className="text-[11px] text-muted-foreground">
              Voting as <span className="font-medium text-foreground">{user.email}</span>
            </p>
          )}
        </div>

        <div className="divide-y">
          {bestProjects.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No projects available. Supervisors must add projects to Best Projects first.
            </div>
          ) : (
          bestProjects.map((project, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            const medalColors = ["text-yellow-400", "text-slate-300", "text-amber-700"];
            const myScore = project.votes.find((v) => v.directorId === directorId)?.value ?? 0;
            const alreadyVoted = project.votes.some((v) => v.directorId === directorId);
            const initials = project.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <div
                key={project.id}
                className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 text-center">
                    {isTop3 ? (
                      <Medal className={`h-6 w-6 ${medalColors[rank - 1]}`} />
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {project.project}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.name} • {project.department} • {project.internshipType}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-stretch md:items-end gap-2 w-full md:w-72">
                  <div className="w-full">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">Supervisor final score</span>
                      <span className="font-semibold text-primary">
                        {project.score.toFixed(1)}/100
                      </span>
                    </div>
                    <Progress
                      value={Math.max(0, Math.min(100, project.score))}
                      className="h-1.5"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">Your vote:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => castVote(project.id, directorId, n as 1 | 2 | 3 | 4 | 5)}
                          disabled={alreadyVoted}
                          className="transition-transform hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              n <= myScore ? "text-warning fill-warning" : "text-muted-foreground/40"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {alreadyVoted && (
                      <span className="ml-2 text-[11px] font-semibold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                        Voted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DirectorVotingPage;

