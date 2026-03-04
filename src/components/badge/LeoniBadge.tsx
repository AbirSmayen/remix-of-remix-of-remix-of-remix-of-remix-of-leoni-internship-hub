/**
 * LEONI intern badge — pixel-perfect replica per reference image.
 * Light grey background, LEONI top-right, photo placeholder top-left,
 * 5 dark grey stars, "Stagiaire Externe" italic serif reddish-brown,
 * two-column label/value layout. Do NOT redesign.
 */

interface LeoniBadgeProps {
  matricule: string;
  name: string;
  department: string;
  supervisor: string;
  startDate: string;
  endDate: string;
}

const formatDateFR = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const LeoniBadge = ({
  matricule,
  name,
  department,
  supervisor,
  startDate,
  endDate,
}: LeoniBadgeProps) => {
  return (
    <div
      className="relative overflow-hidden rounded-lg w-full max-w-[420px]"
      style={{
        aspectRatio: "1.5 / 1",
        background: "#f3f7ff",
        border: "1px solid #cfe0ff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      {/* Top-left photo placeholder — ~50x30px, rounded, #d3d3d3 */}
      <div
        className="absolute left-4 top-4 rounded"
        style={{
          width: "50px",
          height: "30px",
          background: "#d3d3d3",
        }}
      />

      {/* LEONI — top-right, bold uppercase sans-serif, #333333 */}
      <div className="absolute right-4 top-4 text-right">
        <span
          style={{
            fontFamily: "Arial Black, Helvetica Neue Bold, sans-serif",
            fontWeight: 900,
            fontSize: "20px",
            letterSpacing: "0.05em",
            color: "#1d4ed8",
          }}
        >
          LEONI
        </span>
      </div>

      {/* 5 stars — centered */}
      <div className="absolute left-1/2 top-[28%] flex -translate-x-1/2 items-center justify-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#2563eb"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      {/* "Stagiaire Externe" — italic serif, centered */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 whitespace-nowrap">
        <span
          style={{
            fontFamily: "Georgia, Times New Roman, serif",
            fontStyle: "italic",
            fontSize: "16px",
            color: "#1e40af",
          }}
        >
          Stagiaire Externe
        </span>
      </div>

      {/* Bottom section — two-column label/value */}
      <div
        className="absolute left-4 right-4 top-[52%] space-y-1.5"
        style={{ fontSize: "13px" }}
      >
        {[
          ["Matricule", matricule],
          ["Nom & prénom", name],
          ["Lieu de stage", department],
          ["Encadreur", supervisor],
          ["Début de stage", formatDateFR(startDate)],
          ["Fin de stage", formatDateFR(endDate)],
        ].map(([label, value]) => (
          <div key={label} className="flex gap-6">
            <span
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: 700,
                color: "#333333",
                minWidth: "140px",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: 400,
                color: "#333333",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeoniBadge;
