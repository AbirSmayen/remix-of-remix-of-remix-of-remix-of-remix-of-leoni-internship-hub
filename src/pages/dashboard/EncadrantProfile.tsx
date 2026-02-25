import { User, Briefcase, FileText, Shield, Download, Edit, Mail, Phone, Building, Users } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { mockInterns } from "@/data/mockData";
import { useTranslation } from "react-i18next";

const EncadrantProfile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const supervisedInterns = mockInterns.filter(i => i.supervisor === "Ben Nasr Mohamed Amine");

  const personalInfo = [
    { label: t("profile.firstName"), value: "Mohamed Amine" },
    { label: t("profile.lastName"), value: "Ben Nasr" },
    { label: t("profile.mobile"), value: "+216 98 456 789" },
    { label: t("profile.emailAddress"), value: user?.email || "encadrant@leoni.com" },
    { label: t("profile.gender"), value: t("profile.male") },
    { label: t("profile.nationality"), value: t("profile.tunisian") },
    { label: t("profile.address"), value: "45 Avenue Habib Bourguiba" },
    { label: t("profile.city"), value: "Sousse" },
  ];

  const professionalInfo = [
    { label: t("profile.department"), value: "SME" },
    { label: t("profile.position"), value: t("profile.seniorEngineer") },
    { label: t("profile.companyRole"), value: t("sidebar.encadrant") },
    { label: t("profile.activeInterns"), value: String(supervisedInterns.length) },
    { label: t("profile.totalSupervised"), value: "12" },
    { label: t("profile.yearsExperience"), value: "8" },
  ];

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t("profile.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("profile.encSubtitle")}</p>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "MA"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{user?.name || "Mohamed Amine Ben Nasr"}</h2>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                  <Building className="h-4 w-4" />
                  <span>{t("profile.seniorEngineer")} — SME</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-muted-foreground text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email || "encadrant@leoni.com"}</span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-all">
              <Edit className="h-4 w-4" />
              {t("profile.editProfile")}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-0">
          <TabsTrigger value="personal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm gap-2">
            <User className="h-4 w-4" />
            {t("profile.personalInfo")}
          </TabsTrigger>
          <TabsTrigger value="professional" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm gap-2">
            <Briefcase className="h-4 w-4" />
            {t("profile.professionalInfo")}
          </TabsTrigger>
          <TabsTrigger value="interns" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm gap-2">
            <Users className="h-4 w-4" />
            {t("profile.supervisedInterns")}
          </TabsTrigger>
          <TabsTrigger value="access" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm gap-2">
            <Shield className="h-4 w-4" />
            {t("profile.access")}
          </TabsTrigger>
          <TabsTrigger value="export" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm gap-2">
            <Download className="h-4 w-4" />
            {t("profile.export")}
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {personalInfo.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Information */}
        <TabsContent value="professional">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                {t("profile.companyInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {professionalInfo.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supervised Interns */}
        <TabsContent value="interns">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {t("profile.supervisedInterns")} ({supervisedInterns.length})
              </h3>
              <div className="space-y-4">
                {supervisedInterns.map((intern) => (
                  <div key={intern.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {intern.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{intern.name}</p>
                        <p className="text-xs text-muted-foreground">{intern.university} — {intern.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{intern.progress}%</p>
                      <p className="text-xs text-muted-foreground">{intern.type}</p>
                    </div>
                  </div>
                ))}
                {supervisedInterns.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">{t("profile.noInterns")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access */}
        <TabsContent value="access">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t("profile.access")}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("profile.role")}</p>
                  <p className="text-sm font-medium text-foreground">{t("sidebar.encadrant")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("profile.accountStatus")}</p>
                  <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">{t("profile.active")}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("profile.lastLogin")}</p>
                  <p className="text-sm font-medium text-foreground">2026-02-24 09:15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export */}
        <TabsContent value="export">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t("profile.exportData")}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t("profile.exportDesc")}</p>
              <div className="flex gap-3">
                <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                  {t("profile.exportPDF")}
                </button>
                <button className="px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-all">
                  {t("profile.exportCSV")}
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default EncadrantProfile;
