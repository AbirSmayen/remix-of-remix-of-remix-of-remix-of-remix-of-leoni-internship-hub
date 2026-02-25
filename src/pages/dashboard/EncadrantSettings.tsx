import { User, Bell } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

const EncadrantSettings = () => {
  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input defaultValue="Mohamed Amine Ben Nasr" className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input defaultValue="encadrant@leoni.com" disabled className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button onClick={() => toast.success("Profile updated.")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">Save Changes</button>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</h3>
          <div className="space-y-3">
            {["New submissions", "Revision responses", "Event updates", "Certificate ready"].map(item => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item}</span>
                <input type="checkbox" defaultChecked className="rounded border-border" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EncadrantSettings;
