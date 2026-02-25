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
    <div className="bg-card rounded-xl border p-6 hover-scale shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className={`p-2.5 rounded-lg bg-primary/5 ${color}`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-foreground">
        {isNumeric ? count : value}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
};

export default StatCard;
