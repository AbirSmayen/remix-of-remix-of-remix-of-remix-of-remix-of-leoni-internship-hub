import { FileText, CheckCircle, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockWorkSubmissions } from "@/data/mockData";
import { toast } from "sonner";
import { useMockInterns } from "@/contexts/MockInternsContext";

const EncadrantSubmissions = () => {
  const { interns } = useMockInterns();

  const getInternName = (internId: string) => {
    const idNum = Number(internId);
    const intern = interns.find((i) => i.id === idNum);
    return intern?.name ?? "—";
  };

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Submissions Review</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and evaluate intern work submissions.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="divide-y">
          {mockWorkSubmissions.map(sub => (
            <div key={sub.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{sub.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      By: <span className="font-medium text-foreground">{getInternName(sub.internId)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{sub.date} • Version {sub.version} • {sub.file}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={sub.status} />
                  {sub.rating && <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">★ {sub.rating}/5</span>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{sub.description}</p>
              {sub.supervisorComment && (
                <div className="bg-secondary/50 rounded-lg p-3 flex items-start gap-2 mb-3">
                  {sub.status === "approved" ? <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
                  <p className="text-sm text-foreground">{sub.supervisorComment}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => toast.success("Submission approved.")} className="px-3 py-1.5 bg-success text-success-foreground rounded-lg text-xs font-semibold hover:bg-success/90 transition-all">Approve</button>
                <button onClick={() => toast.info("Revision requested.")} className="px-3 py-1.5 bg-warning text-warning-foreground rounded-lg text-xs font-semibold hover:bg-warning/90 transition-all">Request Revision</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EncadrantSubmissions;
