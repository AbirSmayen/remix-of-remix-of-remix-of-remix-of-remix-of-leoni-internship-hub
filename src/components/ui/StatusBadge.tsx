import { statusColors } from "@/data/mockData";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colors = statusColors[status] || { bg: "bg-muted", text: "text-muted-foreground" };
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${colors.bg} ${colors.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colors.text} bg-current opacity-70`} />
      {label}
    </span>
  );
};

export default StatusBadge;
