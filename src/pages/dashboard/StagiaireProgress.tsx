import { CheckCircle, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockProgressUpdates } from "@/data/mockData";

const StagiaireProgress = () => {
  const updates = mockProgressUpdates.filter(u => u.internId === "2");

  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Progress Timeline</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your weekly progress and supervisor feedback.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="divide-y">
          {updates.map(u => (
            <div key={u.id} className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${u.status === "validated" || u.status === "approved" ? "bg-success/10" : "bg-warning/10"}`}>
                    {u.status === "validated" || u.status === "approved" ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-warning" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Week {u.week}: {u.title}</h3>
                    <p className="text-xs text-muted-foreground">{u.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={u.status} />
                  {u.rating && <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">★ {u.rating}/5</span>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 ml-11">{u.description}</p>
              {u.feedback && (
                <div className="bg-secondary/50 rounded-lg p-3 mt-3 ml-11">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Supervisor Feedback:</p>
                  <p className="text-sm text-foreground">{u.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StagiaireProgress;
