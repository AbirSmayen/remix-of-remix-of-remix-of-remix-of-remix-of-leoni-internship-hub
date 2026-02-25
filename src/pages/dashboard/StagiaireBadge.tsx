import { Download, Clock, LogIn, LogOut } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LeoniBadge from "@/components/badge/LeoniBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockInterns, mockAttendance } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

const intern = mockInterns[1];

const StagiaireBadge = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const attendance = mockAttendance.filter(a => a.internId === "2");

  const handleCheckIn = () => {
    setCheckedIn(true);
    toast.success("Checked in at " + new Date().toLocaleTimeString());
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    toast.success("Checked out at " + new Date().toLocaleTimeString());
  };

  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Badge & Attendance</h1>
        <p className="text-muted-foreground text-sm mt-1">Your intern badge and attendance tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badge Card */}
        <div className="flex flex-col items-center">
          <LeoniBadge
            matricule={intern.matricule}
            name={intern.name}
            department={intern.department}
            supervisor={intern.supervisor}
            startDate={intern.startDate}
            endDate={intern.endDate}
          />

          <button className="w-full max-w-[480px] mt-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
            <Download className="h-4 w-4" /> Export Badge as PDF
          </button>
        </div>

        {/* Attendance */}
        <div className="space-y-6">
          {/* Check-in / Check-out */}
          <div className="bg-card rounded-xl border shadow-sm p-6 text-center">
            <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-4">Attendance Check</h3>
            <div className="flex gap-3 justify-center">
              <button onClick={handleCheckIn} disabled={checkedIn} className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${checkedIn ? "bg-secondary text-muted-foreground cursor-not-allowed" : "bg-success text-success-foreground hover:bg-success/90"}`}>
                <LogIn className="h-4 w-4" /> Check In
              </button>
              <button onClick={handleCheckOut} disabled={!checkedIn} className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${!checkedIn ? "bg-secondary text-muted-foreground cursor-not-allowed" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}`}>
                <LogOut className="h-4 w-4" /> Check Out
              </button>
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Attendance</h3>
            <div className="space-y-3">
              {attendance.map(a => (
                <div key={a.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
                  <span className="text-muted-foreground">{a.date}</span>
                  <div className="flex items-center gap-3">
                    {a.checkIn && <span className="text-xs text-foreground">{a.checkIn} - {a.checkOut || "—"}</span>}
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StagiaireBadge;
