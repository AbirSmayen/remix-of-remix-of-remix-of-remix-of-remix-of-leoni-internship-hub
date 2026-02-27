import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

const TunisianFlag = () => (
  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full overflow-hidden border border-white/10 mx-1.5 shrink-0" title="Tunisia">
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <rect width="40" height="40" fill="#E70013" />
      <circle cx="20" cy="20" r="10" fill="white" />
      <circle cx="22" cy="20" r="8" fill="#E70013" />
      <polygon points="18,14 20,18.5 24.5,18.5 21,21.5 22.5,26 18,23 13.5,26 15,21.5 11.5,18.5 16,18.5" fill="#E70013" />
    </svg>
  </span>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardRoute = user ? `/dashboard/${user.role}` : "/auth";

  const navItems = useMemo(
    () => [
      { key: "home" as const, label: t("nav.home"), href: "/" },
      { key: "about" as const, label: t("nav.about"), href: "/about" },
      { key: "contact" as const, label: t("nav.contact"), href: "/contact" },
    ],
    [t]
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">LEONI</span>
          <span className="text-xs text-muted-foreground hidden sm:flex items-center">
            we love <TunisianFlag /> we care
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.key}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardRoute}
                className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm"
              >
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                to="/auth"
                className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm"
              >
                {t("nav.getStarted")}
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card/95 backdrop-blur px-6 py-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
