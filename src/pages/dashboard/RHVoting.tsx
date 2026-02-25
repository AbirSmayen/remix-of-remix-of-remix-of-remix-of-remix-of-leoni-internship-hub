import { useState, useMemo } from "react";
import { Trophy, Star, Vote, Download, Shield, Eye, EyeOff, Users, BarChart3, Medal } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoteRecord {
  internId: string;
  score: number;
  voterId: string;
  anonymous: boolean;
  timestamp: string;
}

const RHVoting = () => {
  const [votes, setVotes] = useState<VoteRecord[]>([
    { internId: "1", score: 4, voterId: "v1", anonymous: true, timestamp: "2026-06-01T10:00:00" },
    { internId: "1", score: 5, voterId: "v2", anonymous: false, timestamp: "2026-06-01T11:00:00" },
    { internId: "2", score: 5, voterId: "v1", anonymous: true, timestamp: "2026-06-01T10:05:00" },
    { internId: "2", score: 4, voterId: "v3", anonymous: true, timestamp: "2026-06-01T12:00:00" },
    { internId: "2", score: 5, voterId: "v4", anonymous: false, timestamp: "2026-06-01T12:30:00" },
    { internId: "3", score: 3, voterId: "v1", anonymous: false, timestamp: "2026-06-01T10:10:00" },
    { internId: "4", score: 4, voterId: "v2", anonymous: true, timestamp: "2026-06-01T11:05:00" },
    { internId: "4", score: 5, voterId: "v5", anonymous: false, timestamp: "2026-06-01T13:00:00" },
  ]);
  const [votingOpen, setVotingOpen] = useState(true);
  const [anonymousMode, setAnonymousMode] = useState(true);

  const leaderboard = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};
    votes.forEach(v => {
      if (!grouped[v.internId]) grouped[v.internId] = { total: 0, count: 0 };
      grouped[v.internId].total += v.score;
      grouped[v.internId].count += 1;
    });

    return mockInterns
      .map(intern => {
        const data = grouped[intern.id] || { total: 0, count: 0 };
        const avg = data.count > 0 ? data.total / data.count : 0;
        return {
          ...intern,
          avgScore: +avg.toFixed(2),
          voteCount: data.count,
          totalPoints: data.total,
        };
      })
      .sort((a, b) => b.avgScore - a.avgScore || b.voteCount - a.voteCount);
  }, [votes]);

  const maxScore = Math.max(...leaderboard.map(l => l.avgScore), 1);

  const handleExport = () => {
    toast.success("TOP 10 recruitment shortlist exported.");
  };

  const handleMarkTop10 = (internId: string) => {
    toast.success(`Intern marked as TOP 10 — Recruitment Eligible.`);
  };

  return (
    <DashboardLayout role="rh">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-warning" /> Intern Voting & TOP 10
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Internal voting system — rank interns and generate recruitment shortlists.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => { setVotingOpen(!votingOpen); toast.success(votingOpen ? "Voting closed." : "Voting opened."); }}
            className="gap-2"
          >
            {votingOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {votingOpen ? "Close Voting" : "Open Voting"}
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Votes", value: votes.length, icon: <Vote className="h-5 w-5" />, color: "text-primary" },
          { label: "Voters", value: new Set(votes.map(v => v.voterId)).size, icon: <Users className="h-5 w-5" />, color: "text-success" },
          { label: "Candidates", value: leaderboard.length, icon: <Star className="h-5 w-5" />, color: "text-warning" },
          { label: "Voting Status", value: votingOpen ? "Open" : "Closed", icon: <Shield className="h-5 w-5" />, color: votingOpen ? "text-success" : "text-destructive" },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-lg bg-secondary ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Real-Time Leaderboard
                </h2>
                <p className="text-sm text-muted-foreground">Rankings update automatically.</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Anonymous</label>
                <button
                  onClick={() => setAnonymousMode(!anonymousMode)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${anonymousMode ? "bg-primary" : "bg-secondary"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${anonymousMode ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>

            <div className="divide-y">
              {leaderboard.map((intern, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                const medalColors = ["text-warning", "text-muted-foreground", "text-[#cd7f32]"];
                return (
                  <div key={intern.id} className={`p-5 flex items-center gap-4 transition-colors hover:bg-secondary/20 ${isTop3 ? "bg-warning/5" : ""}`}>
                    <div className="flex items-center justify-center w-10 shrink-0">
                      {isTop3 ? (
                        <Medal className={`h-6 w-6 ${medalColors[idx]}`} />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
                      )}
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                      {intern.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{intern.name}</p>
                      <p className="text-xs text-muted-foreground">{intern.department} • {intern.type}</p>
                    </div>
                    <div className="text-right shrink-0 w-32">
                      <p className="text-lg font-bold text-primary">{intern.avgScore}<span className="text-xs text-muted-foreground">/5</span></p>
                      <p className="text-[10px] text-muted-foreground">{intern.voteCount} votes</p>
                      <Progress value={(intern.avgScore / 5) * 100} className="h-1.5 mt-1" />
                    </div>
                    <Button
                      size="sm"
                      variant={isTop3 ? "default" : "outline"}
                      onClick={() => handleMarkTop10(intern.id)}
                      className="gap-1 text-xs shrink-0"
                    >
                      <Trophy className="h-3 w-3" /> {isTop3 ? "TOP 10" : "Select"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Voting Controls & Info */}
        <div className="space-y-6">
          {/* Scoring Logic */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Scoring Logic
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Each voter scores 1-5 per intern</p>
              <p>• Average score determines ranking</p>
              <p>• Tie-breaker: vote count</p>
              <p>• Anonymous voting: {anonymousMode ? "Enabled" : "Disabled"}</p>
              <p>• Only authenticated users can vote</p>
              <p>• One vote per voter per intern</p>
            </div>
          </div>

          {/* TOP 10 Actions */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" /> After TOP 10 Selection
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => toast.success("Interns marked as recruitment eligible.")}
                className="w-full py-2 bg-warning/10 text-warning rounded-lg text-xs font-semibold hover:bg-warning/20 transition-all"
              >
                Mark as "Recruitment Eligible"
              </button>
              <button
                onClick={handleExport}
                className="w-full py-2 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-all"
              >
                Generate Recruitment Shortlist
              </button>
              <button
                onClick={() => toast.success("Report exported for HR.")}
                className="w-full py-2 bg-success/10 text-success rounded-lg text-xs font-semibold hover:bg-success/20 transition-all"
              >
                Export Report for HR
              </button>
            </div>
          </div>

          {/* Recent votes */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Votes</h3>
            <div className="space-y-2">
              {votes.slice(-5).reverse().map((v, i) => {
                const intern = mockInterns.find(x => x.id === v.internId);
                return (
                  <div key={i} className="flex items-center justify-between text-xs border-b last:border-0 pb-2 last:pb-0">
                    <div>
                      <p className="text-foreground font-medium">{intern?.name || "Unknown"}</p>
                      <p className="text-muted-foreground">{v.anonymous ? "Anonymous" : `Voter ${v.voterId}`}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} className={`h-3 w-3 ${n <= v.score ? "text-warning fill-warning" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RHVoting;
