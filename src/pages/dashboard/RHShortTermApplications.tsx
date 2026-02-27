import { ClipboardList, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { CvButton, FilterSelect, StatusPill } from "@/components/rh/applications/ApplicationComponents";

const RHShortTermApplications = () => {
  const [siteFilter, setSiteFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const mockShortTermApplications = [
    {
      id: "st-1",
      fullName: "Khalil Jaziri",
      email: "khalil.jaziri@esprit.tn",
      phone: "+216 50 987 654",
      site: "Sousse Messadine",
      department: "IT",
      type: "Summer Internship" as const,
      status: "Pending" as const,
      cvUrl: "/mock/cv/khalil-jaziri.pdf",
    },
    {
      id: "st-2",
      fullName: "Ines Bouazizi",
      email: "ines.bouazizi@isi.tn",
      phone: "+216 21 222 333",
      site: "Mateur South",
      department: "Engineering",
      type: "Observation Internship" as const,
      status: "Interview" as const,
      cvUrl: "/mock/cv/ines-bouazizi.pdf",
    },
    {
      id: "st-3",
      fullName: "Amine Riahi",
      email: "amine.riahi@enit.tn",
      phone: "+216 27 444 555",
      site: "Menzel Hayet",
      department: "Production",
      type: "1-Month Internship" as const,
      status: "Accepted" as const,
      cvUrl: "/mock/cv/amine-riahi.pdf",
    },
    {
      id: "st-4",
      fullName: "Fatma Kacem",
      email: "fatma.kacem@insat.tn",
      phone: "+216 29 111 222",
      site: "Sidi Bouali",
      department: "Logistics",
      type: "Summer Internship" as const,
      status: "Rejected" as const,
      cvUrl: "/mock/cv/fatma-kacem.pdf",
    },
    {
      id: "st-5",
      fullName: "Skander Ben Salah",
      email: "skander.bensalah@supcom.tn",
      phone: "+216 24 333 444",
      site: "Mateur North",
      department: "HR",
      type: "Observation Internship" as const,
      status: "Pending" as const,
      cvUrl: "/mock/cv/skander-ben-salah.pdf",
    },
  ];

  const siteOptions = [
    "Mateur South",
    "Mateur North",
    "Sousse Messadine",
    "Menzel Hayet",
    "Sidi Bouali",
  ];
  const departmentOptions = ["Engineering", "Logistics", "Production", "IT", "HR"];
  const typeOptions = ["Summer Internship", "Observation Internship", "1-Month Internship"];
  const statusOptions = ["Pending", "Interview", "Accepted", "Rejected"];

  const filtered = mockShortTermApplications.filter((a) => {
    if (siteFilter !== "all" && a.site !== siteFilter) return false;
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (departmentFilter !== "all" && a.department !== departmentFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.fullName.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <DashboardLayout role="rh">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" /> Short-Term Applications
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review Summer, Observation, and 1-Month internship applications.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search candidates..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterSelect value={siteFilter} onChange={setSiteFilter} placeholder="All Sites" options={siteOptions} />
          <FilterSelect value={typeFilter} onChange={setTypeFilter} placeholder="All Types" options={typeOptions} />
          <FilterSelect value={departmentFilter} onChange={setDepartmentFilter} placeholder="All Departments" options={departmentOptions} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} placeholder="All Status" options={statusOptions} />
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Candidate</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Site</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Department</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">CV</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">{app.fullName}</p>
                    <div className="mt-1 space-y-0.5">
                      <p className="text-xs text-muted-foreground">📧 Email: {app.email}</p>
                      <p className="text-xs text-muted-foreground">📱 Phone: {app.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{app.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{app.site}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{app.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={app.status} />
                  </td>
                  <td className="px-6 py-4">
                    <CvButton href={app.cvUrl} label="CV" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No short-term applications found.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RHShortTermApplications;

