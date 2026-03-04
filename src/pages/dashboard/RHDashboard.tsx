import { ClipboardList, Users, UserCheck, BookOpen, Clock, Calendar, Link2, FileText } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockEvents, departments } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { Link } from "react-router-dom";
import { BarCard, DonutCard, MiniLineCard } from "@/components/dashboard/DashboardCharts";

const RHDashboard = () => {
  const [publicLinkCopied, setPublicLinkCopied] = useState(false);
  const [shortLinkCopied, setShortLinkCopied] = useState(false);
  const { t } = useTranslation();
  const { subjects, applications } = useMockInternshipStore();

  const pfeBookUrl = `${window.location.origin}/pfe-book`;
  const shortTermBaseUrl = `${window.location.origin}/apply/non-pfe`;

  const handleGenerateLink = () => {
    navigator.clipboard.writeText(pfeBookUrl);
    setPublicLinkCopied(true);
    toast.success(t("rhDashboard.linkCopied"));
    setTimeout(() => setPublicLinkCopied(false), 3000);
  };

  const handleGenerateShortTermLink = () => {
    const token = Math.random().toString(36).slice(2, 10);
    const url = `${shortTermBaseUrl}?ref=${token}`;
    navigator.clipboard.writeText(url);
    setShortLinkCopied(true);
    toast.success("Short-term internship application link copied.");
    setTimeout(() => setShortLinkCopied(false), 3000);
  };

  const stats = {
    totalApplications: applications.length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    pending: applications.filter((a) => a.status === "pending" || a.status === "pending_technical_interview").length,
    totalSubjects: subjects.length,
    departments: new Set(subjects.map((s) => s.department)).size,
  };

  const pfeApps = applications;
  const nonPfeApps = applications.filter((a) => a.status !== "pending" && a.status !== "pending_technical_interview");

  const growthData = [
    { name: "Oct", value: Math.max(0, pfeApps.length - 8) },
    { name: "Nov", value: Math.max(0, pfeApps.length - 6) },
    { name: "Dec", value: Math.max(0, pfeApps.length - 4) },
    { name: "Jan", value: Math.max(0, pfeApps.length - 2) },
    { name: "Feb", value: pfeApps.length },
  ];

  const typeDist = [
    { name: "PFE", value: pfeApps.length, color: "hsl(var(--primary))" },
    { name: "Short-term", value: nonPfeApps.length, color: "hsl(var(--leoni-purple))" },
  ];

  const deptCounts = subjects.reduce((acc: Record<string, number>, s) => {
    acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {});
  const deptData = Object.entries(deptCounts)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  return (
    <DashboardLayout role="rh">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("rhDashboard.welcome")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("rhDashboard.overview")}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/pfe-book" target="_blank" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
            <FileText className="h-4 w-4" /> View PFE Book
          </Link>
          <button onClick={handleGenerateLink} className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all">
            <Link2 className="h-4 w-4" />
            {publicLinkCopied ? t("rhDashboard.linkCopied") : t("rhDashboard.generateLink")}
          </button>
          <button
            onClick={handleGenerateShortTermLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
          >
            <Link2 className="h-4 w-4" />
            {shortLinkCopied ? "Short-term link copied" : "Generate Short-Term Internship Link"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title={t("rhDashboard.totalApplications")} value={stats.totalApplications} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard title={t("rhDashboard.accepted")} value={stats.accepted} icon={<UserCheck className="h-5 w-5" />} color="text-success" />
        <StatCard title={t("rhDashboard.pendingReview")} value={stats.pending} icon={<Clock className="h-5 w-5" />} color="text-warning" />
        <StatCard title={t("rhDashboard.publishedSubjects")} value={stats.totalSubjects} icon={<BookOpen className="h-5 w-5" />} color="text-primary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <MiniLineCard
          title="PFE application growth"
          subtitle="Last 5 months (illustrative)"
          data={growthData}
          dataKey="value"
        />
        <DonutCard title="Applications distribution" subtitle="PFE vs short-term" data={typeDist} />
        <BarCard
          title="Department distribution"
          subtitle="Subjects by department"
          data={deptData.length ? deptData : [{ name: "—", value: 0 }]}
          dataKey="value"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 table-card">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t("rhDashboard.recentApplications")}</h2>
              <p className="text-sm text-muted-foreground">{t("rhDashboard.recentApplicationsDesc")}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/30 table-header-sticky">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.candidate")}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.university")}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.status")}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.date")}</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="border-b last:border-0 table-row-hover">
                    <td className="px-6 py-4"><p className="text-sm font-medium text-foreground">{app.fullName}</p><p className="text-xs text-muted-foreground">{app.email}</p></td>
                    <td className="px-6 py-4"><span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">PFE</span></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.university}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status === "pending_technical_interview" ? "pending_technical_interview" : app.status} /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedAt}</td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">No applications yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> {t("rhDashboard.upcomingEvents")}
            </h2>
          </div>
          <div className="divide-y">
            {mockEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="p-4 hover:bg-secondary/30 transition-colors">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{event.date} • {event.time}</p>
                <p className="text-xs text-muted-foreground">{event.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{event.type}</span>
                  <span className="text-[10px] text-muted-foreground">{event.confirmed.length}/{event.assignedInterns.length} {t("rhDashboard.confirmed")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RHDashboard;
