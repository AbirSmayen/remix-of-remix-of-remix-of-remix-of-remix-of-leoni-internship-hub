import { Download } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LeoniBadge from "@/components/badge/LeoniBadge";
import { mockInterns } from "@/data/mockData";

const intern = mockInterns[1]; // Smayen Abir

const BadgePreview = () => {
  return (
    <DashboardLayout role="rh">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Intern Badge Preview</h1>
        <p className="text-muted-foreground text-sm mt-1">Preview and download the intern identification badge.</p>
      </div>

      <div className="flex justify-center">
        <div className="w-[480px]">
          <LeoniBadge
            matricule={intern.matricule}
            name={intern.name}
            department={intern.department}
            supervisor={intern.supervisor}
            startDate={intern.startDate}
            endDate={intern.endDate}
          />

          <button className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
            <Download className="h-4 w-4" /> Export Badge as PDF
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BadgePreview;
