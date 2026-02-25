import { Award, Download, Lock, Clock } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns } from "@/data/mockData";
import { useState, useRef } from "react";
import { toast } from "sonner";

const intern = mockInterns[1];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
};

const calcDuration = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const months = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth();
  return months <= 1 ? "1 mois" : `${months} mois`;
};

const StagiaireCertificate = () => {
  // In real app, this comes from backend based on intern.validated
  const [isValidated] = useState(intern.validated);
  const certRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const handleDownloadPDF = () => {
    if (!isValidated) {
      toast.error("Certificate not available until final validation.");
      return;
    }
    if (!certRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) { toast.error("Please allow popups to download the certificate."); return; }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Attestation de Stage - ${intern.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; padding: 40px; color: #1a1a2e; }
        @media print { body { padding: 20px; } @page { margin: 15mm; size: A4; } }
        .cert { max-width: 800px; margin: 0 auto; border: 3px solid #1a365d; padding: 48px; position: relative; }
        .cert::before { content: ''; position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px; border: 1px solid #3182ce; pointer-events: none; }
        .header { text-align: center; margin-bottom: 36px; border-bottom: 2px solid #1a365d; padding-bottom: 24px; }
        .logo-text { font-size: 28px; font-weight: 800; color: #1a365d; letter-spacing: 6px; }
        .subtitle { font-size: 11px; color: #666; letter-spacing: 2px; margin-top: 4px; }
        .title { font-size: 22px; font-weight: 700; color: #1a365d; text-align: center; margin: 28px 0 12px; letter-spacing: 3px; }
        .year { text-align: center; font-size: 14px; color: #555; margin-bottom: 28px; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 12px; font-weight: 600; color: #1a365d; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        .field-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dotted #e2e8f0; }
        .field-label { color: #666; }
        .field-value { font-weight: 500; color: #1a1a2e; }
        .body-text { font-size: 13px; line-height: 1.8; color: #333; text-align: justify; margin: 20px 0; }
        .signatures { display: flex; justify-content: space-between; margin-top: 48px; }
        .sig-block { text-align: center; width: 45%; }
        .sig-label { font-size: 11px; color: #666; margin-bottom: 60px; }
        .sig-line { border-top: 1px solid #333; padding-top: 8px; font-size: 12px; font-weight: 600; }
        .footer { text-align: center; margin-top: 36px; font-size: 10px; color: #999; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      </style></head><body>
      <div class="cert">
        <div class="header">
          <div class="logo-text">LEONI</div>
          <div class="subtitle">WIRING SYSTEMS TUNISIA</div>
        </div>
        <div class="title">ATTESTATION DE STAGE</div>
        <div class="year">Année Universitaire 2025 / 2026</div>
        
        <div class="section">
          <div class="section-title">Entreprise</div>
          <div class="field-row"><span class="field-label">Raison Sociale</span><span class="field-value">LEONI Wiring Systems Tunisia</span></div>
          <div class="field-row"><span class="field-label">Adresse</span><span class="field-value">Zone Industrielle, Sousse, Tunisie</span></div>
          <div class="field-row"><span class="field-label">Responsable</span><span class="field-value">${intern.supervisor}</span></div>
        </div>
        
        <p class="body-text">
          Je soussigné(e), <strong>${intern.supervisor}</strong>, en qualité d'encadrant(e) au sein de la société <strong>LEONI Wiring Systems Tunisia</strong>, certifie que :
        </p>

        <div class="section">
          <div class="section-title">Le / La Stagiaire</div>
          <div class="field-row"><span class="field-label">Nom & Prénom</span><span class="field-value">${intern.name}</span></div>
          <div class="field-row"><span class="field-label">Établissement</span><span class="field-value">${intern.university}</span></div>
          <div class="field-row"><span class="field-label">Niveau d'études</span><span class="field-value">${intern.degree}</span></div>
          <div class="field-row"><span class="field-label">Matricule</span><span class="field-value">${intern.matricule}</span></div>
        </div>

        <p class="body-text">
          A effectué un stage de type <strong>${intern.type}</strong> au sein du département <strong>${intern.department}</strong>, portant sur le sujet :
          « <strong>${intern.subject}</strong> ».
        </p>

        <div class="section">
          <div class="section-title">Durée du Stage</div>
          <div class="field-row"><span class="field-label">Date de début</span><span class="field-value">${formatDate(intern.startDate)}</span></div>
          <div class="field-row"><span class="field-label">Date de fin</span><span class="field-value">${formatDate(intern.endDate)}</span></div>
          <div class="field-row"><span class="field-label">Durée totale</span><span class="field-value">${calcDuration(intern.startDate, intern.endDate)}</span></div>
        </div>

        <p class="body-text">
          La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
        </p>

        <div class="signatures">
          <div class="sig-block">
            <div class="sig-label">L'Encadrant(e)</div>
            <div class="sig-line">${intern.supervisor}</div>
          </div>
          <div class="sig-block">
            <div class="sig-label">Signature & Cachet de l'Entreprise</div>
            <div class="sig-line">Direction RH — LEONI</div>
          </div>
        </div>

        <div class="footer">
          Fait à Sousse, le ${today} — LEONI Wiring Systems Tunisia — Document généré automatiquement
        </div>
      </div>
      <script>window.onload = () => { window.print(); }</script>
      </body></html>
    `);
    printWindow.document.close();
    toast.success("Certificate opened for printing/download.");
  };

  return (
    <DashboardLayout role="stagiaire">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Attestation de Stage</h1>
        <p className="text-muted-foreground text-sm mt-1">View and download your internship certificate.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Certificate Preview — always visible, blurred if not validated */}
        <div className="relative">
          <div
            ref={certRef}
            className={`bg-card rounded-xl border shadow-sm overflow-hidden transition-all duration-500 ${
              !isValidated ? "blur-[6px] select-none pointer-events-none" : ""
            }`}
          >
            {/* Header */}
            <div className="bg-primary/5 border-b px-8 py-6 text-center">
              <h2 className="text-2xl font-extrabold text-primary tracking-[6px]">LEONI</h2>
              <p className="text-[10px] text-muted-foreground tracking-[2px] mt-1">WIRING SYSTEMS TUNISIA</p>
            </div>
            
            <div className="p-8">
              <h3 className="text-xl font-bold text-foreground text-center tracking-[3px] mb-1">ATTESTATION DE STAGE</h3>
              <p className="text-center text-sm text-muted-foreground mb-8">Année Universitaire 2025 / 2026</p>
              
              {/* Company Section */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 border-b border-border pb-2">Entreprise</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Raison Sociale</span><span className="font-medium text-foreground">LEONI Wiring Systems Tunisia</span></div>
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Adresse</span><span className="font-medium text-foreground">Zone Industrielle, Sousse</span></div>
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Encadrant</span><span className="font-medium text-foreground">{intern.supervisor}</span></div>
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-6">
                Je soussigné(e), <strong>{intern.supervisor}</strong>, en qualité d'encadrant(e) au sein de la société <strong>LEONI Wiring Systems Tunisia</strong>, certifie que :
              </p>

              {/* Intern Section */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 border-b border-border pb-2">Le / La Stagiaire</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Nom & Prénom</span><span className="font-medium text-foreground">{intern.name}</span></div>
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Établissement</span><span className="font-medium text-foreground">{intern.university}</span></div>
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Niveau d'études</span><span className="font-medium text-foreground">{intern.degree}</span></div>
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Matricule</span><span className="font-medium text-foreground">{intern.matricule}</span></div>
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-6">
                A effectué un stage de type <strong>{intern.type}</strong> au sein du département <strong>{intern.department}</strong>, portant sur le sujet : « <strong>{intern.subject}</strong> ».
              </p>

              {/* Duration Section */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 border-b border-border pb-2">Durée du Stage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Date de début</span><span className="font-medium text-foreground">{formatDate(intern.startDate)}</span></div>
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Date de fin</span><span className="font-medium text-foreground">{formatDate(intern.endDate)}</span></div>
                  <div className="flex justify-between py-1 border-b border-dashed border-border"><span className="text-muted-foreground">Durée totale</span><span className="font-medium text-foreground">{calcDuration(intern.startDate, intern.endDate)}</span></div>
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-8">
                La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.
              </p>

              {/* Signatures */}
              <div className="flex justify-between mt-10">
                <div className="text-center w-[45%]">
                  <p className="text-xs text-muted-foreground mb-16">L'Encadrant(e)</p>
                  <div className="border-t border-foreground pt-2 text-sm font-semibold text-foreground">{intern.supervisor}</div>
                </div>
                <div className="text-center w-[45%]">
                  <p className="text-xs text-muted-foreground mb-16">Signature & Cachet</p>
                  <div className="border-t border-foreground pt-2 text-sm font-semibold text-foreground">Direction RH — LEONI</div>
                </div>
              </div>

              <div className="text-center mt-8 pt-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground">Fait à Sousse, le {today} — LEONI Wiring Systems Tunisia — Document généré automatiquement</p>
              </div>
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

        {/* Download Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownloadPDF}
            disabled={!isValidated}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              isValidated
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isValidated ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isValidated ? "Download PDF" : "Téléchargement non disponible"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StagiaireCertificate;
