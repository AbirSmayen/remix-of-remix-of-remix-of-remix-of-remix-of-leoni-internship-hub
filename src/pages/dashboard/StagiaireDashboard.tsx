import { GraduationCap, Calendar, User, Upload, Clock, CheckCircle, AlertCircle, Download, FileText, Award, Shield, Laptop, Cpu, Package, Wifi } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockInterns, mockProgressUpdates, mockWorkSubmissions, mockEvents, mockAttendance } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

const intern = mockInterns[1]; // Smayen Abir

const StagiaireDashboard = () => {
  const [activeTab, setActiveTab] = useState<"progress" | "submissions" | "events">("progress");

  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Welcome, {intern.name} 🎓</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your internship progress and stay connected with your supervisor.</p>
      </div>

      {/* Internship Card */}
      <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">{intern.type}</span>
            <h2 className="text-lg font-semibold text-foreground mt-3">{intern.subject}</h2>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">Matricule: {intern.matricule}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Supervisor</p>
              <p className="font-medium text-foreground">{intern.supervisor}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="font-medium text-foreground">{intern.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Period</p>
              <p className="font-medium text-foreground">{intern.startDate} → {intern.endDate}</p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold text-primary">{intern.progress}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${intern.progress}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-secondary/50 rounded-xl p-1 w-fit">
        {[
          { key: "progress" as const, label: "Progress Timeline" },
          { key: "submissions" as const, label: "My Submissions" },
          { key: "events" as const, label: "Events" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === "progress" && (
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-foreground">Progress Timeline</h2>
              </div>
              <div className="divide-y">
                {mockProgressUpdates.filter(u => u.internId === "2").map((update) => (
                  <div key={update.id} className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          update.status === "validated" || update.status === "approved" ? "bg-success/10" : "bg-warning/10"
                        }`}>
                          {update.status === "validated" || update.status === "approved" ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground text-sm">Week {update.week}: {update.title}</h3>
                          <p className="text-xs text-muted-foreground">{update.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={update.status} />
                        {update.rating && (
                          <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">★ {update.rating}/5</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 ml-11">{update.description}</p>
                    {update.feedback && (
                      <div className="bg-secondary/50 rounded-lg p-3 mt-3 ml-11">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Supervisor Feedback:</p>
                        <p className="text-sm text-foreground">{update.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "submissions" && (
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-foreground">My Work Submissions</h2>
              </div>
              <div className="divide-y">
                {mockWorkSubmissions.map((sub) => (
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
          )}

          {activeTab === "events" && (
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-foreground">Events & Activities</h2>
              </div>
              <div className="divide-y">
                {mockEvents.map((event) => (
                  <div key={event.id} className="p-6 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-primary">{event.date.split("-")[2]}</span>
                        <span className="text-[10px] text-primary/70">MAR</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground text-sm">{event.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{event.time} • {event.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success("Attendance confirmed!")}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-all shrink-0"
                    >
                      Confirm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Authorized Equipment & Access */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Authorized Equipment
            </h2>
            <div className="space-y-2.5">
              {[
                { name: "Laptop / PC", status: "approved" as const, date: "2026-02-12", Icon: Laptop },
                { name: "Arduino Mega 2560", status: "approved" as const, date: "2026-02-15", Icon: Cpu },
                { name: "Personal Laptop", status: "approved" as const, date: "2026-02-12", Icon: Package },
                { name: "Network Access", status: "approved" as const, date: "2026-02-12", Icon: Wifi },
                { name: "IoT Dev Kit", status: "pending" as const, date: "", Icon: Cpu },
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                  item.status === "approved" ? "bg-success/5 border-success/20" : "bg-warning/5 border-warning/20"
                }`}>
                  <item.Icon className={`h-4 w-4 shrink-0 ${item.status === "approved" ? "text-success" : "text-warning"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-xs truncate">{item.name}</p>
                    {item.date && <p className="text-[10px] text-muted-foreground">{item.date}</p>}
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Managed by RH. Contact your supervisor for requests.</p>
          </div>

          {/* Submit Progress */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Submit Work</h2>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Submission sent!"); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <input className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Submission title..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Week</label>
                <select className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Week 4</option>
                  <option>Week 5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea rows={3} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Describe your progress..." />
              </div>
              <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Upload files (PDF, ZIP)</p>
              </div>
              <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all">
                Submit
              </button>
            </form>
          </div>

          {/* Certificate */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Certificate
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Your attestation will be available once your internship is validated.</p>
            <button disabled className="w-full py-2.5 bg-secondary text-muted-foreground rounded-lg font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
              <Download className="h-4 w-4" /> Not Available Yet
            </button>
          </div>

          {/* Attendance */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Attendance</h2>
            <div className="space-y-2">
              {mockAttendance.filter(a => a.internId === "2").slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{a.date}</span>
                  <div className="flex items-center gap-2">
                    {a.checkIn && <span className="text-xs text-foreground">{a.checkIn} - {a.checkOut}</span>}
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

export default StagiaireDashboard;
