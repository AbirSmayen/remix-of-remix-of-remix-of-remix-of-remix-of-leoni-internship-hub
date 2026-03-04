export function isTechnicalDepartment(department: string): boolean {
  const normalized = (department || "")
    .toLowerCase()
    .replace(/[()/\-_,.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return false;

  // Strong technical signals
  if (normalized.includes("informatique")) return true;
  if (/\bit\b/.test(normalized)) return true;

  // Software / development related signals
  const keywords = [
    "software",
    "development",
    "developer",
    "dev",
    "digital",
    "data",
    "ai",
    "ml",
    "cyber",
    "security",
    "cloud",
  ];
  return keywords.some((k) => new RegExp(`\\b${k}\\b`).test(normalized));
}

