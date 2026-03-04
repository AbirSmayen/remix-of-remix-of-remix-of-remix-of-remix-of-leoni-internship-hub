import { useState } from "react";
import { BookOpen, Filter, MapPin, Tag, Clock, Download, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { departments } from "@/data/mockData";
import { toast } from "sonner";
import { formatSummerBookData, generateSummerBookPdf } from "@/lib/pdf/pdfGenerator";

const RHSummerBook = () => {
  const { summerProjects } = useMockInternshipStore();
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const filtered = summerProjects.filter((p) => {
    const matchDept = deptFilter === "all" || p.department === deptFilter;
    const matchDuration =
      durationFilter === "all" ||
      (durationFilter === "1" && p.durationMonths === 1) ||
      (durationFilter === "2" && p.durationMonths === 2);
    return matchDept && matchDuration;
  });

  return (
    <DashboardLayout role="rh">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Summer Book — Short-Term Projects
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Short-Term Internship Projects (1–2 Months). View only — managed by supervisors.
          </p>
        </div>

        <button
          type="button"
          disabled={isGeneratingPdf}
          onClick={async () => {
            try {
              setIsGeneratingPdf(true);
              const pdfData = formatSummerBookData(summerProjects);
              await generateSummerBookPdf(pdfData);
              toast.success("Summer Book PDF downloaded.");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Failed to generate PDF.");
            } finally {
              setIsGeneratingPdf(false);
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isGeneratingPdf ? "Generating..." : "Generate PDF"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-xs"
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-xs"
        >
          <option value="all">All durations</option>
          <option value="1">1 Month</option>
          <option value="2">2 Months</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-card rounded-xl border shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Short-Term
                  </p>
                  <h3 className="text-base font-semibold text-foreground">
                    {p.title}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    <MapPin className="h-3 w-3" />
                    {p.department}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      p.durationMonths === 1
                        ? "bg-sky-50 text-sky-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {p.durationMonths === 1 ? "1 Month" : "2 Months"}
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
                    <Tag className="h-3 w-3" />
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

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No summer projects found.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RHSummerBook;

