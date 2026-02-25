import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { mockStats, mockDegreeStats, mockInterns } from "@/data/mockData";
import { Users, CheckCircle, TrendingUp, Calendar, Filter } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const periodOptions = ["Monthly", "Quarterly", "Yearly"] as const;
type Period = typeof periodOptions[number];

// Chart data
const internsByDegreeData = [
  { month: "Jan", Licence: 2, Ingénieur: 4, Master: 1 },
  { month: "Feb", Licence: 3, Ingénieur: 5, Master: 2 },
  { month: "Mar", Licence: 4, Ingénieur: 7, Master: 4 },
  { month: "Apr", Licence: 3, Ingénieur: 6, Master: 3 },
  { month: "May", Licence: 5, Ingénieur: 8, Master: 5 },
  { month: "Jun", Licence: 4, Ingénieur: 7, Master: 4 },
];

const internsByDeptData = [
  { department: "IT / Digital", count: 6 },
  { department: "Production", count: 4 },
  { department: "Qualité", count: 3 },
  { department: "Engineering", count: 2 },
  { department: "RH", count: 1 },
  { department: "SME", count: 2 },
];

const statusDistribution = [
  { name: "Active", value: 15, color: "hsl(220, 70%, 35%)" },
  { name: "Completed", value: 8, color: "hsl(142, 71%, 45%)" },
  { name: "Pending", value: 5, color: "hsl(38, 92%, 50%)" },
  { name: "Terminated", value: 2, color: "hsl(0, 84%, 60%)" },
];

const attendanceData = [
  { week: "W1", present: 92, halfDay: 5, absent: 3 },
  { week: "W2", present: 88, halfDay: 7, absent: 5 },
  { week: "W3", present: 95, halfDay: 3, absent: 2 },
  { week: "W4", present: 90, halfDay: 6, absent: 4 },
  { week: "W5", present: 94, halfDay: 4, absent: 2 },
  { week: "W6", present: 91, halfDay: 5, absent: 4 },
];

const submissionData = [
  { month: "Jan", approved: 12, revision: 4, pending: 6 },
  { month: "Feb", approved: 18, revision: 3, pending: 5 },
  { month: "Mar", approved: 22, revision: 5, pending: 8 },
  { month: "Apr", approved: 15, revision: 7, pending: 4 },
  { month: "May", approved: 25, revision: 2, pending: 3 },
  { month: "Jun", approved: 20, revision: 4, pending: 6 },
];

const eventParticipationData = [
  { name: "Confirmed", value: 78, color: "hsl(220, 70%, 35%)" },
  { name: "Pending", value: 14, color: "hsl(38, 92%, 50%)" },
  { name: "Declined", value: 8, color: "hsl(0, 84%, 60%)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}: <span className="font-medium text-foreground">{entry.value}</span></span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0];
  return (
    <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.payload.color }} />
        <span className="font-medium text-foreground">{d.name}: {d.value}</span>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-card rounded-xl border shadow-sm p-6 ${className}`}>
    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

const RHStatistics = () => {
  const [period, setPeriod] = useState<Period>("Monthly");

  return (
    <DashboardLayout role="rh">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Statistics & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Executive overview of the internship program.</p>
        </div>
        <div className="flex items-center gap-2 bg-card border rounded-lg p-1">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Interns" value={mockStats.activeInterns} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Attendance Rate" value={`${mockStats.attendanceRate}%`} icon={<CheckCircle className="h-5 w-5" />} color="text-success" />
        <StatCard title="Avg Progress" value={`${mockStats.avgProgress}%`} icon={<TrendingUp className="h-5 w-5" />} color="text-primary" />
        <StatCard title="Event Participation" value={`${mockStats.eventParticipation}%`} icon={<Calendar className="h-5 w-5" />} color="text-warning" />
      </div>

      {/* Row 1: Area + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Interns by Degree (Trend)">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={internsByDegreeData}>
              <defs>
                <linearGradient id="gradLicence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradIng" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220, 70%, 35%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(220, 70%, 35%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMaster" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(252, 56%, 57%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(252, 56%, 57%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="Licence" stroke="hsl(38, 92%, 50%)" fill="url(#gradLicence)" strokeWidth={2} />
              <Area type="monotone" dataKey="Ingénieur" stroke="hsl(220, 70%, 35%)" fill="url(#gradIng)" strokeWidth={2} />
              <Area type="monotone" dataKey="Master" stroke="hsl(252, 56%, 57%)" fill="url(#gradMaster)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Interns by Department">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={internsByDeptData} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Interns" fill="hsl(220, 70%, 35%)" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Donut + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartCard title="Internship Status Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {statusDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Attendance Rate Overview" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attendanceData} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" name="Present" fill="hsl(142, 71%, 45%)" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="halfDay" name="Half Day" fill="hsl(38, 92%, 50%)" stackId="a" />
              <Bar dataKey="absent" name="Absent" fill="hsl(0, 84%, 60%)" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Submission + Event Participation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartCard title="Submission Approval Rate" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={submissionData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="approved" name="Approved" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="revision" name="Needs Revision" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="pending" name="Pending" fill="hsl(220, 13%, 75%)" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Event Participation Rate">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={eventParticipationData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {eventParticipationData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Intern Progress Table */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Intern Progress Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Intern</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Degree</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Period</th>
              </tr>
            </thead>
            <tbody>
              {mockInterns.map((intern) => (
                <tr key={intern.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{intern.name}</p>
                    <p className="text-xs text-muted-foreground">{intern.university}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{intern.department}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{intern.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{intern.degree}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${intern.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{intern.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{intern.startDate} → {intern.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RHStatistics;
