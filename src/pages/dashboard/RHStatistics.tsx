import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { mockStats, mockInterns } from "@/data/mockData";
import { Users, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// Mock time-series data for Academic Level Distribution (Répartition selon les filières)
const academicLevelTrendData = [
  { period: "Jan", Licence: 18, Master: 32, "Engineering Cycle": 50 },
  { period: "Feb", Licence: 22, Master: 35, "Engineering Cycle": 43 },
  { period: "Mar", Licence: 20, Master: 38, "Engineering Cycle": 42 },
  { period: "Apr", Licence: 25, Master: 33, "Engineering Cycle": 42 },
  { period: "May", Licence: 27, Master: 30, "Engineering Cycle": 43 },
  { period: "Jun", Licence: 24, Master: 36, "Engineering Cycle": 40 },
  { period: "Jul", Licence: 20, Master: 40, "Engineering Cycle": 40 },
  { period: "Aug", Licence: 22, Master: 35, "Engineering Cycle": 43 },
  { period: "Sep", Licence: 26, Master: 32, "Engineering Cycle": 42 },
  { period: "Oct", Licence: 23, Master: 37, "Engineering Cycle": 40 },
  { period: "Nov", Licence: 21, Master: 39, "Engineering Cycle": 40 },
];
const FILIERE_COLORS = {
  Licence: { stroke: "#4caf50", fill: "rgba(76, 175, 80, 0.2)" },
  Master: { stroke: "#f7902d", fill: "rgba(247, 144, 45, 0.2)" },
  "Engineering Cycle": { stroke: "#4261d7", fill: "rgba(66, 97, 215, 0.2)" },
};

const periodOptions = ["Monthly", "Quarterly", "Yearly"] as const;
type Period = typeof periodOptions[number];

// Chart data
const internsByDeptData = [
  { department: "IT / Digital", count: 6 },
  { department: "Production", count: 4 },
  { department: "Qualité", count: 3 },
  { department: "Engineering", count: 2 },
  { department: "RH", count: 1 },
  { department: "SME", count: 2 },
];
const internsBySiteData = [
  { name: "Mateur South", value: 6, color: "hsl(220, 70%, 35%)" },
  { name: "Mateur North", value: 4, color: "hsl(142, 71%, 45%)" },
  { name: "Sousse Messadine", value: 5, color: "hsl(252, 56%, 57%)" },
  { name: "Menzel Hayet", value: 3, color: "hsl(38, 92%, 50%)" },
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
        <StatCard title="Total Interns" value={mockStats.totalApplications} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Accepted This Year" value={mockStats.accepted} icon={<CheckCircle className="h-5 w-5" />} color="text-success" />
        <StatCard title="Avg Progress" value={`${mockStats.avgProgress}%`} icon={<TrendingUp className="h-5 w-5" />} color="text-primary" />
        <StatCard title="Event Participation" value={`${mockStats.eventParticipation}%`} icon={<Calendar className="h-5 w-5" />} color="text-warning" />
      </div>

      {/* Simple mock chart placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Departments Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={internsByDeptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
              <Bar dataKey="count" name="Interns" fill="hsl(220, 70%, 35%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Internships by Site">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={internsBySiteData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {internsBySiteData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Academic Level Distribution — Répartition selon les filières */}
      <div className="mb-6">
        <div className="bg-card rounded-xl border shadow-sm p-6" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h3 className="text-base font-semibold text-foreground">Répartition selon les filières</h3>
            <div className="flex items-center gap-4 flex-wrap">
              {(["Engineering Cycle", "Master", "Licence"] as const).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/30" style={{ backgroundColor: FILIERE_COLORS[key].stroke }} />
                  <span className="text-sm text-muted-foreground">{key}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={academicLevelTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="areaLicence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4caf50" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4caf50" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="areaMaster" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f7902d" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f7902d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="areaEngineering" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4261d7" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4261d7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload) return null;
                  return (
                    <div className="bg-card border rounded-lg shadow-lg p-3 text-sm">
                      <p className="font-semibold text-foreground mb-1">{label}</p>
                      {payload.map((entry: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.name}: <span className="font-medium text-foreground">{entry.value}%</span></span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Area type="monotone" dataKey="Engineering Cycle" stroke="#4261d7" strokeWidth={2} fill="url(#areaEngineering)" />
              <Area type="monotone" dataKey="Master" stroke="#f7902d" strokeWidth={2} fill="url(#areaMaster)" />
              <Area type="monotone" dataKey="Licence" stroke="#4caf50" strokeWidth={2} fill="url(#areaLicence)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-6 mt-2 text-xs text-muted-foreground">
            <span>Licence: <strong className="text-foreground">26.7%</strong> avg</span>
            <span>Master: <strong className="text-foreground">35.2%</strong> avg</span>
            <span>Engineering Cycle: <strong className="text-foreground">42.1%</strong> avg</span>
          </div>
        </div>
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
