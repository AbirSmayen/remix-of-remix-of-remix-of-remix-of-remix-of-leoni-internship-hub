import { Users, Search, Eye } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockInterns, mockAttendance } from "@/data/mockData";
import { useState } from "react";

const RHInterns = () => {
  const [search, setSearch] = useState("");

  const filtered = mockInterns.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="rh">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Active Interns</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage all active interns.</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search interns..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(intern => {
          const attendance = mockAttendance.filter(a => a.internId === intern.id);
          const presentDays = attendance.filter(a => a.status === "present").length;
          const totalDays = attendance.length;
          return (
            <div key={intern.id} className="bg-card rounded-xl border shadow-sm p-6 hover-scale transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {intern.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{intern.name}</p>
                    <p className="text-xs text-muted-foreground">{intern.email}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">{intern.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium text-foreground">{intern.department}</p></div>
                <div><p className="text-xs text-muted-foreground">University</p><p className="font-medium text-foreground">{intern.university}</p></div>
                <div><p className="text-xs text-muted-foreground">Supervisor</p><p className="font-medium text-foreground">{intern.supervisor}</p></div>
                <div><p className="text-xs text-muted-foreground">Degree</p><p className="font-medium text-foreground">{intern.degree}</p></div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-semibold text-primary">{intern.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden mb-3">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${intern.progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{intern.startDate} → {intern.endDate}</span>
                <span>Attendance: {totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default RHInterns;
