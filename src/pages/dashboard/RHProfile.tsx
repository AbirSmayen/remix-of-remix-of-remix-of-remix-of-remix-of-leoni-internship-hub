import {
  User,
  Mail,
  Edit,
  Save,
  KeyRound,
  MapPin,
  Phone,
  Briefcase,
  Shield,
  Activity,
  BookOpen,
  UserCheck,
  Award,
  BadgeCheck,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

// Mock extended profile data (frontend only)
const mockProfile = {
  site: "LEONI Tunisia - El Ghazala",
  phone: "+216 71 123 456",
  address: "Technopole El Ghazala, 2083 Ariana, Tunisia",
  employeeId: "LEO-RH-2024-001",
  lastLogin: "Mar 2, 2025 at 14:32",
  accountStatus: "Active",
  passwordUpdated: "Jan 15, 2025",
  activity: {
    subjectsCreated: 24,
    internsAccepted: 18,
    certificatesGenerated: 12,
    badgesGenerated: 8,
  },
};

const RHProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "Admin RH",
    email: user?.email || "rh@leoni.com",
    phone: mockProfile.phone,
    address: mockProfile.address,
    department: "Human Resources",
    role: "RH Manager",
    site: mockProfile.site,
  });

  const handleSave = () => {
    setEditing(false);
    toast.success("Profile updated successfully.");
  };

  const initials = form.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "RH";

  return (
    <DashboardLayout role="rh">
      {/* ——— 1. Profile header banner ——— */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8"
        style={{
          background: "linear-gradient(135deg, hsl(220 70% 35% / 0.12) 0%, hsl(199 89% 48% / 0.08) 50%, hsl(220 20% 97%) 100%)",
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)",
        }}
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Profile</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1.5 max-w-xl">
            Manage your personal and professional information.
          </p>
        </div>
      </div>

      {/* ——— 2. Two-column layout ——— */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* ——— LEFT: Profile summary card ——— */}
        <div className="lg:col-span-1 transition-all duration-300 ease-out hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.25)] dark:hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.4)]">
          <div className="card-elevated p-6 sm:p-8 h-full flex flex-col rounded-2xl border border-border/80">
            <div className="flex flex-col items-center text-center">
              {/* Avatar with online indicator */}
              <div className="relative mb-5">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-primary text-2xl font-bold shrink-0 border-4 border-primary/20 bg-primary/10"
                  style={{ boxShadow: "0 4px 14px hsl(var(--primary) / 0.25)" }}
                >
                  {initials}
                </div>
                <span
                  className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-success border-2 border-card"
                  title="Online"
                />
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">{form.name}</h2>
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
                {form.role}
              </span>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
                  {form.department}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
                  {mockProfile.site.split(" - ")[0]}
                </span>
              </div>
              <div className="mt-5 w-full space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-primary/70" />
                  <span className="truncate">{form.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                  <span>{mockProfile.phone}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setEditing(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
              >
                <Edit className="h-4 w-4" /> Edit Profile
              </button>
              <button
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-transparent border-2 border-border text-foreground rounded-xl text-sm font-semibold hover:bg-muted/50 transition-all"
              >
                <KeyRound className="h-4 w-4" /> Change Password
              </button>
            </div>
          </div>
        </div>

        {/* ——— RIGHT: Detailed information cards ——— */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit profile modal / inline overlay */}
          {editing && (
            <div
              className="card-elevated rounded-2xl p-6 border border-primary/20 bg-card"
              style={{ animation: "fadeIn 0.25s ease-out" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Edit profile</h3>
                <button
                  onClick={() => setEditing(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Department</label>
                  <input
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Save className="h-4 w-4" /> Save changes
                </button>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="card-elevated rounded-2xl overflow-hidden border border-border/80">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Personal Information</h3>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <InfoRow label="Full Name" value={form.name} />
              <div className="h-px bg-border/60" />
              <InfoRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value={form.email} />
              <div className="h-px bg-border/60" />
              <InfoRow icon={<Phone className="h-4 w-4 text-muted-foreground" />} label="Phone" value={mockProfile.phone} />
              <div className="h-px bg-border/60" />
              <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="Address" value={mockProfile.address} />
            </div>
          </div>

          {/* Professional Information */}
          <div className="card-elevated rounded-2xl overflow-hidden border border-border/80">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Professional Information</h3>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <InfoRow label="Role" value={form.role} />
              <div className="h-px bg-border/60" />
              <InfoRow label="Department" value={form.department} />
              <div className="h-px bg-border/60" />
              <InfoRow label="Site" value={mockProfile.site} />
              <div className="h-px bg-border/60" />
              <InfoRow label="Employee ID" value={mockProfile.employeeId} />
            </div>
          </div>

          {/* Security Settings */}
          <div className="card-elevated rounded-2xl overflow-hidden border border-border/80">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Security</h3>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <InfoRow label="Last login" value={mockProfile.lastLogin} />
              <div className="h-px bg-border/60" />
              <InfoRow label="Account status" value={mockProfile.accountStatus} valueBadge="success" />
              <div className="h-px bg-border/60" />
              <InfoRow label="Password last updated" value={mockProfile.passwordUpdated} />
            </div>
          </div>

          {/* Activity Overview */}
          <div className="card-elevated rounded-2xl overflow-hidden border border-border/80">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Activity Overview</h3>
            </div>
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MiniStatCard
                  icon={<BookOpen className="h-5 w-5" />}
                  label="Subjects Created"
                  value={mockProfile.activity.subjectsCreated}
                />
                <MiniStatCard
                  icon={<UserCheck className="h-5 w-5" />}
                  label="Interns Accepted"
                  value={mockProfile.activity.internsAccepted}
                />
                <MiniStatCard
                  icon={<Award className="h-5 w-5" />}
                  label="Certificates Generated"
                  value={mockProfile.activity.certificatesGenerated}
                />
                <MiniStatCard
                  icon={<BadgeCheck className="h-5 w-5" />}
                  label="Badges Generated"
                  value={mockProfile.activity.badgesGenerated}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardLayout>
  );
};

function InfoRow({
  icon,
  label,
  value,
  valueBadge,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  valueBadge?: "success";
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground text-right shrink-0">
        {valueBadge === "success" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success">
            {value}
          </span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

function MiniStatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 dark:bg-muted/20 p-4 flex flex-col gap-2 transition-colors hover:bg-muted/50 dark:hover:bg-muted/30">
      <div className="text-primary">{icon}</div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-xs font-medium text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}

export default RHProfile;
