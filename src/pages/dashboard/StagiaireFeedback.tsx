import { MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockProgressUpdates } from "@/data/mockData";

const StagiaireFeedback = () => {
  const feedbacks = mockProgressUpdates.filter(u => u.internId === "2" && u.feedback);

  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Supervisor Feedback</h1>
        <p className="text-muted-foreground text-sm mt-1">All feedback received from your supervisor.</p>
      </div>

      <div className="space-y-4">
        {feedbacks.map(u => (
          <div key={u.id} className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium text-foreground text-sm">Week {u.week}: {u.title}</h3>
                <p className="text-xs text-muted-foreground">{u.date}</p>
              </div>
              {u.rating && <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium ml-auto">★ {u.rating}/5</span>}
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-foreground">{u.feedback}</p>
            </div>
          </div>
        ))}
        {feedbacks.length === 0 && (
          <div className="bg-card rounded-xl border shadow-sm p-12 text-center text-muted-foreground text-sm">No feedback received yet.</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StagiaireFeedback;
