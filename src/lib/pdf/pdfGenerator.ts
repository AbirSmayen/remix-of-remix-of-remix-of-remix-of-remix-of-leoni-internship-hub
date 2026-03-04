import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Canvg } from "canvg";
import type { PFESubjectMock, SummerProjectMock } from "@/types/internship";

type PdfDepartmentGroup<T> = {
  departmentName: string;
  projects: T[];
};

export type SummerBookProjectPdf = {
  title: string;
  description: string;
  durationLabel: string;
  requiredSkills: string[];
  supervisorName: string;
  plannedInterns: number;
};

export type SummerBookPdfData = {
  year: number;
  generatedAt: Date;
  departments: PdfDepartmentGroup<SummerBookProjectPdf>[];
};

export type PFEBookProjectPdf = {
  title: string;
  description: string;
  requiredSkills: string[];
  technicalInterviewRequired: boolean;
  internshipType: string;
  supervisorName?: string;
};

export type PFEBookPdfData = {
  year: number;
  generatedAt: Date;
  departments: PdfDepartmentGroup<PFEBookProjectPdf>[];
};

const COMPANY_NAME = "LEONI";
const LOGO_URL = "/leoni-logo.svg";

const formatDateLabel = (d: Date) =>
  d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "2-digit" });

const groupByDepartment = <T extends { department: string }>(
  items: T[]
): PdfDepartmentGroup<T>[] => {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const key = it.department || "Other";
    const prev = map.get(key) ?? [];
    prev.push(it);
    map.set(key, prev);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([departmentName, projects]) => ({
      departmentName,
      projects,
    }));
};

export function formatSummerBookData(
  summerProjects: SummerProjectMock[],
  opts?: { year?: number; generatedAt?: Date }
): SummerBookPdfData {
  const year = opts?.year ?? new Date().getFullYear();
  const generatedAt = opts?.generatedAt ?? new Date();

  const departments = groupByDepartment(summerProjects).map((d) => ({
    departmentName: d.departmentName,
    projects: d.projects
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((p): SummerBookProjectPdf => ({
        title: p.title,
        description: p.description,
        durationLabel: p.durationMonths === 1 ? "1 month" : "2 months",
        requiredSkills: p.requiredSkills ?? [],
        supervisorName: p.supervisorName,
        plannedInterns: p.estimatedInterns,
      })),
  }));

  return { year, generatedAt, departments };
}

export function formatPFEBookData(
  subjects: PFESubjectMock[],
  opts?: { year?: number; generatedAt?: Date }
): PFEBookPdfData {
  const year = opts?.year ?? new Date().getFullYear();
  const generatedAt = opts?.generatedAt ?? new Date();

  const departments = groupByDepartment(subjects).map((d) => ({
    departmentName: d.departmentName,
    projects: d.projects
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((s): PFEBookProjectPdf => ({
        title: s.title,
        description: s.description,
        requiredSkills: s.skills ?? [],
        technicalInterviewRequired: !!s.requires_technical_interview,
        internshipType: s.type ?? "PFE",
        supervisorName: s.supervisor?.trim() ? s.supervisor : undefined,
      })),
  }));

  return { year, generatedAt, departments };
}

async function loadSvgAsPngDataUrl(svgUrl: string): Promise<string | null> {
  try {
    const res = await fetch(svgUrl);
    if (!res.ok) return null;
    const svgText = await res.text();

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Render SVG onto canvas, then export as PNG data URL
    const v = await Canvg.fromString(ctx, svgText, { ignoreMouse: true, ignoreAnimation: true });
    await v.render();

    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type DocCtx = {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  marginX: number;
  marginTop: number;
  marginBottom: number;
  cursorY: number;
  headerHeight: number;
  footerHeight: number;
  primaryColor: [number, number, number];
  logoPngDataUrl: string | null;
};

function initDoc(): DocCtx {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  return {
    doc,
    pageWidth,
    pageHeight,
    marginX: 14,
    marginTop: 16,
    marginBottom: 14,
    cursorY: 0,
    headerHeight: 24,
    footerHeight: 10,
    primaryColor: [29, 78, 216], // close to tailwind blue-700
    logoPngDataUrl: null,
  };
}

function drawHeader(ctx: DocCtx, title: string, metaLines: string[]) {
  const { doc, pageWidth, marginX, marginTop, primaryColor, logoPngDataUrl } = ctx;

  const topY = marginTop;
  const logoW = 28;
  const logoH = 12;

  // Logo (top-left)
  if (logoPngDataUrl) {
    try {
      doc.addImage(logoPngDataUrl, "PNG", marginX, topY, logoW, logoH);
    } catch {
      // If addImage fails (e.g., unsupported), skip logo silently
    }
  } else {
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(COMPANY_NAME, marginX, topY + 10);
  }

  // Title centered
  doc.setTextColor(20, 23, 43);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, pageWidth / 2, topY + 8, { align: "center" });

  // Meta (year + generated date) under title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const metaY1 = topY + 14;
  metaLines.forEach((line, idx) => {
    doc.text(line, pageWidth / 2, metaY1 + idx * 5, { align: "center" });
  });

  // Separator line
  doc.setDrawColor(220, 226, 239);
  doc.setLineWidth(0.4);
  doc.line(marginX, topY + 20, pageWidth - marginX, topY + 20);

  ctx.cursorY = topY + ctx.headerHeight;
}

function ensureSpace(ctx: DocCtx, neededHeight: number, headerTitle: string, headerMeta: string[]) {
  const { doc, pageHeight, marginBottom, footerHeight } = ctx;
  const maxY = pageHeight - marginBottom - footerHeight;
  if (ctx.cursorY + neededHeight <= maxY) return;

  doc.addPage();
  drawHeader(ctx, headerTitle, headerMeta);
}

function textBlock(ctx: DocCtx, text: string, options?: { fontSize?: number; fontStyle?: "normal" | "bold"; color?: [number, number, number]; leading?: number }) {
  const { doc, pageWidth, marginX } = ctx;
  const fontSize = options?.fontSize ?? 10.5;
  const fontStyle = options?.fontStyle ?? "normal";
  const leading = options?.leading ?? 4.7;
  const color = options?.color ?? ([20, 23, 43] as [number, number, number]);

  doc.setFont("helvetica", fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);

  const maxWidth = pageWidth - marginX * 2;
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, marginX, ctx.cursorY);
  ctx.cursorY += lines.length * leading;
}

function keyValueLine(ctx: DocCtx, label: string, value: string) {
  const { doc, marginX } = ctx;
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.setFont("helvetica", "bold");
  doc.text(label, marginX, ctx.cursorY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(20, 23, 43);
  doc.text(value || "—", marginX + 36, ctx.cursorY);
  ctx.cursorY += 5;
}

function drawFooterAllPages(ctx: DocCtx) {
  const { doc, pageWidth, pageHeight, marginX, marginBottom } = ctx;
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(220, 226, 239);
    doc.setLineWidth(0.4);
    doc.line(marginX, pageHeight - marginBottom - 8, pageWidth - marginX, pageHeight - marginBottom - 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(COMPANY_NAME, marginX, pageHeight - marginBottom - 2);
    doc.text(`Page ${i} / ${pageCount}`, pageWidth - marginX, pageHeight - marginBottom - 2, { align: "right" });
  }
}

export async function generateSummerBookPdf(data: SummerBookPdfData) {
  const ctx = initDoc();
  ctx.logoPngDataUrl = await loadSvgAsPngDataUrl(LOGO_URL);

  const title = "Summer Internship Book – Short-Term Projects";
  const meta = [`Year: ${data.year}`, `Generated: ${formatDateLabel(data.generatedAt)}`];
  drawHeader(ctx, title, meta);

  const { doc, primaryColor } = ctx;

  for (const dept of data.departments) {
    // Department title
    ensureSpace(ctx, 10, title, meta);
    ctx.cursorY += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text(dept.departmentName, ctx.marginX, ctx.cursorY);
    ctx.cursorY += 7;

    for (const p of dept.projects) {
      // Estimate project block height conservatively
      ensureSpace(ctx, 42, title, meta);

      // Project title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20, 23, 43);
      doc.text(p.title, ctx.marginX, ctx.cursorY);
      ctx.cursorY += 6;

      // Description (wrapped)
      textBlock(ctx, p.description, { fontSize: 10.2, fontStyle: "normal", color: [71, 85, 105], leading: 4.6 });
      ctx.cursorY += 1;

      keyValueLine(ctx, "Duration", p.durationLabel);
      keyValueLine(ctx, "Required skills", p.requiredSkills.length ? p.requiredSkills.join(", ") : "—");
      keyValueLine(ctx, "Supervisor", p.supervisorName);
      keyValueLine(ctx, "Planned interns", String(p.plannedInterns));

      // Spacing between projects
      ctx.cursorY += 4;
      doc.setDrawColor(235, 239, 247);
      doc.setLineWidth(0.35);
      doc.line(ctx.marginX, ctx.cursorY, ctx.pageWidth - ctx.marginX, ctx.cursorY);
      ctx.cursorY += 6;
    }

    ctx.cursorY += 2;
  }

  drawFooterAllPages(ctx);
  const blob = doc.output("blob");
  const filename = `LEONI_Summer_Internship_Book_${data.year}.pdf`;
  downloadPdfBlob(blob, filename);
}

export async function generatePFEBookPdf(data: PFEBookPdfData) {
  const ctx = initDoc();
  ctx.logoPngDataUrl = await loadSvgAsPngDataUrl(LOGO_URL);

  const title = "PFE & Long-Term Internship Book";
  const meta = [`Year: ${data.year}`, `Generated: ${formatDateLabel(data.generatedAt)}`];
  drawHeader(ctx, title, meta);

  const { doc, primaryColor } = ctx;

  for (const dept of data.departments) {
    ensureSpace(ctx, 10, title, meta);
    ctx.cursorY += 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text(dept.departmentName, ctx.marginX, ctx.cursorY);
    ctx.cursorY += 7;

    for (const p of dept.projects) {
      ensureSpace(ctx, 44, title, meta);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20, 23, 43);
      doc.text(p.title, ctx.marginX, ctx.cursorY);
      ctx.cursorY += 6;

      textBlock(ctx, p.description, { fontSize: 10.2, fontStyle: "normal", color: [71, 85, 105], leading: 4.6 });
      ctx.cursorY += 1;

      keyValueLine(ctx, "Required skills", p.requiredSkills.length ? p.requiredSkills.join(", ") : "—");
      keyValueLine(ctx, "Technical interview", p.technicalInterviewRequired ? "Yes" : "No");
      keyValueLine(ctx, "Internship type", p.internshipType);
      keyValueLine(ctx, "Supervisor", p.supervisorName ?? "—");

      ctx.cursorY += 4;
      doc.setDrawColor(235, 239, 247);
      doc.setLineWidth(0.35);
      doc.line(ctx.marginX, ctx.cursorY, ctx.pageWidth - ctx.marginX, ctx.cursorY);
      ctx.cursorY += 6;
    }

    ctx.cursorY += 2;
  }

  drawFooterAllPages(ctx);
  const blob = doc.output("blob");
  const filename = `LEONI_PFE_LongTerm_Internship_Book_${data.year}.pdf`;
  downloadPdfBlob(blob, filename);
}

