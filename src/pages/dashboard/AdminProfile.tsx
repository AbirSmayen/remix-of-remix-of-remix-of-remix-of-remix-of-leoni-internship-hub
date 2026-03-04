import {
  User,
  Mail,
  KeyRound,
  Phone,
  Shield,
  Activity,
  Users,
  BookOpen,
  Award,
  Trophy,
  Building2,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

// Mock admin profile data (frontend only, read-only)
const mockAdminProfile = {
  name: "Direction Générale",
  email: "admin@leoni.com",
  phone: "+216 71 000 000",
  officeLocation: "LEONI Tunisia HQ - El Ghazala",
  accountStatus: "Active",
  role: "Platform Administrator",
  accessLevel: "Full Visibility",
  permissions: "View All RH Actions",
  activity: {
    totalInterns: 142,
    totalSubjects: 68,
    totalCertificatesGenerated: 89,
    totalBestProjects: 12,
  },
};

const AdminProfile = () => {
  const { user } = useAuth();
  const displayName = user?.name || mockAdminProfile.name;
  const displayEmail = user?.email || mockAdminProfile.email;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DG";

  return (
    <DashboardLayout role="admin">
      {/* ——— 1. Profile header banner (blue gradient) ——— */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8"
        style={{
          background:
            "linear-gradient(135deg, hsl(220 70% 35% / 0.12) 0%, hsl(199 89% 48% / 0.08) 50%, hsl(220 20% 97%) 100%)",
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)",
        }}
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Profile</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1.5 max-w-xl">
            View your administrative account and platform overview. Read-only access.
          </p>
        </div>
      </div>

      {/* ——— 2. Two-column layout ——— */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* ——— LEFT: Profile summary card with blue gradient header ——— */}
        <div className="lg:col-span-1 transition-all duration-300 ease-out hover:shadow-[0_12px_40px_-16px_rgba(15,23,42,0.25)] dark:hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.4)]">
          <div className="card-elevated h-full flex flex-col rounded-2xl border border-border/80 overflow-hidden">
            {/* Blue gradient header */}
            <div
              className="h-24 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, hsl(220 70% 35% / 0.25) 0%, hsl(199 89% 48% / 0.2) 100%)",
              }}
            />
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col flex-1 -mt-12 relative">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-primary text-2xl font-bold shrink-0 border-4 border-card bg-card shadow-lg mb-5"
                  style={{ boxShadow: "0 4px 14px hsl(var(--primary) / 0.25)" }}
                >
                  {initials}
                </div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">{displayName}</h2>
                <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground border border-primary/30">
                  Direction Générale
                </span>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                    Admin
                  </span>
                </div>
                <div className="mt-4 w-full space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0 text-primary/70" />
                    <span className="truncate">{displayEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      {mockAdminProfile.accountStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                  title="Read-only account"
                >
                  <User className="h-4 w-4" /> Edit Profile (read-only)
                </button>
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-transparent border-2 border-border text-foreground rounded-xl text-sm font-semibold hover:bg-muted/50 transition-all">
                  <KeyRound className="h-4 w-4" /> Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ——— RIGHT: Detailed information cards ——— */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card-elevated rounded-2xl overflow-hidden border border-border/80 transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.2)]">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Personal Information</h3>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <AdminInfoRow label="Full Name" value={displayName} />
              <div className="h-px bg-border/60" />
              <AdminInfoRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value={displayEmail} />
              <div className="h-px bg-border/60" />
              <AdminInfoRow icon={<Phone className="h-4 w-4 text-muted-foreground" />} label="Phone" value={mockAdminProfile.phone} />
              <div className="h-px bg-border/60" />
              <AdminInfoRow icon={<Building2 className="h-4 w-4 text-muted-foreground" />} label="Office Location" value={mockAdminProfile.officeLocation} />
            </div>
          </div>

          {/* Administrative Role Information */}
          <div className="card-elevated rounded-2xl overflow-hidden border border-border/80 transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.2)]">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Administrative Role Information</h3>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <AdminInfoRow label="Role" value={mockAdminProfile.role} />
              <div className="h-px bg-border/60" />
              <AdminInfoRow label="Access Level" value={mockAdminProfile.accessLevel} />
              <div className="h-px bg-border/60" />
              <AdminInfoRow label="Permissions" value={mockAdminProfile.permissions} />
            </div>
          </div>

          {/* Platform Activity Overview */}
          <div className="card-elevated rounded-2xl overflow-hidden border border-border/80 transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.2)]">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Platform Activity Overview</h3>
            </div>
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <AdminMiniStatCard
                  icon={<Users className="h-5 w-5" />}
                  label="Total Interns"
                  value={mockAdminProfile.activity.totalInterns}
                />
                <AdminMiniStatCard
                  icon={<BookOpen className="h-5 w-5" />}
                  label="Total Subjects"
                  value={mockAdminProfile.activity.totalSubjects}
                />
                <AdminMiniStatCard
                  icon={<Award className="h-5 w-5" />}
                  label="Total Certificates Generated"
                  value={mockAdminProfile.activity.totalCertificatesGenerated}
                />
                <AdminMiniStatCard
                  icon={<Trophy className="h-5 w-5" />}
                  label="Total Best Projects"
                  value={mockAdminProfile.activity.totalBestProjects}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

function AdminInfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground text-right shrink-0">{value}</span>
    </div>
  );
}

function AdminMiniStatCard({
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

export default AdminProfile;
