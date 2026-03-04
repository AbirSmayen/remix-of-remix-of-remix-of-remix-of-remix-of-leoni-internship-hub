import { Users, UserCheck, Trophy, Star, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statCards = [
  { key: "total", label: "Total Interns", icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  { key: "active", label: "Active Interns", icon: UserCheck, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  { key: "completed", label: "Completed Internships", icon: Trophy, color: "text-leoni-purple", bg: "bg-leoni-purple/10", border: "border-leoni-purple/20" },
  { key: "best", label: "Best Projects Recommended", icon: Star, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
];

const EncadrantDashboard = () => {
  const { user } = useAuth();
  const { getInternsBySupervisor } = useMockInternshipStore();
  const supervisorName = user?.name || "Mohamed Amine Ben Nasr";
  const department = user?.department || "IT / Digital";
  const myInterns = getInternsBySupervisor(supervisorName, department);

  const total = myInterns.length;
  const active = myInterns.filter((i) => i.internshipStatus !== "internship_validated").length;
  const completed = myInterns.filter((i) => i.internshipStatus === "internship_validated").length;
  const bestRecommended = myInterns.filter((i) => i.recommendedBySupervisor).length;

  const values = { total, active, completed, best: bestRecommended };

  return (
    <DashboardLayout role="encadrant">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span className="w-1 h-7 bg-primary rounded-full" />
            Supervisor Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your interns — manage details, evaluations, and recommendations in My Interns.
          </p>
        </motion.div>

        {/* Top statistics cards — balanced grid, clean spacing, subtle shadows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl border bg-card p-5 ${card.border}`}
              style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</p>
                  <p className={`text-2xl font-bold mt-1.5 tabular-nums ${card.color}`}>{values[card.key as keyof typeof values]}</p>
                </div>
                <div className={`p-3 rounded-xl shrink-0 ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA to My Interns — modern card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border shadow-sm p-6"
          style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)" }}
        >
          <h2 className="text-lg font-semibold text-foreground">My Interns</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View the list, evaluate interns, and add them to Best Projects from the My Interns page.
          </p>
          <Link to="/dashboard/encadrant/interns" className="inline-block mt-4">
            <Button className="gap-2 shadow-sm">
              <Users className="h-4 w-4" /> View My Interns <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default EncadrantDashboard;
