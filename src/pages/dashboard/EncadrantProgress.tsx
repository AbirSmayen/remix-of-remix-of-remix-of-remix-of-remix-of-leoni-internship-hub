import { BarChart3, CheckCircle, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockInterns, mockProgressUpdates } from "@/data/mockData";

const EncadrantProgress = () => {
  const myInterns = mockInterns.slice(0, 2);

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor weekly progress of your assigned interns.</p>
      </div>

      {myInterns.map(intern => {
        const updates = mockProgressUpdates.filter(u => u.internId === intern.id);
        return (
          <div key={intern.id} className="bg-card rounded-xl border shadow-sm mb-6">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                  {intern.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{intern.name}</p>
                  <p className="text-xs text-muted-foreground">{intern.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${intern.progress}%` }} />
                </div>
                <span className="text-xs font-semibold text-primary">{intern.progress}%</span>
              </div>
            </div>
            <div className="divide-y">
              {updates.map(u => (
                <div key={u.id} className="p-5 flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${u.status === "validated" || u.status === "approved" ? "bg-success/10" : "bg-warning/10"}`}>
                    {u.status === "validated" || u.status === "approved" ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-warning" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground text-sm">Week {u.week}: {u.title}</h4>
                      <StatusBadge status={u.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{u.date}</p>
                    <p className="text-sm text-muted-foreground mt-1">{u.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </DashboardLayout>
  );
};

export default EncadrantProgress;
