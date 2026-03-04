import { Download, Lock, Printer } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns } from "@/data/mockData";
import { useState, useRef } from "react";
import { toast } from "sonner";
import InternshipCertificate from "@/components/certificates/InternshipCertificate";

const intern = mockInterns[1];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
};

const safe = (v?: string) => (v && v.trim().length ? v : "—");

const StagiaireCertificate = () => {
  // In real app, this comes from backend based on intern.validated
  const [isValidated] = useState(intern.validated);
  const certRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const openPrintWindow = (intent: "download" | "print") => {
    if (!isValidated) {
      toast.error("Certificate not available until final validation.");
      return;
    }
    if (!certRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) { toast.error("Please allow popups to download the certificate."); return; }
    
    const idNumber = (intern as any).cin || intern.matricule;
    const logoUrl = `${window.location.origin}/leoni-logo.svg`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Attestation de Stage - ${intern.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --primary: 220 70% 35%; --secondary: 252 56% 57%; }
        body { font-family: 'Poppins', sans-serif; padding: 0; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #f8fafc; }
        @page { margin: 12mm; size: A4; }
        @media print { body { background: #ffffff; } }

        .page-wrap { padding: 18px; display: flex; justify-content: center; }
        .sheet {
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          border: 2px solid hsl(var(--primary) / 0.45);
        }
        .sheet::before { content: ''; position: absolute; inset: 10px; border: 1px solid hsl(var(--primary) / 0.18); pointer-events: none; }
        .corner {
          position: absolute; right: 0; bottom: 0; width: 52%; height: 26%;
          background: linear-gradient(135deg, transparent 0%, transparent 45%, hsl(var(--primary) / 0.10) 72%, hsl(var(--secondary) / 0.10) 100%);
          clip-path: polygon(25% 55%, 100% 0%, 100% 100%, 0% 100%);
          pointer-events: none;
        }
        .content { padding: 18mm 18mm 16mm; position: relative; }

        .top { display: flex; align-items: flex-start; justify-content: space-between; }
        .brand { display: flex; gap: 10px; align-items: center; }
        .brand img { height: 34px; width: auto; }
        .brand .name { font-weight: 700; font-size: 12px; letter-spacing: .02em; }
        .brand .sub { font-weight: 700; font-size: 10px; letter-spacing: .22em; color: rgba(15,23,42,0.45); }
        .meta { font-size: 10px; color: rgba(15,23,42,0.55); text-align: right; }

        .title-wrap { margin-top: 24mm; text-align: center; }
        .title { font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
        .rule { margin: 10px auto 0; height: 1px; width: 260px; background: hsl(var(--primary) / 0.35); }

        .body { margin: 14mm auto 0; max-width: 150mm; font-size: 13px; line-height: 1.9; color: rgba(15,23,42,0.80); }
        .b { font-weight: 700; color: rgba(15,23,42,0.95); }
        .p { text-align: justify; }
        .mt { margin-top: 14px; }

        .sign { margin: 18mm auto 0; max-width: 150mm; display: flex; justify-content: flex-end; }
        .sign .block { text-align: right; font-size: 12px; color: rgba(15,23,42,0.70); }
        .sign .line { margin-top: 22mm; width: 240px; border-top: 1px solid rgba(15,23,42,0.35); padding-top: 8px; }
        .sign .who { font-weight: 700; color: rgba(15,23,42,0.95); }
        .sign .role { font-size: 11px; color: rgba(15,23,42,0.55); margin-top: 2px; }

        .stamp { position: absolute; right: 18mm; bottom: 24mm; height: 32mm; width: 58mm; border-radius: 10px; border: 1px dashed rgba(15,23,42,0.18); background: rgba(255,255,255,0.75); display: flex; align-items: center; justify-content: center; }
        .stamp span { font-size: 10px; letter-spacing: .22em; font-weight: 700; color: rgba(15,23,42,0.30); text-transform: uppercase; }

        .footer-band { position: absolute; left: 0; right: 0; bottom: 0; height: 18mm; background: linear-gradient(90deg, hsl(var(--primary) / 0.10) 0%, hsl(var(--secondary) / 0.10) 55%, transparent 100%); }
        .footer { position: absolute; left: 18mm; right: 18mm; bottom: 6mm; display: flex; justify-content: space-between; font-size: 10px; color: rgba(15,23,42,0.45); }
      </style></head><body>
      <div class="page-wrap">
        <div class="sheet">
          <div class="corner"></div>
          <div class="content">
            <div class="top">
              <div class="brand">
                <img src="${logoUrl}" alt="LEONI" />
                <div>
                  <div class="name">LEONI</div>
                  <div class="sub">WIRING SYSTEMS TUNISIA</div>
                </div>
              </div>
              <div class="meta">N°: ${intern.matricule || "—"}</div>
            </div>

            <div class="title-wrap">
              <div class="title">ATTESTATION DE STAGE</div>
              <div class="rule"></div>
            </div>

            <div class="body">
              <div class="p">Nous soussignés, la société <span class="b">LEONI</span>, attestons par la présente que :</div>
              <div class="p mt">
                <span class="b">${intern.name}</span>
                ${idNumber ? ` ayant pour identifiant <span class="b">${idNumber}</span>,` : ``}
                a effectué un stage au sein du département <span class="b">${intern.department}</span>,
                sous l’encadrement de <span class="b">${intern.supervisor}</span>,
                portant sur le sujet <span class="b">« ${intern.subject} »</span>,
                durant la période du <span class="b">${formatDate(intern.startDate)}</span> au <span class="b">${formatDate(intern.endDate)}</span>.
              </div>
              <div class="p mt">La présente attestation est délivrée à l’intéressé(e) pour servir et valoir ce que de droit.</div>
            </div>

            <div class="sign">
              <div class="block">
                <div>Fait à Tunis le ${today}.</div>
                <div style="margin-top:10px; font-weight:600; color: rgba(15,23,42,0.80);">Le / La responsable</div>
                <div class="line">
                  <div class="who">${intern.supervisor}</div>
                  <div class="role">Encadrant / Supervisor</div>
                </div>
              </div>
            </div>

            <div class="stamp"><span>Cachet</span></div>
          </div>
          <div class="footer-band"></div>
          <div class="footer">
            <span>LEONI Wiring Systems Tunisia</span>
            <span>Document généré automatiquement</span>
          </div>
        </div>
      </div>
      <script>window.onload = () => { window.print(); }</script>
      </body></html>
    `);
    printWindow.document.close();
    toast.success(intent === "download" ? "Print dialog opened. Choose “Save as PDF”." : "Print dialog opened.");
  };

  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Attestation de Stage</h1>
        <p className="text-muted-foreground text-sm mt-1">View and download your internship certificate.</p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Certificate Preview — always visible, blurred if not validated */}
        <div className="relative">
          <div
            ref={certRef}
            className={`bg-card rounded-xl border shadow-sm overflow-hidden transition-all duration-500 ${
              !isValidated ? "blur-[6px] select-none pointer-events-none" : ""
            }`}
          >
            <div className="p-4 sm:p-6">
              <InternshipCertificate intern={intern as any} />
            </div>
          </div>

          {/* Blur overlay when not validated */}
          {!isValidated && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-xl backdrop-blur-[2px]">
              <div className="bg-card border rounded-xl shadow-lg p-8 text-center max-w-sm mx-4">
                <Lock className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Attestation Non Disponible</h3>
                <p className="text-sm text-muted-foreground">
                  Disponible uniquement après validation finale du stage
                </p>
                <div className="mt-4 bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Progrès</span><span className="font-medium text-foreground">{intern.progress}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Statut</span><span className="font-medium text-warning">En attente de validation</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => openPrintWindow("download")}
            disabled={!isValidated}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              isValidated
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isValidated ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isValidated ? "Download PDF" : "Téléchargement non disponible"}
          </button>

          <button
            onClick={() => openPrintWindow("print")}
            disabled={!isValidated}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
              isValidated
                ? "bg-transparent border-2 border-border text-foreground hover:bg-muted/50"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isValidated ? <Printer className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            Print Certificate
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StagiaireCertificate;
