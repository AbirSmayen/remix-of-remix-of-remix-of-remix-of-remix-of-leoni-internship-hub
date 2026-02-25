import { useState } from "react";
import { User, Briefcase, FileText, Shield, Download, Edit, Mail, Phone, MapPin, GraduationCap, Calendar, Building } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { mockInterns } from "@/data/mockData";
import { useTranslation } from "react-i18next";

const StagiaireProfile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const intern = mockInterns[1]; // Smayen Abir

  const personalInfo = [
    { label: t("profile.firstName"), value: "Abir" },
    { label: t("profile.lastName"), value: "Smayen" },
    { label: t("profile.mobile"), value: "+216 51 228 222" },
    { label: t("profile.emailAddress"), value: intern.email },
    { label: t("profile.gender"), value: t("profile.female") },
    { label: t("profile.nationality"), value: t("profile.tunisian") },
    { label: t("profile.address"), value: "22 Rue Omar Ibn Abdelaziz" },
    { label: t("profile.city"), value: "Messadine" },
    { label: t("profile.state"), value: "Sousse" },
    { label: t("profile.zipCode"), value: "4013" },
    { label: t("profile.dateOfBirth"), value: "30 Juin 2002" },
  ];

  const academicInfo = [
    { label: t("profile.university"), value: intern.university },
    { label: t("profile.field"), value: "Génie Informatique" },
    { label: t("profile.level"), value: intern.degree },
    { label: t("profile.internshipDuration"), value: "4 mois" },
    { label: t("profile.assignedProject"), value: intern.subject },
    { label: t("profile.internshipStatus"), value: "En cours" },
    { label: t("profile.supervisor"), value: intern.supervisor },
    { label: t("profile.department"), value: intern.department },
    { label: t("profile.startDate"), value: intern.startDate },
    { label: t("profile.endDate"), value: intern.endDate },
    { label: t("profile.matricule"), value: intern.matricule },
    { label: t("profile.internshipType"), value: intern.type },
  ];

  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t("profile.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("profile.stgSubtitle")}</p>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "SA"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{user?.name || "Smayen Abir"}</h2>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                  <GraduationCap className="h-4 w-4" />
                  <span>{intern.degree} — {intern.university}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-muted-foreground text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{intern.email}</span>
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
          <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm gap-2">
            <FileText className="h-4 w-4" />
            {t("profile.documents")}
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

        {/* Professional / Academic Information */}
        <TabsContent value="professional">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                {t("profile.academicInternship")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {academicInfo.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("profile.overallProgress")}</span>
                  <span className="font-semibold text-primary">{intern.progress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${intern.progress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t("profile.documents")}</h3>
              <div className="space-y-3">
                {[
                  { name: "CV_Smayen_Abir.pdf", date: "2026-02-01" },
                  { name: "Lettre_Motivation.pdf", date: "2026-02-01" },
                  { name: "Convention_Stage.pdf", date: "2026-02-10" },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.date}</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline">{t("profile.download")}</button>
                  </div>
                ))}
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
                  <p className="text-sm font-medium text-foreground">{t("sidebar.stagiaire")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("profile.accountStatus")}</p>
                  <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">{t("profile.active")}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("profile.lastLogin")}</p>
                  <p className="text-sm font-medium text-foreground">2026-02-24 08:30</p>
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

export default StagiaireProfile;
