import { Users } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns, mockAttendance } from "@/data/mockData";

const EncadrantInterns = () => {
  const myInterns = mockInterns.slice(0, 2);

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Interns</h1>
        <p className="text-muted-foreground text-sm mt-1">View and monitor your assigned interns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myInterns.map(intern => {
          const attendance = mockAttendance.filter(a => a.internId === intern.id);
          const present = attendance.filter(a => a.status === "present").length;
          return (
            <div key={intern.id} className="bg-card rounded-xl border shadow-sm p-6 hover-scale transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {intern.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{intern.name}</p>
                  <p className="text-xs text-muted-foreground">{intern.university} • {intern.degree}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><p className="text-xs text-muted-foreground">Subject</p><p className="font-medium text-foreground line-clamp-2">{intern.subject}</p></div>
                <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium text-foreground">{intern.department}</p></div>
                <div><p className="text-xs text-muted-foreground">Period</p><p className="font-medium text-foreground">{intern.startDate} → {intern.endDate}</p></div>
                <div><p className="text-xs text-muted-foreground">Attendance</p><p className="font-medium text-foreground">{attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0}%</p></div>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary">{intern.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${intern.progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default EncadrantInterns;
