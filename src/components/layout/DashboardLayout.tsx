import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, BookOpen, Users, Settings, ChevronLeft, ChevronRight, LogOut,
  GraduationCap, ClipboardList, BarChart3, MessageSquare, Award, Calendar, Bell, FileText, CreditCard, User,
  CheckCircle, Trophy, Archive, Target, Presentation, Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "rh" | "encadrant" | "stagiaire" | "director";
}

const menuItems = (t: (key: string) => string) => ({
  rh: [
    { icon: LayoutDashboard, label: t("sidebar.rh.dashboard"), to: "/dashboard/rh" },
    { icon: BookOpen, label: t("sidebar.rh.pfeBook"), to: "/dashboard/rh/pfe-book" },
    { icon: ClipboardList, label: t("sidebar.rh.applications"), to: "/dashboard/rh/applications" },
    { icon: ClipboardList, label: "Short-Term Applications", to: "/dashboard/rh/short-term-applications" },
    { icon: Users, label: t("sidebar.rh.interns"), to: "/dashboard/rh/interns" },
    { icon: Calendar, label: t("sidebar.rh.events"), to: "/dashboard/rh/events" },
    { icon: BarChart3, label: t("sidebar.rh.statistics"), to: "/dashboard/rh/statistics" },
    { icon: Trophy, label: "Best Projects", to: "/dashboard/rh/voting" },
    { icon: Archive, label: "Alumni Archive", to: "/dashboard/rh/alumni" },
    { icon: Settings, label: t("sidebar.rh.settings"), to: "/dashboard/rh/settings" },
  ],
  encadrant: [
    { icon: LayoutDashboard, label: t("sidebar.enc.dashboard"), to: "/dashboard/encadrant" },
    { icon: Users, label: t("sidebar.enc.myInterns"), to: "/dashboard/encadrant/interns" },
    { icon: Shield, label: "Authorizations", to: "/dashboard/encadrant/authorizations" },
    { icon: FileText, label: t("sidebar.enc.submissions"), to: "/dashboard/encadrant/submissions" },
    { icon: BarChart3, label: t("sidebar.enc.progress"), to: "/dashboard/encadrant/progress" },
    { icon: MessageSquare, label: t("sidebar.enc.evaluations"), to: "/dashboard/encadrant/evaluations" },
    { icon: Award, label: t("sidebar.enc.certificates"), to: "/dashboard/encadrant/certificates" },
    { icon: User, label: t("sidebar.enc.profile"), to: "/dashboard/encadrant/profile" },
  ],
  stagiaire: [
    { icon: LayoutDashboard, label: t("sidebar.stg.dashboard"), to: "/dashboard/stagiaire" },
    { icon: GraduationCap, label: t("sidebar.stg.myInternship"), to: "/dashboard/stagiaire/internship" },
    { icon: FileText, label: t("sidebar.stg.mySubmissions"), to: "/dashboard/stagiaire/submissions" },
    { icon: BarChart3, label: t("sidebar.stg.progress"), to: "/dashboard/stagiaire/progress" },
    { icon: Calendar, label: t("sidebar.stg.events"), to: "/dashboard/stagiaire/events" },
    { icon: CreditCard, label: t("sidebar.stg.myBadge"), to: "/dashboard/stagiaire/badge" },
    { icon: Award, label: t("sidebar.stg.certificate"), to: "/dashboard/stagiaire/certificate" },
    { icon: User, label: t("sidebar.stg.profile"), to: "/dashboard/stagiaire/profile" },
  ],
  director: [
    { icon: Trophy, label: "Top Projects Voting", to: "/dashboard/director/voting" },
  ],
});

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const menuRole = role;
  const items = menuItems(t)[menuRole];

  const roleLabels: Record<string, string> = {
    rh: t("sidebar.rhManager"),
    encadrant: t("sidebar.encadrant"),
    stagiaire: t("sidebar.stagiaire"),
    director: "Director",
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen text-sidebar-foreground flex flex-col transition-all duration-300 z-40 ${
          collapsed ? "w-16" : "w-64"
        }`}
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--leoni-dark)) 100%)",
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-primary">LEONI</h1>
              <p className="text-[10px] text-sidebar-foreground/50">{roleLabels[role]}</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary/20 text-sidebar-foreground shadow-[0_10px_24px_-18px_rgba(56,189,248,0.55)]"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={`absolute left-1 top-1/2 -translate-y-1/2 h-7 w-1 rounded-full transition-all ${
                    isActive ? "bg-sidebar-primary" : "bg-transparent group-hover:bg-sidebar-primary/40"
                  }`}
                />
                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors w-full"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t("nav.logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Top bar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-6 sticky top-0 z-30">
          <h2 className="text-lg font-semibold text-foreground">
            {items.find((i) => i.to === location.pathname)?.label || t("sidebar.rh.dashboard")}
          </h2>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <NotificationBell />
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "U"}
            </div>
          </div>
        </header>

        <div className="p-7 lg:p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
