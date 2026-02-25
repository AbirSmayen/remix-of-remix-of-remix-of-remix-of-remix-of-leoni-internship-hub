import { ClipboardList, Users, UserCheck, BookOpen, TrendingUp, Clock, Calendar, Award, Link2, BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { mockStats, mockApplications, mockEvents } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const RHDashboard = () => {
  const [publicLinkCopied, setPublicLinkCopied] = useState(false);
  const { t } = useTranslation();

  const handleGenerateLink = () => {
    navigator.clipboard.writeText("https://leoni.tn/pfe-book/2026");
    setPublicLinkCopied(true);
    toast.success(t("rhDashboard.linkCopied"));
    setTimeout(() => setPublicLinkCopied(false), 3000);
  };

  return (
    <DashboardLayout role="rh">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("rhDashboard.welcome")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("rhDashboard.overview")}</p>
        </div>
        <button onClick={handleGenerateLink} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
          <Link2 className="h-4 w-4" />
          {publicLinkCopied ? t("rhDashboard.linkCopied") : t("rhDashboard.generateLink")}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title={t("rhDashboard.totalApplications")} value={mockStats.totalApplications} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard title={t("rhDashboard.accepted")} value={mockStats.accepted} icon={<UserCheck className="h-5 w-5" />} color="text-success" />
        <StatCard title={t("rhDashboard.pendingReview")} value={mockStats.pending} icon={<Clock className="h-5 w-5" />} color="text-warning" />
        <StatCard title={t("rhDashboard.activeInterns")} value={mockStats.activeInterns} icon={<Users className="h-5 w-5" />} color="text-primary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title={t("rhDashboard.publishedSubjects")} value={mockStats.totalSubjects} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title={t("rhDashboard.departments")} value={mockStats.departments} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title={t("rhDashboard.attendanceRate")} value={`${mockStats.attendanceRate}%`} icon={<BarChart3 className="h-5 w-5" />} color="text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t("rhDashboard.recentApplications")}</h2>
              <p className="text-sm text-muted-foreground">{t("rhDashboard.recentApplicationsDesc")}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.candidate")}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.university")}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.department")}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.status")}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{t("rhDashboard.date")}</th>
                </tr>
              </thead>
              <tbody>
                {mockApplications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4"><p className="text-sm font-medium text-foreground">{app.candidateName}</p><p className="text-xs text-muted-foreground">{app.email}</p></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.university}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.department}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm">
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
