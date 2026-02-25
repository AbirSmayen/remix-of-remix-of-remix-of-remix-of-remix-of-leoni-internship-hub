import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, Building2, GraduationCap, MapPin } from "lucide-react";
import { mockInternshipSubjects, internshipTypes, departments, leoniSites } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PFEBook = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [siteFilter, setSiteFilter] = useState<string>("all");

  const filtered = mockInternshipSubjects.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || s.type === typeFilter;
    const matchesDept = deptFilter === "all" || s.department === deptFilter;
    const matchesSite = siteFilter === "all" || s.site === siteFilter;
    return matchesSearch && matchesType && matchesDept && matchesSite;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">PFE Book — All LEONI Tunisia Sites</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Browse internship opportunities across all LEONI Tunisia locations. Filter by site, department, or skills.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Sites</option>
              {leoniSites.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Types</option>
              {internshipTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((subject) => (
              <div
                key={subject.id}
                className="bg-card rounded-xl border p-6 hover-scale transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">{subject.type}</span>
                  <StatusBadge status={subject.status === "published" ? "open" : "closed"} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {subject.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{subject.description}</p>
                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> {subject.site}</div>
                  <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> {subject.department}</div>
                  <div className="flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5" /> {subject.supervisor}</div>
                  <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {subject.duration}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {subject.skills.map((skill) => (
                    <span key={skill} className="text-[11px] bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">{skill}</span>
                  ))}
                </div>
                <Link
                  to={`/apply/${subject.id}`}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
                >
                  Postuler
                </Link>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No subjects found</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PFEBook;
