import { Settings, User, Bell, Shield } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

const RHSettings = () => {
  return (
    <DashboardLayout role="rh">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input defaultValue="Admin RH" className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input defaultValue="rh@leoni.com" className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" disabled />
            </div>
            <button onClick={() => toast.success("Profile updated.")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">Save Changes</button>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</h3>
          <div className="space-y-3">
            {["New applications", "Submission reviews", "Event confirmations", "Internship completions"].map(item => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item}</span>
                <input type="checkbox" defaultChecked className="rounded border-border" />
              </label>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
              <input type="password" className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
              <input type="password" className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
            </div>
          </div>
          <button onClick={() => toast.success("Password updated.")} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">Update Password</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RHSettings;
