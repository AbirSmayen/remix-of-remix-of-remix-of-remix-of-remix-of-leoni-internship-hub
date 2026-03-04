import { Download } from "lucide-react";

export function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2.5 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <option value="all">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

const statusStyles: Record<string, string> = {
  Pending: "bg-warning/10 text-warning border-warning/30",
  pending: "bg-warning/10 text-warning border-warning/30",
  Interview: "bg-primary/10 text-primary border-primary/30",
  "Technical Interview": "bg-primary/10 text-primary border-primary/30",
  pending_technical_interview: "bg-primary/10 text-primary border-primary/30",
  Rejected: "bg-destructive/10 text-destructive border-destructive/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  Accepted: "bg-success/10 text-success border-success/30",
  accepted: "bg-success/10 text-success border-success/30",
};

const statusLabels: Record<string, string> = {
  Pending: "Pending",
  pending: "Pending",
  Interview: "Technical Interview",
  "Technical Interview": "Technical Interview",
  pending_technical_interview: "Technical Interview",
  Rejected: "Rejected",
  rejected: "Rejected",
  Accepted: "Accepted",
  accepted: "Accepted",
};

export function StatusPill({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-secondary text-muted-foreground border-border";
  const label = statusLabels[status] || status;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${style}`}
    >
      {label}
    </span>
  );
}

export function CvButton({
  href,
  label = "CV",
}: {
  href: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-secondary/40 transition-colors"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}

