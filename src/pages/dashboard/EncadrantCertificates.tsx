import { Award, CheckCircle, Clock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

const EncadrantCertificates = () => {
  const [interns, setInterns] = useState(mockInterns.slice(0, 2).map(i => ({ ...i })));

  const handleValidate = (id: string) => {
    setInterns(prev => prev.map(i => i.id === id ? { ...i, validated: true, progress: 100 } : i));
    const intern = interns.find(i => i.id === id);
    toast.success(`Internship validated for ${intern?.name}! Certificate has been generated automatically.`);
  };

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Certificates & Validation</h1>
        <p className="text-muted-foreground text-sm mt-1">Validate internships to automatically generate attestations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interns.map(intern => (
          <div key={intern.id} className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {intern.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-foreground">{intern.name}</p>
                <p className="text-xs text-muted-foreground">{intern.type} • {intern.department}</p>
              </div>
              {intern.validated && (
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold bg-success/10 text-success px-2.5 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3" /> Validated
                </span>
              )}
            </div>
            <div className="text-sm space-y-2 mb-4 bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between"><span className="text-muted-foreground">University</span><span className="font-medium text-foreground">{intern.university}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Period</span><span className="font-medium text-foreground">{intern.startDate} → {intern.endDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{intern.validated ? 100 : intern.progress}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Degree</span><span className="font-medium text-foreground">{intern.degree}</span></div>
            </div>
            {intern.validated ? (
              <div className="w-full py-2.5 bg-success/10 text-success rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" /> Certificate Generated — Intern can now download it
              </div>
            ) : intern.progress >= 30 ? (
              <button onClick={() => handleValidate(intern.id)} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                <Award className="h-4 w-4" /> Validate Internship
              </button>
            ) : (
              <button disabled className="w-full py-2.5 bg-secondary text-muted-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                <Clock className="h-4 w-4" /> Internship in progress ({intern.progress}%)
              </button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default EncadrantCertificates;
