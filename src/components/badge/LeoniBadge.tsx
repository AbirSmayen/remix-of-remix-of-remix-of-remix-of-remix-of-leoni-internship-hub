/**
 * Reusable LEONI intern badge component — pixel-accurate replica of the physical badge.
 * Light blue-grey card with dark LEONI logo, 5 metallic stars, "Stagiaire Externe" title.
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
  new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const LeoniBadge = ({ matricule, name, department, supervisor, startDate, endDate }: LeoniBadgeProps) => {
  return (
    <div
      className="relative rounded-lg shadow-xl overflow-hidden w-full max-w-[480px]"
      style={{
        aspectRatio: "1.65 / 1",
        background: "linear-gradient(135deg, #dce6f0 0%, #e8eef5 40%, #dde5ed 100%)",
        border: "1px solid #bcc8d4",
      }}
    >
      {/* LEONI logo top-right */}
      <div className="absolute top-[8%] right-[6%]">
        <span
          className="text-[#2a2a2a] font-black tracking-[0.18em]"
          style={{ fontFamily: "Arial Black, Impact, sans-serif", fontSize: "clamp(18px, 4.5vw, 26px)" }}
        >
          LEONI
        </span>
      </div>

      {/* Photo placeholder – top-left, rounded grey chip */}
      <div className="absolute top-[7%] left-[5%]">
        <div
          className="bg-[#b8c4d0] rounded-[4px]"
          style={{ width: "clamp(45px, 12vw, 65px)", height: "clamp(28px, 7vw, 38px)" }}
        />
      </div>

      {/* 5 Stars – centered */}
      <div className="absolute top-[28%] left-1/2 -translate-x-1/2 flex items-center gap-[6px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} style={{ width: "clamp(16px, 4vw, 22px)", height: "clamp(16px, 4vw, 22px)" }} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="#6B6B6B"
              stroke="#4a4a4a"
              strokeWidth="0.6"
            />
          </svg>
        ))}
      </div>

      {/* "Stagiaire Externe" title */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span
          className="font-bold italic"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(13px, 3.5vw, 18px)",
            color: "#8B2500",
            letterSpacing: "0.04em",
          }}
        >
          Stagiaire Externe
        </span>
      </div>

      {/* Data fields */}
      <div className="absolute top-[54%] left-[5%] right-[5%] space-y-[3px]">
        {[
          ["Matricule", matricule],
          ["Nom & prénom", name],
          ["Lieu de stage", department],
          ["Encadreur", supervisor],
          ["Début de stage", formatDateFR(startDate)],
          ["Fin de stage", formatDateFR(endDate)],
        ].map(([label, value]) => (
          <div key={label} className="flex">
            <span
              className="font-bold shrink-0"
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "clamp(10px, 2.6vw, 14px)",
                color: "#2a2a2a",
                width: "clamp(100px, 30%, 160px)",
              }}
            >
              {label}
            </span>
            <span
              className="font-bold"
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "clamp(10px, 2.6vw, 14px)",
                color: "#2a2a2a",
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
