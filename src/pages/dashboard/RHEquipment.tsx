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
  const [authorizations, setAuthorizations] = useState<Authorization[]>(generateAuthorizations);
  const [selectedAuth, setSelectedAuth] = useState<Authorization | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [customItem, setCustomItem] = useState("");
  const [customType, setCustomType] = useState<EquipmentItem["type"]>("hardware");
  const [rhComment, setRhComment] = useState("");

  const approved = authorizations.filter(a => a.status === "approved").length;
  const pending = authorizations.filter(a => a.status === "pending").length;
  const totalItems = authorizations.reduce((s, a) => s + a.items.length, 0);
  const approvedItems = authorizations.reduce((s, a) => s + a.items.filter(i => i.approved).length, 0);

  const openPanel = (auth: Authorization) => {
    setSelectedAuth({ ...auth, items: auth.items.map(i => ({ ...i })) });
    setRhComment(auth.rhComment || "");
    setShowPanel(true);
  };

  const toggleItem = (itemId: string) => {
    if (!selectedAuth) return;
    setSelectedAuth({
      ...selectedAuth,
      items: selectedAuth.items.map(i =>
        i.id === itemId ? { ...i, approved: !i.approved } : i
      ),
    });
  };

  const addCustomItem = () => {
    if (!customItem.trim() || !selectedAuth) return;
    const newItem: EquipmentItem = {
      id: `custom-${Date.now()}`,
      name: customItem,
      type: customType,
      approved: true,
    };
    setSelectedAuth({ ...selectedAuth, items: [...selectedAuth.items, newItem] });
    setCustomItem("");
  };

  const saveAuthorization = () => {
    if (!selectedAuth) return;
    const allApproved = selectedAuth.items.every(i => i.approved);
    const someApproved = selectedAuth.items.some(i => i.approved);
    const status = allApproved ? "approved" : someApproved ? "partial" : "pending";
    const now = new Date().toISOString().split("T")[0];

    setAuthorizations(prev => prev.map(a =>
      a.id === selectedAuth.id
        ? {
            ...selectedAuth,
            status,
            rhComment: rhComment || undefined,
            items: selectedAuth.items.map(i => ({
              ...i,
              approvedDate: i.approved ? (i.approvedDate || now) : undefined,
            })),
          }
        : a
    ));
    toast.success(`Authorization ${status === "approved" ? "fully approved" : "updated"} for ${selectedAuth.internName}`);
    setShowPanel(false);
  };

  return (
    <DashboardLayout role="rh">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipment & Authorization Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage intern equipment authorizations, assignments, and returns.</p>
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
              <p className="text-sm font-semibold text-foreground">{pending} new intern account(s) require authorization</p>
              <p className="text-xs text-muted-foreground">Equipment authorization must be completed before internship becomes "Active".</p>
            </div>
          </div>
        )}

        {/* Authorization Table */}
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-foreground">Intern Authorization Panel</h2>
            <p className="text-sm text-muted-foreground">Review and approve equipment based on department and internship type. Smart suggestions are pre-filled.</p>
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
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => openPanel(auth)} className="gap-1.5 text-xs">
                        <Eye className="h-3.5 w-3.5" /> Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Authorization Detail Panel */}
      <Dialog open={showPanel} onOpenChange={setShowPanel}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Authorization — {selectedAuth?.internName}</DialogTitle>
            <DialogDescription>
              {selectedAuth?.department} • {selectedAuth?.internshipType} • {selectedAuth?.site}<br />
              <span className="text-xs">Period: {selectedAuth?.startDate} → {selectedAuth?.endDate} • Supervisor: {selectedAuth?.supervisor}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedAuth && (
            <div className="space-y-5 py-2">
              {/* Smart suggestions info */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary">
                <strong>Smart Suggestions:</strong> Equipment pre-filled based on {selectedAuth.department} department and {selectedAuth.internshipType} internship type.
              </div>

              {/* Equipment Checklist */}
              <div className="space-y-2">
                {selectedAuth.items.map(item => (
                  <label key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    item.approved ? "bg-success/5 border-success/30" : "hover:bg-secondary/50"
                  }`}>
                    <input
                      type="checkbox"
                      checked={item.approved}
                      onChange={() => toggleItem(item.id)}
                      className="h-4 w-4 rounded border-border text-primary"
                    />
                    <span className="p-1.5 rounded-md bg-secondary text-muted-foreground">{typeIcons[item.type]}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{typeLabels[item.type]}</p>
                    </div>
                    {item.approved && item.approvedDate && (
                      <span className="text-[10px] text-success font-medium">{item.approvedDate}</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Add custom item */}
              <div className="flex gap-2">
                <select
                  value={customType}
                  onChange={e => setCustomType(e.target.value as EquipmentItem["type"])}
                  className="px-3 py-2 rounded-lg border bg-background text-sm w-40"
                >
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input
                  value={customItem}
                  onChange={e => setCustomItem(e.target.value)}
                  placeholder="Add custom equipment..."
                  className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
                />
                <Button variant="outline" size="sm" onClick={addCustomItem} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>

              {/* RH Comment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">RH Comment</label>
                <textarea
                  rows={2}
                  value={rhComment}
                  onChange={e => setRhComment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm resize-none"
                  placeholder="Optional comment..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPanel(false)}>Cancel</Button>
            <Button onClick={saveAuthorization} className="gap-2">
              <Shield className="h-4 w-4" /> Save Authorization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RHEquipment;
