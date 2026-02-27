import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  suffix?: string;
}

const StatCard = ({ title, value, icon, color = "text-primary", suffix }: StatCardProps) => {
  const isNumeric = typeof value === "number";
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isNumeric) return;
    const duration = 1000;
    const steps = 30;
    const increment = (value as number) / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= (value as number)) {
        setCount(value as number);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, isNumeric]);

  return (
    <div className="kpi-card">
      <div className="kpi-card-bg" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {isNumeric ? count : value}
              {suffix}
            </p>
          </div>
          <div className={`shrink-0 opacity-60 ${color}`}>
            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          </div>
        </div>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-primary/20 via-border to-transparent" />
      </div>
    </div>
  );
};

export default StatCard;
