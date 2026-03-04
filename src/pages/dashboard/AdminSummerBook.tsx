import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { BookOpen, MapPin, Users, PieChart } from "lucide-react";

const AdminSummerBook = () => {
  const { summerProjects } = useMockInternshipStore();

  const totalProjects = summerProjects.length;
  const totalPlannedInterns = summerProjects.reduce(
    (sum, p) => sum + p.estimatedInterns,
    0
  );
  const deptCounts = summerProjects.reduce(
    (acc: Record<string, number>, p) => {
      acc[p.department] = (acc[p.department] || 0) + 1;
      return acc;
    },
    {}
  );

  const deptEntries = Object.entries(deptCounts);

  return (
    <DashboardLayout role="admin">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Summer Book — Direction Générale
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Read-only overview of short-term internship projects (1–2 Months)
            created by supervisors.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Total Projects
            </p>
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalProjects}</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Planned Interns
            </p>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {totalPlannedInterns}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Departments
            </p>
            <PieChart className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {deptEntries.length}
          </p>
        </div>
      </div>

      {/* Department distribution */}
      <div className="bg-card rounded-xl border shadow-sm mb-8">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Department distribution
          </h2>
          <span className="text-xs text-muted-foreground">
            Projects per department
          </span>
        </div>
        <div className="p-5">
          {deptEntries.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No summer projects found.
            </p>
          )}
          <div className="space-y-2">
            {deptEntries.map(([dept, count]) => (
              <div
                key={dept}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary/70" />
                  {dept}
                </span>
                <span className="font-medium text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {summerProjects.map((p) => (
          <div
            key={p.id}
            className="bg-card rounded-xl border shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Short-Term Internship Project (
                    {p.durationMonths === 1 ? "1 Month" : "2 Months"})
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    <MapPin className="h-3 w-3" />
                    {p.department}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                    Short-Term
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-[11px] bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <div className="space-y-0.5">
                <p>
                  Supervisor:{" "}
                  <span className="font-medium text-foreground">
                    {p.supervisorName}
                  </span>
                </p>
                <p>
                  Planned interns:{" "}
                  <span className="font-medium text-foreground">
                    {p.estimatedInterns}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p>Created on {p.createdAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {summerProjects.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No summer projects found.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminSummerBook;

