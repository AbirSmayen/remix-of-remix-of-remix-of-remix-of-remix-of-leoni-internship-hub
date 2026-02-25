import { FileText, Upload } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockWorkSubmissions } from "@/data/mockData";
import { toast } from "sonner";

const StagiaireSubmissions = () => {
  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Submissions</h1>
        <p className="text-muted-foreground text-sm mt-1">View your work submissions and supervisor feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm">
          <div className="divide-y">
            {mockWorkSubmissions.map(sub => (
              <div key={sub.id} className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{sub.title}</h3>
                      <p className="text-xs text-muted-foreground">{sub.date} • v{sub.version} • {sub.file}</p>
                    </div>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
                <p className="text-sm text-muted-foreground ml-8">{sub.description}</p>
                {sub.supervisorComment && (
                  <div className="bg-secondary/50 rounded-lg p-3 mt-3 ml-8">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Supervisor:</p>
                    <p className="text-sm text-foreground">{sub.supervisorComment}</p>
                  </div>
                )}
                {sub.previousVersions && (
                  <div className="ml-8 mt-2">
                    <p className="text-xs text-muted-foreground/60">Previous versions:</p>
                    {sub.previousVersions.map((v: any) => (
                      <p key={v.version} className="text-xs text-muted-foreground ml-2">v{v.version} - {v.date}: {v.comment}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6 h-fit">
          <h2 className="text-lg font-semibold text-foreground mb-4">Submit Work</h2>
          <form onSubmit={e => { e.preventDefault(); toast.success("Submission sent!"); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
              <input className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Submission title..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea rows={3} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Describe your work..." />
            </div>
            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Upload files (PDF, ZIP)</p>
            </div>
            <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all">Submit</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StagiaireSubmissions;
