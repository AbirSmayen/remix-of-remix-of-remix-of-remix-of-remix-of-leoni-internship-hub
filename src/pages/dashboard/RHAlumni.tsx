import { useState, useMemo } from "react";
import {
  Archive,
  Search,
  Building2,
  MapPin,
  Filter,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { departments, leoniSites } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { AlumniMock } from "@/types/internship";

const formatDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—");

function getYear(d: string | null): number {
  if (!d) return 0;
  const y = new Date(d).getFullYear();
  return isNaN(y) ? 0 : y;
}

const RHAlumni = () => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "end_date">("end_date");
  const [showFilters, setShowFilters] = useState(true);

  const { alumni } = useMockInternshipStore();
  const isLoading = false;

  const filteredAlumni = useMemo(() => {
    let list = alumni.filter((a) => {
      if (deptFilter !== "all" && a.department !== deptFilter) return false;
      if (siteFilter !== "all" && a.site !== siteFilter) return false;
      return true;
    });
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          (a.project_title ?? "").toLowerCase().includes(q) ||
          (a.supervisor ?? "").toLowerCase().includes(q)
      );
    }
    if (sortBy === "name") list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    else if (sortBy === "end_date") list.sort((a, b) => (b.end_date ?? "").localeCompare(a.end_date ?? ""));
    return list;
  }, [alumni, search, sortBy, deptFilter, siteFilter]);

  const filtered = filteredAlumni;

  const byYear = useMemo(() => {
    const map = new Map<number, AlumniMock[]>();
    filtered.forEach((a) => {
      const y = getYear(a.end_date);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(a);
    });
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [filtered]);

  return (
    <DashboardLayout role="rh">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Archive className="h-6 w-6 text-primary" /> Historique des stagiaires
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Liste des stages terminés, triés par année — département, sujet, type. Pas de TOP 10.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
          <Filter className="h-4 w-4" /> {showFilters ? "Hide" : "Show"} Filters
        </Button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card rounded-xl border shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, project, supervisor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Sites</option>
              {leoniSites.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "end_date")}
              className="px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="end_date">Sort by end date</option>
              <option value="name">Sort by name</option>
            </select>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-2xl font-bold text-foreground">{alumni.length}</p>
          <p className="text-sm text-muted-foreground">Total alumni</p>
        </div>
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <p className="text-2xl font-bold text-primary">{filtered.length}</p>
          <p className="text-sm text-muted-foreground">In current view</p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
          <Archive className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-foreground font-medium">No alumni match your filters</p>
          <p className="text-sm text-muted-foreground mt-1">Complete internships and archive them to see alumni here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {byYear.map(([year, list]) => (
            <div key={year} className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b bg-secondary/50">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">{year}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-secondary/30">
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Department</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Subject</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Internship Type</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Site</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {list.map((a, idx) => (
                        <motion.tr
                          key={a.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className="border-b last:border-0 hover:bg-secondary/20 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{a.full_name}</p>
                            <p className="text-xs text-muted-foreground">{a.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> {a.department}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground line-clamp-2">{a.project_title ?? "—"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary">{a.internship_type}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.site}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatDate(a.start_date)} – {formatDate(a.end_date)}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default RHAlumni;
