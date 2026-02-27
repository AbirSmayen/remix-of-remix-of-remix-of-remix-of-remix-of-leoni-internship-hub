import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useInterns, useAlumni } from "@/hooks/useInterns";
import { useApplications } from "@/hooks/usePFESubjects";
import { departments } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  Users,
  Trophy,
  UserCheck,
  TrendingUp,
  Building2,
  Target,
  Archive,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--success))", "hsl(220, 70%, 50%)", "hsl(280, 60%, 50%)", "hsl(160, 60%, 45%)"];

const RHRecruitmentDashboard = () => {
  const { data: interns = [], isLoading: loadingInterns } = useInterns();
  const { data: alumni = [], isLoading: loadingAlumni } = useAlumni();
  const { data: applications = [], isLoading: loadingApps } = useApplications();

  const acceptedCount = useMemo(() => applications.filter((a: { status: string }) => a.status === "accepted").length, [applications]);
  const totalInternsAllTime = interns.length + alumni.length;
  const top10Count = alumni.filter((a) => a.is_top10).length;
  const recruitmentEligibleCount = alumni.filter((a) => a.recruitment_eligible).length;
  const conversionRate = totalInternsAllTime > 0 ? Math.round((recruitmentEligibleCount / totalInternsAllTime) * 100) : 0;
  const internshipToHiringRatio = acceptedCount > 0 ? (recruitmentEligibleCount / acceptedCount) * 100 : 0;

  const deptPerformance = useMemo(() => {
    const byDept: Record<string, { total: number; top10: number; eligible: number; avgScore: number; sumScore: number; count: number }> = {};
    [...interns, ...alumni].forEach((i) => {
      if (!byDept[i.department]) byDept[i.department] = { total: 0, top10: 0, eligible: 0, avgScore: 0, sumScore: 0, count: 0 };
      byDept[i.department].total += 1;
      if (i.is_top10) byDept[i.department].top10 += 1;
      if (i.recruitment_eligible) byDept[i.department].eligible += 1;
      const score = i.final_evaluation_score ?? i.presentation_score ?? i.voting_score;
      if (score != null) {
        byDept[i.department].sumScore += Number(score);
        byDept[i.department].count += 1;
      }
    });
    return Object.entries(byDept).map(([department, v]) => ({
      department,
      count: v.total,
      top10: v.top10,
      eligible: v.eligible,
      avgScore: v.count > 0 ? Math.round((v.sumScore / v.count) * 100) / 100 : 0,
    }));
  }, [interns, alumni]);

  const performanceDistribution = useMemo(() => {
    const buckets = { "0-2": 0, "2-3": 0, "3-4": 0, "4-5": 0 };
    alumni.forEach((a) => {
      const s = a.final_evaluation_score ?? 0;
      if (s <= 2) buckets["0-2"] += 1;
      else if (s <= 3) buckets["2-3"] += 1;
      else if (s <= 4) buckets["3-4"] += 1;
      else buckets["4-5"] += 1;
    });
    return [
      { name: "0-2", value: buckets["0-2"], color: "hsl(0, 84%, 60%)" },
      { name: "2-3", value: buckets["2-3"], color: "hsl(38, 92%, 50%)" },
      { name: "3-4", value: buckets["3-4"], color: "hsl(220, 70%, 45%)" },
      { name: "4-5", value: buckets["4-5"], color: "hsl(142, 71%, 45%)" },
    ].filter((d) => d.value > 0);
  }, [alumni]);

  const isLoading = loadingInterns || loadingAlumni || loadingApps;

  if (isLoading) {
    return (
      <DashboardLayout role="rh">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="rh">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" /> Recruitment Intelligence
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Executive analytics for talent pipeline and internship-to-hiring performance.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total interns (all years)", value: totalInternsAllTime, icon: Users, color: "text-primary" },
          { label: "Alumni (archived)", value: alumni.length, icon: Archive, color: "text-muted-foreground" },
          { label: "TOP 10", value: top10Count, icon: Trophy, color: "text-warning" },
          { label: "Recruitment eligible", value: recruitmentEligibleCount, icon: UserCheck, color: "text-success" },
          { label: "Conversion rate %", value: conversionRate + "%", icon: TrendingUp, color: "text-primary" },
          { label: "Internship→Hiring ratio %", value: Math.round(internshipToHiringRatio) + "%", icon: Target, color: "text-leoni-purple" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border p-5 shadow-sm"
          >
            <div className={`p-2 rounded-lg bg-secondary inline-flex mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Department performance
          </h3>
          {deptPerformance.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptPerformance} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="department" width={100} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                  formatter={(value: number) => [value, ""]}
                  labelFormatter={(label) => `Department: ${label}`}
                />
                <Bar dataKey="count" name="Interns" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="top10" name="TOP 10" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="eligible" name="Eligible" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance distribution (alumni)</h3>
          {performanceDistribution.length === 0 ? (
            <p className="text-sm text-muted-foreground">No evaluation scores yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={performanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {performanceDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Alumni"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Department heatmap (interns + TOP 10 + eligible)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {(deptPerformance.length ? deptPerformance : departments.map((d) => ({ department: d, count: 0, top10: 0, eligible: 0, avgScore: 0 }))).map((row) => {
            const max = Math.max(...deptPerformance.map((r) => r.count), 1);
            const intensity = row.count / max;
            return (
              <div
                key={row.department}
                className="rounded-lg border p-4 text-center transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: `hsl(var(--primary) / ${0.05 + intensity * 0.2})`,
                  borderColor: `hsl(var(--primary) / ${0.2 + intensity * 0.3})`,
                }}
              >
                <p className="text-sm font-medium text-foreground truncate" title={row.department}>{row.department}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{row.count}</p>
                <p className="text-xs text-muted-foreground">TOP10: {row.top10} · Eligible: {row.eligible}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default RHRecruitmentDashboard;
