import { useState } from "react";
import { Laptop, Cpu, Package, CheckCircle, AlertTriangle, Plus, Shield, ArrowLeftRight, HardDrive, Wrench, Wifi, Eye } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns, departments } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface EquipmentItem {
  id: string;
  name: string;
  type: "pc" | "hardware" | "personal" | "access" | "safety";
  approved: boolean;
  comment?: string;
  approvedDate?: string;
}

interface Authorization {
  id: string;
  internId: string;
  internName: string;
  department: string;
  internshipType: string;
  site: string;
  supervisor: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "partial";
  items: EquipmentItem[];
  rhComment?: string;
  createdAt: string;
}

const departmentSuggestions: Record<string, { name: string; type: EquipmentItem["type"] }[]> = {
  "IT / Digital": [
    { name: "Laptop / PC", type: "pc" },
    { name: "Arduino Board", type: "hardware" },
    { name: "IoT Development Kit", type: "hardware" },
    { name: "External Monitor", type: "pc" },
    { name: "USB Hub & Peripherals", type: "hardware" },
    { name: "Network Access (Full)", type: "access" },
    { name: "Development Tools License", type: "access" },
  ],
  "Production": [
    { name: "Laptop / PC", type: "pc" },
    { name: "Safety Helmet", type: "safety" },
    { name: "Safety Gloves", type: "safety" },
    { name: "Safety Glasses", type: "safety" },
    { name: "Production Line Access Badge", type: "access" },
    { name: "Testing Equipment", type: "hardware" },
  ],
  "Qualité": [
    { name: "Laptop / PC", type: "pc" },
    { name: "Quality Testing Instruments", type: "hardware" },
    { name: "Lab Access Badge", type: "access" },
    { name: "Documentation Access", type: "access" },
  ],
  "Engineering": [
    { name: "Laptop / PC", type: "pc" },
    { name: "LabVIEW License", type: "access" },
    { name: "Oscilloscope Access", type: "hardware" },
    { name: "Soldering Station", type: "hardware" },
    { name: "External Storage", type: "hardware" },
    { name: "Workshop Access Badge", type: "access" },
  ],
  "SME": [
    { name: "Laptop / PC", type: "pc" },
    { name: "Network Access (Standard)", type: "access" },
    { name: "Documentation Access", type: "access" },
  ],
  default: [
    { name: "Laptop / PC", type: "pc" },
    { name: "Network Access (Standard)", type: "access" },
    { name: "Documentation Access", type: "access" },
  ],
};

const typeIcons: Record<string, React.ReactNode> = {
  pc: <Laptop className="h-4 w-4" />,
  hardware: <Cpu className="h-4 w-4" />,
  personal: <Package className="h-4 w-4" />,
  access: <Wifi className="h-4 w-4" />,
  safety: <Shield className="h-4 w-4" />,
};

const typeLabels: Record<string, string> = {
  pc: "Company PC",
  hardware: "External Hardware",
  personal: "Personal Equipment",
  access: "Access & Licenses",
  safety: "Safety Equipment",
};

// Generate initial authorizations from mock interns
const generateAuthorizations = (): Authorization[] =>
  mockInterns.map((intern) => {
    const dept = intern.department;
    const suggestions = departmentSuggestions[dept] || departmentSuggestions.default;
    return {
      id: `auth-${intern.id}`,
      internId: intern.id,
      internName: intern.name,
      department: intern.department,
      internshipType: intern.type,
      site: intern.site,
      supervisor: intern.supervisor,
      startDate: intern.startDate,
      endDate: intern.endDate,
      status: intern.id === "2" ? "approved" : "pending",
      items: suggestions.map((s, idx) => ({
        id: `item-${intern.id}-${idx}`,
        name: s.name,
        type: s.type,
        approved: intern.id === "2",
        approvedDate: intern.id === "2" ? "2026-02-12" : undefined,
      })),
      rhComment: intern.id === "2" ? "All equipment authorized. IT setup completed." : undefined,
      createdAt: "2026-02-10",
    };
  });

const RHEquipment = () => {
  const [authorizations] = useState<Authorization[]>(generateAuthorizations);
  const approved = authorizations.filter(a => a.status === "approved").length;
  const pending = authorizations.filter(a => a.status === "pending").length;
  const totalItems = authorizations.reduce((s, a) => s + a.items.length, 0);
  const approvedItems = authorizations.reduce((s, a) => s + a.items.filter(i => i.approved).length, 0);

  return (
    <DashboardLayout role="rh">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipment & Authorization Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Read-only view of equipment, PC access, and resources validated by supervisors for accepted interns.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Authorizations", value: authorizations.length, icon: <Shield className="h-5 w-5" />, color: "text-primary", bg: "bg-primary/10" },
            { label: "Approved", value: approved, icon: <CheckCircle className="h-5 w-5" />, color: "text-success", bg: "bg-success/10" },
            { label: "Pending", value: pending, icon: <AlertTriangle className="h-5 w-5" />, color: "text-warning", bg: "bg-warning/10" },
            { label: "Items Approved", value: `${approvedItems}/${totalItems}`, icon: <Package className="h-5 w-5" />, color: "text-primary", bg: "bg-primary/10" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border p-5 shadow-sm">
              <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Notifications */}
        {pending > 0 && (
          <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">{pending} intern account(s) without full authorization</p>
              <p className="text-xs text-muted-foreground">
                Supervisors are responsible for completing equipment and access authorizations. RH has visibility only.
              </p>
            </div>
          </div>
        )}

        {/* Authorization Table */}
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-foreground">Intern Authorizations (Supervisor-Owned)</h2>
            <p className="text-sm text-muted-foreground">
              RH can monitor which equipment and accesses have been granted. All changes are performed by supervisors in
              their own authorization panel.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Intern</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Department</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Site</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Items</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {authorizations.map(auth => (
                  <tr key={auth.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                          {auth.internName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{auth.internName}</p>
                          <p className="text-xs text-muted-foreground">{auth.supervisor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{auth.department}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{auth.internshipType}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{auth.site}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-foreground">{auth.items.filter(i => i.approved).length}/{auth.items.length}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={auth.status === "approved" ? "approved" : auth.status === "partial" ? "needs_revision" : "pending"} />
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                      Supervisor-managed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RHEquipment;
