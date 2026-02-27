import { useState, useRef } from "react";
import { Upload, Calendar, FileText, Presentation, CheckCircle, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMyIntern } from "@/hooks/useInterns";
import { usePresentationByInternId, useUpsertPresentation } from "@/hooks/usePresentations";
import { uploadApplicationFile } from "@/hooks/usePFESubjects";
import { useUpdateIntern } from "@/hooks/useInterns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { INTERN_STATUS } from "@/hooks/useInterns";

const StagiairePresentation = () => {
  const { user } = useAuth();
  const { data: myIntern, isLoading: loadingIntern } = useMyIntern(user?.email);
  const { data: presentation, isLoading: loadingPres } = usePresentationByInternId(myIntern?.id ?? null);
  const upsertPresentation = useUpsertPresentation();
  const updateIntern = useUpdateIntern();

  const [summaryFile, setSummaryFile] = useState<File | null>(null);
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [scheduledAt, setScheduledAt] = useState(presentation?.scheduled_at?.slice(0, 16) ?? "");
  const [submitting, setSubmitting] = useState(false);
  const summaryRef = useRef<HTMLInputElement>(null);
  const presRef = useRef<HTMLInputElement>(null);

  const isLoading = loadingIntern || loadingPres;
  const isPendingPresentation = myIntern?.status === INTERN_STATUS.pending_presentation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myIntern) return;
    if (!summaryFile && !presentation?.summary_url) {
      toast.error("Please upload a project summary.");
      return;
    }
    if (!presentationFile && !presentation?.presentation_file_url) {
      toast.error("Please upload your presentation file.");
      return;
    }
    if (!scheduledAt) {
      toast.error("Please schedule your presentation session.");
      return;
    }
    setSubmitting(true);
    try {
      let summaryUrl = presentation?.summary_url ?? null;
      let presentationFileUrl = presentation?.presentation_file_url ?? null;
      if (summaryFile) {
        summaryUrl = await uploadApplicationFile(summaryFile, "presentation-summaries");
      }
      if (presentationFile) {
        presentationFileUrl = await uploadApplicationFile(presentationFile, "presentations");
      }
      await upsertPresentation.mutateAsync({
        intern_id: myIntern.id,
        summary_url: summaryUrl ?? undefined,
        presentation_file_url: presentationFileUrl ?? undefined,
        scheduled_at: new Date(scheduledAt).toISOString(),
        status: "pending",
      });
      await updateIntern.mutateAsync({
        id: myIntern.id,
        status: INTERN_STATUS.pending_presentation,
      });
      toast.success("Presentation submitted. Your status is now Pending Presentation.");
      setSummaryFile(null);
      setPresentationFile(null);
      if (summaryRef.current) summaryRef.current.value = "";
      if (presRef.current) presRef.current.value = "";
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="stagiaire">
        <Skeleton className="h-64 w-full rounded-xl" />
      </DashboardLayout>
    );
  }

  if (!myIntern) {
    return (
      <DashboardLayout role="stagiaire">
        <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
          <Presentation className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-foreground font-medium">No active internship found</p>
          <p className="text-sm text-muted-foreground mt-1">Your profile is not linked to an active intern record. Contact RH if this is an error.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Presentation className="h-6 w-6 text-primary" /> Final Presentation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload your project summary and presentation file, then schedule your presentation session.
        </p>
        {isPendingPresentation && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Status: Pending Presentation
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border shadow-sm p-6 max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Project summary (PDF)
            </label>
            <input
              ref={summaryRef}
              type="file"
              accept=".pdf"
              onChange={(e) => setSummaryFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-primary file:bg-primary/10 file:text-primary"
            />
            {presentation?.summary_url && !summaryFile && (
              <p className="text-xs text-muted-foreground mt-1">Already uploaded.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Presentation className="h-4 w-4" /> Presentation file (PDF or PPTX)
            </label>
            <input
              ref={presRef}
              type="file"
              accept=".pdf,.pptx"
              onChange={(e) => setPresentationFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-primary file:bg-primary/10 file:text-primary"
            />
            {presentation?.presentation_file_url && !presentationFile && (
              <p className="text-xs text-muted-foreground mt-1">Already uploaded.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Presentation session
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {submitting ? "Submitting…" : "Submit & set Pending Presentation"}
          </Button>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default StagiairePresentation;
