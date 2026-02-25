import { useState } from "react";
import { Bell, X, FileText, CheckCircle, Calendar, Award, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const mockNotifications = [
    { id: "1", type: "submission", title: t("notifications.newSubmission"), message: "Smayen Abir submitted Week 3 report", time: "2 min ago", read: false, icon: FileText },
    { id: "2", type: "revision", title: t("notifications.revisionRequested"), message: "Your Week 3 submission needs corrections", time: "1 hour ago", read: false, icon: AlertCircle },
    { id: "3", type: "validated", title: t("notifications.internshipValidated"), message: "Fatma Trabelsi's internship has been completed", time: "3 hours ago", read: true, icon: CheckCircle },
    { id: "4", type: "event", title: t("notifications.newEvent"), message: "Team Building - March 15, 2026", time: "1 day ago", read: true, icon: Calendar },
    { id: "5", type: "certificate", title: t("notifications.certificateReady"), message: "Your attestation de stage is ready for download", time: "2 days ago", read: true, icon: Award },
  ];

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="absolute right-0 top-12 w-80 bg-card rounded-xl border shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-foreground text-sm">{t("notifications.title")}</h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-secondary"><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}>
                    <div className="flex gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${!n.read ? "bg-primary/10" : "bg-secondary"}`}>
                        <n.icon className={`h-4 w-4 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t text-center">
                <button className="text-xs text-primary font-medium hover:underline">{t("notifications.markAllRead")}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
