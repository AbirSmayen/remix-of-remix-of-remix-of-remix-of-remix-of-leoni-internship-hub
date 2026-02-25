import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, Building2, GraduationCap, MapPin, BookOpen, Users, ArrowRight, FileText, Upload, CheckCircle } from "lucide-react";
import { usePFESubjects } from "@/hooks/usePFESubjects";
import StatusBadge from "@/components/ui/StatusBadge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { departments, leoniSites } from "@/data/mockData";
import { Skeleton } from "@/components/ui/skeleton";

const PFEBook = () => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const { data: subjects, isLoading } = usePFESubjects("PFE");

  const filtered = (subjects || []).filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "all" || s.department === deptFilter;
    const matchesSite = siteFilter === "all" || s.site === siteFilter;
    return matchesSearch && matchesDept && matchesSite && s.status === "open";
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Company Introduction Section */}
          <div className="mb-16">
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12 text-primary-foreground">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-8 w-8" />
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-80">LEONI Tunisia</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">PFE Book 2026</h1>
                <p className="text-lg opacity-90 max-w-2xl">
                  Discover end-of-studies internship opportunities across all LEONI Tunisia sites. 
                  Join a global leader in energy and data management solutions for the automotive industry.
                </p>
              </div>

              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3">About LEONI</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      LEONI is a global provider of products, solutions and services for energy and data management in the automotive sector. 
                      With multiple production sites across Tunisia — Mateur, Sousse, Sidi Bouali, and Menzel Hayet — LEONI offers diverse 
                      opportunities for engineering students to work on cutting-edge projects in manufacturing, IT, quality, and engineering.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3">Our Internship Vision</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We believe in nurturing future talent through hands-on experience. Our PFE internships are designed to provide real-world 
                      challenges, professional mentoring, and exposure to international standards in automotive manufacturing and technology.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">How to Apply</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { step: 1, icon: Search, title: "Choose a Subject", desc: "Browse available PFE subjects below" },
                      { step: 2, icon: ArrowRight, title: "Click Apply", desc: "Open the application form" },
                      { step: 3, icon: Upload, title: "Submit Documents", desc: "Upload your CV (required) and motivation letter" },
                      { step: 4, icon: CheckCircle, title: "Track Status", desc: "Wait for RH review and interview" },
                    ].map(({ step, icon: Icon, title, desc }) => (
                      <div key={step} className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50">
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">{step}</div>
                        <Icon className="h-5 w-5 text-primary mb-2" />
                        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search PFE subjects..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="all">All Sites</option>
              {leoniSites.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="all">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Subject count */}
          <div className="mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{filtered.length} PFE Subject{filtered.length !== 1 ? "s" : ""} Available</span>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-card rounded-xl border p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((subject) => (
              <div key={subject.id} className="bg-card rounded-xl border p-6 hover-scale transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full">{subject.subject_id}</span>
                  <StatusBadge status={subject.status === "open" ? "open" : "closed"} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">{subject.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{subject.description}</p>
                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> {subject.site}</div>
                  <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> {subject.department}</div>
                  {subject.supervisor && <div className="flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5" /> {subject.supervisor}</div>}
                  {subject.duration && <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {subject.duration}</div>}
                  <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {subject.max_interns} intern{subject.max_interns > 1 ? "s" : ""} needed</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(subject.skills || []).map((skill) => (
                    <span key={skill} className="text-[11px] bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">{skill}</span>
                  ))}
                </div>
                <Link
                  to={`/pfe-book/${subject.subject_id}`}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
                >
                  View Details & Apply
                </Link>
              </div>
            ))}
          </div>

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No PFE subjects found</p>
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
