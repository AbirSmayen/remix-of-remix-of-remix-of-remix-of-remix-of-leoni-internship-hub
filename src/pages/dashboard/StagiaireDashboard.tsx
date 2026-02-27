import { BarChart3, CheckCircle, Clock, FileText, Trophy, Calendar } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockProgressUpdates, mockWorkSubmissions, mockEvents } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useMockInterns } from "@/contexts/MockInternsContext";
import { Progress } from "@/components/ui/progress";

const StagiaireDashboard = () => {
  const { user } = useAuth();
  const { interns } = useMockInterns();

  const intern = interns.find((i) => (user?.email ? i.email === user.email : false)) ?? interns[0] ?? null;
  const recruitmentEligible = !!intern?.recruitmentEligible;

  const submissionsCount = intern
    ? mockWorkSubmissions.filter((s) => s.internId === String(intern.id)).length
    : 0;

  const progressUpdates = intern
    ? mockProgressUpdates.filter((u) => u.internId === String(intern.id))
    : [];

  const overallProgressPct = Math.max(
    0,
    Math.min(100, Math.round((progressUpdates.length / 5) * 100))
  );

  const finalScore = intern?.score;

  const statusLabel = "In Progress";
  const statusTone = "bg-primary/10 text-primary border-primary/30";

  return (
    <DashboardLayout role="stagiaire">
      {!intern ? (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">No active internship found for your account.</p>
        </div>
      ) : (
        <>
          {/* SECTION 1 – Welcome Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {intern.name}</h1>
              <p className="text-muted-foreground text-sm mt-1">Here’s a quick summary of your internship activity.</p>
            </div>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusTone}`}>
              <Clock className="h-4 w-4" /> {statusLabel}
            </span>
          </div>

          {recruitmentEligible && (
            <div className="mb-8 rounded-xl border border-success/30 bg-success/10 px-4 py-3 flex items-start gap-3">
              <div className="mt-0.5">
                <Trophy className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-success">
                  Congratulations! Your project is among the TOP 10 and you are pre-recruited.
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  HR will contact you with next steps for your recruitment process.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2 – Key Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-xl border shadow-sm p-5">
              <div className="p-2 rounded-lg bg-secondary inline-flex text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">Overall Progress</p>
              <p className="text-2xl font-bold text-foreground mt-1">{overallProgressPct}%</p>
              <Progress value={overallProgressPct} className="h-1.5 mt-3" />
            </div>
            <div className="bg-card rounded-xl border shadow-sm p-5">
              <div className="p-2 rounded-lg bg-secondary inline-flex text-warning">
                <Trophy className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">Final Evaluation Score</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {finalScore == null ? "—" : `${Number(finalScore).toFixed(0)}`}
                <span className="text-xs text-muted-foreground"> / 100</span>
              </p>
              <Progress value={finalScore == null ? 0 : Math.max(0, Math.min(100, Number(finalScore)))} className="h-1.5 mt-3" />
            </div>
            <div className="bg-card rounded-xl border shadow-sm p-5">
              <div className="p-2 rounded-lg bg-secondary inline-flex text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">Total Submissions</p>
              <p className="text-2xl font-bold text-foreground mt-1">{submissionsCount}</p>
              <p className="text-xs text-muted-foreground mt-2">Validated work you submitted during your internship.</p>
            </div>
          </div>

          {/* SECTION 3 – Progress Visualization */}
          <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Progress</h2>
              <span className="text-xs text-muted-foreground">{progressUpdates.length} updates</span>
            </div>
            <div className="space-y-3">
              {progressUpdates.slice(0, 4).map((u) => (
                <div key={u.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/30 border">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">Week {u.week}: {u.title}</p>
                    <p className="text-xs text-muted-foreground">{u.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border">
                      {u.status}
                    </span>
                    {(u.rating != null) && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/30 font-semibold">
                        ★ {u.rating}/5
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {progressUpdates.length === 0 && (
                <p className="text-sm text-muted-foreground">No progress updates yet.</p>
              )}
            </div>
          </div>

          {/* SECTION 4 – Upcoming Events */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="rounded-xl border p-4 hover:bg-secondary/20 transition-colors">
                  <p className="text-sm font-semibold text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.date} • {event.time}</p>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </div>
              ))}
              {mockEvents.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default StagiaireDashboard;
