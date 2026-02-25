import { useState } from "react";
import { CheckCircle, Upload, AlertTriangle, FileCheck, Server, ClipboardCheck, Shield } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/ui/StatusBadge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// IT departments require deployment verification
const IT_DEPARTMENTS = ["IT / Digital", "SME", "Engineering"];

interface ValidationStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  required: boolean;
}

const RHValidation = () => {
  const [selectedInternId, setSelectedInternId] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [deploymentUploaded, setDeploymentUploaded] = useState(false);
  const [deliverablesCompleted, setDeliverablesCompleted] = useState(false);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const [supervisorConfirmed, setSupervisorConfirmed] = useState(false);

  const selectedIntern = mockInterns.find(i => i.id === selectedInternId);
  const isIT = selectedIntern ? IT_DEPARTMENTS.includes(selectedIntern.department) : false;

  const getSteps = (): ValidationStep[] => {
    if (!selectedIntern) return [];

    if (isIT) {
      return [
        { id: "deploy", label: "Application Hosting / Deployment Completed", icon: <Server className="h-4 w-4" />, completed: deploymentUploaded, required: true },
        { id: "proof", label: "Deployment Proof Uploaded", icon: <Upload className="h-4 w-4" />, completed: deploymentUploaded, required: true },
        { id: "supervisor", label: "Supervisor Confirmation", icon: <ClipboardCheck className="h-4 w-4" />, completed: supervisorConfirmed, required: true },
      ];
    }
    return [
      { id: "deliverables", label: "Project Deliverables Completed", icon: <FileCheck className="h-4 w-4" />, completed: deliverablesCompleted, required: true },
      { id: "evaluation", label: "Final Evaluation Form Completed", icon: <ClipboardCheck className="h-4 w-4" />, completed: evaluationCompleted, required: true },
      { id: "supervisor", label: "Supervisor Confirmation", icon: <Shield className="h-4 w-4" />, completed: supervisorConfirmed, required: true },
    ];
  };

  const steps = getSteps();
  const allCompleted = steps.length > 0 && steps.every(s => s.completed);
  const completionRate = steps.length > 0 ? Math.round((steps.filter(s => s.completed).length / steps.length) * 100) : 0;

  const handleValidate = () => {
    toast.success(`Internship validated for ${selectedIntern?.name}! Certificate will be generated.`);
    setConfirmModal(false);
    setSelectedInternId("");
    setDeploymentUploaded(false);
    setDeliverablesCompleted(false);
    setEvaluationCompleted(false);
    setSupervisorConfirmed(false);
  };

  return (
    <DashboardLayout role="rh">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Internship Validation</h1>
        <p className="text-muted-foreground text-sm mt-1">Validate internships based on department-specific requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intern Selection */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Select Intern</h3>
          <div className="space-y-3">
            {mockInterns.map(intern => (
              <button
                key={intern.id}
                onClick={() => {
                  setSelectedInternId(intern.id);
                  setDeploymentUploaded(false);
                  setDeliverablesCompleted(false);
                  setEvaluationCompleted(false);
                  setSupervisorConfirmed(false);
                }}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedInternId === intern.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30 hover:bg-secondary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                    {intern.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{intern.name}</p>
                    <p className="text-xs text-muted-foreground">{intern.department} • {intern.type}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={intern.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground">{intern.progress}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Validation Steps */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIntern ? (
            <>
              {/* Department Info */}
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedIntern.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedIntern.department} — {selectedIntern.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isIT ? (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <Server className="h-3 w-3" /> IT Department
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <FileCheck className="h-3 w-3" /> Standard Department
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={completionRate} className="h-2 flex-1" />
                  <span className="text-sm font-semibold text-muted-foreground">{completionRate}%</span>
                </div>
              </div>

              {/* Steps Checklist */}
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">Validation Requirements</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isIT
                    ? "IT departments require deployment verification before validation."
                    : "Complete all deliverables and evaluations before validation."}
                </p>
                <div className="space-y-3">
                  {steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                        step.completed ? "bg-success/5 border-success/20" : "bg-card border-border"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.completed ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        {step.completed ? <CheckCircle className="h-4 w-4" /> : step.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${step.completed ? "text-success" : "text-foreground"}`}>{step.label}</p>
                        {step.required && !step.completed && (
                          <p className="text-xs text-muted-foreground">Required</p>
                        )}
                      </div>
                      {!step.completed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (isIT && (step.id === "deploy" || step.id === "proof")) setDeploymentUploaded(true);
                            if (step.id === "deliverables") setDeliverablesCompleted(true);
                            if (step.id === "evaluation") setEvaluationCompleted(true);
                            if (step.id === "supervisor") setSupervisorConfirmed(true);
                            toast.success(`${step.label} — Marked as completed.`);
                          }}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Validate Button */}
                <div className="mt-6">
                  <Button
                    onClick={() => setConfirmModal(true)}
                    disabled={!allCompleted}
                    className="w-full gap-2"
                    size="lg"
                  >
                    <CheckCircle className="h-4 w-4" /> Validate Internship
                  </Button>
                  {!allCompleted && (
                    <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-warning" /> All requirements must be completed before validation.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-foreground font-medium">Select an intern to begin validation</p>
              <p className="text-sm text-muted-foreground mt-1">Choose from the list on the left.</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmModal} onOpenChange={setConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Internship Validation</DialogTitle>
            <DialogDescription>
              You are about to validate the internship for <span className="font-semibold text-foreground">{selectedIntern?.name}</span> ({selectedIntern?.department}). This will generate the attestation certificate.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button onClick={handleValidate} className="gap-2">
              <CheckCircle className="h-4 w-4" /> Confirm & Generate Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RHValidation;
