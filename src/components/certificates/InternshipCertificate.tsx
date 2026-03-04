import type { InternMock } from "@/types/internship";
import { useEffect, useMemo, useRef, useState } from "react";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const safe = (v?: string) => (v && v.trim().length ? v : "—");

export default function InternshipCertificate({ intern }: { intern: InternMock }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // Base A4 @ 96dpi-ish for consistent on-screen rendering (scaled down to fit).
  const SHEET_W = 794;
  const SHEET_H = 1123;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      if (!w) return;
      setScale(Math.min(1, w / SHEET_W));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const issuedOn = useMemo(
    () => new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
    []
  );

  const idNumber = intern.cin || intern.matricule;

  return (
    <div ref={wrapRef} className="w-full max-w-full overflow-hidden">
      {/* Wrapper is sized to scaled A4 to avoid overflow/dead space */}
      <div
        className="mx-auto"
        style={{
          width: `${Math.round(SHEET_W * scale)}px`,
          height: `${Math.round(SHEET_H * scale)}px`,
          maxWidth: "100%",
        }}
      >
        <div
          className="certificate-sheet bg-white text-black overflow-hidden"
          style={{
            width: `${SHEET_W}px`,
            height: `${SHEET_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            boxShadow: "0 14px 46px -26px rgba(15,23,42,0.38)",
          }}
        >
          {/* Decorative border (brand colors) */}
          <div className="pointer-events-none absolute inset-0 border-[2px] border-[hsl(var(--primary)/0.45)]" />
          <div className="pointer-events-none absolute inset-[10px] border border-[hsl(var(--primary)/0.18)]" />

          {/* Subtle corner accent */}
          <div
            className="pointer-events-none absolute right-0 bottom-0"
            style={{
              width: "52%",
              height: "26%",
              background:
                "linear-gradient(135deg, transparent 0%, transparent 45%, hsl(var(--primary) / 0.10) 72%, hsl(var(--leoni-purple) / 0.10) 100%)",
              clipPath: "polygon(25% 55%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />

          {/* Content */}
          <div className="relative h-full px-[64px] pt-[54px] pb-[44px]">
            {/* Header (logo top-left like reference) */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src="/leoni-logo.svg" alt="LEONI" className="h-10 w-auto" />
                <div>
                  <p className="text-[12px] font-semibold tracking-wide text-black/75">LEONI</p>
                  <p className="text-[11px] tracking-[0.22em] font-semibold text-black/45">
                    WIRING SYSTEMS TUNISIA
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-black/55">N°: {safe(intern.matricule)}</p>
              </div>
            </div>

            {/* Title */}
            <div className="mt-[72px] text-center">
              <h1
                className="text-[22px] font-bold tracking-[0.08em] uppercase text-black"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                ATTESTATION DE STAGE
              </h1>
              <div className="mt-3 mx-auto h-px w-[260px] bg-[hsl(var(--primary)/0.35)]" />
            </div>

            {/* Body (paragraph-based like reference) */}
            <div className="mt-[42px] mx-auto max-w-[560px] text-[13px] leading-[1.9] text-black/80">
              <p className="text-justify">
                Nous soussignés, la société <span className="font-semibold text-black">LEONI</span>, attestons par la
                présente que :
              </p>

              <p className="mt-5 text-justify">
                <span className="font-semibold text-black">{safe(intern.name)}</span>{" "}
                {idNumber ? (
                  <>
                    ayant pour identifiant <span className="font-semibold text-black">{safe(idNumber)}</span>,{" "}
                  </>
                ) : null}
                a effectué un stage au sein du département{" "}
                <span className="font-semibold text-black">{safe(intern.department)}</span>, sous l’encadrement de{" "}
                <span className="font-semibold text-black">{safe(intern.supervisor)}</span>, portant sur le sujet{" "}
                <span className="font-semibold text-black">« {safe(intern.subject)} »</span>, durant la période du{" "}
                <span className="font-semibold text-black">{formatDate(intern.startDate)}</span> au{" "}
                <span className="font-semibold text-black">{formatDate(intern.endDate)}</span>.
              </p>

              <p className="mt-5 text-justify">
                La présente attestation est délivrée à l’intéressé(e) pour servir et valoir ce que de droit.
              </p>
            </div>

            {/* Date + signature block (right-aligned like reference) */}
            <div className="mt-[56px] mx-auto max-w-[560px] flex justify-end">
              <div className="text-right text-[12px] text-black/70">
                <p>Fait à Tunis le {issuedOn}.</p>
                <p className="mt-3 font-medium text-black/80">Le / La responsable</p>
                <div className="mt-[62px] w-[240px] border-t border-black/35 pt-2">
                  <p className="text-[12px] font-semibold text-black">{safe(intern.supervisor)}</p>
                  <p className="text-[11px] text-black/55">Encadrant / Supervisor</p>
                </div>
              </div>
            </div>

            {/* Optional stamp area */}
            <div className="absolute right-[64px] bottom-[94px]">
              <div className="h-[92px] w-[170px] rounded-xl border border-dashed border-black/20 bg-white/70 flex items-center justify-center">
                <span className="text-[10px] tracking-widest font-semibold text-black/35 uppercase">Cachet</span>
              </div>
            </div>

            {/* Footer (subtle band like reference) */}
            <div className="absolute left-0 right-0 bottom-0">
              <div
                className="h-[56px]"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(var(--primary) / 0.10) 0%, hsl(var(--leoni-purple) / 0.10) 55%, transparent 100%)",
                }}
              />
              <div className="px-[64px] pb-[18px] pt-3 text-[10px] text-black/45 flex items-center justify-between">
                <span>LEONI Wiring Systems Tunisia</span>
                <span>Document généré automatiquement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print helpers */}
      <style>{`
        @media print {
          .certificate-sheet {
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

