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

export function StatusPill({
  status,
}: {
  status: "Pending" | "Interview" | "Rejected" | "Accepted";
}) {
  const styles: Record<typeof status, string> = {
    Pending: "bg-secondary text-muted-foreground border-border",
    Interview: "bg-primary/10 text-primary border-primary/30",
    Rejected: "bg-destructive/10 text-destructive border-destructive/30",
    Accepted: "bg-success/10 text-success border-success/30",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${styles[status]}`}
    >
      {status}
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

