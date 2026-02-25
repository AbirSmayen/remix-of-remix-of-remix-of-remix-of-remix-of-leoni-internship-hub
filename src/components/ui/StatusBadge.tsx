import { statusColors } from "@/data/mockData";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colors = statusColors[status] || { bg: "bg-muted", text: "text-muted-foreground" };
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
